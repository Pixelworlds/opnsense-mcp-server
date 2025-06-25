export interface ResourceDefinition {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
  schema?: ResourceSchema;
  examples?: ResourceExample[];
  relatedResources?: string[];
  accessPatterns?: AccessPattern[];
}

export interface ResourceSchema {
  type: string;
  properties: Record<string, PropertyDefinition>;
  required?: string[];
}

export interface PropertyDefinition {
  type: string;
  description: string;
  format?: string;
  enum?: string[];
  items?: PropertyDefinition;
  properties?: Record<string, PropertyDefinition>;
}

export interface ResourceExample {
  name: string;
  description: string;
  data: any;
}

export interface AccessPattern {
  pattern: string;
  description: string;
  example: string;
}

export const OPNSENSE_RESOURCES: Record<string, ResourceDefinition> = {
  'system/status': {
    uri: 'opnsense://system/status',
    name: 'System Status',
    description: 'Current system status including performance metrics and health information',
    mimeType: 'application/json',
    schema: {
      type: 'object',
      properties: {
        uptime: {
          type: 'string',
          description: 'System uptime in human readable format',
        },
        uptime_seconds: {
          type: 'integer',
          description: 'System uptime in seconds',
        },
        datetime: {
          type: 'string',
          format: 'date-time',
          description: 'Current system date and time',
        },
        kernel: {
          type: 'object',
          description: 'Kernel information',
          properties: {
            name: { type: 'string', description: 'Kernel name' },
            version: { type: 'string', description: 'Kernel version' },
            machine: { type: 'string', description: 'Machine architecture' },
          },
        },
        cpu: {
          type: 'object',
          description: 'CPU information and usage',
          properties: {
            model: { type: 'string', description: 'CPU model name' },
            cores: { type: 'integer', description: 'Number of CPU cores' },
            usage_percent: { type: 'number', description: 'Current CPU usage percentage' },
            load_average: {
              type: 'object',
              description: 'System load averages',
              properties: {
                '1min': { type: 'number', description: '1-minute load average' },
                '5min': { type: 'number', description: '5-minute load average' },
                '15min': { type: 'number', description: '15-minute load average' },
              },
            },
          },
        },
        memory: {
          type: 'object',
          description: 'Memory usage information',
          properties: {
            total_bytes: { type: 'integer', description: 'Total memory in bytes' },
            used_bytes: { type: 'integer', description: 'Used memory in bytes' },
            free_bytes: { type: 'integer', description: 'Free memory in bytes' },
            usage_percent: { type: 'number', description: 'Memory usage percentage' },
            swap_total: { type: 'integer', description: 'Total swap space in bytes' },
            swap_used: { type: 'integer', description: 'Used swap space in bytes' },
          },
        },
        disk: {
          type: 'object',
          description: 'Disk usage by mount point',
          properties: {
            mounts: {
              type: 'array',
              description: 'Filesystem mount points',
              items: {
                type: 'object',
                description: 'Mount point information',
                properties: {
                  mountpoint: { type: 'string', description: 'Mount point path' },
                  filesystem: { type: 'string', description: 'Filesystem type' },
                  total_bytes: { type: 'integer', description: 'Total disk space' },
                  used_bytes: { type: 'integer', description: 'Used disk space' },
                  available_bytes: { type: 'integer', description: 'Available disk space' },
                  usage_percent: { type: 'number', description: 'Disk usage percentage' },
                },
              },
            },
          },
        },
        temperature: {
          type: 'object',
          description: 'System temperature readings',
          properties: {
            cpu: { type: 'number', description: 'CPU temperature in Celsius' },
            sensors: {
              type: 'array',
              description: 'Temperature sensors',
              items: {
                type: 'object',
                description: 'Temperature sensor reading',
                properties: {
                  name: { type: 'string', description: 'Sensor name' },
                  temperature: { type: 'number', description: 'Temperature reading' },
                  unit: { type: 'string', description: 'Temperature unit' },
                },
              },
            },
          },
        },
      },
      required: ['uptime', 'datetime', 'kernel', 'cpu', 'memory'],
    },
    examples: [
      {
        name: 'Basic system status',
        description: 'Example system status response',
        data: {
          uptime: '7 days, 14:32:10',
          uptime_seconds: 658330,
          datetime: '2024-01-15T14:32:10Z',
          kernel: {
            name: 'FreeBSD',
            version: '13.2-RELEASE-p8',
            machine: 'amd64',
          },
          cpu: {
            model: 'Intel(R) Core(TM) i5-8400 CPU @ 2.80GHz',
            cores: 6,
            usage_percent: 15.2,
            load_average: {
              '1min': 0.12,
              '5min': 0.18,
              '15min': 0.15,
            },
          },
          memory: {
            total_bytes: 8589934592,
            used_bytes: 3221225472,
            free_bytes: 5368709120,
            usage_percent: 37.5,
            swap_total: 2147483648,
            swap_used: 0,
          },
        },
      },
    ],
    relatedResources: ['system/health', 'system/info'],
    accessPatterns: [
      {
        pattern: 'opnsense://system/status',
        description: 'Get current system status',
        example: 'get_system_status()',
      },
    ],
  },

  // Firewall Resources
  'firewall/rules': {
    uri: 'opnsense://firewall/rules',
    name: 'Firewall Rules',
    description: 'Firewall filter rules configuration and status',
    mimeType: 'application/json',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'integer', description: 'Total number of rules' },
        current: { type: 'integer', description: 'Current page' },
        rowCount: { type: 'integer', description: 'Rows per page' },
        rows: {
          type: 'array',
          description: 'Array of firewall rules',
          items: {
            type: 'object',
            description: 'Firewall rule definition',
            properties: {
              uuid: { type: 'string', description: 'Unique rule identifier' },
              enabled: { type: 'string', enum: ['0', '1'], description: 'Rule enabled state' },
              sequence: { type: 'integer', description: 'Rule order sequence' },
              action: { type: 'string', enum: ['pass', 'block', 'reject'], description: 'Rule action' },
              interface: { type: 'string', description: 'Network interface' },
              direction: { type: 'string', enum: ['in', 'out'], description: 'Traffic direction' },
              ipprotocol: { type: 'string', enum: ['inet', 'inet6', 'inet46'], description: 'IP protocol version' },
              protocol: { type: 'string', description: 'Protocol (tcp, udp, icmp, any)' },
              source_net: { type: 'string', description: 'Source network or address' },
              source_port: { type: 'string', description: 'Source port or range' },
              destination_net: { type: 'string', description: 'Destination network or address' },
              destination_port: { type: 'string', description: 'Destination port or range' },
              description: { type: 'string', description: 'Rule description' },
              log: { type: 'string', enum: ['0', '1'], description: 'Enable logging' },
              created: { type: 'string', format: 'date-time', description: 'Rule creation time' },
              updated: { type: 'string', format: 'date-time', description: 'Rule last update time' },
              category: { type: 'string', description: 'Rule category' },
            },
          },
        },
      },
      required: ['total', 'rows'],
    },
    examples: [
      {
        name: 'Rule list response',
        description: 'Example firewall rules response',
        data: {
          total: 25,
          current: 1,
          rowCount: 20,
          rows: [
            {
              uuid: '123e4567-e89b-12d3-a456-426614174000',
              enabled: '1',
              sequence: 1,
              action: 'pass',
              interface: 'lan',
              direction: 'in',
              ipprotocol: 'inet',
              protocol: 'tcp',
              source_net: 'any',
              source_port: '',
              destination_net: 'any',
              destination_port: '80',
              description: 'Allow HTTP traffic',
              log: '0',
              category: 'web',
            },
          ],
        },
      },
    ],
    relatedResources: ['firewall/aliases', 'firewall/states'],
    accessPatterns: [
      {
        pattern: 'opnsense://firewall/rules',
        description: 'Get all firewall rules',
        example: 'firewall_get_rules()',
      },
      {
        pattern: 'opnsense://firewall/rules/{uuid}',
        description: 'Get specific rule by UUID',
        example: 'get_firewall_rule(uuid="123e4567-e89b-12d3-a456-426614174000")',
      },
      {
        pattern: 'opnsense://firewall/rules?search={term}',
        description: 'Search rules by description or address',
        example: 'firewall_get_rules(search_phrase="HTTP")',
      },
    ],
  },

  'firewall/aliases': {
    uri: 'opnsense://firewall/aliases',
    name: 'Firewall Aliases',
    description: 'Named groups of IP addresses, networks, or ports used in firewall rules',
    mimeType: 'application/json',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'integer', description: 'Total number of aliases' },
        rows: {
          type: 'array',
          description: 'Array of aliases',
          items: {
            type: 'object',
            description: 'Firewall alias definition',
            properties: {
              uuid: { type: 'string', description: 'Unique alias identifier' },
              enabled: { type: 'string', enum: ['0', '1'], description: 'Alias enabled state' },
              name: { type: 'string', description: 'Alias name' },
              type: {
                type: 'string',
                enum: ['host', 'network', 'port', 'url', 'urltable'],
                description: 'Alias type',
              },
              content: { type: 'string', description: 'Alias content (addresses, networks, etc.)' },
              description: { type: 'string', description: 'Alias description' },
              counters: {
                type: 'object',
                description: 'Alias usage statistics',
                properties: {
                  match: { type: 'integer', description: 'Number of rule matches' },
                  bytes: { type: 'integer', description: 'Bytes processed' },
                  packets: { type: 'integer', description: 'Packets processed' },
                },
              },
            },
          },
        },
      },
      required: ['total', 'rows'],
    },
    examples: [
      {
        name: 'Alias list response',
        description: 'Example aliases response',
        data: {
          total: 10,
          rows: [
            {
              uuid: '223e4567-e89b-12d3-a456-426614174001',
              enabled: '1',
              name: 'RFC1918',
              type: 'network',
              content: '10.0.0.0/8 172.16.0.0/12 192.168.0.0/16',
              description: 'Private network ranges',
              counters: {
                match: 1250,
                bytes: 104857600,
                packets: 8192,
              },
            },
          ],
        },
      },
    ],
    relatedResources: ['firewall/rules'],
    accessPatterns: [
      {
        pattern: 'opnsense://firewall/aliases',
        description: 'Get all aliases',
        example: 'get_firewall_aliases()',
      },
      {
        pattern: 'opnsense://firewall/aliases/{name}/entries',
        description: 'Get alias entries',
        example: 'list_alias_contents(alias_name="RFC1918")',
      },
    ],
  },

  // Network Resources
  'interfaces/overview': {
    uri: 'opnsense://interfaces/overview',
    name: 'Network Interfaces',
    description: 'Network interface configuration and status information',
    mimeType: 'application/json',
    schema: {
      type: 'object',
      properties: {
        interfaces: {
          type: 'object',
          description: 'Interface definitions keyed by interface name',
          properties: {
            lan: {
              type: 'object',
              description: 'LAN interface configuration',
              properties: {
                enable: { type: 'boolean', description: 'Interface enabled state' },
                if: { type: 'string', description: 'Physical interface name' },
                descr: { type: 'string', description: 'Interface description' },
                ipaddr: { type: 'string', description: 'IPv4 address' },
                subnet: { type: 'integer', description: 'Subnet mask bits' },
                gateway: { type: 'string', description: 'Default gateway' },
                ipaddr6: { type: 'string', description: 'IPv6 address' },
                subnet6: { type: 'integer', description: 'IPv6 subnet bits' },
                gateway6: { type: 'string', description: 'IPv6 gateway' },
                media: { type: 'string', description: 'Interface media type' },
                mtu: { type: 'integer', description: 'Maximum transmission unit' },
                status: { type: 'string', enum: ['up', 'down'], description: 'Interface status' },
                macaddr: { type: 'string', description: 'MAC address' },
                statistics: {
                  type: 'object',
                  description: 'Interface traffic statistics',
                  properties: {
                    bytes_in: { type: 'integer', description: 'Bytes received' },
                    bytes_out: { type: 'integer', description: 'Bytes transmitted' },
                    packets_in: { type: 'integer', description: 'Packets received' },
                    packets_out: { type: 'integer', description: 'Packets transmitted' },
                    errors_in: { type: 'integer', description: 'Input errors' },
                    errors_out: { type: 'integer', description: 'Output errors' },
                  },
                },
              },
            },
          },
        },
      },
      required: ['interfaces'],
    },
    examples: [
      {
        name: 'Interface overview',
        description: 'Example interfaces response',
        data: {
          interfaces: {
            lan: {
              enable: true,
              if: 'em0',
              descr: 'LAN',
              ipaddr: '192.168.1.1',
              subnet: 24,
              gateway: '',
              status: 'up',
              macaddr: '00:1b:21:8a:7e:f0',
              statistics: {
                bytes_in: 1073741824,
                bytes_out: 2147483648,
                packets_in: 1048576,
                packets_out: 2097152,
                errors_in: 0,
                errors_out: 0,
              },
            },
            wan: {
              enable: true,
              if: 'em1',
              descr: 'WAN',
              ipaddr: 'dhcp',
              status: 'up',
              macaddr: '00:1b:21:8a:7e:f1',
            },
          },
        },
      },
    ],
    relatedResources: ['interfaces/vlans', 'diagnostics/arp'],
    accessPatterns: [
      {
        pattern: 'opnsense://interfaces/overview',
        description: 'Get all interfaces',
        example: 'get_interfaces()',
      },
      {
        pattern: 'opnsense://interfaces/overview/{name}',
        description: 'Get specific interface',
        example: 'get_interface_details(interface="lan")',
      },
    ],
  },

  // VPN Resources
  'vpn/openvpn': {
    uri: 'opnsense://vpn/openvpn',
    name: 'OpenVPN Instances',
    description: 'OpenVPN server and client configurations',
    mimeType: 'application/json',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'integer', description: 'Total instances' },
        rows: {
          type: 'array',
          description: 'OpenVPN instances',
          items: {
            type: 'object',
            description: 'OpenVPN instance configuration',
            properties: {
              uuid: { type: 'string', description: 'Instance UUID' },
              enabled: { type: 'string', enum: ['0', '1'], description: 'Instance enabled' },
              description: { type: 'string', description: 'Instance description' },
              role: { type: 'string', enum: ['server', 'client'], description: 'Instance role' },
              dev_type: { type: 'string', enum: ['tun', 'tap'], description: 'Device type' },
              protocol: { type: 'string', enum: ['udp', 'tcp'], description: 'Protocol' },
              port: { type: 'integer', description: 'Port number' },
              local: { type: 'string', description: 'Local address' },
              server: { type: 'string', description: 'Server subnet' },
              cert: { type: 'string', description: 'Certificate reference' },
              ca: { type: 'string', description: 'Certificate authority' },
              crl: { type: 'string', description: 'Certificate revocation list' },
              status: {
                type: 'object',
                description: 'OpenVPN instance status',
                properties: {
                  running: { type: 'boolean', description: 'Service running' },
                  connected_clients: { type: 'integer', description: 'Connected clients' },
                  bytes_sent: { type: 'integer', description: 'Bytes sent' },
                  bytes_received: { type: 'integer', description: 'Bytes received' },
                },
              },
            },
          },
        },
      },
    },
    examples: [
      {
        name: 'OpenVPN instances',
        description: 'Example OpenVPN instances',
        data: {
          total: 2,
          rows: [
            {
              uuid: '333e4567-e89b-12d3-a456-426614174002',
              enabled: '1',
              description: 'Remote Access Server',
              role: 'server',
              dev_type: 'tun',
              protocol: 'udp',
              port: 1194,
              server: '10.8.0.0/24',
              status: {
                running: true,
                connected_clients: 5,
                bytes_sent: 52428800,
                bytes_received: 26214400,
              },
            },
          ],
        },
      },
    ],
    relatedResources: ['vpn/ipsec', 'auth/users'],
    accessPatterns: [
      {
        pattern: 'opnsense://vpn/openvpn',
        description: 'Get all OpenVPN instances',
        example: 'search_openvpn_instances()',
      },
      {
        pattern: 'opnsense://vpn/openvpn/{uuid}',
        description: 'Get specific instance',
        example: 'get_openvpn_instance(uuid="333e4567-e89b-12d3-a456-426614174002")',
      },
    ],
  },

  // Diagnostic Resources
  'diagnostics/logs': {
    uri: 'opnsense://diagnostics/logs',
    name: 'System Logs',
    description: 'System and application log entries',
    mimeType: 'application/json',
    schema: {
      type: 'object',
      properties: {
        logs: {
          type: 'array',
          description: 'Log entries',
          items: {
            type: 'object',
            description: 'Log entry information',
            properties: {
              timestamp: { type: 'string', format: 'date-time', description: 'Log timestamp' },
              facility: { type: 'string', description: 'Log facility' },
              severity: { type: 'string', description: 'Log severity level' },
              program: { type: 'string', description: 'Program name' },
              message: { type: 'string', description: 'Log message' },
              pid: { type: 'integer', description: 'Process ID' },
              hostname: { type: 'string', description: 'Host name' },
            },
          },
        },
        filter: { type: 'string', description: 'Applied filter' },
        count: { type: 'integer', description: 'Number of entries returned' },
      },
    },
    examples: [
      {
        name: 'Firewall logs',
        description: 'Example firewall log entries',
        data: {
          logs: [
            {
              timestamp: '2024-01-15T14:32:10Z',
              facility: 'kern',
              severity: 'info',
              program: 'filterlog',
              message: 'block in on em1: 192.168.1.100:12345 -> 192.168.1.1:22 tcp',
              hostname: 'opnsense.local',
            },
          ],
          filter: 'firewall',
          count: 1,
        },
      },
    ],
    relatedResources: ['diagnostics/states', 'firewall/rules'],
    accessPatterns: [
      {
        pattern: 'opnsense://diagnostics/logs/firewall',
        description: 'Get firewall logs',
        example: 'get_firewall_logs()',
      },
      {
        pattern: 'opnsense://diagnostics/logs/system',
        description: 'Get system logs',
        example: 'get_system_logs()',
      },
    ],
  },
};

// Resource access control definitions
export const RESOURCE_PERMISSIONS = {
  'system/*': {
    read: ['system.status.read', 'admin'],
    write: ['system.config.write', 'admin'],
  },
  'firewall/*': {
    read: ['firewall.read', 'admin'],
    write: ['firewall.write', 'admin'],
  },
  'interfaces/*': {
    read: ['interfaces.read', 'admin'],
    write: ['interfaces.write', 'admin'],
  },
  'vpn/*': {
    read: ['vpn.read', 'admin'],
    write: ['vpn.write', 'admin'],
  },
  'diagnostics/*': {
    read: ['diagnostics.read', 'admin'],
    write: ['diagnostics.write', 'admin'],
  },
  'auth/*': {
    read: ['auth.read', 'admin'],
    write: ['auth.write', 'admin'],
  },
};

// Resource caching policies
export const RESOURCE_CACHING = {
  'system/status': {
    ttl: 30, // 30 seconds
    invalidateOn: ['system.reboot', 'system.config.change'],
  },
  'firewall/rules': {
    ttl: 300, // 5 minutes
    invalidateOn: ['firewall.rules.change', 'firewall.apply'],
  },
  'interfaces/overview': {
    ttl: 60, // 1 minute
    invalidateOn: ['interfaces.change', 'system.reboot'],
  },
  'diagnostics/logs': {
    ttl: 0, // No caching for logs
    invalidateOn: [],
  },
};

// Resource subscription topics for real-time updates
export const RESOURCE_SUBSCRIPTIONS = {
  'system/status': {
    topic: 'system.status.updated',
    frequency: '30s',
  },
  'firewall/states': {
    topic: 'firewall.states.changed',
    frequency: '10s',
  },
  'vpn/connections': {
    topic: 'vpn.connections.changed',
    frequency: '60s',
  },
  'diagnostics/logs': {
    topic: 'logs.new',
    frequency: 'realtime',
  },
};

// Resource relationship mappings
export const RESOURCE_RELATIONSHIPS = {
  'firewall/rules': {
    depends_on: ['firewall/aliases', 'interfaces/overview'],
    affects: ['firewall/states', 'diagnostics/logs'],
  },
  'firewall/aliases': {
    affects: ['firewall/rules', 'firewall/states'],
  },
  'interfaces/overview': {
    affects: ['firewall/rules', 'vpn/connections', 'diagnostics/logs'],
  },
  'vpn/openvpn': {
    depends_on: ['auth/users', 'interfaces/overview'],
    affects: ['firewall/states', 'diagnostics/logs'],
  },
};
