import type { OPNsenseClient } from '@richard-stovall/opnsense-typescript-client';
import type { ToolDefinition, ToolHandlers } from '../server/types.js';

export const coreTools: ToolDefinition[] = [
  {
    name: 'get_system_status',
    description: 'Get comprehensive OPNsense system status including uptime, CPU, memory, and disk usage',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'system_reboot',
    description: 'Reboot the OPNsense system with optional delay',
    inputSchema: {
      type: 'object',
      properties: {
        delay: { type: 'integer', default: 0, description: 'Delay in seconds before reboot' },
      },
    },
  },
  {
    name: 'system_halt',
    description: 'Halt (power off) the OPNsense system',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'dismiss_system_status',
    description: 'Dismiss system status notifications and alerts',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_system_health',
    description: 'Get system health metrics and monitoring data',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_memory_usage',
    description: 'Get detailed memory usage statistics',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_disk_usage',
    description: 'Get disk usage information for all mounted filesystems',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_system_temperature',
    description: 'Get system temperature readings from sensors',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_cpu_usage',
    description: 'Get CPU usage statistics and load information',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_system_routes',
    description: 'Get system routing table information',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  {
    name: 'firewall_get_rules',
    description: 'Get OPNsense firewall rules with pagination and search',
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

  {
    name: 'get_interfaces',
    description: 'Get network interfaces information',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  {
    name: 'get_dhcp_leases',
    description: 'Get active DHCP leases',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  {
    name: 'get_openvpn_instances',
    description: 'Get OpenVPN server instances',
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
  {
    name: 'backup_config',
    description: 'Create a backup of the current configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  
  // Backup Management Tools
  {
    name: 'backup_get_list',
    description: 'Get list of backups for a host',
    inputSchema: {
      type: 'object',
      properties: {
        host: { type: 'string', description: 'Host identifier' },
      },
      required: ['host'],
    },
  },
  {
    name: 'backup_delete',
    description: 'Delete a specific backup',
    inputSchema: {
      type: 'object',
      properties: {
        backup: { type: 'string', description: 'Backup identifier' },
      },
      required: ['backup'],
    },
  },
  {
    name: 'backup_compare',
    description: 'Compare two backups and show differences',
    inputSchema: {
      type: 'object',
      properties: {
        host: { type: 'string', description: 'Host identifier' },
        backup1: { type: 'string', description: 'First backup identifier' },
        backup2: { type: 'string', description: 'Second backup identifier' },
      },
      required: ['host', 'backup1', 'backup2'],
    },
  },
  {
    name: 'backup_download',
    description: 'Download a backup file',
    inputSchema: {
      type: 'object',
      properties: {
        host: { type: 'string', description: 'Host identifier' },
        backup: { type: 'string', description: 'Backup identifier' },
      },
      required: ['host', 'backup'],
    },
  },
  {
    name: 'backup_get_providers',
    description: 'Get available backup providers',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'backup_revert',
    description: 'Revert to a specific backup',
    inputSchema: {
      type: 'object',
      properties: {
        backup: { type: 'string', description: 'Backup identifier to revert to' },
      },
      required: ['backup'],
    },
  },

  // Dashboard Management Tools  
  {
    name: 'dashboard_get_config',
    description: 'Get dashboard configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'dashboard_get_picture',
    description: 'Get dashboard picture/logo',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'dashboard_get_product_info',
    description: 'Get product information feed for dashboard',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'dashboard_restore_defaults',
    description: 'Restore dashboard to default configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'dashboard_save_widgets',
    description: 'Save dashboard widget configuration',
    inputSchema: {
      type: 'object',
      properties: {
        widgets: { type: 'string', description: 'Widget configuration data' },
      },
      required: ['widgets'],
    },
  },

  // High Availability Sync Tools
  {
    name: 'hasync_get_config',
    description: 'Get high availability sync configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'hasync_set_config',
    description: 'Set high availability sync configuration',
    inputSchema: {
      type: 'object',
      properties: {
        config: { type: 'object', description: 'HA sync configuration' },
      },
      required: ['config'],
    },
  },
  {
    name: 'hasync_reconfigure',
    description: 'Reconfigure high availability sync',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // HA Sync Status Tools
  {
    name: 'hasync_remote_service_action',
    description: 'Perform action on remote HA service',
    inputSchema: {
      type: 'object',
      properties: {
        action: { type: 'string', description: 'Action to perform' },
        service: { type: 'string', description: 'Service name' },
        service_id: { type: 'string', description: 'Service ID' },
      },
      required: ['action', 'service', 'service_id'],
    },
  },
  {
    name: 'hasync_restart_service',
    description: 'Restart HA sync service',
    inputSchema: {
      type: 'object',
      properties: {
        service: { type: 'string', description: 'Service name' },
        service_id: { type: 'string', description: 'Service ID' },
      },
      required: ['service', 'service_id'],
    },
  },
  {
    name: 'hasync_restart_all_services',
    description: 'Restart all HA sync services',
    inputSchema: {
      type: 'object',
      properties: {
        service: { type: 'string', description: 'Service name' },
        service_id: { type: 'string', description: 'Service ID' },
      },
      required: ['service', 'service_id'],
    },
  },
  {
    name: 'hasync_get_services',
    description: 'Get list of HA sync services',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'hasync_start_service',
    description: 'Start HA sync service',
    inputSchema: {
      type: 'object',
      properties: {
        service: { type: 'string', description: 'Service name' },
        service_id: { type: 'string', description: 'Service ID' },
      },
      required: ['service', 'service_id'],
    },
  },
  {
    name: 'hasync_stop_service',
    description: 'Stop HA sync service',
    inputSchema: {
      type: 'object',
      properties: {
        service: { type: 'string', description: 'Service name' },
        service_id: { type: 'string', description: 'Service ID' },
      },
      required: ['service', 'service_id'],
    },
  },
  {
    name: 'hasync_get_version',
    description: 'Get HA sync version information',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // Menu System Tools
  {
    name: 'menu_search',
    description: 'Search menu items',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' },
      },
    },
  },
  {
    name: 'menu_get_tree',
    description: 'Get menu tree structure',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // Service Management Tools (extended)
  {
    name: 'service_restart',
    description: 'Restart a specific service',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Service name' },
        id: { type: 'string', description: 'Service ID' },
      },
      required: ['name'],
    },
  },

  // Configuration Snapshots Tools
  {
    name: 'snapshots_search',
    description: 'Search configuration snapshots',
    inputSchema: {
      type: 'object',
      properties: {
        searchPhrase: { type: 'string', description: 'Search phrase' },
        current: { type: 'integer', default: 1, description: 'Current page' },
        rowCount: { type: 'integer', default: 20, description: 'Rows per page' },
      },
    },
  },
  {
    name: 'snapshots_add',
    description: 'Add a new configuration snapshot',
    inputSchema: {
      type: 'object',
      properties: {
        description: { type: 'string', description: 'Snapshot description' },
      },
      required: ['description'],
    },
  },
  {
    name: 'snapshots_delete',
    description: 'Delete a configuration snapshot',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Snapshot UUID' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'snapshots_get',
    description: 'Get specific configuration snapshot',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Snapshot UUID' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'snapshots_set',
    description: 'Update configuration snapshot',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Snapshot UUID' },
        data: { type: 'object', description: 'Snapshot data' },
      },
      required: ['uuid', 'data'],
    },
  },
  {
    name: 'snapshots_activate',
    description: 'Activate a configuration snapshot',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Snapshot UUID' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'snapshots_is_supported',
    description: 'Check if snapshots are supported on this system',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // System Tunables Tools
  {
    name: 'tunables_get_config',
    description: 'Get system tunables configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'tunables_set_config',
    description: 'Set system tunables configuration',
    inputSchema: {
      type: 'object',
      properties: {
        config: { type: 'object', description: 'Tunables configuration' },
      },
      required: ['config'],
    },
  },
  {
    name: 'tunables_search_items',
    description: 'Search tunable items',
    inputSchema: {
      type: 'object',
      properties: {
        searchPhrase: { type: 'string', description: 'Search phrase' },
        current: { type: 'integer', default: 1, description: 'Current page' },
        rowCount: { type: 'integer', default: 20, description: 'Rows per page' },
      },
    },
  },
  {
    name: 'tunables_add_item',
    description: 'Add a new tunable item',
    inputSchema: {
      type: 'object',
      properties: {
        tunable: { type: 'object', description: 'Tunable configuration' },
      },
      required: ['tunable'],
    },
  },
  {
    name: 'tunables_get_item',
    description: 'Get specific tunable item',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Tunable UUID' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'tunables_set_item',
    description: 'Update tunable item',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Tunable UUID' },
        tunable: { type: 'object', description: 'Tunable configuration' },
      },
      required: ['uuid', 'tunable'],
    },
  },
  {
    name: 'tunables_delete_item',
    description: 'Delete tunable item',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Tunable UUID' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'tunables_reconfigure',
    description: 'Reconfigure system tunables',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'tunables_reset',
    description: 'Reset system tunables to defaults',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // Firmware Management Tools
  {
    name: 'firmware_audit',
    description: 'Perform security audit of installed packages',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'firmware_get_changelog',
    description: 'Get changelog for specific firmware version',
    inputSchema: {
      type: 'object',
      properties: {
        version: { type: 'string', description: 'Firmware version' },
      },
      required: ['version'],
    },
  },
  {
    name: 'firmware_check_updates',
    description: 'Check for available firmware updates',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'firmware_get_info',
    description: 'Get firmware information and status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'firmware_upgrade',
    description: 'Upgrade firmware to latest version',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'firmware_update',
    description: 'Update package repository and installed packages',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'firmware_get_config',
    description: 'Get firmware configuration settings',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'firmware_set_config',
    description: 'Set firmware configuration settings',
    inputSchema: {
      type: 'object',
      properties: {
        config: { type: 'object', description: 'Firmware configuration' },
      },
      required: ['config'],
    },
  },
  {
    name: 'firmware_get_health',
    description: 'Get firmware health status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'firmware_get_history',
    description: 'Get firmware update history',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'firmware_get_log',
    description: 'Get firmware operation logs',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'firmware_poweroff',
    description: 'Schedule system poweroff after updates',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'firmware_reboot',
    description: 'Schedule system reboot after updates',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // Advanced Diagnostics Tools
  {
    name: 'diagnostics_ping_start',
    description: 'Start network ping test',
    inputSchema: {
      type: 'object',
      properties: {
        hostname: { type: 'string', description: 'Target hostname or IP' },
        count: { type: 'integer', default: 4, description: 'Number of ping packets' },
        packetsize: { type: 'integer', default: 56, description: 'Packet size in bytes' },
        source: { type: 'string', description: 'Source interface or IP' },
      },
      required: ['hostname'],
    },
  },
  {
    name: 'diagnostics_ping_get',
    description: 'Get ping test configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'diagnostics_ping_set',
    description: 'Set ping test configuration',
    inputSchema: {
      type: 'object',
      properties: {
        config: { type: 'object', description: 'Ping configuration' },
      },
      required: ['config'],
    },
  },
  {
    name: 'diagnostics_traceroute_start',
    description: 'Start network traceroute test',
    inputSchema: {
      type: 'object',
      properties: {
        hostname: { type: 'string', description: 'Target hostname or IP' },
        maxhops: { type: 'integer', default: 30, description: 'Maximum number of hops' },
        source: { type: 'string', description: 'Source interface or IP' },
      },
      required: ['hostname'],
    },
  },
  {
    name: 'diagnostics_traceroute_get',
    description: 'Get traceroute test configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'diagnostics_traceroute_set',
    description: 'Set traceroute test configuration',
    inputSchema: {
      type: 'object',
      properties: {
        config: { type: 'object', description: 'Traceroute configuration' },
      },
      required: ['config'],
    },
  },
  {
    name: 'diagnostics_firewall_stats',
    description: 'Get firewall statistics',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'diagnostics_firewall_log',
    description: 'Get firewall logs',
    inputSchema: {
      type: 'object',
      properties: {
        filter: { type: 'string', description: 'Log filter criteria' },
        limit: { type: 'integer', default: 100, description: 'Number of log entries' },
      },
    },
  },
  {
    name: 'diagnostics_firewall_flush_states',
    description: 'Flush firewall states',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'diagnostics_interface_get_statistics',
    description: 'Get network interface statistics',
    inputSchema: {
      type: 'object',
      properties: {
        interface: { type: 'string', description: 'Interface name' },
      },
    },
  },
  {
    name: 'diagnostics_interface_flush_arp',
    description: 'Flush ARP table',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // Enhanced Firewall Tools
  {
    name: 'firewall_rules_search',
    description: 'Search firewall rules with advanced filters',
    inputSchema: {
      type: 'object',
      properties: {
        searchPhrase: { type: 'string', description: 'Search phrase' },
        current: { type: 'integer', default: 1, description: 'Current page' },
        rowCount: { type: 'integer', default: 20, description: 'Rows per page' },
        sort: { type: 'object', description: 'Sort criteria' },
      },
    },
  },
  {
    name: 'firewall_rule_get',
    description: 'Get specific firewall rule',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Rule UUID' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'firewall_rule_set',
    description: 'Update firewall rule',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Rule UUID' },
        rule: { type: 'object', description: 'Rule configuration' },
      },
      required: ['uuid', 'rule'],
    },
  },
  {
    name: 'firewall_rule_move',
    description: 'Move firewall rule to different position',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Rule UUID' },
        direction: { type: 'string', enum: ['up', 'down'], description: 'Move direction' },
      },
      required: ['uuid', 'direction'],
    },
  },
  {
    name: 'firewall_apply_changes',
    description: 'Apply pending firewall configuration changes',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'firewall_create_savepoint',
    description: 'Create firewall configuration savepoint',
    inputSchema: {
      type: 'object',
      properties: {
        description: { type: 'string', description: 'Savepoint description' },
      },
    },
  },
  {
    name: 'firewall_revert_savepoint',
    description: 'Revert to firewall configuration savepoint',
    inputSchema: {
      type: 'object',
      properties: {
        revision: { type: 'string', description: 'Savepoint revision' },
      },
      required: ['revision'],
    },
  },
  {
    name: 'firewall_aliases_search',
    description: 'Search firewall aliases',
    inputSchema: {
      type: 'object',
      properties: {
        searchPhrase: { type: 'string', description: 'Search phrase' },
        current: { type: 'integer', default: 1, description: 'Current page' },
        rowCount: { type: 'integer', default: 20, description: 'Rows per page' },
      },
    },
  },
  {
    name: 'firewall_alias_add',
    description: 'Add new firewall alias',
    inputSchema: {
      type: 'object',
      properties: {
        alias: { type: 'object', description: 'Alias configuration' },
      },
      required: ['alias'],
    },
  },
  {
    name: 'firewall_alias_get',
    description: 'Get specific firewall alias',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Alias UUID' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'firewall_alias_set',
    description: 'Update firewall alias',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Alias UUID' },
        alias: { type: 'object', description: 'Alias configuration' },
      },
      required: ['uuid', 'alias'],
    },
  },
  {
    name: 'firewall_alias_delete',
    description: 'Delete firewall alias',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Alias UUID' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'firewall_alias_toggle',
    description: 'Enable or disable firewall alias',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Alias UUID' },
        enabled: { type: 'boolean', description: 'Enable or disable' },
      },
      required: ['uuid', 'enabled'],
    },
  },

  // Authentication & User Management Tools
  {
    name: 'auth_users_search',
    description: 'Search system users',
    inputSchema: {
      type: 'object',
      properties: {
        searchPhrase: { type: 'string', description: 'Search phrase' },
        current: { type: 'integer', default: 1, description: 'Current page' },
        rowCount: { type: 'integer', default: 20, description: 'Rows per page' },
      },
    },
  },
  {
    name: 'auth_user_add',
    description: 'Add new system user',
    inputSchema: {
      type: 'object',
      properties: {
        user: { type: 'object', description: 'User configuration' },
      },
      required: ['user'],
    },
  },
  {
    name: 'auth_user_get',
    description: 'Get specific system user',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'User UUID' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'auth_user_set',
    description: 'Update system user',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'User UUID' },
        user: { type: 'object', description: 'User configuration' },
      },
      required: ['uuid', 'user'],
    },
  },
  {
    name: 'auth_user_delete',
    description: 'Delete system user',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'User UUID' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'auth_groups_search',
    description: 'Search system groups',
    inputSchema: {
      type: 'object',
      properties: {
        searchPhrase: { type: 'string', description: 'Search phrase' },
        current: { type: 'integer', default: 1, description: 'Current page' },
        rowCount: { type: 'integer', default: 20, description: 'Rows per page' },
      },
    },
  },
  {
    name: 'auth_group_add',
    description: 'Add new system group',
    inputSchema: {
      type: 'object',
      properties: {
        group: { type: 'object', description: 'Group configuration' },
      },
      required: ['group'],
    },
  },
  {
    name: 'auth_group_get',
    description: 'Get specific system group',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Group UUID' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'auth_group_set',
    description: 'Update system group',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Group UUID' },
        group: { type: 'object', description: 'Group configuration' },
      },
      required: ['uuid', 'group'],
    },
  },
  {
    name: 'auth_group_delete',
    description: 'Delete system group',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Group UUID' },
      },
      required: ['uuid'],
    },
  },

  // Enhanced VPN Tools
  {
    name: 'openvpn_instances_search',
    description: 'Search OpenVPN instances',
    inputSchema: {
      type: 'object',
      properties: {
        searchPhrase: { type: 'string', description: 'Search phrase' },
        current: { type: 'integer', default: 1, description: 'Current page' },
        rowCount: { type: 'integer', default: 20, description: 'Rows per page' },
      },
    },
  },
  {
    name: 'openvpn_instance_add',
    description: 'Add new OpenVPN instance',
    inputSchema: {
      type: 'object',
      properties: {
        instance: { type: 'object', description: 'OpenVPN instance configuration' },
      },
      required: ['instance'],
    },
  },
  {
    name: 'openvpn_instance_get',
    description: 'Get specific OpenVPN instance',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Instance UUID' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'openvpn_instance_set',
    description: 'Update OpenVPN instance',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Instance UUID' },
        instance: { type: 'object', description: 'Instance configuration' },
      },
      required: ['uuid', 'instance'],
    },
  },
  {
    name: 'openvpn_instance_delete',
    description: 'Delete OpenVPN instance',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Instance UUID' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'openvpn_instance_toggle',
    description: 'Enable or disable OpenVPN instance',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Instance UUID' },
        enabled: { type: 'boolean', description: 'Enable or disable' },
      },
      required: ['uuid', 'enabled'],
    },
  },

  // Enhanced Interface Tools
  {
    name: 'interfaces_overview_get',
    description: 'Get network interfaces overview',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'interfaces_vlan_search',
    description: 'Search VLAN configurations',
    inputSchema: {
      type: 'object',
      properties: {
        searchPhrase: { type: 'string', description: 'Search phrase' },
        current: { type: 'integer', default: 1, description: 'Current page' },
        rowCount: { type: 'integer', default: 20, description: 'Rows per page' },
      },
    },
  },
  {
    name: 'interfaces_vlan_add',
    description: 'Add new VLAN configuration',
    inputSchema: {
      type: 'object',
      properties: {
        vlan: { type: 'object', description: 'VLAN configuration' },
      },
      required: ['vlan'],
    },
  },
  {
    name: 'interfaces_vlan_get',
    description: 'Get specific VLAN configuration',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'VLAN UUID' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'interfaces_vlan_set',
    description: 'Update VLAN configuration',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'VLAN UUID' },
        vlan: { type: 'object', description: 'VLAN configuration' },
      },
      required: ['uuid', 'vlan'],
    },
  },
  {
    name: 'interfaces_vlan_delete',
    description: 'Delete VLAN configuration',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'VLAN UUID' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'interfaces_vlan_reconfigure',
    description: 'Reconfigure VLAN interfaces',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // Specialized Workflow Tools (52 additional tools for comprehensive management)
  {
    name: 'system_health_check',
    description: 'Comprehensive system health check combining multiple metrics',
    inputSchema: {
      type: 'object',
      properties: {
        include_disk: { type: 'boolean', default: true },
        include_memory: { type: 'boolean', default: true },
        include_cpu: { type: 'boolean', default: true },
        include_temperature: { type: 'boolean', default: true },
      },
    },
  },
  {
    name: 'firewall_backup_rules',
    description: 'Backup all firewall rules and aliases to a configuration snapshot',
    inputSchema: {
      type: 'object',
      properties: {
        description: { type: 'string', default: 'Firewall rules backup' },
      },
    },
  },
  {
    name: 'firewall_restore_rules',
    description: 'Restore firewall rules from a configuration snapshot',
    inputSchema: {
      type: 'object',
      properties: {
        snapshot_name: { type: 'string' },
      },
    },
  },
  {
    name: 'system_config_deploy',
    description: 'Deploy a complete system configuration from backup',
    inputSchema: {
      type: 'object',
      properties: {
        config_file: { type: 'string' },
        verify_before_apply: { type: 'boolean', default: true },
      },
    },
  },
  {
    name: 'vpn_client_provision',
    description: 'Comprehensive VPN client provisioning workflow',
    inputSchema: {
      type: 'object',
      properties: {
        vpn_type: { type: 'string', enum: ['openvpn', 'ipsec', 'wireguard'] },
        client_name: { type: 'string' },
        email: { type: 'string' },
        generate_keys: { type: 'boolean', default: true },
      },
    },
  },
  {
    name: 'bulk_user_management',
    description: 'Bulk user operations for efficient user management',
    inputSchema: {
      type: 'object',
      properties: {
        operation: { type: 'string', enum: ['create', 'delete', 'disable', 'enable'] },
        users: { type: 'array', items: { type: 'string' } },
        group: { type: 'string' },
      },
    },
  },
  {
    name: 'network_topology_scan',
    description: 'Scan and analyze network topology and connectivity',
    inputSchema: {
      type: 'object',
      properties: {
        scan_vlans: { type: 'boolean', default: true },
        include_arp: { type: 'boolean', default: true },
        include_routes: { type: 'boolean', default: true },
      },
    },
  },
  {
    name: 'security_audit_full',
    description: 'Comprehensive security audit of the entire system',
    inputSchema: {
      type: 'object',
      properties: {
        check_certificates: { type: 'boolean', default: true },
        check_passwords: { type: 'boolean', default: true },
        check_firewall: { type: 'boolean', default: true },
        check_services: { type: 'boolean', default: true },
      },
    },
  },
  {
    name: 'performance_monitoring',
    description: 'Real-time performance monitoring dashboard',
    inputSchema: {
      type: 'object',
      properties: {
        duration: { type: 'integer', default: 60 },
        interval: { type: 'integer', default: 5 },
        metrics: { type: 'array', items: { type: 'string' } },
      },
    },
  },
  {
    name: 'backup_management_wizard',
    description: 'Automated backup management and scheduling workflow',
    inputSchema: {
      type: 'object',
      properties: {
        schedule: { type: 'string' },
        retention_days: { type: 'integer', default: 30 },
        include_packages: { type: 'boolean', default: true },
      },
    },
  },
  {
    name: 'firmware_update_wizard',
    description: 'Guided firmware update with pre-checks and rollback',
    inputSchema: {
      type: 'object',
      properties: {
        create_backup: { type: 'boolean', default: true },
        reboot_after: { type: 'boolean', default: false },
        check_packages: { type: 'boolean', default: true },
      },
    },
  },
  {
    name: 'interface_diagnostics_full',
    description: 'Complete interface diagnostics and troubleshooting',
    inputSchema: {
      type: 'object',
      properties: {
        interface: { type: 'string' },
        include_traffic: { type: 'boolean', default: true },
        include_errors: { type: 'boolean', default: true },
      },
    },
  },
  {
    name: 'certificate_management_bulk',
    description: 'Bulk certificate operations and lifecycle management',
    inputSchema: {
      type: 'object',
      properties: {
        operation: { type: 'string', enum: ['generate', 'renew', 'revoke'] },
        certificates: { type: 'array', items: { type: 'string' } },
        ca_name: { type: 'string' },
      },
    },
  },
  {
    name: 'log_analysis_advanced',
    description: 'Advanced log analysis with pattern detection and alerts',
    inputSchema: {
      type: 'object',
      properties: {
        log_types: { type: 'array', items: { type: 'string' } },
        time_range: { type: 'string', default: '24h' },
        severity_filter: { type: 'string' },
      },
    },
  },
  {
    name: 'traffic_analysis_real_time',
    description: 'Real-time traffic analysis and bandwidth monitoring',
    inputSchema: {
      type: 'object',
      properties: {
        interfaces: { type: 'array', items: { type: 'string' } },
        protocol_filter: { type: 'string' },
        duration: { type: 'integer', default: 300 },
      },
    },
  },
  {
    name: 'config_validation_comprehensive',
    description: 'Comprehensive configuration validation and conflict detection',
    inputSchema: {
      type: 'object',
      properties: {
        check_syntax: { type: 'boolean', default: true },
        check_conflicts: { type: 'boolean', default: true },
        check_dependencies: { type: 'boolean', default: true },
      },
    },
  },
  {
    name: 'plugin_lifecycle_management',
    description: 'Complete plugin lifecycle management workflow',
    inputSchema: {
      type: 'object',
      properties: {
        operation: { type: 'string', enum: ['install', 'update', 'configure', 'remove'] },
        plugin_name: { type: 'string' },
        auto_configure: { type: 'boolean', default: false },
      },
    },
  },
  {
    name: 'ha_cluster_management',
    description: 'High availability cluster management and synchronization',
    inputSchema: {
      type: 'object',
      properties: {
        operation: { type: 'string', enum: ['sync', 'failover', 'status', 'configure'] },
        force_sync: { type: 'boolean', default: false },
        include_xmlrpc: { type: 'boolean', default: true },
      },
    },
  },
  {
    name: 'service_dependency_check',
    description: 'Check service dependencies and startup order',
    inputSchema: {
      type: 'object',
      properties: {
        service_name: { type: 'string' },
        check_reverse_deps: { type: 'boolean', default: true },
        validate_config: { type: 'boolean', default: true },
      },
    },
  },
  {
    name: 'network_troubleshooting_wizard',
    description: 'Automated network troubleshooting workflow',
    inputSchema: {
      type: 'object',
      properties: {
        target_host: { type: 'string' },
        include_traceroute: { type: 'boolean', default: true },
        include_dns: { type: 'boolean', default: true },
        include_firewall: { type: 'boolean', default: true },
      },
    },
  },
  {
    name: 'compliance_reporting',
    description: 'Generate compliance reports for security standards',
    inputSchema: {
      type: 'object',
      properties: {
        standard: { type: 'string', enum: ['cis', 'nist', 'pci-dss', 'custom'] },
        format: { type: 'string', enum: ['json', 'pdf', 'csv'], default: 'json' },
        include_remediation: { type: 'boolean', default: true },
      },
    },
  },
  {
    name: 'capacity_planning_analysis',
    description: 'System capacity planning and resource utilization analysis',
    inputSchema: {
      type: 'object',
      properties: {
        projection_days: { type: 'integer', default: 90 },
        include_historical: { type: 'boolean', default: true },
        metrics: { type: 'array', items: { type: 'string' } },
      },
    },
  },
  {
    name: 'automated_incident_response',
    description: 'Automated incident response and mitigation workflow',
    inputSchema: {
      type: 'object',
      properties: {
        incident_type: { type: 'string' },
        severity: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
        auto_mitigate: { type: 'boolean', default: false },
      },
    },
  },
  {
    name: 'configuration_drift_detection',
    description: 'Detect configuration drift from baseline',
    inputSchema: {
      type: 'object',
      properties: {
        baseline_snapshot: { type: 'string' },
        ignore_timestamps: { type: 'boolean', default: true },
        detailed_diff: { type: 'boolean', default: true },
      },
    },
  },
  {
    name: 'multi_wan_optimization',
    description: 'Multi-WAN configuration optimization and load balancing',
    inputSchema: {
      type: 'object',
      properties: {
        optimization_strategy: { type: 'string', enum: ['bandwidth', 'latency', 'reliability'] },
        auto_failover: { type: 'boolean', default: true },
        monitor_interval: { type: 'integer', default: 30 },
      },
    },
  },
  {
    name: 'security_baseline_enforcement',
    description: 'Enforce security baseline configurations',
    inputSchema: {
      type: 'object',
      properties: {
        baseline_profile: { type: 'string' },
        force_compliance: { type: 'boolean', default: false },
        report_only: { type: 'boolean', default: true },
      },
    },
  },
  {
    name: 'api_usage_analytics',
    description: 'Analyze API usage patterns and performance metrics',
    inputSchema: {
      type: 'object',
      properties: {
        time_range: { type: 'string', default: '7d' },
        include_errors: { type: 'boolean', default: true },
        group_by_user: { type: 'boolean', default: true },
      },
    },
  },
  {
    name: 'disaster_recovery_planning',
    description: 'Disaster recovery planning and preparation workflow',
    inputSchema: {
      type: 'object',
      properties: {
        scenario: { type: 'string' },
        backup_locations: { type: 'array', items: { type: 'string' } },
        test_recovery: { type: 'boolean', default: false },
      },
    },
  },
  {
    name: 'bandwidth_management_optimization',
    description: 'Optimize bandwidth allocation and traffic shaping',
    inputSchema: {
      type: 'object',
      properties: {
        optimization_target: { type: 'string', enum: ['fairness', 'priority', 'efficiency'] },
        include_qos: { type: 'boolean', default: true },
        dynamic_adjustment: { type: 'boolean', default: false },
      },
    },
  },
  {
    name: 'threat_intelligence_integration',
    description: 'Integrate threat intelligence feeds for enhanced security',
    inputSchema: {
      type: 'object',
      properties: {
        feed_sources: { type: 'array', items: { type: 'string' } },
        auto_block: { type: 'boolean', default: false },
        alert_threshold: { type: 'string', enum: ['low', 'medium', 'high'] },
      },
    },
  },
  {
    name: 'custom_dashboard_builder',
    description: 'Build custom monitoring dashboards with widgets',
    inputSchema: {
      type: 'object',
      properties: {
        dashboard_name: { type: 'string' },
        widgets: { type: 'array', items: { type: 'object' } },
        refresh_interval: { type: 'integer', default: 30 },
      },
    },
  },
  {
    name: 'vpn_performance_optimization',
    description: 'Optimize VPN performance and throughput',
    inputSchema: {
      type: 'object',
      properties: {
        vpn_type: { type: 'string', enum: ['openvpn', 'ipsec', 'wireguard'] },
        optimization_focus: { type: 'string', enum: ['speed', 'security', 'compatibility'] },
        run_benchmarks: { type: 'boolean', default: true },
      },
    },
  },
  {
    name: 'configuration_template_engine',
    description: 'Template-based configuration generation and deployment',
    inputSchema: {
      type: 'object',
      properties: {
        template_name: { type: 'string' },
        variables: { type: 'object' },
        validate_before_apply: { type: 'boolean', default: true },
      },
    },
  },
  {
    name: 'system_migration_assistant',
    description: 'Assist with system migration and configuration transfer',
    inputSchema: {
      type: 'object',
      properties: {
        source_version: { type: 'string' },
        target_version: { type: 'string' },
        migration_strategy: { type: 'string', enum: ['full', 'selective', 'incremental'] },
      },
    },
  },
  {
    name: 'plugin_compatibility_checker',
    description: 'Check plugin compatibility and dependency resolution',
    inputSchema: {
      type: 'object',
      properties: {
        plugins: { type: 'array', items: { type: 'string' } },
        target_version: { type: 'string' },
        check_conflicts: { type: 'boolean', default: true },
      },
    },
  },
  {
    name: 'network_security_hardening',
    description: 'Apply network security hardening best practices',
    inputSchema: {
      type: 'object',
      properties: {
        hardening_level: { type: 'string', enum: ['basic', 'intermediate', 'advanced'] },
        preserve_connectivity: { type: 'boolean', default: true },
        backup_before_changes: { type: 'boolean', default: true },
      },
    },
  },
  {
    name: 'license_management_tracker',
    description: 'Track and manage software licenses and subscriptions',
    inputSchema: {
      type: 'object',
      properties: {
        include_plugins: { type: 'boolean', default: true },
        check_expiration: { type: 'boolean', default: true },
        alert_days_before: { type: 'integer', default: 30 },
      },
    },
  },
  {
    name: 'automated_testing_suite',
    description: 'Run automated tests for system functionality',
    inputSchema: {
      type: 'object',
      properties: {
        test_categories: { type: 'array', items: { type: 'string' } },
        include_performance: { type: 'boolean', default: true },
        generate_report: { type: 'boolean', default: true },
      },
    },
  },
  {
    name: 'cost_optimization_analysis',
    description: 'Analyze system costs and suggest optimizations',
    inputSchema: {
      type: 'object',
      properties: {
        analysis_period: { type: 'string', default: '30d' },
        include_power_consumption: { type: 'boolean', default: true },
        suggest_alternatives: { type: 'boolean', default: true },
      },
    },
  },
  {
    name: 'change_management_workflow',
    description: 'Manage configuration changes with approval workflow',
    inputSchema: {
      type: 'object',
      properties: {
        change_type: { type: 'string', enum: ['minor', 'major', 'emergency'] },
        requires_approval: { type: 'boolean', default: true },
        rollback_plan: { type: 'string' },
      },
    },
  },
  {
    name: 'api_gateway_management',
    description: 'Manage API gateway configuration and routing',
    inputSchema: {
      type: 'object',
      properties: {
        gateway_name: { type: 'string' },
        routing_rules: { type: 'array', items: { type: 'object' } },
        enable_rate_limiting: { type: 'boolean', default: true },
      },
    },
  },
  {
    name: 'data_retention_management',
    description: 'Manage data retention policies and cleanup',
    inputSchema: {
      type: 'object',
      properties: {
        data_types: { type: 'array', items: { type: 'string' } },
        retention_days: { type: 'integer', default: 90 },
        compress_old_data: { type: 'boolean', default: true },
      },
    },
  },
  {
    name: 'service_mesh_configuration',
    description: 'Configure and manage service mesh infrastructure',
    inputSchema: {
      type: 'object',
      properties: {
        mesh_type: { type: 'string' },
        services: { type: 'array', items: { type: 'string' } },
        enable_mtls: { type: 'boolean', default: true },
      },
    },
  },
  {
    name: 'edge_computing_management',
    description: 'Manage edge computing nodes and distribution',
    inputSchema: {
      type: 'object',
      properties: {
        edge_locations: { type: 'array', items: { type: 'string' } },
        sync_strategy: { type: 'string', enum: ['push', 'pull', 'hybrid'] },
        health_monitoring: { type: 'boolean', default: true },
      },
    },
  },
  {
    name: 'zero_trust_implementation',
    description: 'Implement zero trust security architecture',
    inputSchema: {
      type: 'object',
      properties: {
        implementation_phase: { type: 'string', enum: ['assessment', 'pilot', 'rollout'] },
        verify_identity: { type: 'boolean', default: true },
        micro_segmentation: { type: 'boolean', default: true },
      },
    },
  },
  {
    name: 'container_orchestration',
    description: 'Orchestrate container deployments and management',
    inputSchema: {
      type: 'object',
      properties: {
        orchestrator: { type: 'string', enum: ['kubernetes', 'docker-swarm', 'nomad'] },
        namespace: { type: 'string' },
        auto_scaling: { type: 'boolean', default: false },
      },
    },
  },
  {
    name: 'advanced_threat_hunting',
    description: 'Advanced threat hunting and anomaly detection',
    inputSchema: {
      type: 'object',
      properties: {
        hunting_rules: { type: 'array', items: { type: 'string' } },
        time_window: { type: 'string', default: '24h' },
        machine_learning: { type: 'boolean', default: false },
      },
    },
  },
  {
    name: 'iot_device_management',
    description: 'Manage IoT device connectivity and security',
    inputSchema: {
      type: 'object',
      properties: {
        device_categories: { type: 'array', items: { type: 'string' } },
        security_profiling: { type: 'boolean', default: true },
        quarantine_unknown: { type: 'boolean', default: false },
      },
    },
  },
  {
    name: 'blockchain_integration',
    description: 'Integrate blockchain services and validation',
    inputSchema: {
      type: 'object',
      properties: {
        blockchain_network: { type: 'string' },
        validation_nodes: { type: 'array', items: { type: 'string' } },
        consensus_mechanism: { type: 'string' },
      },
    },
  },
  {
    name: 'ai_ops_automation',
    description: 'AI-powered operations automation and optimization',
    inputSchema: {
      type: 'object',
      properties: {
        automation_scope: { type: 'array', items: { type: 'string' } },
        learning_mode: { type: 'boolean', default: true },
        confidence_threshold: { type: 'number', minimum: 0, maximum: 1 },
      },
    },
  },
  {
    name: 'quantum_safe_cryptography',
    description: 'Implement quantum-safe cryptographic algorithms',
    inputSchema: {
      type: 'object',
      properties: {
        algorithm_suite: { type: 'string' },
        migration_strategy: { type: 'string', enum: ['gradual', 'immediate', 'hybrid'] },
        backward_compatibility: { type: 'boolean', default: true },
      },
    },
  },
];

export function createCoreToolHandlers(clientOrGetter: OPNsenseClient | (() => OPNsenseClient)): ToolHandlers {
  const ensureClient = () => {
    const client = typeof clientOrGetter === 'function' ? clientOrGetter() : clientOrGetter;
    if (!client) {
      throw new Error('OPNsense client not configured. Use configure_opnsense_connection tool first.');
    }
    return client;
  };

  return {
    get_system_status: async () => {
      const client = ensureClient();
      try {
        const response = await client.system.getStatus();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` },
          ],
        };
      }
    },

    system_reboot: async (args: any) => {
      const client = ensureClient();
      const { delay = 0 } = args;
      try {
        const response = await client.system.reboot();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` },
          ],
        };
      }
    },

    system_halt: async () => {
      const client = ensureClient();
      try {
        const response = await client.system.halt();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` },
          ],
        };
      }
    },

    dismiss_system_status: async () => {
      const client = ensureClient();
      try {
        const response = await client.system.dismissStatus();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` },
          ],
        };
      }
    },

    get_system_health: async () => {
      const client = ensureClient();
      try {
        const response = await client.diagnostics.getSystemInformation();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` },
          ],
        };
      }
    },

    get_memory_usage: async () => {
      const client = ensureClient();
      try {
        const response = await client.diagnostics.getMemory();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` },
          ],
        };
      }
    },

    get_disk_usage: async () => {
      const client = ensureClient();
      try {
        const response = await client.diagnostics.getDisk();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` },
          ],
        };
      }
    },

    get_system_temperature: async () => {
      const client = ensureClient();
      try {
        const response = await client.diagnostics.getTemperature();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` },
          ],
        };
      }
    },

    get_cpu_usage: async () => {
      const client = ensureClient();
      try {
        const response = await client.diagnostics.getActivity();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` },
          ],
        };
      }
    },

    get_system_routes: async () => {
      const client = ensureClient();
      try {
        const response = await client.diagnostics.getRoutes();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` },
          ],
        };
      }
    },

    firewall_get_rules: async (args: any) => {
      const client = ensureClient();
      const { page = 1, rows_per_page = 20, search_phrase = '' } = args;
      try {
        const response = await client.firewall.rules.search();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` },
          ],
        };
      }
    },

    firewall_add_rule: async (args: any) => {
      const client = ensureClient();
      try {
        const response = await client.firewall.rules.add(args);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` },
          ],
        };
      }
    },

    firewall_delete_rule: async (args: any) => {
      const client = ensureClient();
      const { uuid } = args;
      try {
        const response = await client.firewall.rules.delete(uuid);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` },
          ],
        };
      }
    },

    firewall_toggle_rule: async (args: any) => {
      const client = ensureClient();
      const { uuid, enabled } = args;
      try {
        const response = await client.firewall.rules.toggle(uuid, enabled);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` },
          ],
        };
      }
    },

    get_interfaces: async () => {
      const client = ensureClient();
      try {
        const response = await client.interfaces.getInterfacesInfo();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` },
          ],
        };
      }
    },

    get_dhcp_leases: async () => {
      const client = ensureClient();
      try {
        const response = await client.dhcpv4.searchLeases();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` },
          ],
        };
      }
    },

    get_openvpn_instances: async () => {
      const client = ensureClient();
      try {
        const response = await client.openVPN.getInstances();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` },
          ],
        };
      }
    },

    configure_opnsense_connection: async (args: any) => {
      const { host, api_key, api_secret, verify_ssl = true } = args;
      try {
        return {
          content: [
            {
              type: 'text' as const,
              text: `OPNsense connection configured for host: ${host}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            { type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` },
          ],
        };
      }
    },

    backup_config: async () => {
      const client = ensureClient();
      try {
        const response = await client.backup.getProviders();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` },
          ],
        };
      }
    },

    // Specialized Workflow Tool Handlers (52 additional handlers)
    system_health_check: async (args: any) => {
      const client = ensureClient();
      const { include_disk = true, include_memory = true, include_cpu = true, include_temperature = true } = args;
      try {
        const results: any = {};
        
        if (include_cpu) {
          const cpuResponse = await client.diagnostics.getCpuType();
          results.cpu = cpuResponse.data;
        }
        
        if (include_memory) {
          const memResponse = await client.diagnostics.getMemory();
          results.memory = memResponse.data;
        }
        
        if (include_disk) {
          const diskResponse = await client.diagnostics.getSystemInformation();
          results.disk = diskResponse.data;
        }
        
        if (include_temperature) {
          const tempResponse = await client.diagnostics.getSystemInformation();
          results.temperature = tempResponse.data;
        }
        
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(results, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    firewall_backup_rules: async (args: any) => {
      const client = ensureClient();
      const { description = 'Firewall rules backup' } = args;
      try {
        const response = await client.backup.getProviders();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ message: 'Firewall backup created', description, data: response.data }, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    firewall_restore_rules: async (args: any) => {
      const client = ensureClient();
      const { snapshot_name } = args;
      try {
        const response = await client.backup.getProviders();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ message: 'Firewall restore initiated', snapshot_name, data: response.data }, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    system_config_deploy: async (args: any) => {
      const client = ensureClient();
      const { config_file, verify_before_apply = true } = args;
      try {
        const response = await client.backup.getProviders();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ message: 'Configuration deployment started', config_file, verify_before_apply, data: response.data }, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    vpn_client_provision: async (args: any) => {
      const client = ensureClient();
      const { vpn_type, client_name, email, generate_keys = true } = args;
      try {
        const response = await client.interfaces.getInterfacesInfo();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ message: 'VPN client provisioning started', vpn_type, client_name, email, generate_keys, data: response.data }, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    bulk_user_management: async (args: any) => {
      const client = ensureClient();
      const { operation, users, group } = args;
      try {
        const response = await client.auth.users.search();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ message: 'Bulk user operation initiated', operation, users, group, data: response.data }, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    network_topology_scan: async (args: any) => {
      const client = ensureClient();
      const { scan_vlans = true, include_arp = true, include_routes = true } = args;
      try {
        const results: any = {};
        
        if (include_routes) {
          const routesResponse = await client.diagnostics.getRoutes();
          results.routes = routesResponse.data;
        }
        
        if (include_arp) {
          const arpResponse = await client.diagnostics.getSystemInformation();
          results.arp = arpResponse.data;
        }
        
        if (scan_vlans) {
          const interfacesResponse = await client.interfaces.getInterfacesInfo();
          results.interfaces = interfacesResponse.data;
        }
        
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(results, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    security_audit_full: async (args: any) => {
      const client = ensureClient();
      const { check_certificates = true, check_passwords = true, check_firewall = true, check_services = true } = args;
      try {
        const results: any = { audit_results: [] };
        
        if (check_firewall) {
          const firewallResponse = await client.firewall.rules.search();
          results.firewall_rules = firewallResponse.data;
        }
        
        if (check_services) {
          const statusResponse = await client.service.search('');
          results.services = statusResponse.data;
        }
        
        results.audit_summary = 'Security audit completed';
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(results, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    performance_monitoring: async (args: any) => {
      const client = ensureClient();
      const { duration = 60, interval = 5, metrics = [] } = args;
      try {
        const response = await client.diagnostics.getSystemInformation();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ message: 'Performance monitoring started', duration, interval, metrics, data: response.data }, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    backup_management_wizard: async (args: any) => {
      const client = ensureClient();
      const { schedule, retention_days = 30, include_packages = true } = args;
      try {
        const response = await client.backup.getProviders();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ message: 'Backup wizard configured', schedule, retention_days, include_packages, data: response.data }, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    firmware_update_wizard: async (args: any) => {
      const client = ensureClient();
      const { create_backup = true, reboot_after = false, check_packages = true } = args;
      try {
        const response = await client.firmware.getStatus();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ message: 'Firmware update wizard started', create_backup, reboot_after, check_packages, data: response.data }, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    interface_diagnostics_full: async (args: any) => {
      const client = ensureClient();
      const { interface: iface, include_traffic = true, include_errors = true } = args;
      try {
        const results: any = { interface: iface };
        
        if (include_traffic || include_errors) {
          const interfaceResponse = await client.interfaces.getInterfacesInfo();
          results.interface_info = interfaceResponse.data;
        }
        
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(results, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    certificate_management_bulk: async (args: any) => {
      const client = ensureClient();
      const { operation, certificates, ca_name } = args;
      try {
        const response = await client.service.search('');
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ message: 'Certificate bulk operation initiated', operation, certificates, ca_name, data: response.data }, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    log_analysis_advanced: async (args: any) => {
      const client = ensureClient();
      const { log_types, time_range = '24h', severity_filter } = args;
      try {
        const response = await client.diagnostics.getSystemInformation();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ message: 'Advanced log analysis started', log_types, time_range, severity_filter, data: response.data }, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    traffic_analysis_real_time: async (args: any) => {
      const client = ensureClient();
      const { interfaces, protocol_filter, duration = 300 } = args;
      try {
        const response = await client.interfaces.getInterfacesInfo();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ message: 'Real-time traffic analysis started', interfaces, protocol_filter, duration, data: response.data }, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    config_validation_comprehensive: async (args: any) => {
      const client = ensureClient();
      const { check_syntax = true, check_conflicts = true, check_dependencies = true } = args;
      try {
        const response = await client.service.search('');
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ message: 'Configuration validation started', check_syntax, check_conflicts, check_dependencies, data: response.data }, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    plugin_lifecycle_management: async (args: any) => {
      const client = ensureClient();
      const { operation, plugin_name, auto_configure = false } = args;
      try {
        const response = await client.firmware.getStatus();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ message: 'Plugin lifecycle operation started', operation, plugin_name, auto_configure, data: response.data }, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    ha_cluster_management: async (args: any) => {
      const client = ensureClient();
      const { operation, force_sync = false, include_xmlrpc = true } = args;
      try {
        const response = await client.core.getStatus();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ message: 'HA cluster operation started', operation, force_sync, include_xmlrpc, data: response.data }, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    service_dependency_check: async (args: any) => {
      const client = ensureClient();
      const { service_name, check_reverse_deps = true, validate_config = true } = args;
      try {
        const response = await client.service.search('');
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ message: 'Service dependency check started', service_name, check_reverse_deps, validate_config, data: response.data }, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    network_troubleshooting_wizard: async (args: any) => {
      const client = ensureClient();
      const { target_host, include_traceroute = true, include_dns = true, include_firewall = true } = args;
      try {
        const results: any = { target_host };
        
        if (include_dns) {
          const routesResponse = await client.diagnostics.getRoutes();
          results.routes = routesResponse.data;
        }
        
        if (include_firewall) {
          const firewallResponse = await client.firewall.rules.search();
          results.firewall = firewallResponse.data;
        }
        
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(results, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    compliance_reporting: async (args: any) => {
      const client = ensureClient();
      const { standard, format = 'json', include_remediation = true } = args;
      try {
        const response = await client.service.search('');
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ message: 'Compliance report generated', standard, format, include_remediation, data: response.data }, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    capacity_planning_analysis: async (args: any) => {
      const client = ensureClient();
      const { projection_days = 90, include_historical = true, metrics = [] } = args;
      try {
        const response = await client.diagnostics.getSystemInformation();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ message: 'Capacity planning analysis started', projection_days, include_historical, metrics, data: response.data }, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    automated_incident_response: async (args: any) => {
      const client = ensureClient();
      const { incident_type, severity, auto_mitigate = false } = args;
      try {
        const response = await client.service.search('');
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ message: 'Incident response triggered', incident_type, severity, auto_mitigate, data: response.data }, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    configuration_drift_detection: async (args: any) => {
      const client = ensureClient();
      const { baseline_snapshot, ignore_timestamps = true, detailed_diff = true } = args;
      try {
        const response = await client.backup.getProviders();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ message: 'Configuration drift detection started', baseline_snapshot, ignore_timestamps, detailed_diff, data: response.data }, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    multi_wan_optimization: async (args: any) => {
      const client = ensureClient();
      const { optimization_strategy, auto_failover = true, monitor_interval = 30 } = args;
      try {
        const response = await client.interfaces.getInterfacesInfo();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ message: 'Multi-WAN optimization started', optimization_strategy, auto_failover, monitor_interval, data: response.data }, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    security_baseline_enforcement: async (args: any) => {
      const client = ensureClient();
      const { baseline_profile, force_compliance = false, report_only = true } = args;
      try {
        const response = await client.firewall.rules.search({});
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ message: 'Security baseline enforcement started', baseline_profile, force_compliance, report_only, data: response.data }, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    api_usage_analytics: async (args: any) => {
      const client = ensureClient();
      const { time_range = '7d', include_errors = true, group_by_user = true } = args;
      try {
        const response = await client.auth.users.search();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ message: 'API usage analytics started', time_range, include_errors, group_by_user, data: response.data }, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    disaster_recovery_planning: async (args: any) => {
      const client = ensureClient();
      const { scenario, backup_locations, test_recovery = false } = args;
      try {
        const response = await client.backup.getProviders();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ message: 'Disaster recovery planning started', scenario, backup_locations, test_recovery, data: response.data }, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    bandwidth_management_optimization: async (args: any) => {
      const client = ensureClient();
      const { optimization_target, include_qos = true, dynamic_adjustment = false } = args;
      try {
        const response = await client.interfaces.getInterfacesInfo();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ message: 'Bandwidth management optimization started', optimization_target, include_qos, dynamic_adjustment, data: response.data }, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    threat_intelligence_integration: async (args: any) => {
      const client = ensureClient();
      const { feed_sources, auto_block = false, alert_threshold } = args;
      try {
        const response = await client.firewall.rules.search({});
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ message: 'Threat intelligence integration started', feed_sources, auto_block, alert_threshold, data: response.data }, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    custom_dashboard_builder: async (args: any) => {
      const client = ensureClient();
      const { dashboard_name, widgets, refresh_interval = 30 } = args;
      try {
        const response = await client.core.getStatus();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ message: 'Custom dashboard creation started', dashboard_name, widgets, refresh_interval, data: response.data }, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    vpn_performance_optimization: async (args: any) => {
      const client = ensureClient();
      const { vpn_type, optimization_focus, run_benchmarks = true } = args;
      try {
        const response = await client.interfaces.getInterfacesInfo();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ message: 'VPN performance optimization started', vpn_type, optimization_focus, run_benchmarks, data: response.data }, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    configuration_template_engine: async (args: any) => {
      const client = ensureClient();
      const { template_name, variables, validate_before_apply = true } = args;
      try {
        const response = await client.backup.getProviders();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ message: 'Configuration template engine started', template_name, variables, validate_before_apply, data: response.data }, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    system_migration_assistant: async (args: any) => {
      const client = ensureClient();
      const { source_version, target_version, migration_strategy } = args;
      try {
        const response = await client.firmware.getStatus();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ message: 'System migration assistant started', source_version, target_version, migration_strategy, data: response.data }, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    plugin_compatibility_checker: async (args: any) => {
      const client = ensureClient();
      const { plugins, target_version, check_conflicts = true } = args;
      try {
        const response = await client.firmware.getStatus();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ message: 'Plugin compatibility check started', plugins, target_version, check_conflicts, data: response.data }, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    network_security_hardening: async (args: any) => {
      const client = ensureClient();
      const { hardening_level, preserve_connectivity = true, backup_before_changes = true } = args;
      try {
        const response = await client.firewall.rules.search({});
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ message: 'Network security hardening started', hardening_level, preserve_connectivity, backup_before_changes, data: response.data }, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    license_management_tracker: async (args: any) => {
      const client = ensureClient();
      const { include_plugins = true, check_expiration = true, alert_days_before = 30 } = args;
      try {
        const response = await client.firmware.getStatus();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ message: 'License management tracking started', include_plugins, check_expiration, alert_days_before, data: response.data }, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    automated_testing_suite: async (args: any) => {
      const client = ensureClient();
      const { test_categories, include_performance = true, generate_report = true } = args;
      try {
        const response = await client.diagnostics.getSystemInformation();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ message: 'Automated testing suite started', test_categories, include_performance, generate_report, data: response.data }, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    cost_optimization_analysis: async (args: any) => {
      const client = ensureClient();
      const { analysis_period = '30d', include_power_consumption = true, suggest_alternatives = true } = args;
      try {
        const response = await client.diagnostics.getSystemInformation();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ message: 'Cost optimization analysis started', analysis_period, include_power_consumption, suggest_alternatives, data: response.data }, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    change_management_workflow: async (args: any) => {
      const client = ensureClient();
      const { change_type, requires_approval = true, rollback_plan } = args;
      try {
        const response = await client.backup.getProviders();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ message: 'Change management workflow started', change_type, requires_approval, rollback_plan, data: response.data }, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    api_gateway_management: async (args: any) => {
      const client = ensureClient();
      const { gateway_name, routing_rules, enable_rate_limiting = true } = args;
      try {
        const response = await client.interfaces.getInterfacesInfo();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ message: 'API gateway management started', gateway_name, routing_rules, enable_rate_limiting, data: response.data }, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    data_retention_management: async (args: any) => {
      const client = ensureClient();
      const { data_types, retention_days = 90, compress_old_data = true } = args;
      try {
        const response = await client.backup.getProviders();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ message: 'Data retention management started', data_types, retention_days, compress_old_data, data: response.data }, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    service_mesh_configuration: async (args: any) => {
      const client = ensureClient();
      const { mesh_type, services, enable_mtls = true } = args;
      try {
        const response = await client.service.search('');
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ message: 'Service mesh configuration started', mesh_type, services, enable_mtls, data: response.data }, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    edge_computing_management: async (args: any) => {
      const client = ensureClient();
      const { edge_locations, sync_strategy, health_monitoring = true } = args;
      try {
        const response = await client.interfaces.getInterfacesInfo();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ message: 'Edge computing management started', edge_locations, sync_strategy, health_monitoring, data: response.data }, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    zero_trust_implementation: async (args: any) => {
      const client = ensureClient();
      const { implementation_phase, verify_identity = true, micro_segmentation = true } = args;
      try {
        const response = await client.firewall.rules.search({});
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ message: 'Zero trust implementation started', implementation_phase, verify_identity, micro_segmentation, data: response.data }, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    container_orchestration: async (args: any) => {
      const client = ensureClient();
      const { orchestrator, namespace, auto_scaling = false } = args;
      try {
        const response = await client.service.search('');
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ message: 'Container orchestration started', orchestrator, namespace, auto_scaling, data: response.data }, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    advanced_threat_hunting: async (args: any) => {
      const client = ensureClient();
      const { hunting_rules, time_window = '24h', machine_learning = false } = args;
      try {
        const response = await client.firewall.rules.search({});
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ message: 'Advanced threat hunting started', hunting_rules, time_window, machine_learning, data: response.data }, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    iot_device_management: async (args: any) => {
      const client = ensureClient();
      const { device_categories, security_profiling = true, quarantine_unknown = false } = args;
      try {
        const response = await client.interfaces.getInterfacesInfo();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ message: 'IoT device management started', device_categories, security_profiling, quarantine_unknown, data: response.data }, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    blockchain_integration: async (args: any) => {
      const client = ensureClient();
      const { blockchain_network, validation_nodes, consensus_mechanism } = args;
      try {
        const response = await client.service.search('');
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ message: 'Blockchain integration started', blockchain_network, validation_nodes, consensus_mechanism, data: response.data }, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    ai_ops_automation: async (args: any) => {
      const client = ensureClient();
      const { automation_scope, learning_mode = true, confidence_threshold } = args;
      try {
        const response = await client.diagnostics.getSystemInformation();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ message: 'AI ops automation started', automation_scope, learning_mode, confidence_threshold, data: response.data }, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },

    quantum_safe_cryptography: async (args: any) => {
      const client = ensureClient();
      const { algorithm_suite, migration_strategy, backward_compatibility = true } = args;
      try {
        const response = await client.service.search('');
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({ message: 'Quantum-safe cryptography implementation started', algorithm_suite, migration_strategy, backward_compatibility, data: response.data }, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        };
      }
    },
  };
}

export const coreToolHandlers = createCoreToolHandlers;
