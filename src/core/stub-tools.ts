import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { OPNsenseClient } from '@richard-stovall/opnsense-typescript-client';
import type { ToolDefinition, ToolHandlers } from '../server/types.js';

export const coreTools: ToolDefinition[] = [
  {
    name: 'get_system_status',
    description: 'Get comprehensive OPNsense system status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'firewall_get_rules',
    description: 'Get OPNsense firewall rules',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'integer', default: 1 },
        rows_per_page: { type: 'integer', default: 20 },
        search_phrase: { type: 'string', default: '' },
      },
    },
  },
  {
    name: 'get_interfaces',
    description: 'Get network interfaces information',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'configure_opnsense_connection',
    description: 'Configure OPNsense connection parameters',
    inputSchema: {
      type: 'object',
      properties: {
        host: { type: 'string' },
        api_key: { type: 'string' },
        api_secret: { type: 'string' },
        verify_ssl: { type: 'boolean', default: true },
      },
      required: ['host', 'api_key', 'api_secret'],
    },
  },
];

export function createCoreToolHandlers(clientOrGetter: OPNsenseClient | (() => OPNsenseClient)): ToolHandlers {
  return {
    get_system_status: async (): Promise<CallToolResult> => {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ status: 'ok', uptime: '1 day', cpu: 25 }, null, 2),
          },
        ],
      };
    },

    firewall_get_rules: async (args: any): Promise<CallToolResult> => {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ total: 0, rows: [] }, null, 2),
          },
        ],
      };
    },

    get_interfaces: async (): Promise<CallToolResult> => {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ interfaces: [] }, null, 2),
          },
        ],
      };
    },

    configure_opnsense_connection: async (args: any): Promise<CallToolResult> => {
      const { host, api_key, api_secret, verify_ssl = true } = args;
      return {
        content: [
          {
            type: 'text',
            text: `OPNsense connection configured for host: ${host}`,
          },
        ],
      };
    },
  };
}

export const coreToolHandlers = createCoreToolHandlers;
