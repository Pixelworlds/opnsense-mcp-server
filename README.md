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

## Custom Module Configuration

The server includes a powerful build configuration system that allows you to customize which OPNsense modules and plugins are included in your build. This is useful for reducing bundle size, improving performance, or creating specialized builds for specific use cases.

### Build Configuration File

The module selection is controlled by the Rollup build configuration in `rollup.config.js`. The build system uses a configuration object that specifies which core modules and plugins to include:

```javascript
// rollup.config.js - Build Configuration Example
const buildConfig = {
  "core": {
    "description": "Core OPNsense modules - always included",
    "modules": {
      "auth": true,           // User authentication and management
      "backup": true,         // Configuration backup and restore
      "firewall": true,       // Firewall rules and management
      "interfaces": true,     // Network interface configuration
      "system": true,         // System status and management
      "diagnostics": false,   // Disable diagnostic tools
      "firmware": false,      // Disable firmware management
      // ... other core modules
    }
  },
  "plugins": {
    "description": "Plugin modules - can be selectively included",
    "includeAll": false,      // Set to true to include all plugins
    "modules": {
      "nginx": true,          // Include Nginx plugin
      "haproxy": true,        // Include HAProxy plugin
      "wg_wireguard": true,   // Include WireGuard plugin
      "bind": false,          // Exclude BIND DNS plugin
      "collectd": false,      // Exclude Collectd plugin
      // ... other plugin modules
    }
  }
}
```

### Available Core Modules

The following core modules can be selectively enabled/disabled:

| Module | Description | Default |
|--------|-------------|---------|
| `auth` | User authentication and management | ✅ |
| `backup` | Configuration backup and restore | ✅ |
| `cron` | Scheduled task management | ✅ |
| `dashboard` | Dashboard configuration | ✅ |
| `dhcp` | DHCP server management | ✅ |
| `diagnostics` | System diagnostics and monitoring | ✅ |
| `firewall` | Firewall rules and aliases | ✅ |
| `firmware` | Firmware and package management | ✅ |
| `hasync` | High availability synchronization | ✅ |
| `interfaces` | Network interface configuration | ✅ |
| `ipsec` | IPsec VPN management | ✅ |
| `nat` | Network address translation | ✅ |
| `openvpn` | OpenVPN server/client management | ✅ |
| `routes` | Static routing configuration | ✅ |
| `services` | System service management | ✅ |
| `system` | System status and configuration | ✅ |
| `users` | User and group management | ✅ |

### Available Plugin Modules

Popular plugins that can be selectively included:

| Plugin | Description | Tier |
|--------|-------------|------|
| `nginx` | Nginx web server and reverse proxy | 1 |
| `haproxy` | HAProxy load balancer | 1 |
| `wg_wireguard` | WireGuard VPN | 1 |
| `bind` | BIND DNS server | 1 |
| `caddy` | Caddy web server | 1 |
| `telegraf` | Telegraf metrics collection | 2 |
| `net_snmp` | SNMP monitoring | 2 |
| `maltrail` | Malicious traffic detection | 2 |
| `crowdsec` | CrowdSec security engine | 2 |

### Creating Custom Builds

#### 1. Minimal Core Build
For a lightweight build with only essential functionality:

```javascript
const buildConfig = {
  "core": {
    "modules": {
      "system": true,
      "firewall": true,
      "interfaces": true,
      // Disable everything else
      "auth": false,
      "backup": false,
      "diagnostics": false,
      // ... set others to false
    }
  },
  "plugins": {
    "includeAll": false,
    "modules": {} // No plugins
  }
}
```

#### 2. VPN-Focused Build
For VPN management and security:

```javascript
const buildConfig = {
  "core": {
    "modules": {
      "system": true,
      "firewall": true,
      "interfaces": true,
      "openvpn": true,
      "ipsec": true,
      "auth": true,
      "backup": true,
      // Disable non-VPN modules
      "dhcp": false,
      "nat": false,
      // ... 
    }
  },
  "plugins": {
    "includeAll": false,
    "modules": {
      "wg_wireguard": true,  // WireGuard VPN
      "nginx": true,         // For VPN portal
      // Exclude other plugins
    }
  }
}
```

#### 3. Web Services Build
For web hosting and load balancing:

```javascript
const buildConfig = {
  "core": {
    "modules": {
      "system": true,
      "firewall": true,
      "interfaces": true,
      "backup": true,
      // Web-specific modules
      "nat": true,
      // ...
    }
  },
  "plugins": {
    "includeAll": false,
    "modules": {
      "nginx": true,      // Web server
      "haproxy": true,    // Load balancer
      "caddy": true,      // Alternative web server
      "bind": true,       // DNS management
    }
  }
}
```

### Building with Custom Configuration

1. **Edit the configuration** in `rollup.config.js`
2. **Rebuild the project**:
   ```bash
   yarn build
   ```
3. **Test your custom build**:
   ```bash
   yarn start --help
   ```

### Module Dependencies

When customizing your build, consider these dependencies:

- **backup** module is recommended for all builds (disaster recovery)
- **system** module provides essential monitoring capabilities
- **firewall** module is typically required for security management
- **interfaces** module is needed for network configuration

### Performance Impact

**Smaller builds provide:**
- ✅ Faster startup times
- ✅ Reduced memory usage  
- ✅ Smaller bundle size
- ✅ Fewer API endpoints to manage

**Trade-offs:**
- ❌ Reduced functionality
- ❌ Some advanced workflows may not be available
- ❌ Plugin-specific features are excluded

### Best Practices

1. **Start with defaults**: Begin with the full build and identify unused modules
2. **Keep essentials**: Always include `system`, `firewall`, and `backup` modules
3. **Test thoroughly**: Verify your use cases work with the custom build
4. **Document changes**: Keep track of which modules you've disabled and why
5. **Version control**: Commit your custom configuration for reproducible builds

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