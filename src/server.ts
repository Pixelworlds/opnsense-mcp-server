import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { OPNsenseClient } from '@richard-stovall/opnsense-typescript-client';

import type { CallToolRequest } from '@modelcontextprotocol/sdk/types.js';
import type { OPNsenseConfig } from '@richard-stovall/opnsense-typescript-client';

interface ServerConfig {
  host?: string;
  apiKey?: string;
  apiSecret?: string;
  verifySsl?: boolean;
  plugins?: boolean;
}

interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

// Plugin tools - conditionally added based on plugins flag
const pluginTools: ToolDefinition[] = [
  // WireGuard Plugin
  {
    name: 'wireguard_get_status',
    description: 'Get WireGuard plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'wireguard_get_config',
    description: 'Get WireGuard configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // Nginx Plugin
  {
    name: 'nginx_get_status',
    description: 'Get Nginx plugin status',
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

  // HAProxy Plugin
  {
    name: 'haproxy_get_status',
    description: 'Get HAProxy plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'haproxy_get_backends',
    description: 'Get HAProxy backends configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // Bind DNS Plugin
  {
    name: 'bind_get_status',
    description: 'Get Bind DNS plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'bind_get_zones',
    description: 'Get Bind DNS zones',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // Caddy Plugin
  {
    name: 'caddy_get_status',
    description: 'Get Caddy plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'caddy_get_config',
    description: 'Get Caddy configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // CrowdSec Plugin
  {
    name: 'crowdsec_get_status',
    description: 'Get CrowdSec plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'crowdsec_get_decisions',
    description: 'Get CrowdSec decisions',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // NetSNMP Plugin
  {
    name: 'netsnmp_get_status',
    description: 'Get NetSNMP plugin status',
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
    description: 'Get Netdata plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'netdata_get_config',
    description: 'Get Netdata configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];

const baseTools: ToolDefinition[] = [
  // System Module
  {
    name: 'get_system_status',
    description: 'Get OPNsense system status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // Firewall Rules
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
    name: 'firewall_add_rule',
    description: 'Add a new firewall rule',
    inputSchema: {
      type: 'object',
      properties: {
        enabled: { type: 'boolean', default: true },
        interface: { type: 'string', default: 'lan' },
        direction: { type: 'string', default: 'in' },
        ipprotocol: { type: 'string', default: 'inet' },
        protocol: { type: 'string', default: 'any' },
        source_net: { type: 'string', default: 'any' },
        destination_net: { type: 'string', default: 'any' },
        destination_port: { type: 'string', default: '' },
        action: { type: 'string', default: 'pass' },
        description: { type: 'string' },
      },
      required: ['description'],
    },
  },
  {
    name: 'firewall_delete_rule',
    description: 'Delete a firewall rule by UUID',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'firewall_toggle_rule',
    description: 'Enable or disable a firewall rule',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
        enabled: { type: 'boolean' },
      },
      required: ['uuid', 'enabled'],
    },
  },

  // Network Interfaces
  {
    name: 'get_interfaces',
    description: 'Get network interfaces',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // DHCP
  {
    name: 'get_dhcp_leases',
    description: 'Get DHCP leases',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // Firewall Aliases
  {
    name: 'get_firewall_aliases',
    description: 'Get firewall aliases',
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
    name: 'add_to_alias',
    description: 'Add an entry to a firewall alias',
    inputSchema: {
      type: 'object',
      properties: {
        alias_name: { type: 'string' },
        address: { type: 'string' },
      },
      required: ['alias_name', 'address'],
    },
  },
  {
    name: 'delete_from_alias',
    description: 'Delete an entry from a firewall alias',
    inputSchema: {
      type: 'object',
      properties: {
        alias_name: { type: 'string' },
        address: { type: 'string' },
      },
      required: ['alias_name', 'address'],
    },
  },

  // API Configuration
  {
    name: 'configure_opnsense_connection',
    description: 'Configure the OPNsense connection',
    inputSchema: {
      type: 'object',
      properties: {
        url: { type: 'string' },
        api_key: { type: 'string' },
        api_secret: { type: 'string' },
        verify_ssl: { type: 'boolean', default: true },
      },
      required: ['url', 'api_key', 'api_secret'],
    },
  },

  // Additional System Operations
  {
    name: 'get_firewall_logs',
    description: 'Get firewall log entries',
    inputSchema: {
      type: 'object',
      properties: {
        count: { type: 'integer', default: 100 },
        filter_text: { type: 'string', default: '' },
      },
    },
  },
  {
    name: 'restart_service',
    description: 'Restart an OPNsense service',
    inputSchema: {
      type: 'object',
      properties: {
        service_name: { type: 'string' },
      },
      required: ['service_name'],
    },
  },
  {
    name: 'backup_config',
    description: 'Create a backup of the OPNsense configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_system_routes',
    description: 'Get system routing table',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_system_health',
    description: 'Get system health metrics',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // Plugin Management
  {
    name: 'list_plugins',
    description: 'List installed plugins',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'install_plugin',
    description: 'Install a plugin',
    inputSchema: {
      type: 'object',
      properties: {
        plugin_name: { type: 'string' },
      },
      required: ['plugin_name'],
    },
  },

  // VPN
  {
    name: 'get_vpn_connections',
    description: 'Get VPN connection status',
    inputSchema: {
      type: 'object',
      properties: {
        vpn_type: { type: 'string', default: 'OpenVPN' },
      },
    },
  },

  // Security Audit
  {
    name: 'perform_firewall_audit',
    description: 'Performs a basic security audit of the OPNsense configuration.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // API Endpoints Discovery
  {
    name: 'get_api_endpoints',
    description: 'List available API endpoints from OPNsense',
    inputSchema: {
      type: 'object',
      properties: {
        module: { type: 'string' },
      },
    },
  },

  // Custom API Call
  {
    name: 'exec_api_call',
    description: 'Execute a custom API call to OPNsense',
    inputSchema: {
      type: 'object',
      properties: {
        method: { type: 'string' },
        endpoint: { type: 'string' },
        params: { type: 'string' },
        data: { type: 'string' },
      },
      required: ['method', 'endpoint'],
    },
  },
];

// Tool handlers mapping
const toolHandlers: Record<string, (args: any) => Promise<any>> = {};

export class McpServer {
  private server: Server;
  private opnsenseClient: OPNsenseClient | null = null;
  private config?: ServerConfig;
  private tools: ToolDefinition[];

  constructor(config?: ServerConfig) {
    this.config = config;

    // Conditionally include plugin tools based on plugins flag
    this.tools = config?.plugins ? [...baseTools, ...pluginTools] : baseTools;
    this.server = new Server(
      {
        name: 'OPNsense mcp server',
        version: '1.0.0',
        title: 'OPNsense MCP Server',
        description: 'A MCP server for OPNsense API operations',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Initialize client if config is provided
    if (config?.host && config?.apiKey && config?.apiSecret) {
      this.initializeClient({
        baseUrl: config.host,
        apiKey: config.apiKey,
        apiSecret: config.apiSecret,
        verifySsl: config.verifySsl ?? true,
      });
    }

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private initializeClient(config: OPNsenseConfig): OPNsenseClient {
    this.opnsenseClient = new OPNsenseClient(config);
    return this.opnsenseClient;
  }

  private ensureClient(): OPNsenseClient {
    if (!this.opnsenseClient) {
      throw new Error(
        'OPNsense client not configured. Please provide --host, --api-key, and --api-secret arguments or call configure_opnsense_connection tool.'
      );
    }
    return this.opnsenseClient;
  }

  private setupToolHandlers() {
    // Configure OPNsense connection
    toolHandlers.configure_opnsense_connection = async (args: any) => {
      const { url, api_key, api_secret, verify_ssl = true } = args;

      const config: OPNsenseConfig = {
        baseUrl: url,
        apiKey: api_key,
        apiSecret: api_secret,
        verifySsl: verify_ssl,
      };

      this.initializeClient(config);

      const pluginsStatus = this.config?.plugins ? 'enabled' : 'disabled';

      return {
        content: [
          {
            type: 'text',
            text: `OPNsense connection configured successfully. Plugins: ${pluginsStatus}`,
          },
        ],
      };
    };

    // System operations
    toolHandlers.get_system_status = async () => {
      const client = this.ensureClient();
      const response = await client.system.getStatus();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    };

    // Firewall rules
    toolHandlers.firewall_get_rules = async (args: any) => {
      const client = this.ensureClient();
      const { page = 1, rows_per_page = 20, search_phrase = '' } = args;

      const response = await client.firewall.rules.search({
        current: page,
        rowCount: rows_per_page,
        searchPhrase: search_phrase,
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    };

    toolHandlers.firewall_add_rule = async (args: any) => {
      const client = this.ensureClient();
      const response = await client.firewall.rules.add(args);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    };

    toolHandlers.firewall_delete_rule = async (args: any) => {
      const client = this.ensureClient();
      const { uuid } = args;
      const response = await client.firewall.rules.delete(uuid);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    };

    toolHandlers.firewall_toggle_rule = async (args: any) => {
      const client = this.ensureClient();
      const { uuid, enabled } = args;
      const response = await client.firewall.rules.toggle(uuid, enabled);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    };

    // Interfaces
    toolHandlers.get_interfaces = async () => {
      const client = this.ensureClient();
      const response = await client.interfaces.getInterfacesInfo();

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    };

    // DHCP
    toolHandlers.get_dhcp_leases = async () => {
      const client = this.ensureClient();
      const response = await client.diagnostics.getActivity();

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    };

    // Firewall aliases
    toolHandlers.get_firewall_aliases = async (args: any) => {
      const client = this.ensureClient();
      const { page = 1, rows_per_page = 20, search_phrase = '' } = args;

      const response = await client.firewall.aliases.search({
        current: page,
        rowCount: rows_per_page,
        searchPhrase: search_phrase,
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    };

    toolHandlers.add_to_alias = async (args: any) => {
      const client = this.ensureClient();
      const { alias_name, address } = args;
      const response = await client.firewall.aliasUtils.add(alias_name, { address });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    };

    toolHandlers.delete_from_alias = async (args: any) => {
      const client = this.ensureClient();
      const { alias_name, address } = args;
      const response = await client.firewall.aliasUtils.delete(alias_name, { address });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    };

    // System logs and monitoring
    toolHandlers.get_firewall_logs = async (args: any) => {
      const client = this.ensureClient();
      const { count = 100, filter_text = '' } = args;

      try {
        // Using diagnostics module for log access
        const response = await client.diagnostics.getActivity();

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching firewall logs: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    // Service management
    toolHandlers.restart_service = async (args: any) => {
      const client = this.ensureClient();
      const { service_name } = args;

      try {
        const response = await client.service.restart(service_name);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error restarting service ${service_name}: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
            },
          ],
        };
      }
    };

    // Backup operations
    toolHandlers.backup_config = async () => {
      const client = this.ensureClient();

      try {
        const response = await client.backup.getProviders();

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error creating backup: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    // System information
    toolHandlers.get_system_routes = async () => {
      const client = this.ensureClient();

      try {
        const response = await client.diagnostics.getActivity();

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching system routes: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.get_system_health = async () => {
      const client = this.ensureClient();

      try {
        const response = await client.diagnostics.getSystemInformation();

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching system health: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    // Plugin management
    toolHandlers.list_plugins = async () => {
      const client = this.ensureClient();

      try {
        const response = await client.firmware.getInfo();

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error listing plugins: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.install_plugin = async (args: any) => {
      const client = this.ensureClient();
      const { plugin_name } = args;

      try {
        const response = await client.firmware.installPackage(plugin_name);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error installing plugin ${plugin_name}: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
            },
          ],
        };
      }
    };

    // VPN operations
    toolHandlers.get_vpn_connections = async (args: any) => {
      const client = this.ensureClient();
      const { vpn_type = 'OpenVPN' } = args;

      try {
        if (vpn_type === 'OpenVPN') {
          const response = await client.openVPN.getInstances();
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(response.data, null, 2),
              },
            ],
          };
        } else if (vpn_type === 'IPsec') {
          const response = await client.ipsec.getStatus();
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(response.data, null, 2),
              },
            ],
          };
        } else {
          return {
            content: [
              {
                type: 'text',
                text: `Unsupported VPN type: ${vpn_type}. Supported types: OpenVPN, IPsec`,
              },
            ],
          };
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching VPN connections: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    // Security audit
    toolHandlers.perform_firewall_audit = async () => {
      const client = this.ensureClient();

      try {
        const [rulesResponse, aliasesResponse, systemResponse] = await Promise.all([
          client.firewall.rules.search({ rowCount: 100 }),
          client.firewall.aliases.search({ rowCount: 100 }),
          client.system.getStatus(),
        ]);

        const audit = {
          timestamp: new Date().toISOString(),
          firewall_rules_count: rulesResponse.data?.rows?.length || 0,
          aliases_count: aliasesResponse.data?.rows?.length || 0,
          system_status: systemResponse.data,
          recommendations: [
            'Review firewall rules for unused or overly permissive rules',
            'Ensure default deny policies are in place',
            'Check for proper logging configuration',
            'Verify alias definitions are current and necessary',
          ],
        };

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(audit, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error performing firewall audit: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    // API discovery
    toolHandlers.get_api_endpoints = async (args: any) => {
      const { module } = args;

      const endpoints = {
        system: ['getStatus', 'reboot', 'halt'],
        firewall: ['rules.search', 'rules.add', 'rules.delete', 'aliases.search', 'apply'],
        interfaces: ['getInterfacesInfo', 'getInterface', 'reloadInterface'],
        diagnostics: ['getSystemInformation', 'getActivity', 'getMemory'],
        service: ['searchServices', 'start', 'stop', 'restart'],
        firmware: ['getInfo', 'checkUpdates', 'installPackage'],
        openVPN: ['getInstances', 'searchSessions'],
        ipsec: ['getStatus', 'searchConnections'],
        backup: ['getProviders', 'getBackups'],
      };

      const result = module ? { [module]: endpoints[module as keyof typeof endpoints] || [] } : endpoints;

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    };

    // Custom API call
    toolHandlers.exec_api_call = async (args: any) => {
      const client = this.ensureClient();
      const { method, endpoint, params, data } = args;

      try {
        let parsedParams;
        let parsedData;

        if (params) {
          try {
            parsedParams = JSON.parse(params);
          } catch {
            parsedParams = {};
          }
        }

        if (data) {
          try {
            parsedData = JSON.parse(data);
          } catch {
            parsedData = data;
          }
        }

        // Use the HTTP client directly for custom calls
        const response = await (client as any).http.request({
          path: endpoint,
          method: method.toUpperCase(),
          params: parsedParams,
          data: parsedData,
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error executing API call ${method} ${endpoint}: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
            },
          ],
        };
      }
    };

    // Plugin handlers - only register if plugins are enabled
    if (this.config?.plugins) {
      this.setupPluginHandlers();
    }

    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: this.tools,
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
      const { name, arguments: args } = request.params;

      const handler = toolHandlers[name as keyof typeof toolHandlers];
      if (!handler) {
        throw new Error(`Unknown tool: ${name}`);
      }

      return await handler(args as any);
    });
  }

  private setupPluginHandlers() {
    // WireGuard Plugin Handlers
    toolHandlers.wireguard_get_status = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.wireGuard.getStatus();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error getting WireGuard status: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.wireguard_get_config = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.wireGuard.getGeneral();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error getting WireGuard config: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    // Nginx Plugin Handlers
    toolHandlers.nginx_get_status = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.nginx.getStatus();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error getting Nginx status: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.nginx_get_upstreams = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.nginx.searchUpstreams();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error getting Nginx upstreams: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    // HAProxy Plugin Handlers
    toolHandlers.haproxy_get_status = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.haproxy.getStatus();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error getting HAProxy status: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.haproxy_get_backends = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.haproxy.searchBackends();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error getting HAProxy backends: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    // Bind DNS Plugin Handlers
    toolHandlers.bind_get_status = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.bind.getStatus();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error getting Bind status: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.bind_get_zones = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.bind.getDomains();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error getting Bind zones: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    // Caddy Plugin Handlers
    toolHandlers.caddy_get_status = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.caddy.getStatus();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error getting Caddy status: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.caddy_get_config = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.caddy.getGeneral();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error getting Caddy config: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    // CrowdSec Plugin Handlers
    toolHandlers.crowdsec_get_status = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.crowdsec.getStatus();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error getting CrowdSec status: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.crowdsec_get_decisions = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.crowdsec.getDecisions();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error getting CrowdSec decisions: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    // NetSNMP Plugin Handlers
    toolHandlers.netsnmp_get_status = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.netsnmp.getStatus();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error getting NetSNMP status: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.netsnmp_get_config = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.netsnmp.getGeneral();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error getting NetSNMP config: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    // Netdata Plugin Handlers
    toolHandlers.netdata_get_status = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.netdata.getStatus();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error getting Netdata status: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.netdata_get_config = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.netdata.getGeneral();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error getting Netdata config: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };
  }

  private setupErrorHandling() {
    this.server.onerror = error => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('MCP server running on stdio');
  }
}
