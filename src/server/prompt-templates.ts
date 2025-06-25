/**
 * Prompt Templates for OPNsense MCP Server
 * Pre-defined prompts for common firewall management scenarios
 */

export interface PromptTemplate {
  name: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prompt: string;
  arguments?: PromptArgument[];
  requiredTools: string[];
  estimatedTime: string;
  prerequisites?: string[];
  expectedOutcome: string;
  troubleshooting?: string[];
  relatedPrompts?: string[];
}

export interface PromptArgument {
  name: string;
  description: string;
  type: 'string' | 'number' | 'boolean' | 'array';
  required: boolean;
  default?: any;
  examples?: string[];
}

export const PROMPT_TEMPLATES: Record<string, PromptTemplate> = {
  system_health_check: {
    name: 'System Health Check',
    description: 'Perform a comprehensive health assessment of the OPNsense system',
    category: 'System Management',
    difficulty: 'beginner',
    prompt: `Perform a comprehensive health check of the OPNsense firewall system. This analysis should include:

1. **System Status Assessment**
   - Current system uptime and stability
   - CPU usage and load averages
   - Memory utilization and swap usage
   - Disk space availability and usage patterns
   - System temperature readings (if available)

2. **Network Interface Analysis**
   - Interface status and configuration
   - Traffic statistics and error rates
   - Interface-specific performance metrics

3. **Service Status Review**
   - Critical service status (firewall, DHCP, DNS, etc.)
   - Any failed or stopped services
   - Service resource usage

4. **Firewall Health**
   - Current firewall rule count and complexity
   - Firewall state table usage
   - Recent firewall logs for anomalies

5. **Security Posture**
   - Firmware update status
   - Configuration backup status
   - User account audit

6. **Performance Metrics**
   - System performance trends
   - Resource bottleneck identification
   - Optimization recommendations

Please provide a detailed report with:
- Current status summary
- Identified issues or concerns
- Recommended actions
- Performance optimization suggestions
- Security recommendations`,
    requiredTools: [
      'get_system_status',
      'get_cpu_usage',
      'get_memory_usage',
      'get_disk_usage',
      'get_interfaces',
      'get_interface_statistics',
      'search_services',
      'get_pf_states',
      'get_firewall_logs',
      'firmware_check_updates',
    ],
    estimatedTime: '5-10 minutes',
    expectedOutcome: 'Comprehensive health report with actionable recommendations',
    troubleshooting: [
      'If system metrics are not available, check service status',
      'High resource usage may indicate the need for system optimization',
      'Network interface errors may require hardware inspection',
    ],
    relatedPrompts: ['performance_optimization', 'security_audit'],
  },

  security_audit: {
    name: 'Security Audit',
    description: 'Conduct a thorough security audit of the firewall configuration',
    category: 'Security',
    difficulty: 'intermediate',
    prompt: `Conduct a comprehensive security audit of the OPNsense firewall. This audit should examine:

1. **Firewall Rule Analysis**
   - Review all firewall rules for security best practices
   - Identify overly permissive rules (any-to-any, broad port ranges)
   - Check for unused or redundant rules
   - Verify rule ordering and priority
   - Assess logging configuration for audit trails

2. **Access Control Review**
   - User account security (admin accounts, permissions)
   - API key usage and permissions
   - Group membership and privilege escalation risks
   - Password policy compliance

3. **Network Configuration Security**
   - Interface security settings
   - VLAN segmentation effectiveness
   - Network service exposure assessment

4. **VPN Security Assessment**
   - VPN configuration security (encryption, authentication)
   - Certificate validity and management
   - User access controls and session management

5. **System Hardening Review**
   - Firmware update status and security patches
   - Service exposure and unnecessary services
   - System configuration security settings

6. **Alias and Object Security**
   - Firewall alias content validation
   - External list security (URLs, feeds)
   - Network object consistency

7. **Logging and Monitoring**
   - Security event logging coverage
   - Log retention and analysis
   - Alerting configuration

Please provide:
- Executive summary of security posture
- Critical security findings
- Medium and low priority recommendations
- Compliance assessment (if applicable)
- Remediation action plan with priorities`,
    requiredTools: [
      'perform_firewall_audit',
      'firewall_get_rules',
      'get_firewall_aliases',
      'search_users',
      'search_api_keys',
      'search_groups',
      'get_vpn_connections',
      'search_openvpn_instances',
      'search_ipsec_connections',
      'firmware_audit',
      'get_firewall_logs',
    ],
    estimatedTime: '15-30 minutes',
    prerequisites: ['Administrative access to OPNsense', 'Understanding of network security principles'],
    expectedOutcome: 'Detailed security audit report with prioritized recommendations',
    troubleshooting: [
      'Missing permissions may limit audit scope',
      'Large rule sets may require pagination',
      'VPN audits require access to certificate stores',
    ],
    relatedPrompts: ['system_health_check', 'compliance_check', 'incident_response'],
  },

  network_troubleshooting: {
    name: 'Network Troubleshooting',
    description: 'Diagnose and resolve network connectivity issues',
    category: 'Network Management',
    difficulty: 'intermediate',
    prompt: `Troubleshoot network connectivity issues on the OPNsense firewall. Follow this systematic approach:

1. **Initial Problem Assessment**
   - Document the specific connectivity issue
   - Identify affected networks, services, or users
   - Determine when the issue started
   - Gather symptoms and error messages

2. **Interface Diagnostics**
   - Check all network interface status and configuration
   - Review interface statistics for errors or anomalies
   - Verify IP addressing and VLAN configuration
   - Test physical connectivity indicators

3. **Routing Analysis**
   - Examine routing table for correct routes
   - Verify default gateway configuration
   - Check for routing loops or conflicts
   - Test route accessibility

4. **Layer 2 Diagnostics**
   - Review ARP table for address resolution issues
   - Check for ARP conflicts or stale entries
   - Verify MAC address learning
   - Analyze switching behavior

5. **Firewall State Analysis**
   - Examine firewall state table for connection tracking
   - Look for blocked connections in firewall logs
   - Check for state table exhaustion
   - Verify NAT translation issues

6. **DNS and Name Resolution**
   - Test DNS resolution functionality
   - Verify DNS server configuration
   - Check for DNS forwarding issues
   - Test both internal and external name resolution

7. **Service Dependencies**
   - Check DHCP service if addressing issues exist
   - Verify time synchronization (NTP)
   - Test related network services

8. **Traffic Flow Analysis**
   - Trace packet flow through the firewall
   - Identify where traffic is being blocked or dropped
   - Check for asymmetric routing issues

Please provide:
- Step-by-step diagnostic results
- Root cause analysis
- Recommended fixes with implementation steps
- Prevention strategies for similar issues`,
    arguments: [
      {
        name: 'affected_networks',
        description: 'Networks or IP ranges experiencing issues',
        type: 'array',
        required: false,
        examples: ['192.168.1.0/24', '10.0.0.0/8'],
      },
      {
        name: 'symptom_description',
        description: 'Description of the connectivity issue',
        type: 'string',
        required: false,
        examples: ['Cannot access internet', 'VPN connections failing', 'Slow network performance'],
      },
    ],
    requiredTools: [
      'get_interfaces',
      'get_interface_statistics',
      'get_system_routes',
      'get_arp_table',
      'get_pf_states',
      'query_pf_states',
      'dns_lookup',
      'get_firewall_logs',
      'get_dhcp_leases',
      'search_services',
    ],
    estimatedTime: '10-20 minutes',
    prerequisites: ['Basic networking knowledge', 'Understanding of firewall concepts'],
    expectedOutcome: 'Identified root cause and resolution steps for connectivity issues',
    troubleshooting: [
      'If interfaces show down, check physical connections',
      'High state table usage may indicate connection issues',
      'DNS failures often indicate upstream connectivity problems',
    ],
    relatedPrompts: ['performance_optimization', 'firewall_rule_review'],
  },

  vpn_setup_wizard: {
    name: 'VPN Setup Wizard',
    description: 'Guide through setting up VPN services (OpenVPN, IPsec, WireGuard)',
    category: 'VPN Management',
    difficulty: 'advanced',
    prompt: `Set up and configure VPN services on OPNsense. This comprehensive setup includes:

1. **VPN Technology Selection**
   - Assess requirements (site-to-site vs remote access)
   - Evaluate VPN technologies (OpenVPN, IPsec, WireGuard)
   - Consider security, performance, and compatibility requirements

2. **Certificate Infrastructure**
   - Review existing certificate authorities
   - Create or import necessary certificates
   - Set up certificate management for VPN users

3. **VPN Server Configuration**
   - Configure VPN server settings based on selected technology
   - Set up network addressing and routing
   - Configure authentication methods
   - Establish encryption and security parameters

4. **Firewall Rule Configuration**
   - Create firewall rules to allow VPN traffic
   - Set up NAT rules if required
   - Configure traffic routing between VPN and local networks

5. **User Management Setup**
   - Create user accounts for VPN access
   - Set up group-based access controls
   - Configure user-specific VPN settings

6. **Client Configuration**
   - Generate client configuration files
   - Provide setup instructions for different platforms
   - Test client connectivity

7. **Security Hardening**
   - Configure security best practices
   - Set up logging and monitoring
   - Implement access controls and restrictions

8. **Testing and Validation**
   - Test VPN connectivity from different locations
   - Verify traffic routing and NAT functionality
   - Validate security controls and access restrictions

Please specify:
- VPN type preference (OpenVPN/IPsec/WireGuard)
- Usage scenario (remote access/site-to-site)
- Number of expected users
- Security requirements`,
    arguments: [
      {
        name: 'vpn_type',
        description: 'Preferred VPN technology',
        type: 'string',
        required: true,
        examples: ['openvpn', 'ipsec', 'wireguard'],
      },
      {
        name: 'usage_scenario',
        description: 'VPN usage scenario',
        type: 'string',
        required: true,
        examples: ['remote_access', 'site_to_site', 'both'],
      },
      {
        name: 'expected_users',
        description: 'Number of expected concurrent users',
        type: 'number',
        required: false,
        default: 10,
      },
    ],
    requiredTools: [
      'search_openvpn_instances',
      'add_openvpn_instance',
      'search_ipsec_connections',
      'add_ipsec_connection',
      'wireguard_get_status',
      'search_users',
      'add_user',
      'search_certificates',
      'firewall_add_rule',
      'firewall_apply',
      'search_groups',
      'add_group',
    ],
    estimatedTime: '30-60 minutes',
    prerequisites: [
      'Administrative access',
      'Understanding of VPN technologies',
      'Network architecture knowledge',
      'Certificate management experience',
    ],
    expectedOutcome: 'Fully configured VPN service with tested connectivity',
    troubleshooting: [
      'Certificate issues are common - verify CA and certificate validity',
      'Firewall rules must allow VPN protocols through WAN interface',
      'Client configuration may require manual adjustment for complex networks',
    ],
    relatedPrompts: ['security_audit', 'user_management', 'firewall_rule_review'],
  },

  backup_and_restore: {
    name: 'Backup and Restore Operations',
    description: 'Manage configuration backups and disaster recovery procedures',
    category: 'System Management',
    difficulty: 'intermediate',
    prompt: `Implement comprehensive backup and restore procedures for OPNsense:

1. **Current Configuration Assessment**
   - Document current system configuration
   - Identify critical configuration elements
   - Review existing backup policies

2. **Backup Creation**
   - Create full system configuration backup
   - Verify backup integrity and completeness
   - Document backup contents and timestamps

3. **Backup Storage Management**
   - Organize backups with descriptive naming
   - Implement retention policies
   - Set up secure backup storage locations

4. **Configuration Documentation**
   - Document current network topology
   - Record firewall rule purposes and requirements
   - Maintain user account and access documentation
   - Document VPN configurations and certificates

5. **Disaster Recovery Planning**
   - Define recovery time objectives (RTO)
   - Establish recovery point objectives (RPO)
   - Create step-by-step recovery procedures
   - Identify critical system dependencies

6. **Backup Testing**
   - Verify backup completeness
   - Test selective restoration procedures
   - Validate configuration consistency

7. **Automation Setup**
   - Configure automated backup schedules
   - Set up backup monitoring and alerting
   - Implement backup verification processes

8. **Recovery Procedures**
   - Document hardware replacement procedures
   - Create network recovery checklists
   - Establish communication protocols during outages

Please provide:
- Current backup status assessment
- Backup and recovery procedure documentation
- Recommended backup schedule
- Disaster recovery action plan`,
    requiredTools: [
      'backup_config',
      'get_system_status',
      'firewall_get_rules',
      'get_firewall_aliases',
      'search_users',
      'get_interfaces',
      'search_openvpn_instances',
      'search_ipsec_connections',
      'search_certificates',
    ],
    estimatedTime: '20-30 minutes',
    prerequisites: ['Administrative access', 'Understanding of backup best practices'],
    expectedOutcome: 'Complete backup strategy with documented recovery procedures',
    relatedPrompts: ['system_health_check', 'disaster_recovery_test'],
  },

  performance_optimization: {
    name: 'Performance Optimization',
    description: 'Analyze and optimize OPNsense performance for better throughput and responsiveness',
    category: 'Performance',
    difficulty: 'advanced',
    prompt: `Analyze and optimize OPNsense performance for maximum efficiency:

1. **Performance Baseline Assessment**
   - Measure current system performance metrics
   - Analyze CPU, memory, and disk utilization patterns
   - Review network interface throughput and efficiency
   - Document current performance bottlenecks

2. **Firewall Rule Optimization**
   - Analyze firewall rule efficiency and order
   - Identify frequently matched rules for optimization
   - Review rule complexity and processing overhead
   - Optimize rule order for better performance

3. **State Table Analysis**
   - Monitor firewall state table usage and efficiency
   - Optimize state table size and timeout settings
   - Analyze connection patterns and resource usage

4. **Network Interface Tuning**
   - Review interface configuration and driver settings
   - Optimize buffer sizes and queue management
   - Analyze traffic patterns and interface utilization

5. **Memory and CPU Optimization**
   - Tune kernel parameters for network performance
   - Optimize memory allocation and caching
   - Review CPU affinity and scheduling settings

6. **Service Configuration Review**
   - Optimize critical service configurations
   - Review resource allocation for services
   - Disable unnecessary services and features

7. **Hardware Assessment**
   - Evaluate hardware capacity and limitations
   - Recommend hardware upgrades if needed
   - Assess network interface capabilities

8. **Monitoring and Alerting Setup**
   - Implement performance monitoring
   - Set up alerting for performance thresholds
   - Create performance trend analysis

Please provide:
- Current performance analysis
- Identified bottlenecks and root causes
- Optimization recommendations with expected impact
- Implementation priority and steps
- Monitoring recommendations`,
    requiredTools: [
      'get_system_status',
      'get_cpu_usage',
      'get_memory_usage',
      'get_interface_statistics',
      'get_firewall_rule_stats',
      'get_pf_states',
      'search_services',
      'firewall_get_rules',
    ],
    estimatedTime: '20-30 minutes',
    prerequisites: [
      'System administration experience',
      'Performance tuning knowledge',
      'Understanding of network optimization',
    ],
    expectedOutcome: 'Performance optimization plan with specific tuning recommendations',
    troubleshooting: [
      'High CPU usage may indicate rule optimization needs',
      'Memory pressure suggests need for hardware upgrade',
      'Network bottlenecks may require interface tuning',
    ],
    relatedPrompts: ['system_health_check', 'capacity_planning'],
  },

  compliance_assessment: {
    name: 'Compliance Assessment',
    description: 'Evaluate OPNsense configuration against security compliance frameworks',
    category: 'Compliance',
    difficulty: 'advanced',
    prompt: `Conduct a compliance assessment of the OPNsense configuration against security frameworks:

1. **Compliance Framework Selection**
   - Identify applicable compliance requirements (PCI-DSS, HIPAA, SOX, etc.)
   - Review specific security controls and requirements
   - Map OPNsense features to compliance controls

2. **Access Control Assessment**
   - Review user authentication and authorization
   - Assess privilege management and separation of duties
   - Evaluate password policies and account management

3. **Network Security Controls**
   - Assess firewall rule compliance with security policies
   - Review network segmentation and access controls
   - Evaluate intrusion detection and prevention capabilities

4. **Audit and Logging Compliance**
   - Review logging configuration and coverage
   - Assess log retention and protection policies
   - Evaluate audit trail completeness and integrity

5. **Data Protection Assessment**
   - Review encryption usage and key management
   - Assess data in transit protection (VPN, TLS)
   - Evaluate backup and recovery security

6. **Change Management Controls**
   - Review configuration change tracking
   - Assess backup and rollback procedures
   - Evaluate change approval processes

7. **Vulnerability Management**
   - Assess patch management and update procedures
   - Review security monitoring capabilities
   - Evaluate incident response procedures

8. **Documentation and Reporting**
   - Review security policy documentation
   - Assess compliance reporting capabilities
   - Evaluate evidence collection and retention

Please specify the compliance framework(s) for assessment and provide:
- Compliance gap analysis
- Risk assessment and mitigation recommendations
- Implementation roadmap for compliance improvements
- Ongoing monitoring and maintenance requirements`,
    arguments: [
      {
        name: 'compliance_framework',
        description: 'Target compliance framework',
        type: 'string',
        required: true,
        examples: ['PCI-DSS', 'HIPAA', 'SOX', 'ISO27001', 'NIST'],
      },
    ],
    requiredTools: [
      'perform_firewall_audit',
      'search_users',
      'search_api_keys',
      'firewall_get_rules',
      'get_firewall_logs',
      'firmware_audit',
      'search_certificates',
      'get_system_status',
    ],
    estimatedTime: '45-90 minutes',
    prerequisites: [
      'Compliance framework knowledge',
      'Security audit experience',
      'Understanding of regulatory requirements',
    ],
    expectedOutcome: 'Comprehensive compliance assessment with gap analysis and remediation plan',
    relatedPrompts: ['security_audit', 'risk_assessment'],
  },

  incident_response: {
    name: 'Security Incident Response',
    description: 'Guide through security incident investigation and response procedures',
    category: 'Security',
    difficulty: 'advanced',
    prompt: `Conduct security incident response and investigation on OPNsense:

1. **Incident Classification and Containment**
   - Assess the nature and severity of the security incident
   - Implement immediate containment measures
   - Document incident timeline and initial observations

2. **Evidence Collection**
   - Gather firewall logs relevant to the incident timeframe
   - Collect system logs and performance data
   - Document current system state and configurations
   - Preserve evidence integrity for potential forensic analysis

3. **Attack Vector Analysis**
   - Analyze firewall logs for suspicious traffic patterns
   - Review blocked and allowed connections during incident window
   - Identify potential entry points and compromised systems
   - Map attacker movement and affected resources

4. **Impact Assessment**
   - Determine scope of compromise and affected systems
   - Assess data exposure and potential data loss
   - Evaluate service disruption and business impact
   - Identify compromised user accounts or credentials

5. **Threat Hunting**
   - Search for indicators of compromise (IOCs)
   - Analyze network traffic patterns for anomalies
   - Review user authentication logs for suspicious activity
   - Check for persistence mechanisms and backdoors

6. **Remediation Actions**
   - Block malicious IP addresses and domains
   - Update firewall rules to prevent similar attacks
   - Reset compromised user credentials
   - Apply security patches and updates

7. **Recovery Procedures**
   - Restore services and normal operations
   - Verify system integrity and security posture
   - Implement additional monitoring and controls
   - Update security policies and procedures

8. **Post-Incident Activities**
   - Document lessons learned and improvements
   - Update incident response procedures
   - Conduct stakeholder briefings and reporting
   - Plan security enhancements and training

Please provide the incident details and timeframe for analysis.`,
    arguments: [
      {
        name: 'incident_timeframe',
        description: 'Time period for incident analysis (start and end)',
        type: 'string',
        required: true,
        examples: ['2024-01-15 09:00 to 2024-01-15 17:00', 'Last 24 hours'],
      },
      {
        name: 'incident_description',
        description: 'Description of the security incident',
        type: 'string',
        required: true,
        examples: ['Suspicious network traffic detected', 'Unauthorized access attempt', 'Malware infection'],
      },
      {
        name: 'affected_systems',
        description: 'Known or suspected affected systems',
        type: 'array',
        required: false,
        examples: ['192.168.1.100', 'mail.company.com'],
      },
    ],
    requiredTools: [
      'get_firewall_logs',
      'get_pf_states',
      'query_pf_states',
      'get_arp_table',
      'search_users',
      'get_firewall_aliases',
      'add_to_alias',
      'firewall_add_rule',
      'firewall_apply',
      'get_system_status',
    ],
    estimatedTime: '30-90 minutes',
    prerequisites: [
      'Incident response training',
      'Security investigation experience',
      'Understanding of attack patterns and indicators',
    ],
    expectedOutcome: 'Complete incident investigation report with remediation actions',
    troubleshooting: [
      'Limited log retention may affect historical analysis',
      'High-volume environments may require filtered searches',
      'Coordination with other security tools may be necessary',
    ],
    relatedPrompts: ['security_audit', 'threat_hunting', 'forensic_analysis'],
  },
};

export const PROMPT_CATEGORIES = {
  'System Management': {
    description: 'System administration and maintenance tasks',
    prompts: ['system_health_check', 'backup_and_restore', 'performance_optimization'],
  },
  Security: {
    description: 'Security assessment and incident response',
    prompts: ['security_audit', 'incident_response', 'compliance_assessment'],
  },
  'Network Management': {
    description: 'Network configuration and troubleshooting',
    prompts: ['network_troubleshooting', 'vpn_setup_wizard'],
  },
  Compliance: {
    description: 'Regulatory compliance and audit support',
    prompts: ['compliance_assessment', 'security_audit'],
  },
  Performance: {
    description: 'Performance monitoring and optimization',
    prompts: ['performance_optimization', 'system_health_check'],
  },
  'VPN Management': {
    description: 'VPN setup and management',
    prompts: ['vpn_setup_wizard'],
  },
};

export const PROMPT_CONTEXTS = {
  emergency: {
    description: 'Emergency response contexts requiring immediate action',
    timeouts: { short: '5m', normal: '10m', extended: '30m' },
    priority: 'high',
    prompts: ['incident_response', 'network_troubleshooting'],
  },
  maintenance: {
    description: 'Scheduled maintenance and routine operations',
    timeouts: { short: '15m', normal: '30m', extended: '60m' },
    priority: 'normal',
    prompts: ['system_health_check', 'backup_and_restore', 'performance_optimization'],
  },
  audit: {
    description: 'Audit and compliance assessment activities',
    timeouts: { short: '30m', normal: '60m', extended: '120m' },
    priority: 'normal',
    prompts: ['security_audit', 'compliance_assessment'],
  },
  planning: {
    description: 'Strategic planning and architecture review',
    timeouts: { short: '45m', normal: '90m', extended: '180m' },
    priority: 'low',
    prompts: ['vpn_setup_wizard', 'performance_optimization'],
  },
};
