import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { OPNsenseClient, type OPNsenseConfig } from '@richard-stovall/opnsense-typescript-client';

import { serverInitializationResponse } from './initialization.js';

import type { CallToolRequest, CallToolResult } from '@modelcontextprotocol/sdk/types.js';

// Global type declarations for Node.js environment
declare const process: {
  on(event: string, listener: (...args: any[]) => void): void;
  exit(code?: number): never;
};
declare const console: {
  log(...args: any[]): void;
  error(...args: any[]): void;
};

interface ServerConfig {
  host?: string;
  apiKey?: string;
  apiSecret?: string;
  verifySsl?: boolean;
  plugins?: boolean;
}

interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

const pluginTools: ToolDefinition[] = [
  {
    name: 'wireguard_get_status',
    description: 'Get WireGuard plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'wireguard_get_config',
    description: 'Get WireGuard configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'wireguard_search_servers',
    description: 'Search WireGuard servers',
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
    name: 'wireguard_search_clients',
    description: 'Search WireGuard clients',
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
    name: 'wireguard_generate_keypair',
    description: 'Generate WireGuard keypair',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'nginx_get_status',
    description: 'Get Nginx plugin status',
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
    description: 'Search Nginx upstreams',
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
    description: 'Get Nginx locations',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'nginx_search_locations',
    description: 'Search Nginx locations',
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
    name: 'haproxy_get_status',
    description: 'Get HAProxy plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'haproxy_get_backends',
    description: 'Get HAProxy backends configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'haproxy_search_backends',
    description: 'Search HAProxy backends',
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
    description: 'Get HAProxy servers',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'haproxy_search_servers',
    description: 'Search HAProxy servers',
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
    description: 'Get Bind DNS plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'bind_get_zones',
    description: 'Get Bind DNS zones',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'bind_get_domains',
    description: 'Get Bind DNS domains',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'bind_search_domains',
    description: 'Search Bind DNS domains',
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
    name: 'bind_search_acl',
    description: 'Search Bind DNS ACL entries',
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
    description: 'Get Caddy plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'caddy_get_config',
    description: 'Get Caddy configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'caddy_get_general',
    description: 'Get Caddy general configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'caddy_search_reverseproxy',
    description: 'Search Caddy reverse proxy configurations',
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
    name: 'caddy_search_subdomains',
    description: 'Search Caddy subdomains',
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
    name: 'caddy_search_handles',
    description: 'Search Caddy handles',
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
    name: 'crowdsec_get_status',
    description: 'Get CrowdSec plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'crowdsec_get_decisions',
    description: 'Get CrowdSec decisions',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'crowdsec_get_general',
    description: 'Get CrowdSec general configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'netsnmp_get_status',
    description: 'Get NetSNMP plugin status',
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
    name: 'netsnmp_get_general',
    description: 'Get NetSNMP general configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'netdata_get_status',
    description: 'Get Netdata plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'netdata_get_config',
    description: 'Get Netdata configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'netdata_get_general',
    description: 'Get Netdata general configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'acmeclient_get_status',
    description: 'Get ACME Client plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'acmeclient_get_general',
    description: 'Get ACME Client general configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'acmeclient_search_accounts',
    description: 'Search ACME Client accounts',
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
    name: 'apcupsd_get_status',
    description: 'Get APC UPS Daemon plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'apcupsd_get_general',
    description: 'Get APC UPS Daemon general configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'chrony_get_status',
    description: 'Get Chrony plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'chrony_get_general',
    description: 'Get Chrony general configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'cicap_get_status',
    description: 'Get C-ICAP plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'clamav_get_status',
    description: 'Get ClamAV plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'clamav_get_general',
    description: 'Get ClamAV general configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'collectd_get_status',
    description: 'Get Collectd plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'collectd_get_general',
    description: 'Get Collectd general configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'dnscryptproxy_get_status',
    description: 'Get DNSCrypt Proxy plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'dnscryptproxy_get_general',
    description: 'Get DNSCrypt Proxy general configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'dyndns_get_status',
    description: 'Get Dynamic DNS plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'dyndns_get_general',
    description: 'Get Dynamic DNS general configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'dyndns_search_accounts',
    description: 'Search Dynamic DNS accounts',
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
    name: 'freeradius_get_status',
    description: 'Get FreeRADIUS plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'freeradius_get_general',
    description: 'Get FreeRADIUS general configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'freeradius_search_users',
    description: 'Search FreeRADIUS users',
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
    name: 'ftpproxy_get_status',
    description: 'Get FTP Proxy plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // Grid Example Plugin
  {
    name: 'gridexample_get_status',
    description: 'Get Grid Example plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // Hardware Probe Plugin
  {
    name: 'hwprobe_get_status',
    description: 'Get Hardware Probe plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'hwprobe_get_general',
    description: 'Get Hardware Probe general configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // iPerf Plugin
  {
    name: 'iperf_get_status',
    description: 'Get iPerf plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'iperf_get_general',
    description: 'Get iPerf general configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'iperf_start_test',
    description: 'Start iPerf test',
    inputSchema: {
      type: 'object',
      properties: {
        server: { type: 'string' },
        port: { type: 'integer', default: 5201 },
        duration: { type: 'integer', default: 10 },
      },
      required: ['server'],
    },
  },
  {
    name: 'lldpd_get_status',
    description: 'Get LLDP daemon plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'lldpd_get_general',
    description: 'Get LLDP daemon general configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'lldpd_get_neighbors',
    description: 'Get LLDP neighbors',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'maltrail_get_status',
    description: 'Get Maltrail plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'maltrail_get_general',
    description: 'Get Maltrail general configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'mdnsrepeater_get_status',
    description: 'Get mDNS Repeater plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'mdnsrepeater_get_general',
    description: 'Get mDNS Repeater general configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'muninnode_get_status',
    description: 'Get Munin Node plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'muninnode_get_general',
    description: 'Get Munin Node general configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'ndproxy_get_status',
    description: 'Get ND Proxy plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'nodeexporter_get_status',
    description: 'Get Node Exporter plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'nodeexporter_get_general',
    description: 'Get Node Exporter general configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'nrpe_get_status',
    description: 'Get NRPE plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'nrpe_get_general',
    description: 'Get NRPE general configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'nrpe_search_checks',
    description: 'Search NRPE checks',
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
    name: 'ntopng_get_status',
    description: 'Get Ntopng plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'ntopng_get_general',
    description: 'Get Ntopng general configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'nut_get_status',
    description: 'Get NUT plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'nut_get_general',
    description: 'Get NUT general configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'openconnect_get_status',
    description: 'Get OpenConnect plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'openconnect_get_general',
    description: 'Get OpenConnect general configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'openconnect_search_users',
    description: 'Search OpenConnect users',
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
    name: 'postfix_get_status',
    description: 'Get Postfix plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'postfix_get_general',
    description: 'Get Postfix general configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'postfix_search_senders',
    description: 'Search Postfix senders',
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
    name: 'proxy_get_status',
    description: 'Get Proxy plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'proxy_get_general',
    description: 'Get Proxy general configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'proxysso_get_status',
    description: 'Get Proxy SSO plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'puppetagent_get_status',
    description: 'Get Puppet Agent plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'puppetagent_get_general',
    description: 'Get Puppet Agent general configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'qemuguestagent_get_status',
    description: 'Get QEMU Guest Agent plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'quagga_get_status',
    description: 'Get Quagga plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'quagga_get_general',
    description: 'Get Quagga general configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'quagga_search_bgp',
    description: 'Search Quagga BGP configurations',
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
    name: 'radsecproxy_get_status',
    description: 'Get RADSEC Proxy plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'radsecproxy_get_general',
    description: 'Get RADSEC Proxy general configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'radsecproxy_search_clients',
    description: 'Search RADSEC Proxy clients',
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
    name: 'redis_get_status',
    description: 'Get Redis plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'redis_get_general',
    description: 'Get Redis general configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'redis_get_info',
    description: 'Get Redis information',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'relayd_get_status',
    description: 'Get Relayd plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'relayd_get_general',
    description: 'Get Relayd general configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'relayd_search_hosts',
    description: 'Search Relayd hosts',
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
    name: 'rspamd_get_status',
    description: 'Get Rspamd plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'rspamd_get_general',
    description: 'Get Rspamd general configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'shadowsocks_get_status',
    description: 'Get Shadowsocks plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'shadowsocks_get_general',
    description: 'Get Shadowsocks general configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'shadowsocks_search_users',
    description: 'Search Shadowsocks users',
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
    name: 'siproxyd_get_status',
    description: 'Get SIP Proxy plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'siproxyd_get_general',
    description: 'Get SIP Proxy general configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'siproxyd_search_users',
    description: 'Search SIP Proxy users',
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
    name: 'smart_get_status',
    description: 'Get SMART plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'smart_get_info',
    description: 'Get SMART disk information',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // SoftEther Plugin
  {
    name: 'softether_get_status',
    description: 'Get SoftEther plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'softether_get_general',
    description: 'Get SoftEther general configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'softether_search_users',
    description: 'Search SoftEther users',
    inputSchema: {
      type: 'object',
      properties: {
        searchPhrase: { type: 'string' },
        current: { type: 'integer', default: 1 },
        rowCount: { type: 'integer', default: 20 },
      },
    },
  },

  // SSLH Plugin
  {
    name: 'sslh_get_status',
    description: 'Get SSLH plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'sslh_get_general',
    description: 'Get SSLH general configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // Stunnel Plugin
  {
    name: 'stunnel_get_status',
    description: 'Get Stunnel plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'stunnel_get_general',
    description: 'Get Stunnel general configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'stunnel_search_certificates',
    description: 'Search Stunnel certificates',
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
    name: 'tailscale_get_status',
    description: 'Get Tailscale plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'tailscale_get_general',
    description: 'Get Tailscale general configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'tayga_get_status',
    description: 'Get Tayga plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'tayga_get_general',
    description: 'Get Tayga general configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'tayga_search_mappings',
    description: 'Search Tayga mappings',
    inputSchema: {
      type: 'object',
      properties: {
        searchPhrase: { type: 'string' },
        current: { type: 'integer', default: 1 },
        rowCount: { type: 'integer', default: 20 },
      },
    },
  },

  // Telegraf Plugin
  {
    name: 'telegraf_get_status',
    description: 'Get Telegraf plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'telegraf_get_general',
    description: 'Get Telegraf general configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'telegraf_search_inputs',
    description: 'Search Telegraf inputs',
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
    name: 'tftp_get_status',
    description: 'Get TFTP plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'tftp_get_general',
    description: 'Get TFTP general configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'tinc_get_status',
    description: 'Get Tinc plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'tinc_get_general',
    description: 'Get Tinc general configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'tinc_search_networks',
    description: 'Search Tinc networks',
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
    name: 'tor_get_status',
    description: 'Get Tor plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'tor_get_general',
    description: 'Get Tor general configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'turnserver_get_status',
    description: 'Get TURN Server plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'turnserver_get_general',
    description: 'Get TURN Server general configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'turnserver_search_users',
    description: 'Search TURN Server users',
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
    name: 'udpbroadcastrelay_get_status',
    description: 'Get UDP Broadcast Relay plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'udpbroadcastrelay_get_general',
    description: 'Get UDP Broadcast Relay general configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'udpbroadcastrelay_search_relays',
    description: 'Search UDP Broadcast Relay configurations',
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
    name: 'vnstat_get_status',
    description: 'Get VnStat plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'vnstat_get_general',
    description: 'Get VnStat general configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'wazuhagent_get_status',
    description: 'Get Wazuh Agent plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'wazuhagent_get_general',
    description: 'Get Wazuh Agent general configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'wazuhagent_search_agents',
    description: 'Search Wazuh agents',
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
    name: 'wireguard_search_peers',
    description: 'Search WireGuard peers',
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
    name: 'wireguard_get_peers',
    description: 'Get WireGuard peers',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'wol_get_status',
    description: 'Get Wake on LAN plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'wol_wake_device',
    description: 'Wake a device using Wake on LAN',
    inputSchema: {
      type: 'object',
      properties: {
        mac: { type: 'string' },
        interface: { type: 'string', default: 'lan' },
      },
      required: ['mac'],
    },
  },
  {
    name: 'zabbixagent_get_status',
    description: 'Get Zabbix Agent plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'zabbixagent_get_general',
    description: 'Get Zabbix Agent general configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'zabbixproxy_get_status',
    description: 'Get Zabbix Proxy plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'zabbixproxy_get_general',
    description: 'Get Zabbix Proxy general configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'zabbixproxy_search_hosts',
    description: 'Search Zabbix Proxy hosts',
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
    name: 'zerotier_get_status',
    description: 'Get ZeroTier plugin status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'zerotier_get_general',
    description: 'Get ZeroTier general configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'zerotier_search_networks',
    description: 'Search ZeroTier networks',
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
    name: 'zerotier_join_network',
    description: 'Join a ZeroTier network',
    inputSchema: {
      type: 'object',
      properties: {
        networkId: { type: 'string' },
      },
      required: ['networkId'],
    },
  },
  {
    name: 'zerotier_leave_network',
    description: 'Leave a ZeroTier network',
    inputSchema: {
      type: 'object',
      properties: {
        networkId: { type: 'string' },
      },
      required: ['networkId'],
    },
  },
  {
    name: 'zerotier_get_peers',
    description: 'Get ZeroTier peers',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];

const baseTools: ToolDefinition[] = [
  {
    name: 'get_system_status',
    description: 'Get OPNsense system status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'firewall_get_rules',
    description: 'Get OPNsense firewall rules',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'integer', default: 1 },
        rows_per_page: { type: 'integer', default: 20 },
        search_phrase: { type: 'string', default: '' },
      },
    },
  },
  {
    name: 'firewall_add_rule',
    description: 'Add a new firewall rule',
    inputSchema: {
      type: 'object',
      properties: {
        enabled: { type: 'boolean', default: true },
        interface: { type: 'string', default: 'lan' },
        direction: { type: 'string', default: 'in' },
        ipprotocol: { type: 'string', default: 'inet' },
        protocol: { type: 'string', default: 'any' },
        source_net: { type: 'string', default: 'any' },
        destination_net: { type: 'string', default: 'any' },
        destination_port: { type: 'string', default: '' },
        action: { type: 'string', default: 'pass' },
        description: { type: 'string' },
      },
      required: ['description'],
    },
  },
  {
    name: 'firewall_delete_rule',
    description: 'Delete a firewall rule by UUID',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'firewall_toggle_rule',
    description: 'Enable or disable a firewall rule',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
        enabled: { type: 'boolean' },
      },
      required: ['uuid', 'enabled'],
    },
  },
  {
    name: 'get_interfaces',
    description: 'Get network interfaces',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_dhcp_leases',
    description: 'Get DHCP leases',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_firewall_aliases',
    description: 'Get firewall aliases',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'integer', default: 1 },
        rows_per_page: { type: 'integer', default: 20 },
        search_phrase: { type: 'string', default: '' },
      },
    },
  },
  {
    name: 'add_to_alias',
    description: 'Add an entry to a firewall alias',
    inputSchema: {
      type: 'object',
      properties: {
        alias_name: { type: 'string' },
        address: { type: 'string' },
      },
      required: ['alias_name', 'address'],
    },
  },
  {
    name: 'delete_from_alias',
    description: 'Delete an entry from a firewall alias',
    inputSchema: {
      type: 'object',
      properties: {
        alias_name: { type: 'string' },
        address: { type: 'string' },
      },
      required: ['alias_name', 'address'],
    },
  },
  {
    name: 'configure_opnsense_connection',
    description: 'Configure the OPNsense connection',
    inputSchema: {
      type: 'object',
      properties: {
        url: { type: 'string' },
        api_key: { type: 'string' },
        api_secret: { type: 'string' },
        verify_ssl: { type: 'boolean', default: true },
      },
      required: ['url', 'api_key', 'api_secret'],
    },
  },
  {
    name: 'get_firewall_logs',
    description: 'Get firewall log entries',
    inputSchema: {
      type: 'object',
      properties: {
        count: { type: 'integer', default: 100 },
        filter_text: { type: 'string', default: '' },
      },
    },
  },
  {
    name: 'restart_service',
    description: 'Restart an OPNsense service',
    inputSchema: {
      type: 'object',
      properties: {
        service_name: { type: 'string' },
      },
      required: ['service_name'],
    },
  },
  {
    name: 'backup_config',
    description: 'Create a backup of the OPNsense configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_system_routes',
    description: 'Get system routing table',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_system_health',
    description: 'Get system health metrics',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'system_reboot',
    description: 'Reboot the OPNsense system',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'system_halt',
    description: 'Halt the OPNsense system',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'dismiss_system_status',
    description: 'Dismiss system status notifications',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'firmware_get_info',
    description: 'Get firmware information',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'firmware_check_updates',
    description: 'Check for firmware updates',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'firmware_update',
    description: 'Update firmware',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'firmware_upgrade',
    description: 'Upgrade firmware',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'firmware_audit',
    description: 'Run firmware security audit',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'firmware_get_changelog',
    description: 'Get firmware changelog for version',
    inputSchema: {
      type: 'object',
      properties: {
        version: { type: 'string' },
      },
      required: ['version'],
    },
  },
  {
    name: 'package_remove',
    description: 'Remove a package',
    inputSchema: {
      type: 'object',
      properties: {
        package_name: { type: 'string' },
      },
      required: ['package_name'],
    },
  },
  {
    name: 'package_reinstall',
    description: 'Reinstall a package',
    inputSchema: {
      type: 'object',
      properties: {
        package_name: { type: 'string' },
      },
      required: ['package_name'],
    },
  },
  {
    name: 'package_lock',
    description: 'Lock a package to prevent updates',
    inputSchema: {
      type: 'object',
      properties: {
        package_name: { type: 'string' },
      },
      required: ['package_name'],
    },
  },
  {
    name: 'package_unlock',
    description: 'Unlock a package to allow updates',
    inputSchema: {
      type: 'object',
      properties: {
        package_name: { type: 'string' },
      },
      required: ['package_name'],
    },
  },
  {
    name: 'package_get_details',
    description: 'Get detailed information about a package',
    inputSchema: {
      type: 'object',
      properties: {
        package_name: { type: 'string' },
      },
      required: ['package_name'],
    },
  },

  // Advanced Firewall Operations
  {
    name: 'firewall_apply',
    description: 'Apply firewall configuration changes',
    inputSchema: {
      type: 'object',
      properties: {
        rollback_revision: { type: 'string' },
      },
    },
  },
  {
    name: 'firewall_savepoint',
    description: 'Create a firewall configuration savepoint',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'firewall_revert',
    description: 'Revert firewall to a previous revision',
    inputSchema: {
      type: 'object',
      properties: {
        revision: { type: 'string' },
      },
      required: ['revision'],
    },
  },
  {
    name: 'get_firewall_rule_stats',
    description: 'Get firewall rule statistics',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'firewall_move_rule',
    description: 'Move a firewall rule before another rule',
    inputSchema: {
      type: 'object',
      properties: {
        selected_uuid: { type: 'string' },
        target_uuid: { type: 'string' },
      },
      required: ['selected_uuid', 'target_uuid'],
    },
  },
  {
    name: 'get_firewall_rule',
    description: 'Get a specific firewall rule by UUID',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'update_firewall_rule',
    description: 'Update an existing firewall rule',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
        rule: { type: 'object' },
      },
      required: ['uuid', 'rule'],
    },
  },

  // Enhanced Alias Management
  {
    name: 'get_firewall_alias',
    description: 'Get a specific firewall alias by UUID',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'add_firewall_alias',
    description: 'Add a new firewall alias',
    inputSchema: {
      type: 'object',
      properties: {
        alias: { type: 'object' },
      },
      required: ['alias'],
    },
  },
  {
    name: 'update_firewall_alias',
    description: 'Update an existing firewall alias',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
        alias: { type: 'object' },
      },
      required: ['uuid', 'alias'],
    },
  },
  {
    name: 'delete_firewall_alias',
    description: 'Delete a firewall alias by UUID',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'toggle_firewall_alias',
    description: 'Enable or disable a firewall alias',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
        enabled: { type: 'boolean' },
      },
      required: ['uuid', 'enabled'],
    },
  },
  {
    name: 'export_firewall_aliases',
    description: 'Export firewall aliases configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'import_firewall_aliases',
    description: 'Import firewall aliases configuration',
    inputSchema: {
      type: 'object',
      properties: {
        data: { type: 'string' },
      },
      required: ['data'],
    },
  },
  {
    name: 'get_alias_table_size',
    description: 'Get the size of alias tables',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'list_alias_contents',
    description: 'List contents of a specific alias',
    inputSchema: {
      type: 'object',
      properties: {
        alias_name: { type: 'string' },
      },
      required: ['alias_name'],
    },
  },
  {
    name: 'flush_alias',
    description: 'Flush all entries from an alias',
    inputSchema: {
      type: 'object',
      properties: {
        alias_name: { type: 'string' },
      },
      required: ['alias_name'],
    },
  },

  // Enhanced Diagnostics
  {
    name: 'get_memory_usage',
    description: 'Get detailed memory usage information',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_disk_usage',
    description: 'Get disk usage information',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_system_temperature',
    description: 'Get system temperature readings',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_cpu_usage',
    description: 'Get CPU usage information',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_arp_table',
    description: 'Get ARP table entries',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'search_arp_table',
    description: 'Search ARP table entries',
    inputSchema: {
      type: 'object',
      properties: {
        search_params: { type: 'object' },
      },
    },
  },
  {
    name: 'flush_arp_table',
    description: 'Flush the ARP table',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_pf_states',
    description: 'Get packet filter states',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'query_pf_states',
    description: 'Query packet filter states with parameters',
    inputSchema: {
      type: 'object',
      properties: {
        params: { type: 'object' },
      },
    },
  },
  {
    name: 'flush_firewall_states',
    description: 'Flush firewall states',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'kill_firewall_states',
    description: 'Kill specific firewall states',
    inputSchema: {
      type: 'object',
      properties: {
        params: { type: 'object' },
      },
      required: ['params'],
    },
  },
  {
    name: 'dns_lookup',
    description: 'Perform DNS lookup',
    inputSchema: {
      type: 'object',
      properties: {
        hostname: { type: 'string' },
        record_type: { type: 'string', default: 'A' },
      },
      required: ['hostname'],
    },
  },

  // Service Management
  {
    name: 'search_services',
    description: 'Search for system services',
    inputSchema: {
      type: 'object',
      properties: {
        search_params: { type: 'object' },
      },
    },
  },
  {
    name: 'start_service',
    description: 'Start a system service',
    inputSchema: {
      type: 'object',
      properties: {
        service_name: { type: 'string' },
        service_id: { type: 'string' },
      },
      required: ['service_name'],
    },
  },
  {
    name: 'stop_service',
    description: 'Stop a system service',
    inputSchema: {
      type: 'object',
      properties: {
        service_name: { type: 'string' },
        service_id: { type: 'string' },
      },
      required: ['service_name'],
    },
  },

  // Interface Management
  {
    name: 'get_interface_details',
    description: 'Get detailed information about a specific interface',
    inputSchema: {
      type: 'object',
      properties: {
        interface_name: { type: 'string' },
      },
      required: ['interface_name'],
    },
  },
  {
    name: 'reload_interface',
    description: 'Reload a network interface',
    inputSchema: {
      type: 'object',
      properties: {
        interface_name: { type: 'string' },
      },
      required: ['interface_name'],
    },
  },
  {
    name: 'get_interface_statistics',
    description: 'Get network interface statistics',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // VLAN Management
  {
    name: 'search_vlans',
    description: 'Search VLAN configurations',
    inputSchema: {
      type: 'object',
      properties: {
        search_params: { type: 'object' },
      },
    },
  },
  {
    name: 'add_vlan',
    description: 'Add a new VLAN configuration',
    inputSchema: {
      type: 'object',
      properties: {
        vlan: { type: 'object' },
      },
      required: ['vlan'],
    },
  },
  {
    name: 'get_vlan',
    description: 'Get VLAN configuration by UUID',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'update_vlan',
    description: 'Update VLAN configuration',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
        vlan: { type: 'object' },
      },
      required: ['uuid', 'vlan'],
    },
  },
  {
    name: 'delete_vlan',
    description: 'Delete VLAN configuration',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'reconfigure_vlans',
    description: 'Reconfigure all VLANs',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // Authentication & User Management
  {
    name: 'search_users',
    description: 'Search system users',
    inputSchema: {
      type: 'object',
      properties: {
        search_params: { type: 'object' },
      },
    },
  },
  {
    name: 'add_user',
    description: 'Add a new system user',
    inputSchema: {
      type: 'object',
      properties: {
        user: { type: 'object' },
      },
      required: ['user'],
    },
  },
  {
    name: 'get_user',
    description: 'Get user details by UUID',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'update_user',
    description: 'Update user information',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
        user: { type: 'object' },
      },
      required: ['uuid', 'user'],
    },
  },
  {
    name: 'delete_user',
    description: 'Delete a system user',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'add_api_key',
    description: 'Add API key for a user',
    inputSchema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
      },
      required: ['username'],
    },
  },
  {
    name: 'delete_api_key',
    description: 'Delete an API key',
    inputSchema: {
      type: 'object',
      properties: {
        key_id: { type: 'string' },
      },
      required: ['key_id'],
    },
  },
  {
    name: 'search_api_keys',
    description: 'Search API keys',
    inputSchema: {
      type: 'object',
      properties: {
        search_params: { type: 'object' },
      },
    },
  },

  // Group Management
  {
    name: 'search_groups',
    description: 'Search user groups',
    inputSchema: {
      type: 'object',
      properties: {
        search_params: { type: 'object' },
      },
    },
  },
  {
    name: 'add_group',
    description: 'Add a new user group',
    inputSchema: {
      type: 'object',
      properties: {
        group: { type: 'object' },
      },
      required: ['group'],
    },
  },
  {
    name: 'get_group',
    description: 'Get group details by UUID',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'update_group',
    description: 'Update group information',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
        group: { type: 'object' },
      },
      required: ['uuid', 'group'],
    },
  },
  {
    name: 'delete_group',
    description: 'Delete a user group',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
      },
      required: ['uuid'],
    },
  },

  // Certificate Management
  {
    name: 'search_certificates',
    description: 'Search certificates',
    inputSchema: {
      type: 'object',
      properties: {
        search_params: { type: 'object' },
      },
    },
  },
  {
    name: 'add_certificate',
    description: 'Add a new certificate',
    inputSchema: {
      type: 'object',
      properties: {
        certificate: { type: 'object' },
      },
      required: ['certificate'],
    },
  },
  {
    name: 'get_certificate',
    description: 'Get certificate by UUID',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'delete_certificate',
    description: 'Delete a certificate',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
      },
      required: ['uuid'],
    },
  },

  // Certificate Authority Management
  {
    name: 'search_certificate_authorities',
    description: 'Search certificate authorities',
    inputSchema: {
      type: 'object',
      properties: {
        search_params: { type: 'object' },
      },
    },
  },
  {
    name: 'get_certificate_authority',
    description: 'Get certificate authority by UUID',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'delete_certificate_authority',
    description: 'Delete a certificate authority',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
      },
      required: ['uuid'],
    },
  },

  // OpenVPN Management
  {
    name: 'get_openvpn_instances',
    description: 'Get OpenVPN instances',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'search_openvpn_instances',
    description: 'Search OpenVPN instances',
    inputSchema: {
      type: 'object',
      properties: {
        search_params: { type: 'object' },
      },
    },
  },
  {
    name: 'add_openvpn_instance',
    description: 'Add OpenVPN instance',
    inputSchema: {
      type: 'object',
      properties: {
        instance: { type: 'object' },
      },
      required: ['instance'],
    },
  },
  {
    name: 'update_openvpn_instance',
    description: 'Update OpenVPN instance',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
        instance: { type: 'object' },
      },
      required: ['uuid', 'instance'],
    },
  },
  {
    name: 'delete_openvpn_instance',
    description: 'Delete OpenVPN instance',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'toggle_openvpn_instance',
    description: 'Enable/disable OpenVPN instance',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
        enabled: { type: 'boolean' },
      },
      required: ['uuid', 'enabled'],
    },
  },
  {
    name: 'start_openvpn_service',
    description: 'Start OpenVPN service',
    inputSchema: {
      type: 'object',
      properties: {
        service_id: { type: 'string' },
      },
    },
  },
  {
    name: 'stop_openvpn_service',
    description: 'Stop OpenVPN service',
    inputSchema: {
      type: 'object',
      properties: {
        service_id: { type: 'string' },
      },
    },
  },
  {
    name: 'restart_openvpn_service',
    description: 'Restart OpenVPN service',
    inputSchema: {
      type: 'object',
      properties: {
        service_id: { type: 'string' },
      },
    },
  },
  {
    name: 'search_openvpn_sessions',
    description: 'Search OpenVPN sessions',
    inputSchema: {
      type: 'object',
      properties: {
        search_params: { type: 'object' },
      },
    },
  },
  {
    name: 'kill_openvpn_session',
    description: 'Kill an OpenVPN session',
    inputSchema: {
      type: 'object',
      properties: {
        session_data: { type: 'object' },
      },
      required: ['session_data'],
    },
  },

  // IPsec Management
  {
    name: 'ipsec_is_enabled',
    description: 'Check if IPsec is enabled',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'toggle_ipsec_service',
    description: 'Enable/disable IPsec service',
    inputSchema: {
      type: 'object',
      properties: {
        enabled: { type: 'boolean' },
      },
      required: ['enabled'],
    },
  },
  {
    name: 'search_ipsec_connections',
    description: 'Search IPsec connections',
    inputSchema: {
      type: 'object',
      properties: {
        search_params: { type: 'object' },
      },
    },
  },
  {
    name: 'add_ipsec_connection',
    description: 'Add IPsec connection',
    inputSchema: {
      type: 'object',
      properties: {
        connection: { type: 'object' },
      },
      required: ['connection'],
    },
  },
  {
    name: 'get_ipsec_connection',
    description: 'Get IPsec connection by UUID',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'update_ipsec_connection',
    description: 'Update IPsec connection',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
        connection: { type: 'object' },
      },
      required: ['uuid', 'connection'],
    },
  },
  {
    name: 'delete_ipsec_connection',
    description: 'Delete IPsec connection',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'toggle_ipsec_connection',
    description: 'Enable/disable IPsec connection',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
        enabled: { type: 'boolean' },
      },
      required: ['uuid', 'enabled'],
    },
  },
  {
    name: 'start_ipsec',
    description: 'Start IPsec service',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'stop_ipsec',
    description: 'Stop IPsec service',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'restart_ipsec',
    description: 'Restart IPsec service',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'reconfigure_ipsec',
    description: 'Reconfigure IPsec service',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'search_ipsec_sessions',
    description: 'Search IPsec sessions',
    inputSchema: {
      type: 'object',
      properties: {
        search_params: { type: 'object' },
        phase: { type: 'integer', enum: [1, 2] },
      },
      required: ['phase'],
    },
  },
  {
    name: 'connect_ipsec_session',
    description: 'Connect IPsec session',
    inputSchema: {
      type: 'object',
      properties: {
        session_id: { type: 'string' },
      },
      required: ['session_id'],
    },
  },
  {
    name: 'disconnect_ipsec_session',
    description: 'Disconnect IPsec session',
    inputSchema: {
      type: 'object',
      properties: {
        session_id: { type: 'string' },
      },
      required: ['session_id'],
    },
  },

  // DHCP Management
  {
    name: 'get_dhcp_config',
    description: 'Get DHCP configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'set_dhcp_config',
    description: 'Set DHCP configuration',
    inputSchema: {
      type: 'object',
      properties: {
        config: { type: 'object' },
      },
      required: ['config'],
    },
  },
  {
    name: 'search_dhcp_leases',
    description: 'Search DHCP leases',
    inputSchema: {
      type: 'object',
      properties: {
        search_params: { type: 'object' },
      },
    },
  },
  {
    name: 'search_dhcp_reservations',
    description: 'Search DHCP reservations',
    inputSchema: {
      type: 'object',
      properties: {
        search_params: { type: 'object' },
      },
    },
  },
  {
    name: 'add_dhcp_reservation',
    description: 'Add DHCP reservation',
    inputSchema: {
      type: 'object',
      properties: {
        reservation: { type: 'object' },
      },
      required: ['reservation'],
    },
  },
  {
    name: 'get_dhcp_reservation',
    description: 'Get DHCP reservation by UUID',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'update_dhcp_reservation',
    description: 'Update DHCP reservation',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
        reservation: { type: 'object' },
      },
      required: ['uuid', 'reservation'],
    },
  },
  {
    name: 'delete_dhcp_reservation',
    description: 'Delete DHCP reservation',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
      },
      required: ['uuid'],
    },
  },
  {
    name: 'toggle_dhcp_reservation',
    description: 'Enable/disable DHCP reservation',
    inputSchema: {
      type: 'object',
      properties: {
        uuid: { type: 'string' },
        enabled: { type: 'boolean' },
      },
      required: ['uuid', 'enabled'],
    },
  },
  {
    name: 'start_dhcp_service',
    description: 'Start DHCP service',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'stop_dhcp_service',
    description: 'Stop DHCP service',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'restart_dhcp_service',
    description: 'Restart DHCP service',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'reconfigure_dhcp',
    description: 'Reconfigure DHCP service',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_dhcp_status',
    description: 'Get DHCP service status',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // Plugin Management
  {
    name: 'list_plugins',
    description: 'List installed plugins',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'install_plugin',
    description: 'Install a plugin',
    inputSchema: {
      type: 'object',
      properties: {
        plugin_name: { type: 'string' },
      },
      required: ['plugin_name'],
    },
  },

  // VPN
  {
    name: 'get_vpn_connections',
    description: 'Get VPN connection status',
    inputSchema: {
      type: 'object',
      properties: {
        vpn_type: { type: 'string', default: 'OpenVPN' },
      },
    },
  },

  // Security Audit
  {
    name: 'perform_firewall_audit',
    description: 'Performs a basic security audit of the OPNsense configuration.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // API Endpoints Discovery
  {
    name: 'get_api_endpoints',
    description: 'List available API endpoints from OPNsense',
    inputSchema: {
      type: 'object',
      properties: {
        module: { type: 'string' },
      },
    },
  },

  // Custom API Call
  {
    name: 'exec_api_call',
    description: 'Execute a custom API call to OPNsense',
    inputSchema: {
      type: 'object',
      properties: {
        method: { type: 'string' },
        endpoint: { type: 'string' },
        params: { type: 'string' },
        data: { type: 'string' },
      },
      required: ['method', 'endpoint'],
    },
  },
];

/**
 * Type for tool handler functions
 */
type ToolHandler = (args: any) => Promise<CallToolResult>;

/**
 * Tool handlers mapping
 */
const toolHandlers: Record<string, ToolHandler> = {};

export class McpServer {
  private server: Server;
  private opnsenseClient: OPNsenseClient | null = null;
  private config: ServerConfig;
  private tools: ToolDefinition[];

  constructor(config?: ServerConfig) {
    this.config = config || {};
    this.tools = config?.plugins ? [...baseTools, ...pluginTools] : baseTools;
    this.server = new Server(
      {
        name: 'opnsense-mcp-server',
        version: '0.1.2',
        title: 'OPNsense MCP Server',
        description:
          'MCP server for managing OPNsense firewall configurations, monitoring system status, and automating network security tasks',
      },
      {
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
      }
    );

    if (config?.host && config?.apiKey && config?.apiSecret) {
      this.initializeClient({
        baseUrl: config.host,
        apiKey: config.apiKey,
        apiSecret: config.apiSecret,
        verifySsl: config.verifySsl ?? true,
      });
    }

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  public getInitializationResponse() {
    return serverInitializationResponse;
  }

  private initializeClient(config: OPNsenseConfig): OPNsenseClient {
    this.opnsenseClient = new OPNsenseClient(config);
    return this.opnsenseClient;
  }

  private ensureClient(): OPNsenseClient {
    if (!this.opnsenseClient) {
      throw new Error(
        'OPNsense client not configured. Please provide --host, --api-key, and --api-secret arguments or call configure_opnsense_connection tool.'
      );
    }
    return this.opnsenseClient;
  }

  private setupToolHandlers() {
    toolHandlers.configure_opnsense_connection = async (args: any) => {
      const { url, api_key, api_secret, verify_ssl = true } = args;
      const config: OPNsenseConfig = {
        baseUrl: url,
        apiKey: api_key,
        apiSecret: api_secret,
        verifySsl: verify_ssl,
      };

      this.initializeClient(config);

      const pluginsStatus = this.config?.plugins ? 'enabled' : 'disabled';

      return {
        content: [
          {
            type: 'text' as const,
            text: `OPNsense connection configured successfully. Plugins: ${pluginsStatus}`,
          },
        ],
      };
    };

    toolHandlers.get_system_status = async () => {
      const client = this.ensureClient();
      const response = await client.system.getStatus();

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    };

    toolHandlers.firewall_get_rules = async (args: any) => {
      const client = this.ensureClient();
      const { page = 1, rows_per_page = 20, search_phrase = '' } = args;

      const response = await client.firewall.rules.search({
        current: page,
        rowCount: rows_per_page,
        searchPhrase: search_phrase,
      });

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    };

    toolHandlers.firewall_add_rule = async (args: any) => {
      const client = this.ensureClient();
      const response = await client.firewall.rules.add(args);

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    };

    toolHandlers.firewall_delete_rule = async (args: any) => {
      const client = this.ensureClient();
      const { uuid } = args;
      const response = await client.firewall.rules.delete(uuid);

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    };

    toolHandlers.firewall_toggle_rule = async (args: any) => {
      const client = this.ensureClient();
      const { uuid, enabled } = args;
      const response = await client.firewall.rules.toggle(uuid, enabled);

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    };

    // Interfaces
    toolHandlers.get_interfaces = async () => {
      const client = this.ensureClient();
      const response = await client.interfaces.getInterfacesInfo();

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    };

    // DHCP
    toolHandlers.get_dhcp_leases = async () => {
      const client = this.ensureClient();
      const response = await client.diagnostics.getActivity();

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    };

    // Firewall aliases
    toolHandlers.get_firewall_aliases = async (args: any) => {
      const client = this.ensureClient();
      const { page = 1, rows_per_page = 20, search_phrase = '' } = args;

      const response = await client.firewall.aliases.search({
        current: page,
        rowCount: rows_per_page,
        searchPhrase: search_phrase,
      });

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    };

    toolHandlers.add_to_alias = async (args: any) => {
      const client = this.ensureClient();
      const { alias_name, address } = args;
      const response = await client.firewall.aliasUtils.add(alias_name, { address });

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    };

    toolHandlers.delete_from_alias = async (args: any) => {
      const client = this.ensureClient();
      const { alias_name, address } = args;
      const response = await client.firewall.aliasUtils.delete(alias_name, { address });

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    };

    // System logs and monitoring
    toolHandlers.get_firewall_logs = async (_args: any) => {
      const client = this.ensureClient();
      // Args available for future enhancement: count, filter_text

      try {
        // Using diagnostics module for log access
        const response = await client.diagnostics.getActivity();

        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error fetching firewall logs: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    // Service management
    toolHandlers.restart_service = async (args: any) => {
      const client = this.ensureClient();
      const { service_name } = args;

      try {
        const response = await client.service.restart(service_name);

        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error restarting service ${service_name}: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
            },
          ],
        };
      }
    };

    // Backup operations
    toolHandlers.backup_config = async () => {
      const client = this.ensureClient();

      try {
        const response = await client.backup.getProviders();

        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error creating backup: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    // System information
    toolHandlers.get_system_routes = async () => {
      const client = this.ensureClient();

      try {
        const response = await client.diagnostics.getActivity();

        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error fetching system routes: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.get_system_health = async () => {
      const client = this.ensureClient();

      try {
        const response = await client.diagnostics.getSystemInformation();

        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error fetching system health: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    // Plugin management
    toolHandlers.list_plugins = async () => {
      const client = this.ensureClient();

      try {
        const response = await client.firmware.getInfo();

        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error listing plugins: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.install_plugin = async (args: any) => {
      const client = this.ensureClient();
      const { plugin_name } = args;

      try {
        const response = await client.firmware.installPackage(plugin_name);

        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error installing plugin ${plugin_name}: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
            },
          ],
        };
      }
    };

    // VPN operations
    toolHandlers.get_vpn_connections = async (args: any) => {
      const client = this.ensureClient();
      const { vpn_type = 'OpenVPN' } = args;

      try {
        if (vpn_type === 'OpenVPN') {
          const response = await client.openVPN.getInstances();
          return {
            content: [
              {
                type: 'text' as const,
                text: JSON.stringify(response.data, null, 2),
              },
            ],
          };
        } else if (vpn_type === 'IPsec') {
          const response = await client.ipsec.getStatus();
          return {
            content: [
              {
                type: 'text' as const,
                text: JSON.stringify(response.data, null, 2),
              },
            ],
          };
        } else {
          return {
            content: [
              {
                type: 'text' as const,
                text: `Unsupported VPN type: ${vpn_type}. Supported types: OpenVPN, IPsec`,
              },
            ],
          };
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error fetching VPN connections: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    // Security audit
    toolHandlers.perform_firewall_audit = async () => {
      const client = this.ensureClient();

      try {
        const [rulesResponse, aliasesResponse, systemResponse] = await Promise.all([
          client.firewall.rules.search({ rowCount: 100 }),
          client.firewall.aliases.search({ rowCount: 100 }),
          client.system.getStatus(),
        ]);

        const audit = {
          timestamp: new Date().toISOString(),
          firewall_rules_count: rulesResponse.data?.rows?.length || 0,
          aliases_count: aliasesResponse.data?.rows?.length || 0,
          system_status: systemResponse.data,
          recommendations: [
            'Review firewall rules for unused or overly permissive rules',
            'Ensure default deny policies are in place',
            'Check for proper logging configuration',
            'Verify alias definitions are current and necessary',
          ],
        };

        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(audit, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error performing firewall audit: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    // Extended System Operations
    toolHandlers.system_reboot = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.system.reboot();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error rebooting system: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.system_halt = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.system.halt();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: 'text' as const, text: `Error halting system: ${error instanceof Error ? error.message : 'Unknown error'}` },
          ],
        };
      }
    };

    toolHandlers.dismiss_system_status = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.system.dismissStatus();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error dismissing system status: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    // Firmware Management
    toolHandlers.firmware_get_info = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.firmware.getInfo();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting firmware info: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.firmware_check_updates = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.firmware.checkUpdates();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error checking firmware updates: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.firmware_update = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.firmware.update();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error updating firmware: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.firmware_upgrade = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.firmware.upgrade();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error upgrading firmware: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.firmware_audit = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.firmware.audit();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error running firmware audit: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.firmware_get_changelog = async (args: any) => {
      const client = this.ensureClient();
      const { version } = args;
      try {
        const response = await client.firmware.getChangelog(version);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting firmware changelog: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    // Package Management
    toolHandlers.package_remove = async (args: any) => {
      const client = this.ensureClient();
      const { package_name } = args;
      try {
        const response = await client.firmware.removePackage(package_name);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error removing package ${package_name}: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
            },
          ],
        };
      }
    };

    toolHandlers.package_reinstall = async (args: any) => {
      const client = this.ensureClient();
      const { package_name } = args;
      try {
        const response = await client.firmware.reinstallPackage(package_name);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error reinstalling package ${package_name}: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
            },
          ],
        };
      }
    };

    toolHandlers.package_lock = async (args: any) => {
      const client = this.ensureClient();
      const { package_name } = args;
      try {
        const response = await client.firmware.lockPackage(package_name);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error locking package ${package_name}: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
            },
          ],
        };
      }
    };

    toolHandlers.package_unlock = async (args: any) => {
      const client = this.ensureClient();
      const { package_name } = args;
      try {
        const response = await client.firmware.unlockPackage(package_name);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error unlocking package ${package_name}: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
            },
          ],
        };
      }
    };

    toolHandlers.package_get_details = async (args: any) => {
      const client = this.ensureClient();
      const { package_name } = args;
      try {
        const response = await client.firmware.getPackageDetails(package_name);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting package details for ${package_name}: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
            },
          ],
        };
      }
    };

    // Advanced Firewall Operations
    toolHandlers.firewall_apply = async (args: any) => {
      const client = this.ensureClient();
      const { rollback_revision } = args;
      try {
        const response = await client.firewall.apply(rollback_revision);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error applying firewall changes: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.firewall_savepoint = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.firewall.savepoint();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error creating firewall savepoint: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.firewall_revert = async (args: any) => {
      const client = this.ensureClient();
      const { revision } = args;
      try {
        const response = await client.firewall.revert(revision);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error reverting firewall to revision ${revision}: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
            },
          ],
        };
      }
    };

    toolHandlers.get_firewall_rule_stats = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.firewall.getRuleStats();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting firewall rule stats: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.firewall_move_rule = async (args: any) => {
      const client = this.ensureClient();
      const { selected_uuid, target_uuid } = args;
      try {
        const response = await client.firewall.rules.moveBefore(selected_uuid, target_uuid);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error moving firewall rule: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.get_firewall_rule = async (args: any) => {
      const client = this.ensureClient();
      const { uuid } = args;
      try {
        const response = await client.firewall.rules.get(uuid);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting firewall rule ${uuid}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.update_firewall_rule = async (args: any) => {
      const client = this.ensureClient();
      const { uuid, rule } = args;
      try {
        const response = await client.firewall.rules.update(uuid, rule);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error updating firewall rule ${uuid}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    // API discovery
    toolHandlers.get_api_endpoints = async (args: any) => {
      const { module } = args;

      const endpoints = {
        system: ['getStatus', 'reboot', 'halt'],
        firewall: ['rules.search', 'rules.add', 'rules.delete', 'aliases.search', 'apply'],
        interfaces: ['getInterfacesInfo', 'getInterface', 'reloadInterface'],
        diagnostics: ['getSystemInformation', 'getActivity', 'getMemory'],
        service: ['searchServices', 'start', 'stop', 'restart'],
        firmware: ['getInfo', 'checkUpdates', 'installPackage'],
        openVPN: ['getInstances', 'searchSessions'],
        ipsec: ['getStatus', 'searchConnections'],
        backup: ['getProviders', 'getBackups'],
      };

      const result = module ? { [module]: endpoints[module as keyof typeof endpoints] || [] } : endpoints;

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    };

    // Enhanced Alias Management
    toolHandlers.get_firewall_alias = async (args: any) => {
      const client = this.ensureClient();
      const { uuid } = args;
      try {
        const response = await client.firewall.aliases.get(uuid);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting firewall alias ${uuid}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.add_firewall_alias = async (args: any) => {
      const client = this.ensureClient();
      const { alias } = args;
      try {
        const response = await client.firewall.aliases.add(alias);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error adding firewall alias: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.update_firewall_alias = async (args: any) => {
      const client = this.ensureClient();
      const { uuid, alias } = args;
      try {
        const response = await client.firewall.aliases.update(uuid, alias);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error updating firewall alias ${uuid}: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
            },
          ],
        };
      }
    };

    toolHandlers.delete_firewall_alias = async (args: any) => {
      const client = this.ensureClient();
      const { uuid } = args;
      try {
        const response = await client.firewall.aliases.delete(uuid);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error deleting firewall alias ${uuid}: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
            },
          ],
        };
      }
    };

    toolHandlers.toggle_firewall_alias = async (args: any) => {
      const client = this.ensureClient();
      const { uuid, enabled } = args;
      try {
        const response = await client.firewall.aliases.toggle(uuid, enabled);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error toggling firewall alias ${uuid}: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
            },
          ],
        };
      }
    };

    toolHandlers.export_firewall_aliases = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.firewall.aliases.export();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error exporting firewall aliases: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.import_firewall_aliases = async (args: any) => {
      const client = this.ensureClient();
      const { data } = args;
      try {
        const response = await client.firewall.aliases.import(data);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error importing firewall aliases: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.get_alias_table_size = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.firewall.aliases.getTableSize();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting alias table size: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.list_alias_contents = async (args: any) => {
      const client = this.ensureClient();
      const { alias_name } = args;
      try {
        const response = await client.firewall.aliasUtils.list(alias_name);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error listing alias contents for ${alias_name}: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
            },
          ],
        };
      }
    };

    toolHandlers.flush_alias = async (args: any) => {
      const client = this.ensureClient();
      const { alias_name } = args;
      try {
        const response = await client.firewall.aliasUtils.flush(alias_name);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error flushing alias ${alias_name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    // Enhanced Diagnostics
    toolHandlers.get_memory_usage = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.diagnostics.getMemory();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting memory usage: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.get_disk_usage = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.diagnostics.getDisk();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting disk usage: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.get_system_temperature = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.diagnostics.getTemperature();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting system temperature: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.get_cpu_usage = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.diagnostics.getCpuUsageStream();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting CPU usage: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.get_arp_table = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.diagnostics.getArp();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting ARP table: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.search_arp_table = async (args: any) => {
      const client = this.ensureClient();
      const { search_params } = args;
      try {
        const response = await client.diagnostics.searchArp(search_params);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error searching ARP table: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.flush_arp_table = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.diagnostics.flushArp();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error flushing ARP table: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.get_pf_states = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.diagnostics.getPfStates();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting PF states: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.query_pf_states = async (args: any) => {
      const client = this.ensureClient();
      const { params } = args;
      try {
        const response = await client.diagnostics.queryPfStates(params);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error querying PF states: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.flush_firewall_states = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.diagnostics.flushFirewallStates();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error flushing firewall states: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.kill_firewall_states = async (args: any) => {
      const client = this.ensureClient();
      const { params } = args;
      try {
        const response = await client.diagnostics.killFirewallStates(params);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error killing firewall states: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.dns_lookup = async (args: any) => {
      const client = this.ensureClient();
      const { hostname, record_type = 'A' } = args;
      try {
        const response = await client.diagnostics.dnsLookup({ hostname, type: record_type });
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error performing DNS lookup for ${hostname}: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
            },
          ],
        };
      }
    };

    // Service Management
    toolHandlers.search_services = async (args: any) => {
      const client = this.ensureClient();
      const { search_params } = args;
      try {
        const response = await client.service.searchServices(search_params);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error searching services: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.start_service = async (args: any) => {
      const client = this.ensureClient();
      const { service_name, service_id } = args;
      try {
        const response = await client.service.start(service_name, service_id);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error starting service ${service_name}: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
            },
          ],
        };
      }
    };

    toolHandlers.stop_service = async (args: any) => {
      const client = this.ensureClient();
      const { service_name, service_id } = args;
      try {
        const response = await client.service.stop(service_name, service_id);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error stopping service ${service_name}: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
            },
          ],
        };
      }
    };

    // Interface Management
    toolHandlers.get_interface_details = async (args: any) => {
      const client = this.ensureClient();
      const { interface_name } = args;
      try {
        const response = await client.interfaces.getInterface(interface_name);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting interface details for ${interface_name}: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
            },
          ],
        };
      }
    };

    toolHandlers.reload_interface = async (args: any) => {
      const client = this.ensureClient();
      const { interface_name } = args;
      try {
        const response = await client.interfaces.reloadInterface(interface_name);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error reloading interface ${interface_name}: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
            },
          ],
        };
      }
    };

    toolHandlers.get_interface_statistics = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.diagnostics.getInterfaceStatistics();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting interface statistics: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    // Custom API call
    toolHandlers.exec_api_call = async (args: any) => {
      const client = this.ensureClient();
      const { method, endpoint, params, data } = args;

      try {
        let parsedParams;
        let parsedData;

        if (params) {
          try {
            parsedParams = JSON.parse(params);
          } catch {
            parsedParams = {};
          }
        }

        if (data) {
          try {
            parsedData = JSON.parse(data);
          } catch {
            parsedData = data;
          }
        }

        // Use the HTTP client directly for custom calls
        const response = await (client as any).http.request({
          path: endpoint,
          method: method.toUpperCase(),
          params: parsedParams,
          data: parsedData,
        });

        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error executing API call ${method} ${endpoint}: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
            },
          ],
        };
      }
    };

    // VLAN Management
    toolHandlers.search_vlans = async (args: any) => {
      const client = this.ensureClient();
      const { search_params } = args;
      try {
        const response = await client.interfaces.searchVlans(search_params);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error searching VLANs: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.add_vlan = async (args: any) => {
      const client = this.ensureClient();
      const { vlan } = args;
      try {
        const response = await client.interfaces.addVlan(vlan);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: 'text' as const, text: `Error adding VLAN: ${error instanceof Error ? error.message : 'Unknown error'}` },
          ],
        };
      }
    };

    toolHandlers.get_vlan = async (args: any) => {
      const client = this.ensureClient();
      const { uuid } = args;
      try {
        const response = await client.interfaces.getVlan(uuid);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting VLAN ${uuid}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.update_vlan = async (args: any) => {
      const client = this.ensureClient();
      const { uuid, vlan } = args;
      try {
        const response = await client.interfaces.updateVlan(uuid, vlan);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error updating VLAN ${uuid}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.delete_vlan = async (args: any) => {
      const client = this.ensureClient();
      const { uuid } = args;
      try {
        const response = await client.interfaces.deleteVlan(uuid);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error deleting VLAN ${uuid}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.reconfigure_vlans = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.interfaces.reconfigureVlans();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error reconfiguring VLANs: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    // Authentication & User Management
    toolHandlers.search_users = async (args: any) => {
      const client = this.ensureClient();
      const { search_params } = args;
      try {
        const response = await client.auth.users.search(search_params);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error searching users: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.add_user = async (args: any) => {
      const client = this.ensureClient();
      const { user } = args;
      try {
        const response = await client.auth.users.add(user);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: 'text' as const, text: `Error adding user: ${error instanceof Error ? error.message : 'Unknown error'}` },
          ],
        };
      }
    };

    toolHandlers.get_user = async (args: any) => {
      const client = this.ensureClient();
      const { uuid } = args;
      try {
        const response = await client.auth.users.get(uuid);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting user ${uuid}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.update_user = async (args: any) => {
      const client = this.ensureClient();
      const { uuid, user } = args;
      try {
        const response = await client.auth.users.update(uuid, user);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error updating user ${uuid}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.delete_user = async (args: any) => {
      const client = this.ensureClient();
      const { uuid } = args;
      try {
        const response = await client.auth.users.delete(uuid);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error deleting user ${uuid}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.add_api_key = async (args: any) => {
      const client = this.ensureClient();
      const { username } = args;
      try {
        const response = await client.auth.users.addApiKey(username);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error adding API key for ${username}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.delete_api_key = async (args: any) => {
      const client = this.ensureClient();
      const { key_id } = args;
      try {
        const response = await client.auth.users.deleteApiKey(key_id);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error deleting API key ${key_id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.search_api_keys = async (args: any) => {
      const client = this.ensureClient();
      const { search_params } = args;
      try {
        const response = await client.auth.users.searchApiKeys(search_params);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error searching API keys: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    // Group Management
    toolHandlers.search_groups = async (args: any) => {
      const client = this.ensureClient();
      const { search_params } = args;
      try {
        const response = await client.auth.groups.search(search_params);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error searching groups: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.add_group = async (args: any) => {
      const client = this.ensureClient();
      const { group } = args;
      try {
        const response = await client.auth.groups.add(group);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: 'text' as const, text: `Error adding group: ${error instanceof Error ? error.message : 'Unknown error'}` },
          ],
        };
      }
    };

    toolHandlers.get_group = async (args: any) => {
      const client = this.ensureClient();
      const { uuid } = args;
      try {
        const response = await client.auth.groups.get(uuid);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting group ${uuid}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.update_group = async (args: any) => {
      const client = this.ensureClient();
      const { uuid, group } = args;
      try {
        const response = await client.auth.groups.update(uuid, group);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error updating group ${uuid}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.delete_group = async (args: any) => {
      const client = this.ensureClient();
      const { uuid } = args;
      try {
        const response = await client.auth.groups.delete(uuid);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error deleting group ${uuid}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    // Certificate Management
    toolHandlers.search_certificates = async (args: any) => {
      const client = this.ensureClient();
      const { search_params } = args;
      try {
        const response = await client.trust.searchCerts(search_params);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error searching certificates: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.add_certificate = async (args: any) => {
      const client = this.ensureClient();
      const { certificate } = args;
      try {
        const response = await client.trust.addCert(certificate);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error adding certificate: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.get_certificate = async (args: any) => {
      const client = this.ensureClient();
      const { uuid } = args;
      try {
        const response = await client.trust.getCert(uuid);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting certificate ${uuid}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.delete_certificate = async (args: any) => {
      const client = this.ensureClient();
      const { uuid } = args;
      try {
        const response = await client.trust.deleteCert(uuid);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error deleting certificate ${uuid}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    // Certificate Authority Management
    toolHandlers.search_certificate_authorities = async (args: any) => {
      const client = this.ensureClient();
      const { search_params } = args;
      try {
        const response = await client.trust.searchCAs(search_params);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error searching certificate authorities: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
            },
          ],
        };
      }
    };

    toolHandlers.get_certificate_authority = async (args: any) => {
      const client = this.ensureClient();
      const { uuid } = args;
      try {
        const response = await client.trust.getCA(uuid);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting certificate authority ${uuid}: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
            },
          ],
        };
      }
    };

    toolHandlers.delete_certificate_authority = async (args: any) => {
      const client = this.ensureClient();
      const { uuid } = args;
      try {
        const response = await client.trust.deleteCA(uuid);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error deleting certificate authority ${uuid}: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
            },
          ],
        };
      }
    };

    // OpenVPN Management
    toolHandlers.get_openvpn_instances = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.openVPN.getInstances();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting OpenVPN instances: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.search_openvpn_instances = async (args: any) => {
      const client = this.ensureClient();
      const { search_params } = args;
      try {
        const response = await client.openVPN.searchInstances(search_params);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error searching OpenVPN instances: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.add_openvpn_instance = async (args: any) => {
      const client = this.ensureClient();
      const { instance } = args;
      try {
        const response = await client.openVPN.addInstance(instance);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error adding OpenVPN instance: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.update_openvpn_instance = async (args: any) => {
      const client = this.ensureClient();
      const { uuid, instance } = args;
      try {
        const response = await client.openVPN.updateInstance(uuid, instance);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error updating OpenVPN instance ${uuid}: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
            },
          ],
        };
      }
    };

    toolHandlers.delete_openvpn_instance = async (args: any) => {
      const client = this.ensureClient();
      const { uuid } = args;
      try {
        const response = await client.openVPN.deleteInstance(uuid);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error deleting OpenVPN instance ${uuid}: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
            },
          ],
        };
      }
    };

    toolHandlers.toggle_openvpn_instance = async (args: any) => {
      const client = this.ensureClient();
      const { uuid, enabled } = args;
      try {
        const response = await client.openVPN.toggleInstance(uuid, enabled);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error toggling OpenVPN instance ${uuid}: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
            },
          ],
        };
      }
    };

    toolHandlers.start_openvpn_service = async (args: any) => {
      const client = this.ensureClient();
      const { service_id } = args;
      try {
        const response = await client.openVPN.startService(service_id);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error starting OpenVPN service: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.stop_openvpn_service = async (args: any) => {
      const client = this.ensureClient();
      const { service_id } = args;
      try {
        const response = await client.openVPN.stopService(service_id);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error stopping OpenVPN service: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.restart_openvpn_service = async (args: any) => {
      const client = this.ensureClient();
      const { service_id } = args;
      try {
        const response = await client.openVPN.restartService(service_id);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error restarting OpenVPN service: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.search_openvpn_sessions = async (args: any) => {
      const client = this.ensureClient();
      const { search_params } = args;
      try {
        const response = await client.openVPN.searchSessions(search_params);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error searching OpenVPN sessions: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.kill_openvpn_session = async (args: any) => {
      const client = this.ensureClient();
      const { session_data } = args;
      try {
        const response = await client.openVPN.killSession(session_data);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error killing OpenVPN session: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    // IPsec Management
    toolHandlers.ipsec_is_enabled = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.ipsec.isEnabled();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error checking IPsec status: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.toggle_ipsec_service = async (args: any) => {
      const client = this.ensureClient();
      const { enabled } = args;
      try {
        const response = await client.ipsec.toggleService(enabled);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error toggling IPsec service: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.search_ipsec_connections = async (args: any) => {
      const client = this.ensureClient();
      const { search_params } = args;
      try {
        const response = await client.ipsec.searchConnections(search_params);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error searching IPsec connections: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.add_ipsec_connection = async (args: any) => {
      const client = this.ensureClient();
      const { connection } = args;
      try {
        const response = await client.ipsec.addConnection(connection);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error adding IPsec connection: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.get_ipsec_connection = async (args: any) => {
      const client = this.ensureClient();
      const { uuid } = args;
      try {
        const response = await client.ipsec.getConnection(uuid);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting IPsec connection ${uuid}: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
            },
          ],
        };
      }
    };

    toolHandlers.update_ipsec_connection = async (args: any) => {
      const client = this.ensureClient();
      const { uuid, connection } = args;
      try {
        const response = await client.ipsec.updateConnection(uuid, connection);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error updating IPsec connection ${uuid}: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
            },
          ],
        };
      }
    };

    toolHandlers.delete_ipsec_connection = async (args: any) => {
      const client = this.ensureClient();
      const { uuid } = args;
      try {
        const response = await client.ipsec.deleteConnection(uuid);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error deleting IPsec connection ${uuid}: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
            },
          ],
        };
      }
    };

    toolHandlers.toggle_ipsec_connection = async (args: any) => {
      const client = this.ensureClient();
      const { uuid, enabled } = args;
      try {
        const response = await client.ipsec.toggleConnection(uuid, enabled);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error toggling IPsec connection ${uuid}: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
            },
          ],
        };
      }
    };

    toolHandlers.start_ipsec = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.ipsec.start();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: 'text' as const, text: `Error starting IPsec: ${error instanceof Error ? error.message : 'Unknown error'}` },
          ],
        };
      }
    };

    toolHandlers.stop_ipsec = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.ipsec.stop();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: 'text' as const, text: `Error stopping IPsec: ${error instanceof Error ? error.message : 'Unknown error'}` },
          ],
        };
      }
    };

    toolHandlers.restart_ipsec = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.ipsec.restart();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error restarting IPsec: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.reconfigure_ipsec = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.ipsec.reconfigure();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error reconfiguring IPsec: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.search_ipsec_sessions = async (args: any) => {
      const client = this.ensureClient();
      const { search_params, phase } = args;
      try {
        let response;
        if (phase === 1) {
          response = await client.ipsec.searchPhase1Sessions(search_params);
        } else {
          response = await client.ipsec.searchPhase2Sessions(search_params);
        }
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error searching IPsec phase ${phase} sessions: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
            },
          ],
        };
      }
    };

    toolHandlers.connect_ipsec_session = async (args: any) => {
      const client = this.ensureClient();
      const { session_id } = args;
      try {
        const response = await client.ipsec.connectSession(session_id);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error connecting IPsec session ${session_id}: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
            },
          ],
        };
      }
    };

    toolHandlers.disconnect_ipsec_session = async (args: any) => {
      const client = this.ensureClient();
      const { session_id } = args;
      try {
        const response = await client.ipsec.disconnectSession(session_id);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error disconnecting IPsec session ${session_id}: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
            },
          ],
        };
      }
    };

    // DHCP Management
    toolHandlers.get_dhcp_config = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.dhcpv4.getConfig();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting DHCP config: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.set_dhcp_config = async (args: any) => {
      const client = this.ensureClient();
      const { config } = args;
      try {
        const response = await client.dhcpv4.setConfig(config);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error setting DHCP config: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.search_dhcp_leases = async (args: any) => {
      const client = this.ensureClient();
      const { search_params } = args;
      try {
        const response = await client.dhcpv4.searchLeases(search_params);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error searching DHCP leases: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.search_dhcp_reservations = async (args: any) => {
      const client = this.ensureClient();
      const { search_params } = args;
      try {
        const response = await client.dhcpv4.searchReservations(search_params);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error searching DHCP reservations: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.add_dhcp_reservation = async (args: any) => {
      const client = this.ensureClient();
      const { reservation } = args;
      try {
        const response = await client.dhcpv4.addReservation(reservation);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error adding DHCP reservation: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.get_dhcp_reservation = async (args: any) => {
      const client = this.ensureClient();
      const { uuid } = args;
      try {
        const response = await client.dhcpv4.getReservation(uuid);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting DHCP reservation ${uuid}: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
            },
          ],
        };
      }
    };

    toolHandlers.update_dhcp_reservation = async (args: any) => {
      const client = this.ensureClient();
      const { uuid, reservation } = args;
      try {
        const response = await client.dhcpv4.updateReservation(uuid, reservation);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error updating DHCP reservation ${uuid}: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
            },
          ],
        };
      }
    };

    toolHandlers.delete_dhcp_reservation = async (args: any) => {
      const client = this.ensureClient();
      const { uuid } = args;
      try {
        const response = await client.dhcpv4.deleteReservation(uuid);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error deleting DHCP reservation ${uuid}: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
            },
          ],
        };
      }
    };

    toolHandlers.toggle_dhcp_reservation = async (args: any) => {
      const client = this.ensureClient();
      const { uuid, enabled } = args;
      try {
        const response = await client.dhcpv4.toggleReservation(uuid, enabled);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error toggling DHCP reservation ${uuid}: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
            },
          ],
        };
      }
    };

    toolHandlers.start_dhcp_service = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.dhcpv4.start();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error starting DHCP service: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.stop_dhcp_service = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.dhcpv4.stop();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error stopping DHCP service: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.restart_dhcp_service = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.dhcpv4.restart();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error restarting DHCP service: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.reconfigure_dhcp = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.dhcpv4.reconfigure();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error reconfiguring DHCP: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.get_dhcp_status = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.dhcpv4.getStatus();
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting DHCP status: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    // Plugin handlers - only register if plugins are enabled
    if (this.config?.plugins) {
      this.setupPluginHandlers();
    }

    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: this.tools,
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
      const { name, arguments: args } = request.params;

      const handler = toolHandlers[name as keyof typeof toolHandlers];
      if (!handler) {
        throw new Error(`Unknown tool: ${name}`);
      }

      return await handler(args as any);
    });
  }

  private setupPluginHandlers() {
    // WireGuard Plugin Handlers
    toolHandlers.wireguard_get_status = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.wireGuard.getStatus();
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting WireGuard status: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.wireguard_get_config = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.wireGuard.getGeneral();
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting WireGuard config: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.wireguard_search_servers = async (args: any) => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.wireGuard.searchServers(args || {});
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error searching WireGuard servers: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.wireguard_search_clients = async (args: any) => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.wireGuard.searchClients(args || {});
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error searching WireGuard clients: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.wireguard_generate_keypair = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.wireGuard.generateKeyPair();
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error generating WireGuard keypair: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    // Nginx Plugin Handlers
    toolHandlers.nginx_get_status = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.nginx.getStatus();
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting Nginx status: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.nginx_get_upstreams = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.nginx.searchUpstreams();
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting Nginx upstreams: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    // HAProxy Plugin Handlers
    toolHandlers.haproxy_get_status = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.haproxy.getStatus();
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting HAProxy status: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.haproxy_get_backends = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.haproxy.searchBackends();
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting HAProxy backends: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    // Bind DNS Plugin Handlers
    toolHandlers.bind_get_status = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.bind.getStatus();
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting Bind status: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.bind_get_zones = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.bind.getDomains();
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting Bind zones: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    // Caddy Plugin Handlers
    toolHandlers.caddy_get_status = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.caddy.getStatus();
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting Caddy status: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.caddy_get_config = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.caddy.getGeneral();
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting Caddy config: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    // CrowdSec Plugin Handlers
    toolHandlers.crowdsec_get_status = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.crowdsec.getStatus();
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting CrowdSec status: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.crowdsec_get_decisions = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.crowdsec.getDecisions();
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting CrowdSec decisions: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    // NetSNMP Plugin Handlers
    toolHandlers.netsnmp_get_status = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.netsnmp.getStatus();
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting NetSNMP status: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.netsnmp_get_config = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.netsnmp.getGeneral();
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting NetSNMP config: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    // Netdata Plugin Handlers
    toolHandlers.netdata_get_status = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.netdata.getStatus();
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting Netdata status: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.netdata_get_config = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.netdata.getGeneral();
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting Netdata config: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    // Additional plugin handlers for enhanced functionality
    toolHandlers.nginx_search_upstreams = async (args: any) => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.nginx.searchUpstreams(args || {});
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error searching Nginx upstreams: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.nginx_get_locations = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.nginx.searchLocations();
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting Nginx locations: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.nginx_search_locations = async (args: any) => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.nginx.searchLocations(args || {});
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error searching Nginx locations: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.haproxy_search_backends = async (args: any) => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.haproxy.searchBackends(args || {});
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error searching HAProxy backends: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.haproxy_get_servers = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.haproxy.searchServers();
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting HAProxy servers: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.haproxy_search_servers = async (args: any) => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.haproxy.searchServers(args || {});
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error searching HAProxy servers: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.bind_get_domains = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.bind.getDomains();
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting Bind domains: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.bind_search_domains = async (args: any) => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.bind.searchPrimaryDomains(args || {});
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error searching Bind domains: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.bind_search_records = async (args: any) => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.bind.searchRecords(args || {});
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error searching Bind records: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.bind_search_acl = async (args: any) => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.bind.searchAcl(args || {});
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error searching Bind ACL: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.caddy_get_general = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.caddy.getGeneral();
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting Caddy general config: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.caddy_search_reverseproxy = async (args: any) => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.caddy.searchReverseProxies(args || {});
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error searching Caddy reverse proxy: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.caddy_search_subdomains = async (args: any) => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.caddy.searchSubdomains(args || {});
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error searching Caddy subdomains: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.caddy_search_handles = async (args: any) => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.caddy.searchHandles(args || {});
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error searching Caddy handles: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.crowdsec_get_general = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.crowdsec.getGeneral();
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting CrowdSec general config: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
            },
          ],
        };
      }
    };

    toolHandlers.netsnmp_get_general = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.netsnmp.getGeneral();
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting NetSNMP general config: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.netdata_get_general = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.netdata.getGeneral();
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting Netdata general config: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.wireguard_search_peers = async (args: any) => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.wireGuard.searchServers(args || {});
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error searching WireGuard peers: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.wireguard_get_peers = async () => {
      const client = this.ensureClient();
      try {
        const response = await client.plugins.wireGuard.searchServers();
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting WireGuard peers: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    const createPluginNotAvailableHandler = (pluginName: string, methodName: string) => {
      return async () => {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Plugin tool "${pluginName}_${methodName}" is defined but the ${pluginName} plugin is not yet fully implemented in the TypeScript client. This plugin may not be installed, may require additional configuration, or may need to be accessed through direct API calls.`,
            },
          ],
        };
      };
    };

    toolHandlers.acmeclient_get_status = createPluginNotAvailableHandler('acmeclient', 'get_status');
    toolHandlers.acmeclient_get_general = createPluginNotAvailableHandler('acmeclient', 'get_general');
    toolHandlers.acmeclient_search_accounts = createPluginNotAvailableHandler('acmeclient', 'search_accounts');
    toolHandlers.apcupsd_get_status = createPluginNotAvailableHandler('apcupsd', 'get_status');
    toolHandlers.apcupsd_get_general = createPluginNotAvailableHandler('apcupsd', 'get_general');
    toolHandlers.chrony_get_status = createPluginNotAvailableHandler('chrony', 'get_status');
    toolHandlers.chrony_get_general = createPluginNotAvailableHandler('chrony', 'get_general');
    toolHandlers.cicap_get_status = createPluginNotAvailableHandler('cicap', 'get_status');
    toolHandlers.clamav_get_status = createPluginNotAvailableHandler('clamav', 'get_status');
    toolHandlers.clamav_get_general = createPluginNotAvailableHandler('clamav', 'get_general');
    toolHandlers.collectd_get_status = createPluginNotAvailableHandler('collectd', 'get_status');
    toolHandlers.collectd_get_general = createPluginNotAvailableHandler('collectd', 'get_general');
    toolHandlers.dnscryptproxy_get_status = createPluginNotAvailableHandler('dnscryptproxy', 'get_status');
    toolHandlers.dnscryptproxy_get_general = createPluginNotAvailableHandler('dnscryptproxy', 'get_general');
    toolHandlers.dyndns_get_status = createPluginNotAvailableHandler('dyndns', 'get_status');
    toolHandlers.dyndns_get_general = createPluginNotAvailableHandler('dyndns', 'get_general');
    toolHandlers.dyndns_search_accounts = createPluginNotAvailableHandler('dyndns', 'search_accounts');
    toolHandlers.freeradius_get_status = createPluginNotAvailableHandler('freeradius', 'get_status');
    toolHandlers.freeradius_get_general = createPluginNotAvailableHandler('freeradius', 'get_general');
    toolHandlers.freeradius_search_users = createPluginNotAvailableHandler('freeradius', 'search_users');
    toolHandlers.ftpproxy_get_status = createPluginNotAvailableHandler('ftpproxy', 'get_status');
    toolHandlers.gridexample_get_status = createPluginNotAvailableHandler('gridexample', 'get_status');
    toolHandlers.hwprobe_get_status = createPluginNotAvailableHandler('hwprobe', 'get_status');
    toolHandlers.hwprobe_get_general = createPluginNotAvailableHandler('hwprobe', 'get_general');
    toolHandlers.iperf_get_status = createPluginNotAvailableHandler('iperf', 'get_status');
    toolHandlers.iperf_get_general = createPluginNotAvailableHandler('iperf', 'get_general');
    toolHandlers.iperf_start_test = createPluginNotAvailableHandler('iperf', 'start_test');
    toolHandlers.lldpd_get_status = createPluginNotAvailableHandler('lldpd', 'get_status');
    toolHandlers.lldpd_get_general = createPluginNotAvailableHandler('lldpd', 'get_general');
    toolHandlers.lldpd_get_neighbors = createPluginNotAvailableHandler('lldpd', 'get_neighbors');
    toolHandlers.maltrail_get_status = createPluginNotAvailableHandler('maltrail', 'get_status');
    toolHandlers.maltrail_get_general = createPluginNotAvailableHandler('maltrail', 'get_general');
    toolHandlers.mdnsrepeater_get_status = createPluginNotAvailableHandler('mdnsrepeater', 'get_status');
    toolHandlers.mdnsrepeater_get_general = createPluginNotAvailableHandler('mdnsrepeater', 'get_general');
    toolHandlers.muninnode_get_status = createPluginNotAvailableHandler('muninnode', 'get_status');
    toolHandlers.muninnode_get_general = createPluginNotAvailableHandler('muninnode', 'get_general');
    toolHandlers.ndproxy_get_status = createPluginNotAvailableHandler('ndproxy', 'get_status');
    toolHandlers.nodeexporter_get_status = createPluginNotAvailableHandler('nodeexporter', 'get_status');
    toolHandlers.nodeexporter_get_general = createPluginNotAvailableHandler('nodeexporter', 'get_general');
    toolHandlers.nrpe_get_status = createPluginNotAvailableHandler('nrpe', 'get_status');
    toolHandlers.nrpe_get_general = createPluginNotAvailableHandler('nrpe', 'get_general');
    toolHandlers.nrpe_search_checks = createPluginNotAvailableHandler('nrpe', 'search_checks');
    toolHandlers.ntopng_get_status = createPluginNotAvailableHandler('ntopng', 'get_status');
    toolHandlers.ntopng_get_general = createPluginNotAvailableHandler('ntopng', 'get_general');
    toolHandlers.nut_get_status = createPluginNotAvailableHandler('nut', 'get_status');
    toolHandlers.nut_get_general = createPluginNotAvailableHandler('nut', 'get_general');
    toolHandlers.openconnect_get_status = createPluginNotAvailableHandler('openconnect', 'get_status');
    toolHandlers.openconnect_get_general = createPluginNotAvailableHandler('openconnect', 'get_general');
    toolHandlers.openconnect_search_users = createPluginNotAvailableHandler('openconnect', 'search_users');
    toolHandlers.postfix_get_status = createPluginNotAvailableHandler('postfix', 'get_status');
    toolHandlers.postfix_get_general = createPluginNotAvailableHandler('postfix', 'get_general');
    toolHandlers.postfix_search_senders = createPluginNotAvailableHandler('postfix', 'search_senders');
    toolHandlers.proxy_get_status = createPluginNotAvailableHandler('proxy', 'get_status');
    toolHandlers.proxy_get_general = createPluginNotAvailableHandler('proxy', 'get_general');
    toolHandlers.proxysso_get_status = createPluginNotAvailableHandler('proxysso', 'get_status');
    toolHandlers.puppetagent_get_status = createPluginNotAvailableHandler('puppetagent', 'get_status');
    toolHandlers.puppetagent_get_general = createPluginNotAvailableHandler('puppetagent', 'get_general');
    toolHandlers.qemuguestagent_get_status = createPluginNotAvailableHandler('qemuguestagent', 'get_status');
    toolHandlers.quagga_get_status = createPluginNotAvailableHandler('quagga', 'get_status');
    toolHandlers.quagga_get_general = createPluginNotAvailableHandler('quagga', 'get_general');
    toolHandlers.quagga_search_bgp = createPluginNotAvailableHandler('quagga', 'search_bgp');
    toolHandlers.radsecproxy_get_status = createPluginNotAvailableHandler('radsecproxy', 'get_status');
    toolHandlers.radsecproxy_get_general = createPluginNotAvailableHandler('radsecproxy', 'get_general');
    toolHandlers.radsecproxy_search_clients = createPluginNotAvailableHandler('radsecproxy', 'search_clients');
    toolHandlers.redis_get_status = createPluginNotAvailableHandler('redis', 'get_status');
    toolHandlers.redis_get_general = createPluginNotAvailableHandler('redis', 'get_general');
    toolHandlers.redis_get_info = createPluginNotAvailableHandler('redis', 'get_info');
    toolHandlers.relayd_get_status = createPluginNotAvailableHandler('relayd', 'get_status');
    toolHandlers.relayd_get_general = createPluginNotAvailableHandler('relayd', 'get_general');
    toolHandlers.relayd_search_hosts = createPluginNotAvailableHandler('relayd', 'search_hosts');
    toolHandlers.rspamd_get_status = createPluginNotAvailableHandler('rspamd', 'get_status');
    toolHandlers.rspamd_get_general = createPluginNotAvailableHandler('rspamd', 'get_general');
    toolHandlers.shadowsocks_get_status = createPluginNotAvailableHandler('shadowsocks', 'get_status');
    toolHandlers.shadowsocks_get_general = createPluginNotAvailableHandler('shadowsocks', 'get_general');
    toolHandlers.shadowsocks_search_users = createPluginNotAvailableHandler('shadowsocks', 'search_users');
    toolHandlers.siproxyd_get_status = createPluginNotAvailableHandler('siproxyd', 'get_status');
    toolHandlers.siproxyd_get_general = createPluginNotAvailableHandler('siproxyd', 'get_general');
    toolHandlers.siproxyd_search_users = createPluginNotAvailableHandler('siproxyd', 'search_users');
    toolHandlers.smart_get_status = createPluginNotAvailableHandler('smart', 'get_status');
    toolHandlers.smart_get_info = createPluginNotAvailableHandler('smart', 'get_info');
    toolHandlers.softether_get_status = createPluginNotAvailableHandler('softether', 'get_status');
    toolHandlers.softether_get_general = createPluginNotAvailableHandler('softether', 'get_general');
    toolHandlers.softether_search_users = createPluginNotAvailableHandler('softether', 'search_users');
    toolHandlers.sslh_get_status = createPluginNotAvailableHandler('sslh', 'get_status');
    toolHandlers.sslh_get_general = createPluginNotAvailableHandler('sslh', 'get_general');
    toolHandlers.stunnel_get_status = createPluginNotAvailableHandler('stunnel', 'get_status');
    toolHandlers.stunnel_get_general = createPluginNotAvailableHandler('stunnel', 'get_general');
    toolHandlers.stunnel_search_certificates = createPluginNotAvailableHandler('stunnel', 'search_certificates');
    toolHandlers.tailscale_get_status = createPluginNotAvailableHandler('tailscale', 'get_status');
    toolHandlers.tailscale_get_general = createPluginNotAvailableHandler('tailscale', 'get_general');
    toolHandlers.tayga_get_status = createPluginNotAvailableHandler('tayga', 'get_status');
    toolHandlers.tayga_get_general = createPluginNotAvailableHandler('tayga', 'get_general');
    toolHandlers.tayga_search_mappings = createPluginNotAvailableHandler('tayga', 'search_mappings');
    toolHandlers.telegraf_get_status = createPluginNotAvailableHandler('telegraf', 'get_status');
    toolHandlers.telegraf_get_general = createPluginNotAvailableHandler('telegraf', 'get_general');
    toolHandlers.telegraf_search_inputs = createPluginNotAvailableHandler('telegraf', 'search_inputs');
    toolHandlers.tftp_get_status = createPluginNotAvailableHandler('tftp', 'get_status');
    toolHandlers.tftp_get_general = createPluginNotAvailableHandler('tftp', 'get_general');
    toolHandlers.tinc_get_status = createPluginNotAvailableHandler('tinc', 'get_status');
    toolHandlers.tinc_get_general = createPluginNotAvailableHandler('tinc', 'get_general');
    toolHandlers.tinc_search_networks = createPluginNotAvailableHandler('tinc', 'search_networks');
    toolHandlers.tor_get_status = createPluginNotAvailableHandler('tor', 'get_status');
    toolHandlers.tor_get_general = createPluginNotAvailableHandler('tor', 'get_general');
    toolHandlers.turnserver_get_status = createPluginNotAvailableHandler('turnserver', 'get_status');
    toolHandlers.turnserver_get_general = createPluginNotAvailableHandler('turnserver', 'get_general');
    toolHandlers.turnserver_search_users = createPluginNotAvailableHandler('turnserver', 'search_users');
    toolHandlers.udpbroadcastrelay_get_status = createPluginNotAvailableHandler('udpbroadcastrelay', 'get_status');
    toolHandlers.udpbroadcastrelay_get_general = createPluginNotAvailableHandler('udpbroadcastrelay', 'get_general');
    toolHandlers.udpbroadcastrelay_search_relays = createPluginNotAvailableHandler(
      'udpbroadcastrelay',
      'search_relays'
    );
    toolHandlers.vnstat_get_status = createPluginNotAvailableHandler('vnstat', 'get_status');
    toolHandlers.vnstat_get_general = createPluginNotAvailableHandler('vnstat', 'get_general');
    toolHandlers.wazuhagent_get_status = createPluginNotAvailableHandler('wazuhagent', 'get_status');
    toolHandlers.wazuhagent_get_general = createPluginNotAvailableHandler('wazuhagent', 'get_general');
    toolHandlers.wazuhagent_search_agents = createPluginNotAvailableHandler('wazuhagent', 'search_agents');
    toolHandlers.wol_get_status = async () => {
      const client = this.ensureClient();
      try {
        // Using direct HTTP client access since WOL might not be in plugins object
        const response = await client.httpClient.get('/api/wol/service/status');
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error getting WOL status: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.wol_wake_device = async (args: any) => {
      const client = this.ensureClient();
      try {
        const { mac, interface: iface = 'lan' } = args || {};
        if (!mac) {
          return {
            content: [
              {
                type: 'text' as const,
                text: 'Error: MAC address is required for Wake on LAN',
              },
            ],
          };
        }
        const response = await client.httpClient.post('/api/wol/service/wake', { mac, interface: iface });
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error waking device: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    };

    toolHandlers.zabbixagent_get_status = createPluginNotAvailableHandler('zabbixagent', 'get_status');
    toolHandlers.zabbixagent_get_general = createPluginNotAvailableHandler('zabbixagent', 'get_general');
    toolHandlers.zabbixproxy_get_status = createPluginNotAvailableHandler('zabbixproxy', 'get_status');
    toolHandlers.zabbixproxy_get_general = createPluginNotAvailableHandler('zabbixproxy', 'get_general');
    toolHandlers.zabbixproxy_search_hosts = createPluginNotAvailableHandler('zabbixproxy', 'search_hosts');
    toolHandlers.zerotier_get_status = createPluginNotAvailableHandler('zerotier', 'get_status');
    toolHandlers.zerotier_get_general = createPluginNotAvailableHandler('zerotier', 'get_general');
    toolHandlers.zerotier_search_networks = createPluginNotAvailableHandler('zerotier', 'search_networks');
    toolHandlers.zerotier_join_network = createPluginNotAvailableHandler('zerotier', 'join_network');
    toolHandlers.zerotier_leave_network = createPluginNotAvailableHandler('zerotier', 'leave_network');
    toolHandlers.zerotier_get_peers = createPluginNotAvailableHandler('zerotier', 'get_peers');
  }

  private setupErrorHandling() {
    this.server.onerror = (error: unknown) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('MCP server running on stdio');
  }
}
