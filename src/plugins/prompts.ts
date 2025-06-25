export const pluginPrompts = {
  web_services_setup: {
    name: 'Web Services Setup Wizard',
    description: 'Configure and deploy web services (Nginx, HAProxy, Caddy)',
    category: 'Plugin Management',
    difficulty: 'intermediate' as const,
    prompt: `Set up and configure web services for high-availability web hosting:

1. **Service Selection and Planning**
   - Assess requirements for web server vs load balancer
   - Choose between Nginx, HAProxy, or Caddy based on needs
   - Plan SSL/TLS certificate management strategy

2. **Nginx Configuration (if selected)**
   - Configure virtual hosts and server blocks
   - Set up upstream servers for load balancing
   - Configure SSL certificates and security headers
   - Optimize performance settings

3. **HAProxy Configuration (if selected)**
   - Configure frontend listeners and backend pools
   - Set up health checks and load balancing algorithms
   - Configure SSL termination and security policies
   - Set up monitoring and statistics

4. **Caddy Configuration (if selected)**
   - Configure automatic HTTPS and certificate management
   - Set up reverse proxy configurations
   - Configure site blocks and routing rules

5. **Testing and Validation**
   - Test service connectivity and performance
   - Validate SSL certificate deployment
   - Verify load balancing and failover behavior

Provide step-by-step configuration guidance with best practices.`,
    requiredTools: [
      'nginx_get_status',
      'nginx_get_config',
      'nginx_get_upstreams',
      'nginx_restart_service',
      'haproxy_get_status',
      'haproxy_get_backends',
      'haproxy_get_frontends',
      'haproxy_restart_service',
      'caddy_get_status',
      'caddy_get_config',
      'caddy_restart_service',
    ],
    estimatedTime: '30-60 minutes',
    expectedOutcome: 'Fully configured and tested web service deployment',
  },

  vpn_extension_deployment: {
    name: 'VPN Extension Deployment',
    description: 'Deploy and configure WireGuard VPN for modern secure access',
    category: 'VPN Extensions',
    difficulty: 'intermediate' as const,
    prompt: `Deploy WireGuard VPN for secure remote access with modern protocols:

1. **WireGuard Planning**
   - Assess network topology and routing requirements
   - Plan IP address allocation and subnetting
   - Define client access policies and restrictions

2. **Server Configuration**
   - Configure WireGuard server instance
   - Generate server keypairs and configure networking
   - Set up routing and firewall rules for VPN traffic

3. **Client Management**
   - Create client configurations with unique keypairs
   - Generate client configuration files
   - Set up client-specific routing and access rules

4. **Security and Monitoring**
   - Configure key rotation policies
   - Set up connection monitoring and logging
   - Implement client access auditing

5. **Integration Testing**
   - Test client connectivity from various networks
   - Verify traffic routing and firewall integration
   - Validate performance and security posture

Provide comprehensive WireGuard deployment with security best practices.`,
    requiredTools: [
      'wireguard_get_status',
      'wireguard_get_config',
      'wireguard_search_clients',
      'wireguard_add_client',
      'wireguard_get_client',
      'firewall_get_rules',
    ],
    estimatedTime: '45-90 minutes',
    expectedOutcome: 'Secure WireGuard VPN deployment with client management',
  },

  dns_services_configuration: {
    name: 'DNS Services Configuration',
    description: 'Configure authoritative DNS services with BIND',
    category: 'DNS Management',
    difficulty: 'advanced' as const,
    prompt: `Configure authoritative DNS services for domain management:

1. **DNS Planning and Design**
   - Plan DNS zone structure and delegation
   - Design record types and naming conventions
   - Plan redundancy and backup strategies

2. **BIND DNS Configuration**
   - Configure authoritative zones and zone files
   - Set up forward and reverse DNS zones
   - Configure zone transfers and security policies

3. **DNS Record Management**
   - Create essential DNS records (A, AAAA, MX, CNAME, TXT)
   - Configure dynamic DNS updates if needed
   - Set up DNS security extensions (DNSSEC) if required

4. **Performance and Security**
   - Configure DNS caching and performance tuning
   - Set up access control lists and security policies
   - Configure logging and monitoring

5. **Testing and Validation**
   - Test DNS resolution from various clients
   - Validate zone transfers and replication
   - Verify security policies and access controls

Provide comprehensive DNS service deployment with security considerations.`,
    requiredTools: [
      'bind_get_status',
      'bind_get_zones',
      'bind_search_zones',
      'bind_get_records',
      'bind_restart_service',
      'bind_reload_config',
    ],
    estimatedTime: '60-120 minutes',
    expectedOutcome: 'Fully configured authoritative DNS service with security',
  },

  security_monitoring_setup: {
    name: 'Security Monitoring Setup',
    description: 'Deploy comprehensive security monitoring with CrowdSec and Netdata',
    category: 'Security Operations',
    difficulty: 'advanced' as const,
    prompt: `Deploy comprehensive security monitoring and threat detection:

1. **CrowdSec Deployment**
   - Configure CrowdSec security engine
   - Set up detection scenarios and parsers
   - Configure collaborative threat intelligence
   - Set up decision engine and bouncer integration

2. **Netdata Monitoring Setup**
   - Configure real-time system monitoring
   - Set up performance metrics collection
   - Configure alerting thresholds and notifications
   - Set up dashboard access and visualization

3. **Integration and Automation**
   - Integrate CrowdSec decisions with firewall rules
   - Set up automated response to security events
   - Configure log aggregation and analysis
   - Set up security incident workflows

4. **Baseline and Tuning**
   - Establish security and performance baselines
   - Tune detection sensitivity and false positive rates
   - Configure custom detection rules for environment
   - Set up reporting and compliance monitoring

5. **Testing and Validation**
   - Test threat detection and response capabilities
   - Validate monitoring coverage and accuracy
   - Test incident response procedures
   - Verify integration with existing security tools

Provide complete security monitoring deployment with threat response.`,
    requiredTools: [
      'crowdsec_get_status',
      'crowdsec_get_decisions',
      'crowdsec_get_alerts',
      'netdata_get_status',
      'netdata_get_metrics',
      'firewall_get_rules',
    ],
    estimatedTime: '90-180 minutes',
    expectedOutcome: 'Comprehensive security monitoring with automated threat response',
  },

  plugin_health_audit: {
    name: 'Plugin Health Audit',
    description: 'Comprehensive health assessment of all installed plugins',
    category: 'Plugin Management',
    difficulty: 'intermediate' as const,
    prompt: `Perform comprehensive health audit of all installed OPNsense plugins:

1. **Plugin Inventory and Status**
   - Identify all installed and enabled plugins
   - Check service status and operational health
   - Verify plugin configurations and dependencies

2. **Performance Assessment**
   - Analyze resource usage by each plugin
   - Check for performance bottlenecks or conflicts
   - Review log files for errors and warnings

3. **Security Review**
   - Audit plugin configurations for security best practices
   - Check for outdated plugins with security vulnerabilities
   - Review access controls and authentication settings

4. **Integration Validation**
   - Verify plugin integration with core OPNsense services
   - Check firewall rule integration and conflicts
   - Validate network configuration and routing

5. **Optimization Recommendations**
   - Identify optimization opportunities
   - Recommend configuration improvements
   - Suggest plugin updates or replacements

Provide detailed plugin health report with actionable recommendations.`,
    requiredTools: [
      'wireguard_get_status',
      'nginx_get_status',
      'haproxy_get_status',
      'bind_get_status',
      'caddy_get_status',
      'crowdsec_get_status',
      'netdata_get_status',
      'netsnmp_get_status',
    ],
    estimatedTime: '30-60 minutes',
    expectedOutcome: 'Comprehensive plugin health report with optimization recommendations',
  },
};
