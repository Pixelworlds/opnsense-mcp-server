import { describe, it, expect, jest } from '@jest/globals';
import {
  generateModuleTools,
  generateToolHandler,
  generateAllTools,
} from '../../src/utils/tool-generator.js';
import type { ServerContext } from '../../src/types/index.js';

describe('Tool Generator', () => {
  const mockContext: ServerContext = {
    client: undefined,
    config: undefined,
    availableModules: new Set(['core.system', 'core.firewall', 'plugins.nginx']),
    installedPlugins: new Set(['nginx']),
  };

  describe('generateModuleTools', () => {
    it('should generate tools for a core module', () => {
      const mockModule = {
        getStatus: jest.fn(),
        getInfo: jest.fn(),
        reboot: jest.fn(),
      };

      const tools = generateModuleTools('system', mockModule, false, mockContext);

      expect(tools).toHaveLength(3);
      expect(tools[0].name).toBe('core_system_getStatus');
      expect(tools[1].name).toBe('core_system_getInfo');
      expect(tools[2].name).toBe('core_system_reboot');
    });

    it('should generate tools for a plugin module', () => {
      const mockModule = {
        getStatus: jest.fn(),
        reload: jest.fn(),
      };

      const tools = generateModuleTools('nginx', mockModule, true, mockContext);

      expect(tools).toHaveLength(2);
      expect(tools[0].name).toBe('plugin_nginx_getStatus');
      expect(tools[1].name).toBe('plugin_nginx_reload');
    });

    it('should generate proper descriptions', () => {
      const mockModule = {
        search: jest.fn(),
        add: jest.fn(),
        delete: jest.fn(),
      };

      const tools = generateModuleTools('firewall', mockModule, false, mockContext);

      expect(tools[0].description).toBe('Search Firewall items');
      expect(tools[1].description).toBe('Add new Firewall item');
      expect(tools[2].description).toBe('Delete Firewall item');
    });

    it('should skip private methods', () => {
      const mockModule = {
        getStatus: jest.fn(),
        _privateMethod: jest.fn(),
        publicMethod: jest.fn(),
      };

      const tools = generateModuleTools('system', mockModule, false, mockContext);

      expect(tools).toHaveLength(2);
      expect(tools.map(t => t.name)).not.toContain('core_system__privateMethod');
    });
  });

  describe('generateToolHandler', () => {
    it('should return error when client not configured', async () => {
      const handler = generateToolHandler('system', 'getStatus', false, mockContext);
      const result = await handler({});

      expect(result.content[0].text).toContain('OPNsense connection not configured');
    });

    it('should validate plugin availability for plugin tools', async () => {
      const handler = generateToolHandler('nonexistent', 'method', true, mockContext);
      const result = await handler({});

      expect(result.content[0].text).toContain('not included in the build');
    });

    it('should handle method execution errors', async () => {
      const mockClient = {
        system: {
          getStatus: jest.fn().mockRejectedValue(new Error('Network error')),
        },
      };

      const contextWithClient = {
        ...mockContext,
        client: mockClient as any,
      };

      const handler = generateToolHandler('system', 'getStatus', false, contextWithClient);
      const result = await handler({});

      expect(result.content[0].text).toContain('Network error');
    });

    it('should successfully execute method and return result', async () => {
      const mockResult = { status: 'running', uptime: '10 days' };
      const mockClient = {
        system: {
          getStatus: jest.fn().mockResolvedValue(mockResult),
        },
      };

      const contextWithClient = {
        ...mockContext,
        client: mockClient as any,
      };

      const handler = generateToolHandler('system', 'getStatus', false, contextWithClient);
      const result = await handler({});

      expect(JSON.parse(result.content[0].text)).toEqual(mockResult);
    });
  });

  describe('generateAllTools', () => {
    it('should include configuration tool', () => {
      const mockClient = {} as any;
      const tools = generateAllTools(mockClient, mockContext);

      const configTool = tools.find(t => t.name === 'configure_opnsense_connection');
      expect(configTool).toBeDefined();
      expect(configTool?.description).toBe('Configure the OPNsense API connection');
    });

    it('should generate tools only for available modules', () => {
      const mockClient = {
        system: { getStatus: jest.fn() },
        firewall: { search: jest.fn() },
        interfaces: { getOverview: jest.fn() }, // Not in availableModules
        plugins: {
          nginx: { reload: jest.fn() },
          haproxy: { getStatus: jest.fn() }, // Not in availableModules
        },
      } as any;

      const tools = generateAllTools(mockClient, mockContext);

      // Should include system, firewall, nginx, and config tool
      expect(tools.map(t => t.name)).toContain('core_system_getStatus');
      expect(tools.map(t => t.name)).toContain('core_firewall_search');
      expect(tools.map(t => t.name)).toContain('plugin_nginx_reload');
      expect(tools.map(t => t.name)).not.toContain('core_interfaces_getOverview');
      expect(tools.map(t => t.name)).not.toContain('plugin_haproxy_getStatus');
    });
  });
});