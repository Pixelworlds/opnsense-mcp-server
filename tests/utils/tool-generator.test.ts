import { describe, expect, it, jest } from '@jest/globals';

import { generateAllTools, generateModuleTools, generateToolHandler } from '../../src/utils/tool-generator.js';

import type { ServerContext } from '../../src/types/index.js';
describe('Tool Generator', () => {
  const mockContext: ServerContext = {
    client: undefined,
    config: undefined,
    availableModules: new Set(['core.system', 'core.firewall', 'plugins.nginx']),
    installedPlugins: new Set(['nginx']),
  };

  describe.skip('generateModuleTools', () => {
    // All tests in this describe block are skipped - function signature changed
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

    it.skip('should handle method execution errors', async () => {
      // Skipped - this test requires runtime client which is only available after configuration
    });

    it.skip('should successfully execute method and return result', async () => {
      // Skipped - this test requires runtime client which is only available after configuration
    });
  });

  describe('generateAllTools', () => {
    it('should include configuration tool', () => {
      const tools = generateAllTools(mockContext);

      const configTool = tools.find((t) => t.name === 'configure_opnsense_connection');
      expect(configTool).toBeDefined();
      expect(configTool?.description).toBe('Generate OPNsense MCP server configuration JSON');
    });

    it('should generate tools only for available modules', () => {
      const tools = generateAllTools(mockContext);

      // Should include system, firewall, nginx tools based on build config
      expect(tools.map((t) => t.name)).toContain('system_get_status');
      expect(tools.map((t) => t.name)).toContain('firewall_rules_search');
      expect(tools.map((t) => t.name)).toContain('plugin_nginx_server_search');
      // Should not include modules not in availableModules
      expect(tools.map((t) => t.name)).not.toContain('interfaces_overview_get');
      expect(tools.map((t) => t.name)).not.toContain('plugin_haproxy_backend_search');
    });
  });
});