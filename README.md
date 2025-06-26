# OPNsense MCP Server

A comprehensive Model Context Protocol (MCP) server that provides **326 tools** for complete OPNsense firewall management through a type-safe TypeScript interface.

## Features

- 🔧 **326 Comprehensive Tools** - Complete coverage of OPNsense core and plugin APIs
- 🔒 **Type-Safe** - Full TypeScript support with the [@richard-stovall/opnsense-typescript-client](https://www.npmjs.com/package/@richard-stovall/opnsense-typescript-client) package
- 🚀 **High Performance** - Built with modern tooling (Yarn 4.9.2, Rollup, tsx)
- 🔌 **Plugin Support** - Optional support for 145 plugin-specific tools
- 🛡️ **Enterprise Ready** - Advanced workflows for security audits, compliance, and automation
- 📊 **Complete API Coverage** - Covers all 601 OPNsense API endpoints

## Installation

```bash
# Clone the repository
git clone https://github.com/richard-stovall/opnsense-mcp-server.git
cd opnsense-mcp-server

# Install dependencies with Yarn 4.9.2
yarn install

# Build the project
yarn build
```

## Quick Start

### Basic Usage

```bash
yarn start --host https://192.168.1.1 --api-key your-api-key --api-secret your-api-secret
```

### With Plugin Support

```bash
yarn start --host https://192.168.1.1 --api-key your-api-key --api-secret your-api-secret --plugins
```

### Without SSL Verification (Development Only)

```bash
yarn start --host https://192.168.1.1 --api-key your-api-key --api-secret your-api-secret --no-verify-ssl
```

## Configuration

### Command Line Options

- `--host` - OPNsense host URL (required)
- `--api-key` - API key for authentication (required)
- `--api-secret` - API secret for authentication (required)
- `--plugins` - Enable plugin tools (optional, adds 145 additional tools)
- `--no-verify-ssl` - Disable SSL verification (development only)

### Environment Variables

You can also set credentials via environment variables:

```bash
export OPNSENSE_HOST=https://192.168.1.1
export OPNSENSE_API_KEY=your-api-key
export OPNSENSE_API_SECRET=your-api-secret
```

## Available Tools

### Core System Management (181 tools)

#### Basic Operations
- System status, health monitoring, and diagnostics
- Backup and restore operations
- Firmware management and updates
- High availability synchronization

#### Network Management
- Firewall rules and aliases
- Interface configuration and VLANs
- VPN management (OpenVPN, IPsec, WireGuard)
- Traffic shaping and monitoring

#### Security Features
- User and group management
- Certificate management
- Security audits and compliance reporting
- Threat intelligence integration

#### Advanced Workflows (52 specialized tools)
- Enterprise health checks
- Network topology scanning
- Multi-WAN optimization
- Disaster recovery planning
- AI-powered operations
- Container orchestration support

### Plugin Support (145 tools when enabled)

- **Tier 1 Plugins**: WireGuard, Nginx, HAProxy, Bind DNS, Caddy
- **Tier 2 Plugins**: Telegraf, NetSNMP, Maltrail, CrowdSec
- **Tier 3 Plugins**: 40+ additional plugins

## Development

### Scripts

```bash
yarn build          # Build the project
yarn watch          # Build with watch mode
yarn dev            # Run with hot reload
yarn start          # Start the MCP server
yarn test           # Run tests
yarn test:coverage  # Run tests with coverage
yarn typecheck      # Type check without emitting
yarn lint           # Lint the code
yarn format         # Format code with Prettier
```

### Project Structure

```
├── src/
│   ├── index.ts              # Main entry point
│   ├── server/               # MCP server implementation
│   ├── utils/                # Utility functions
│   └── types/                # TypeScript type definitions
├── tests/                    # Test files
├── dist/                     # Built output
├── package.json              # Project configuration
├── tsconfig.json             # TypeScript configuration
└── rollup.config.js          # Build configuration
```

### Technology Stack

- **Runtime**: Node.js with tsx for TypeScript execution
- **Package Manager**: Yarn 4.9.2 with Plug'n'Play
- **Build System**: Rollup with TypeScript plugin
- **Language**: TypeScript 5.3+
- **MCP SDK**: @modelcontextprotocol/sdk
- **API Client**: @richard-stovall/opnsense-typescript-client
- **Validation**: Zod for schema validation
- **Testing**: Jest with TypeScript support

## API Integration

The server uses the [@richard-stovall/opnsense-typescript-client](https://www.npmjs.com/package/@richard-stovall/opnsense-typescript-client) package which provides:

- Complete type safety for all API calls
- Built-in error handling and retries
- Support for all 601 OPNsense API endpoints
- Modern Fetch API based implementation

### Example Tool Implementation

```typescript
const response = await client.system.getStatus();
return {
  content: [{
    type: 'text',
    text: JSON.stringify(response.data, null, 2)
  }],
};
```

## Security Considerations

- **API Keys**: Never commit API credentials to version control
- **SSL Verification**: Always enable SSL verification in production
- **Input Validation**: All inputs are validated with Zod schemas
- **Error Handling**: Sensitive information is never exposed in errors
- **Audit Trail**: Built-in tools for security auditing

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built on the [Model Context Protocol](https://modelcontextprotocol.io/) by Anthropic
- Powered by [@richard-stovall/opnsense-typescript-client](https://www.npmjs.com/package/@richard-stovall/opnsense-typescript-client)
- Inspired by the OPNsense community

## Support

- 📧 Email: richard@stovall.com
- 🐛 Issues: [GitHub Issues](https://github.com/richard-stovall/opnsense-mcp-server/issues)
- 📖 Documentation: [API Coverage](API_COVERAGE.md)

---

Made with ❤️ for the OPNsense community 