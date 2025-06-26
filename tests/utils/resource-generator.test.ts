import { describe, it, expect, jest } from '@jest/globals';
import { generateResources, handleResourceRead } from '../../src/utils/resource-generator.js';
import type { ServerContext } from '../../src/types/index.js';

describe('Resource Generator', () => {
  const mockContext: ServerContext = {
    client: undefined,
    config: undefined,
    availableModules: new Set(['core.system', 'core.firewall', 'plugins.nginx']),
    installedPlugins: new Set(['nginx']),
  };

  describe('generateResources', () => {
    it('should generate resources for available core modules', () => {
      const resources = generateResources(mockContext);

      const systemResources = resources.filter(r => r.uri.includes('system'));
      const firewallResources = resources.filter(r => r.uri.includes('firewall'));
      const interfaceResources = resources.filter(r => r.uri.includes('interfaces'));

      expect(systemResources.length).toBeGreaterThan(0);
      expect(firewallResources.length).toBeGreaterThan(0);
      expect(interfaceResources.length).toBe(0); // Not in availableModules
    });

    it('should generate resources for available plugin modules', () => {
      const resources = generateResources(mockContext);

      const nginxResources = resources.filter(r => r.uri.includes('nginx'));
      const haproxyResources = resources.filter(r => r.uri.includes('haproxy'));

      expect(nginxResources.length).toBeGreaterThan(0);
      expect(haproxyResources.length).toBe(0); // Not in availableModules
    });

    it('should generate properly formatted resources', () => {
      const resources = generateResources(mockContext);

      resources.forEach(resource => {
        expect(resource.uri).toMatch(/^opnsense:\/\//);
        expect(resource.name).toBeTruthy();
        expect(resource.description).toBeTruthy();
        expect(resource.mimeType).toBe('application/json');
      });
    });
  });

  describe('handleResourceRead', () => {
    it('should throw error when client not configured', async () => {
      await expect(handleResourceRead('opnsense://system/status', mockContext))
        .rejects.toThrow('OPNsense connection not configured');
    });

    it('should handle core module resource reads', async () => {
      const mockClient = {
        system: {
          getStatus: jest.fn().mockResolvedValue({ status: 'running', uptime: '10 days' }),
        },
      } as any;

      const contextWithClient = { ...mockContext, client: mockClient };
      const result = await handleResourceRead('opnsense://system/status', contextWithClient);

      expect(result.contents).toHaveLength(1);
      expect(result.contents[0].uri).toBe('opnsense://system/status');
      expect(result.contents[0].mimeType).toBe('application/json');
      expect(JSON.parse(result.contents[0].text)).toEqual({
        status: 'running',
        uptime: '10 days',
      });
    });

    it('should handle plugin module resource reads', async () => {
      const mockClient = {
        plugins: {
          nginx: {
            getStatus: jest.fn().mockResolvedValue({ status: 'active' }),
          },
        },
      } as any;

      const contextWithClient = { ...mockContext, client: mockClient };
      const result = await handleResourceRead('opnsense://plugins/nginx/status', contextWithClient);

      expect(result.contents[0].uri).toBe('opnsense://plugins/nginx/status');
      expect(JSON.parse(result.contents[0].text)).toEqual({ status: 'active' });
    });

    it('should handle missing module error', async () => {
      const mockClient = {} as any;

      const contextWithClient = { ...mockContext, client: mockClient };
      
      await expect(handleResourceRead('opnsense://nonexistent/status', contextWithClient))
        .rejects.toThrow("Module 'nonexistent' not found");
    });

    it('should handle unknown resource type', async () => {
      const mockClient = {
        system: {},
      } as any;

      const contextWithClient = { ...mockContext, client: mockClient };
      
      await expect(handleResourceRead('opnsense://system/unknown', contextWithClient))
        .rejects.toThrow('Unknown resource type: unknown');
    });

    it('should fallback to alternative methods', async () => {
      const mockClient = {
        system: {
          get: jest.fn().mockResolvedValue({ config: 'data' }),
        },
      } as any;

      const contextWithClient = { ...mockContext, client: mockClient };
      const result = await handleResourceRead('opnsense://system/status', contextWithClient);

      expect(mockClient.system.get).toHaveBeenCalled();
      expect(JSON.parse(result.contents[0].text)).toEqual({ config: 'data' });
    });
  });
});