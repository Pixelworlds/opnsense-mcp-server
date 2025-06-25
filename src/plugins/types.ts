/**
 * Type definitions for plugin OPNsense tools
 */

import type { ToolHandler, ToolHandlers } from '../server/types.js';

export interface PluginToolHandlers extends ToolHandlers {
  // WireGuard Plugin
  wireguard_get_status: ToolHandler;
  wireguard_get_config: ToolHandler;
  wireguard_search_clients: ToolHandler;
  wireguard_add_client: ToolHandler;
  wireguard_get_client: ToolHandler;
  wireguard_update_client: ToolHandler;
  wireguard_delete_client: ToolHandler;
  wireguard_toggle_client: ToolHandler;

  // Nginx Plugin
  nginx_get_status: ToolHandler;
  nginx_get_upstreams: ToolHandler;
  nginx_search_upstreams: ToolHandler;
  nginx_get_locations: ToolHandler;
  nginx_search_locations: ToolHandler;
  nginx_get_servers: ToolHandler;
  nginx_search_servers: ToolHandler;
  nginx_get_certificates: ToolHandler;
  nginx_restart_service: ToolHandler;
  nginx_reload_config: ToolHandler;
  nginx_get_logs: ToolHandler;
  nginx_get_config: ToolHandler;

  // HAProxy Plugin
  haproxy_get_status: ToolHandler;
  haproxy_get_backends: ToolHandler;
  haproxy_search_backends: ToolHandler;
  haproxy_get_frontends: ToolHandler;
  haproxy_search_frontends: ToolHandler;
  haproxy_get_servers: ToolHandler;
  haproxy_get_stats: ToolHandler;
  haproxy_restart_service: ToolHandler;
  haproxy_reload_config: ToolHandler;
  haproxy_get_logs: ToolHandler;

  // BIND DNS Plugin
  bind_get_status: ToolHandler;
  bind_get_zones: ToolHandler;
  bind_search_zones: ToolHandler;
  bind_get_records: ToolHandler;
  bind_search_records: ToolHandler;
  bind_restart_service: ToolHandler;
  bind_reload_config: ToolHandler;
  bind_get_logs: ToolHandler;

  // Caddy Plugin
  caddy_get_status: ToolHandler;
  caddy_get_config: ToolHandler;
  caddy_get_sites: ToolHandler;
  caddy_restart_service: ToolHandler;
  caddy_reload_config: ToolHandler;
  caddy_get_logs: ToolHandler;

  // CrowdSec Plugin
  crowdsec_get_status: ToolHandler;
  crowdsec_get_decisions: ToolHandler;
  crowdsec_get_alerts: ToolHandler;
  crowdsec_get_bouncers: ToolHandler;
  crowdsec_restart_service: ToolHandler;
  crowdsec_get_logs: ToolHandler;

  // NetSNMP Plugin
  netsnmp_get_status: ToolHandler;
  netsnmp_get_config: ToolHandler;
  netsnmp_restart_service: ToolHandler;
  netsnmp_get_logs: ToolHandler;

  // Netdata Plugin
  netdata_get_status: ToolHandler;
  netdata_get_config: ToolHandler;
  netdata_restart_service: ToolHandler;
  netdata_get_metrics: ToolHandler;

  // Additional Plugin Stubs (when plugins are available)
  acme_get_certificates: ToolHandler;
  collectd_get_metrics: ToolHandler;
  freeradius_get_clients: ToolHandler;
  iperf_run_test: ToolHandler;
  maltrail_get_events: ToolHandler;
  openvpn_export_get_servers: ToolHandler;
  postfix_get_status: ToolHandler;
  redis_get_info: ToolHandler;
  rsyslog_get_logs: ToolHandler;
  zabbix_get_hosts: ToolHandler;
}