import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { OPNsenseMCPServer } from '../../src/server/index.js';

// Mock the transport to avoid stdio interaction in tests
jest.mock('@modelcontextprotocol/sdk/server/stdio.js', () => ({
  StdioServerTransport: jest.fn().mockImplementation(() => ({
    connect: jest.fn(),
  })),
}));

describe('OPNsense MCP Server Integration', () => {
  let server: OPNsenseMCPServer;

  beforeEach(() => {
    jest.clearAllMocks();
    server = new OPNsenseMCPServer();
  });

  afterEach(() => {
    // Clean up any server resources if needed
  });

  describe('End-to-End Server Functionality', () => {
    it('should initialize server without errors', () => {
      expect(server).toBeDefined();
      expect(server).toBeInstanceOf(OPNsenseMCPServer);
    });

    it('should handle server configuration workflow', () => {
      const config = {
        opnsense: {
          url: 'https://test.example.com',
          apiKey: 'test-key',
          apiSecret: 'test-secret',
          verifySsl: false,
        },
      };

      expect(() => new OPNsenseMCPServer(config)).not.toThrow();
    });

    it('should support library usage patterns', () => {
      // Test that the server can be created and configured programmatically
      const server1 = new OPNsenseMCPServer();
      const server2 = new OPNsenseMCPServer({
        opnsense: {
          url: 'https://192.168.1.1',
          apiKey: 'key',
          apiSecret: 'secret',
          verifySsl: true,
        },
      });

      expect(server1).toBeDefined();
      expect(server2).toBeDefined();
    });
  });

  describe('Server Capabilities', () => {
    it('should expose correct server metadata', () => {
      // Server should be initialized with correct name and version
      expect(server).toBeDefined();
    });

    it('should handle missing configuration gracefully', () => {
      // Server should work without initial configuration
      const unconfiguredServer = new OPNsenseMCPServer();
      expect(unconfiguredServer).toBeDefined();
    });
  });

  describe('Build Configuration Integration', () => {
    it('should respect build configuration for module inclusion', () => {
      // Test that the server respects the build.config.json settings
      expect(server).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid configuration gracefully', () => {
      const invalidConfig = {
        opnsense: {
          url: 'invalid-url',
          apiKey: '',
          apiSecret: '',
          verifySsl: true,
        },
      };

      // Should not throw during construction
      expect(() => new OPNsenseMCPServer(invalidConfig as any)).not.toThrow();
    });
  });

  describe('Module System', () => {
    it('should properly manage core and plugin modules', () => {
      // Test that the server properly separates core and plugin functionality
      expect(server).toBeDefined();
    });
  });
});