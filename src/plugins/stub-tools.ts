import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { OPNsenseClient } from '@richard-stovall/opnsense-typescript-client';
import type { ToolDefinition, ToolHandlers } from '../server/types.js';

export const pluginTools: ToolDefinition[] = [
  {
    name: 'wireguard_get_status',
    description: 'Get WireGuard plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'nginx_get_status',
    description: 'Get Nginx plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];

function createPluginNotAvailableHandler(pluginName: string): () => Promise<CallToolResult> {
  return async (): Promise<CallToolResult> => {
    return {
      content: [
        {
          type: 'text',
          text: `Plugin "${pluginName}" is not installed or not available. Install the plugin first to use this functionality.`,
        },
      ],
    };
  };
}

export function createPluginToolHandlers(clientOrGetter: OPNsenseClient | (() => OPNsenseClient)): ToolHandlers {
  return {
    wireguard_get_status: async (): Promise<CallToolResult> => {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ enabled: false, running: false }, null, 2),
          },
        ],
      };
    },

    nginx_get_status: async (): Promise<CallToolResult> => {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ enabled: false, running: false }, null, 2),
          },
        ],
      };
    },

    acme_get_certificates: createPluginNotAvailableHandler('acme'),
    collectd_get_metrics: createPluginNotAvailableHandler('collectd'),
    freeradius_get_clients: createPluginNotAvailableHandler('freeradius'),
    iperf_run_test: createPluginNotAvailableHandler('iperf'),
    maltrail_get_events: createPluginNotAvailableHandler('maltrail'),
    openvpn_export_get_servers: createPluginNotAvailableHandler('openvpn-export'),
    postfix_get_status: createPluginNotAvailableHandler('postfix'),
    redis_get_info: createPluginNotAvailableHandler('redis'),
    rsyslog_get_logs: createPluginNotAvailableHandler('rsyslog'),
    zabbix_get_hosts: createPluginNotAvailableHandler('zabbix'),
  };
}

export const pluginToolHandlers = createPluginToolHandlers;
