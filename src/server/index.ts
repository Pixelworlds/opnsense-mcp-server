/**
 * OPNsense MCP Server Module
 * Exports all server functionality and types for OPNsense management
 */

// Export main server implementations
export { serverInitializationResponse } from './initialization.js';
export { OPNSENSE_RESOURCES } from './simple-resources.js';
export { OPNsenseServer } from './simple-server.js';
export { ENHANCED_TOOL_DESCRIPTIONS } from './simple-tools.js';

// Export documentation and templates
export {
  CORE_API_MODULES,
  PLUGIN_API_MODULES,
  RESOURCE_SCHEMAS,
  TOOL_CATEGORIES,
  type ApiEndpoint,
  type Parameter,
} from './api-documentation.js';
export {
  PROMPT_CATEGORIES,
  PROMPT_CONTEXTS,
  PROMPT_TEMPLATES,
  type PromptArgument,
  type PromptTemplate,
} from './prompt-templates.js';
export {
  RESOURCE_CACHING,
  OPNSENSE_RESOURCES as RESOURCE_DOCUMENTATION,
  RESOURCE_PERMISSIONS,
  RESOURCE_RELATIONSHIPS,
  RESOURCE_SUBSCRIPTIONS,
} from './resource-documentation.js';
export {
  ERROR_PATTERNS,
  PARAMETER_PATTERNS,
  ENHANCED_TOOL_DESCRIPTIONS as TOOL_DESCRIPTIONS,
  TOOL_WORKFLOWS,
  type EnhancedToolDefinition,
  type ToolExample,
} from './tool-descriptions.js';

// Export all types
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
} from './types.js';
