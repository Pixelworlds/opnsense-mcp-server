import { coreInitialization } from '../core/initialization.js';
import { pluginInitialization } from '../plugins/initialization.js';
import { PROMPT_TEMPLATES } from './prompt-templates.js';
import { OPNSENSE_RESOURCES } from './simple-resources.js';
import { ENHANCED_TOOL_DESCRIPTIONS } from './simple-tools.js';

export const serverInitializationResponse = {
  protocolVersion: '2024-11-05',
  capabilities: {
    tools: {
      listChanged: false,
    },
    resources: {
      subscribe: true,
      listChanged: false,
    },
    prompts: {
      listChanged: false,
    },
    logging: {
      level: 'info',
    },
  },
  serverInfo: {
    name: 'opnsense-mcp-server',
    version: '0.1.2',
    description:
      'Comprehensive MCP server for OPNsense firewall management with 154+ tools covering complete API surface including core system management, firewall operations, VPN services, and plugin ecosystem',
    author: 'Richard Stovall',
    homepage: 'https://github.com/richard-stovall/opnsense-mcp-server',
  },
  instructions:
    'This server provides enterprise-grade management capabilities for OPNsense firewall systems with complete API coverage:\n\n🔧 **System Management** - Monitor health, control services, manage firmware and packages\n🛡️ **Firewall Operations** - Complete rule lifecycle, aliases, states, and security auditing  \n🌐 **Network Management** - Interface configuration, VLANs, DHCP, and diagnostics\n🔒 **VPN Services** - OpenVPN, IPsec, and WireGuard management and monitoring\n👥 **User & Security** - Authentication, certificates, API keys, and access control\n🔌 **Plugin Ecosystem** - Nginx, HAProxy, BIND, Caddy, CrowdSec, Netdata, and more\n\n**Safety Guidelines:**\n• Always backup configuration before major changes\n• Verify firewall rules in test environment first  \n• Use savepoints for complex rule modifications\n• Monitor system resources during operations\n• Review logs after configuration changes\n\nThe server supports both read-only monitoring and administrative operations with comprehensive error handling and audit capabilities.',
  metadata: {
    core_endpoints: coreInitialization.endpoints,

    plugin_endpoints: pluginInitialization.endpoints,

    tool_categories: {
      ...coreInitialization.tool_categories,
      ...pluginInitialization.plugin_categories,
    },

    api_coverage: {
      ...coreInitialization.api_coverage,
      ...pluginInitialization.api_coverage,
      total_endpoints: `${coreInitialization.api_coverage.total_endpoints}+${pluginInitialization.api_coverage.total_endpoints}`,
    },

    security_features: {
      ...coreInitialization.security_features,
    },
    operational_capabilities: {
      ...coreInitialization.operational_capabilities,
    },
    monitoring_features: {
      real_time_metrics: true,
      historical_data: true,
      alerting: 'status_based',
      performance_tracking: 'detailed',
      log_analysis: 'integrated',
    },

    available_resources: Object.keys(OPNSENSE_RESOURCES),
    resource_categories: [
      'system',
      'firewall',
      'network',
      'vpn',
      'users',
      'certificates',
      'logs',
      'diagnostics',
      'plugins',
      'configuration',
    ],

    available_prompts: Object.keys(PROMPT_TEMPLATES),
    prompt_categories: [
      'System Management',
      'Security Operations',
      'Network Management',
      'VPN Configuration',
      'Compliance & Audit',
      'Troubleshooting',
    ],

    supported_versions: ['OPNsense 23.1+', 'OPNsense 24.x', 'OPNsense 25.x'],
    api_protocol: 'OPNsense REST API v2',
    connection_methods: ['HTTPS', 'API Key Authentication'],
    response_formats: ['JSON', 'XML (legacy)'],
    rate_limiting: 'configurable',
    concurrent_connections: 'supported',

    mcp_features: {
      tools: '154+ comprehensive tools',
      resources: '10+ resource types with subscriptions',
      prompts: '8 specialized prompt templates',
      logging: 'detailed operation logging',
      error_handling: 'comprehensive with recovery',
    },
  },

  tool_descriptions: ENHANCED_TOOL_DESCRIPTIONS,

  resource_documentation: OPNSENSE_RESOURCES,

  prompt_templates: PROMPT_TEMPLATES,
};
