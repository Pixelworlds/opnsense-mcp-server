/**
 * Simplified OPNsense MCP Server using modular architecture
 * This demonstrates the new organized structure
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { OPNsenseClient } from '@richard-stovall/opnsense-typescript-client';

import { coreTools, createCoreToolHandlers } from '../core/stub-tools.js';
import { createPluginToolHandlers, pluginTools } from '../plugins/stub-tools.js';

import type { CallToolRequest } from '@modelcontextprotocol/sdk/types.js';
import type { ServerConfig } from './types.js';

export class OPNsenseServer {
  private server: Server;
  private client: OPNsenseClient | null = null;
  private config: ServerConfig;

  constructor(config: ServerConfig = {}) {
    this.config = config;

    this.server = new Server(
      {
        name: 'opnsense-mcp-server',
        version: '0.1.2',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
          prompts: {},
        },
      }
    );

    this.setupErrorHandling();
    this.setupToolHandlers();
    this.setupInitialization();
  }

  private setupErrorHandling(): void {
    this.server.onerror = error => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupInitialization(): void {
    // Use the comprehensive initialization response
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools = this.config.plugins ? [...coreTools, ...pluginTools] : coreTools;
      return { tools };
    });
  }

  private setupToolHandlers(): void {
    // Create handlers using modular approach - pass a client getter function
    const getClient = () => this.ensureClient();
    const coreHandlers = createCoreToolHandlers(getClient);
    const pluginHandlers = this.config.plugins ? createPluginToolHandlers(getClient) : {};

    const allHandlers = { ...coreHandlers, ...pluginHandlers };

    this.server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
      const { name, arguments: args } = request.params;

      if (!(name in allHandlers)) {
        throw new Error(`Unknown tool: ${name}`);
      }

      try {
        return await allHandlers[name]!(args || {});
      } catch (error) {
        console.error(`Error executing tool ${name}:`, error);
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    });
  }

  private ensureClient(): OPNsenseClient {
    if (!this.client && this.config.host && this.config.apiKey && this.config.apiSecret) {
      this.client = new OPNsenseClient({
        baseUrl: this.config.host,
        apiKey: this.config.apiKey,
        apiSecret: this.config.apiSecret,
        verifySsl: this.config.verifySsl ?? true,
      });
    }

    if (!this.client) {
      throw new Error('OPNsense client not configured. Use configure_opnsense_connection tool first.');
    }

    return this.client;
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('OPNsense MCP server running on stdio');
  }
}

// For backward compatibility, export as McpServer as well
export { OPNsenseServer as McpServer };
