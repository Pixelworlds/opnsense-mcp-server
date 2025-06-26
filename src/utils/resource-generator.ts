import type { Resource } from '@modelcontextprotocol/sdk/types.js';
import type { ServerContext, ResourceMetadata } from '../types/index.js';

// Core module resource definitions
const coreResources: Record<string, ResourceMetadata[]> = {
  system: [
    {
      uri: 'opnsense://system/status',
      name: 'System Status',
      description: 'Current system status and information',
      mimeType: 'application/json',
      module: 'system',
      isPlugin: false,
    },
    {
      uri: 'opnsense://system/info',
      name: 'System Information',
      description: 'Detailed system information and version',
      mimeType: 'application/json',
      module: 'system',
      isPlugin: false,
    },
  ],
  firewall: [
    {
      uri: 'opnsense://firewall/rules',
      name: 'Firewall Rules',
      description: 'List of configured firewall rules',
      mimeType: 'application/json',
      module: 'firewall',
      isPlugin: false,
    },
    {
      uri: 'opnsense://firewall/aliases',
      name: 'Firewall Aliases',
      description: 'Configured firewall aliases',
      mimeType: 'application/json',
      module: 'firewall',
      isPlugin: false,
    },
  ],
  interfaces: [
    {
      uri: 'opnsense://interfaces/overview',
      name: 'Network Interfaces',
      description: 'Overview of network interfaces',
      mimeType: 'application/json',
      module: 'interfaces',
      isPlugin: false,
    },
  ],
  diagnostics: [
    {
      uri: 'opnsense://diagnostics/system',
      name: 'System Diagnostics',
      description: 'System diagnostic information',
      mimeType: 'application/json',
      module: 'diagnostics',
      isPlugin: false,
    },
  ],
  services: [
    {
      uri: 'opnsense://services/status',
      name: 'Service Status',
      description: 'Status of all system services',
      mimeType: 'application/json',
      module: 'services',
      isPlugin: false,
    },
  ],
};

// Plugin module resource definitions
const pluginResources: Record<string, ResourceMetadata[]> = {
  wg_wireguard: [
    {
      uri: 'opnsense://plugins/wireguard/status',
      name: 'WireGuard Status',
      description: 'WireGuard VPN status and connections',
      mimeType: 'application/json',
      module: 'wg_wireguard',
      isPlugin: true,
    },
  ],
  nginx: [
    {
      uri: 'opnsense://plugins/nginx/status',
      name: 'Nginx Status',
      description: 'Nginx web server status',
      mimeType: 'application/json',
      module: 'nginx',
      isPlugin: true,
    },
  ],
  haproxy: [
    {
      uri: 'opnsense://plugins/haproxy/status',
      name: 'HAProxy Status',
      description: 'HAProxy load balancer status',
      mimeType: 'application/json',
      module: 'haproxy',
      isPlugin: true,
    },
  ],
  bind: [
    {
      uri: 'opnsense://plugins/bind/status',
      name: 'BIND DNS Status',
      description: 'BIND DNS server status',
      mimeType: 'application/json',
      module: 'bind',
      isPlugin: true,
    },
  ],
};

/**
 * Generate resources for available modules
 */
export function generateResources(context: ServerContext): Resource[] {
  const resources: Resource[] = [];

  // Add core resources
  for (const [moduleName, moduleResources] of Object.entries(coreResources)) {
    if (context.availableModules.has(`core.${moduleName}`)) {
      resources.push(...moduleResources.map(r => ({
        uri: r.uri,
        name: r.name,
        description: r.description,
        mimeType: r.mimeType,
      })));
    }
  }

  // Add plugin resources
  for (const [moduleName, moduleResources] of Object.entries(pluginResources)) {
    if (context.availableModules.has(`plugins.${moduleName}`)) {
      resources.push(...moduleResources.map(r => ({
        uri: r.uri,
        name: r.name,
        description: r.description,
        mimeType: r.mimeType,
      })));
    }
  }

  return resources;
}

/**
 * Handle resource read requests
 */
export async function handleResourceRead(
  uri: string,
  context: ServerContext
): Promise<{ contents: Array<{ uri: string; mimeType: string; text: string }> }> {
  if (!context.client) {
    throw new Error('OPNsense connection not configured');
  }

  const parts = uri.replace('opnsense://', '').split('/');
  const isPlugin = parts[0] === 'plugins';
  const moduleName = isPlugin ? (parts[1] || '') : (parts[0] || '');
  const resourceType = isPlugin ? (parts[2] || '') : (parts[1] || '');

  try {
    let data: any;

    if (isPlugin) {
      const plugin = (context.client as any).plugins?.[moduleName];
      if (!plugin) {
        throw new Error(`Plugin '${moduleName}' not found`);
      }

      switch (resourceType) {
        case 'status':
          data = await plugin.getStatus?.() || await plugin.get?.() || {};
          break;
        default:
          throw new Error(`Unknown resource type: ${resourceType}`);
      }
    } else {
      const module = (context.client as any)[moduleName];
      if (!module) {
        throw new Error(`Module '${moduleName}' not found`);
      }

      switch (resourceType) {
        case 'status':
          data = await module.getStatus?.() || await module.get?.() || {};
          break;
        case 'info':
          data = await module.getInfo?.() || {};
          break;
        case 'rules':
          data = await module.searchRule?.() || await module.search?.() || {};
          break;
        case 'aliases':
          data = await module.searchAlias?.() || {};
          break;
        case 'overview':
          data = await module.getOverview?.() || {};
          break;
        default:
          throw new Error(`Unknown resource type: ${resourceType}`);
      }
    }

    return {
      contents: [{
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(data, null, 2),
      }],
    };
  } catch (error: any) {
    throw new Error(`Failed to read resource: ${error.message}`);
  }
}