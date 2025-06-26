import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import { defineConfig } from 'rollup';

export default defineConfig([
  // Main executable build - single index.js file
  {
    input: 'src/server/index.ts',
    plugins: [
      replace({
        preventAssignment: true,
        'import.meta.url': JSON.stringify('file://'),
        'BUILD_CONFIG_PLACEHOLDER': JSON.stringify({
          "core": {
            "description": "Core OPNsense modules - always included",
            "modules": {
              "auth": true, "backup": true, "cron": true, "dashboard": true, "dhcp": true,
              "diagnostics": true, "firewall": true, "firmware": true, "hasync": true,
              "interfaces": true, "ipsec": true, "ldap": true, "log": true, "menu": true,
              "nat": true, "openvpn": true, "routes": true, "services": true, "settings": true,
              "snapshots": true, "system": true, "tunables": true, "trust": true, "users": true,
              "virtualip": true, "webproxy": true
            }
          },
          "plugins": {
            "description": "Plugin modules - can be selectively included",
            "includeAll": true,
            "modules": {
              "apcupsd": true, "arpscanner": true, "backupfile": true, "bind": true, "bsdinstaller": true,
              "caddy": true, "clamav": true, "collectd": true, "crowdsec": true, "custom_opn_reports": true,
              "ddclient": true, "dns": true, "dnsmasq": true, "etpro_telemetry": true, "firewall": true,
              "frr": true, "ftp": true, "git_backup": true, "gridscale": true, "haproxy": true,
              "hello": true, "ifopn": true, "isc_dhcp": true, "kea": true, "kea_ctrl_agent": true,
              "kea_dhcp4": true, "kea_dhcp6": true, "lldpd": true, "loopback": true, "maltrail": true,
              "mdns_repeater": true, "miniupnpd": true, "monit": true, "mpd": true, "munin": true,
              "net_snmp": true, "netdata": true, "netflow": true, "nginx": true, "nrpe": true,
              "ntopng": true, "nut": true, "openconnect": true, "opendkim": true, "postfix": true,
              "pppoe": true, "pptp": true, "proxy": true, "proxysso": true, "qemu": true,
              "quagga": true, "realtek": true, "redis": true, "rfc2136": true, "routed": true,
              "siproxd": true, "smart": true, "sslh": true, "stunnel": true, "syslog": true,
              "tailscale": true, "tayga": true, "telegraf": true, "tinc": true, "tor": true, "udpbroadcastrelay": true,
              "unbound": true, "upnp": true, "vnstat": true, "webfilter": true, "wg_wireguard": true,
              "wol": true, "xen": true, "zerotier": true, "zfs": true
            }
          }
        }),
      }),
      json(),
      nodeResolve({
        preferBuiltins: true,
        exportConditions: ['node'],
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationMap: false,
        sourceMap: false,
        compilerOptions: {
          target: 'ES2022',
          lib: ['ES2022', 'ES2019', 'ES2017', 'ES2015', 'DOM'],
          types: ['node'],
          moduleResolution: 'bundler',
          resolveJsonModule: true,
          skipLibCheck: true,
          noEmit: false,
          declaration: false,
        },
      }),
    ],
    external: [
      // Bundle all dependencies for standalone execution
    ],
    output: {
      file: 'dist/index.js',
      format: 'es',
      sourcemap: false,
      banner: '#!/usr/bin/env node',
    },
  },
]);
