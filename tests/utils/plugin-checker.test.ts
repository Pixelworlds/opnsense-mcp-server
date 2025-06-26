import { describe, it, expect, jest } from '@jest/globals';
import {
  isPluginIncludedInBuild,
  isPluginInstalledOnFirewall,
  validatePluginAvailability,
  getAvailableModules,
} from '../../src/utils/plugin-checker.js';
import type { ServerContext } from '../../src/types/index.js';

describe('Plugin Checker', () => {
  const mockContext: ServerContext = {
    client: undefined,
    config: undefined,
    availableModules: new Set(['plugins.nginx', 'plugins.haproxy', 'core.system']),
    installedPlugins: new Set(['nginx', 'haproxy']),
  };

  describe('isPluginIncludedInBuild', () => {
    it('should return true for included plugins', () => {
      expect(isPluginIncludedInBuild('nginx', mockContext)).toBe(true);
      expect(isPluginIncludedInBuild('haproxy', mockContext)).toBe(true);
    });

    it('should return false for excluded plugins', () => {
      expect(isPluginIncludedInBuild('wireguard', mockContext)).toBe(false);
      expect(isPluginIncludedInBuild('bind', mockContext)).toBe(false);
    });
  });

  describe('isPluginInstalledOnFirewall', () => {
    it('should return true when plugin has getStatus method', async () => {
      const mockClient = {
        plugins: {
          nginx: {
            getStatus: jest.fn().mockResolvedValue({ status: 'running' }),
          },
        },
      } as any;

      const result = await isPluginInstalledOnFirewall('nginx', mockClient);
      expect(result).toBe(true);
    });

    it('should return true when plugin has get method', async () => {
      const mockClient = {
        plugins: {
          bind: {
            get: jest.fn().mockResolvedValue({ config: {} }),
          },
        },
      } as any;

      const result = await isPluginInstalledOnFirewall('bind', mockClient);
      expect(result).toBe(true);
    });

    it('should return false for 404 errors', async () => {
      const mockClient = {
        plugins: {
          wireguard: {
            getStatus: jest.fn().mockRejectedValue({
              response: { status: 404 },
            }),
          },
        },
      } as any;

      const result = await isPluginInstalledOnFirewall('wireguard', mockClient);
      expect(result).toBe(false);
    });

    it('should throw for other errors', async () => {
      const mockClient = {
        plugins: {
          nginx: {
            getStatus: jest.fn().mockRejectedValue(new Error('Network error')),
          },
        },
      } as any;

      await expect(isPluginInstalledOnFirewall('nginx', mockClient))
        .rejects.toThrow('Failed to check plugin status');
    });

    it('should return false when plugin module does not exist', async () => {
      const mockClient = {
        plugins: {},
      } as any;

      const result = await isPluginInstalledOnFirewall('nonexistent', mockClient);
      expect(result).toBe(false);
    });
  });

  describe('validatePluginAvailability', () => {
    it('should return not available when not in build', async () => {
      const result = await validatePluginAvailability('wireguard', mockContext);
      
      expect(result.available).toBe(false);
      expect(result.reason).toContain('not included in the build');
    });

    it('should return not available when client not configured', async () => {
      const result = await validatePluginAvailability('nginx', mockContext);
      
      expect(result.available).toBe(false);
      expect(result.reason).toContain('OPNsense connection not configured');
    });

    it('should return not available when plugin not installed', async () => {
      const mockClient = {
        plugins: {
          nginx: {
            getStatus: jest.fn().mockRejectedValue({
              response: { status: 404 },
            }),
          },
        },
      } as any;

      const contextWithClient = { ...mockContext, client: mockClient };
      const result = await validatePluginAvailability('nginx', contextWithClient);
      
      expect(result.available).toBe(false);
      expect(result.reason).toContain('not installed on the OPNsense firewall');
    });

    it('should return available when all checks pass', async () => {
      const mockClient = {
        plugins: {
          nginx: {
            getStatus: jest.fn().mockResolvedValue({ status: 'running' }),
          },
        },
      } as any;

      const contextWithClient = { ...mockContext, client: mockClient };
      const result = await validatePluginAvailability('nginx', contextWithClient);
      
      expect(result.available).toBe(true);
      expect(result.reason).toBeUndefined();
    });
  });

  describe('getAvailableModules', () => {
    it('should include enabled core modules', () => {
      const buildConfig = {
        core: {
          modules: {
            system: true,
            firewall: true,
            interfaces: false,
          },
        },
        plugins: {
          includeAll: false,
          modules: {},
        },
      };

      const modules = getAvailableModules(buildConfig);
      
      expect(modules.has('core.system')).toBe(true);
      expect(modules.has('core.firewall')).toBe(true);
      expect(modules.has('core.interfaces')).toBe(false);
    });

    it('should include all plugins when includeAll is true', () => {
      const buildConfig = {
        core: { modules: {} },
        plugins: {
          includeAll: true,
          modules: {
            nginx: true,
            haproxy: false,
            bind: true,
          },
        },
      };

      const modules = getAvailableModules(buildConfig);
      
      expect(modules.has('plugins.nginx')).toBe(true);
      expect(modules.has('plugins.haproxy')).toBe(true);
      expect(modules.has('plugins.bind')).toBe(true);
    });

    it('should include only enabled plugins when includeAll is false', () => {
      const buildConfig = {
        core: { modules: {} },
        plugins: {
          includeAll: false,
          modules: {
            nginx: true,
            haproxy: false,
            bind: true,
          },
        },
      };

      const modules = getAvailableModules(buildConfig);
      
      expect(modules.has('plugins.nginx')).toBe(true);
      expect(modules.has('plugins.haproxy')).toBe(false);
      expect(modules.has('plugins.bind')).toBe(true);
    });
  });
});