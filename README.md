# OPNsense MCP Server

A Model Context Protocol (MCP) server that provides tools for managing OPNsense firewall through its API.

## Installation

To install dependencies:

```bash
bun install
```

## Usage

### Command Line Options

```bash
# Show help
bun run help

# Run with OPNsense configuration
bun run index.ts --host https://opnsense.local --api-key YOUR_API_KEY --api-secret YOUR_API_SECRET

# Run without SSL verification
bun run index.ts --host https://192.168.1.1 --api-key YOUR_API_KEY --api-secret YOUR_API_SECRET --no-verify-ssl

# Run without configuration (configure via MCP tools)
bun run index.ts
```

### Available Scripts

- `bun run start` - Start the MCP server
- `bun run dev` - Start with hot reload
- `bun run help` - Show command-line help

## MCP Tools

This server exposes the following tools for OPNsense management:

### Configuration
- `configure_opnsense_connection` - Configure OPNsense connection if not provided via CLI

### System Operations
- `get_system_status` - Get OPNsense system status
- `get_system_health` - Get system health metrics
- `get_system_routes` - Get system routing table
- `backup_config` - Create a backup of the OPNsense configuration

### Firewall Management
- `firewall_get_rules` - Get firewall rules with pagination and search
- `firewall_add_rule` - Add a new firewall rule
- `firewall_delete_rule` - Delete a firewall rule by UUID
- `firewall_toggle_rule` - Enable or disable a firewall rule
- `get_firewall_aliases` - Get firewall aliases
- `add_to_alias` - Add an entry to a firewall alias
- `delete_from_alias` - Delete an entry from a firewall alias
- `get_firewall_logs` - Get firewall log entries

### Network & Interfaces
- `get_interfaces` - Get network interfaces information
- `get_dhcp_leases` - Get DHCP leases

### Services & Plugins
- `restart_service` - Restart an OPNsense service
- `list_plugins` - List installed plugins
- `install_plugin` - Install a plugin
- `get_vpn_connections` - Get VPN connection status

### Advanced
- `get_api_endpoints` - List available API endpoints
- `exec_api_call` - Execute a custom API call
- `perform_firewall_audit` - Perform a basic security audit

## API Configuration

You can configure the OPNsense connection in two ways:

1. **Command-line arguments** (recommended for persistent connections):
   ```bash
   bun run index.ts --host https://opnsense.local --api-key YOUR_KEY --api-secret YOUR_SECRET
   ```

2. **MCP tool** (for dynamic configuration):
   Use the `configure_opnsense_connection` tool after starting the server.

## Development

This project was created using `bun init` and uses [Bun](https://bun.sh) as the JavaScript runtime.

## Requirements

- Bun runtime
- OPNsense firewall with API access enabled
- Valid OPNsense API key and secret
