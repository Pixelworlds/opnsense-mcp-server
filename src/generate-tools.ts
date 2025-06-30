import * as fs from 'fs';
import * as path from 'path';
import { OPNsenseClient } from '@richard-stovall/opnsense-typescript-client';

// Create client to introspect
const client = new OPNsenseClient({
  baseUrl: 'https://dummy',
  apiKey: 'dummy',
  apiSecret: 'dummy'
});

interface ModularToolDefinition {
  name: string;
  description: string;
  module: string;
  submodule?: string;
  methods: string[];
  inputSchema: any;
}

// Get all methods from a module
function getModuleMethods(obj: any): string[] {
  if (!obj || typeof obj !== 'object') return [];
  
  const proto = Object.getPrototypeOf(obj);
  if (!proto) return [];
  
  return Object.getOwnPropertyNames(proto).filter(
    key => typeof proto[key] === 'function' && key !== 'constructor'
  );
}

// Generate schema for modular tools
function generateModularSchema(methods: string[]): any {
  return {
    type: 'object',
    properties: {
      method: {
        type: 'string',
        description: 'The method to call on this module',
        enum: methods
      },
      params: {
        type: 'object',
        description: 'Parameters for the method (varies by method)',
        properties: {
          // Common parameters that many methods use
          uuid: {
            type: 'string',
            description: 'Item UUID (for get/set/del operations)'
          },
          data: {
            type: 'object',
            description: 'Configuration data (for set operations)'
          },
          item: {
            type: 'object',
            description: 'Item data (for add/set operations)'
          },
          searchPhrase: {
            type: 'string',
            description: 'Search phrase (for search operations)'
          },
          current: {
            type: 'integer',
            description: 'Current page (for search operations)',
            default: 1
          },
          rowCount: {
            type: 'integer',
            description: 'Rows per page (for search operations)',
            default: 20
          }
        }
      }
    },
    required: ['method']
  };
}

// Analyze all modules and create modular tools
const modularTools: ModularToolDefinition[] = [];

// Core module
const coreMethods = getModuleMethods(client.core);
if (coreMethods.length > 0) {
  modularTools.push({
    name: 'core_manage',
    description: `Core system management - ${coreMethods.length} available methods including: ${coreMethods.slice(0, 5).join(', ')}...`,
    module: 'core',
    methods: coreMethods,
    inputSchema: generateModularSchema(coreMethods)
  });
}

// Firewall module
const firewallMethods = getModuleMethods(client.firewall);
if (firewallMethods.length > 0) {
  modularTools.push({
    name: 'firewall_manage',
    description: `Firewall management - ${firewallMethods.length} available methods including: ${firewallMethods.slice(0, 5).join(', ')}...`,
    module: 'firewall',
    methods: firewallMethods,
    inputSchema: generateModularSchema(firewallMethods)
  });
}

// Auth module
const authMethods = getModuleMethods(client.auth);
if (authMethods.length > 0) {
  modularTools.push({
    name: 'auth_manage',
    description: `Authentication management - ${authMethods.length} available methods including: ${authMethods.slice(0, 5).join(', ')}...`,
    module: 'auth',
    methods: authMethods,
    inputSchema: generateModularSchema(authMethods)
  });
}

// Interfaces module
const interfacesMethods = getModuleMethods(client.interfaces);
if (interfacesMethods.length > 0) {
  modularTools.push({
    name: 'interfaces_manage',
    description: `Network interfaces management - ${interfacesMethods.length} available methods including: ${interfacesMethods.slice(0, 5).join(', ')}...`,
    module: 'interfaces',
    methods: interfacesMethods,
    inputSchema: generateModularSchema(interfacesMethods)
  });
}

// Direct modules (not under core)
const directModules = [
  'captiveportal', 'cron', 'dhcpv4', 'dhcpv6', 'dhcrelay',
  'diagnostics', 'dnsmasq', 'firmware', 'ids', 'ipsec', 'kea',
  'monit', 'openvpn', 'routes', 'routing', 'syslog',
  'trafficshaper', 'trust', 'unbound', 'wireguard'
];

directModules.forEach(moduleName => {
  const module = (client as any)[moduleName];
  if (module) {
    const methods = getModuleMethods(module);
    if (methods.length > 0) {
      modularTools.push({
        name: `${moduleName}_manage`,
        description: `${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)} management - ${methods.length} available methods including: ${methods.slice(0, 5).join(', ')}...`,
        module: moduleName,
        methods: methods,
        inputSchema: generateModularSchema(methods)
      });
    }
  }
});

// Plugin modules - group all plugins into one tool
const plugins = client.plugins as any;
const pluginNames = Object.keys(plugins).filter(key => key !== 'http');
const allPluginMethods: { plugin: string; methods: string[] }[] = [];

pluginNames.forEach(pluginName => {
  const plugin = plugins[pluginName];
  if (plugin) {
    const methods = getModuleMethods(plugin);
    if (methods.length > 0) {
      allPluginMethods.push({ plugin: pluginName, methods });
    }
  }
});

// Create individual plugin tools
allPluginMethods.forEach(({ plugin, methods }) => {
  modularTools.push({
    name: `plugin_${plugin}_manage`,
    description: `Plugin ${plugin} management - ${methods.length} available methods including: ${methods.slice(0, 5).join(', ')}...`,
    module: 'plugins',
    submodule: plugin,
    methods: methods,
    inputSchema: generateModularSchema(methods)
  });
});

console.log(`\nTotal modular tools generated: ${modularTools.length}`);
console.log(`Core tools: ${modularTools.filter(t => t.module !== 'plugins').length}`);
console.log(`Plugin tools: ${modularTools.filter(t => t.module === 'plugins').length}`);

// Generate method documentation
const methodDocs: any = {};
modularTools.forEach(tool => {
  const key = tool.submodule ? `${tool.module}.${tool.submodule}` : tool.module;
  methodDocs[key] = {
    toolName: tool.name,
    methods: tool.methods
  };
});

// Save tool definitions
fs.writeFileSync('tools-generated.json', JSON.stringify({
  totalTools: modularTools.length,
  coreTools: modularTools.filter(t => t.module !== 'plugins').length,
  pluginTools: modularTools.filter(t => t.module === 'plugins').length,
  tools: modularTools,
  methodDocs: methodDocs
}, null, 2));

console.log('\nTool definitions generated successfully!');
console.log('Saved to tools-generated.json');