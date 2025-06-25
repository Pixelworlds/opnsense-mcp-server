/**
 * Core OPNsense Prompt Templates
 * Pre-defined prompts for core firewall management scenarios
 */

export const corePrompts = {
  // System Management Prompts
  system_health_check: {
    name: 'System Health Check',
    description: 'Perform a comprehensive health assessment of the core OPNsense system',
    category: 'System Management',
    difficulty: 'beginner' as const,
    prompt: `Perform a comprehensive health check of the OPNsense firewall system. This analysis should include:

1. **System Status Assessment**
   - Current system uptime and stability
   - CPU usage and load averages
   - Memory utilization and swap usage
   - Disk space availability and usage patterns
   - System temperature readings (if available)

2. **Core Service Status**
   - Essential service operational status
   - Service dependency verification
   - Process monitoring and resource usage

3. **Network Interface Health**
   - Interface status and configuration
   - Traffic statistics and error rates
   - Interface-specific performance metrics

4. **Firmware and Package Status**
   - Current firmware version and update availability
   - Package integrity verification
   - Security update requirements

Provide a detailed health report with recommendations for any issues discovered.`,
    requiredTools: [
      'get_system_status',
      'get_system_health',
      'get_memory_usage',
      'get_disk_usage',
      'get_cpu_usage',
      'get_system_temperature',
      'search_services',
      'get_interfaces',
      'firmware_get_info',
    ],
    estimatedTime: '5-10 minutes',
    expectedOutcome: 'Comprehensive system health report with actionable recommendations',
  },

  firewall_security_audit: {
    name: 'Firewall Security Audit',
    description: 'Conduct a thorough security audit of firewall configuration',
    category: 'Security Operations',
    difficulty: 'intermediate' as const,
    prompt: `Conduct a comprehensive security audit of the OPNsense firewall configuration:

1. **Rule Analysis**
   - Review all firewall rules for security best practices
   - Identify overly permissive rules
   - Check for unused or redundant rules
   - Verify rule ordering and priority

2. **Alias Configuration Review**
   - Examine firewall aliases for proper categorization
   - Verify alias contents and validity
   - Check for orphaned or unused aliases

3. **Access Control Assessment**
   - Review user accounts and group permissions
   - Audit API key usage and permissions
   - Certificate validity and expiration checking

4. **VPN Security Review**
   - OpenVPN configuration security assessment
   - IPsec tunnel configuration review
   - VPN user access patterns analysis

Create a detailed security audit report with prioritized recommendations.`,
    requiredTools: [
      'firewall_get_rules',
      'get_firewall_aliases',
      'perform_firewall_audit',
      'search_users',
      'search_groups',
      'search_api_keys',
      'search_certificates',
      'get_openvpn_instances',
      'search_ipsec_connections',
    ],
    estimatedTime: '15-30 minutes',
    expectedOutcome: 'Detailed security audit report with prioritized action items',
  },

  network_troubleshooting: {
    name: 'Network Troubleshooting',
    description: 'Diagnose and resolve network connectivity issues',
    category: 'Network Management',
    difficulty: 'intermediate' as const,
    prompt: `Perform comprehensive network troubleshooting to identify and resolve connectivity issues:

1. **Interface Analysis**
   - Check all network interface status and configuration
   - Analyze interface statistics for errors or anomalies
   - Verify VLAN configuration if applicable

2. **DHCP Service Verification**
   - Confirm DHCP service status and configuration
   - Review active leases and reservations
   - Check for IP address conflicts

3. **Network State Inspection**
   - Examine ARP tables for network mapping
   - Review packet filter states
   - Analyze firewall state tables

4. **Connectivity Testing**
   - Perform DNS lookups for external connectivity
   - Test routing table functionality
   - Verify gateway accessibility

Provide a detailed troubleshooting report with step-by-step resolution guidance.`,
    requiredTools: [
      'get_interfaces',
      'get_interface_details',
      'get_interface_statistics',
      'search_vlans',
      'get_dhcp_status',
      'get_dhcp_leases',
      'search_dhcp_reservations',
      'get_arp_table',
      'get_pf_states',
      'dns_lookup',
      'get_system_routes',
    ],
    estimatedTime: '10-20 minutes',
    expectedOutcome: 'Comprehensive network analysis with resolution steps',
  },

  vpn_deployment_wizard: {
    name: 'VPN Deployment Wizard',
    description: 'Guide through complete VPN setup and configuration',
    category: 'VPN Configuration',
    difficulty: 'advanced' as const,
    prompt: `Guide through a complete VPN deployment process for secure remote access:

1. **Requirements Assessment**
   - Determine VPN type (OpenVPN vs IPsec) based on needs
   - Assess user capacity and authentication requirements
   - Define network segmentation and access policies

2. **Certificate Infrastructure**
   - Review existing certificate authorities
   - Generate or import required certificates
   - Configure certificate-based authentication

3. **VPN Server Configuration**
   - Configure VPN server instances with optimal settings
   - Set up proper encryption and authentication parameters
   - Define client access rules and network policies

4. **Testing and Validation**
   - Test VPN connectivity and performance
   - Verify client authentication mechanisms
   - Validate firewall rule integration

Provide step-by-step deployment guidance with security best practices.`,
    requiredTools: [
      'search_certificate_authorities',
      'search_certificates',
      'add_certificate',
      'get_openvpn_instances',
      'add_openvpn_instance',
      'search_ipsec_connections',
      'add_ipsec_connection',
      'firewall_get_rules',
      'search_users',
    ],
    estimatedTime: '30-60 minutes',
    expectedOutcome: 'Fully configured and tested VPN solution',
  },

  configuration_backup_restore: {
    name: 'Configuration Backup & Restore',
    description: 'Create comprehensive configuration backups with restore procedures',
    category: 'System Management',
    difficulty: 'beginner' as const,
    prompt: `Implement a comprehensive configuration backup and restore strategy:

1. **Backup Creation**
   - Generate complete system configuration backup
   - Create firewall rule and alias backups
   - Export user accounts and certificate configurations
   - Document current system state

2. **Backup Verification**
   - Verify backup integrity and completeness
   - Test backup file accessibility
   - Validate backup content structure

3. **Restore Procedures**
   - Document step-by-step restore procedures
   - Identify critical configuration dependencies
   - Create restore point validation checklist

4. **Automation Recommendations**
   - Suggest automated backup scheduling
   - Recommend backup retention policies
   - Provide monitoring and alerting guidance

Create a comprehensive backup and restore plan with documented procedures.`,
    requiredTools: [
      'backup_config',
      'firewall_savepoint',
      'export_firewall_aliases',
      'search_users',
      'search_certificates',
      'get_system_status',
    ],
    estimatedTime: '15-25 minutes',
    expectedOutcome: 'Complete backup strategy with documented restore procedures',
  },

  performance_optimization: {
    name: 'Performance Optimization',
    description: 'Analyze and optimize OPNsense system performance',
    category: 'System Management',
    difficulty: 'advanced' as const,
    prompt: `Perform comprehensive performance analysis and optimization:

1. **Resource Utilization Analysis**
   - Monitor CPU usage patterns and load distribution
   - Analyze memory consumption and optimization opportunities
   - Review disk I/O performance and storage utilization
   - Check system temperature and thermal management

2. **Network Performance Assessment**
   - Analyze interface throughput and error rates
   - Review firewall rule processing efficiency
   - Examine state table utilization and optimization
   - Assess DHCP service performance

3. **Service Optimization**
   - Review running services for resource optimization
   - Identify unnecessary services and processes
   - Optimize VPN service configurations
   - Tune logging and monitoring overhead

4. **Configuration Recommendations**
   - Suggest firewall rule optimizations
   - Recommend hardware upgrade paths if needed
   - Provide configuration tuning recommendations
   - Create performance monitoring baseline

Deliver detailed performance analysis with actionable optimization recommendations.`,
    requiredTools: [
      'get_cpu_usage',
      'get_memory_usage',
      'get_disk_usage',
      'get_system_temperature',
      'get_interface_statistics',
      'get_firewall_rule_stats',
      'get_pf_states',
      'search_services',
      'get_dhcp_status',
      'get_openvpn_instances',
      'search_ipsec_connections',
    ],
    estimatedTime: '20-40 minutes',
    expectedOutcome: 'Comprehensive performance optimization plan with specific recommendations',
  },
};
