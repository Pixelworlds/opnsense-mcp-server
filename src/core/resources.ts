/**
 * Core OPNsense Resource Documentation
 * Defines resources specific to core OPNsense functionality
 */

import type { ResourceDefinition } from '../server/types.js';

export const coreResources: Record<string, ResourceDefinition> = {
  // System Resources
  'system/status': {
    uri: 'opnsense://system/status',
    name: 'System Status',
    description: 'Current system status including performance metrics and health information',
    mimeType: 'application/json',
    schema: {
      type: 'object',
      properties: {
        uptime: { type: 'string', description: 'System uptime' },
        cpu_usage: { type: 'number', description: 'CPU usage percentage' },
        memory_usage: { type: 'number', description: 'Memory usage percentage' },
        disk_usage: { type: 'number', description: 'Disk usage percentage' },
        temperature: { type: 'number', description: 'System temperature in Celsius' },
        version: { type: 'string', description: 'OPNsense version' },
      },
    },
  },

  // Firewall Resources
  'firewall/rules': {
    uri: 'opnsense://firewall/rules',
    name: 'Firewall Rules',
    description: 'Complete firewall rule configuration and status',
    mimeType: 'application/json',
    schema: {
      type: 'object',
      properties: {
        rules: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              uuid: { type: 'string', description: 'Rule UUID' },
              sequence: { type: 'number', description: 'Rule sequence number' },
              action: { type: 'string', enum: ['pass', 'block', 'reject'] },
              interface: { type: 'string', description: 'Interface name' },
              source: { type: 'string', description: 'Source address' },
              destination: { type: 'string', description: 'Destination address' },
              enabled: { type: 'boolean', description: 'Rule enabled status' },
            },
          },
        },
      },
    },
  },

  'firewall/aliases': {
    uri: 'opnsense://firewall/aliases',
    name: 'Firewall Aliases',
    description: 'Firewall alias definitions and contents',
    mimeType: 'application/json',
    schema: {
      type: 'object',
      properties: {
        aliases: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              uuid: { type: 'string', description: 'Alias UUID' },
              name: { type: 'string', description: 'Alias name' },
              type: { type: 'string', enum: ['host', 'network', 'port', 'url'] },
              content: { type: 'array', items: { type: 'string' } },
              enabled: { type: 'boolean', description: 'Alias enabled status' },
            },
          },
        },
      },
    },
  },

  // Network Resources
  'network/interfaces': {
    uri: 'opnsense://network/interfaces',
    name: 'Network Interfaces',
    description: 'Network interface configuration and statistics',
    mimeType: 'application/json',
    schema: {
      type: 'object',
      properties: {
        interfaces: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Interface name' },
              description: { type: 'string', description: 'Interface description' },
              ipv4: { type: 'string', description: 'IPv4 address' },
              status: { type: 'string', enum: ['up', 'down'] },
              bytes_in: { type: 'number', description: 'Bytes received' },
              bytes_out: { type: 'number', description: 'Bytes transmitted' },
            },
          },
        },
      },
    },
  },

  'network/dhcp': {
    uri: 'opnsense://network/dhcp',
    name: 'DHCP Configuration',
    description: 'DHCP server configuration and lease information',
    mimeType: 'application/json',
    schema: {
      type: 'object',
      properties: {
        config: {
          type: 'object',
          properties: {
            enabled: { type: 'boolean' },
            range_start: { type: 'string' },
            range_end: { type: 'string' },
            subnet: { type: 'string' },
          },
        },
        leases: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              ip: { type: 'string', description: 'IP address' },
              mac: { type: 'string', description: 'MAC address' },
              hostname: { type: 'string', description: 'Client hostname' },
              expires: { type: 'string', description: 'Lease expiration' },
            },
          },
        },
      },
    },
  },

  // VPN Resources
  'vpn/openvpn': {
    uri: 'opnsense://vpn/openvpn',
    name: 'OpenVPN Configuration',
    description: 'OpenVPN server and client configurations',
    mimeType: 'application/json',
    schema: {
      type: 'object',
      properties: {
        servers: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              uuid: { type: 'string' },
              description: { type: 'string' },
              enabled: { type: 'boolean' },
              port: { type: 'number' },
              protocol: { type: 'string', enum: ['tcp', 'udp'] },
            },
          },
        },
        sessions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              real_address: { type: 'string' },
              virtual_address: { type: 'string' },
              connected_since: { type: 'string' },
            },
          },
        },
      },
    },
  },

  'vpn/ipsec': {
    uri: 'opnsense://vpn/ipsec',
    name: 'IPsec Configuration',
    description: 'IPsec tunnel configurations and status',
    mimeType: 'application/json',
    schema: {
      type: 'object',
      properties: {
        connections: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              uuid: { type: 'string' },
              description: { type: 'string' },
              enabled: { type: 'boolean' },
              remote_gateway: { type: 'string' },
              local_subnet: { type: 'string' },
              remote_subnet: { type: 'string' },
            },
          },
        },
      },
    },
  },

  // User & Security Resources
  'users/accounts': {
    uri: 'opnsense://users/accounts',
    name: 'User Accounts',
    description: 'System user account information',
    mimeType: 'application/json',
    schema: {
      type: 'object',
      properties: {
        users: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              uuid: { type: 'string' },
              name: { type: 'string' },
              full_name: { type: 'string' },
              groups: { type: 'array', items: { type: 'string' } },
              disabled: { type: 'boolean' },
            },
          },
        },
      },
    },
  },

  'security/certificates': {
    uri: 'opnsense://security/certificates',
    name: 'SSL Certificates',
    description: 'SSL certificate management and status',
    mimeType: 'application/json',
    schema: {
      type: 'object',
      properties: {
        certificates: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              uuid: { type: 'string' },
              description: { type: 'string' },
              subject: { type: 'string' },
              issuer: { type: 'string' },
              valid_from: { type: 'string' },
              valid_to: { type: 'string' },
            },
          },
        },
      },
    },
  },
};
