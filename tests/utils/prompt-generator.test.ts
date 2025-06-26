import { describe, it, expect } from '@jest/globals';
import { generatePrompts, generatePromptContent } from '../../src/utils/prompt-generator.js';
import type { ServerContext } from '../../src/types/index.js';

describe('Prompt Generator', () => {
  const mockContext: ServerContext = {
    client: undefined,
    config: undefined,
    availableModules: new Set([
      'core.system',
      'core.firewall',
      'core.diagnostics',
      'core.backup',
      'core.firmware',
      'plugins.wg_wireguard',
      'plugins.nginx',
    ]),
    installedPlugins: new Set(['wg_wireguard', 'nginx']),
  };

  describe('generatePrompts', () => {
    it('should generate prompts for available core modules', () => {
      const prompts = generatePrompts(mockContext);

      const corePrompts = prompts.filter(p => 
        ['system_health_check', 'security_audit', 'network_troubleshooting'].includes(p.name)
      );

      expect(corePrompts.length).toBeGreaterThan(0);
      
      const healthCheck = prompts.find(p => p.name === 'system_health_check');
      expect(healthCheck).toBeDefined();
      expect(healthCheck?.description).toContain('comprehensive system health check');
    });

    it('should generate prompts for available plugin modules', () => {
      const prompts = generatePrompts(mockContext);

      const pluginPrompts = prompts.filter(p => 
        ['wireguard_vpn_setup', 'nginx_site_setup'].includes(p.name)
      );

      expect(pluginPrompts.length).toBeGreaterThan(0);
      
      const wireguardSetup = prompts.find(p => p.name === 'wireguard_vpn_setup');
      expect(wireguardSetup).toBeDefined();
      expect(wireguardSetup?.description).toContain('WireGuard VPN connection');
    });

    it('should not generate prompts for unavailable modules', () => {
      const limitedContext = {
        ...mockContext,
        availableModules: new Set(['core.system']),
      };

      const prompts = generatePrompts(limitedContext);

      const firewallPrompts = prompts.filter(p => p.name === 'security_audit');
      const pluginPrompts = prompts.filter(p => p.name.includes('wireguard'));

      expect(firewallPrompts.length).toBe(0);
      expect(pluginPrompts.length).toBe(0);
    });

    it('should include required and optional arguments', () => {
      const prompts = generatePrompts(mockContext);

      const troubleshooting = prompts.find(p => p.name === 'network_troubleshooting');
      expect(troubleshooting).toBeDefined();
      
      const requiredArgs = troubleshooting?.arguments.filter(arg => arg.required);
      const optionalArgs = troubleshooting?.arguments.filter(arg => !arg.required);

      expect(requiredArgs?.length).toBeGreaterThan(0);
      expect(optionalArgs?.length).toBeGreaterThan(0);
    });
  });

  describe('generatePromptContent', () => {
    it('should generate content for system health check', () => {
      const content = generatePromptContent(
        'system_health_check',
        { include_services: 'true' },
        mockContext
      );

      expect(content).toContain('comprehensive health check');
      expect(content).toContain('Check system status');
      expect(content).toContain('Check all service statuses');
      expect(content).toContain('core_system_getStatus');
    });

    it('should generate content for security audit', () => {
      const content = generatePromptContent(
        'security_audit',
        { check_rules: 'true', check_services: 'true' },
        mockContext
      );

      expect(content).toContain('security audit');
      expect(content).toContain('firewall rules');
      expect(content).toContain('exposed services');
      expect(content).toContain('security issues');
    });

    it('should generate content for network troubleshooting', () => {
      const content = generatePromptContent(
        'network_troubleshooting',
        { target_host: '8.8.8.8', interface: 'wan' },
        mockContext
      );

      expect(content).toContain('Troubleshoot connectivity to 8.8.8.8');
      expect(content).toContain('Ping the target host');
      expect(content).toContain('Use interface: wan');
    });

    it('should generate content for WireGuard setup', () => {
      const content = generatePromptContent(
        'wireguard_vpn_setup',
        { peer_name: 'test-peer', allowed_ips: '10.0.0.0/24' },
        mockContext
      );

      expect(content).toContain('WireGuard VPN peer');
      expect(content).toContain('Peer name: test-peer');
      expect(content).toContain('Allowed IPs: 10.0.0.0/24');
      expect(content).toContain('Generate a new key pair');
    });

    it('should handle generic prompts', () => {
      const content = generatePromptContent(
        'backup_configuration',
        {},
        mockContext
      );

      expect(content).toContain('backup_configuration workflow');
      expect(content).toContain('Arguments:');
    });

    it('should throw error for unknown prompt', () => {
      expect(() => generatePromptContent(
        'unknown_prompt',
        {},
        mockContext
      )).toThrow("Prompt 'unknown_prompt' not found");
    });

    it('should handle prompts with no arguments', () => {
      const content = generatePromptContent(
        'backup_configuration',
        {},
        mockContext
      );

      expect(content).toBeTruthy();
      expect(content).toContain('backup_configuration');
    });
  });
});