#!/usr/bin/env node

import { McpServer } from './src/server.js';

const help = `
OPNsense MCP Server

Usage: bun run index.ts [options]

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
  bun run index.ts --host https://opnsense.local --api-key mykey --api-secret mysecret
  bun run index.ts --host https://192.168.1.1 --api-key mykey --api-secret mysecret --no-verify-ssl
  bun run index.ts --host https://opnsense.local --api-key mykey --api-secret mysecret --plugins
  bun run index.ts --host https://opnsense.local --api-key mykey --api-secret mysecret --no-plugins

If no configuration is provided via command-line arguments, you can configure
the connection using the 'configure_opnsense_connection' tool after starting the server.
`;

const parseArgs = (args: string[]) => {
  const config: {
    host?: string;
    apiKey?: string;
    apiSecret?: string;
    verifySsl?: boolean;
    plugins?: boolean;
  } = {
    verifySsl: true,
    plugins: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (typeof arg === 'string' && arg.includes('=')) {
      const [key, value] = arg.split('=', 2);

      switch (key) {
        case '--host':
          config.host = value;
          break;
        case '--api-key':
        case '--api_key':
          config.apiKey = value;
          break;
        case '--api-secret':
        case '--api_secret':
          config.apiSecret = value;
          break;
        case '--no-verify-ssl':
          config.verifySsl = false;
          break;
        case '--plugins':
          config.plugins = value === 'true' || value === '1' || value === '';
          break;
        case '--no-plugins':
          config.plugins = false;
          break;
      }
      continue;
    }

    if (arg === '--host' && i + 1 < args.length) {
      config.host = args[i + 1];
      i++;
    } else if ((arg === '--api-key' || arg === '--api_key') && i + 1 < args.length) {
      config.apiKey = args[i + 1];
      i++;
    } else if ((arg === '--api-secret' || arg === '--api_secret') && i + 1 < args.length) {
      config.apiSecret = args[i + 1];
      i++;
    } else if (arg === '--no-verify-ssl') {
      config.verifySsl = false;
    } else if (arg === '--plugins') {
      config.plugins = true;
    } else if (arg === '--no-plugins') {
      config.plugins = false;
    } else if (arg === '--help' || arg === '-h') {
      console.log(help);
      process.exit(0);
    }
  }

  return config;
};

const config = parseArgs(process.argv.slice(2));
const server = new McpServer(config);

server.run().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
