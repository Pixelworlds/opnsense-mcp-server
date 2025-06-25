# OPNsense MCP Server

A comprehensive Model Context Protocol (MCP) server that provides **326 tools** for complete OPNsense firewall management through its API. Built on the [@richard-stovall/opnsense-typescript-client](https://www.npmjs.com/package/@richard-stovall/opnsense-typescript-client) package.

## 🚀 Features

- **🔧 326 MCP Tools** - Complete coverage of OPNsense API functionality plus advanced workflows
- **🛡️ Advanced Firewall Management** - Rules, aliases, states, and audit tools
- **🔐 VPN Management** - OpenVPN and IPsec configuration and monitoring
- **👥 User & Certificate Management** - Authentication, groups, and PKI operations
- **🌐 Network Operations** - Interfaces, VLANs, DHCP, and diagnostics
- **📦 System Administration** - Firmware, services, packages, and configuration
- **🔌 Extensive Plugin Support** - 145 additional tools for 50+ OPNsense plugins
- **⚡ Modern Architecture** - Built with TypeScript, Yarn 4.9.2, and comprehensive error handling
- **🤖 Advanced Workflows** - 52 specialized workflow tools for enterprise management
- **🛡️ Security & Compliance** - Automated auditing, threat detection, and compliance reporting
- **🔄 AI-Powered Operations** - Intelligent automation and optimization capabilities

## 📊 API Coverage

| Category | Tools | Description |
|----------|-------|-------------|
| **Core System Management** | 122 | Status, firmware, services, backup, dashboard, HA sync |
| **Advanced Diagnostics** | 19 | CPU, memory, interfaces, firewall, network tools |
| **Firewall Management** | 18 | Rules, aliases, security policies, audit tools |
| **Authentication & Users** | 11 | Users, groups, API keys, certificates |
| **VPN Services** | 18 | OpenVPN and IPsec management |
| **Network Interfaces** | 9 | Interface configuration and VLAN management |
| **Specialized Workflows** | 52 | Enterprise automation and AI-powered operations |
| **Plugin Tools** | 145 | 50+ plugins including WireGuard, Nginx, HAProxy, Bind, etc. |
| **Total Core Tools** | **181** | **Complete core functionality** |
| **Total Plugin Tools** | **145** | **Comprehensive plugin ecosystem** |
| **Grand Total** | **326** | **Complete OPNsense API coverage + workflows** |

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
# Enable plugin-specific tools (adds 145 additional tools)
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

## 🔧 Core MCP Tools (181 tools)

### System Management (19 tools)
- `get_system_status` - System status and information
- `system_reboot` - Reboot the OPNsense system
- `system_halt` - Shutdown the OPNsense system
- `get_system_health` - Comprehensive health metrics
- `get_system_temperature` - Temperature monitoring
- `get_cpu_usage` - CPU utilization
- `get_memory_usage` - Memory usage details
- `get_disk_usage` - Disk space information
- `dismiss_system_status` - Clear status notifications
- Plus 10 additional system management tools

### Firmware & Package Management (13 tools)
- `firmware_get_info` - Firmware information
- `firmware_check_updates` - Check for updates
- `firmware_update` - Update firmware
- `firmware_upgrade` - Upgrade firmware
- `firmware_audit` - Security audit
- `firmware_get_changelog` - Version changelog
- `list_plugins` - Installed plugins
- `install_plugin` - Install new plugins
- `package_*` - Package operations (lock, unlock, remove, etc.)
- Plus 4 additional firmware management tools

### Advanced Firewall Management (18 tools)
- **Rule Operations**: Create, read, update, delete, move, toggle rules
- **Advanced Controls**: Apply changes, create savepoints, revert configurations
- **Statistics**: Rule performance and usage statistics
- **Alias Management**: Complete alias lifecycle with import/export
- **State Management**: PF states, connections, and cleanup
- **Audit Tools**: Security analysis and recommendations

### VPN Management

#### OpenVPN (9 tools)
- Instance management (add, update, delete, toggle)
- Service control (start, stop, restart)
- Session monitoring and management
- Configuration management

#### IPsec (9 tools)
- Connection management (CRUD operations)
- Service control and status
- Phase 1 and Phase 2 session management
- Tunnel establishment and monitoring

### Network Operations (9 tools)
- **Interface Management**: Details, statistics, reload operations
- **VLAN Operations**: Complete VLAN lifecycle management
- **Diagnostics**: ARP tables, DNS lookups, routing information

### User & Security Management (11 tools)
- **User Operations**: Create, update, delete users
- **Group Management**: User group administration  
- **API Key Management**: Generate and manage API access
- **Certificate Operations**: PKI management and CA operations

### 🤖 Specialized Workflow Tools (52 tools)

#### Enterprise Management
- `system_health_check` - Comprehensive multi-metric health assessment
- `security_audit_full` - Complete security posture analysis
- `compliance_reporting` - Generate compliance reports (CIS, NIST, PCI-DSS)
- `automated_incident_response` - Automated threat response workflows
- `configuration_drift_detection` - Detect changes from baseline
- `backup_management_wizard` - Automated backup scheduling and retention
- `firmware_update_wizard` - Guided updates with pre-checks and rollback

#### Advanced Networking
- `network_topology_scan` - Comprehensive network discovery and mapping
- `multi_wan_optimization` - Load balancing and failover optimization
- `vpn_performance_optimization` - VPN throughput and latency tuning
- `bandwidth_management_optimization` - QoS and traffic shaping
- `network_troubleshooting_wizard` - Automated network diagnostics

#### Security & Compliance
- `threat_intelligence_integration` - External threat feed integration
- `network_security_hardening` - Apply security best practices
- `zero_trust_implementation` - Zero trust architecture deployment
- `advanced_threat_hunting` - AI-powered threat detection
- `security_baseline_enforcement` - Maintain security configurations

#### Operations & Automation
- `ai_ops_automation` - Machine learning-powered operations
- `change_management_workflow` - Configuration change approval process
- `disaster_recovery_planning` - DR preparation and testing
- `capacity_planning_analysis` - Resource utilization forecasting
- `performance_monitoring` - Real-time performance dashboards
- `service_dependency_check` - Validate service dependencies

#### Data & Analytics
- `log_analysis_advanced` - Pattern detection and alert generation
- `traffic_analysis_real_time` - Live network traffic monitoring
- `api_usage_analytics` - API performance and usage metrics
- `cost_optimization_analysis` - Resource cost analysis and optimization

#### Modern Infrastructure
- `container_orchestration` - Container deployment and management
- `service_mesh_configuration` - Service mesh setup and management
- `edge_computing_management` - Edge node deployment and sync
- `iot_device_management` - IoT device security and profiling
- `blockchain_integration` - Blockchain service integration
- `quantum_safe_cryptography` - Post-quantum cryptography implementation

#### Enterprise Tools
- `plugin_lifecycle_management` - Complete plugin management workflow
- `certificate_management_bulk` - Bulk certificate operations
- `bulk_user_management` - Efficient multi-user operations
- `license_management_tracker` - Software license tracking and alerts
- `automated_testing_suite` - System functionality validation
- `configuration_template_engine` - Template-based configuration deployment
- `system_migration_assistant` - Version migration support
- `plugin_compatibility_checker` - Plugin dependency validation
- `custom_dashboard_builder` - Dynamic monitoring dashboard creation
- `data_retention_management` - Automated data lifecycle management
- `api_gateway_management` - API routing and rate limiting

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
- **Tool Handlers**: `CoreToolHandlers`, `PluginToolHandlers` (326 total tools with full type safety)
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

When enabled with `--plugins`, 145 additional tools are available for 50+ plugins including:

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

For detailed information about all 326 available tools, see [API_COVERAGE.md](./API_COVERAGE.md).

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

### Migration from Bun to Yarn 4.9.2

This project has been successfully migrated from Bun to Yarn 4.9.2 for improved compatibility and stability:

- **Package Manager**: Yarn 4.9.2 with Plug'n'Play (PnP) module resolution
- **Build System**: Rollup with TypeScript for optimized builds
- **Development**: tsx for fast TypeScript execution
- **Type Safety**: Comprehensive TypeScript with strict configuration
- **Module Resolution**: Bundler strategy for modern JavaScript

## 📋 Requirements

- **Runtime**: Node.js (>=18.0.0) and Yarn (>=4.9.2)
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

**Note**: This MCP server provides comprehensive access to OPNsense functionality with 326 tools covering complete API surface area plus advanced enterprise workflows. Always test configurations in a safe environment before applying changes to production systems.

## 🏗️ Architecture Overview

The OPNsense MCP Server is built with a modular architecture:

### Core Components
- **181 Core Tools** - Complete OPNsense API coverage
- **145 Plugin Tools** - Comprehensive plugin ecosystem support
- **52 Workflow Tools** - Advanced enterprise automation

### Technology Stack
- **Language**: TypeScript with full type safety
- **Runtime**: Node.js with tsx for development
- **Package Manager**: Yarn 4.9.2 with PnP resolution
- **Build System**: Rollup for optimized distribution
- **API Client**: @richard-stovall/opnsense-typescript-client
- **Validation**: Zod schemas for input validation
- **MCP Framework**: @modelcontextprotocol/sdk

### Tool Categories
1. **System Management** - Core system operations and monitoring
2. **Network Services** - Interfaces, VLANs, DHCP, diagnostics
3. **Security & Firewall** - Rules, policies, threat detection
4. **VPN Management** - OpenVPN and IPsec operations
5. **User & Authentication** - Identity and access management
6. **Plugin Ecosystem** - Extensive third-party plugin support
7. **Enterprise Workflows** - Advanced automation and AI-powered operations

This architecture ensures scalability, maintainability, and comprehensive coverage of OPNsense functionality while providing modern developer experience and enterprise-grade features.

## Usage

After installing globally, run:

```sh
opnsense-mcp-server --help
```

Or, if installed locally, use npx:

```sh
npx opnsense-mcp-server --help
```