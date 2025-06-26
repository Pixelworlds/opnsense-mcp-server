import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema, GetPromptRequestSchema, ListPromptsRequestSchema, ListResourcesRequestSchema,
    ListToolsRequestSchema, ReadResourceRequestSchema
} from '@modelcontextprotocol/sdk/types.js';
import { OPNsenseClient } from '@richard-stovall/opnsense-typescript-client';
import { execSync } from 'child_process';
import { existsSync } from 'fs';

import { getAvailableModules } from '../utils/plugin-checker.js';
import { generatePromptContent, generatePrompts } from '../utils/prompt-generator.js';
import { generateResources, handleResourceRead } from '../utils/resource-generator.js';
import { generateAllTools, generateToolHandler } from '../utils/tool-generator.js';

import type { ServerConfig, ServerContext } from '../types/index.js';
// Build config will be replaced by Rollup
const buildConfig = BUILD_CONFIG_PLACEHOLDER;

class OPNsenseMCPServer {
  private server: Server;
  private context: ServerContext;

  constructor(initialConfig?: ServerConfig) {
    this.server = new Server(
      {
        name: '@richard-stovall/opnsense-mcp-server',
        version: '0.2.1',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
          prompts: {},
        },
      }
    );

    // Initialize context
    this.context = {
      client: undefined,
      config: initialConfig,
      availableModules: getAvailableModules(buildConfig),
      installedPlugins: new Set(),
    };

    // Initialize client if config provided
    if (initialConfig?.opnsense) {
      this.initializeClient(initialConfig.opnsense);
    }

    this.setupHandlers();
  }

  private initializeClient(config: ServerConfig['opnsense']) {
    this.context.client = new OPNsenseClient({
      baseUrl: config.url,
      apiKey: config.apiKey,
      apiSecret: config.apiSecret,
      verifySsl: config.verifySsl ?? true,
    });
  }

  private detectNodePath(): string {
    try {
      // First try to get the current Node.js executable path
      const currentNodePath = process.execPath;
      
      // Try to get the actual node path that would be used in a shell
      try {
        // Use 'which node' or 'where node' to find the Node.js binary
        const whichCommand = process.platform === 'win32' ? 'where node' : 'which node';
        const whichResult = execSync(whichCommand, { 
          encoding: 'utf8',
          timeout: 5000,
          stdio: ['ignore', 'pipe', 'ignore']
        }).trim();
        
        if (whichResult && whichResult !== currentNodePath) {
          // If 'which' gives us a different path, it might be a symlink or wrapper
          // Try to resolve the real path for version managers
          try {
            const realPath = execSync(`readlink -f "${whichResult}"`, {
              encoding: 'utf8',
              timeout: 5000,
              stdio: ['ignore', 'pipe', 'ignore']
            }).trim();
            
            if (realPath && realPath !== whichResult) {
              return realPath;
            }
          } catch {
            // readlink failed, use the which result
          }
          
          return whichResult;
        }
      } catch {
        // which/where command failed, continue with other methods
      }
      
      // For nvm users, try to get the nvm current version path
      if (process.env.NVM_DIR || process.env.NVM_BIN) {
        try {
          const nvmNodePath = execSync('nvm which current 2>/dev/null || echo ""', {
            encoding: 'utf8',
            timeout: 5000,
            shell: '/bin/bash',
            stdio: ['ignore', 'pipe', 'ignore']
          }).trim();
          
          if (nvmNodePath && nvmNodePath !== '') {
            return nvmNodePath;
          }
        } catch {
          // nvm command failed
        }
      }
      
      // For asdf users, try to get the asdf node path
      if (process.env.ASDF_DIR || process.env.ASDF_DATA_DIR) {
        try {
          const asdfNodePath = execSync('asdf which node 2>/dev/null || echo ""', {
            encoding: 'utf8',
            timeout: 5000,
            stdio: ['ignore', 'pipe', 'ignore']
          }).trim();
          
          if (asdfNodePath && asdfNodePath !== '') {
            return asdfNodePath;
          }
        } catch {
          // asdf command failed
        }
      }
      
      // Check common Node.js installation paths
      const commonPaths = [
        '/usr/local/bin/node',
        '/usr/bin/node',
        '/opt/homebrew/bin/node',
        `${process.env.HOME}/.local/bin/node`,
        `${process.env.HOME}/.asdf/shims/node`,
        `${process.env.HOME}/.nvm/current/bin/node`
      ];
      
      for (const path of commonPaths) {
        if (path && existsSync(path)) {
          return path;
        }
      }
      
      // Fall back to current process executable path
      return currentNodePath;
      
    } catch (error) {
      // If all detection methods fail, fall back to 'node'
      console.error('Node path detection failed:', error);
      return 'node';
    }
  }

  private setupHandlers() {
    // Tool handlers
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      if (!this.context.client) {
        // Return only configuration tool if not connected
        return {
          tools: [{
            name: 'configure_opnsense_connection',
            description: 'Configure the OPNsense API connection',
            inputSchema: {
              type: 'object',
              properties: {
                url: { type: 'string', description: 'OPNsense API URL' },
                apiKey: { type: 'string', description: 'API Key' },
                apiSecret: { type: 'string', description: 'API Secret' },
                verifySsl: { type: 'boolean', description: 'Verify SSL certificate' },
              },
              required: ['url', 'apiKey', 'apiSecret'],
            },
          }],
        };
      }

      // Generate all available tools
      const tools = generateAllTools(this.context.client, this.context);
      return { tools };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      // Handle configuration tool specially
      if (name === 'configure_opnsense_connection') {
        try {
          const { url, apiKey, apiSecret, verifySsl = true } = args as any;
          this.initializeClient({ url, apiKey, apiSecret, verifySsl });
          this.context.config = {
            opnsense: { url, apiKey, apiSecret, verifySsl },
          };
          
          // Detect actual Node.js path
          const nodePath = this.detectNodePath();
          
          // Return MCP server configuration JSON
          const mcpConfig = {
            mcpServers: {
              "opnsense": {
                command: nodePath,
                args: ["/Users/rstovall/Development/opnsense-mcp-server/dist/index.js"],
                env: {
                  OPNSENSE_URL: url,
                  OPNSENSE_API_KEY: apiKey,
                  OPNSENSE_API_SECRET: apiSecret,
                  OPNSENSE_VERIFY_SSL: verifySsl.toString()
                }
              }
            }
          };
          
          return {
            content: [{
              type: 'text',
              text: JSON.stringify(mcpConfig, null, 2),
            }],
          };
        } catch (error: any) {
          return {
            content: [{
              type: 'text',
              text: `Error configuring connection: ${error.message}`,
            }],
          };
        }
      }

      // Parse tool name to get module and method
      const parts = name.split('_');
      const isPlugin = parts[0] === 'plugin';
      const moduleName = parts[1] || '';
      const methodName = parts.slice(2).join('_');

      // Generate and execute handler
      const handler = generateToolHandler(moduleName, methodName, isPlugin, this.context);
      return handler(args);
    });

    // Resource handlers
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      if (!this.context.client) {
        return { resources: [] };
      }

      const resources = generateResources(this.context);
      return { resources };
    });

    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;
      return handleResourceRead(uri, this.context);
    });

    // Prompt handlers
    this.server.setRequestHandler(ListPromptsRequestSchema, async () => {
      if (!this.context.client) {
        return { prompts: [] };
      }

      const prompts = generatePrompts(this.context);
      return { prompts };
    });

    this.server.setRequestHandler(GetPromptRequestSchema, async (request) => {
      const { name, arguments: args = {} } = request.params;
      
      try {
        const content = generatePromptContent(name, args, this.context);
        return {
          messages: [{
            role: 'user',
            content: { type: 'text', text: content },
          }],
        };
      } catch (error: any) {
        throw new Error(`Failed to generate prompt: ${error.message}`);
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('OPNsense MCP Server running on stdio');
  }
}

// Parse command line arguments
function parseArgs(): Partial<ServerConfig['opnsense']> & { help?: boolean } {
  const args = process.argv.slice(2);
  const config: Partial<ServerConfig['opnsense']> & { help?: boolean } = {};

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--url':
      case '-u':
        config.url = args[++i];
        break;
      case '--api-key':
      case '-k':
        config.apiKey = args[++i];
        break;
      case '--api-secret':
      case '-s':
        config.apiSecret = args[++i];
        break;
      case '--no-verify-ssl':
        config.verifySsl = false;
        break;
      case '--help':
      case '-h':
        config.help = true;
        break;
    }
  }

  return config;
}

function showHelp() {
  console.log(`
OPNsense MCP Server

Usage: opnsense-mcp-server [options]

Options:
  -u, --url <url>           OPNsense API URL (e.g., https://192.168.1.1)
  -k, --api-key <key>       API Key for authentication
  -s, --api-secret <secret> API Secret for authentication
  --no-verify-ssl           Disable SSL certificate verification
  -h, --help                Show this help message

Environment Variables:
  OPNSENSE_URL              OPNsense API URL
  OPNSENSE_API_KEY          API Key
  OPNSENSE_API_SECRET       API Secret
  OPNSENSE_VERIFY_SSL       Set to 'false' to disable SSL verification

Examples:
  # Start with command line arguments
  opnsense-mcp-server --url https://192.168.1.1 --api-key mykey --api-secret mysecret

  # Start with environment variables
  export OPNSENSE_URL=https://192.168.1.1
  export OPNSENSE_API_KEY=mykey
  export OPNSENSE_API_SECRET=mysecret
  opnsense-mcp-server

  # Start without initial configuration (configure later via tools)
  opnsense-mcp-server
`);
}

async function main() {
  const args = parseArgs();

  if (args.help) {
    showHelp();
    process.exit(0);
  }

  // Build configuration from args and environment
  const config: Partial<ServerConfig> = {};

  // Check for OPNsense configuration
  const url = args.url || process.env.OPNSENSE_URL;
  const apiKey = args.apiKey || process.env.OPNSENSE_API_KEY;
  const apiSecret = args.apiSecret || process.env.OPNSENSE_API_SECRET;
  const verifySsl = args.verifySsl ?? (process.env.OPNSENSE_VERIFY_SSL !== 'false');

  if (url && apiKey && apiSecret) {
    config.opnsense = { url, apiKey, apiSecret, verifySsl };
  }

  // Create and run server
  const server = new OPNsenseMCPServer(config as ServerConfig);
  await server.run();
}

// Run if called directly (handle both CommonJS and ES modules)
const isMainModule = process.argv[1] && (
  process.argv[1].endsWith('index.js') || 
  process.argv[1].includes('dist/index.js')
);

if (isMainModule) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

// Export for library usage
export { OPNsenseMCPServer };
export type { ServerConfig, ServerContext } from '../types/index.js';
