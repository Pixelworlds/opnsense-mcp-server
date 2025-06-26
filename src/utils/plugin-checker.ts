import type { OPNsenseClient } from '@richard-stovall/opnsense-typescript-client';
import type { ServerContext } from '../types/index.js';

/**
 * Check if a plugin module was included in the build
 */
export function isPluginIncludedInBuild(pluginName: string, context: ServerContext): boolean {
  return context.availableModules.has(`plugins.${pluginName}`);
}

/**
 * Check if a plugin is installed on the OPNsense firewall
 */
export async function isPluginInstalledOnFirewall(
  pluginName: string,
  client: OPNsenseClient
): Promise<boolean> {
  try {
    // Check if the plugin module exists and has methods
    const plugins = (client as any).plugins;
    if (!plugins || !plugins[pluginName]) {
      return false;
    }

    // Try to call a basic method to verify the plugin is actually installed
    // Most plugins have a getStatus or similar method
    const plugin = plugins[pluginName];
    if (typeof plugin.getStatus === 'function') {
      await plugin.getStatus();
      return true;
    } else if (typeof plugin.get === 'function') {
      await plugin.get();
      return true;
    } else if (typeof plugin.search === 'function') {
      await plugin.search({ current: 1, rowCount: 1 });
      return true;
    }

    // If no standard methods exist, assume it's installed if the module exists
    return true;
  } catch (error: any) {
    // 404 or 500 errors typically mean the plugin is not installed
    if (error?.response?.status === 404 || error?.response?.status === 500) {
      return false;
    }
    // For other errors, we can't determine plugin status reliably
    throw new Error(`Failed to check plugin status for ${pluginName}: ${error.message}`);
  }
}

/**
 * Validate plugin availability for a tool
 */
export async function validatePluginAvailability(
  pluginName: string,
  context: ServerContext
): Promise<{ available: boolean; reason?: string }> {
  // Check if included in build
  if (!isPluginIncludedInBuild(pluginName, context)) {
    return {
      available: false,
      reason: `Plugin '${pluginName}' was not included in the build. Please rebuild the server with this plugin enabled.`,
    };
  }

  // Check if client is configured
  if (!context.client) {
    return {
      available: false,
      reason: 'OPNsense connection not configured. Use the configure_opnsense_connection tool first.',
    };
  }

  // Check if installed on firewall
  try {
    const isInstalled = await isPluginInstalledOnFirewall(pluginName, context.client);
    if (!isInstalled) {
      return {
        available: false,
        reason: `Plugin '${pluginName}' is not installed on the OPNsense firewall. Please install it via System > Firmware > Plugins.`,
      };
    }
  } catch (error: any) {
    return {
      available: false,
      reason: `Failed to verify plugin '${pluginName}': ${error.message}`,
    };
  }

  return { available: true };
}

/**
 * Get list of available modules based on build configuration
 */
export function getAvailableModules(buildConfig: any): Set<string> {
  const modules = new Set<string>();

  // Add core modules
  if (buildConfig.core?.modules) {
    Object.entries(buildConfig.core.modules).forEach(([module, enabled]) => {
      if (enabled) {
        modules.add(`core.${module}`);
      }
    });
  }

  // Add plugin modules
  if (buildConfig.plugins?.modules) {
    if (buildConfig.plugins.includeAll) {
      // Include all plugins
      Object.keys(buildConfig.plugins.modules).forEach((module) => {
        modules.add(`plugins.${module}`);
      });
    } else {
      // Include only enabled plugins
      Object.entries(buildConfig.plugins.modules).forEach(([module, enabled]) => {
        if (enabled) {
          modules.add(`plugins.${module}`);
        }
      });
    }
  }

  return modules;
}