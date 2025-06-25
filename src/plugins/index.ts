/**
 * Plugin OPNsense MCP Tools
 * Exports all plugin functionality for OPNsense extensions
 */

// Export implementations
export { pluginInitialization } from './initialization.js';
export { pluginPrompts } from './prompts.js';
export { pluginResources } from './resources.js';
export { pluginToolHandlers, pluginTools } from './tools.js';

// Export all types
export type { PluginToolHandlers } from './types.js';

// Re-export server types that are used in plugins
export type {
  AccessPattern,
  ModuleInitialization,
  PropertyDefinition,
  ResourceDefinition,
  ResourceExample,
  ResourceSchema,
  ServerConfig,
  ToolDefinition,
  ToolHandler,
  ToolHandlers,
} from '../server/types.js';
