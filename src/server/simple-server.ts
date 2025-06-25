declare const process: {
  on(event: string, listener: (...args: any[]) => void): void;
  exit(code?: number): never;
};
declare const console: {
  log(...args: any[]): void;
  error(...args: any[]): void;
};

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { OPNsenseClient } from '@richard-stovall/opnsense-typescript-client';

import { coreTools, createCoreToolHandlers } from '../core/stub-tools.js';
import { createPluginToolHandlers, pluginTools } from '../plugins/stub-tools.js';

import type { CallToolRequest, CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { ServerConfig, ToolHandlers } from './types.js';

export class OPNsenseMcpServer {
  private server: Server;
  private client: OPNsenseClient | null = null;
  private config: ServerConfig;

  constructor(config: ServerConfig = {}) {
    this.config = config;

    this.server = new Server(
      {
        name: 'opnsense-mcp-server',
        version: '0.2.0',
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
    this.server.onerror = (error: unknown) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupInitialization(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools = this.config.plugins ? [...coreTools, ...pluginTools] : coreTools;
      return { tools };
    });
  }

  private setupToolHandlers(): void {
    const getClient = () => this.ensureClient();
    const coreHandlers = createCoreToolHandlers(getClient);
    const pluginHandlers = this.config.plugins ? createPluginToolHandlers(getClient) : {};

    const allHandlers: ToolHandlers = { ...coreHandlers, ...pluginHandlers };

    this.server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest): Promise<CallToolResult> => {
      const { name, arguments: args } = request.params;

      if (!(name in allHandlers)) {
        throw new Error(`Unknown tool: ${name}`);
      }

      try {
        const handler = allHandlers[name];
        if (!handler) {
          throw new Error(`Tool handler not found: ${name}`);
        }
        return await handler(args || {});
      } catch (error: unknown) {
        console.error(`Error executing tool ${name}:`, error);
        return {
          content: [
            {
              type: 'text' as const,
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

export { OPNsenseMcpServer as McpServer, OPNsenseMcpServer as OPNsenseServer };
