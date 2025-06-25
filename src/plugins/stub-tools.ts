/**
 * Stub Plugin OPNsense Tool Handlers - Simplified for type checking
 * These are placeholder implementations that return mock data
 */

import type { ToolDefinition, ToolHandlers } from '../server/types.js';
import type { OPNsenseClient } from '@richard-stovall/opnsense-typescript-client';

// Simplified plugin tools for type checking
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

// Helper function to create "plugin not available" handler
function createPluginNotAvailableHandler(pluginName: string) {
  return async () => {
    return {
      content: [
        {
          type: 'text' as const,
          text: `Plugin "${pluginName}" is not installed or not available. Install the plugin first to use this functionality.`,
        },
      ],
    };
  };
}

// Plugin tool handlers factory function with stub implementations
export function createPluginToolHandlers(clientOrGetter: OPNsenseClient | (() => OPNsenseClient)): ToolHandlers {
  return {
    wireguard_get_status: async () => {
      return {
        content: [{ 
          type: 'text' as const, 
          text: JSON.stringify({ enabled: false, running: false }, null, 2) 
        }],
      };
    },

    nginx_get_status: async () => {
      return {
        content: [{ 
          type: 'text' as const, 
          text: JSON.stringify({ enabled: false, running: false }, null, 2) 
        }],
      };
    },

    // Stub handlers for plugins that may not be installed
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

// Export for convenience
export const pluginToolHandlers = createPluginToolHandlers;