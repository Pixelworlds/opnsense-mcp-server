// Global test setup
import { jest } from '@jest/globals';

// Define BUILD_CONFIG_PLACEHOLDER globally for tests
(global as any).BUILD_CONFIG_PLACEHOLDER = {
  core: {
    modules: {
      system: true,
      firewall: true,
      auth: true,
    }
  },
  plugins: {
    includeAll: false,
    modules: {
      nginx: true,
    }
  }
};

// Mock jest.fn to be more permissive with types
(jest as any).fn = jest.fn as any;