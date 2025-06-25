/**
 * Core OPNsense MCP Tools
 * Exports all core functionality for OPNsense management
 */

// Export implementations
export { coreInitialization } from './initialization.js';
export { corePrompts } from './prompts.js';
export { coreResources } from './resources.js';
export { coreToolHandlers, coreTools } from './tools.js';

// Export all types
export type { CoreToolHandlers } from './types.js';

// Re-export server types that are used in core
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
