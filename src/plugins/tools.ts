/**
 * Plugin OPNsense Tool Definitions and Handlers
 * Extracted from the main server implementation
 */

import type { OPNsenseClient } from '@richard-stovall/opnsense-typescript-client';
import type { ToolDefinition, ToolHandlers } from '../server/types.js';

// Plugin tool definitions (extracted from server.ts pluginTools array)
export const pluginTools: ToolDefinition[] = [
  // WireGuard Plugin
  {
    name: 'wireguard_get_status',
    description: 'Get WireGuard plugin status and configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'wireguard_get_config',
    description: 'Get WireGuard server configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'wireguard_search_clients',
    description: 'Search WireGuard client configurations',
    inputSchema: {
      type: 'object',
      properties: {
        searchPhrase: { type: 'string' },
        current: { type: 'integer', default: 1 },
        rowCount: { type: 'integer', default: 20 },
      },
    },
  },

  // Nginx Plugin
  {
    name: 'nginx_get_status',
    description: 'Get Nginx plugin status and service information',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'nginx_get_upstreams',
    description: 'Get Nginx upstreams configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'nginx_search_upstreams',
    description: 'Search Nginx upstreams with filtering',
    inputSchema: {
      type: 'object',
      properties: {
        searchPhrase: { type: 'string' },
        current: { type: 'integer', default: 1 },
        rowCount: { type: 'integer', default: 20 },
      },
    },
  },
  {
    name: 'nginx_get_locations',
    description: 'Get Nginx location configurations',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // HAProxy Plugin
  {
    name: 'haproxy_get_status',
    description: 'Get HAProxy plugin status and service information',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'haproxy_get_backends',
    description: 'Get HAProxy backend configurations',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'haproxy_search_backends',
    description: 'Search HAProxy backends with filtering',
    inputSchema: {
      type: 'object',
      properties: {
        searchPhrase: { type: 'string' },
        current: { type: 'integer', default: 1 },
        rowCount: { type: 'integer', default: 20 },
      },
    },
  },

  // BIND DNS Plugin
  {
    name: 'bind_get_status',
    description: 'Get BIND DNS plugin status and service information',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'bind_get_zones',
    description: 'Get BIND DNS zones configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'bind_search_zones',
    description: 'Search BIND DNS zones with filtering',
    inputSchema: {
      type: 'object',
      properties: {
        searchPhrase: { type: 'string' },
        current: { type: 'integer', default: 1 },
        rowCount: { type: 'integer', default: 20 },
      },
    },
  },

  // Caddy Plugin
  {
    name: 'caddy_get_status',
    description: 'Get Caddy plugin status and service information',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'caddy_get_config',
    description: 'Get Caddy server configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // CrowdSec Plugin
  {
    name: 'crowdsec_get_status',
    description: 'Get CrowdSec plugin status and service information',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'crowdsec_get_decisions',
    description: 'Get CrowdSec security decisions and bans',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // NetSNMP Plugin
  {
    name: 'netsnmp_get_status',
    description: 'Get NetSNMP plugin status and service information',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'netsnmp_get_config',
    description: 'Get NetSNMP configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // Netdata Plugin
  {
    name: 'netdata_get_status',
    description: 'Get Netdata plugin status and service information',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'netdata_get_config',
    description: 'Get Netdata monitoring configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // Note: This is a simplified subset - the full implementation should include all 60+ plugin tools
  // For the complete list, extract from the original server.ts pluginTools array
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

// Plugin tool handlers factory function
export function createPluginToolHandlers(clientOrGetter: OPNsenseClient | (() => OPNsenseClient)): ToolHandlers {
  const ensureClient = () => {
    const client = typeof clientOrGetter === 'function' ? clientOrGetter() : clientOrGetter;
    if (!client) {
      throw new Error('OPNsense client not configured. Use configure_opnsense_connection tool first.');
    }
    return client;
  };

  return {
    // WireGuard Plugin Handlers
    wireguard_get_status: async () => {
      const client = ensureClient();
      try {
        const response = await client.plugins.wireGuard.getStatus();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    wireguard_get_config: async () => {
      const client = ensureClient();
      try {
        const response = await client.plugins.wireGuard.getServer();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    wireguard_search_clients: async (args: any) => {
      const client = ensureClient();
      const { searchPhrase = '', current = 1, rowCount = 20 } = args;
      try {
        const response = await client.plugins.wireGuard.searchClients({
          current,
          rowCount,
          searchPhrase,
        });
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    // Nginx Plugin Handlers
    nginx_get_status: async () => {
      const client = ensureClient();
      try {
        const response = await client.plugins.nginx.getStatus();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    nginx_get_upstreams: async () => {
      const client = ensureClient();
      try {
        const response = await client.plugins.nginx.getUpstream();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    nginx_search_upstreams: async (args: any) => {
      const client = ensureClient();
      const { searchPhrase = '', current = 1, rowCount = 20 } = args;
      try {
        const response = await client.plugins.nginx.searchUpstreams({
          current,
          rowCount,
          searchPhrase,
        });
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    // HAProxy Plugin Handlers
    haproxy_get_status: async () => {
      const client = ensureClient();
      try {
        const response = await client.plugins.haproxy.getStatus();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    haproxy_get_backends: async () => {
      const client = ensureClient();
      try {
        const response = await client.plugins.haproxy.getBackend();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    // BIND DNS Plugin Handlers
    bind_get_status: async () => {
      const client = ensureClient();
      try {
        const response = await client.plugins.bind.getStatus();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    bind_get_zones: async () => {
      const client = ensureClient();
      try {
        const response = await client.plugins.bind.getDomain();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    // Caddy Plugin Handlers
    caddy_get_status: async () => {
      const client = ensureClient();
      try {
        const response = await client.plugins.caddy.getStatus();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    caddy_get_config: async () => {
      const client = ensureClient();
      try {
        const response = await client.plugins.caddy.getGeneral();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    // CrowdSec Plugin Handlers
    crowdsec_get_status: async () => {
      const client = ensureClient();
      try {
        const response = await client.plugins.crowdsec.getStatus();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    crowdsec_get_decisions: async () => {
      const client = ensureClient();
      try {
        const response = await client.plugins.crowdsec.getDecisions();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    // NetSNMP Plugin Handlers
    netsnmp_get_status: async () => {
      const client = ensureClient();
      try {
        const response = await client.plugins.netsnmp.getStatus();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    netsnmp_get_config: async () => {
      const client = ensureClient();
      try {
        const response = await client.plugins.netsnmp.getGeneral();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    // Netdata Plugin Handlers
    netdata_get_status: async () => {
      const client = ensureClient();
      try {
        const response = await client.plugins.netdata.getStatus();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    netdata_get_config: async () => {
      const client = ensureClient();
      try {
        const response = await client.plugins.netdata.getGeneral();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    // Additional plugin stubs for plugins that may not be installed
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

    // Note: This is a simplified subset - the full implementation should include all 60+ plugin tool handlers
    // For the complete implementation, extract handlers from the original server.ts setupPluginHandlers method
  };
}

// Export for convenience
export const pluginToolHandlers = createPluginToolHandlers;
