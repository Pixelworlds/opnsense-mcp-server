/**
 * Plugin OPNsense MCP Tools
 * Exports all plugin functionality for OPNsense extensions
 */

export { pluginInitialization } from './initialization.js';
export { pluginPrompts } from './prompts.js';
export { pluginResources } from './resources.js';
export { pluginToolHandlers, pluginTools } from './tools.js';
export type { PluginToolHandlers } from './types.js';
