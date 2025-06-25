/**
 * Main entry point for the OPNsense MCP Server
 * Comprehensive exports for all server functionality and types
 */

// Export main server implementations
export { serverInitializationResponse } from './server/initialization.js';
export { OPNsenseServer } from './server/simple-server.js';

// Export core module
export * from './core/index.js';

// Export plugins module
export * from './plugins/index.js';

// Export server module
export * from './server/index.js';

// Explicit type re-exports for better IDE support
export type { CoreToolHandlers } from './core/types.js';
export type { PluginToolHandlers } from './plugins/types.js';
export type { ServerConfig, ToolDefinition, ToolHandler, ToolHandlers } from './server/types.js';
