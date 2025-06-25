import type { ResourceDefinition } from '../server/types.js';

export const pluginResources: Record<string, ResourceDefinition> = {
  'plugins/wireguard/status': {
    uri: 'opnsense://plugins/wireguard/status',
    name: 'WireGuard Status',
    description: 'WireGuard VPN service status and configuration',
    mimeType: 'application/json',
    schema: {
      type: 'object',
      properties: {
        enabled: { type: 'boolean', description: 'Service enabled status' },
        running: { type: 'boolean', description: 'Service running status' },
        clients: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Client name' },
              public_key: { type: 'string', description: 'Client public key' },
              endpoint: { type: 'string', description: 'Client endpoint' },
              last_handshake: { type: 'string', description: 'Last handshake time' },
            },
          },
        },
      },
    },
  },

  'plugins/nginx/status': {
    uri: 'opnsense://plugins/nginx/status',
    name: 'Nginx Status',
    description: 'Nginx web server status and configuration',
    mimeType: 'application/json',
    schema: {
      type: 'object',
      properties: {
        enabled: { type: 'boolean', description: 'Service enabled status' },
        running: { type: 'boolean', description: 'Service running status' },
        upstreams: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              uuid: { type: 'string', description: 'Upstream UUID' },
              description: { type: 'string', description: 'Upstream description' },
              server: { type: 'string', description: 'Backend server' },
            },
          },
        },
        servers: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              server_name: { type: 'string', description: 'Server name' },
              listen_port: { type: 'number', description: 'Listen port' },
              root: { type: 'string', description: 'Document root' },
            },
          },
        },
      },
    },
  },

  // HAProxy Plugin Resources
  'plugins/haproxy/status': {
    uri: 'opnsense://plugins/haproxy/status',
    name: 'HAProxy Status',
    description: 'HAProxy load balancer status and configuration',
    mimeType: 'application/json',
    schema: {
      type: 'object',
      properties: {
        enabled: { type: 'boolean', description: 'Service enabled status' },
        running: { type: 'boolean', description: 'Service running status' },
        frontends: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Frontend name' },
              bind_address: { type: 'string', description: 'Bind address' },
              bind_port: { type: 'number', description: 'Bind port' },
              default_backend: { type: 'string', description: 'Default backend' },
            },
          },
        },
        backends: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Backend name' },
              mode: { type: 'string', description: 'Backend mode' },
              servers: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', description: 'Server name' },
                    address: { type: 'string', description: 'Server address' },
                    port: { type: 'number', description: 'Server port' },
                    status: { type: 'string', description: 'Server status' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  // BIND DNS Plugin Resources
  'plugins/bind/status': {
    uri: 'opnsense://plugins/bind/status',
    name: 'BIND DNS Status',
    description: 'BIND DNS server status and zone configuration',
    mimeType: 'application/json',
    schema: {
      type: 'object',
      properties: {
        enabled: { type: 'boolean', description: 'Service enabled status' },
        running: { type: 'boolean', description: 'Service running status' },
        zones: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Zone name' },
              type: { type: 'string', description: 'Zone type' },
              file: { type: 'string', description: 'Zone file' },
              records: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', description: 'Record name' },
                    type: { type: 'string', description: 'Record type' },
                    value: { type: 'string', description: 'Record value' },
                    ttl: { type: 'number', description: 'Time to live' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  // Caddy Plugin Resources
  'plugins/caddy/status': {
    uri: 'opnsense://plugins/caddy/status',
    name: 'Caddy Status',
    description: 'Caddy web server status and configuration',
    mimeType: 'application/json',
    schema: {
      type: 'object',
      properties: {
        enabled: { type: 'boolean', description: 'Service enabled status' },
        running: { type: 'boolean', description: 'Service running status' },
        sites: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              domain: { type: 'string', description: 'Site domain' },
              root: { type: 'string', description: 'Document root' },
              tls: { type: 'boolean', description: 'TLS enabled' },
              auto_https: { type: 'boolean', description: 'Automatic HTTPS' },
            },
          },
        },
      },
    },
  },

  // CrowdSec Plugin Resources
  'plugins/crowdsec/status': {
    uri: 'opnsense://plugins/crowdsec/status',
    name: 'CrowdSec Status',
    description: 'CrowdSec security engine status and decisions',
    mimeType: 'application/json',
    schema: {
      type: 'object',
      properties: {
        enabled: { type: 'boolean', description: 'Service enabled status' },
        running: { type: 'boolean', description: 'Service running status' },
        decisions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', description: 'Decision ID' },
              source: { type: 'string', description: 'Source IP' },
              type: { type: 'string', description: 'Decision type' },
              scenario: { type: 'string', description: 'Detection scenario' },
              duration: { type: 'string', description: 'Ban duration' },
            },
          },
        },
        alerts: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', description: 'Alert ID' },
              scenario: { type: 'string', description: 'Alert scenario' },
              machine: { type: 'string', description: 'Source machine' },
              events_count: { type: 'number', description: 'Events count' },
            },
          },
        },
      },
    },
  },

  // Netdata Plugin Resources
  'plugins/netdata/status': {
    uri: 'opnsense://plugins/netdata/status',
    name: 'Netdata Status',
    description: 'Netdata monitoring system status and metrics',
    mimeType: 'application/json',
    schema: {
      type: 'object',
      properties: {
        enabled: { type: 'boolean', description: 'Service enabled status' },
        running: { type: 'boolean', description: 'Service running status' },
        metrics: {
          type: 'object',
          properties: {
            cpu: { type: 'number', description: 'CPU usage percentage' },
            memory: { type: 'number', description: 'Memory usage percentage' },
            disk: { type: 'number', description: 'Disk usage percentage' },
            network: {
              type: 'object',
              properties: {
                bytes_in: { type: 'number', description: 'Bytes received' },
                bytes_out: { type: 'number', description: 'Bytes transmitted' },
              },
            },
          },
        },
      },
    },
  },

  // NetSNMP Plugin Resources
  'plugins/netsnmp/status': {
    uri: 'opnsense://plugins/netsnmp/status',
    name: 'NetSNMP Status',
    description: 'NetSNMP service status and configuration',
    mimeType: 'application/json',
    schema: {
      type: 'object',
      properties: {
        enabled: { type: 'boolean', description: 'Service enabled status' },
        running: { type: 'boolean', description: 'Service running status' },
        community: { type: 'string', description: 'SNMP community string' },
        contact: { type: 'string', description: 'System contact' },
        location: { type: 'string', description: 'System location' },
      },
    },
  },
};
