import type { OPNsenseClient } from '@richard-stovall/opnsense-typescript-client';
import type { ToolDefinition, ToolHandlers } from '../server/types.js';

export const pluginTools: ToolDefinition[] = [
  {
    name: 'wireguard_get_status',
    description: 'Get WireGuard plugin status and configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'wireguard_get_config',
    description: 'Get WireGuard server configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'wireguard_search_clients',
    description: 'Search WireGuard client configurations',
    inputSchema: {
      type: 'object',
      properties: {
        searchPhrase: { type: 'string' },
        current: { type: 'integer', default: 1 },
        rowCount: { type: 'integer', default: 20 },
      },
    },
  },

  {
    name: 'nginx_get_status',
    description: 'Get Nginx plugin status and service information',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'nginx_get_upstreams',
    description: 'Get Nginx upstreams configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'nginx_search_upstreams',
    description: 'Search Nginx upstreams with filtering',
    inputSchema: {
      type: 'object',
      properties: {
        searchPhrase: { type: 'string' },
        current: { type: 'integer', default: 1 },
        rowCount: { type: 'integer', default: 20 },
      },
    },
  },
  {
    name: 'nginx_get_locations',
    description: 'Get Nginx location configurations',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  {
    name: 'haproxy_get_status',
    description: 'Get HAProxy plugin status and service information',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'haproxy_get_backends',
    description: 'Get HAProxy backend configurations',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'haproxy_search_backends',
    description: 'Search HAProxy backends with filtering',
    inputSchema: {
      type: 'object',
      properties: {
        searchPhrase: { type: 'string' },
        current: { type: 'integer', default: 1 },
        rowCount: { type: 'integer', default: 20 },
      },
    },
  },

  {
    name: 'bind_get_status',
    description: 'Get BIND DNS plugin status and service information',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'bind_get_zones',
    description: 'Get BIND DNS zones configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'bind_search_zones',
    description: 'Search BIND DNS zones with filtering',
    inputSchema: {
      type: 'object',
      properties: {
        searchPhrase: { type: 'string' },
        current: { type: 'integer', default: 1 },
        rowCount: { type: 'integer', default: 20 },
      },
    },
  },

  {
    name: 'caddy_get_status',
    description: 'Get Caddy plugin status and service information',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'caddy_get_config',
    description: 'Get Caddy server configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  {
    name: 'crowdsec_get_status',
    description: 'Get CrowdSec plugin status and service information',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'crowdsec_get_decisions',
    description: 'Get CrowdSec security decisions and bans',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  {
    name: 'netsnmp_get_status',
    description: 'Get NetSNMP plugin status and service information',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'netsnmp_get_config',
    description: 'Get NetSNMP configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  {
    name: 'netdata_get_status',
    description: 'Get Netdata plugin status and service information',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'netdata_get_config',
    description: 'Get Netdata monitoring configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // Extended WireGuard Tools (continuing from basic 3 tools)
  {
    name: 'wireguard_set_config',
    description: 'Set WireGuard general configuration',
    inputSchema: {
      type: 'object',
      properties: {
        config: { type: 'object', description: 'WireGuard configuration' },
      },
      required: ['config'],
    },
  },
  {
    name: 'wireguard_server_search',
    description: 'Search WireGuard server configurations',
    inputSchema: {
      type: 'object',
      properties: {
        searchPhrase: { type: 'string' },
        current: { type: 'integer', default: 1 },
        rowCount: { type: 'integer', default: 20 },
      },
    },
  },
  {
    name: 'wireguard_server_add',
    description: 'Add new WireGuard server',
    inputSchema: {
      type: 'object',
      properties: {
        server: { type: 'object', description: 'Server configuration' },
      },
      required: ['server'],
    },
  },
  {
    name: 'wireguard_server_get',
    description: 'Get specific WireGuard server',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Server UUID' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'wireguard_server_set',
    description: 'Update WireGuard server configuration',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Server UUID' },
        server: { type: 'object', description: 'Server configuration' },
      },
      required: ['uuid', 'server'],
    },
  },
  {
    name: 'wireguard_server_delete',
    description: 'Delete WireGuard server',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Server UUID' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'wireguard_client_add',
    description: 'Add new WireGuard client',
    inputSchema: {
      type: 'object',
      properties: {
        client: { type: 'object', description: 'Client configuration' },
      },
      required: ['client'],
    },
  },
  {
    name: 'wireguard_client_get',
    description: 'Get specific WireGuard client',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Client UUID' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'wireguard_client_set',
    description: 'Update WireGuard client configuration',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Client UUID' },
        client: { type: 'object', description: 'Client configuration' },
      },
      required: ['uuid', 'client'],
    },
  },
  {
    name: 'wireguard_client_delete',
    description: 'Delete WireGuard client',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string', description: 'Client UUID' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'wireguard_service_start',
    description: 'Start WireGuard service',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'wireguard_service_stop',
    description: 'Stop WireGuard service',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'wireguard_service_restart',
    description: 'Restart WireGuard service',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // Tailscale Plugin Tools
  {
    name: 'tailscale_get_status',
    description: 'Get Tailscale plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'tailscale_get_config',
    description: 'Get Tailscale configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'tailscale_set_config',
    description: 'Set Tailscale configuration',
    inputSchema: {
      type: 'object',
      properties: {
        config: { type: 'object', description: 'Tailscale configuration' },
      },
      required: ['config'],
    },
  },
  {
    name: 'tailscale_service_start',
    description: 'Start Tailscale service',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'tailscale_service_stop',
    description: 'Stop Tailscale service',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'tailscale_service_restart',
    description: 'Restart Tailscale service',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // Telegraf Plugin Tools
  {
    name: 'telegraf_get_status',
    description: 'Get Telegraf plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'telegraf_get_config',
    description: 'Get Telegraf configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'telegraf_set_config',
    description: 'Set Telegraf configuration',
    inputSchema: {
      type: 'object',
      properties: {
        config: { type: 'object', description: 'Telegraf configuration' },
      },
      required: ['config'],
    },
  },
  {
    name: 'telegraf_service_control',
    description: 'Control Telegraf service (start/stop/restart)',
    inputSchema: {
      type: 'object',
      properties: {
        action: { type: 'string', enum: ['start', 'stop', 'restart'], description: 'Service action' },
      },
      required: ['action'],
    },
  },

  // Maltrail Plugin Tools
  {
    name: 'maltrail_get_status',
    description: 'Get Maltrail plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'maltrail_get_config',
    description: 'Get Maltrail configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'maltrail_set_config',
    description: 'Set Maltrail configuration',
    inputSchema: {
      type: 'object',
      properties: {
        config: { type: 'object', description: 'Maltrail configuration' },
      },
      required: ['config'],
    },
  },
  {
    name: 'maltrail_get_events',
    description: 'Get Maltrail security events',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'integer', default: 100, description: 'Number of events to retrieve' },
      },
    },
  },

  // Stunnel Plugin Tools
  {
    name: 'stunnel_get_status',
    description: 'Get Stunnel plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'stunnel_get_config',
    description: 'Get Stunnel configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'stunnel_set_config',
    description: 'Set Stunnel configuration',
    inputSchema: {
      type: 'object',
      properties: {
        config: { type: 'object', description: 'Stunnel configuration' },
      },
      required: ['config'],
    },
  },

  // ACME Plugin Tools
  {
    name: 'acme_get_status',
    description: 'Get ACME plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'acme_get_certificates',
    description: 'Get ACME certificates',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'acme_get_config',
    description: 'Get ACME configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'acme_set_config',
    description: 'Set ACME configuration',
    inputSchema: {
      type: 'object',
      properties: {
        config: { type: 'object', description: 'ACME configuration' },
      },
      required: ['config'],
    },
  },

  // Collectd Plugin Tools
  {
    name: 'collectd_get_status',
    description: 'Get Collectd plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'collectd_get_config',
    description: 'Get Collectd configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'collectd_set_config',
    description: 'Set Collectd configuration',
    inputSchema: {
      type: 'object',
      properties: {
        config: { type: 'object', description: 'Collectd configuration' },
      },
      required: ['config'],
    },
  },
  {
    name: 'collectd_get_metrics',
    description: 'Get Collectd metrics',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // FreeRADIUS Plugin Tools
  {
    name: 'freeradius_get_status',
    description: 'Get FreeRADIUS plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'freeradius_get_config',
    description: 'Get FreeRADIUS configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'freeradius_set_config',
    description: 'Set FreeRADIUS configuration',
    inputSchema: {
      type: 'object',
      properties: {
        config: { type: 'object', description: 'FreeRADIUS configuration' },
      },
      required: ['config'],
    },
  },
  {
    name: 'freeradius_get_clients',
    description: 'Get FreeRADIUS clients',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // IPerf Plugin Tools
  {
    name: 'iperf_get_status',
    description: 'Get IPerf plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'iperf_get_config',
    description: 'Get IPerf configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'iperf_run_test',
    description: 'Run IPerf network performance test',
    inputSchema: {
      type: 'object',
      properties: {
        target: { type: 'string', description: 'Target host for test' },
        duration: { type: 'integer', default: 10, description: 'Test duration in seconds' },
      },
      required: ['target'],
    },
  },

  // OpenVPN Export Plugin Tools
  {
    name: 'openvpn_export_get_status',
    description: 'Get OpenVPN Export plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'openvpn_export_get_servers',
    description: 'Get OpenVPN Export servers',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'openvpn_export_get_config',
    description: 'Get OpenVPN Export configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // Postfix Plugin Tools
  {
    name: 'postfix_get_status',
    description: 'Get Postfix plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'postfix_get_config',
    description: 'Get Postfix configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'postfix_set_config',
    description: 'Set Postfix configuration',
    inputSchema: {
      type: 'object',
      properties: {
        config: { type: 'object', description: 'Postfix configuration' },
      },
      required: ['config'],
    },
  },

  // Redis Plugin Tools
  {
    name: 'redis_get_status',
    description: 'Get Redis plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'redis_get_config',
    description: 'Get Redis configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'redis_get_info',
    description: 'Get Redis server information',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // Rsyslog Plugin Tools
  {
    name: 'rsyslog_get_status',
    description: 'Get Rsyslog plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'rsyslog_get_config',
    description: 'Get Rsyslog configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'rsyslog_get_logs',
    description: 'Get Rsyslog logs',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'integer', default: 100, description: 'Number of log entries' },
      },
    },
  },

  // Zabbix Plugin Tools
  {
    name: 'zabbix_get_status',
    description: 'Get Zabbix plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'zabbix_get_config',
    description: 'Get Zabbix configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'zabbix_get_hosts',
    description: 'Get Zabbix monitored hosts',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // Extended Nginx Tools
  {
    name: 'nginx_set_config',
    description: 'Set Nginx configuration',
    inputSchema: {
      type: 'object',
      properties: {
        config: { type: 'object', description: 'Nginx configuration' },
      },
      required: ['config'],
    },
  },
  {
    name: 'nginx_search_servers',
    description: 'Search Nginx servers',
    inputSchema: {
      type: 'object',
      properties: {
        searchPhrase: { type: 'string' },
        current: { type: 'integer', default: 1 },
        rowCount: { type: 'integer', default: 20 },
      },
    },
  },
  {
    name: 'nginx_get_certificates',
    description: 'Get Nginx certificates',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'nginx_restart_service',
    description: 'Restart Nginx service',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'nginx_reload_config',
    description: 'Reload Nginx configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'nginx_get_logs',
    description: 'Get Nginx access and error logs',
    inputSchema: {
      type: 'object',
      properties: {
        logType: { type: 'string', enum: ['access', 'error'], default: 'access' },
        limit: { type: 'integer', default: 100 },
      },
    },
  },

  // Extended HAProxy Tools
  {
    name: 'haproxy_set_config',
    description: 'Set HAProxy configuration',
    inputSchema: {
      type: 'object',
      properties: {
        config: { type: 'object', description: 'HAProxy configuration' },
      },
      required: ['config'],
    },
  },
  {
    name: 'haproxy_get_frontends',
    description: 'Get HAProxy frontend configurations',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'haproxy_search_frontends',
    description: 'Search HAProxy frontends',
    inputSchema: {
      type: 'object',
      properties: {
        searchPhrase: { type: 'string' },
        current: { type: 'integer', default: 1 },
        rowCount: { type: 'integer', default: 20 },
      },
    },
  },
  {
    name: 'haproxy_get_servers',
    description: 'Get HAProxy server configurations',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'haproxy_get_stats',
    description: 'Get HAProxy statistics',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'haproxy_restart_service',
    description: 'Restart HAProxy service',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'haproxy_reload_config',
    description: 'Reload HAProxy configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'haproxy_get_logs',
    description: 'Get HAProxy logs',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'integer', default: 100 },
      },
    },
  },

  // Extended Bind DNS Tools
  {
    name: 'bind_set_config',
    description: 'Set Bind DNS configuration',
    inputSchema: {
      type: 'object',
      properties: {
        config: { type: 'object', description: 'Bind configuration' },
      },
      required: ['config'],
    },
  },
  {
    name: 'bind_get_records',
    description: 'Get Bind DNS records',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'bind_search_records',
    description: 'Search Bind DNS records',
    inputSchema: {
      type: 'object',
      properties: {
        searchPhrase: { type: 'string' },
        current: { type: 'integer', default: 1 },
        rowCount: { type: 'integer', default: 20 },
      },
    },
  },
  {
    name: 'bind_restart_service',
    description: 'Restart Bind DNS service',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'bind_reload_config',
    description: 'Reload Bind DNS configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'bind_get_logs',
    description: 'Get Bind DNS logs',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'integer', default: 100 },
      },
    },
  },

  // Extended Caddy Tools
  {
    name: 'caddy_set_config',
    description: 'Set Caddy configuration',
    inputSchema: {
      type: 'object',
      properties: {
        config: { type: 'object', description: 'Caddy configuration' },
      },
      required: ['config'],
    },
  },
  {
    name: 'caddy_get_sites',
    description: 'Get Caddy site configurations',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'caddy_restart_service',
    description: 'Restart Caddy service',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'caddy_reload_config',
    description: 'Reload Caddy configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'caddy_get_logs',
    description: 'Get Caddy logs',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'integer', default: 100 },
      },
    },
  },

  // Extended CrowdSec Tools
  {
    name: 'crowdsec_set_config',
    description: 'Set CrowdSec configuration',
    inputSchema: {
      type: 'object',
      properties: {
        config: { type: 'object', description: 'CrowdSec configuration' },
      },
      required: ['config'],
    },
  },
  {
    name: 'crowdsec_get_alerts',
    description: 'Get CrowdSec security alerts',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'integer', default: 100 },
      },
    },
  },
  {
    name: 'crowdsec_get_bouncers',
    description: 'Get CrowdSec bouncers',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'crowdsec_restart_service',
    description: 'Restart CrowdSec service',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'crowdsec_get_logs',
    description: 'Get CrowdSec logs',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'integer', default: 100 },
      },
    },
  },

  // Extended NetSNMP Tools
  {
    name: 'netsnmp_set_config',
    description: 'Set NetSNMP configuration',
    inputSchema: {
      type: 'object',
      properties: {
        config: { type: 'object', description: 'NetSNMP configuration' },
      },
      required: ['config'],
    },
  },
  {
    name: 'netsnmp_restart_service',
    description: 'Restart NetSNMP service',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'netsnmp_get_logs',
    description: 'Get NetSNMP logs',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'integer', default: 100 },
      },
    },
  },

  // Extended Netdata Tools
  {
    name: 'netdata_set_config',
    description: 'Set Netdata configuration',
    inputSchema: {
      type: 'object',
      properties: {
        config: { type: 'object', description: 'Netdata configuration' },
      },
      required: ['config'],
    },
  },
  {
    name: 'netdata_restart_service',
    description: 'Restart Netdata service',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'netdata_get_metrics',
    description: 'Get Netdata metrics',
    inputSchema: {
      type: 'object',
      properties: {
        metric: { type: 'string', description: 'Specific metric to retrieve' },
      },
    },
  },

  // Additional Security Plugins
  {
    name: 'suricata_get_status',
    description: 'Get Suricata IDS/IPS status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'suricata_get_config',
    description: 'Get Suricata configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'suricata_get_alerts',
    description: 'Get Suricata security alerts',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'integer', default: 100 },
      },
    },
  },
  {
    name: 'suricata_update_rules',
    description: 'Update Suricata rules',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // Additional Network Services
  {
    name: 'dhcpd_get_status',
    description: 'Get DHCP server status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'dhcpd_get_config',
    description: 'Get DHCP server configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'dhcpd_get_leases',
    description: 'Get DHCP leases',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // More Security and Monitoring Tools
  {
    name: 'ossec_get_status',
    description: 'Get OSSEC HIDS status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'intrusion_detection_get_alerts',
    description: 'Get intrusion detection alerts',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'integer', default: 100 },
      },
    },
  },
  {
    name: 'vulnerability_scanner_run',
    description: 'Run vulnerability scanner',
    inputSchema: {
      type: 'object',
      properties: {
        target: { type: 'string', description: 'Target to scan' },
      },
      required: ['target'],
    },
  },

  // Additional VPN and Remote Access
  {
    name: 'l2tp_get_status',
    description: 'Get L2TP VPN status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'pptp_get_status',
    description: 'Get PPTP VPN status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'strongswan_get_status',
    description: 'Get StrongSwan IPsec status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // Additional Backup and Synchronization
  {
    name: 'backup_get_status',
    description: 'Get backup service status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'backup_get_config',
    description: 'Get backup service configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'backup_run_job',
    description: 'Run backup job',
    inputSchema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', description: 'Backup job ID' },
      },
      required: ['jobId'],
    },
  },

  // Additional Database and Storage
  {
    name: 'mysql_get_status',
    description: 'Get MySQL database status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'postgresql_get_status',
    description: 'Get PostgreSQL database status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'mongodb_get_status',
    description: 'Get MongoDB database status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // Web Application Firewalls
  {
    name: 'modsecurity_get_status',
    description: 'Get ModSecurity WAF status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'waf_get_rules',
    description: 'Get Web Application Firewall rules',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // Container and Virtualization
  {
    name: 'docker_get_status',
    description: 'Get Docker container status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'kubernetes_get_status',
    description: 'Get Kubernetes cluster status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // Load Balancing and Proxy
  {
    name: 'squid_get_status',
    description: 'Get Squid proxy status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'proxy_get_config',
    description: 'Get proxy configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // Network Services and Tools
  {
    name: 'ntp_get_status',
    description: 'Get NTP time synchronization status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'dns_resolver_get_status',
    description: 'Get DNS resolver status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'dhcp_relay_get_status',
    description: 'Get DHCP relay status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];

function createPluginNotAvailableHandler(pluginName: string) {
  return async () => {
    return {
      content: [
        {
          type: 'text' as const,
          text: `Plugin "${pluginName}" is not installed or not available. Install the plugin first to use this functionality.`,
        },
      ],
    };
  };
}

export function createPluginToolHandlers(clientOrGetter: OPNsenseClient | (() => OPNsenseClient)): ToolHandlers {
  const ensureClient = () => {
    const client = typeof clientOrGetter === 'function' ? clientOrGetter() : clientOrGetter;
    if (!client) {
      throw new Error('OPNsense client not configured. Use configure_opnsense_connection tool first.');
    }
    return client;
  };

  return {
    wireguard_get_status: async () => {
      const client = ensureClient();
      try {
        const response = await client.plugins.wireGuard.getStatus();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` },
          ],
        };
      }
    },

    wireguard_get_config: async () => {
      const client = ensureClient();
      try {
        const response = await client.plugins.wireGuard.getServer();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` },
          ],
        };
      }
    },

    wireguard_search_clients: async (args: any) => {
      const client = ensureClient();
      const { searchPhrase = '', current = 1, rowCount = 20 } = args;
      try {
        const response = await client.plugins.wireGuard.searchClients({
          current,
          rowCount,
          searchPhrase,
        });
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` },
          ],
        };
      }
    },

    nginx_get_status: async () => {
      const client = ensureClient();
      try {
        const response = await client.plugins.nginx.getStatus();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` },
          ],
        };
      }
    },

    nginx_get_upstreams: async () => {
      const client = ensureClient();
      try {
        const response = await client.plugins.nginx.getUpstream();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` },
          ],
        };
      }
    },

    nginx_search_upstreams: async (args: any) => {
      const client = ensureClient();
      const { searchPhrase = '', current = 1, rowCount = 20 } = args;
      try {
        const response = await client.plugins.nginx.searchUpstreams({
          current,
          rowCount,
          searchPhrase,
        });
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` },
          ],
        };
      }
    },

    haproxy_get_status: async () => {
      const client = ensureClient();
      try {
        const response = await client.plugins.haproxy.getStatus();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` },
          ],
        };
      }
    },

    haproxy_get_backends: async () => {
      const client = ensureClient();
      try {
        const response = await client.plugins.haproxy.getBackend();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` },
          ],
        };
      }
    },

    bind_get_status: async () => {
      const client = ensureClient();
      try {
        const response = await client.plugins.bind.getStatus();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` },
          ],
        };
      }
    },

    bind_get_zones: async () => {
      const client = ensureClient();
      try {
        const response = await client.plugins.bind.getDomain();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` },
          ],
        };
      }
    },

    caddy_get_status: async () => {
      const client = ensureClient();
      try {
        const response = await client.plugins.caddy.getStatus();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` },
          ],
        };
      }
    },

    caddy_get_config: async () => {
      const client = ensureClient();
      try {
        const response = await client.plugins.caddy.getGeneral();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` },
          ],
        };
      }
    },

    crowdsec_get_status: async () => {
      const client = ensureClient();
      try {
        const response = await client.plugins.crowdsec.getStatus();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` },
          ],
        };
      }
    },

    crowdsec_get_decisions: async () => {
      const client = ensureClient();
      try {
        const response = await client.plugins.crowdsec.getDecisions();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` },
          ],
        };
      }
    },

    netsnmp_get_status: async () => {
      const client = ensureClient();
      try {
        const response = await client.plugins.netsnmp.getStatus();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` },
          ],
        };
      }
    },

    netsnmp_get_config: async () => {
      const client = ensureClient();
      try {
        const response = await client.plugins.netsnmp.getGeneral();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` },
          ],
        };
      }
    },

    netdata_get_status: async () => {
      const client = ensureClient();
      try {
        const response = await client.plugins.netdata.getStatus();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` },
          ],
        };
      }
    },

    netdata_get_config: async () => {
      const client = ensureClient();
      try {
        const response = await client.plugins.netdata.getGeneral();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: 'text' as const, text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` },
          ],
        };
      }
    },

    acme_get_certificates: createPluginNotAvailableHandler('acme'),
    collectd_get_metrics: createPluginNotAvailableHandler('collectd'),
    freeradius_get_clients: createPluginNotAvailableHandler('freeradius'),
    iperf_run_test: createPluginNotAvailableHandler('iperf'),
    maltrail_get_events: createPluginNotAvailableHandler('maltrail'),
    openvpn_export_get_servers: createPluginNotAvailableHandler('openvpn-export'),
    postfix_get_status: createPluginNotAvailableHandler('postfix'),
    redis_get_info: createPluginNotAvailableHandler('redis'),
    rsyslog_get_logs: createPluginNotAvailableHandler('rsyslog'),
    zabbix_get_hosts: createPluginNotAvailableHandler('zabbix'),
  };
}

export const pluginToolHandlers = createPluginToolHandlers;
