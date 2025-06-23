# OPNsense MCP Server

A comprehensive Model Context Protocol (MCP) server that provides **154 tools** for complete OPNsense firewall management through its API. Built on the [@richard-stovall/opnsense-typescript-client](https://www.npmjs.com/package/@richard-stovall/opnsense-typescript-client) package.

## 🚀 Features

- **🔧 154 MCP Tools** - Complete coverage of OPNsense API functionality
- **🛡️ Advanced Firewall Management** - Rules, aliases, states, and audit tools
- **🔐 VPN Management** - OpenVPN and IPsec configuration and monitoring
- **👥 User & Certificate Management** - Authentication, groups, and PKI operations
- **🌐 Network Operations** - Interfaces, VLANs, DHCP, and diagnostics
- **📦 System Administration** - Firmware, services, packages, and configuration
- **🔌 Plugin Support** - 24 additional tools for popular OPNsense plugins
- **⚡ Modern Architecture** - Built with Bun, TypeScript, and comprehensive error handling

## 📊 API Coverage

| Category | Tools | Description |
|----------|-------|-------------|
| **System Management** | 9 | Status, reboot, health, temperature, resources |
| **Firmware & Packages** | 9 | Updates, packages, plugins, security audits |
| **Firewall & Security** | 15 | Rules, aliases, states, logs, audit tools |
| **Network Diagnostics** | 15 | ARP, PF states, DNS, interface statistics |
| **Service Management** | 6 | Start, stop, restart system services |
| **VLAN Management** | 6 | Create, configure, manage VLANs |
| **User Authentication** | 9 | Users, groups, API keys |
| **Certificate Management** | 7 | Certificates, CAs, PKI operations |
| **OpenVPN Management** | 11 | Instances, sessions, configuration |
| **IPsec Management** | 15 | Connections, tunnels, sessions |
| **DHCP Management** | 12 | Leases, reservations, configuration |
| **Plugin Tools** | 24 | WireGuard, Nginx, HAProxy, Bind, etc. |
| **Utilities** | 5 | Configuration, backups, custom API calls |
| **Total** | **154** | **Complete OPNsense API coverage** |

## 🛠️ Installation

Install globally (recommended for CLI use):

```sh
npm install -g opnsense-mcp-server
```

Or install locally in your project:

```sh
npm install opnsense-mcp-server
```

## 🎯 Quick Start

### Basic Usage
```bash
# Show available options
bun run index.ts --help

# Connect to OPNsense
bun run index.ts --host https://192.168.1.1 --api-key YOUR_API_KEY --api-secret YOUR_API_SECRET

# Without SSL verification (self-signed certificates)
bun run index.ts --host https://192.168.1.1 --api-key YOUR_KEY --api-secret YOUR_SECRET --no-verify-ssl
```

### With Plugin Support
```bash
# Enable plugin-specific tools (adds 24 additional tools)
bun run index.ts --host https://192.168.1.1 --api-key YOUR_KEY --api-secret YOUR_SECRET --plugins
```

### Dynamic Configuration
```bash
# Start without configuration, then use the configure_opnsense_connection tool
bun run index.ts
```

## 📋 Available Scripts

```bash
bun run start       # Start the MCP server
bun run dev         # Start with hot reload
bun run help        # Show command-line help
bun run build       # Build the project
bun run build:watch # Build with watch mode
```

## 🔧 Core MCP Tools

### System Management
- `get_system_status` - System status and information
- `system_reboot` - Reboot the OPNsense system
- `system_halt` - Shutdown the OPNsense system
- `get_system_health` - Comprehensive health metrics
- `get_system_temperature` - Temperature monitoring
- `get_cpu_usage` - CPU utilization
- `get_memory_usage` - Memory usage details
- `get_disk_usage` - Disk space information
- `dismiss_system_status` - Clear status notifications

### Firmware & Package Management
- `firmware_get_info` - Firmware information
- `firmware_check_updates` - Check for updates
- `firmware_update` - Update firmware
- `firmware_upgrade` - Upgrade firmware
- `firmware_audit` - Security audit
- `firmware_get_changelog` - Version changelog
- `list_plugins` - Installed plugins
- `install_plugin` - Install new plugins
- `package_*` - Package operations (lock, unlock, remove, etc.)

### Advanced Firewall Management
- **Rule Operations**: Create, read, update, delete, move, toggle rules
- **Advanced Controls**: Apply changes, create savepoints, revert configurations
- **Statistics**: Rule performance and usage statistics
- **Alias Management**: Complete alias lifecycle with import/export
- **State Management**: PF states, connections, and cleanup
- **Audit Tools**: Security analysis and recommendations

### VPN Management

#### OpenVPN (11 tools)
- Instance management (add, update, delete, toggle)
- Service control (start, stop, restart)
- Session monitoring and management
- Configuration management

#### IPsec (15 tools)
- Connection management (CRUD operations)
- Service control and status
- Phase 1 and Phase 2 session management
- Tunnel establishment and monitoring

### Network Operations
- **Interface Management**: Details, statistics, reload operations
- **VLAN Operations**: Complete VLAN lifecycle management
- **DHCP Services**: Leases, reservations, configuration
- **Diagnostics**: ARP tables, DNS lookups, routing information

### User & Security Management
- **User Operations**: Create, update, delete users
- **Group Management**: User group administration  
- **API Key Management**: Generate and manage API access
- **Certificate Operations**: PKI management and CA operations

## 🔌 Plugin Support

When enabled with `--plugins`, additional tools are available for:

- **WireGuard VPN** - Modern VPN protocol
- **Nginx** - Web server and reverse proxy
- **HAProxy** - Load balancer and proxy
- **Bind DNS** - DNS server management
- **Caddy** - Modern web server with auto-HTTPS
- **CrowdSec** - Security engine and threat detection
- **NetSNMP** - SNMP monitoring
- **Netdata** - Real-time performance monitoring

## 🔧 Configuration

### Command Line Arguments
```bash
--host <url>        # OPNsense host URL (e.g., https://opnsense.local)
--api-key <key>     # OPNsense API key
--api-secret <secret> # OPNsense API secret
--no-verify-ssl     # Disable SSL verification (default: enabled)
--plugins           # Enable plugin-specific tools
--help, -h          # Show help message
```

### Environment Variables
The server can also read configuration from environment variables or be configured dynamically using the `configure_opnsense_connection` MCP tool.

## 🛡️ Security Features

- **Authentication**: Secure API key and secret-based authentication
- **SSL/TLS Support**: Configurable SSL verification for secure connections
- **Input Validation**: Comprehensive schema validation using Zod
- **Error Handling**: Robust error reporting and recovery
- **Audit Capabilities**: Built-in security audit and compliance tools

## 📖 API Reference

For detailed information about all 154 available tools, see [API_COVERAGE.md](./API_COVERAGE.md).

### Example Tool Usage

```typescript
// System status
await callTool("get_system_status", {})

// Add firewall rule
await callTool("firewall_add_rule", {
  description: "Allow SSH",
  interface: "wan",
  protocol: "tcp",
  destination_port: "22",
  action: "pass"
})

// Manage VPN connections
await callTool("search_openvpn_instances", {})
await callTool("get_ipsec_connection", { uuid: "connection-uuid" })

// Certificate management
await callTool("search_certificates", {})
await callTool("add_certificate", { certificate: {...} })
```

## 🔍 Monitoring & Diagnostics

- **System Health**: Temperature, CPU, memory, disk monitoring
- **Network Diagnostics**: Interface statistics, ARP tables, PF states
- **Service Status**: Monitor and control system services
- **Log Analysis**: Firewall logs and system activity
- **Performance Metrics**: Real-time system performance data

## 🚀 Advanced Features

- **Configuration Management**: Backup, restore, and rollback capabilities
- **Bulk Operations**: Efficient batch processing of firewall rules and aliases
- **Custom API Calls**: Execute arbitrary OPNsense API calls
- **State Management**: Comprehensive firewall state monitoring and control
- **Plugin Ecosystem**: Extensible plugin architecture

## 🛠️ Development

This project uses modern development practices:

- **Runtime**: [Bun](https://bun.sh) for fast JavaScript/TypeScript execution
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Error Handling**: Robust error management and reporting
- **Documentation**: Extensive inline documentation and examples

### Building from Source

```bash
# Clone the repository
git clone <repository-url>
cd opnsense-mcp-server

# Install dependencies
bun install

# Build the project
bun run build

# Run tests
bun test
```

## 📋 Requirements

- **Runtime**: Bun (latest version recommended)
- **Target**: OPNsense firewall with API access enabled
- **Authentication**: Valid OPNsense API key and secret
- **Network**: Network connectivity to OPNsense management interface

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests.

## 📞 Support

For support and questions:
- Check the [API Coverage Documentation](./API_COVERAGE.md)
- Review the built-in help: `bun run index.ts --help`
- Open an issue for bugs or feature requests

---

**Note**: This MCP server provides comprehensive access to OPNsense functionality. Always test configurations in a safe environment before applying changes to production systems.

## Usage

After installing globally, run:

```sh
opnsense-mcp-server --help
```

Or, if installed locally, use npx:

```sh
npx opnsense-mcp-server --help
```