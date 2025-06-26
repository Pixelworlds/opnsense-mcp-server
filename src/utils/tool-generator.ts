import { z } from 'zod';
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { OPNsenseClient } from '@richard-stovall/opnsense-typescript-client';
import type { ToolMetadata, ServerContext } from '../types/index.js';
import { validatePluginAvailability } from './plugin-checker.js';

// Common parameter schemas
const PaginationSchema = z.object({
  current: z.number().optional().default(1),
  rowCount: z.number().optional().default(20),
  searchPhrase: z.string().optional(),
});

const UuidSchema = z.object({
  uuid: z.string().describe('The UUID of the item'),
});

// Map method names to common parameter patterns
const methodPatterns = new Map<RegExp, z.ZodObject<any>>([
  [/^search/, PaginationSchema],
  [/^get$/, z.object({})],
  [/^get[A-Z]/, UuidSchema],
  [/^delete/, UuidSchema],
  [/^toggle/, UuidSchema.extend({ enabled: z.boolean() })],
  [/^set/, UuidSchema.extend({ data: z.any() })],
  [/^add/, z.object({ data: z.any() })],
  [/^update/, UuidSchema.extend({ data: z.any() })],
]);

/**
 * Generate input schema based on method name
 */
function generateInputSchema(methodName: string): z.ZodObject<any> | undefined {
  for (const [pattern, schema] of methodPatterns) {
    if (pattern.test(methodName)) {
      return schema;
    }
  }
  // Default schema for unknown methods
  return z.object({}).passthrough();
}

/**
 * Generate a human-readable description for a method
 */
function generateMethodDescription(moduleName: string, methodName: string, isPlugin: boolean): string {
  const moduleType = isPlugin ? 'plugin' : 'module';
  const moduleLabel = moduleName.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  // Common method descriptions
  const methodDescriptions: Record<string, string> = {
    search: `Search ${moduleLabel} items`,
    get: `Get ${moduleLabel} configuration`,
    getStatus: `Get ${moduleLabel} status`,
    add: `Add new ${moduleLabel} item`,
    delete: `Delete ${moduleLabel} item`,
    toggle: `Toggle ${moduleLabel} item state`,
    set: `Update ${moduleLabel} configuration`,
    update: `Update ${moduleLabel} item`,
    list: `List ${moduleLabel} items`,
    reconfigure: `Reconfigure ${moduleLabel} service`,
    restart: `Restart ${moduleLabel} service`,
    start: `Start ${moduleLabel} service`,
    stop: `Stop ${moduleLabel} service`,
  };

  // Check for exact match
  if (methodDescriptions[methodName]) {
    return methodDescriptions[methodName];
  }

  // Check for pattern match
  for (const [method, desc] of Object.entries(methodDescriptions)) {
    if (methodName.toLowerCase().includes(method.toLowerCase())) {
      return desc.replace(method, methodName);
    }
  }

  // Default description
  return `Execute ${methodName} for ${moduleLabel} ${moduleType}`;
}

/**
 * Generate tool name from module and method
 */
function generateToolName(moduleName: string, methodName: string, isPlugin: boolean): string {
  const prefix = isPlugin ? 'plugin' : 'core';
  return `${prefix}_${moduleName}_${methodName}`;
}

/**
 * Extract methods from a module
 */
function extractModuleMethods(module: any): string[] {
  const methods: string[] = [];
  
  // Get all function properties
  for (const key in module) {
    if (typeof module[key] === 'function' && !key.startsWith('_')) {
      methods.push(key);
    }
  }
  
  return methods;
}

/**
 * Generate tools for a single module
 */
export function generateModuleTools(
  moduleName: string,
  module: any,
  isPlugin: boolean,
  context: ServerContext
): Tool[] {
  const tools: Tool[] = [];
  const methods = extractModuleMethods(module);

  for (const methodName of methods) {
    const toolName = generateToolName(moduleName, methodName, isPlugin);
    const description = generateMethodDescription(moduleName, methodName, isPlugin);
    const inputSchema = generateInputSchema(methodName);

    const tool = {
      name: toolName,
      description,
    } as Tool;

    if (inputSchema) {
      tool.inputSchema = {
        type: 'object',
        properties: Object.fromEntries(
          Object.entries(inputSchema.shape).map(([key, schema]) => [
            key,
            { type: (schema as any)._def.typeName.toLowerCase().replace('zod', '') }
          ])
        ),
      };
    }

    tools.push(tool);
  }

  return tools;
}

/**
 * Generate tool handler for a method
 */
export function generateToolHandler(
  moduleName: string,
  methodName: string,
  isPlugin: boolean,
  context: ServerContext
) {
  return async (args: any) => {
    // Validate plugin availability if needed
    if (isPlugin) {
      const availability = await validatePluginAvailability(moduleName, context);
      if (!availability.available) {
        return {
          content: [{ type: 'text', text: `Error: ${availability.reason}` }],
        };
      }
    }

    // Check if client is configured
    if (!context.client) {
      return {
        content: [{
          type: 'text',
          text: 'Error: OPNsense connection not configured. Use the configure_opnsense_connection tool first.',
        }],
      };
    }

    try {
      // Get the module
      const moduleObj = isPlugin
        ? (context.client as any).plugins?.[moduleName]
        : (context.client as any)[moduleName];

      if (!moduleObj) {
        throw new Error(`Module '${moduleName}' not found`);
      }

      // Call the method
      const method = moduleObj[methodName];
      if (typeof method !== 'function') {
        throw new Error(`Method '${methodName}' not found in module '${moduleName}'`);
      }

      const result = await method.call(moduleObj, args);

      return {
        content: [{
          type: 'text',
          text: JSON.stringify(result, null, 2),
        }],
      };
    } catch (error: any) {
      return {
        content: [{
          type: 'text',
          text: `Error: ${error.message || 'Unknown error occurred'}`,
        }],
      };
    }
  };
}

/**
 * Generate module tools from build configuration (without runtime client)
 */
function generateModuleToolsFromConfig(moduleName: string, isPlugin: boolean, context: ServerContext): Tool[] {
  const tools: Tool[] = [];
  const moduleKey = isPlugin ? `plugins.${moduleName}` : `core.${moduleName}`;
  
  if (!context.availableModules.has(moduleKey)) {
    return tools;
  }

  // Get module configuration from build config
  // For now, generate basic CRUD tools for each module
  const commonMethods = ['get', 'set', 'search', 'add', 'delete', 'toggle'];
  
  for (const method of commonMethods) {
    const toolName = isPlugin 
      ? `plugin_${moduleName}_${method}`
      : `${moduleName}_${method}`;
    
    tools.push({
      name: toolName,
      description: `${method} operation for ${isPlugin ? 'plugin' : 'core'} module ${moduleName}`,
      inputSchema: {
        type: 'object',
        properties: {
          // Generic parameters that most endpoints accept
          ...(method === 'search' && {
            current: { type: 'integer', description: 'Current page', default: 1 },
            rowCount: { type: 'integer', description: 'Rows per page', default: 20 },
            searchPhrase: { type: 'string', description: 'Search phrase' }
          }),
          ...(method === 'get' && {
            uuid: { type: 'string', description: 'Item UUID' }
          }),
          ...(method === 'set' && {
            uuid: { type: 'string', description: 'Item UUID' },
            data: { type: 'object', description: 'Item data' }
          }),
          ...(method === 'add' && {
            data: { type: 'object', description: 'Item data' }
          }),
          ...(method === 'delete' && {
            uuid: { type: 'string', description: 'Item UUID' }
          }),
          ...(method === 'toggle' && {
            uuid: { type: 'string', description: 'Item UUID' },
            enabled: { type: 'boolean', description: 'Enable or disable' }
          })
        },
        required: []
      }
    });
  }

  return tools;
}

/**
 * Generate all tools for available modules
 */
export function generateAllTools(context: ServerContext): Tool[] {
  const tools: Tool[] = [];

  // Add configuration tool
  tools.push({
    name: 'configure_opnsense_connection',
    description: 'Generate OPNsense MCP server configuration JSON',
    inputSchema: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'OPNsense API URL' },
        apiKey: { type: 'string', description: 'API Key' },
        apiSecret: { type: 'string', description: 'API Secret' },
        verifySsl: { type: 'boolean', description: 'Verify SSL certificate' },
      },
      required: ['url', 'apiKey', 'apiSecret'],
    },
  });

  // Generate core module tools based on build config
  const coreModules = [
    'auth', 'backup', 'cron', 'dashboard', 'dhcp', 'diagnostics',
    'firewall', 'firmware', 'hasync', 'interfaces', 'ipsec', 'ldap',
    'log', 'menu', 'nat', 'openvpn', 'routes', 'services', 'settings',
    'snapshots', 'system', 'tunables', 'trust', 'users', 'virtualip', 'webproxy'
  ];

  for (const moduleName of coreModules) {
    if (context.availableModules.has(`core.${moduleName}`)) {
      const moduleTools = generateModuleToolsFromConfig(moduleName, false, context);
      tools.push(...moduleTools);
    }
  }

  // Generate plugin module tools based on build config
  const pluginModules = Array.from(context.availableModules)
    .filter(module => module.startsWith('plugins.'))
    .map(module => module.replace('plugins.', ''));

  for (const pluginName of pluginModules) {
    const moduleTools = generateModuleToolsFromConfig(pluginName, true, context);
    tools.push(...moduleTools);
  }

  return tools;
}