export { serverInitializationResponse } from './server/initialization.js';
export { OPNsenseMcpServer, OPNsenseServer } from './server/simple-server.js';

export * from './core/index.js';

export * from './plugins/index.js';

export * from './server/index.js';

export type { CoreToolHandlers } from './core/types.js';
export type { PluginToolHandlers } from './plugins/types.js';
export type { ServerConfig, ToolDefinition, ToolHandler, ToolHandlers } from './server/types.js';
