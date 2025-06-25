export interface EnhancedToolDefinition {
  name: string;
  displayName: string;
  description: string;
  detailedDescription?: string;
  category: string;
  subcategory?: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
  examples?: ToolExample[];
  relatedTools?: string[];
  permissions?: string[];
  sideEffects?: string[];
  bestPractices?: string[];
}

export interface ToolExample {
  description: string;
  input: Record<string, any>;
  expectedOutput?: string;
}

export const ENHANCED_TOOL_DESCRIPTIONS: Record<string, EnhancedToolDefinition> = {
  get_system_status: {
    name: 'get_system_status',
    displayName: 'Get System Status',
    description:
      'Retrieve comprehensive OPNsense system status including uptime, resource usage, and version information',
    detailedDescription:
      'Provides a complete overview of the system health including CPU usage, memory consumption, disk space, system uptime, kernel version, and current system load. Essential for monitoring and troubleshooting.',
    category: 'System Management',
    subcategory: 'Monitoring',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    examples: [
      {
        description: 'Get current system status',
        input: {},
        expectedOutput: 'System status with uptime, CPU/memory usage, disk space, and version info',
      },
    ],
    relatedTools: ['get_system_health', 'get_cpu_usage', 'get_memory_usage'],
    permissions: ['system.status.read'],
    bestPractices: [
      'Check system status before performing maintenance',
      'Monitor regularly for performance issues',
      'Use with other diagnostic tools for comprehensive analysis',
    ],
  },

  system_reboot: {
    name: 'system_reboot',
    displayName: 'Reboot System',
    description: 'Initiate a controlled system reboot of the OPNsense firewall',
    detailedDescription:
      'Performs a graceful system reboot with proper service shutdown. Can be scheduled with a delay. All active connections will be terminated.',
    category: 'System Management',
    subcategory: 'Control',
    inputSchema: {
      type: 'object',
      properties: {
        delay: {
          type: 'integer',
          description: 'Delay in seconds before reboot (0-3600)',
          default: 0,
          minimum: 0,
          maximum: 3600,
        },
      },
    },
    examples: [
      {
        description: 'Immediate reboot',
        input: {},
        expectedOutput: 'Reboot initiated',
      },
      {
        description: 'Reboot in 5 minutes',
        input: { delay: 300 },
        expectedOutput: 'Reboot scheduled in 300 seconds',
      },
    ],
    sideEffects: [
      'All active connections will be terminated',
      'Services will be temporarily unavailable',
      'VPN connections will need to reconnect',
    ],
    permissions: ['system.reboot'],
    bestPractices: [
      'Always create a configuration backup before rebooting',
      'Notify users before scheduled reboots',
      'Ensure remote access is properly configured',
    ],
  },

  firewall_get_rules: {
    name: 'firewall_get_rules',
    displayName: 'Get Firewall Rules',
    description: 'Retrieve and search firewall filter rules with pagination support',
    detailedDescription:
      'Lists all configured firewall rules with filtering and pagination capabilities. Returns rule details including action, interfaces, protocols, source/destination, and descriptions.',
    category: 'Firewall Management',
    subcategory: 'Rules',
    inputSchema: {
      type: 'object',
      properties: {
        page: {
          type: 'integer',
          default: 1,
          description: 'Page number for pagination',
        },
        rows_per_page: {
          type: 'integer',
          default: 20,
          description: 'Number of rules per page (max 100)',
        },
        search_phrase: {
          type: 'string',
          default: '',
          description: 'Search filter for rule descriptions or addresses',
        },
      },
    },
    examples: [
      {
        description: 'Get all firewall rules',
        input: {},
        expectedOutput: 'List of firewall rules with details',
      },
      {
        description: 'Search for HTTP rules',
        input: { search_phrase: 'HTTP' },
        expectedOutput: 'Filtered list of rules containing "HTTP"',
      },
    ],
    relatedTools: ['firewall_add_rule', 'update_firewall_rule', 'firewall_delete_rule'],
    permissions: ['firewall.rules.read'],
    bestPractices: [
      'Use search filters to find specific rules quickly',
      'Review rules regularly for security',
      'Document rule purposes in descriptions',
    ],
  },

  firewall_add_rule: {
    name: 'firewall_add_rule',
    displayName: 'Add Firewall Rule',
    description: 'Create a new firewall filter rule with specified parameters',
    detailedDescription:
      'Adds a new firewall rule to control traffic flow. Supports all standard firewall rule options including interfaces, protocols, ports, and actions. Rules are added but not automatically applied.',
    category: 'Firewall Management',
    subcategory: 'Rules',
    inputSchema: {
      type: 'object',
      properties: {
        enabled: {
          type: 'boolean',
          default: true,
          description: 'Enable rule immediately',
        },
        interface: {
          type: 'string',
          default: 'lan',
          description: 'Interface to apply rule (lan, wan, opt1, etc.)',
          enum: ['lan', 'wan', 'opt1', 'opt2', 'opt3', 'opt4'],
        },
        direction: {
          type: 'string',
          default: 'in',
          description: 'Traffic direction',
          enum: ['in', 'out'],
        },
        ipprotocol: {
          type: 'string',
          default: 'inet',
          description: 'IP protocol version',
          enum: ['inet', 'inet6', 'inet46'],
        },
        protocol: {
          type: 'string',
          default: 'any',
          description: 'Protocol to match',
          enum: ['any', 'tcp', 'udp', 'tcp/udp', 'icmp', 'esp', 'ah', 'gre', 'igmp', 'pim', 'ospf'],
        },
        source_net: {
          type: 'string',
          default: 'any',
          description: 'Source address (IP, network, alias, or "any")',
        },
        source_port: {
          type: 'string',
          default: '',
          description: 'Source port or range (e.g., "80", "80-443")',
        },
        destination_net: {
          type: 'string',
          default: 'any',
          description: 'Destination address (IP, network, alias, or "any")',
        },
        destination_port: {
          type: 'string',
          default: '',
          description: 'Destination port or range',
        },
        action: {
          type: 'string',
          default: 'pass',
          description: 'Action to take',
          enum: ['pass', 'block', 'reject'],
        },
        description: {
          type: 'string',
          description: 'Rule description (required)',
        },
        log: {
          type: 'boolean',
          default: false,
          description: 'Enable logging for this rule',
        },
        category: {
          type: 'string',
          description: 'Rule category for organization',
        },
      },
      required: ['description'],
    },
    examples: [
      {
        description: 'Allow HTTP traffic from LAN',
        input: {
          interface: 'lan',
          direction: 'in',
          protocol: 'tcp',
          destination_port: '80',
          action: 'pass',
          description: 'Allow HTTP from LAN',
        },
      },
      {
        description: 'Block specific IP address',
        input: {
          interface: 'wan',
          direction: 'in',
          source_net: '192.168.1.100',
          action: 'block',
          description: 'Block suspicious IP',
          log: true,
        },
      },
    ],
    relatedTools: ['firewall_apply', 'firewall_savepoint', 'firewall_move_rule'],
    permissions: ['firewall.rules.write'],
    sideEffects: [
      'Rule is added but not active until firewall_apply is called',
      'May affect existing traffic flows when applied',
    ],
    bestPractices: [
      'Always add a descriptive comment',
      'Test rules in a non-production environment first',
      'Create a savepoint before adding multiple rules',
      'Apply rules after verification',
    ],
  },

  get_firewall_aliases: {
    name: 'get_firewall_aliases',
    displayName: 'Get Firewall Aliases',
    description: 'Retrieve configured firewall aliases with search and pagination',
    detailedDescription:
      'Lists all firewall aliases which are named groups of IP addresses, networks, or ports. Aliases simplify rule management by allowing updates to multiple rules through a single alias change.',
    category: 'Firewall Management',
    subcategory: 'Aliases',
    inputSchema: {
      type: 'object',
      properties: {
        page: {
          type: 'integer',
          default: 1,
          description: 'Page number',
        },
        rows_per_page: {
          type: 'integer',
          default: 20,
          description: 'Results per page',
        },
        search_phrase: {
          type: 'string',
          default: '',
          description: 'Search filter',
        },
      },
    },
    examples: [
      {
        description: 'List all aliases',
        input: {},
        expectedOutput: 'List of all configured aliases with types and content counts',
      },
    ],
    relatedTools: ['add_firewall_alias', 'add_to_alias', 'list_alias_contents'],
    permissions: ['firewall.alias.read'],
    bestPractices: [
      'Use aliases for frequently referenced address groups',
      'Name aliases descriptively',
      'Document alias purposes',
    ],
  },

  add_to_alias: {
    name: 'add_to_alias',
    displayName: 'Add to Alias',
    description: 'Add an IP address or hostname to an existing firewall alias',
    detailedDescription:
      'Dynamically adds entries to firewall aliases. Useful for blocklists, allowlists, or managing dynamic address groups. Changes take effect immediately.',
    category: 'Firewall Management',
    subcategory: 'Aliases',
    inputSchema: {
      type: 'object',
      properties: {
        alias_name: {
          type: 'string',
          description: 'Name of the target alias',
        },
        address: {
          type: 'string',
          description: 'IP address, network (CIDR), or hostname to add',
        },
      },
      required: ['alias_name', 'address'],
    },
    examples: [
      {
        description: 'Add IP to blocklist',
        input: {
          alias_name: 'BlockedIPs',
          address: '192.168.1.100',
        },
      },
      {
        description: 'Add network to alias',
        input: {
          alias_name: 'TrustedNetworks',
          address: '10.0.0.0/24',
        },
      },
    ],
    relatedTools: ['delete_from_alias', 'flush_alias', 'list_alias_contents'],
    permissions: ['firewall.alias.write'],
    sideEffects: ['Immediately affects all rules using this alias', 'May block or allow traffic instantly'],
    bestPractices: [
      'Verify address format before adding',
      'Check if address already exists in alias',
      'Monitor rule impacts after changes',
    ],
  },

  get_interfaces: {
    name: 'get_interfaces',
    displayName: 'Get Network Interfaces',
    description: 'Retrieve information about all configured network interfaces',
    detailedDescription:
      'Provides comprehensive details about all network interfaces including configuration, IP addresses, status, statistics, and hardware information.',
    category: 'Network Management',
    subcategory: 'Interfaces',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    examples: [
      {
        description: 'Get all interface information',
        input: {},
        expectedOutput: 'Detailed interface list with status, IPs, and configuration',
      },
    ],
    relatedTools: ['get_interface_details', 'reload_interface', 'get_interface_statistics'],
    permissions: ['interfaces.read'],
    bestPractices: [
      'Check interface status before making changes',
      'Monitor interface statistics for issues',
      'Document interface purposes',
    ],
  },

  search_openvpn_instances: {
    name: 'search_openvpn_instances',
    displayName: 'Search OpenVPN Instances',
    description: 'Search and list configured OpenVPN server and client instances',
    detailedDescription:
      'Lists all OpenVPN configurations including servers and clients. Shows status, configuration details, and connection information for management and monitoring.',
    category: 'VPN Management',
    subcategory: 'OpenVPN',
    inputSchema: {
      type: 'object',
      properties: {
        current: {
          type: 'integer',
          default: 1,
          description: 'Current page',
        },
        rowCount: {
          type: 'integer',
          default: 20,
          description: 'Results per page',
        },
        searchPhrase: {
          type: 'string',
          description: 'Search filter',
        },
      },
    },
    examples: [
      {
        description: 'List all OpenVPN instances',
        input: {},
        expectedOutput: 'List of OpenVPN servers and clients with status',
      },
    ],
    relatedTools: ['add_openvpn_instance', 'toggle_openvpn_instance', 'start_openvpn_service'],
    permissions: ['openvpn.read'],
    bestPractices: [
      'Regular review of VPN configurations',
      'Monitor active connections',
      'Keep certificates up to date',
    ],
  },

  search_ipsec_connections: {
    name: 'search_ipsec_connections',
    displayName: 'Search IPsec Connections',
    description: 'Search and list configured IPsec VPN connections',
    detailedDescription:
      'Provides a list of all IPsec tunnel configurations including Phase 1 and Phase 2 settings, status, and peer information.',
    category: 'VPN Management',
    subcategory: 'IPsec',
    inputSchema: {
      type: 'object',
      properties: {
        current: {
          type: 'integer',
          default: 1,
          description: 'Current page',
        },
        rowCount: {
          type: 'integer',
          default: 20,
          description: 'Results per page',
        },
        searchPhrase: {
          type: 'string',
          description: 'Search filter',
        },
      },
    },
    examples: [
      {
        description: 'List all IPsec connections',
        input: {},
        expectedOutput: 'List of IPsec tunnels with configuration and status',
      },
    ],
    relatedTools: ['add_ipsec_connection', 'toggle_ipsec_connection', 'start_ipsec'],
    permissions: ['ipsec.read'],
    bestPractices: [
      'Regularly verify tunnel status',
      'Monitor for failed connection attempts',
      'Keep pre-shared keys secure',
    ],
  },

  search_users: {
    name: 'search_users',
    displayName: 'Search Users',
    description: 'Search and list system users with filtering capabilities',
    detailedDescription:
      'Lists all local system users including their groups, privileges, and API key status. Essential for user audit and management.',
    category: 'User Management',
    subcategory: 'Users',
    inputSchema: {
      type: 'object',
      properties: {
        current: {
          type: 'integer',
          default: 1,
          description: 'Current page',
        },
        rowCount: {
          type: 'integer',
          default: 20,
          description: 'Results per page',
        },
        searchPhrase: {
          type: 'string',
          description: 'Search by username or full name',
        },
      },
    },
    examples: [
      {
        description: 'List all users',
        input: {},
        expectedOutput: 'List of users with groups and status',
      },
      {
        description: 'Search for admin users',
        input: { searchPhrase: 'admin' },
        expectedOutput: 'Filtered list of admin users',
      },
    ],
    relatedTools: ['add_user', 'update_user', 'delete_user', 'add_api_key'],
    permissions: ['auth.users.read'],
    bestPractices: [
      'Regular user audits',
      'Remove inactive accounts',
      'Use strong password policies',
      'Limit administrative access',
    ],
  },

  get_firewall_logs: {
    name: 'get_firewall_logs',
    displayName: 'Get Firewall Logs',
    description: 'Retrieve recent firewall log entries with filtering options',
    detailedDescription:
      'Fetches firewall logs showing blocked and allowed traffic. Essential for security monitoring, troubleshooting connectivity issues, and analyzing traffic patterns.',
    category: 'Diagnostics',
    subcategory: 'Logs',
    inputSchema: {
      type: 'object',
      properties: {
        count: {
          type: 'integer',
          default: 100,
          description: 'Number of log entries to retrieve (max 1000)',
          maximum: 1000,
        },
        filter_text: {
          type: 'string',
          default: '',
          description: 'Filter logs by IP, port, or interface',
        },
      },
    },
    examples: [
      {
        description: 'Get recent firewall logs',
        input: { count: 50 },
        expectedOutput: 'Last 50 firewall log entries',
      },
      {
        description: 'Search for blocked traffic',
        input: { filter_text: 'block' },
        expectedOutput: 'Filtered logs showing blocked connections',
      },
    ],
    relatedTools: ['get_pf_states', 'query_pf_states', 'perform_firewall_audit'],
    permissions: ['diagnostics.logs.read'],
    bestPractices: [
      'Regular log review for security',
      'Set up alerts for suspicious activity',
      'Archive logs for compliance',
      'Use filters to focus on specific issues',
    ],
  },

  wireguard_get_status: {
    name: 'wireguard_get_status',
    displayName: 'Get WireGuard Status',
    description: 'Get WireGuard VPN service status and configuration state',
    detailedDescription:
      'Retrieves the current status of the WireGuard VPN service including running state, configured tunnels, and active connections.',
    category: 'Plugin Management',
    subcategory: 'WireGuard',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    examples: [
      {
        description: 'Check WireGuard service status',
        input: {},
        expectedOutput: 'Service status, tunnel count, and connection details',
      },
    ],
    relatedTools: ['wireguard_get_config', 'wireguard_search_servers', 'wireguard_search_clients'],
    permissions: ['wireguard.read'],
    bestPractices: [
      'Check status before configuration changes',
      'Monitor for connection drops',
      'Verify after service restarts',
    ],
  },

  perform_firewall_audit: {
    name: 'perform_firewall_audit',
    displayName: 'Perform Firewall Audit',
    description: 'Run a comprehensive security audit on firewall configuration',
    detailedDescription:
      'Analyzes firewall rules for security issues including overly permissive rules, unused rules, rule conflicts, and best practice violations. Generates recommendations for improvements.',
    category: 'Security',
    subcategory: 'Audit',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    examples: [
      {
        description: 'Run security audit',
        input: {},
        expectedOutput: 'Detailed audit report with findings and recommendations',
      },
    ],
    relatedTools: ['firewall_get_rules', 'get_firewall_rule_stats', 'firmware_audit'],
    permissions: ['firewall.audit'],
    bestPractices: [
      'Run audits regularly',
      'Review and act on findings',
      'Document remediation actions',
      'Compare audits over time',
    ],
  },

  exec_api_call: {
    name: 'exec_api_call',
    displayName: 'Execute Custom API Call',
    description: 'Execute a custom OPNsense API call for advanced operations',
    detailedDescription:
      'Allows direct API calls to OPNsense endpoints not covered by standard tools. Useful for new features, custom modules, or advanced configurations.',
    category: 'Advanced',
    subcategory: 'API',
    inputSchema: {
      type: 'object',
      properties: {
        method: {
          type: 'string',
          description: 'HTTP method',
          enum: ['GET', 'POST', 'PUT', 'DELETE'],
        },
        endpoint: {
          type: 'string',
          description: 'API endpoint path (e.g., /api/core/system/status)',
        },
        data: {
          type: 'object',
          description: 'Request body data for POST/PUT requests',
        },
      },
      required: ['method', 'endpoint'],
    },
    examples: [
      {
        description: 'Custom GET request',
        input: {
          method: 'GET',
          endpoint: '/api/core/system/status',
        },
      },
      {
        description: 'Custom POST request',
        input: {
          method: 'POST',
          endpoint: '/api/firewall/filter/apply',
          data: { rollback_revision: '1.2.3' },
        },
      },
    ],
    permissions: ['api.custom'],
    sideEffects: ['Depends on the endpoint called', 'May modify system configuration', 'No validation of parameters'],
    bestPractices: [
      'Test in non-production first',
      'Understand endpoint behavior',
      'Check API documentation',
      'Handle errors appropriately',
    ],
  },
};

export const TOOL_WORKFLOWS = {
  'Initial Setup': {
    description: 'Tools for initial OPNsense configuration',
    workflow: ['configure_opnsense_connection', 'get_system_status', 'get_interfaces', 'search_users', 'backup_config'],
  },
  'Security Hardening': {
    description: 'Tools for securing OPNsense installation',
    workflow: [
      'perform_firewall_audit',
      'firewall_get_rules',
      'search_users',
      'search_api_keys',
      'firmware_audit',
      'add_firewall_alias',
      'firewall_apply',
    ],
  },
  'Network Troubleshooting': {
    description: 'Tools for diagnosing network issues',
    workflow: [
      'get_interfaces',
      'get_interface_statistics',
      'get_arp_table',
      'get_system_routes',
      'dns_lookup',
      'get_firewall_logs',
      'get_pf_states',
    ],
  },
  'VPN Setup': {
    description: 'Tools for configuring VPN services',
    workflow: [
      'search_openvpn_instances',
      'add_openvpn_instance',
      'firewall_add_rule',
      'add_user',
      'start_openvpn_service',
      'firewall_apply',
    ],
  },
  Maintenance: {
    description: 'Tools for regular maintenance tasks',
    workflow: [
      'backup_config',
      'firmware_check_updates',
      'get_disk_usage',
      'flush_firewall_states',
      'search_services',
      'get_system_health',
    ],
  },
};

export const PARAMETER_PATTERNS = {
  pagination: {
    current: { type: 'integer', default: 1, description: 'Current page number' },
    rowCount: { type: 'integer', default: 20, description: 'Results per page' },
    searchPhrase: { type: 'string', description: 'Search filter text' },
  },
  uuid: {
    uuid: {
      type: 'string',
      required: true,
      description: 'Unique identifier',
      pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
    },
  },
  enabled: {
    enabled: { type: 'boolean', default: true, description: 'Enable/disable state' },
  },
  service: {
    service_name: { type: 'string', required: true, description: 'Service name' },
    service_id: { type: 'string', description: 'Service instance ID (optional)' },
  },
};

export const ERROR_PATTERNS = {
  authentication: {
    code: 401,
    message: 'Authentication failed',
    handling: 'Check API key and secret, verify user permissions',
  },
  not_found: {
    code: 404,
    message: 'Resource not found',
    handling: 'Verify UUID or resource exists, check for typos',
  },
  validation: {
    code: 400,
    message: 'Validation error',
    handling: 'Check required parameters, verify data types and formats',
  },
  permission: {
    code: 403,
    message: 'Permission denied',
    handling: 'Verify user has required permissions for operation',
  },
  conflict: {
    code: 409,
    message: 'Resource conflict',
    handling: 'Check for duplicate entries, ensure unique constraints',
  },
};
