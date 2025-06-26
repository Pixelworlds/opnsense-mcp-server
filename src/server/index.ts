import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema, GetPromptRequestSchema, ListPromptsRequestSchema, ListResourcesRequestSchema,
    ListToolsRequestSchema, ReadResourceRequestSchema
} from '@modelcontextprotocol/sdk/types.js';
import { OPNsenseClient } from '@richard-stovall/opnsense-typescript-client';

import { getAvailableModules } from '../utils/plugin-checker.js';
import { generatePromptContent, generatePrompts } from '../utils/prompt-generator.js';
import { generateResources, handleResourceRead } from '../utils/resource-generator.js';
import { generateAllTools, generateToolHandler } from '../utils/tool-generator.js';

import type { ServerConfig, ServerContext } from '../types/index.js';
// Build config will be replaced by Rollup
const buildConfig = BUILD_CONFIG_PLACEHOLDER;

export class OPNsenseMCPServer {
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
          return {
            content: [{
              type: 'text',
              text: 'OPNsense connection configured successfully',
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

// Export for library usage
export { ServerConfig, ServerContext } from '../types/index.js';
