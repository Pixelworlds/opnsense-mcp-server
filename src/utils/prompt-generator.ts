import type { Prompt } from '@modelcontextprotocol/sdk/types.js';
import type { ServerContext, PromptMetadata } from '../types/index.js';

// Core prompts
const corePrompts: PromptMetadata[] = [
  {
    name: 'system_health_check',
    description: 'Perform a comprehensive system health check',
    arguments: [
      {
        name: 'include_services',
        description: 'Include service status check',
        required: false,
      },
    ],
    tools: ['core_system_getStatus', 'core_diagnostics_getSystemHealth', 'core_services_getStatus'],
    isPlugin: false,
  },
  {
    name: 'security_audit',
    description: 'Run a security audit on the firewall configuration',
    arguments: [
      {
        name: 'check_rules',
        description: 'Audit firewall rules for security issues',
        required: false,
      },
      {
        name: 'check_services',
        description: 'Check exposed services',
        required: false,
      },
    ],
    tools: ['core_firewall_searchRule', 'core_services_getStatus', 'core_system_getInfo'],
    isPlugin: false,
  },
  {
    name: 'network_troubleshooting',
    description: 'Troubleshoot network connectivity issues',
    arguments: [
      {
        name: 'target_host',
        description: 'Target host to test connectivity',
        required: true,
      },
      {
        name: 'interface',
        description: 'Specific interface to test from',
        required: false,
      },
    ],
    tools: ['core_diagnostics_ping', 'core_diagnostics_traceroute', 'core_interfaces_getOverview'],
    isPlugin: false,
  },
  {
    name: 'backup_configuration',
    description: 'Create a backup of the current configuration',
    arguments: [],
    tools: ['core_backup_create', 'core_backup_list'],
    isPlugin: false,
  },
  {
    name: 'firmware_update_check',
    description: 'Check for available firmware updates',
    arguments: [
      {
        name: 'include_packages',
        description: 'Include package updates',
        required: false,
      },
    ],
    tools: ['core_firmware_check', 'core_firmware_getInfo', 'core_system_getInfo'],
    isPlugin: false,
  },
];

// Plugin prompts
const pluginPrompts: PromptMetadata[] = [
  {
    name: 'wireguard_vpn_setup',
    description: 'Set up a new WireGuard VPN connection',
    arguments: [
      {
        name: 'peer_name',
        description: 'Name for the VPN peer',
        required: true,
      },
      {
        name: 'allowed_ips',
        description: 'Allowed IP ranges for the peer',
        required: true,
      },
    ],
    tools: ['plugin_wg_wireguard_addPeer', 'plugin_wg_wireguard_generateKeyPair', 'plugin_wg_wireguard_getStatus'],
    isPlugin: true,
  },
  {
    name: 'nginx_site_setup',
    description: 'Configure a new Nginx website',
    arguments: [
      {
        name: 'domain',
        description: 'Domain name for the website',
        required: true,
      },
      {
        name: 'backend_servers',
        description: 'Backend server addresses',
        required: true,
      },
    ],
    tools: ['plugin_nginx_addServer', 'plugin_nginx_addUpstream', 'plugin_nginx_reload'],
    isPlugin: true,
  },
  {
    name: 'haproxy_loadbalancer',
    description: 'Set up HAProxy load balancing',
    arguments: [
      {
        name: 'frontend_name',
        description: 'Name for the frontend',
        required: true,
      },
      {
        name: 'backend_servers',
        description: 'List of backend servers',
        required: true,
      },
    ],
    tools: ['plugin_haproxy_addFrontend', 'plugin_haproxy_addBackend', 'plugin_haproxy_addServer'],
    isPlugin: true,
  },
];

/**
 * Generate prompts for available modules
 */
export function generatePrompts(context: ServerContext): Prompt[] {
  const prompts: Prompt[] = [];

  // Add core prompts
  for (const promptMeta of corePrompts) {
    // Check if all required tools are available
    const toolsAvailable = promptMeta.tools.every((tool) => {
      const [, moduleName] = tool.split('_');
      return context.availableModules.has(`core.${moduleName}`);
    });

    if (toolsAvailable) {
      prompts.push({
        name: promptMeta.name,
        description: promptMeta.description,
        arguments: promptMeta.arguments.map((arg) => ({
          name: arg.name,
          description: arg.description,
          required: arg.required,
        })),
      });
    }
  }

  // Add plugin prompts
  for (const promptMeta of pluginPrompts) {
    // Check if all required tools are available
    const toolsAvailable = promptMeta.tools.every((tool) => {
      const [, moduleName] = tool.split('_');
      return context.availableModules.has(`plugins.${moduleName}`);
    });

    if (toolsAvailable) {
      prompts.push({
        name: promptMeta.name,
        description: promptMeta.description,
        arguments: promptMeta.arguments.map((arg) => ({
          name: arg.name,
          description: arg.description,
          required: arg.required,
        })),
      });
    }
  }

  return prompts;
}

/**
 * Generate prompt content
 */
export function generatePromptContent(
  promptName: string,
  args: Record<string, string>,
  context: ServerContext
): string {
  const allPrompts = [...corePrompts, ...pluginPrompts];
  const promptMeta = allPrompts.find((p) => p.name === promptName);

  if (!promptMeta) {
    throw new Error(`Prompt '${promptName}' not found`);
  }

  // Build the prompt content based on the template
  let content = `# ${promptMeta.description}\n\n`;

  // Add context about the task
  switch (promptName) {
    case 'system_health_check':
      content += `Please perform a comprehensive health check of the OPNsense system.\n\n`;
      content += `Tasks to perform:\n`;
      content += `1. Check system status and uptime\n`;
      content += `2. Review system resources (CPU, memory, disk)\n`;
      if (args.include_services === 'true') {
        content += `3. Check all service statuses\n`;
      }
      content += `\nUse the following tools: ${promptMeta.tools.join(', ')}`;
      break;

    case 'security_audit':
      content += `Conduct a security audit of the firewall configuration.\n\n`;
      content += `Areas to review:\n`;
      if (args.check_rules !== 'false') {
        content += `1. Analyze firewall rules for potential security issues\n`;
        content += `   - Look for overly permissive rules\n`;
        content += `   - Check for any "allow all" rules\n`;
      }
      if (args.check_services !== 'false') {
        content += `2. Review exposed services and their security\n`;
      }
      content += `\nProvide recommendations for improving security.`;
      break;

    case 'network_troubleshooting':
      content += `Troubleshoot connectivity to ${args.target_host}.\n\n`;
      content += `Steps to perform:\n`;
      content += `1. Ping the target host\n`;
      content += `2. Run traceroute to identify routing issues\n`;
      content += `3. Check interface status\n`;
      if (args.interface) {
        content += `\nUse interface: ${args.interface}`;
      }
      break;

    case 'wireguard_vpn_setup':
      content += `Set up a new WireGuard VPN peer.\n\n`;
      content += `Configuration:\n`;
      content += `- Peer name: ${args.peer_name}\n`;
      content += `- Allowed IPs: ${args.allowed_ips}\n`;
      content += `\nSteps:\n`;
      content += `1. Generate a new key pair for the peer\n`;
      content += `2. Configure the peer with the provided settings\n`;
      content += `3. Verify the configuration status\n`;
      break;

    default:
      // Generic prompt content
      content += `Execute the ${promptName} workflow with the provided arguments.\n\n`;
      content += `Arguments:\n`;
      for (const [key, value] of Object.entries(args)) {
        content += `- ${key}: ${value}\n`;
      }
  }

  return content;
}