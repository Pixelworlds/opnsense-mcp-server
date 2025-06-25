import type { ResourceDefinition } from './types.js';

export const OPNSENSE_RESOURCES: Record<string, ResourceDefinition> = {
  'system/status': {
    uri: 'opnsense://system/status',
    name: 'System Status',
    description: 'Current system status including performance metrics',
    mimeType: 'application/json',
    schema: {
      type: 'object',
      properties: {
        uptime: { type: 'string', description: 'System uptime' },
        cpu_usage: { type: 'number', description: 'CPU usage percentage' },
        memory_usage: { type: 'number', description: 'Memory usage percentage' },
      },
    },
  },
  'firewall/rules': {
    uri: 'opnsense://firewall/rules',
    name: 'Firewall Rules',
    description: 'Firewall rule configuration',
    mimeType: 'application/json',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'integer', description: 'Total number of rules' },
        rows: {
          type: 'array',
          description: 'Array of firewall rules',
          items: {
            type: 'object',
            properties: {
              uuid: { type: 'string', description: 'Rule UUID' },
              enabled: { type: 'boolean', description: 'Rule enabled status' },
            },
          },
        },
      },
    },
  },
};
