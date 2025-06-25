/**
 * Main entry point for the OPNsense MCP Server
 * Re-exports the server implementation from the server module
 */

export { OPNsenseServer } from './server/simple-server.js';
export { serverInitializationResponse } from './server/initialization.js';
export type { ServerConfig } from './server/types.js';

// Re-export core and plugin types
export type { CoreToolHandlers } from './core/index.js';
export type { PluginToolHandlers } from './plugins/index.js';