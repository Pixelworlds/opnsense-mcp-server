#!/usr/bin/env node

import { OPNsenseMCPServer } from './server/index.js';
import type { ServerConfig } from './types/index.js';

// Parse command line arguments
function parseArgs(): Partial<ServerConfig['opnsense']> & { help?: boolean } {
  const args = process.argv.slice(2);
  const config: Partial<ServerConfig['opnsense']> & { help?: boolean } = {};

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--url':
      case '-u':
        config.url = args[++i];
        break;
      case '--api-key':
      case '-k':
        config.apiKey = args[++i];
        break;
      case '--api-secret':
      case '-s':
        config.apiSecret = args[++i];
        break;
      case '--no-verify-ssl':
        config.verifySsl = false;
        break;
      case '--help':
      case '-h':
        config.help = true;
        break;
    }
  }

  return config;
}

function showHelp() {
  console.log(`
OPNsense MCP Server

Usage: opnsense-mcp-server [options]

Options:
  -u, --url <url>           OPNsense API URL (e.g., https://192.168.1.1)
  -k, --api-key <key>       API Key for authentication
  -s, --api-secret <secret> API Secret for authentication
  --no-verify-ssl           Disable SSL certificate verification
  -h, --help                Show this help message

Environment Variables:
  OPNSENSE_URL              OPNsense API URL
  OPNSENSE_API_KEY          API Key
  OPNSENSE_API_SECRET       API Secret
  OPNSENSE_VERIFY_SSL       Set to 'false' to disable SSL verification

Examples:
  # Start with command line arguments
  opnsense-mcp-server --url https://192.168.1.1 --api-key mykey --api-secret mysecret

  # Start with environment variables
  export OPNSENSE_URL=https://192.168.1.1
  export OPNSENSE_API_KEY=mykey
  export OPNSENSE_API_SECRET=mysecret
  opnsense-mcp-server

  # Start without initial configuration (configure later via tools)
  opnsense-mcp-server
`);
}

async function main() {
  const args = parseArgs();

  if (args.help) {
    showHelp();
    process.exit(0);
  }

  // Build configuration from args and environment
  const config: Partial<ServerConfig> = {};

  // Check for OPNsense configuration
  const url = args.url || process.env.OPNSENSE_URL;
  const apiKey = args.apiKey || process.env.OPNSENSE_API_KEY;
  const apiSecret = args.apiSecret || process.env.OPNSENSE_API_SECRET;
  const verifySsl = args.verifySsl ?? (process.env.OPNSENSE_VERIFY_SSL !== 'false');

  if (url && apiKey && apiSecret) {
    config.opnsense = { url, apiKey, apiSecret, verifySsl };
  }

  // Create and run server
  const server = new OPNsenseMCPServer(config as ServerConfig);
  await server.run();
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

// Export for library usage
export { OPNsenseMCPServer } from './server/index.js';
export type { ServerConfig, ServerContext } from './types/index.js';