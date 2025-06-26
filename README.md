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

### As an MCP Server

This package is designed to be used as an MCP (Model Context Protocol) server with AI assistants like Claude Desktop, Cursor, or other MCP-compatible clients.

### Prerequisites

- Node.js 18 or higher
- An OPNsense firewall with API access enabled
- API key and secret from your OPNsense installation

### Install from npm

```bash
npm install -g @richard-stovall/opnsense-mcp-server
```

## Usage as an MCP Server

### Claude Desktop Configuration

Add the following to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "opnsense": {
      "command": "npx",
      "args": [
        "-y",
        "@richard-stovall/opnsense-mcp-server"
      ],
      "env": {
        "OPNSENSE_HOST": "https://192.168.1.1",
        "OPNSENSE_API_KEY": "your-api-key",
        "OPNSENSE_API_SECRET": "your-api-secret",
        "OPNSENSE_VERIFY_SSL": "false"
      }
    }
  }
}
```

### Cursor Configuration

Add to your Cursor settings (`.cursor/mcp.json` in your project or `~/.cursor/mcp.json` globally):

```json
{
  "mcpServers": {
    "opnsense": {
      "command": "npx",
      "args": [
        "-y", 
        "@richard-stovall/opnsense-mcp-server"
      ],
      "env": {
        "OPNSENSE_HOST": "https://192.168.1.1",
        "OPNSENSE_API_KEY": "your-api-key",
        "OPNSENSE_API_SECRET": "your-api-secret",
        "OPNSENSE_VERIFY_SSL": "false"
      }
    }
  }
}
```

### Configuration Options

The server accepts configuration through environment variables:

- `OPNSENSE_HOST` - OPNsense host URL (required)
- `OPNSENSE_API_KEY` - API key for authentication (required)
- `OPNSENSE_API_SECRET` - API secret for authentication (required)
- `OPNSENSE_PLUGINS` - Set to "true" to enable plugin tools (optional)
- `OPNSENSE_VERIFY_SSL` - Set to "false" to disable SSL verification (development only)

## How It Works

Once configured, the MCP server provides your AI assistant with direct access to your OPNsense firewall. You can interact with it using natural language:

**Example prompts:**
- "Show me the current firewall status"
- "List all active VPN connections"
- "Create a new firewall rule to allow HTTPS traffic from 192.168.1.0/24"
- "Check system health and resource usage"
- "Backup the current configuration"
- "Show me recent security alerts"

The AI assistant will use the appropriate OPNsense tools to execute these requests and provide formatted responses.

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

## Building from Source

If you want to contribute or customize the server:

```bash
# Clone the repository
git clone https://github.com/richard-stovall/opnsense-mcp-server.git
cd opnsense-mcp-server

# Install dependencies with Yarn 4.9.2
yarn install

# Build the project
yarn build

# Run locally
yarn start
```

### Development Scripts

```bash
yarn build          # Build the project
yarn watch          # Build with watch mode
yarn dev            # Run with hot reload
yarn test           # Run tests
yarn test:coverage  # Run tests with coverage
yarn typecheck      # Type check without emitting
yarn lint           # Lint the code
yarn format         # Format code with Prettier
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

---

Made with ❤️ for the OPNsense community 