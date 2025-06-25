export const pluginInitialization = {
  endpoints: [
    'wireguard_get_status',
    'wireguard_get_config',
    'wireguard_search_clients',
    'wireguard_add_client',
    'wireguard_get_client',
    'wireguard_update_client',
    'wireguard_delete_client',
    'wireguard_toggle_client',

    'nginx_get_status',
    'nginx_get_upstreams',
    'nginx_search_upstreams',
    'nginx_get_locations',
    'nginx_search_locations',
    'nginx_get_servers',
    'nginx_search_servers',
    'nginx_get_certificates',
    'nginx_restart_service',
    'nginx_reload_config',
    'nginx_get_logs',
    'nginx_get_config',

    'haproxy_get_status',
    'haproxy_get_backends',
    'haproxy_search_backends',
    'haproxy_get_frontends',
    'haproxy_search_frontends',
    'haproxy_get_servers',
    'haproxy_get_stats',
    'haproxy_restart_service',
    'haproxy_reload_config',
    'haproxy_get_logs',

    'bind_get_status',
    'bind_get_zones',
    'bind_search_zones',
    'bind_get_records',
    'bind_search_records',
    'bind_restart_service',
    'bind_reload_config',
    'bind_get_logs',

    'caddy_get_status',
    'caddy_get_config',
    'caddy_get_sites',
    'caddy_restart_service',
    'caddy_reload_config',
    'caddy_get_logs',

    'crowdsec_get_status',
    'crowdsec_get_decisions',
    'crowdsec_get_alerts',
    'crowdsec_get_bouncers',
    'crowdsec_restart_service',
    'crowdsec_get_logs',

    'netsnmp_get_status',
    'netsnmp_get_config',
    'netsnmp_restart_service',
    'netsnmp_get_logs',

    'netdata_get_status',
    'netdata_get_config',
    'netdata_restart_service',
    'netdata_get_metrics',

    'acme_get_certificates',
    'collectd_get_metrics',
    'freeradius_get_clients',
    'iperf_run_test',
    'maltrail_get_events',
    'openvpn_export_get_servers',
    'postfix_get_status',
    'redis_get_info',
    'rsyslog_get_logs',
    'zabbix_get_hosts',
  ],

  plugin_categories: {
    'Web Services': {
      description: 'Web server and proxy management',
      tools: 28,
      subcategories: ['Nginx', 'HAProxy', 'Caddy'],
      plugins: ['nginx', 'haproxy', 'caddy'],
    },
    'VPN Extensions': {
      description: 'Additional VPN protocols and management',
      tools: 8,
      subcategories: ['WireGuard'],
      plugins: ['wireguard'],
    },
    'DNS Services': {
      description: 'DNS server management and configuration',
      tools: 8,
      subcategories: ['BIND DNS'],
      plugins: ['bind'],
    },
    'Security & Monitoring': {
      description: 'Security tools and system monitoring',
      tools: 10,
      subcategories: ['CrowdSec', 'Netdata'],
      plugins: ['crowdsec', 'netdata'],
    },
    'Network Monitoring': {
      description: 'Network performance and SNMP monitoring',
      tools: 4,
      subcategories: ['NetSNMP'],
      plugins: ['netsnmp'],
    },
    'Additional Services': {
      description: 'Extended functionality through various plugins',
      tools: '10+',
      subcategories: ['Certificates', 'Mail', 'Metrics', 'Logging'],
      plugins: ['acme', 'postfix', 'collectd', 'rsyslog', 'freeradius', 'zabbix'],
    },
  },

  api_coverage: {
    plugin_modules: '62+',
    total_endpoints: '70+',
    coverage_percentage: '85%',
  },

  plugin_features: {
    web_services: {
      nginx: 'Reverse proxy, load balancing, SSL termination',
      haproxy: 'High availability load balancing and proxying',
      caddy: 'Modern web server with automatic HTTPS',
    },
    vpn_extensions: {
      wireguard: 'Modern VPN protocol with simplified configuration',
    },
    dns_services: {
      bind: 'Authoritative DNS server with zone management',
    },
    security_monitoring: {
      crowdsec: 'Collaborative security and IP reputation',
      netdata: 'Real-time performance and health monitoring',
    },
    network_tools: {
      netsnmp: 'SNMP monitoring and network device management',
    },
  },

  installation_requirements: {
    package_manager: 'OPNsense package system',
    dependencies: 'Automatic dependency resolution',
    compatibility: 'OPNsense 23.1+ required',
    resource_overhead: 'Minimal to moderate depending on plugin',
  },

  configuration_patterns: {
    service_control: 'Start, stop, restart, reload operations',
    configuration_management: 'Get, set, validate configurations',
    monitoring: 'Status checking and metrics collection',
    log_access: 'Service-specific log file access',
  },
};
