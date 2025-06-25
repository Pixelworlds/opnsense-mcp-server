/**
 * Type definitions for core OPNsense tools
 */

import type { ToolHandler, ToolHandlers } from '../server/types.js';

export interface CoreToolHandlers extends ToolHandlers {
  // System Management
  get_system_status: ToolHandler;
  system_reboot: ToolHandler;
  system_halt: ToolHandler;
  dismiss_system_status: ToolHandler;
  get_system_health: ToolHandler;
  get_memory_usage: ToolHandler;
  get_disk_usage: ToolHandler;
  get_system_temperature: ToolHandler;
  get_cpu_usage: ToolHandler;
  get_system_routes: ToolHandler;

  // Firmware & Package Management
  firmware_get_info: ToolHandler;
  firmware_check_updates: ToolHandler;
  firmware_update: ToolHandler;
  firmware_upgrade: ToolHandler;
  firmware_audit: ToolHandler;
  firmware_get_changelog: ToolHandler;
  package_remove: ToolHandler;
  package_reinstall: ToolHandler;
  package_lock: ToolHandler;
  package_unlock: ToolHandler;
  package_get_details: ToolHandler;

  // Firewall Management
  firewall_get_rules: ToolHandler;
  firewall_add_rule: ToolHandler;
  firewall_delete_rule: ToolHandler;
  firewall_toggle_rule: ToolHandler;
  firewall_apply: ToolHandler;
  firewall_savepoint: ToolHandler;
  firewall_revert: ToolHandler;
  get_firewall_rule: ToolHandler;
  update_firewall_rule: ToolHandler;
  firewall_move_rule: ToolHandler;
  get_firewall_rule_stats: ToolHandler;
  get_firewall_aliases: ToolHandler;
  add_firewall_alias: ToolHandler;
  get_firewall_alias: ToolHandler;
  update_firewall_alias: ToolHandler;
  delete_firewall_alias: ToolHandler;
  toggle_firewall_alias: ToolHandler;
  export_firewall_aliases: ToolHandler;
  import_firewall_aliases: ToolHandler;
  add_to_alias: ToolHandler;
  delete_from_alias: ToolHandler;
  get_alias_table_size: ToolHandler;
  list_alias_contents: ToolHandler;
  flush_alias: ToolHandler;
  get_firewall_logs: ToolHandler;
  perform_firewall_audit: ToolHandler;

  // Network Operations
  get_interfaces: ToolHandler;
  get_interface_details: ToolHandler;
  reload_interface: ToolHandler;
  get_interface_statistics: ToolHandler;
  search_vlans: ToolHandler;
  add_vlan: ToolHandler;
  get_vlan: ToolHandler;
  update_vlan: ToolHandler;
  delete_vlan: ToolHandler;
  reconfigure_vlans: ToolHandler;
  get_dhcp_leases: ToolHandler;
  get_dhcp_config: ToolHandler;
  set_dhcp_config: ToolHandler;
  search_dhcp_leases: ToolHandler;
  search_dhcp_reservations: ToolHandler;
  add_dhcp_reservation: ToolHandler;
  get_dhcp_reservation: ToolHandler;
  update_dhcp_reservation: ToolHandler;
  delete_dhcp_reservation: ToolHandler;
  toggle_dhcp_reservation: ToolHandler;
  start_dhcp_service: ToolHandler;
  stop_dhcp_service: ToolHandler;
  restart_dhcp_service: ToolHandler;
  reconfigure_dhcp: ToolHandler;
  get_dhcp_status: ToolHandler;
  get_arp_table: ToolHandler;
  search_arp_table: ToolHandler;
  flush_arp_table: ToolHandler;
  get_pf_states: ToolHandler;
  query_pf_states: ToolHandler;
  flush_firewall_states: ToolHandler;
  kill_firewall_states: ToolHandler;
  dns_lookup: ToolHandler;

  // VPN Management
  get_openvpn_instances: ToolHandler;
  search_openvpn_instances: ToolHandler;
  add_openvpn_instance: ToolHandler;
  update_openvpn_instance: ToolHandler;
  delete_openvpn_instance: ToolHandler;
  toggle_openvpn_instance: ToolHandler;
  start_openvpn_service: ToolHandler;
  stop_openvpn_service: ToolHandler;
  restart_openvpn_service: ToolHandler;
  search_openvpn_sessions: ToolHandler;
  kill_openvpn_session: ToolHandler;
  ipsec_is_enabled: ToolHandler;
  toggle_ipsec_service: ToolHandler;
  search_ipsec_connections: ToolHandler;
  add_ipsec_connection: ToolHandler;
  get_ipsec_connection: ToolHandler;
  update_ipsec_connection: ToolHandler;
  delete_ipsec_connection: ToolHandler;
  toggle_ipsec_connection: ToolHandler;
  start_ipsec: ToolHandler;
  stop_ipsec: ToolHandler;
  restart_ipsec: ToolHandler;
  reconfigure_ipsec: ToolHandler;
  search_ipsec_sessions: ToolHandler;
  connect_ipsec_session: ToolHandler;
  disconnect_ipsec_session: ToolHandler;

  // User & Security Management
  search_users: ToolHandler;
  add_user: ToolHandler;
  get_user: ToolHandler;
  update_user: ToolHandler;
  delete_user: ToolHandler;
  search_groups: ToolHandler;
  add_group: ToolHandler;
  get_group: ToolHandler;
  update_group: ToolHandler;
  delete_group: ToolHandler;
  add_api_key: ToolHandler;
  delete_api_key: ToolHandler;
  search_api_keys: ToolHandler;
  search_certificates: ToolHandler;
  add_certificate: ToolHandler;
  get_certificate: ToolHandler;
  delete_certificate: ToolHandler;
  search_certificate_authorities: ToolHandler;
  get_certificate_authority: ToolHandler;
  delete_certificate_authority: ToolHandler;

  // Service Management
  search_services: ToolHandler;
  start_service: ToolHandler;
  stop_service: ToolHandler;
  restart_service: ToolHandler;
  list_plugins: ToolHandler;
  install_plugin: ToolHandler;

  // Utility Tools
  configure_opnsense_connection: ToolHandler;
  get_api_endpoints: ToolHandler;
  exec_api_call: ToolHandler;
  backup_config: ToolHandler;
  get_vpn_connections: ToolHandler;
}