# OPNsense MCP Server

A comprehensive Model Context Protocol (MCP) server that provides **319 tools** for complete OPNsense firewall management through its API. Built on the [@richard-stovall/opnsense-typescript-client](https://www.npmjs.com/package/@richard-stovall/opnsense-typescript-client) package.

## 🚀 Features

- **🔧 319 MCP Tools** - Complete coverage of OPNsense API functionality
- **🛡️ Advanced Firewall Management** - Rules, aliases, states, and audit tools
- **🔐 VPN Management** - OpenVPN and IPsec configuration and monitoring
- **👥 User & Certificate Management** - Authentication, groups, and PKI operations
- **🌐 Network Operations** - Interfaces, VLANs, DHCP, and diagnostics
- **📦 System Administration** - Firmware, services, packages, and configuration
- **🔌 Extensive Plugin Support** - 165 additional tools for 50+ OPNsense plugins
- **⚡ Modern Architecture** - Built with TypeScript, Yarn, and comprehensive error handling

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
| **Plugin Tools** | 165 | 50+ plugins including WireGuard, Nginx, HAProxy, Bind, etc. |
| **Utilities** | 5 | Configuration, backups, custom API calls |
| **Total** | **319** | **Complete OPNsense API coverage** |

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
yarn start --help

# Connect to OPNsense
yarn start --host https://192.168.1.1 --api-key YOUR_API_KEY --api-secret YOUR_API_SECRET

# Without SSL verification (self-signed certificates)
yarn start --host https://192.168.1.1 --api-key YOUR_KEY --api-secret YOUR_SECRET --no-verify-ssl
```

### With Plugin Support
```bash
# Enable plugin-specific tools (adds 165 additional tools)
yarn start --host https://192.168.1.1 --api-key YOUR_KEY --api-secret YOUR_SECRET --plugins
```

### Dynamic Configuration
```bash
# Start without configuration, then use the configure_opnsense_connection tool
yarn start
```

## 📋 Available Scripts

```bash
yarn start          # Start the MCP server
yarn dev            # Start with hot reload
yarn help           # Show command-line help
yarn build          # Build the project
yarn build:watch    # Build with watch mode
yarn type-check     # Type check without emitting
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

## 📦 Library Usage & Type Exports

This package exports comprehensive TypeScript types for use in other projects:

### Installation as a Library
```typescript
import {
  OPNsenseMcpServer,
  OPNsenseServer, // Backward compatibility alias
  ServerConfig,
  ToolDefinition,
  ToolHandler,
  CoreToolHandlers,
  PluginToolHandlers,
  ApiEndpoint,
  PromptTemplate,
  ResourceDefinition
} from 'opnsense-mcp-server';

// Or import from specific modules
import { coreTools, coreToolHandlers } from 'opnsense-mcp-server/core';
import { pluginTools, pluginToolHandlers } from 'opnsense-mcp-server/plugins';
import { PROMPT_TEMPLATES, TOOL_CATEGORIES } from 'opnsense-mcp-server/server';
```

### Available Type Exports
- **Core Types**: `ServerConfig`, `ToolDefinition`, `ToolHandler`, `ToolHandlers`
- **Tool Handlers**: `CoreToolHandlers`, `PluginToolHandlers` (154 total tools with full type safety)
- **API Documentation**: `ApiEndpoint`, `Parameter`, `CORE_API_MODULES`, `PLUGIN_API_MODULES`
- **Prompts**: `PromptTemplate`, `PromptArgument`, `PROMPT_TEMPLATES`, `PROMPT_CATEGORIES`
- **Resources**: `ResourceDefinition`, `ResourceSchema`, `OPNSENSE_RESOURCES`
- **Enhanced Types**: `EnhancedToolDefinition`, `ToolExample`, `AccessPattern`, `TOOL_WORKFLOWS`

### Build Outputs
The project builds to multiple formats:
- **CLI Executable**: `dist/index.js` (ESM) and `dist/index.cjs` (CommonJS)
- **Library**: `dist/lib.js` (ESM) and `dist/lib.cjs` (CommonJS)  
- **Type Definitions**: `dist/lib.d.ts` (2400+ lines of comprehensive types)

### Build Outputs
The package provides both CommonJS and ESM builds:
- **ESM**: `dist/index.js`, `dist/src/index.js`
- **CommonJS**: `dist/index.cjs`, `dist/src/index.cjs`
- **Types**: `dist/index.d.ts`, `dist/src/index.d.ts`

## 🔌 Plugin Support

When enabled with `--plugins`, 165 additional tools are available for 50+ plugins including:

### Core Plugins (Fully Implemented)
- **WireGuard VPN** - Modern VPN protocol with server/client management, keypair generation
- **Nginx** - Web server, reverse proxy, upstreams, locations
- **HAProxy** - Load balancer, backends, servers, statistics
- **Bind DNS** - DNS server, zones, domains, records, ACL management
- **Caddy** - Modern web server with reverse proxy, subdomains, handles
- **CrowdSec** - Security engine, threat detection, decisions
- **NetSNMP** - SNMP monitoring and configuration
- **Netdata** - Real-time performance monitoring

### Additional Plugins (Status & Configuration)
- **ACME Client** - SSL certificate automation
- **APC UPS Daemon** - UPS monitoring and management
- **Chrony** - Network time synchronization
- **C-ICAP** - Content inspection and adaptation
- **ClamAV** - Antivirus scanning
- **Collectd** - System statistics collection
- **DNSCrypt Proxy** - DNS privacy and security
- **Dynamic DNS** - Dynamic DNS updates
- **FreeRADIUS** - RADIUS authentication server
- **FTP Proxy** - FTP traffic proxying
- **Hardware Probe** - Hardware information gathering
- **iPerf** - Network performance testing
- **LLDP Daemon** - Link Layer Discovery Protocol
- **Maltrail** - Malicious traffic detection
- **mDNS Repeater** - Multicast DNS repeating
- **Munin Node** - System monitoring
- **Node Exporter** - Prometheus metrics
- **NRPE** - Nagios Remote Plugin Executor
- **Ntopng** - Network traffic monitoring
- **NUT** - Network UPS Tools
- **OpenConnect** - SSL VPN server
- **Postfix** - Mail transfer agent
- **Proxy** - HTTP/HTTPS proxy
- **Proxy SSO** - Single sign-on proxy
- **Puppet Agent** - Configuration management
- **QEMU Guest Agent** - VM guest tools
- **Quagga** - Routing protocols (BGP, OSPF, etc.)
- **RADSEC Proxy** - RADIUS over TLS
- **Redis** - In-memory data store
- **Relayd** - Load balancer and relay daemon
- **Rspamd** - Spam filtering system
- **Shadowsocks** - Secure proxy protocol
- **SIP Proxy** - SIP traffic proxying
- **SMART** - Disk health monitoring
- **SoftEther** - Multi-protocol VPN
- **SSLH** - SSL/SSH multiplexer
- **Stunnel** - SSL tunneling
- **Tailscale** - Zero-config VPN
- **Tayga** - NAT64 implementation
- **Telegraf** - Metrics collection agent
- **TFTP** - Trivial File Transfer Protocol
- **Tinc** - Mesh VPN
- **Tor** - Anonymity network
- **TURN Server** - NAT traversal
- **UDP Broadcast Relay** - UDP traffic relaying
- **VnStat** - Network statistics
- **Wazuh Agent** - Security monitoring
- **Wake on LAN** - Remote system wake-up
- **Zabbix Agent** - Infrastructure monitoring
- **Zabbix Proxy** - Monitoring proxy
- **ZeroTier** - Software-defined networking

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

- **Runtime**: Node.js with tsx for fast TypeScript execution
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Error Handling**: Robust error management and reporting
- **Documentation**: Extensive inline documentation and examples

### Building from Source

```bash
# Clone the repository
git clone <repository-url>
cd opnsense-mcp-server

# Install dependencies
yarn install

# Build the project
yarn build

# Run type checking
yarn type-check
```

## 📋 Requirements

- **Runtime**: Node.js (>=18.0.0) and Yarn (>=4.0.0)
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
- Review the built-in help: `yarn start --help`
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