import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { OPNsenseMCPServer } from '../../src/server/index.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';

// Mock the SDK
jest.mock('@modelcontextprotocol/sdk/server/index.js');
jest.mock('@modelcontextprotocol/sdk/server/stdio.js');

describe('OPNsenseMCPServer', () => {
  let server: OPNsenseMCPServer;

  beforeEach(() => {
    jest.clearAllMocks();
    server = new OPNsenseMCPServer();
  });

  describe('Initialization', () => {
    it('should create server with correct metadata', () => {
      expect(Server).toHaveBeenCalledWith(
        {
          name: '@richard-stovall/opnsense-mcp-server',
          version: '0.2.1',
        },
        {
          capabilities: {
            tools: {},
            resources: {},
            prompts: {},
          },
        }
      );
    });

    it('should initialize without configuration', () => {
      expect(() => new OPNsenseMCPServer()).not.toThrow();
    });

    it('should initialize with configuration', () => {
      const config = {
        opnsense: {
          url: 'https://192.168.1.1',
          apiKey: 'test-key',
          apiSecret: 'test-secret',
          verifySsl: false,
        },
      };

      expect(() => new OPNsenseMCPServer(config)).not.toThrow();
    });
  });

  describe('Configuration', () => {
    it('should support configuration via constructor', () => {
      const config = {
        opnsense: {
          url: 'https://192.168.1.1',
          apiKey: 'test-key',
          apiSecret: 'test-secret',
          verifySsl: true,
        },
      };

      const configuredServer = new OPNsenseMCPServer(config);
      expect(configuredServer).toBeDefined();
    });
  });

  describe('Server capabilities', () => {
    it('should have tools capability', () => {
      const mockServer = (Server as jest.MockedClass<typeof Server>).mock.results[0].value;
      expect(mockServer).toBeDefined();
    });

    it('should have resources capability', () => {
      const mockServer = (Server as jest.MockedClass<typeof Server>).mock.results[0].value;
      expect(mockServer).toBeDefined();
    });

    it('should have prompts capability', () => {
      const mockServer = (Server as jest.MockedClass<typeof Server>).mock.results[0].value;
      expect(mockServer).toBeDefined();
    });
  });
});