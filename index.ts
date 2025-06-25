#!/usr/bin/env node

import { OPNsenseServer } from './src/server/simple-server.js';

declare const process: {
  argv: string[];
  exit(code?: number): never;
};
declare const console: {
  log(...args: any[]): void;
  error(...args: any[]): void;
};

interface ParsedConfig {
  host?: string;
  apiKey?: string;
  apiSecret?: string;
  verifySsl?: boolean;
  plugins?: boolean;
}

const help = `
OPNsense MCP Server

Usage: yarn start [options]

Options:
  --host <url>        OPNsense host URL (e.g., https://opnsense.local)
  --api-key <key>     OPNsense API key
  --api_key <key>     OPNsense API key (alternative format)
  --api-secret <secret> OPNsense API secret
  --api_secret <secret> OPNsense API secret (alternative format)
  --no-verify-ssl     Disable SSL verification (default: enabled)
  --plugins           Enable plugin-specific tools and endpoints
  --no-plugins        Explicitly disable plugin-specific tools
  --help, -h          Show this help message

Examples:
  yarn start --host https://opnsense.local --api-key mykey --api-secret mysecret
  yarn start --host https://192.168.1.1 --api-key mykey --api-secret mysecret --no-verify-ssl
  yarn start --host https://opnsense.local --api-key mykey --api-secret mysecret --plugins
  yarn start --host https://opnsense.local --api-key mykey --api-secret mysecret --no-plugins

If no configuration is provided via command-line arguments, you can configure
the connection using the 'configure_opnsense_connection' tool after starting the server.
`;

const parseArgs = (args: string[]): ParsedConfig => {
  const config: ParsedConfig = {
    verifySsl: true,
    plugins: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (!arg) continue;

    if (arg.includes('=')) {
      const parts = arg.split('=', 2);
      const key = parts[0];
      const value = parts[1] ?? '';

      switch (key) {
        case '--host': {
          config.host = value;
          break;
        }
        case '--api-key':
        case '--api_key': {
          config.apiKey = value;
          break;
        }
        case '--api-secret':
        case '--api_secret': {
          config.apiSecret = value;
          break;
        }
        case '--no-verify-ssl': {
          config.verifySsl = false;
          break;
        }
        case '--plugins': {
          config.plugins = value === 'true' || value === '1' || value === '';
          break;
        }
        case '--no-plugins': {
          config.plugins = false;
          break;
        }
        default: {
          break;
        }
      }
      continue;
    }

    switch (arg) {
      case '--host': {
        if (i + 1 < args.length) {
          const nextArg = args[i + 1];
          if (nextArg) {
            config.host = nextArg;
            i++;
          }
        }
        break;
      }
      case '--api-key':
      case '--api_key': {
        if (i + 1 < args.length) {
          const nextArg = args[i + 1];
          if (nextArg) {
            config.apiKey = nextArg;
            i++;
          }
        }
        break;
      }
      case '--api-secret':
      case '--api_secret': {
        if (i + 1 < args.length) {
          const nextArg = args[i + 1];
          if (nextArg) {
            config.apiSecret = nextArg;
            i++;
          }
        }
        break;
      }
      case '--no-verify-ssl': {
        config.verifySsl = false;
        break;
      }
      case '--plugins': {
        config.plugins = true;
        break;
      }
      case '--no-plugins': {
        config.plugins = false;
        break;
      }
      case '--help':
      case '-h': {
        console.log(help);
        process.exit(0);
      }
      default: {
        break;
      }
    }
  }

  return config;
};

const config = parseArgs(process.argv.slice(2));
const server = new OPNsenseServer(config);

server.run().catch((error: unknown) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
