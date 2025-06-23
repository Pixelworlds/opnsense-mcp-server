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

  // Extended System Operations
  {
    name: 'system_reboot',
    description: 'Reboot the OPNsense system',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'system_halt',
    description: 'Halt the OPNsense system',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'dismiss_system_status',
    description: 'Dismiss system status notifications',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // Firmware Management
  {
    name: 'firmware_get_info',
    description: 'Get firmware information',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'firmware_check_updates',
    description: 'Check for firmware updates',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'firmware_update',
    description: 'Update firmware',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'firmware_upgrade',
    description: 'Upgrade firmware',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'firmware_audit',
    description: 'Run firmware security audit',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'firmware_get_changelog',
    description: 'Get firmware changelog for version',
    inputSchema: {
      type: 'object',
      properties: {
        version: { type: 'string' },
      },
      required: ['version'],
    },
  },
  {
    name: 'package_remove',
    description: 'Remove a package',
    inputSchema: {
      type: 'object',
      properties: {
        package_name: { type: 'string' },
      },
      required: ['package_name'],
    },
  },
  {
    name: 'package_reinstall',
    description: 'Reinstall a package',
    inputSchema: {
      type: 'object',
      properties: {
        package_name: { type: 'string' },
      },
      required: ['package_name'],
    },
  },
  {
    name: 'package_lock',
    description: 'Lock a package to prevent updates',
    inputSchema: {
      type: 'object',
      properties: {
        package_name: { type: 'string' },
      },
      required: ['package_name'],
    },
  },
  {
    name: 'package_unlock',
    description: 'Unlock a package to allow updates',
    inputSchema: {
      type: 'object',
      properties: {
        package_name: { type: 'string' },
      },
      required: ['package_name'],
    },
  },
  {
    name: 'package_get_details',
    description: 'Get detailed information about a package',
    inputSchema: {
      type: 'object',
      properties: {
        package_name: { type: 'string' },
      },
      required: ['package_name'],
    },
  },

  // Advanced Firewall Operations
  {
    name: 'firewall_apply',
    description: 'Apply firewall configuration changes',
    inputSchema: {
      type: 'object',
      properties: {
        rollback_revision: { type: 'string' },
      },
    },
  },
  {
    name: 'firewall_savepoint',
    description: 'Create a firewall configuration savepoint',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'firewall_revert',
    description: 'Revert firewall to a previous revision',
    inputSchema: {
      type: 'object',
      properties: {
        revision: { type: 'string' },
      },
      required: ['revision'],
    },
  },
  {
    name: 'get_firewall_rule_stats',
    description: 'Get firewall rule statistics',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'firewall_move_rule',
    description: 'Move a firewall rule before another rule',
    inputSchema: {
      type: 'object',
      properties: {
        selected_uuid: { type: 'string' },
        target_uuid: { type: 'string' },
      },
      required: ['selected_uuid', 'target_uuid'],
    },
  },
  {
    name: 'get_firewall_rule',
    description: 'Get a specific firewall rule by UUID',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'update_firewall_rule',
    description: 'Update an existing firewall rule',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
        rule: { type: 'object' },
      },
      required: ['uuid', 'rule'],
    },
  },

  // Enhanced Alias Management
  {
    name: 'get_firewall_alias',
    description: 'Get a specific firewall alias by UUID',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'add_firewall_alias',
    description: 'Add a new firewall alias',
    inputSchema: {
      type: 'object',
      properties: {
        alias: { type: 'object' },
      },
      required: ['alias'],
    },
  },
  {
    name: 'update_firewall_alias',
    description: 'Update an existing firewall alias',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
        alias: { type: 'object' },
      },
      required: ['uuid', 'alias'],
    },
  },
  {
    name: 'delete_firewall_alias',
    description: 'Delete a firewall alias by UUID',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'toggle_firewall_alias',
    description: 'Enable or disable a firewall alias',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
        enabled: { type: 'boolean' },
      },
      required: ['uuid', 'enabled'],
    },
  },
  {
    name: 'export_firewall_aliases',
    description: 'Export firewall aliases configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'import_firewall_aliases',
    description: 'Import firewall aliases configuration',
    inputSchema: {
      type: 'object',
      properties: {
        data: { type: 'string' },
      },
      required: ['data'],
    },
  },
  {
    name: 'get_alias_table_size',
    description: 'Get the size of alias tables',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'list_alias_contents',
    description: 'List contents of a specific alias',
    inputSchema: {
      type: 'object',
      properties: {
        alias_name: { type: 'string' },
      },
      required: ['alias_name'],
    },
  },
  {
    name: 'flush_alias',
    description: 'Flush all entries from an alias',
    inputSchema: {
      type: 'object',
      properties: {
        alias_name: { type: 'string' },
      },
      required: ['alias_name'],
    },
  },

  // Enhanced Diagnostics
  {
    name: 'get_memory_usage',
    description: 'Get detailed memory usage information',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_disk_usage',
    description: 'Get disk usage information',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_system_temperature',
    description: 'Get system temperature readings',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_cpu_usage',
    description: 'Get CPU usage information',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_arp_table',
    description: 'Get ARP table entries',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'search_arp_table',
    description: 'Search ARP table entries',
    inputSchema: {
      type: 'object',
      properties: {
        search_params: { type: 'object' },
      },
    },
  },
  {
    name: 'flush_arp_table',
    description: 'Flush the ARP table',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_pf_states',
    description: 'Get packet filter states',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'query_pf_states',
    description: 'Query packet filter states with parameters',
    inputSchema: {
      type: 'object',
      properties: {
        params: { type: 'object' },
      },
    },
  },
  {
    name: 'flush_firewall_states',
    description: 'Flush firewall states',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'kill_firewall_states',
    description: 'Kill specific firewall states',
    inputSchema: {
      type: 'object',
      properties: {
        params: { type: 'object' },
      },
      required: ['params'],
    },
  },
  {
    name: 'dns_lookup',
    description: 'Perform DNS lookup',
    inputSchema: {
      type: 'object',
      properties: {
        hostname: { type: 'string' },
        record_type: { type: 'string', default: 'A' },
      },
      required: ['hostname'],
    },
  },

  // Service Management
  {
    name: 'search_services',
    description: 'Search for system services',
    inputSchema: {
      type: 'object',
      properties: {
        search_params: { type: 'object' },
      },
    },
  },
  {
    name: 'start_service',
    description: 'Start a system service',
    inputSchema: {
      type: 'object',
      properties: {
        service_name: { type: 'string' },
        service_id: { type: 'string' },
      },
      required: ['service_name'],
    },
  },
  {
    name: 'stop_service',
    description: 'Stop a system service',
    inputSchema: {
      type: 'object',
      properties: {
        service_name: { type: 'string' },
        service_id: { type: 'string' },
      },
      required: ['service_name'],
    },
  },

  // Interface Management
  {
    name: 'get_interface_details',
    description: 'Get detailed information about a specific interface',
    inputSchema: {
      type: 'object',
      properties: {
        interface_name: { type: 'string' },
      },
      required: ['interface_name'],
    },
  },
  {
    name: 'reload_interface',
    description: 'Reload a network interface',
    inputSchema: {
      type: 'object',
      properties: {
        interface_name: { type: 'string' },
      },
      required: ['interface_name'],
    },
  },
  {
    name: 'get_interface_statistics',
    description: 'Get network interface statistics',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // VLAN Management
  {
    name: 'search_vlans',
    description: 'Search VLAN configurations',
    inputSchema: {
      type: 'object',
      properties: {
        search_params: { type: 'object' },
      },
    },
  },
  {
    name: 'add_vlan',
    description: 'Add a new VLAN configuration',
    inputSchema: {
      type: 'object',
      properties: {
        vlan: { type: 'object' },
      },
      required: ['vlan'],
    },
  },
  {
    name: 'get_vlan',
    description: 'Get VLAN configuration by UUID',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'update_vlan',
    description: 'Update VLAN configuration',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
        vlan: { type: 'object' },
      },
      required: ['uuid', 'vlan'],
    },
  },
  {
    name: 'delete_vlan',
    description: 'Delete VLAN configuration',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'reconfigure_vlans',
    description: 'Reconfigure all VLANs',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // Authentication & User Management
  {
    name: 'search_users',
    description: 'Search system users',
    inputSchema: {
      type: 'object',
      properties: {
        search_params: { type: 'object' },
      },
    },
  },
  {
    name: 'add_user',
    description: 'Add a new system user',
    inputSchema: {
      type: 'object',
      properties: {
        user: { type: 'object' },
      },
      required: ['user'],
    },
  },
  {
    name: 'get_user',
    description: 'Get user details by UUID',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'update_user',
    description: 'Update user information',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
        user: { type: 'object' },
      },
      required: ['uuid', 'user'],
    },
  },
  {
    name: 'delete_user',
    description: 'Delete a system user',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'add_api_key',
    description: 'Add API key for a user',
    inputSchema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
      },
      required: ['username'],
    },
  },
  {
    name: 'delete_api_key',
    description: 'Delete an API key',
    inputSchema: {
      type: 'object',
      properties: {
        key_id: { type: 'string' },
      },
      required: ['key_id'],
    },
  },
  {
    name: 'search_api_keys',
    description: 'Search API keys',
    inputSchema: {
      type: 'object',
      properties: {
        search_params: { type: 'object' },
      },
    },
  },

  // Group Management
  {
    name: 'search_groups',
    description: 'Search user groups',
    inputSchema: {
      type: 'object',
      properties: {
        search_params: { type: 'object' },
      },
    },
  },
  {
    name: 'add_group',
    description: 'Add a new user group',
    inputSchema: {
      type: 'object',
      properties: {
        group: { type: 'object' },
      },
      required: ['group'],
    },
  },
  {
    name: 'get_group',
    description: 'Get group details by UUID',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'update_group',
    description: 'Update group information',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
        group: { type: 'object' },
      },
      required: ['uuid', 'group'],
    },
  },
  {
    name: 'delete_group',
    description: 'Delete a user group',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
      },
      required: ['uuid'],
    },
  },

  // Certificate Management
  {
    name: 'search_certificates',
    description: 'Search certificates',
    inputSchema: {
      type: 'object',
      properties: {
        search_params: { type: 'object' },
      },
    },
  },
  {
    name: 'add_certificate',
    description: 'Add a new certificate',
    inputSchema: {
      type: 'object',
      properties: {
        certificate: { type: 'object' },
      },
      required: ['certificate'],
    },
  },
  {
    name: 'get_certificate',
    description: 'Get certificate by UUID',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'delete_certificate',
    description: 'Delete a certificate',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
      },
      required: ['uuid'],
    },
  },

  // Certificate Authority Management
  {
    name: 'search_certificate_authorities',
    description: 'Search certificate authorities',
    inputSchema: {
      type: 'object',
      properties: {
        search_params: { type: 'object' },
      },
    },
  },
  {
    name: 'get_certificate_authority',
    description: 'Get certificate authority by UUID',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'delete_certificate_authority',
    description: 'Delete a certificate authority',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
      },
      required: ['uuid'],
    },
  },

  // OpenVPN Management
  {
    name: 'get_openvpn_instances',
    description: 'Get OpenVPN instances',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'search_openvpn_instances',
    description: 'Search OpenVPN instances',
    inputSchema: {
      type: 'object',
      properties: {
        search_params: { type: 'object' },
      },
    },
  },
  {
    name: 'add_openvpn_instance',
    description: 'Add OpenVPN instance',
    inputSchema: {
      type: 'object',
      properties: {
        instance: { type: 'object' },
      },
      required: ['instance'],
    },
  },
  {
    name: 'update_openvpn_instance',
    description: 'Update OpenVPN instance',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
        instance: { type: 'object' },
      },
      required: ['uuid', 'instance'],
    },
  },
  {
    name: 'delete_openvpn_instance',
    description: 'Delete OpenVPN instance',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'toggle_openvpn_instance',
    description: 'Enable/disable OpenVPN instance',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
        enabled: { type: 'boolean' },
      },
      required: ['uuid', 'enabled'],
    },
  },
  {
    name: 'start_openvpn_service',
    description: 'Start OpenVPN service',
    inputSchema: {
      type: 'object',
      properties: {
        service_id: { type: 'string' },
      },
    },
  },
  {
    name: 'stop_openvpn_service',
    description: 'Stop OpenVPN service',
    inputSchema: {
      type: 'object',
      properties: {
        service_id: { type: 'string' },
      },
    },
  },
  {
    name: 'restart_openvpn_service',
    description: 'Restart OpenVPN service',
    inputSchema: {
      type: 'object',
      properties: {
        service_id: { type: 'string' },
      },
    },
  },
  {
    name: 'search_openvpn_sessions',
    description: 'Search OpenVPN sessions',
    inputSchema: {
      type: 'object',
      properties: {
        search_params: { type: 'object' },
      },
    },
  },
  {
    name: 'kill_openvpn_session',
    description: 'Kill an OpenVPN session',
    inputSchema: {
      type: 'object',
      properties: {
        session_data: { type: 'object' },
      },
      required: ['session_data'],
    },
  },

  // IPsec Management
  {
    name: 'ipsec_is_enabled',
    description: 'Check if IPsec is enabled',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'toggle_ipsec_service',
    description: 'Enable/disable IPsec service',
    inputSchema: {
      type: 'object',
      properties: {
        enabled: { type: 'boolean' },
      },
      required: ['enabled'],
    },
  },
  {
    name: 'search_ipsec_connections',
    description: 'Search IPsec connections',
    inputSchema: {
      type: 'object',
      properties: {
        search_params: { type: 'object' },
      },
    },
  },
  {
    name: 'add_ipsec_connection',
    description: 'Add IPsec connection',
    inputSchema: {
      type: 'object',
      properties: {
        connection: { type: 'object' },
      },
      required: ['connection'],
    },
  },
  {
    name: 'get_ipsec_connection',
    description: 'Get IPsec connection by UUID',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'update_ipsec_connection',
    description: 'Update IPsec connection',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
        connection: { type: 'object' },
      },
      required: ['uuid', 'connection'],
    },
  },
  {
    name: 'delete_ipsec_connection',
    description: 'Delete IPsec connection',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'toggle_ipsec_connection',
    description: 'Enable/disable IPsec connection',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
        enabled: { type: 'boolean' },
      },
      required: ['uuid', 'enabled'],
    },
  },
  {
    name: 'start_ipsec',
    description: 'Start IPsec service',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'stop_ipsec',
    description: 'Stop IPsec service',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'restart_ipsec',
    description: 'Restart IPsec service',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'reconfigure_ipsec',
    description: 'Reconfigure IPsec service',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'search_ipsec_sessions',
    description: 'Search IPsec sessions',
    inputSchema: {
      type: 'object',
      properties: {
        search_params: { type: 'object' },
        phase: { type: 'integer', enum: [1, 2] },
      },
      required: ['phase'],
    },
  },
  {
    name: 'connect_ipsec_session',
    description: 'Connect IPsec session',
    inputSchema: {
      type: 'object',
      properties: {
        session_id: { type: 'string' },
      },
      required: ['session_id'],
    },
  },
  {
    name: 'disconnect_ipsec_session',
    description: 'Disconnect IPsec session',
    inputSchema: {
      type: 'object',
      properties: {
        session_id: { type: 'string' },
      },
      required: ['session_id'],
    },
  },

  // DHCP Management
  {
    name: 'get_dhcp_config',
    description: 'Get DHCP configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'set_dhcp_config',
    description: 'Set DHCP configuration',
    inputSchema: {
      type: 'object',
      properties: {
        config: { type: 'object' },
      },
      required: ['config'],
    },
  },
  {
    name: 'search_dhcp_leases',
    description: 'Search DHCP leases',
    inputSchema: {
      type: 'object',
      properties: {
        search_params: { type: 'object' },
      },
    },
  },
  {
    name: 'search_dhcp_reservations',
    description: 'Search DHCP reservations',
    inputSchema: {
      type: 'object',
      properties: {
        search_params: { type: 'object' },
      },
    },
  },
  {
    name: 'add_dhcp_reservation',
    description: 'Add DHCP reservation',
    inputSchema: {
      type: 'object',
      properties: {
        reservation: { type: 'object' },
      },
      required: ['reservation'],
    },
  },
  {
    name: 'get_dhcp_reservation',
    description: 'Get DHCP reservation by UUID',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'update_dhcp_reservation',
    description: 'Update DHCP reservation',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
        reservation: { type: 'object' },
      },
      required: ['uuid', 'reservation'],
    },
  },
  {
    name: 'delete_dhcp_reservation',
    description: 'Delete DHCP reservation',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'toggle_dhcp_reservation',
    description: 'Enable/disable DHCP reservation',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
        enabled: { type: 'boolean' },
      },
      required: ['uuid', 'enabled'],
    },
  },
  {
    name: 'start_dhcp_service',
    description: 'Start DHCP service',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'stop_dhcp_service',
    description: 'Stop DHCP service',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'restart_dhcp_service',
    description: 'Restart DHCP service',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'reconfigure_dhcp',
    description: 'Reconfigure DHCP service',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_dhcp_status',
    description: 'Get DHCP service status',
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

    // Extended System Operations
    toolHandlers.system_reboot = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.system.reboot();
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error rebooting system: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    };

    toolHandlers.system_halt = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.system.halt();
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error halting system: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    };

    toolHandlers.dismiss_system_status = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.system.dismissStatus();
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error dismissing system status: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    };

    // Firmware Management
    toolHandlers.firmware_get_info = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.firmware.getInfo();
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error getting firmware info: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    };

    toolHandlers.firmware_check_updates = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.firmware.checkUpdates();
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error checking firmware updates: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    };

    toolHandlers.firmware_update = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.firmware.update();
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error updating firmware: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    };

    toolHandlers.firmware_upgrade = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.firmware.upgrade();
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error upgrading firmware: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    };

    toolHandlers.firmware_audit = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.firmware.audit();
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error running firmware audit: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    };

    toolHandlers.firmware_get_changelog = async (args: any) => {
      const client = this.ensureClient();
      const { version } = args;
      try {
        const response = await client.firmware.getChangelog(version);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error getting firmware changelog: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    };

    // Package Management
    toolHandlers.package_remove = async (args: any) => {
      const client = this.ensureClient();
      const { package_name } = args;
      try {
        const response = await client.firmware.removePackage(package_name);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error removing package ${package_name}: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    };

    toolHandlers.package_reinstall = async (args: any) => {
      const client = this.ensureClient();
      const { package_name } = args;
      try {
        const response = await client.firmware.reinstallPackage(package_name);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error reinstalling package ${package_name}: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    };

    toolHandlers.package_lock = async (args: any) => {
      const client = this.ensureClient();
      const { package_name } = args;
      try {
        const response = await client.firmware.lockPackage(package_name);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error locking package ${package_name}: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    };

    toolHandlers.package_unlock = async (args: any) => {
      const client = this.ensureClient();
      const { package_name } = args;
      try {
        const response = await client.firmware.unlockPackage(package_name);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error unlocking package ${package_name}: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    };

    toolHandlers.package_get_details = async (args: any) => {
      const client = this.ensureClient();
      const { package_name } = args;
      try {
        const response = await client.firmware.getPackageDetails(package_name);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error getting package details for ${package_name}: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    };

    // Advanced Firewall Operations
    toolHandlers.firewall_apply = async (args: any) => {
      const client = this.ensureClient();
      const { rollback_revision } = args;
      try {
        const response = await client.firewall.apply(rollback_revision);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error applying firewall changes: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    };

    toolHandlers.firewall_savepoint = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.firewall.savepoint();
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error creating firewall savepoint: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    };

    toolHandlers.firewall_revert = async (args: any) => {
      const client = this.ensureClient();
      const { revision } = args;
      try {
        const response = await client.firewall.revert(revision);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error reverting firewall to revision ${revision}: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    };

    toolHandlers.get_firewall_rule_stats = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.firewall.getRuleStats();
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error getting firewall rule stats: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    };

    toolHandlers.firewall_move_rule = async (args: any) => {
      const client = this.ensureClient();
      const { selected_uuid, target_uuid } = args;
      try {
        const response = await client.firewall.rules.moveBefore(selected_uuid, target_uuid);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error moving firewall rule: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    };

    toolHandlers.get_firewall_rule = async (args: any) => {
      const client = this.ensureClient();
      const { uuid } = args;
      try {
        const response = await client.firewall.rules.get(uuid);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error getting firewall rule ${uuid}: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    };

    toolHandlers.update_firewall_rule = async (args: any) => {
      const client = this.ensureClient();
      const { uuid, rule } = args;
      try {
        const response = await client.firewall.rules.update(uuid, rule);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error updating firewall rule ${uuid}: ${error instanceof Error ? error.message : 'Unknown error'}` }],
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

    // Enhanced Alias Management
    toolHandlers.get_firewall_alias = async (args: any) => {
      const client = this.ensureClient();
      const { uuid } = args;
      try {
        const response = await client.firewall.aliases.get(uuid);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error getting firewall alias ${uuid}: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    };

    toolHandlers.add_firewall_alias = async (args: any) => {
      const client = this.ensureClient();
      const { alias } = args;
      try {
        const response = await client.firewall.aliases.add(alias);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error adding firewall alias: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    };

    toolHandlers.update_firewall_alias = async (args: any) => {
      const client = this.ensureClient();
      const { uuid, alias } = args;
      try {
        const response = await client.firewall.aliases.update(uuid, alias);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error updating firewall alias ${uuid}: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    };

    toolHandlers.delete_firewall_alias = async (args: any) => {
      const client = this.ensureClient();
      const { uuid } = args;
      try {
        const response = await client.firewall.aliases.delete(uuid);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error deleting firewall alias ${uuid}: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    };

    toolHandlers.toggle_firewall_alias = async (args: any) => {
      const client = this.ensureClient();
      const { uuid, enabled } = args;
      try {
        const response = await client.firewall.aliases.toggle(uuid, enabled);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error toggling firewall alias ${uuid}: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    };

    toolHandlers.export_firewall_aliases = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.firewall.aliases.export();
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error exporting firewall aliases: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    };

    toolHandlers.import_firewall_aliases = async (args: any) => {
      const client = this.ensureClient();
      const { data } = args;
      try {
        const response = await client.firewall.aliases.import(data);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error importing firewall aliases: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    };

    toolHandlers.get_alias_table_size = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.firewall.aliases.getTableSize();
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error getting alias table size: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    };

    toolHandlers.list_alias_contents = async (args: any) => {
      const client = this.ensureClient();
      const { alias_name } = args;
      try {
        const response = await client.firewall.aliasUtils.list(alias_name);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error listing alias contents for ${alias_name}: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    };

    toolHandlers.flush_alias = async (args: any) => {
      const client = this.ensureClient();
      const { alias_name } = args;
      try {
        const response = await client.firewall.aliasUtils.flush(alias_name);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error flushing alias ${alias_name}: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    };

    // Enhanced Diagnostics
    toolHandlers.get_memory_usage = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.diagnostics.getMemory();
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error getting memory usage: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    };

    toolHandlers.get_disk_usage = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.diagnostics.getDisk();
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error getting disk usage: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    };

    toolHandlers.get_system_temperature = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.diagnostics.getTemperature();
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error getting system temperature: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    };

    toolHandlers.get_cpu_usage = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.diagnostics.getCpuUsageStream();
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error getting CPU usage: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    };

    toolHandlers.get_arp_table = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.diagnostics.getArp();
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error getting ARP table: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    };

    toolHandlers.search_arp_table = async (args: any) => {
      const client = this.ensureClient();
      const { search_params } = args;
      try {
        const response = await client.diagnostics.searchArp(search_params);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error searching ARP table: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    };

    toolHandlers.flush_arp_table = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.diagnostics.flushArp();
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error flushing ARP table: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    };

    toolHandlers.get_pf_states = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.diagnostics.getPfStates();
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error getting PF states: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    };

    toolHandlers.query_pf_states = async (args: any) => {
      const client = this.ensureClient();
      const { params } = args;
      try {
        const response = await client.diagnostics.queryPfStates(params);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error querying PF states: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    };

    toolHandlers.flush_firewall_states = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.diagnostics.flushFirewallStates();
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error flushing firewall states: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    };

    toolHandlers.kill_firewall_states = async (args: any) => {
      const client = this.ensureClient();
      const { params } = args;
      try {
        const response = await client.diagnostics.killFirewallStates(params);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error killing firewall states: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    };

    toolHandlers.dns_lookup = async (args: any) => {
      const client = this.ensureClient();
      const { hostname, record_type = 'A' } = args;
      try {
        const response = await client.diagnostics.dnsLookup({ hostname, type: record_type });
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error performing DNS lookup for ${hostname}: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    };

    // Service Management
    toolHandlers.search_services = async (args: any) => {
      const client = this.ensureClient();
      const { search_params } = args;
      try {
        const response = await client.service.searchServices(search_params);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error searching services: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    };

    toolHandlers.start_service = async (args: any) => {
      const client = this.ensureClient();
      const { service_name, service_id } = args;
      try {
        const response = await client.service.start(service_name, service_id);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error starting service ${service_name}: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    };

    toolHandlers.stop_service = async (args: any) => {
      const client = this.ensureClient();
      const { service_name, service_id } = args;
      try {
        const response = await client.service.stop(service_name, service_id);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error stopping service ${service_name}: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    };

    // Interface Management
    toolHandlers.get_interface_details = async (args: any) => {
      const client = this.ensureClient();
      const { interface_name } = args;
      try {
        const response = await client.interfaces.getInterface(interface_name);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error getting interface details for ${interface_name}: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    };

    toolHandlers.reload_interface = async (args: any) => {
      const client = this.ensureClient();
      const { interface_name } = args;
      try {
        const response = await client.interfaces.reloadInterface(interface_name);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error reloading interface ${interface_name}: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    };

    toolHandlers.get_interface_statistics = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.diagnostics.getInterfaceStatistics();
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error getting interface statistics: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
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
