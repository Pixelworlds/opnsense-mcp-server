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

      const systemResources = resources.filter((r) => r.uri.includes('system'));
      const firewallResources = resources.filter((r) => r.uri.includes('firewall'));
      const interfaceResources = resources.filter((r) => r.uri.includes('interfaces'));

      expect(systemResources.length).toBeGreaterThan(0);
      expect(firewallResources.length).toBeGreaterThan(0);
      expect(interfaceResources.length).toBe(0); // Not in availableModules
    });

    it('should generate resources for available plugin modules', () => {
      const resources = generateResources(mockContext);

      const nginxResources = resources.filter((r) => r.uri.includes('nginx'));
      const haproxyResources = resources.filter((r) => r.uri.includes('haproxy'));

      expect(nginxResources.length).toBeGreaterThan(0);
      expect(haproxyResources.length).toBe(0); // Not in availableModules
    });

    it('should generate properly formatted resources', () => {
      const resources = generateResources(mockContext);

      resources.forEach((resource) => {
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

    it.skip('should handle core module resource reads', async () => {
      // Skipped - requires runtime client configuration
    });

    it.skip('should handle plugin module resource reads', async () => {
      // Skipped - requires runtime client configuration
    });

    it.skip('should handle missing module error', async () => {
      // Skipped - requires runtime client configuration
    });

    it.skip('should handle unknown resource type', async () => {
      // Skipped - requires runtime client configuration
    });

    it.skip('should fallback to alternative methods', async () => {
      // Skipped - requires runtime client configuration
    });
  });
});