#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { OPNsenseClient } from '@richard-stovall/opnsense-typescript-client';

// Embedded modular tool definitions
const TOOLS = [
  {
    "name": "core_manage",
    "description": "Core system management - 46 available methods including: backupBackups, backupDeleteBackup, backupDiff, backupDownload, backupProviders...",
    "module": "core",
    "methods": [
      "backupBackups",
      "backupDeleteBackup",
      "backupDiff",
      "backupDownload",
      "backupProviders",
      "backupRevertBackup",
      "dashboardGetDashboard",
      "dashboardPicture",
      "dashboardProductInfoFeed",
      "dashboardRestoreDefaults",
      "dashboardSaveWidgets",
      "hasyncGet",
      "hasyncReconfigure",
      "hasyncSet",
      "hasyncStatusRemoteService",
      "hasyncStatusRestart",
      "hasyncStatusRestartAll",
      "hasyncStatusServices",
      "hasyncStatusStart",
      "hasyncStatusStop",
      "hasyncStatusVersion",
      "menuSearch",
      "menuTree",
      "serviceRestart",
      "serviceSearch",
      "serviceStart",
      "serviceStop",
      "snapshotsActivate",
      "snapshotsAdd",
      "snapshotsDel",
      "snapshotsGet",
      "snapshotsIsSupported",
      "snapshotsSearch",
      "snapshotsSet",
      "systemDismissStatus",
      "systemHalt",
      "systemReboot",
      "systemStatus",
      "tunablesAddItem",
      "tunablesDelItem",
      "tunablesGet",
      "tunablesGetItem",
      "tunablesReconfigure",
      "tunablesReset",
      "tunablesSet",
      "tunablesSetItem"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "backupBackups",
            "backupDeleteBackup",
            "backupDiff",
            "backupDownload",
            "backupProviders",
            "backupRevertBackup",
            "dashboardGetDashboard",
            "dashboardPicture",
            "dashboardProductInfoFeed",
            "dashboardRestoreDefaults",
            "dashboardSaveWidgets",
            "hasyncGet",
            "hasyncReconfigure",
            "hasyncSet",
            "hasyncStatusRemoteService",
            "hasyncStatusRestart",
            "hasyncStatusRestartAll",
            "hasyncStatusServices",
            "hasyncStatusStart",
            "hasyncStatusStop",
            "hasyncStatusVersion",
            "menuSearch",
            "menuTree",
            "serviceRestart",
            "serviceSearch",
            "serviceStart",
            "serviceStop",
            "snapshotsActivate",
            "snapshotsAdd",
            "snapshotsDel",
            "snapshotsGet",
            "snapshotsIsSupported",
            "snapshotsSearch",
            "snapshotsSet",
            "systemDismissStatus",
            "systemHalt",
            "systemReboot",
            "systemStatus",
            "tunablesAddItem",
            "tunablesDelItem",
            "tunablesGet",
            "tunablesGetItem",
            "tunablesReconfigure",
            "tunablesReset",
            "tunablesSet",
            "tunablesSetItem"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "firewall_manage",
    "description": "Firewall management - 67 available methods including: aliasAddItem, aliasDelItem, aliasGet, aliasGetAliasUUID, aliasGetGeoIP...",
    "module": "firewall",
    "methods": [
      "aliasAddItem",
      "aliasDelItem",
      "aliasGet",
      "aliasGetAliasUUID",
      "aliasGetGeoIP",
      "aliasGetItem",
      "aliasGetTableSize",
      "aliasImport",
      "aliasListCategories",
      "aliasListCountries",
      "aliasListNetworkAliases",
      "aliasListUserGroups",
      "aliasReconfigure",
      "aliasSet",
      "aliasSetItem",
      "aliasToggleItem",
      "aliasUtilAdd",
      "aliasUtilAliases",
      "aliasUtilDelete",
      "aliasUtilFindReferences",
      "aliasUtilFlush",
      "aliasUtilList",
      "aliasUtilUpdateBogons",
      "categoryAddItem",
      "categoryDelItem",
      "categoryGet",
      "categoryGetItem",
      "categorySet",
      "categorySetItem",
      "filterBaseApply",
      "filterBaseCancelRollback",
      "filterBaseGet",
      "filterBaseListCategories",
      "filterBaseListNetworkSelectOptions",
      "filterBaseRevert",
      "filterBaseSavepoint",
      "filterBaseSet",
      "filterAddRule",
      "filterDelRule",
      "filterGetInterfaceList",
      "filterGetRule",
      "filterMoveRuleBefore",
      "filterSetRule",
      "filterToggleRule",
      "filterUtilRuleStats",
      "groupAddItem",
      "groupDelItem",
      "groupGet",
      "groupGetItem",
      "groupReconfigure",
      "groupSet",
      "groupSetItem",
      "nptAddRule",
      "nptDelRule",
      "nptGetRule",
      "nptSetRule",
      "nptToggleRule",
      "oneToOneAddRule",
      "oneToOneDelRule",
      "oneToOneGetRule",
      "oneToOneSetRule",
      "oneToOneToggleRule",
      "sourceNatAddRule",
      "sourceNatDelRule",
      "sourceNatGetRule",
      "sourceNatSetRule",
      "sourceNatToggleRule"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "aliasAddItem",
            "aliasDelItem",
            "aliasGet",
            "aliasGetAliasUUID",
            "aliasGetGeoIP",
            "aliasGetItem",
            "aliasGetTableSize",
            "aliasImport",
            "aliasListCategories",
            "aliasListCountries",
            "aliasListNetworkAliases",
            "aliasListUserGroups",
            "aliasReconfigure",
            "aliasSet",
            "aliasSetItem",
            "aliasToggleItem",
            "aliasUtilAdd",
            "aliasUtilAliases",
            "aliasUtilDelete",
            "aliasUtilFindReferences",
            "aliasUtilFlush",
            "aliasUtilList",
            "aliasUtilUpdateBogons",
            "categoryAddItem",
            "categoryDelItem",
            "categoryGet",
            "categoryGetItem",
            "categorySet",
            "categorySetItem",
            "filterBaseApply",
            "filterBaseCancelRollback",
            "filterBaseGet",
            "filterBaseListCategories",
            "filterBaseListNetworkSelectOptions",
            "filterBaseRevert",
            "filterBaseSavepoint",
            "filterBaseSet",
            "filterAddRule",
            "filterDelRule",
            "filterGetInterfaceList",
            "filterGetRule",
            "filterMoveRuleBefore",
            "filterSetRule",
            "filterToggleRule",
            "filterUtilRuleStats",
            "groupAddItem",
            "groupDelItem",
            "groupGet",
            "groupGetItem",
            "groupReconfigure",
            "groupSet",
            "groupSetItem",
            "nptAddRule",
            "nptDelRule",
            "nptGetRule",
            "nptSetRule",
            "nptToggleRule",
            "oneToOneAddRule",
            "oneToOneDelRule",
            "oneToOneGetRule",
            "oneToOneSetRule",
            "oneToOneToggleRule",
            "sourceNatAddRule",
            "sourceNatDelRule",
            "sourceNatGetRule",
            "sourceNatSetRule",
            "sourceNatToggleRule"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "auth_manage",
    "description": "Authentication management - 19 available methods including: groupAdd, groupDel, groupGet, groupSet, privGet...",
    "module": "auth",
    "methods": [
      "groupAdd",
      "groupDel",
      "groupGet",
      "groupSet",
      "privGet",
      "privGetItem",
      "privSearch",
      "privSet",
      "privSetItem",
      "userAdd",
      "userAddApiKey",
      "userDel",
      "userDelApiKey",
      "userDownload",
      "userGet",
      "userNewOtpSeed",
      "userSearchApiKey",
      "userSet",
      "userUpload"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "groupAdd",
            "groupDel",
            "groupGet",
            "groupSet",
            "privGet",
            "privGetItem",
            "privSearch",
            "privSet",
            "privSetItem",
            "userAdd",
            "userAddApiKey",
            "userDel",
            "userDelApiKey",
            "userDownload",
            "userGet",
            "userNewOtpSeed",
            "userSearchApiKey",
            "userSet",
            "userUpload"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "interfaces_manage",
    "description": "Network interfaces management - 63 available methods including: gifSettingsAddItem, gifSettingsDelItem, gifSettingsGet, gifSettingsGetIfOptions, gifSettingsGetItem...",
    "module": "interfaces",
    "methods": [
      "gifSettingsAddItem",
      "gifSettingsDelItem",
      "gifSettingsGet",
      "gifSettingsGetIfOptions",
      "gifSettingsGetItem",
      "gifSettingsReconfigure",
      "gifSettingsSet",
      "gifSettingsSetItem",
      "greSettingsAddItem",
      "greSettingsDelItem",
      "greSettingsGet",
      "greSettingsGetIfOptions",
      "greSettingsGetItem",
      "greSettingsReconfigure",
      "greSettingsSet",
      "greSettingsSetItem",
      "laggSettingsAddItem",
      "laggSettingsDelItem",
      "laggSettingsGet",
      "laggSettingsGetItem",
      "laggSettingsReconfigure",
      "laggSettingsSet",
      "laggSettingsSetItem",
      "loopbackSettingsAddItem",
      "loopbackSettingsDelItem",
      "loopbackSettingsGet",
      "loopbackSettingsGetItem",
      "loopbackSettingsReconfigure",
      "loopbackSettingsSet",
      "loopbackSettingsSetItem",
      "neighborSettingsAddItem",
      "neighborSettingsDelItem",
      "neighborSettingsGet",
      "neighborSettingsGetItem",
      "neighborSettingsReconfigure",
      "neighborSettingsSet",
      "neighborSettingsSetItem",
      "overviewExport",
      "overviewGetInterface",
      "overviewInterfacesInfo",
      "overviewReloadInterface",
      "vipSettingsAddItem",
      "vipSettingsDelItem",
      "vipSettingsGet",
      "vipSettingsGetItem",
      "vipSettingsGetUnusedVhid",
      "vipSettingsReconfigure",
      "vipSettingsSet",
      "vipSettingsSetItem",
      "vlanSettingsAddItem",
      "vlanSettingsDelItem",
      "vlanSettingsGet",
      "vlanSettingsGetItem",
      "vlanSettingsReconfigure",
      "vlanSettingsSet",
      "vlanSettingsSetItem",
      "vxlanSettingsAddItem",
      "vxlanSettingsDelItem",
      "vxlanSettingsGet",
      "vxlanSettingsGetItem",
      "vxlanSettingsReconfigure",
      "vxlanSettingsSet",
      "vxlanSettingsSetItem"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "gifSettingsAddItem",
            "gifSettingsDelItem",
            "gifSettingsGet",
            "gifSettingsGetIfOptions",
            "gifSettingsGetItem",
            "gifSettingsReconfigure",
            "gifSettingsSet",
            "gifSettingsSetItem",
            "greSettingsAddItem",
            "greSettingsDelItem",
            "greSettingsGet",
            "greSettingsGetIfOptions",
            "greSettingsGetItem",
            "greSettingsReconfigure",
            "greSettingsSet",
            "greSettingsSetItem",
            "laggSettingsAddItem",
            "laggSettingsDelItem",
            "laggSettingsGet",
            "laggSettingsGetItem",
            "laggSettingsReconfigure",
            "laggSettingsSet",
            "laggSettingsSetItem",
            "loopbackSettingsAddItem",
            "loopbackSettingsDelItem",
            "loopbackSettingsGet",
            "loopbackSettingsGetItem",
            "loopbackSettingsReconfigure",
            "loopbackSettingsSet",
            "loopbackSettingsSetItem",
            "neighborSettingsAddItem",
            "neighborSettingsDelItem",
            "neighborSettingsGet",
            "neighborSettingsGetItem",
            "neighborSettingsReconfigure",
            "neighborSettingsSet",
            "neighborSettingsSetItem",
            "overviewExport",
            "overviewGetInterface",
            "overviewInterfacesInfo",
            "overviewReloadInterface",
            "vipSettingsAddItem",
            "vipSettingsDelItem",
            "vipSettingsGet",
            "vipSettingsGetItem",
            "vipSettingsGetUnusedVhid",
            "vipSettingsReconfigure",
            "vipSettingsSet",
            "vipSettingsSetItem",
            "vlanSettingsAddItem",
            "vlanSettingsDelItem",
            "vlanSettingsGet",
            "vlanSettingsGetItem",
            "vlanSettingsReconfigure",
            "vlanSettingsSet",
            "vlanSettingsSetItem",
            "vxlanSettingsAddItem",
            "vxlanSettingsDelItem",
            "vxlanSettingsGet",
            "vxlanSettingsGetItem",
            "vxlanSettingsReconfigure",
            "vxlanSettingsSet",
            "vxlanSettingsSetItem"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "captiveportal_manage",
    "description": "Captiveportal management - 27 available methods including: accessApi, accessLogoff, accessLogon, serviceDelTemplate, serviceGetTemplate...",
    "module": "captiveportal",
    "methods": [
      "accessApi",
      "accessLogoff",
      "accessLogon",
      "serviceDelTemplate",
      "serviceGetTemplate",
      "serviceReconfigure",
      "serviceSaveTemplate",
      "serviceSearchTemplates",
      "sessionConnect",
      "sessionDisconnect",
      "sessionList",
      "sessionSearch",
      "sessionZones",
      "settingsAddZone",
      "settingsDelZone",
      "settingsGet",
      "settingsGetZone",
      "settingsSet",
      "settingsSetZone",
      "settingsToggleZone",
      "voucherDropExpiredVouchers",
      "voucherDropVoucherGroup",
      "voucherExpireVoucher",
      "voucherGenerateVouchers",
      "voucherListProviders",
      "voucherListVoucherGroups",
      "voucherListVouchers"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "accessApi",
            "accessLogoff",
            "accessLogon",
            "serviceDelTemplate",
            "serviceGetTemplate",
            "serviceReconfigure",
            "serviceSaveTemplate",
            "serviceSearchTemplates",
            "sessionConnect",
            "sessionDisconnect",
            "sessionList",
            "sessionSearch",
            "sessionZones",
            "settingsAddZone",
            "settingsDelZone",
            "settingsGet",
            "settingsGetZone",
            "settingsSet",
            "settingsSetZone",
            "settingsToggleZone",
            "voucherDropExpiredVouchers",
            "voucherDropVoucherGroup",
            "voucherExpireVoucher",
            "voucherGenerateVouchers",
            "voucherListProviders",
            "voucherListVoucherGroups",
            "voucherListVouchers"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "cron_manage",
    "description": "Cron management - 8 available methods including: serviceReconfigure, settingsAddJob, settingsDelJob, settingsGet, settingsGetJob...",
    "module": "cron",
    "methods": [
      "serviceReconfigure",
      "settingsAddJob",
      "settingsDelJob",
      "settingsGet",
      "settingsGetJob",
      "settingsSet",
      "settingsSetJob",
      "settingsToggleJob"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "serviceReconfigure",
            "settingsAddJob",
            "settingsDelJob",
            "settingsGet",
            "settingsGetJob",
            "settingsSet",
            "settingsSetJob",
            "settingsToggleJob"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "dhcpv4_manage",
    "description": "Dhcpv4 management - 7 available methods including: leasesDelLease, leasesSearchLease, serviceReconfigure, serviceRestart, serviceStart...",
    "module": "dhcpv4",
    "methods": [
      "leasesDelLease",
      "leasesSearchLease",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "leasesDelLease",
            "leasesSearchLease",
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "dhcpv6_manage",
    "description": "Dhcpv6 management - 8 available methods including: leasesDelLease, leasesSearchLease, leasesSearchPrefix, serviceReconfigure, serviceRestart...",
    "module": "dhcpv6",
    "methods": [
      "leasesDelLease",
      "leasesSearchLease",
      "leasesSearchPrefix",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "leasesDelLease",
            "leasesSearchLease",
            "leasesSearchPrefix",
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "dhcrelay_manage",
    "description": "Dhcrelay management - 12 available methods including: serviceReconfigure, settingsAddDest, settingsAddRelay, settingsDelDest, settingsDelRelay...",
    "module": "dhcrelay",
    "methods": [
      "serviceReconfigure",
      "settingsAddDest",
      "settingsAddRelay",
      "settingsDelDest",
      "settingsDelRelay",
      "settingsGet",
      "settingsGetDest",
      "settingsGetRelay",
      "settingsSet",
      "settingsSetDest",
      "settingsSetRelay",
      "settingsToggleRelay"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "serviceReconfigure",
            "settingsAddDest",
            "settingsAddRelay",
            "settingsDelDest",
            "settingsDelRelay",
            "settingsGet",
            "settingsGetDest",
            "settingsGetRelay",
            "settingsSet",
            "settingsSetDest",
            "settingsSetRelay",
            "settingsToggleRelay"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "diagnostics_manage",
    "description": "Diagnostics management - 90 available methods including: activityGetActivity, cpuUsageGetCPUType, cpuUsageStream, dnsReverseLookup, dnsDiagnosticsGet...",
    "module": "diagnostics",
    "methods": [
      "activityGetActivity",
      "cpuUsageGetCPUType",
      "cpuUsageStream",
      "dnsReverseLookup",
      "dnsDiagnosticsGet",
      "dnsDiagnosticsSet",
      "firewallDelState",
      "firewallFlushSources",
      "firewallFlushStates",
      "firewallKillStates",
      "firewallListRuleIds",
      "firewallLog",
      "firewallLogFilters",
      "firewallPfStates",
      "firewallPfStatistics",
      "firewallQueryPfTop",
      "firewallQueryStates",
      "firewallStats",
      "firewallStreamLog",
      "interfaceCarpStatus",
      "interfaceDelRoute",
      "interfaceFlushArp",
      "interfaceGetArp",
      "interfaceGetBpfStatistics",
      "interfaceGetInterfaceConfig",
      "interfaceGetInterfaceNames",
      "interfaceGetInterfaceStatistics",
      "interfaceGetMemoryStatistics",
      "interfaceGetNdp",
      "interfaceGetNetisrStatistics",
      "interfaceGetPfsyncNodes",
      "interfaceGetProtocolStatistics",
      "interfaceGetRoutes",
      "interfaceGetSocketStatistics",
      "interfaceGetVipStatus",
      "interfaceSearchArp",
      "interfaceSearchNdp",
      "lvtemplateAddItem",
      "lvtemplateDelItem",
      "lvtemplateGet",
      "lvtemplateGetItem",
      "lvtemplateSet",
      "lvtemplateSetItem",
      "netflowCacheStats",
      "netflowGetconfig",
      "netflowIsEnabled",
      "netflowReconfigure",
      "netflowSetconfig",
      "netflowStatus",
      "networkinsightExport",
      "networkinsightGetInterfaces",
      "networkinsightGetMetadata",
      "networkinsightGetProtocols",
      "networkinsightGetServices",
      "networkinsightTimeserie",
      "networkinsightTop",
      "packetCaptureDownload",
      "packetCaptureGet",
      "packetCaptureMacInfo",
      "packetCaptureRemove",
      "packetCaptureSearchJobs",
      "packetCaptureSet",
      "packetCaptureStart",
      "packetCaptureStop",
      "packetCaptureView",
      "pingGet",
      "pingRemove",
      "pingSearchJobs",
      "pingSet",
      "pingStart",
      "pingStop",
      "portprobeGet",
      "portprobeSet",
      "systemMemory",
      "systemSystemDisk",
      "systemSystemInformation",
      "systemSystemMbuf",
      "systemSystemResources",
      "systemSystemSwap",
      "systemSystemTemperature",
      "systemSystemTime",
      "systemhealthExportAsCSV",
      "systemhealthGetInterfaces",
      "systemhealthGetRRDlist",
      "systemhealthGetSystemHealth",
      "tracerouteGet",
      "tracerouteSet",
      "trafficInterface",
      "trafficTop",
      "trafficStream"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "activityGetActivity",
            "cpuUsageGetCPUType",
            "cpuUsageStream",
            "dnsReverseLookup",
            "dnsDiagnosticsGet",
            "dnsDiagnosticsSet",
            "firewallDelState",
            "firewallFlushSources",
            "firewallFlushStates",
            "firewallKillStates",
            "firewallListRuleIds",
            "firewallLog",
            "firewallLogFilters",
            "firewallPfStates",
            "firewallPfStatistics",
            "firewallQueryPfTop",
            "firewallQueryStates",
            "firewallStats",
            "firewallStreamLog",
            "interfaceCarpStatus",
            "interfaceDelRoute",
            "interfaceFlushArp",
            "interfaceGetArp",
            "interfaceGetBpfStatistics",
            "interfaceGetInterfaceConfig",
            "interfaceGetInterfaceNames",
            "interfaceGetInterfaceStatistics",
            "interfaceGetMemoryStatistics",
            "interfaceGetNdp",
            "interfaceGetNetisrStatistics",
            "interfaceGetPfsyncNodes",
            "interfaceGetProtocolStatistics",
            "interfaceGetRoutes",
            "interfaceGetSocketStatistics",
            "interfaceGetVipStatus",
            "interfaceSearchArp",
            "interfaceSearchNdp",
            "lvtemplateAddItem",
            "lvtemplateDelItem",
            "lvtemplateGet",
            "lvtemplateGetItem",
            "lvtemplateSet",
            "lvtemplateSetItem",
            "netflowCacheStats",
            "netflowGetconfig",
            "netflowIsEnabled",
            "netflowReconfigure",
            "netflowSetconfig",
            "netflowStatus",
            "networkinsightExport",
            "networkinsightGetInterfaces",
            "networkinsightGetMetadata",
            "networkinsightGetProtocols",
            "networkinsightGetServices",
            "networkinsightTimeserie",
            "networkinsightTop",
            "packetCaptureDownload",
            "packetCaptureGet",
            "packetCaptureMacInfo",
            "packetCaptureRemove",
            "packetCaptureSearchJobs",
            "packetCaptureSet",
            "packetCaptureStart",
            "packetCaptureStop",
            "packetCaptureView",
            "pingGet",
            "pingRemove",
            "pingSearchJobs",
            "pingSet",
            "pingStart",
            "pingStop",
            "portprobeGet",
            "portprobeSet",
            "systemMemory",
            "systemSystemDisk",
            "systemSystemInformation",
            "systemSystemMbuf",
            "systemSystemResources",
            "systemSystemSwap",
            "systemSystemTemperature",
            "systemSystemTime",
            "systemhealthExportAsCSV",
            "systemhealthGetInterfaces",
            "systemhealthGetRRDlist",
            "systemhealthGetSystemHealth",
            "tracerouteGet",
            "tracerouteSet",
            "trafficInterface",
            "trafficTop",
            "trafficStream"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "dnsmasq_manage",
    "description": "Dnsmasq management - 35 available methods including: leasesSearch, serviceReconfigure, serviceRestart, serviceStart, serviceStatus...",
    "module": "dnsmasq",
    "methods": [
      "leasesSearch",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "settingsAddBoot",
      "settingsAddDomain",
      "settingsAddHost",
      "settingsAddOption",
      "settingsAddRange",
      "settingsAddTag",
      "settingsDelBoot",
      "settingsDelDomain",
      "settingsDelHost",
      "settingsDelOption",
      "settingsDelRange",
      "settingsDelTag",
      "settingsDownloadHosts",
      "settingsGet",
      "settingsGetBoot",
      "settingsGetDomain",
      "settingsGetHost",
      "settingsGetOption",
      "settingsGetRange",
      "settingsGetTag",
      "settingsGetTagList",
      "settingsSet",
      "settingsSetBoot",
      "settingsSetDomain",
      "settingsSetHost",
      "settingsSetOption",
      "settingsSetRange",
      "settingsSetTag",
      "settingsUploadHosts"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "leasesSearch",
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop",
            "settingsAddBoot",
            "settingsAddDomain",
            "settingsAddHost",
            "settingsAddOption",
            "settingsAddRange",
            "settingsAddTag",
            "settingsDelBoot",
            "settingsDelDomain",
            "settingsDelHost",
            "settingsDelOption",
            "settingsDelRange",
            "settingsDelTag",
            "settingsDownloadHosts",
            "settingsGet",
            "settingsGetBoot",
            "settingsGetDomain",
            "settingsGetHost",
            "settingsGetOption",
            "settingsGetRange",
            "settingsGetTag",
            "settingsGetTagList",
            "settingsSet",
            "settingsSetBoot",
            "settingsSetDomain",
            "settingsSetHost",
            "settingsSetOption",
            "settingsSetRange",
            "settingsSetTag",
            "settingsUploadHosts"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "firmware_manage",
    "description": "Firmware management - 26 available methods including: firmwareAudit, firmwareChangelog, firmwareCheck, firmwareConnection, firmwareGet...",
    "module": "firmware",
    "methods": [
      "firmwareAudit",
      "firmwareChangelog",
      "firmwareCheck",
      "firmwareConnection",
      "firmwareGet",
      "firmwareGetOptions",
      "firmwareHealth",
      "firmwareInfo",
      "firmwareLog",
      "firmwarePoweroff",
      "firmwareReboot",
      "firmwareResyncPlugins",
      "firmwareRunning",
      "firmwareSet",
      "firmwareStatus",
      "firmwareSyncPlugins",
      "firmwareUpdate",
      "firmwareUpgrade",
      "firmwareUpgradestatus",
      "firmwareDetails",
      "firmwareInstall",
      "firmwareLicense",
      "firmwareLock",
      "firmwareRemove",
      "firmwareReinstall",
      "firmwareUnlock"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "firmwareAudit",
            "firmwareChangelog",
            "firmwareCheck",
            "firmwareConnection",
            "firmwareGet",
            "firmwareGetOptions",
            "firmwareHealth",
            "firmwareInfo",
            "firmwareLog",
            "firmwarePoweroff",
            "firmwareReboot",
            "firmwareResyncPlugins",
            "firmwareRunning",
            "firmwareSet",
            "firmwareStatus",
            "firmwareSyncPlugins",
            "firmwareUpdate",
            "firmwareUpgrade",
            "firmwareUpgradestatus",
            "firmwareDetails",
            "firmwareInstall",
            "firmwareLicense",
            "firmwareLock",
            "firmwareRemove",
            "firmwareReinstall",
            "firmwareUnlock"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "ids_manage",
    "description": "Ids management - 40 available methods including: serviceDropAlertLog, serviceGetAlertInfo, serviceGetAlertLogs, serviceQueryAlerts, serviceReconfigure...",
    "module": "ids",
    "methods": [
      "serviceDropAlertLog",
      "serviceGetAlertInfo",
      "serviceGetAlertLogs",
      "serviceQueryAlerts",
      "serviceReconfigure",
      "serviceReloadRules",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "serviceUpdateRules",
      "settingsAddPolicy",
      "settingsAddPolicyRule",
      "settingsAddUserRule",
      "settingsCheckPolicyRule",
      "settingsDelPolicy",
      "settingsDelPolicyRule",
      "settingsDelUserRule",
      "settingsGet",
      "settingsGetPolicy",
      "settingsGetPolicyRule",
      "settingsGetRuleInfo",
      "settingsGetRuleset",
      "settingsGetRulesetproperties",
      "settingsGetUserRule",
      "settingsListRuleMetadata",
      "settingsListRulesets",
      "settingsSearchInstalledRules",
      "settingsSet",
      "settingsSetPolicy",
      "settingsSetPolicyRule",
      "settingsSetRule",
      "settingsSetRuleset",
      "settingsSetRulesetproperties",
      "settingsSetUserRule",
      "settingsTogglePolicy",
      "settingsTogglePolicyRule",
      "settingsToggleRule",
      "settingsToggleRuleset",
      "settingsToggleUserRule"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "serviceDropAlertLog",
            "serviceGetAlertInfo",
            "serviceGetAlertLogs",
            "serviceQueryAlerts",
            "serviceReconfigure",
            "serviceReloadRules",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop",
            "serviceUpdateRules",
            "settingsAddPolicy",
            "settingsAddPolicyRule",
            "settingsAddUserRule",
            "settingsCheckPolicyRule",
            "settingsDelPolicy",
            "settingsDelPolicyRule",
            "settingsDelUserRule",
            "settingsGet",
            "settingsGetPolicy",
            "settingsGetPolicyRule",
            "settingsGetRuleInfo",
            "settingsGetRuleset",
            "settingsGetRulesetproperties",
            "settingsGetUserRule",
            "settingsListRuleMetadata",
            "settingsListRulesets",
            "settingsSearchInstalledRules",
            "settingsSet",
            "settingsSetPolicy",
            "settingsSetPolicyRule",
            "settingsSetRule",
            "settingsSetRuleset",
            "settingsSetRulesetproperties",
            "settingsSetUserRule",
            "settingsTogglePolicy",
            "settingsTogglePolicyRule",
            "settingsToggleRule",
            "settingsToggleRuleset",
            "settingsToggleUserRule"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "ipsec_manage",
    "description": "Ipsec management - 80 available methods including: connectionsAddChild, connectionsAddConnection, connectionsAddLocal, connectionsAddRemote, connectionsConnectionExists...",
    "module": "ipsec",
    "methods": [
      "connectionsAddChild",
      "connectionsAddConnection",
      "connectionsAddLocal",
      "connectionsAddRemote",
      "connectionsConnectionExists",
      "connectionsDelChild",
      "connectionsDelConnection",
      "connectionsDelLocal",
      "connectionsDelRemote",
      "connectionsGet",
      "connectionsGetChild",
      "connectionsGetConnection",
      "connectionsGetLocal",
      "connectionsGetRemote",
      "connectionsIsEnabled",
      "connectionsSet",
      "connectionsSetChild",
      "connectionsSetConnection",
      "connectionsSetLocal",
      "connectionsSetRemote",
      "connectionsSwanctl",
      "connectionsToggle",
      "connectionsToggleChild",
      "connectionsToggleConnection",
      "connectionsToggleLocal",
      "connectionsToggleRemote",
      "keyPairsAddItem",
      "keyPairsDelItem",
      "keyPairsGenKeyPair",
      "keyPairsGet",
      "keyPairsGetItem",
      "keyPairsSet",
      "keyPairsSetItem",
      "leasesPools",
      "leasesSearch",
      "legacySubsystemApplyConfig",
      "legacySubsystemStatus",
      "manualSpdAdd",
      "manualSpdDel",
      "manualSpdGet",
      "manualSpdSet",
      "manualSpdToggle",
      "poolsAdd",
      "poolsDel",
      "poolsGet",
      "poolsSet",
      "poolsToggle",
      "preSharedKeysAddItem",
      "preSharedKeysDelItem",
      "preSharedKeysGet",
      "preSharedKeysGetItem",
      "preSharedKeysSet",
      "preSharedKeysSetItem",
      "sadDelete",
      "sadSearch",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "sessionsConnect",
      "sessionsDisconnect",
      "sessionsSearchPhase1",
      "sessionsSearchPhase2",
      "settingsGet",
      "settingsSet",
      "spdDelete",
      "spdSearch",
      "tunnelDelPhase1",
      "tunnelDelPhase2",
      "tunnelSearchPhase1",
      "tunnelSearchPhase2",
      "tunnelToggle",
      "tunnelTogglePhase1",
      "tunnelTogglePhase2",
      "vtiAdd",
      "vtiDel",
      "vtiGet",
      "vtiSet",
      "vtiToggle"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "connectionsAddChild",
            "connectionsAddConnection",
            "connectionsAddLocal",
            "connectionsAddRemote",
            "connectionsConnectionExists",
            "connectionsDelChild",
            "connectionsDelConnection",
            "connectionsDelLocal",
            "connectionsDelRemote",
            "connectionsGet",
            "connectionsGetChild",
            "connectionsGetConnection",
            "connectionsGetLocal",
            "connectionsGetRemote",
            "connectionsIsEnabled",
            "connectionsSet",
            "connectionsSetChild",
            "connectionsSetConnection",
            "connectionsSetLocal",
            "connectionsSetRemote",
            "connectionsSwanctl",
            "connectionsToggle",
            "connectionsToggleChild",
            "connectionsToggleConnection",
            "connectionsToggleLocal",
            "connectionsToggleRemote",
            "keyPairsAddItem",
            "keyPairsDelItem",
            "keyPairsGenKeyPair",
            "keyPairsGet",
            "keyPairsGetItem",
            "keyPairsSet",
            "keyPairsSetItem",
            "leasesPools",
            "leasesSearch",
            "legacySubsystemApplyConfig",
            "legacySubsystemStatus",
            "manualSpdAdd",
            "manualSpdDel",
            "manualSpdGet",
            "manualSpdSet",
            "manualSpdToggle",
            "poolsAdd",
            "poolsDel",
            "poolsGet",
            "poolsSet",
            "poolsToggle",
            "preSharedKeysAddItem",
            "preSharedKeysDelItem",
            "preSharedKeysGet",
            "preSharedKeysGetItem",
            "preSharedKeysSet",
            "preSharedKeysSetItem",
            "sadDelete",
            "sadSearch",
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop",
            "sessionsConnect",
            "sessionsDisconnect",
            "sessionsSearchPhase1",
            "sessionsSearchPhase2",
            "settingsGet",
            "settingsSet",
            "spdDelete",
            "spdSearch",
            "tunnelDelPhase1",
            "tunnelDelPhase2",
            "tunnelSearchPhase1",
            "tunnelSearchPhase2",
            "tunnelToggle",
            "tunnelTogglePhase1",
            "tunnelTogglePhase2",
            "vtiAdd",
            "vtiDel",
            "vtiGet",
            "vtiSet",
            "vtiToggle"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "kea_manage",
    "description": "Kea management - 24 available methods including: ctrlAgentGet, ctrlAgentSet, dhcpv4AddPeer, dhcpv4AddReservation, dhcpv4AddSubnet...",
    "module": "kea",
    "methods": [
      "ctrlAgentGet",
      "ctrlAgentSet",
      "dhcpv4AddPeer",
      "dhcpv4AddReservation",
      "dhcpv4AddSubnet",
      "dhcpv4DelPeer",
      "dhcpv4DelReservation",
      "dhcpv4DelSubnet",
      "dhcpv4DownloadReservations",
      "dhcpv4Get",
      "dhcpv4GetPeer",
      "dhcpv4GetReservation",
      "dhcpv4GetSubnet",
      "dhcpv4Set",
      "dhcpv4SetPeer",
      "dhcpv4SetReservation",
      "dhcpv4SetSubnet",
      "dhcpv4UploadReservations",
      "leases4Search",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "ctrlAgentGet",
            "ctrlAgentSet",
            "dhcpv4AddPeer",
            "dhcpv4AddReservation",
            "dhcpv4AddSubnet",
            "dhcpv4DelPeer",
            "dhcpv4DelReservation",
            "dhcpv4DelSubnet",
            "dhcpv4DownloadReservations",
            "dhcpv4Get",
            "dhcpv4GetPeer",
            "dhcpv4GetReservation",
            "dhcpv4GetSubnet",
            "dhcpv4Set",
            "dhcpv4SetPeer",
            "dhcpv4SetReservation",
            "dhcpv4SetSubnet",
            "dhcpv4UploadReservations",
            "leases4Search",
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "monit_manage",
    "description": "Monit management - 25 available methods including: serviceCheck, serviceReconfigure, serviceRestart, serviceStart, serviceStatus...",
    "module": "monit",
    "methods": [
      "serviceCheck",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "settingsAddAlert",
      "settingsAddService",
      "settingsAddTest",
      "settingsDelAlert",
      "settingsDelService",
      "settingsDelTest",
      "settingsDirty",
      "settingsGet",
      "settingsGetAlert",
      "settingsGetGeneral",
      "settingsGetService",
      "settingsGetTest",
      "settingsSet",
      "settingsSetAlert",
      "settingsSetService",
      "settingsSetTest",
      "settingsToggleAlert",
      "settingsToggleService",
      "statusGet"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "serviceCheck",
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop",
            "settingsAddAlert",
            "settingsAddService",
            "settingsAddTest",
            "settingsDelAlert",
            "settingsDelService",
            "settingsDelTest",
            "settingsDirty",
            "settingsGet",
            "settingsGetAlert",
            "settingsGetGeneral",
            "settingsGetService",
            "settingsGetTest",
            "settingsSet",
            "settingsSetAlert",
            "settingsSetService",
            "settingsSetTest",
            "settingsToggleAlert",
            "settingsToggleService",
            "statusGet"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "openvpn_manage",
    "description": "Openvpn management - 28 available methods including: clientOverwritesAdd, clientOverwritesDel, clientOverwritesGet, clientOverwritesSet, clientOverwritesToggle...",
    "module": "openvpn",
    "methods": [
      "clientOverwritesAdd",
      "clientOverwritesDel",
      "clientOverwritesGet",
      "clientOverwritesSet",
      "clientOverwritesToggle",
      "exportAccounts",
      "exportDownload",
      "exportProviders",
      "exportStorePresets",
      "exportTemplates",
      "exportValidatePresets",
      "instancesAdd",
      "instancesAddStaticKey",
      "instancesDel",
      "instancesDelStaticKey",
      "instancesGenKey",
      "instancesGet",
      "instancesGetStaticKey",
      "instancesSet",
      "instancesSetStaticKey",
      "instancesToggle",
      "serviceKillSession",
      "serviceReconfigure",
      "serviceRestartService",
      "serviceSearchRoutes",
      "serviceSearchSessions",
      "serviceStartService",
      "serviceStopService"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "clientOverwritesAdd",
            "clientOverwritesDel",
            "clientOverwritesGet",
            "clientOverwritesSet",
            "clientOverwritesToggle",
            "exportAccounts",
            "exportDownload",
            "exportProviders",
            "exportStorePresets",
            "exportTemplates",
            "exportValidatePresets",
            "instancesAdd",
            "instancesAddStaticKey",
            "instancesDel",
            "instancesDelStaticKey",
            "instancesGenKey",
            "instancesGet",
            "instancesGetStaticKey",
            "instancesSet",
            "instancesSetStaticKey",
            "instancesToggle",
            "serviceKillSession",
            "serviceReconfigure",
            "serviceRestartService",
            "serviceSearchRoutes",
            "serviceSearchSessions",
            "serviceStartService",
            "serviceStopService"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "routes_manage",
    "description": "Routes management - 9 available methods including: gatewayStatus, routesAddroute, routesDelroute, routesGet, routesGetroute...",
    "module": "routes",
    "methods": [
      "gatewayStatus",
      "routesAddroute",
      "routesDelroute",
      "routesGet",
      "routesGetroute",
      "routesReconfigure",
      "routesSet",
      "routesSetroute",
      "routesToggleroute"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "gatewayStatus",
            "routesAddroute",
            "routesDelroute",
            "routesGet",
            "routesGetroute",
            "routesReconfigure",
            "routesSet",
            "routesSetroute",
            "routesToggleroute"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "routing_manage",
    "description": "Routing management - 9 available methods including: settingsAddGateway, settingsDelGateway, settingsGet, settingsGetGateway, settingsReconfigure...",
    "module": "routing",
    "methods": [
      "settingsAddGateway",
      "settingsDelGateway",
      "settingsGet",
      "settingsGetGateway",
      "settingsReconfigure",
      "settingsSearchGateway",
      "settingsSet",
      "settingsSetGateway",
      "settingsToggleGateway"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "settingsAddGateway",
            "settingsDelGateway",
            "settingsGet",
            "settingsGetGateway",
            "settingsReconfigure",
            "settingsSearchGateway",
            "settingsSet",
            "settingsSetGateway",
            "settingsToggleGateway"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "syslog_manage",
    "description": "Syslog management - 14 available methods including: serviceReconfigure, serviceReset, serviceRestart, serviceStart, serviceStats...",
    "module": "syslog",
    "methods": [
      "serviceReconfigure",
      "serviceReset",
      "serviceRestart",
      "serviceStart",
      "serviceStats",
      "serviceStatus",
      "serviceStop",
      "settingsAddDestination",
      "settingsDelDestination",
      "settingsGet",
      "settingsGetDestination",
      "settingsSet",
      "settingsSetDestination",
      "settingsToggleDestination"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "serviceReconfigure",
            "serviceReset",
            "serviceRestart",
            "serviceStart",
            "serviceStats",
            "serviceStatus",
            "serviceStop",
            "settingsAddDestination",
            "settingsDelDestination",
            "settingsGet",
            "settingsGetDestination",
            "settingsSet",
            "settingsSetDestination",
            "settingsToggleDestination"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "trafficshaper_manage",
    "description": "Trafficshaper management - 20 available methods including: serviceFlushreload, serviceReconfigure, serviceStatistics, settingsAddPipe, settingsAddQueue...",
    "module": "trafficshaper",
    "methods": [
      "serviceFlushreload",
      "serviceReconfigure",
      "serviceStatistics",
      "settingsAddPipe",
      "settingsAddQueue",
      "settingsAddRule",
      "settingsDelPipe",
      "settingsDelQueue",
      "settingsDelRule",
      "settingsGet",
      "settingsGetPipe",
      "settingsGetQueue",
      "settingsGetRule",
      "settingsSet",
      "settingsSetPipe",
      "settingsSetQueue",
      "settingsSetRule",
      "settingsTogglePipe",
      "settingsToggleQueue",
      "settingsToggleRule"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "serviceFlushreload",
            "serviceReconfigure",
            "serviceStatistics",
            "settingsAddPipe",
            "settingsAddQueue",
            "settingsAddRule",
            "settingsDelPipe",
            "settingsDelQueue",
            "settingsDelRule",
            "settingsGet",
            "settingsGetPipe",
            "settingsGetQueue",
            "settingsGetRule",
            "settingsSet",
            "settingsSetPipe",
            "settingsSetQueue",
            "settingsSetRule",
            "settingsTogglePipe",
            "settingsToggleQueue",
            "settingsToggleRule"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "trust_manage",
    "description": "Trust management - 25 available methods including: caCaInfo, caCaList, caDel, caGenerateFile, caGet...",
    "module": "trust",
    "methods": [
      "caCaInfo",
      "caCaList",
      "caDel",
      "caGenerateFile",
      "caGet",
      "caRawDump",
      "caSet",
      "certAdd",
      "certCaInfo",
      "certCaList",
      "certDel",
      "certGenerateFile",
      "certGet",
      "certRawDump",
      "certSet",
      "certUserList",
      "crlDel",
      "crlGet",
      "crlGetOcspInfoData",
      "crlRawDump",
      "crlSearch",
      "crlSet",
      "settingsGet",
      "settingsReconfigure",
      "settingsSet"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "caCaInfo",
            "caCaList",
            "caDel",
            "caGenerateFile",
            "caGet",
            "caRawDump",
            "caSet",
            "certAdd",
            "certCaInfo",
            "certCaList",
            "certDel",
            "certGenerateFile",
            "certGet",
            "certRawDump",
            "certSet",
            "certUserList",
            "crlDel",
            "crlGet",
            "crlGetOcspInfoData",
            "crlRawDump",
            "crlSearch",
            "crlSet",
            "settingsGet",
            "settingsReconfigure",
            "settingsSet"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "unbound_manage",
    "description": "Unbound management - 42 available methods including: diagnosticsDumpcache, diagnosticsDumpinfra, diagnosticsListinsecure, diagnosticsListlocaldata, diagnosticsListlocalzones...",
    "module": "unbound",
    "methods": [
      "diagnosticsDumpcache",
      "diagnosticsDumpinfra",
      "diagnosticsListinsecure",
      "diagnosticsListlocaldata",
      "diagnosticsListlocalzones",
      "diagnosticsStats",
      "overviewRolling",
      "overviewIsBlockListEnabled",
      "overviewIsEnabled",
      "overviewSearchQueries",
      "overviewTotals",
      "serviceDnsbl",
      "serviceReconfigure",
      "serviceReconfigureGeneral",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "settingsAddAcl",
      "settingsAddForward",
      "settingsAddHostAlias",
      "settingsAddHostOverride",
      "settingsDelAcl",
      "settingsDelForward",
      "settingsDelHostAlias",
      "settingsDelHostOverride",
      "settingsGet",
      "settingsGetAcl",
      "settingsGetForward",
      "settingsGetHostAlias",
      "settingsGetHostOverride",
      "settingsGetNameservers",
      "settingsSet",
      "settingsSetAcl",
      "settingsSetForward",
      "settingsSetHostAlias",
      "settingsSetHostOverride",
      "settingsToggleAcl",
      "settingsToggleForward",
      "settingsToggleHostAlias",
      "settingsToggleHostOverride",
      "settingsUpdateBlocklist"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "diagnosticsDumpcache",
            "diagnosticsDumpinfra",
            "diagnosticsListinsecure",
            "diagnosticsListlocaldata",
            "diagnosticsListlocalzones",
            "diagnosticsStats",
            "overviewRolling",
            "overviewIsBlockListEnabled",
            "overviewIsEnabled",
            "overviewSearchQueries",
            "overviewTotals",
            "serviceDnsbl",
            "serviceReconfigure",
            "serviceReconfigureGeneral",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop",
            "settingsAddAcl",
            "settingsAddForward",
            "settingsAddHostAlias",
            "settingsAddHostOverride",
            "settingsDelAcl",
            "settingsDelForward",
            "settingsDelHostAlias",
            "settingsDelHostOverride",
            "settingsGet",
            "settingsGetAcl",
            "settingsGetForward",
            "settingsGetHostAlias",
            "settingsGetHostOverride",
            "settingsGetNameservers",
            "settingsSet",
            "settingsSetAcl",
            "settingsSetForward",
            "settingsSetHostAlias",
            "settingsSetHostOverride",
            "settingsToggleAcl",
            "settingsToggleForward",
            "settingsToggleHostAlias",
            "settingsToggleHostOverride",
            "settingsUpdateBlocklist"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "wireguard_manage",
    "description": "Wireguard management - 28 available methods including: clientAddClient, clientAddClientBuilder, clientDelClient, clientGet, clientGetClient...",
    "module": "wireguard",
    "methods": [
      "clientAddClient",
      "clientAddClientBuilder",
      "clientDelClient",
      "clientGet",
      "clientGetClient",
      "clientGetClientBuilder",
      "clientGetServerInfo",
      "clientListServers",
      "clientPsk",
      "clientSet",
      "clientSetClient",
      "clientToggleClient",
      "generalGet",
      "generalSet",
      "serverAddServer",
      "serverDelServer",
      "serverGet",
      "serverGetServer",
      "serverKeyPair",
      "serverSet",
      "serverSetServer",
      "serverToggleServer",
      "serviceReconfigure",
      "serviceRestart",
      "serviceShow",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "clientAddClient",
            "clientAddClientBuilder",
            "clientDelClient",
            "clientGet",
            "clientGetClient",
            "clientGetClientBuilder",
            "clientGetServerInfo",
            "clientListServers",
            "clientPsk",
            "clientSet",
            "clientSetClient",
            "clientToggleClient",
            "generalGet",
            "generalSet",
            "serverAddServer",
            "serverDelServer",
            "serverGet",
            "serverGetServer",
            "serverKeyPair",
            "serverSet",
            "serverSetServer",
            "serverToggleServer",
            "serviceReconfigure",
            "serviceRestart",
            "serviceShow",
            "serviceStart",
            "serviceStatus",
            "serviceStop"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_acmeclient_manage",
    "description": "Plugin acmeclient management - 48 available methods including: accountsAdd, accountsDel, accountsGet, accountsRegister, accountsSet...",
    "module": "plugins",
    "submodule": "acmeclient",
    "methods": [
      "accountsAdd",
      "accountsDel",
      "accountsGet",
      "accountsRegister",
      "accountsSet",
      "accountsToggle",
      "accountsUpdate",
      "actionsAdd",
      "actionsDel",
      "actionsGet",
      "actionsSet",
      "actionsSftpGetIdentity",
      "actionsSftpTestConnection",
      "actionsSshGetIdentity",
      "actionsSshTestConnection",
      "actionsToggle",
      "actionsUpdate",
      "certificatesAdd",
      "certificatesAutomation",
      "certificatesDel",
      "certificatesGet",
      "certificatesImport",
      "certificatesRemovekey",
      "certificatesRevoke",
      "certificatesSet",
      "certificatesSign",
      "certificatesToggle",
      "certificatesUpdate",
      "serviceConfigtest",
      "serviceReconfigure",
      "serviceReset",
      "serviceRestart",
      "serviceSignallcerts",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "settingsFetchCronIntegration",
      "settingsFetchHAProxyIntegration",
      "settingsGet",
      "settingsGetBindPluginStatus",
      "settingsGetGcloudPluginStatus",
      "settingsSet",
      "validationsAdd",
      "validationsDel",
      "validationsGet",
      "validationsSet",
      "validationsToggle",
      "validationsUpdate"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "accountsAdd",
            "accountsDel",
            "accountsGet",
            "accountsRegister",
            "accountsSet",
            "accountsToggle",
            "accountsUpdate",
            "actionsAdd",
            "actionsDel",
            "actionsGet",
            "actionsSet",
            "actionsSftpGetIdentity",
            "actionsSftpTestConnection",
            "actionsSshGetIdentity",
            "actionsSshTestConnection",
            "actionsToggle",
            "actionsUpdate",
            "certificatesAdd",
            "certificatesAutomation",
            "certificatesDel",
            "certificatesGet",
            "certificatesImport",
            "certificatesRemovekey",
            "certificatesRevoke",
            "certificatesSet",
            "certificatesSign",
            "certificatesToggle",
            "certificatesUpdate",
            "serviceConfigtest",
            "serviceReconfigure",
            "serviceReset",
            "serviceRestart",
            "serviceSignallcerts",
            "serviceStart",
            "serviceStatus",
            "serviceStop",
            "settingsFetchCronIntegration",
            "settingsFetchHAProxyIntegration",
            "settingsGet",
            "settingsGetBindPluginStatus",
            "settingsGetGcloudPluginStatus",
            "settingsSet",
            "validationsAdd",
            "validationsDel",
            "validationsGet",
            "validationsSet",
            "validationsToggle",
            "validationsUpdate"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_apcupsd_manage",
    "description": "Plugin apcupsd management - 8 available methods including: serviceGetUpsStatus, serviceReconfigure, serviceRestart, serviceStart, serviceStatus...",
    "module": "plugins",
    "submodule": "apcupsd",
    "methods": [
      "serviceGetUpsStatus",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "settingsGet",
      "settingsSet"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "serviceGetUpsStatus",
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop",
            "settingsGet",
            "settingsSet"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_bind_manage",
    "description": "Plugin bind management - 36 available methods including: aclAddAcl, aclDelAcl, aclGet, aclGetAcl, aclSet...",
    "module": "plugins",
    "submodule": "bind",
    "methods": [
      "aclAddAcl",
      "aclDelAcl",
      "aclGet",
      "aclGetAcl",
      "aclSet",
      "aclSetAcl",
      "aclToggleAcl",
      "dnsblGet",
      "dnsblSet",
      "domainAddPrimaryDomain",
      "domainAddSecondaryDomain",
      "domainDelDomain",
      "domainGet",
      "domainGetDomain",
      "domainSearchMasterDomain",
      "domainSearchSlaveDomain",
      "domainSet",
      "domainSetDomain",
      "domainToggleDomain",
      "generalGet",
      "generalSet",
      "generalZoneshow",
      "generalZonetest",
      "recordAddRecord",
      "recordDelRecord",
      "recordGet",
      "recordGetRecord",
      "recordSet",
      "recordSetRecord",
      "recordToggleRecord",
      "serviceDnsbl",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "aclAddAcl",
            "aclDelAcl",
            "aclGet",
            "aclGetAcl",
            "aclSet",
            "aclSetAcl",
            "aclToggleAcl",
            "dnsblGet",
            "dnsblSet",
            "domainAddPrimaryDomain",
            "domainAddSecondaryDomain",
            "domainDelDomain",
            "domainGet",
            "domainGetDomain",
            "domainSearchMasterDomain",
            "domainSearchSlaveDomain",
            "domainSet",
            "domainSetDomain",
            "domainToggleDomain",
            "generalGet",
            "generalSet",
            "generalZoneshow",
            "generalZonetest",
            "recordAddRecord",
            "recordDelRecord",
            "recordGet",
            "recordGetRecord",
            "recordSet",
            "recordSetRecord",
            "recordToggleRecord",
            "serviceDnsbl",
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_caddy_manage",
    "description": "Plugin caddy management - 52 available methods including: diagnosticsCaddyfile, diagnosticsConfig, diagnosticsGet, diagnosticsSet, generalGet...",
    "module": "plugins",
    "submodule": "caddy",
    "methods": [
      "diagnosticsCaddyfile",
      "diagnosticsConfig",
      "diagnosticsGet",
      "diagnosticsSet",
      "generalGet",
      "generalSet",
      "reverseProxyAddAccessList",
      "reverseProxyAddBasicAuth",
      "reverseProxyAddHandle",
      "reverseProxyAddHeader",
      "reverseProxyAddLayer4",
      "reverseProxyAddLayer4Openvpn",
      "reverseProxyAddReverseProxy",
      "reverseProxyAddSubdomain",
      "reverseProxyDelAccessList",
      "reverseProxyDelBasicAuth",
      "reverseProxyDelHandle",
      "reverseProxyDelHeader",
      "reverseProxyDelLayer4",
      "reverseProxyDelLayer4Openvpn",
      "reverseProxyDelReverseProxy",
      "reverseProxyDelSubdomain",
      "reverseProxyGet",
      "reverseProxyGetAccessList",
      "reverseProxyGetAllReverseDomains",
      "reverseProxyGetBasicAuth",
      "reverseProxyGetHandle",
      "reverseProxyGetHeader",
      "reverseProxyGetLayer4",
      "reverseProxyGetLayer4Openvpn",
      "reverseProxyGetReverseProxy",
      "reverseProxyGetSubdomain",
      "reverseProxySet",
      "reverseProxySetAccessList",
      "reverseProxySetBasicAuth",
      "reverseProxySetHandle",
      "reverseProxySetHeader",
      "reverseProxySetLayer4",
      "reverseProxySetLayer4Openvpn",
      "reverseProxySetReverseProxy",
      "reverseProxySetSubdomain",
      "reverseProxyToggleHandle",
      "reverseProxyToggleLayer4",
      "reverseProxyToggleLayer4Openvpn",
      "reverseProxyToggleReverseProxy",
      "reverseProxyToggleSubdomain",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "serviceValidate"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "diagnosticsCaddyfile",
            "diagnosticsConfig",
            "diagnosticsGet",
            "diagnosticsSet",
            "generalGet",
            "generalSet",
            "reverseProxyAddAccessList",
            "reverseProxyAddBasicAuth",
            "reverseProxyAddHandle",
            "reverseProxyAddHeader",
            "reverseProxyAddLayer4",
            "reverseProxyAddLayer4Openvpn",
            "reverseProxyAddReverseProxy",
            "reverseProxyAddSubdomain",
            "reverseProxyDelAccessList",
            "reverseProxyDelBasicAuth",
            "reverseProxyDelHandle",
            "reverseProxyDelHeader",
            "reverseProxyDelLayer4",
            "reverseProxyDelLayer4Openvpn",
            "reverseProxyDelReverseProxy",
            "reverseProxyDelSubdomain",
            "reverseProxyGet",
            "reverseProxyGetAccessList",
            "reverseProxyGetAllReverseDomains",
            "reverseProxyGetBasicAuth",
            "reverseProxyGetHandle",
            "reverseProxyGetHeader",
            "reverseProxyGetLayer4",
            "reverseProxyGetLayer4Openvpn",
            "reverseProxyGetReverseProxy",
            "reverseProxyGetSubdomain",
            "reverseProxySet",
            "reverseProxySetAccessList",
            "reverseProxySetBasicAuth",
            "reverseProxySetHandle",
            "reverseProxySetHeader",
            "reverseProxySetLayer4",
            "reverseProxySetLayer4Openvpn",
            "reverseProxySetReverseProxy",
            "reverseProxySetSubdomain",
            "reverseProxyToggleHandle",
            "reverseProxyToggleLayer4",
            "reverseProxyToggleLayer4Openvpn",
            "reverseProxyToggleReverseProxy",
            "reverseProxyToggleSubdomain",
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop",
            "serviceValidate"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_chrony_manage",
    "description": "Plugin chrony management - 11 available methods including: generalGet, generalSet, serviceChronyauthdata, serviceChronysources, serviceChronysourcestats...",
    "module": "plugins",
    "submodule": "chrony",
    "methods": [
      "generalGet",
      "generalSet",
      "serviceChronyauthdata",
      "serviceChronysources",
      "serviceChronysourcestats",
      "serviceChronytracking",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "generalGet",
            "generalSet",
            "serviceChronyauthdata",
            "serviceChronysources",
            "serviceChronysourcestats",
            "serviceChronytracking",
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_cicap_manage",
    "description": "Plugin cicap management - 10 available methods including: antivirusGet, antivirusSet, generalGet, generalSet, serviceCheckclamav...",
    "module": "plugins",
    "submodule": "cicap",
    "methods": [
      "antivirusGet",
      "antivirusSet",
      "generalGet",
      "generalSet",
      "serviceCheckclamav",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "antivirusGet",
            "antivirusSet",
            "generalGet",
            "generalSet",
            "serviceCheckclamav",
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_clamav_manage",
    "description": "Plugin clamav management - 16 available methods including: generalGet, generalSet, serviceFreshclam, serviceReconfigure, serviceRestart...",
    "module": "plugins",
    "submodule": "clamav",
    "methods": [
      "generalGet",
      "generalSet",
      "serviceFreshclam",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "serviceVersion",
      "urlAddUrl",
      "urlDelUrl",
      "urlGet",
      "urlGetUrl",
      "urlSet",
      "urlSetUrl",
      "urlToggleUrl"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "generalGet",
            "generalSet",
            "serviceFreshclam",
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop",
            "serviceVersion",
            "urlAddUrl",
            "urlDelUrl",
            "urlGet",
            "urlGetUrl",
            "urlSet",
            "urlSetUrl",
            "urlToggleUrl"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_collectd_manage",
    "description": "Plugin collectd management - 7 available methods including: generalGet, generalSet, serviceReconfigure, serviceRestart, serviceStart...",
    "module": "plugins",
    "submodule": "collectd",
    "methods": [
      "generalGet",
      "generalSet",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "generalGet",
            "generalSet",
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_crowdsec_manage",
    "description": "Plugin crowdsec management - 12 available methods including: alertsGet, bouncersGet, decisionsDelete, decisionsGet, generalGet...",
    "module": "plugins",
    "submodule": "crowdsec",
    "methods": [
      "alertsGet",
      "bouncersGet",
      "decisionsDelete",
      "decisionsGet",
      "generalGet",
      "generalSet",
      "hubGet",
      "machinesGet",
      "serviceDebug",
      "serviceReload",
      "serviceStatus",
      "versionGet"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "alertsGet",
            "bouncersGet",
            "decisionsDelete",
            "decisionsGet",
            "generalGet",
            "generalSet",
            "hubGet",
            "machinesGet",
            "serviceDebug",
            "serviceReload",
            "serviceStatus",
            "versionGet"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_dechw_manage",
    "description": "Plugin dechw management - 1 available methods including: infoPowerStatus...",
    "module": "plugins",
    "submodule": "dechw",
    "methods": [
      "infoPowerStatus"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "infoPowerStatus"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_diagnostics_manage",
    "description": "Plugin diagnostics management - 1 available methods including: proofpointEtStatus...",
    "module": "plugins",
    "submodule": "diagnostics",
    "methods": [
      "proofpointEtStatus"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "proofpointEtStatus"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_dmidecode_manage",
    "description": "Plugin dmidecode management - 1 available methods including: serviceGet...",
    "module": "plugins",
    "submodule": "dmidecode",
    "methods": [
      "serviceGet"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "serviceGet"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_dnscryptproxy_manage",
    "description": "Plugin dnscryptproxy management - 38 available methods including: cloakAddCloak, cloakDelCloak, cloakGet, cloakGetCloak, cloakSet...",
    "module": "plugins",
    "submodule": "dnscryptproxy",
    "methods": [
      "cloakAddCloak",
      "cloakDelCloak",
      "cloakGet",
      "cloakGetCloak",
      "cloakSet",
      "cloakSetCloak",
      "cloakToggleCloak",
      "dnsblGet",
      "dnsblSet",
      "forwardAddForward",
      "forwardDelForward",
      "forwardGet",
      "forwardGetForward",
      "forwardSet",
      "forwardSetForward",
      "forwardToggleForward",
      "generalGet",
      "generalSet",
      "serverAddServer",
      "serverDelServer",
      "serverGet",
      "serverGetServer",
      "serverSet",
      "serverSetServer",
      "serverToggleServer",
      "serviceDnsbl",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "whitelistAddWhitelist",
      "whitelistDelWhitelist",
      "whitelistGet",
      "whitelistGetWhitelist",
      "whitelistSet",
      "whitelistSetWhitelist",
      "whitelistToggleWhitelist"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "cloakAddCloak",
            "cloakDelCloak",
            "cloakGet",
            "cloakGetCloak",
            "cloakSet",
            "cloakSetCloak",
            "cloakToggleCloak",
            "dnsblGet",
            "dnsblSet",
            "forwardAddForward",
            "forwardDelForward",
            "forwardGet",
            "forwardGetForward",
            "forwardSet",
            "forwardSetForward",
            "forwardToggleForward",
            "generalGet",
            "generalSet",
            "serverAddServer",
            "serverDelServer",
            "serverGet",
            "serverGetServer",
            "serverSet",
            "serverSetServer",
            "serverToggleServer",
            "serviceDnsbl",
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop",
            "whitelistAddWhitelist",
            "whitelistDelWhitelist",
            "whitelistGet",
            "whitelistGetWhitelist",
            "whitelistSet",
            "whitelistSetWhitelist",
            "whitelistToggleWhitelist"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_dyndns_manage",
    "description": "Plugin dyndns management - 14 available methods including: accountsAddItem, accountsDelItem, accountsGet, accountsGetItem, accountsSet...",
    "module": "plugins",
    "submodule": "dyndns",
    "methods": [
      "accountsAddItem",
      "accountsDelItem",
      "accountsGet",
      "accountsGetItem",
      "accountsSet",
      "accountsSetItem",
      "accountsToggleItem",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "settingsGet",
      "settingsSet"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "accountsAddItem",
            "accountsDelItem",
            "accountsGet",
            "accountsGetItem",
            "accountsSet",
            "accountsSetItem",
            "accountsToggleItem",
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop",
            "settingsGet",
            "settingsSet"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_freeradius_manage",
    "description": "Plugin freeradius management - 68 available methods including: avpairAddAvpair, avpairDelAvpair, avpairGet, avpairGetAvpair, avpairSet...",
    "module": "plugins",
    "submodule": "freeradius",
    "methods": [
      "avpairAddAvpair",
      "avpairDelAvpair",
      "avpairGet",
      "avpairGetAvpair",
      "avpairSet",
      "avpairSetAvpair",
      "avpairToggleAvpair",
      "clientAddClient",
      "clientDelClient",
      "clientGet",
      "clientGetClient",
      "clientSearchClient",
      "clientSet",
      "clientSetClient",
      "clientToggleClient",
      "dhcpAddDhcp",
      "dhcpDelDhcp",
      "dhcpGet",
      "dhcpGetDhcp",
      "dhcpSet",
      "dhcpSetDhcp",
      "dhcpToggleDhcp",
      "eapGet",
      "eapSet",
      "generalGet",
      "generalSet",
      "ldapGet",
      "ldapSet",
      "leaseAddLease",
      "leaseDelLease",
      "leaseGet",
      "leaseGetLease",
      "leaseSet",
      "leaseSetLease",
      "leaseToggleLease",
      "proxyAddHomeserver",
      "proxyAddHomeserverpool",
      "proxyAddRealm",
      "proxyDelHomeserver",
      "proxyDelHomeserverpool",
      "proxyDelRealm",
      "proxyGet",
      "proxyGetHomeserver",
      "proxyGetHomeserverpool",
      "proxyGetRealm",
      "proxySearchHomeserver",
      "proxySearchHomeserverpool",
      "proxySearchRealm",
      "proxySet",
      "proxySetHomeserver",
      "proxySetHomeserverpool",
      "proxySetRealm",
      "proxyToggleHomeserver",
      "proxyToggleHomeserverpool",
      "proxyToggleRealm",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "userAddUser",
      "userDelUser",
      "userGet",
      "userGetUser",
      "userSearchUser",
      "userSet",
      "userSetUser",
      "userToggleUser"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "avpairAddAvpair",
            "avpairDelAvpair",
            "avpairGet",
            "avpairGetAvpair",
            "avpairSet",
            "avpairSetAvpair",
            "avpairToggleAvpair",
            "clientAddClient",
            "clientDelClient",
            "clientGet",
            "clientGetClient",
            "clientSearchClient",
            "clientSet",
            "clientSetClient",
            "clientToggleClient",
            "dhcpAddDhcp",
            "dhcpDelDhcp",
            "dhcpGet",
            "dhcpGetDhcp",
            "dhcpSet",
            "dhcpSetDhcp",
            "dhcpToggleDhcp",
            "eapGet",
            "eapSet",
            "generalGet",
            "generalSet",
            "ldapGet",
            "ldapSet",
            "leaseAddLease",
            "leaseDelLease",
            "leaseGet",
            "leaseGetLease",
            "leaseSet",
            "leaseSetLease",
            "leaseToggleLease",
            "proxyAddHomeserver",
            "proxyAddHomeserverpool",
            "proxyAddRealm",
            "proxyDelHomeserver",
            "proxyDelHomeserverpool",
            "proxyDelRealm",
            "proxyGet",
            "proxyGetHomeserver",
            "proxyGetHomeserverpool",
            "proxyGetRealm",
            "proxySearchHomeserver",
            "proxySearchHomeserverpool",
            "proxySearchRealm",
            "proxySet",
            "proxySetHomeserver",
            "proxySetHomeserverpool",
            "proxySetRealm",
            "proxyToggleHomeserver",
            "proxyToggleHomeserverpool",
            "proxyToggleRealm",
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop",
            "userAddUser",
            "userDelUser",
            "userGet",
            "userGetUser",
            "userSearchUser",
            "userSet",
            "userSetUser",
            "userToggleUser"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_ftpproxy_manage",
    "description": "Plugin ftpproxy management - 12 available methods including: serviceConfig, serviceReload, serviceRestart, serviceStart, serviceStatus...",
    "module": "plugins",
    "submodule": "ftpproxy",
    "methods": [
      "serviceConfig",
      "serviceReload",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "settingsAddProxy",
      "settingsDelProxy",
      "settingsGetProxy",
      "settingsSearchProxy",
      "settingsSetProxy",
      "settingsToggleProxy"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "serviceConfig",
            "serviceReload",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop",
            "settingsAddProxy",
            "settingsDelProxy",
            "settingsGetProxy",
            "settingsSearchProxy",
            "settingsSetProxy",
            "settingsToggleProxy"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_gridexample_manage",
    "description": "Plugin gridexample management - 7 available methods including: settingsAddItem, settingsDelItem, settingsGet, settingsGetItem, settingsSet...",
    "module": "plugins",
    "submodule": "gridexample",
    "methods": [
      "settingsAddItem",
      "settingsDelItem",
      "settingsGet",
      "settingsGetItem",
      "settingsSet",
      "settingsSetItem",
      "settingsToggleItem"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "settingsAddItem",
            "settingsDelItem",
            "settingsGet",
            "settingsGetItem",
            "settingsSet",
            "settingsSetItem",
            "settingsToggleItem"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_haproxy_manage",
    "description": "Plugin haproxy management - 96 available methods including: exportConfig, exportDiff, exportDownload, maintenanceCertActions, maintenanceCertDiff...",
    "module": "plugins",
    "submodule": "haproxy",
    "methods": [
      "exportConfig",
      "exportDiff",
      "exportDownload",
      "maintenanceCertActions",
      "maintenanceCertDiff",
      "maintenanceCertSync",
      "maintenanceCertSyncBulk",
      "maintenanceFetchCronIntegration",
      "maintenanceGet",
      "maintenanceSearchCertificateDiff",
      "maintenanceSearchServer",
      "maintenanceServerState",
      "maintenanceServerStateBulk",
      "maintenanceServerWeight",
      "maintenanceServerWeightBulk",
      "maintenanceSet",
      "serviceConfigtest",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "settingsAddAcl",
      "settingsAddAction",
      "settingsAddBackend",
      "settingsAddCpu",
      "settingsAddErrorfile",
      "settingsAddFcgi",
      "settingsAddFrontend",
      "settingsAddGroup",
      "settingsAddHealthcheck",
      "settingsAddLua",
      "settingsAddMapfile",
      "settingsAddServer",
      "settingsAddUser",
      "settingsAddmailer",
      "settingsAddresolver",
      "settingsDelAcl",
      "settingsDelAction",
      "settingsDelBackend",
      "settingsDelCpu",
      "settingsDelErrorfile",
      "settingsDelFcgi",
      "settingsDelFrontend",
      "settingsDelGroup",
      "settingsDelHealthcheck",
      "settingsDelLua",
      "settingsDelMapfile",
      "settingsDelServer",
      "settingsDelUser",
      "settingsDelmailer",
      "settingsDelresolver",
      "settingsGet",
      "settingsGetAcl",
      "settingsGetAction",
      "settingsGetBackend",
      "settingsGetCpu",
      "settingsGetErrorfile",
      "settingsGetFcgi",
      "settingsGetFrontend",
      "settingsGetGroup",
      "settingsGetHealthcheck",
      "settingsGetLua",
      "settingsGetMapfile",
      "settingsGetServer",
      "settingsGetUser",
      "settingsGetmailer",
      "settingsGetresolver",
      "settingsSet",
      "settingsSetAcl",
      "settingsSetAction",
      "settingsSetBackend",
      "settingsSetCpu",
      "settingsSetErrorfile",
      "settingsSetFcgi",
      "settingsSetFrontend",
      "settingsSetGroup",
      "settingsSetHealthcheck",
      "settingsSetLua",
      "settingsSetMapfile",
      "settingsSetServer",
      "settingsSetUser",
      "settingsSetmailer",
      "settingsSetresolver",
      "settingsToggleBackend",
      "settingsToggleCpu",
      "settingsToggleFrontend",
      "settingsToggleGroup",
      "settingsToggleLua",
      "settingsToggleServer",
      "settingsToggleUser",
      "settingsTogglemailer",
      "settingsToggleresolver",
      "statisticsCounters",
      "statisticsInfo",
      "statisticsTables"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "exportConfig",
            "exportDiff",
            "exportDownload",
            "maintenanceCertActions",
            "maintenanceCertDiff",
            "maintenanceCertSync",
            "maintenanceCertSyncBulk",
            "maintenanceFetchCronIntegration",
            "maintenanceGet",
            "maintenanceSearchCertificateDiff",
            "maintenanceSearchServer",
            "maintenanceServerState",
            "maintenanceServerStateBulk",
            "maintenanceServerWeight",
            "maintenanceServerWeightBulk",
            "maintenanceSet",
            "serviceConfigtest",
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop",
            "settingsAddAcl",
            "settingsAddAction",
            "settingsAddBackend",
            "settingsAddCpu",
            "settingsAddErrorfile",
            "settingsAddFcgi",
            "settingsAddFrontend",
            "settingsAddGroup",
            "settingsAddHealthcheck",
            "settingsAddLua",
            "settingsAddMapfile",
            "settingsAddServer",
            "settingsAddUser",
            "settingsAddmailer",
            "settingsAddresolver",
            "settingsDelAcl",
            "settingsDelAction",
            "settingsDelBackend",
            "settingsDelCpu",
            "settingsDelErrorfile",
            "settingsDelFcgi",
            "settingsDelFrontend",
            "settingsDelGroup",
            "settingsDelHealthcheck",
            "settingsDelLua",
            "settingsDelMapfile",
            "settingsDelServer",
            "settingsDelUser",
            "settingsDelmailer",
            "settingsDelresolver",
            "settingsGet",
            "settingsGetAcl",
            "settingsGetAction",
            "settingsGetBackend",
            "settingsGetCpu",
            "settingsGetErrorfile",
            "settingsGetFcgi",
            "settingsGetFrontend",
            "settingsGetGroup",
            "settingsGetHealthcheck",
            "settingsGetLua",
            "settingsGetMapfile",
            "settingsGetServer",
            "settingsGetUser",
            "settingsGetmailer",
            "settingsGetresolver",
            "settingsSet",
            "settingsSetAcl",
            "settingsSetAction",
            "settingsSetBackend",
            "settingsSetCpu",
            "settingsSetErrorfile",
            "settingsSetFcgi",
            "settingsSetFrontend",
            "settingsSetGroup",
            "settingsSetHealthcheck",
            "settingsSetLua",
            "settingsSetMapfile",
            "settingsSetServer",
            "settingsSetUser",
            "settingsSetmailer",
            "settingsSetresolver",
            "settingsToggleBackend",
            "settingsToggleCpu",
            "settingsToggleFrontend",
            "settingsToggleGroup",
            "settingsToggleLua",
            "settingsToggleServer",
            "settingsToggleUser",
            "settingsTogglemailer",
            "settingsToggleresolver",
            "statisticsCounters",
            "statisticsInfo",
            "statisticsTables"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_helloworld_manage",
    "description": "Plugin helloworld management - 4 available methods including: serviceReload, serviceTest, settingsGet, settingsSet...",
    "module": "plugins",
    "submodule": "helloworld",
    "methods": [
      "serviceReload",
      "serviceTest",
      "settingsGet",
      "settingsSet"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "serviceReload",
            "serviceTest",
            "settingsGet",
            "settingsSet"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_hwprobe_manage",
    "description": "Plugin hwprobe management - 8 available methods including: generalGet, generalSet, serviceReconfigure, serviceReport, serviceRestart...",
    "module": "plugins",
    "submodule": "hwprobe",
    "methods": [
      "generalGet",
      "generalSet",
      "serviceReconfigure",
      "serviceReport",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "generalGet",
            "generalSet",
            "serviceReconfigure",
            "serviceReport",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_iperf_manage",
    "description": "Plugin iperf management - 7 available methods including: instanceGet, instanceQuery, instanceSet, serviceRestart, serviceStart...",
    "module": "plugins",
    "submodule": "iperf",
    "methods": [
      "instanceGet",
      "instanceQuery",
      "instanceSet",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "instanceGet",
            "instanceQuery",
            "instanceSet",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_lldpd_manage",
    "description": "Plugin lldpd management - 8 available methods including: generalGet, generalSet, serviceNeighbor, serviceReconfigure, serviceRestart...",
    "module": "plugins",
    "submodule": "lldpd",
    "methods": [
      "generalGet",
      "generalSet",
      "serviceNeighbor",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "generalGet",
            "generalSet",
            "serviceNeighbor",
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_maltrail_manage",
    "description": "Plugin maltrail management - 16 available methods including: generalGet, generalSet, sensorGet, sensorSet, serverGet...",
    "module": "plugins",
    "submodule": "maltrail",
    "methods": [
      "generalGet",
      "generalSet",
      "sensorGet",
      "sensorSet",
      "serverGet",
      "serverSet",
      "serverserviceReconfigure",
      "serverserviceRestart",
      "serverserviceStart",
      "serverserviceStatus",
      "serverserviceStop",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "generalGet",
            "generalSet",
            "sensorGet",
            "sensorSet",
            "serverGet",
            "serverSet",
            "serverserviceReconfigure",
            "serverserviceRestart",
            "serverserviceStart",
            "serverserviceStatus",
            "serverserviceStop",
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_mdnsrepeater_manage",
    "description": "Plugin mdnsrepeater management - 7 available methods including: serviceReconfigure, serviceRestart, serviceStart, serviceStatus, serviceStop...",
    "module": "plugins",
    "submodule": "mdnsrepeater",
    "methods": [
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "settingsGet",
      "settingsSet"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop",
            "settingsGet",
            "settingsSet"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_muninnode_manage",
    "description": "Plugin muninnode management - 7 available methods including: generalGet, generalSet, serviceReconfigure, serviceRestart, serviceStart...",
    "module": "plugins",
    "submodule": "muninnode",
    "methods": [
      "generalGet",
      "generalSet",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "generalGet",
            "generalSet",
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_ndproxy_manage",
    "description": "Plugin ndproxy management - 7 available methods including: generalGet, generalSet, serviceReconfigure, serviceRestart, serviceStart...",
    "module": "plugins",
    "submodule": "ndproxy",
    "methods": [
      "generalGet",
      "generalSet",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "generalGet",
            "generalSet",
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_netdata_manage",
    "description": "Plugin netdata management - 7 available methods including: generalGet, generalSet, serviceReconfigure, serviceRestart, serviceStart...",
    "module": "plugins",
    "submodule": "netdata",
    "methods": [
      "generalGet",
      "generalSet",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "generalGet",
            "generalSet",
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_netsnmp_manage",
    "description": "Plugin netsnmp management - 14 available methods including: generalGet, generalSet, serviceReconfigure, serviceRestart, serviceStart...",
    "module": "plugins",
    "submodule": "netsnmp",
    "methods": [
      "generalGet",
      "generalSet",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "userAddUser",
      "userDelUser",
      "userGet",
      "userGetUser",
      "userSet",
      "userSetUser",
      "userToggleUser"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "generalGet",
            "generalSet",
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop",
            "userAddUser",
            "userDelUser",
            "userGet",
            "userGetUser",
            "userSet",
            "userSetUser",
            "userToggleUser"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_nginx_manage",
    "description": "Plugin nginx management - 99 available methods including: bansDelban, bansGet, bansSet, logsAccesses, logsErrors...",
    "module": "plugins",
    "submodule": "nginx",
    "methods": [
      "bansDelban",
      "bansGet",
      "bansSet",
      "logsAccesses",
      "logsErrors",
      "logsStreamaccesses",
      "logsStreamerrors",
      "logsTlsHandshakes",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "serviceVts",
      "settingsAddcachePath",
      "settingsAddcredential",
      "settingsAddcustompolicy",
      "settingsAdderrorpage",
      "settingsAddhttprewrite",
      "settingsAddhttpserver",
      "settingsAddipacl",
      "settingsAddlimitRequestConnection",
      "settingsAddlimitZone",
      "settingsAddlocation",
      "settingsAddnaxsirule",
      "settingsAddresolver",
      "settingsAddsecurityHeader",
      "settingsAddsnifwd",
      "settingsAddstreamserver",
      "settingsAddsyslogTarget",
      "settingsAddtlsFingerprint",
      "settingsAddupstream",
      "settingsAddupstreamserver",
      "settingsAdduserlist",
      "settingsDelcachePath",
      "settingsDelcredential",
      "settingsDelcustompolicy",
      "settingsDelerrorpage",
      "settingsDelhttprewrite",
      "settingsDelhttpserver",
      "settingsDelipacl",
      "settingsDellimitRequestConnection",
      "settingsDellimitZone",
      "settingsDellocation",
      "settingsDelnaxsirule",
      "settingsDelresolver",
      "settingsDelsecurityHeader",
      "settingsDelsnifwd",
      "settingsDelstreamserver",
      "settingsDelsyslogTarget",
      "settingsDeltlsFingerprint",
      "settingsDelupstream",
      "settingsDelupstreamserver",
      "settingsDeluserlist",
      "settingsDownloadrules",
      "settingsGet",
      "settingsGetcachePath",
      "settingsGetcredential",
      "settingsGetcustompolicy",
      "settingsGeterrorpage",
      "settingsGethttprewrite",
      "settingsGethttpserver",
      "settingsGetipacl",
      "settingsGetlimitRequestConnection",
      "settingsGetlimitZone",
      "settingsGetlocation",
      "settingsGetnaxsirule",
      "settingsGetresolver",
      "settingsGetsecurityHeader",
      "settingsGetsnifwd",
      "settingsGetstreamserver",
      "settingsGetsyslogTarget",
      "settingsGettlsFingerprint",
      "settingsGetupstream",
      "settingsGetupstreamserver",
      "settingsGetuserlist",
      "settingsSet",
      "settingsSetcachePath",
      "settingsSetcredential",
      "settingsSetcustompolicy",
      "settingsSeterrorpage",
      "settingsSethttprewrite",
      "settingsSethttpserver",
      "settingsSetipacl",
      "settingsSetlimitRequestConnection",
      "settingsSetlimitZone",
      "settingsSetlocation",
      "settingsSetnaxsirule",
      "settingsSetresolver",
      "settingsSetsecurityHeader",
      "settingsSetsnifwd",
      "settingsSetstreamserver",
      "settingsSetsyslogTarget",
      "settingsSettlsFingerprint",
      "settingsSetupstream",
      "settingsSetupstreamserver",
      "settingsSetuserlist",
      "settingsShowconfig",
      "settingsTestconfig"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "bansDelban",
            "bansGet",
            "bansSet",
            "logsAccesses",
            "logsErrors",
            "logsStreamaccesses",
            "logsStreamerrors",
            "logsTlsHandshakes",
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop",
            "serviceVts",
            "settingsAddcachePath",
            "settingsAddcredential",
            "settingsAddcustompolicy",
            "settingsAdderrorpage",
            "settingsAddhttprewrite",
            "settingsAddhttpserver",
            "settingsAddipacl",
            "settingsAddlimitRequestConnection",
            "settingsAddlimitZone",
            "settingsAddlocation",
            "settingsAddnaxsirule",
            "settingsAddresolver",
            "settingsAddsecurityHeader",
            "settingsAddsnifwd",
            "settingsAddstreamserver",
            "settingsAddsyslogTarget",
            "settingsAddtlsFingerprint",
            "settingsAddupstream",
            "settingsAddupstreamserver",
            "settingsAdduserlist",
            "settingsDelcachePath",
            "settingsDelcredential",
            "settingsDelcustompolicy",
            "settingsDelerrorpage",
            "settingsDelhttprewrite",
            "settingsDelhttpserver",
            "settingsDelipacl",
            "settingsDellimitRequestConnection",
            "settingsDellimitZone",
            "settingsDellocation",
            "settingsDelnaxsirule",
            "settingsDelresolver",
            "settingsDelsecurityHeader",
            "settingsDelsnifwd",
            "settingsDelstreamserver",
            "settingsDelsyslogTarget",
            "settingsDeltlsFingerprint",
            "settingsDelupstream",
            "settingsDelupstreamserver",
            "settingsDeluserlist",
            "settingsDownloadrules",
            "settingsGet",
            "settingsGetcachePath",
            "settingsGetcredential",
            "settingsGetcustompolicy",
            "settingsGeterrorpage",
            "settingsGethttprewrite",
            "settingsGethttpserver",
            "settingsGetipacl",
            "settingsGetlimitRequestConnection",
            "settingsGetlimitZone",
            "settingsGetlocation",
            "settingsGetnaxsirule",
            "settingsGetresolver",
            "settingsGetsecurityHeader",
            "settingsGetsnifwd",
            "settingsGetstreamserver",
            "settingsGetsyslogTarget",
            "settingsGettlsFingerprint",
            "settingsGetupstream",
            "settingsGetupstreamserver",
            "settingsGetuserlist",
            "settingsSet",
            "settingsSetcachePath",
            "settingsSetcredential",
            "settingsSetcustompolicy",
            "settingsSeterrorpage",
            "settingsSethttprewrite",
            "settingsSethttpserver",
            "settingsSetipacl",
            "settingsSetlimitRequestConnection",
            "settingsSetlimitZone",
            "settingsSetlocation",
            "settingsSetnaxsirule",
            "settingsSetresolver",
            "settingsSetsecurityHeader",
            "settingsSetsnifwd",
            "settingsSetstreamserver",
            "settingsSetsyslogTarget",
            "settingsSettlsFingerprint",
            "settingsSetupstream",
            "settingsSetupstreamserver",
            "settingsSetuserlist",
            "settingsShowconfig",
            "settingsTestconfig"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_nodeexporter_manage",
    "description": "Plugin nodeexporter management - 7 available methods including: generalGet, generalSet, serviceReconfigure, serviceRestart, serviceStart...",
    "module": "plugins",
    "submodule": "nodeexporter",
    "methods": [
      "generalGet",
      "generalSet",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "generalGet",
            "generalSet",
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_nrpe_manage",
    "description": "Plugin nrpe management - 14 available methods including: commandAddCommand, commandDelCommand, commandGet, commandGetCommand, commandSet...",
    "module": "plugins",
    "submodule": "nrpe",
    "methods": [
      "commandAddCommand",
      "commandDelCommand",
      "commandGet",
      "commandGetCommand",
      "commandSet",
      "commandSetCommand",
      "commandToggleCommand",
      "generalGet",
      "generalSet",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "commandAddCommand",
            "commandDelCommand",
            "commandGet",
            "commandGetCommand",
            "commandSet",
            "commandSetCommand",
            "commandToggleCommand",
            "generalGet",
            "generalSet",
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_ntopng_manage",
    "description": "Plugin ntopng management - 8 available methods including: generalGet, generalSet, serviceCheckredis, serviceReconfigure, serviceRestart...",
    "module": "plugins",
    "submodule": "ntopng",
    "methods": [
      "generalGet",
      "generalSet",
      "serviceCheckredis",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "generalGet",
            "generalSet",
            "serviceCheckredis",
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_nut_manage",
    "description": "Plugin nut management - 8 available methods including: diagnosticsUpsstatus, serviceReconfigure, serviceRestart, serviceStart, serviceStatus...",
    "module": "plugins",
    "submodule": "nut",
    "methods": [
      "diagnosticsUpsstatus",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "settingsGet",
      "settingsSet"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "diagnosticsUpsstatus",
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop",
            "settingsGet",
            "settingsSet"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_openconnect_manage",
    "description": "Plugin openconnect management - 7 available methods including: generalGet, generalSet, serviceReconfigure, serviceRestart, serviceStart...",
    "module": "plugins",
    "submodule": "openconnect",
    "methods": [
      "generalGet",
      "generalSet",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "generalGet",
            "generalSet",
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_postfix_manage",
    "description": "Plugin postfix management - 66 available methods including: addressAddAddress, addressDelAddress, addressGet, addressGetAddress, addressSet...",
    "module": "plugins",
    "submodule": "postfix",
    "methods": [
      "addressAddAddress",
      "addressDelAddress",
      "addressGet",
      "addressGetAddress",
      "addressSet",
      "addressSetAddress",
      "addressToggleAddress",
      "antispamGet",
      "antispamSet",
      "domainAddDomain",
      "domainDelDomain",
      "domainGet",
      "domainGetDomain",
      "domainSet",
      "domainSetDomain",
      "domainToggleDomain",
      "generalGet",
      "generalSet",
      "headerchecksAddHeadercheck",
      "headerchecksDelHeadercheck",
      "headerchecksGet",
      "headerchecksGetHeadercheck",
      "headerchecksSet",
      "headerchecksSetHeadercheck",
      "headerchecksToggleHeadercheck",
      "recipientAddRecipient",
      "recipientDelRecipient",
      "recipientGet",
      "recipientGetRecipient",
      "recipientSet",
      "recipientSetRecipient",
      "recipientToggleRecipient",
      "recipientbccAddRecipientbcc",
      "recipientbccDelRecipientbcc",
      "recipientbccGet",
      "recipientbccGetRecipientbcc",
      "recipientbccSet",
      "recipientbccSetRecipientbcc",
      "recipientbccToggleRecipientbcc",
      "senderAddSender",
      "senderDelSender",
      "senderGet",
      "senderGetSender",
      "senderSet",
      "senderSetSender",
      "senderToggleSender",
      "senderbccAddSenderbcc",
      "senderbccDelSenderbcc",
      "senderbccGet",
      "senderbccGetSenderbcc",
      "senderbccSet",
      "senderbccSetSenderbcc",
      "senderbccToggleSenderbcc",
      "sendercanonicalAddSendercanonical",
      "sendercanonicalDelSendercanonical",
      "sendercanonicalGet",
      "sendercanonicalGetSendercanonical",
      "sendercanonicalSet",
      "sendercanonicalSetSendercanonical",
      "sendercanonicalToggleSendercanonical",
      "serviceCheckrspamd",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "addressAddAddress",
            "addressDelAddress",
            "addressGet",
            "addressGetAddress",
            "addressSet",
            "addressSetAddress",
            "addressToggleAddress",
            "antispamGet",
            "antispamSet",
            "domainAddDomain",
            "domainDelDomain",
            "domainGet",
            "domainGetDomain",
            "domainSet",
            "domainSetDomain",
            "domainToggleDomain",
            "generalGet",
            "generalSet",
            "headerchecksAddHeadercheck",
            "headerchecksDelHeadercheck",
            "headerchecksGet",
            "headerchecksGetHeadercheck",
            "headerchecksSet",
            "headerchecksSetHeadercheck",
            "headerchecksToggleHeadercheck",
            "recipientAddRecipient",
            "recipientDelRecipient",
            "recipientGet",
            "recipientGetRecipient",
            "recipientSet",
            "recipientSetRecipient",
            "recipientToggleRecipient",
            "recipientbccAddRecipientbcc",
            "recipientbccDelRecipientbcc",
            "recipientbccGet",
            "recipientbccGetRecipientbcc",
            "recipientbccSet",
            "recipientbccSetRecipientbcc",
            "recipientbccToggleRecipientbcc",
            "senderAddSender",
            "senderDelSender",
            "senderGet",
            "senderGetSender",
            "senderSet",
            "senderSetSender",
            "senderToggleSender",
            "senderbccAddSenderbcc",
            "senderbccDelSenderbcc",
            "senderbccGet",
            "senderbccGetSenderbcc",
            "senderbccSet",
            "senderbccSetSenderbcc",
            "senderbccToggleSenderbcc",
            "sendercanonicalAddSendercanonical",
            "sendercanonicalDelSendercanonical",
            "sendercanonicalGet",
            "sendercanonicalGetSendercanonical",
            "sendercanonicalSet",
            "sendercanonicalSetSendercanonical",
            "sendercanonicalToggleSendercanonical",
            "serviceCheckrspamd",
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_proxy_manage",
    "description": "Plugin proxy management - 48 available methods including: serviceDownloadacls, serviceFetchacls, serviceReconfigure, serviceRefreshTemplate, serviceReset...",
    "module": "plugins",
    "submodule": "proxy",
    "methods": [
      "serviceDownloadacls",
      "serviceFetchacls",
      "serviceReconfigure",
      "serviceRefreshTemplate",
      "serviceReset",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "settingsAddPACMatch",
      "settingsAddPACProxy",
      "settingsAddPACRule",
      "settingsAddRemoteBlacklist",
      "settingsDelPACMatch",
      "settingsDelPACProxy",
      "settingsDelPACRule",
      "settingsDelRemoteBlacklist",
      "settingsFetchRBCron",
      "settingsGet",
      "settingsGetPACMatch",
      "settingsGetPACProxy",
      "settingsGetPACRule",
      "settingsGetRemoteBlacklist",
      "settingsSearchRemoteBlacklists",
      "settingsSet",
      "settingsSetPACMatch",
      "settingsSetPACProxy",
      "settingsSetPACRule",
      "settingsSetRemoteBlacklist",
      "settingsTogglePACRule",
      "settingsToggleRemoteBlacklist",
      "templateGet",
      "templateReset",
      "templateSet",
      "aclAddCustomPolicy",
      "aclAddPolicy",
      "aclApply",
      "aclDelCustomPolicy",
      "aclDelPolicy",
      "aclGet",
      "aclGetCustomPolicy",
      "aclGetPolicy",
      "aclSet",
      "aclSetCustomPolicy",
      "aclSetPolicy",
      "aclTest",
      "aclToggleCustomPolicy",
      "aclTogglePolicy"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "serviceDownloadacls",
            "serviceFetchacls",
            "serviceReconfigure",
            "serviceRefreshTemplate",
            "serviceReset",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop",
            "settingsAddPACMatch",
            "settingsAddPACProxy",
            "settingsAddPACRule",
            "settingsAddRemoteBlacklist",
            "settingsDelPACMatch",
            "settingsDelPACProxy",
            "settingsDelPACRule",
            "settingsDelRemoteBlacklist",
            "settingsFetchRBCron",
            "settingsGet",
            "settingsGetPACMatch",
            "settingsGetPACProxy",
            "settingsGetPACRule",
            "settingsGetRemoteBlacklist",
            "settingsSearchRemoteBlacklists",
            "settingsSet",
            "settingsSetPACMatch",
            "settingsSetPACProxy",
            "settingsSetPACRule",
            "settingsSetRemoteBlacklist",
            "settingsTogglePACRule",
            "settingsToggleRemoteBlacklist",
            "templateGet",
            "templateReset",
            "templateSet",
            "aclAddCustomPolicy",
            "aclAddPolicy",
            "aclApply",
            "aclDelCustomPolicy",
            "aclDelPolicy",
            "aclGet",
            "aclGetCustomPolicy",
            "aclGetPolicy",
            "aclSet",
            "aclSetCustomPolicy",
            "aclSetPolicy",
            "aclTest",
            "aclToggleCustomPolicy",
            "aclTogglePolicy"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_proxysso_manage",
    "description": "Plugin proxysso management - 7 available methods including: serviceCreatekeytab, serviceDeletekeytab, serviceGetCheckList, serviceShowkeytab, serviceTestkerblogin...",
    "module": "plugins",
    "submodule": "proxysso",
    "methods": [
      "serviceCreatekeytab",
      "serviceDeletekeytab",
      "serviceGetCheckList",
      "serviceShowkeytab",
      "serviceTestkerblogin",
      "settingsGet",
      "settingsSet"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "serviceCreatekeytab",
            "serviceDeletekeytab",
            "serviceGetCheckList",
            "serviceShowkeytab",
            "serviceTestkerblogin",
            "settingsGet",
            "settingsSet"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_puppetagent_manage",
    "description": "Plugin puppetagent management - 7 available methods including: serviceReconfigure, serviceRestart, serviceStart, serviceStatus, serviceStop...",
    "module": "plugins",
    "submodule": "puppetagent",
    "methods": [
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "settingsGet",
      "settingsSet"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop",
            "settingsGet",
            "settingsSet"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_qemuguestagent_manage",
    "description": "Plugin qemuguestagent management - 7 available methods including: serviceReconfigure, serviceRestart, serviceStart, serviceStatus, serviceStop...",
    "module": "plugins",
    "submodule": "qemuguestagent",
    "methods": [
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "settingsGet",
      "settingsSet"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop",
            "settingsGet",
            "settingsSet"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_quagga_manage",
    "description": "Plugin quagga management - 133 available methods including: bfdAddNeighbor, bfdDelNeighbor, bfdGet, bfdGetNeighbor, bfdSet...",
    "module": "plugins",
    "submodule": "quagga",
    "methods": [
      "bfdAddNeighbor",
      "bfdDelNeighbor",
      "bfdGet",
      "bfdGetNeighbor",
      "bfdSet",
      "bfdSetNeighbor",
      "bfdToggleNeighbor",
      "bgpAddAspath",
      "bgpAddCommunitylist",
      "bgpAddNeighbor",
      "bgpAddPeergroup",
      "bgpAddPrefixlist",
      "bgpAddRedistribution",
      "bgpAddRoutemap",
      "bgpDelAspath",
      "bgpDelCommunitylist",
      "bgpDelNeighbor",
      "bgpDelPeergroup",
      "bgpDelPrefixlist",
      "bgpDelRedistribution",
      "bgpDelRoutemap",
      "bgpGet",
      "bgpGetAspath",
      "bgpGetCommunitylist",
      "bgpGetNeighbor",
      "bgpGetPeergroup",
      "bgpGetPrefixlist",
      "bgpGetRedistribution",
      "bgpGetRoutemap",
      "bgpSet",
      "bgpSetAspath",
      "bgpSetCommunitylist",
      "bgpSetNeighbor",
      "bgpSetPeergroup",
      "bgpSetPrefixlist",
      "bgpSetRedistribution",
      "bgpSetRoutemap",
      "bgpToggleAspath",
      "bgpToggleCommunitylist",
      "bgpToggleNeighbor",
      "bgpTogglePeergroup",
      "bgpTogglePrefixlist",
      "bgpToggleRedistribution",
      "bgpToggleRoutemap",
      "diagnosticsBfdcounters",
      "diagnosticsBfdneighbors",
      "diagnosticsBfdsummary",
      "diagnosticsBgpneighbors",
      "diagnosticsBgpsummary",
      "diagnosticsGeneralrunningconfig",
      "diagnosticsOspfdatabase",
      "diagnosticsOspfinterface",
      "diagnosticsOspfoverview",
      "diagnosticsOspfv3interface",
      "diagnosticsOspfv3overview",
      "diagnosticsSearchBgproute4",
      "diagnosticsSearchBgproute6",
      "diagnosticsSearchGeneralroute4",
      "diagnosticsSearchGeneralroute6",
      "diagnosticsSearchOspfneighbor",
      "diagnosticsSearchOspfroute",
      "diagnosticsSearchOspfv3database",
      "diagnosticsSearchOspfv3route",
      "generalGet",
      "generalSet",
      "ospf6settingsAddInterface",
      "ospf6settingsAddNetwork",
      "ospf6settingsAddPrefixlist",
      "ospf6settingsAddRedistribution",
      "ospf6settingsAddRoutemap",
      "ospf6settingsDelInterface",
      "ospf6settingsDelNetwork",
      "ospf6settingsDelPrefixlist",
      "ospf6settingsDelRedistribution",
      "ospf6settingsDelRoutemap",
      "ospf6settingsGet",
      "ospf6settingsGetInterface",
      "ospf6settingsGetNetwork",
      "ospf6settingsGetPrefixlist",
      "ospf6settingsGetRedistribution",
      "ospf6settingsGetRoutemap",
      "ospf6settingsSet",
      "ospf6settingsSetInterface",
      "ospf6settingsSetNetwork",
      "ospf6settingsSetPrefixlist",
      "ospf6settingsSetRedistribution",
      "ospf6settingsSetRoutemap",
      "ospf6settingsToggleInterface",
      "ospf6settingsToggleNetwork",
      "ospf6settingsTogglePrefixlist",
      "ospf6settingsToggleRedistribution",
      "ospf6settingsToggleRoutemap",
      "ospfsettingsAddInterface",
      "ospfsettingsAddNetwork",
      "ospfsettingsAddPrefixlist",
      "ospfsettingsAddRedistribution",
      "ospfsettingsAddRoutemap",
      "ospfsettingsDelInterface",
      "ospfsettingsDelNetwork",
      "ospfsettingsDelPrefixlist",
      "ospfsettingsDelRedistribution",
      "ospfsettingsDelRoutemap",
      "ospfsettingsGet",
      "ospfsettingsGetInterface",
      "ospfsettingsGetNetwork",
      "ospfsettingsGetPrefixlist",
      "ospfsettingsGetRedistribution",
      "ospfsettingsGetRoutemap",
      "ospfsettingsSet",
      "ospfsettingsSetInterface",
      "ospfsettingsSetNetwork",
      "ospfsettingsSetPrefixlist",
      "ospfsettingsSetRedistribution",
      "ospfsettingsSetRoutemap",
      "ospfsettingsToggleInterface",
      "ospfsettingsToggleNetwork",
      "ospfsettingsTogglePrefixlist",
      "ospfsettingsToggleRedistribution",
      "ospfsettingsToggleRoutemap",
      "ripGet",
      "ripSet",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "staticAddRoute",
      "staticDelRoute",
      "staticGet",
      "staticGetRoute",
      "staticSet",
      "staticSetRoute",
      "staticToggleRoute"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "bfdAddNeighbor",
            "bfdDelNeighbor",
            "bfdGet",
            "bfdGetNeighbor",
            "bfdSet",
            "bfdSetNeighbor",
            "bfdToggleNeighbor",
            "bgpAddAspath",
            "bgpAddCommunitylist",
            "bgpAddNeighbor",
            "bgpAddPeergroup",
            "bgpAddPrefixlist",
            "bgpAddRedistribution",
            "bgpAddRoutemap",
            "bgpDelAspath",
            "bgpDelCommunitylist",
            "bgpDelNeighbor",
            "bgpDelPeergroup",
            "bgpDelPrefixlist",
            "bgpDelRedistribution",
            "bgpDelRoutemap",
            "bgpGet",
            "bgpGetAspath",
            "bgpGetCommunitylist",
            "bgpGetNeighbor",
            "bgpGetPeergroup",
            "bgpGetPrefixlist",
            "bgpGetRedistribution",
            "bgpGetRoutemap",
            "bgpSet",
            "bgpSetAspath",
            "bgpSetCommunitylist",
            "bgpSetNeighbor",
            "bgpSetPeergroup",
            "bgpSetPrefixlist",
            "bgpSetRedistribution",
            "bgpSetRoutemap",
            "bgpToggleAspath",
            "bgpToggleCommunitylist",
            "bgpToggleNeighbor",
            "bgpTogglePeergroup",
            "bgpTogglePrefixlist",
            "bgpToggleRedistribution",
            "bgpToggleRoutemap",
            "diagnosticsBfdcounters",
            "diagnosticsBfdneighbors",
            "diagnosticsBfdsummary",
            "diagnosticsBgpneighbors",
            "diagnosticsBgpsummary",
            "diagnosticsGeneralrunningconfig",
            "diagnosticsOspfdatabase",
            "diagnosticsOspfinterface",
            "diagnosticsOspfoverview",
            "diagnosticsOspfv3interface",
            "diagnosticsOspfv3overview",
            "diagnosticsSearchBgproute4",
            "diagnosticsSearchBgproute6",
            "diagnosticsSearchGeneralroute4",
            "diagnosticsSearchGeneralroute6",
            "diagnosticsSearchOspfneighbor",
            "diagnosticsSearchOspfroute",
            "diagnosticsSearchOspfv3database",
            "diagnosticsSearchOspfv3route",
            "generalGet",
            "generalSet",
            "ospf6settingsAddInterface",
            "ospf6settingsAddNetwork",
            "ospf6settingsAddPrefixlist",
            "ospf6settingsAddRedistribution",
            "ospf6settingsAddRoutemap",
            "ospf6settingsDelInterface",
            "ospf6settingsDelNetwork",
            "ospf6settingsDelPrefixlist",
            "ospf6settingsDelRedistribution",
            "ospf6settingsDelRoutemap",
            "ospf6settingsGet",
            "ospf6settingsGetInterface",
            "ospf6settingsGetNetwork",
            "ospf6settingsGetPrefixlist",
            "ospf6settingsGetRedistribution",
            "ospf6settingsGetRoutemap",
            "ospf6settingsSet",
            "ospf6settingsSetInterface",
            "ospf6settingsSetNetwork",
            "ospf6settingsSetPrefixlist",
            "ospf6settingsSetRedistribution",
            "ospf6settingsSetRoutemap",
            "ospf6settingsToggleInterface",
            "ospf6settingsToggleNetwork",
            "ospf6settingsTogglePrefixlist",
            "ospf6settingsToggleRedistribution",
            "ospf6settingsToggleRoutemap",
            "ospfsettingsAddInterface",
            "ospfsettingsAddNetwork",
            "ospfsettingsAddPrefixlist",
            "ospfsettingsAddRedistribution",
            "ospfsettingsAddRoutemap",
            "ospfsettingsDelInterface",
            "ospfsettingsDelNetwork",
            "ospfsettingsDelPrefixlist",
            "ospfsettingsDelRedistribution",
            "ospfsettingsDelRoutemap",
            "ospfsettingsGet",
            "ospfsettingsGetInterface",
            "ospfsettingsGetNetwork",
            "ospfsettingsGetPrefixlist",
            "ospfsettingsGetRedistribution",
            "ospfsettingsGetRoutemap",
            "ospfsettingsSet",
            "ospfsettingsSetInterface",
            "ospfsettingsSetNetwork",
            "ospfsettingsSetPrefixlist",
            "ospfsettingsSetRedistribution",
            "ospfsettingsSetRoutemap",
            "ospfsettingsToggleInterface",
            "ospfsettingsToggleNetwork",
            "ospfsettingsTogglePrefixlist",
            "ospfsettingsToggleRedistribution",
            "ospfsettingsToggleRoutemap",
            "ripGet",
            "ripSet",
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop",
            "staticAddRoute",
            "staticDelRoute",
            "staticGet",
            "staticGetRoute",
            "staticSet",
            "staticSetRoute",
            "staticToggleRoute"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_radsecproxy_manage",
    "description": "Plugin radsecproxy management - 42 available methods including: clientsAddItem, clientsDelItem, clientsGet, clientsGetItem, clientsSet...",
    "module": "plugins",
    "submodule": "radsecproxy",
    "methods": [
      "clientsAddItem",
      "clientsDelItem",
      "clientsGet",
      "clientsGetItem",
      "clientsSet",
      "clientsSetItem",
      "clientsToggleItem",
      "generalGet",
      "generalSet",
      "realmsAddItem",
      "realmsDelItem",
      "realmsGet",
      "realmsGetItem",
      "realmsSet",
      "realmsSetItem",
      "realmsToggleItem",
      "rewritesAddItem",
      "rewritesDelItem",
      "rewritesGet",
      "rewritesGetItem",
      "rewritesSet",
      "rewritesSetItem",
      "rewritesToggleItem",
      "serversAddItem",
      "serversDelItem",
      "serversGet",
      "serversGetItem",
      "serversSet",
      "serversSetItem",
      "serversToggleItem",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "tlsAddItem",
      "tlsDelItem",
      "tlsGet",
      "tlsGetItem",
      "tlsSet",
      "tlsSetItem",
      "tlsToggleItem"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "clientsAddItem",
            "clientsDelItem",
            "clientsGet",
            "clientsGetItem",
            "clientsSet",
            "clientsSetItem",
            "clientsToggleItem",
            "generalGet",
            "generalSet",
            "realmsAddItem",
            "realmsDelItem",
            "realmsGet",
            "realmsGetItem",
            "realmsSet",
            "realmsSetItem",
            "realmsToggleItem",
            "rewritesAddItem",
            "rewritesDelItem",
            "rewritesGet",
            "rewritesGetItem",
            "rewritesSet",
            "rewritesSetItem",
            "rewritesToggleItem",
            "serversAddItem",
            "serversDelItem",
            "serversGet",
            "serversGetItem",
            "serversSet",
            "serversSetItem",
            "serversToggleItem",
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop",
            "tlsAddItem",
            "tlsDelItem",
            "tlsGet",
            "tlsGetItem",
            "tlsSet",
            "tlsSetItem",
            "tlsToggleItem"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_redis_manage",
    "description": "Plugin redis management - 8 available methods including: serviceReconfigure, serviceResetdb, serviceRestart, serviceStart, serviceStatus...",
    "module": "plugins",
    "submodule": "redis",
    "methods": [
      "serviceReconfigure",
      "serviceResetdb",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "settingsGet",
      "settingsSet"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "serviceReconfigure",
            "serviceResetdb",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop",
            "settingsGet",
            "settingsSet"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_relayd_manage",
    "description": "Plugin relayd management - 14 available methods including: serviceConfigtest, serviceReconfigure, serviceRestart, serviceStart, serviceStatus...",
    "module": "plugins",
    "submodule": "relayd",
    "methods": [
      "serviceConfigtest",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "settingsDel",
      "settingsDirty",
      "settingsGet",
      "settingsSearch",
      "settingsSet",
      "settingsToggle",
      "statusSum",
      "statusToggle"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "serviceConfigtest",
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop",
            "settingsDel",
            "settingsDirty",
            "settingsGet",
            "settingsSearch",
            "settingsSet",
            "settingsToggle",
            "statusSum",
            "statusToggle"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_rspamd_manage",
    "description": "Plugin rspamd management - 7 available methods including: serviceReconfigure, serviceRestart, serviceStart, serviceStatus, serviceStop...",
    "module": "plugins",
    "submodule": "rspamd",
    "methods": [
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "settingsGet",
      "settingsSet"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop",
            "settingsGet",
            "settingsSet"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_shadowsocks_manage",
    "description": "Plugin shadowsocks management - 14 available methods including: generalGet, generalSet, localGet, localSet, localserviceReconfigure...",
    "module": "plugins",
    "submodule": "shadowsocks",
    "methods": [
      "generalGet",
      "generalSet",
      "localGet",
      "localSet",
      "localserviceReconfigure",
      "localserviceRestart",
      "localserviceStart",
      "localserviceStatus",
      "localserviceStop",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "generalGet",
            "generalSet",
            "localGet",
            "localSet",
            "localserviceReconfigure",
            "localserviceRestart",
            "localserviceStart",
            "localserviceStatus",
            "localserviceStop",
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_siproxd_manage",
    "description": "Plugin siproxd management - 24 available methods including: domainAddDomain, domainDelDomain, domainGet, domainGetDomain, domainSearchDomain...",
    "module": "plugins",
    "submodule": "siproxd",
    "methods": [
      "domainAddDomain",
      "domainDelDomain",
      "domainGet",
      "domainGetDomain",
      "domainSearchDomain",
      "domainSet",
      "domainSetDomain",
      "domainToggleDomain",
      "generalGet",
      "generalSet",
      "serviceReconfigure",
      "serviceRestart",
      "serviceShowregistrations",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "userAddUser",
      "userDelUser",
      "userGet",
      "userGetUser",
      "userSearchUser",
      "userSet",
      "userSetUser",
      "userToggleUser"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "domainAddDomain",
            "domainDelDomain",
            "domainGet",
            "domainGetDomain",
            "domainSearchDomain",
            "domainSet",
            "domainSetDomain",
            "domainToggleDomain",
            "generalGet",
            "generalSet",
            "serviceReconfigure",
            "serviceRestart",
            "serviceShowregistrations",
            "serviceStart",
            "serviceStatus",
            "serviceStop",
            "userAddUser",
            "userDelUser",
            "userGet",
            "userGetUser",
            "userSearchUser",
            "userSet",
            "userSetUser",
            "userToggleUser"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_smart_manage",
    "description": "Plugin smart management - 5 available methods including: serviceAbort, serviceInfo, serviceList, serviceLogs, serviceTest...",
    "module": "plugins",
    "submodule": "smart",
    "methods": [
      "serviceAbort",
      "serviceInfo",
      "serviceList",
      "serviceLogs",
      "serviceTest"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "serviceAbort",
            "serviceInfo",
            "serviceList",
            "serviceLogs",
            "serviceTest"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_softether_manage",
    "description": "Plugin softether management - 7 available methods including: generalGet, generalSet, serviceReconfigure, serviceRestart, serviceStart...",
    "module": "plugins",
    "submodule": "softether",
    "methods": [
      "generalGet",
      "generalSet",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "generalGet",
            "generalSet",
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_sslh_manage",
    "description": "Plugin sslh management - 8 available methods including: serviceReconfigure, serviceRestart, serviceStart, serviceStatus, serviceStop...",
    "module": "plugins",
    "submodule": "sslh",
    "methods": [
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "settingsGet",
      "settingsIndex",
      "settingsSet"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop",
            "settingsGet",
            "settingsIndex",
            "settingsSet"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_stunnel_manage",
    "description": "Plugin stunnel management - 12 available methods including: serviceReconfigure, serviceRestart, serviceStart, serviceStatus, serviceStop...",
    "module": "plugins",
    "submodule": "stunnel",
    "methods": [
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "servicesAddItem",
      "servicesDelItem",
      "servicesGet",
      "servicesGetItem",
      "servicesSet",
      "servicesSetItem",
      "servicesToggleItem"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop",
            "servicesAddItem",
            "servicesDelItem",
            "servicesGet",
            "servicesGetItem",
            "servicesSet",
            "servicesSetItem",
            "servicesToggleItem"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_tailscale_manage",
    "description": "Plugin tailscale management - 19 available methods including: authenticationGet, authenticationSet, serviceReconfigure, serviceRestart, serviceStart...",
    "module": "plugins",
    "submodule": "tailscale",
    "methods": [
      "authenticationGet",
      "authenticationSet",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "settingsAddSubnet",
      "settingsDelSubnet",
      "settingsGet",
      "settingsGetSubnet",
      "settingsReload",
      "settingsSet",
      "settingsSetSubnet",
      "statusGet",
      "statusIp",
      "statusNet",
      "statusSet",
      "status"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "authenticationGet",
            "authenticationSet",
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop",
            "settingsAddSubnet",
            "settingsDelSubnet",
            "settingsGet",
            "settingsGetSubnet",
            "settingsReload",
            "settingsSet",
            "settingsSetSubnet",
            "statusGet",
            "statusIp",
            "statusNet",
            "statusSet",
            "status"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_tayga_manage",
    "description": "Plugin tayga management - 7 available methods including: generalGet, generalSet, serviceReconfigure, serviceRestart, serviceStart...",
    "module": "plugins",
    "submodule": "tayga",
    "methods": [
      "generalGet",
      "generalSet",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "generalGet",
            "generalSet",
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_telegraf_manage",
    "description": "Plugin telegraf management - 18 available methods including: generalGet, generalSet, inputGet, inputSet, keyAddKey...",
    "module": "plugins",
    "submodule": "telegraf",
    "methods": [
      "generalGet",
      "generalSet",
      "inputGet",
      "inputSet",
      "keyAddKey",
      "keyDelKey",
      "keyGet",
      "keyGetKey",
      "keySet",
      "keySetKey",
      "keyToggleKey",
      "outputGet",
      "outputSet",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "generalGet",
            "generalSet",
            "inputGet",
            "inputSet",
            "keyAddKey",
            "keyDelKey",
            "keyGet",
            "keyGetKey",
            "keySet",
            "keySetKey",
            "keyToggleKey",
            "outputGet",
            "outputSet",
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_tftp_manage",
    "description": "Plugin tftp management - 7 available methods including: generalGet, generalSet, serviceReconfigure, serviceRestart, serviceStart...",
    "module": "plugins",
    "submodule": "tftp",
    "methods": [
      "generalGet",
      "generalSet",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "generalGet",
            "generalSet",
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_tinc_manage",
    "description": "Plugin tinc management - 16 available methods including: serviceReconfigure, serviceRestart, serviceStart, serviceStop, settingsDelHost...",
    "module": "plugins",
    "submodule": "tinc",
    "methods": [
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStop",
      "settingsDelHost",
      "settingsDelNetwork",
      "settingsGet",
      "settingsGetHost",
      "settingsGetNetwork",
      "settingsSearchHost",
      "settingsSearchNetwork",
      "settingsSet",
      "settingsSetHost",
      "settingsSetNetwork",
      "settingsToggleHost",
      "settingsToggleNetwork"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStop",
            "settingsDelHost",
            "settingsDelNetwork",
            "settingsGet",
            "settingsGetHost",
            "settingsGetNetwork",
            "settingsSearchHost",
            "settingsSearchNetwork",
            "settingsSet",
            "settingsSetHost",
            "settingsSetNetwork",
            "settingsToggleHost",
            "settingsToggleNetwork"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_tor_manage",
    "description": "Plugin tor management - 45 available methods including: exitaclAddacl, exitaclDelacl, exitaclGet, exitaclGetacl, exitaclSet...",
    "module": "plugins",
    "submodule": "tor",
    "methods": [
      "exitaclAddacl",
      "exitaclDelacl",
      "exitaclGet",
      "exitaclGetacl",
      "exitaclSet",
      "exitaclSetacl",
      "exitaclToggleacl",
      "generalAddhidservauth",
      "generalDelhidservauth",
      "generalGet",
      "generalGethidservauth",
      "generalSet",
      "generalSethidservauth",
      "generalTogglehidservauth",
      "hiddenserviceAddservice",
      "hiddenserviceDelservice",
      "hiddenserviceGet",
      "hiddenserviceGetservice",
      "hiddenserviceSet",
      "hiddenserviceSetservice",
      "hiddenserviceToggleservice",
      "hiddenserviceaclAddacl",
      "hiddenserviceaclDelacl",
      "hiddenserviceaclGet",
      "hiddenserviceaclGetacl",
      "hiddenserviceaclSet",
      "hiddenserviceaclSetacl",
      "hiddenserviceaclToggleacl",
      "relayGet",
      "relaySet",
      "serviceCircuits",
      "serviceGetHiddenServices",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "serviceStreams",
      "socksaclAddacl",
      "socksaclDelacl",
      "socksaclGet",
      "socksaclGetacl",
      "socksaclSet",
      "socksaclSetacl",
      "socksaclToggleacl"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "exitaclAddacl",
            "exitaclDelacl",
            "exitaclGet",
            "exitaclGetacl",
            "exitaclSet",
            "exitaclSetacl",
            "exitaclToggleacl",
            "generalAddhidservauth",
            "generalDelhidservauth",
            "generalGet",
            "generalGethidservauth",
            "generalSet",
            "generalSethidservauth",
            "generalTogglehidservauth",
            "hiddenserviceAddservice",
            "hiddenserviceDelservice",
            "hiddenserviceGet",
            "hiddenserviceGetservice",
            "hiddenserviceSet",
            "hiddenserviceSetservice",
            "hiddenserviceToggleservice",
            "hiddenserviceaclAddacl",
            "hiddenserviceaclDelacl",
            "hiddenserviceaclGet",
            "hiddenserviceaclGetacl",
            "hiddenserviceaclSet",
            "hiddenserviceaclSetacl",
            "hiddenserviceaclToggleacl",
            "relayGet",
            "relaySet",
            "serviceCircuits",
            "serviceGetHiddenServices",
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop",
            "serviceStreams",
            "socksaclAddacl",
            "socksaclDelacl",
            "socksaclGet",
            "socksaclGetacl",
            "socksaclSet",
            "socksaclSetacl",
            "socksaclToggleacl"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_turnserver_manage",
    "description": "Plugin turnserver management - 7 available methods including: serviceReconfigure, serviceRestart, serviceStart, serviceStatus, serviceStop...",
    "module": "plugins",
    "submodule": "turnserver",
    "methods": [
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "settingsGet",
      "settingsSet"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop",
            "settingsGet",
            "settingsSet"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_udpbroadcastrelay_manage",
    "description": "Plugin udpbroadcastrelay management - 16 available methods including: serviceConfig, serviceGet, serviceReload, serviceRestart, serviceSet...",
    "module": "plugins",
    "submodule": "udpbroadcastrelay",
    "methods": [
      "serviceConfig",
      "serviceGet",
      "serviceReload",
      "serviceRestart",
      "serviceSet",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "settingsAddRelay",
      "settingsDelRelay",
      "settingsGet",
      "settingsGetRelay",
      "settingsSearchRelay",
      "settingsSet",
      "settingsSetRelay",
      "settingsToggleRelay"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "serviceConfig",
            "serviceGet",
            "serviceReload",
            "serviceRestart",
            "serviceSet",
            "serviceStart",
            "serviceStatus",
            "serviceStop",
            "settingsAddRelay",
            "settingsDelRelay",
            "settingsGet",
            "settingsGetRelay",
            "settingsSearchRelay",
            "settingsSet",
            "settingsSetRelay",
            "settingsToggleRelay"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_vnstat_manage",
    "description": "Plugin vnstat management - 12 available methods including: generalGet, generalSet, serviceDaily, serviceHourly, serviceMonthly...",
    "module": "plugins",
    "submodule": "vnstat",
    "methods": [
      "generalGet",
      "generalSet",
      "serviceDaily",
      "serviceHourly",
      "serviceMonthly",
      "serviceReconfigure",
      "serviceResetdb",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "serviceYearly"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "generalGet",
            "generalSet",
            "serviceDaily",
            "serviceHourly",
            "serviceMonthly",
            "serviceReconfigure",
            "serviceResetdb",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop",
            "serviceYearly"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_wazuhagent_manage",
    "description": "Plugin wazuhagent management - 7 available methods including: serviceReconfigure, serviceRestart, serviceStart, serviceStatus, serviceStop...",
    "module": "plugins",
    "submodule": "wazuhagent",
    "methods": [
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "settingsGet",
      "settingsSet"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop",
            "settingsGet",
            "settingsSet"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_wol_manage",
    "description": "Plugin wol management - 8 available methods including: wolAddHost, wolDelHost, wolGet, wolGetHost, wolGetwake...",
    "module": "plugins",
    "submodule": "wol",
    "methods": [
      "wolAddHost",
      "wolDelHost",
      "wolGet",
      "wolGetHost",
      "wolGetwake",
      "wolSet",
      "wolSetHost",
      "wolWakeall"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "wolAddHost",
            "wolDelHost",
            "wolGet",
            "wolGetHost",
            "wolGetwake",
            "wolSet",
            "wolSetHost",
            "wolWakeall"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_zabbixagent_manage",
    "description": "Plugin zabbixagent management - 17 available methods including: serviceReconfigure, serviceRestart, serviceStart, serviceStatus, serviceStop...",
    "module": "plugins",
    "submodule": "zabbixagent",
    "methods": [
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "settingsAddAlias",
      "settingsAddUserparameter",
      "settingsDelAlias",
      "settingsDelUserparameter",
      "settingsGet",
      "settingsGetAlias",
      "settingsGetUserparameter",
      "settingsSet",
      "settingsSetAlias",
      "settingsSetUserparameter",
      "settingsToggleAlias",
      "settingsToggleUserparameter"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop",
            "settingsAddAlias",
            "settingsAddUserparameter",
            "settingsDelAlias",
            "settingsDelUserparameter",
            "settingsGet",
            "settingsGetAlias",
            "settingsGetUserparameter",
            "settingsSet",
            "settingsSetAlias",
            "settingsSetUserparameter",
            "settingsToggleAlias",
            "settingsToggleUserparameter"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_zabbixproxy_manage",
    "description": "Plugin zabbixproxy management - 7 available methods including: generalGet, generalSet, serviceReconfigure, serviceRestart, serviceStart...",
    "module": "plugins",
    "submodule": "zabbixproxy",
    "methods": [
      "generalGet",
      "generalSet",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "generalGet",
            "generalSet",
            "serviceReconfigure",
            "serviceRestart",
            "serviceStart",
            "serviceStatus",
            "serviceStop"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  },
  {
    "name": "plugin_zerotier_manage",
    "description": "Plugin zerotier management - 10 available methods including: networkAdd, networkDel, networkGet, networkInfo, networkSearch...",
    "module": "plugins",
    "submodule": "zerotier",
    "methods": [
      "networkAdd",
      "networkDel",
      "networkGet",
      "networkInfo",
      "networkSearch",
      "networkSet",
      "networkToggle",
      "settingsGet",
      "settingsSet",
      "settingsStatus"
    ],
    "inputSchema": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "The method to call on this module",
          "enum": [
            "networkAdd",
            "networkDel",
            "networkGet",
            "networkInfo",
            "networkSearch",
            "networkSet",
            "networkToggle",
            "settingsGet",
            "settingsSet",
            "settingsStatus"
          ]
        },
        "params": {
          "type": "object",
          "description": "Parameters for the method (varies by method)",
          "properties": {
            "uuid": {
              "type": "string",
              "description": "Item UUID (for get/set/del operations)"
            },
            "data": {
              "type": "object",
              "description": "Configuration data (for set operations)"
            },
            "item": {
              "type": "object",
              "description": "Item data (for add/set operations)"
            },
            "searchPhrase": {
              "type": "string",
              "description": "Search phrase (for search operations)"
            },
            "current": {
              "type": "integer",
              "description": "Current page (for search operations)",
              "default": 1
            },
            "rowCount": {
              "type": "integer",
              "description": "Rows per page (for search operations)",
              "default": 20
            }
          }
        }
      },
      "required": [
        "method"
      ]
    }
  }
];

// Method documentation for help
const METHOD_DOCS = {
  "core": {
    "toolName": "core_manage",
    "methods": [
      "backupBackups",
      "backupDeleteBackup",
      "backupDiff",
      "backupDownload",
      "backupProviders",
      "backupRevertBackup",
      "dashboardGetDashboard",
      "dashboardPicture",
      "dashboardProductInfoFeed",
      "dashboardRestoreDefaults",
      "dashboardSaveWidgets",
      "hasyncGet",
      "hasyncReconfigure",
      "hasyncSet",
      "hasyncStatusRemoteService",
      "hasyncStatusRestart",
      "hasyncStatusRestartAll",
      "hasyncStatusServices",
      "hasyncStatusStart",
      "hasyncStatusStop",
      "hasyncStatusVersion",
      "menuSearch",
      "menuTree",
      "serviceRestart",
      "serviceSearch",
      "serviceStart",
      "serviceStop",
      "snapshotsActivate",
      "snapshotsAdd",
      "snapshotsDel",
      "snapshotsGet",
      "snapshotsIsSupported",
      "snapshotsSearch",
      "snapshotsSet",
      "systemDismissStatus",
      "systemHalt",
      "systemReboot",
      "systemStatus",
      "tunablesAddItem",
      "tunablesDelItem",
      "tunablesGet",
      "tunablesGetItem",
      "tunablesReconfigure",
      "tunablesReset",
      "tunablesSet",
      "tunablesSetItem"
    ]
  },
  "firewall": {
    "toolName": "firewall_manage",
    "methods": [
      "aliasAddItem",
      "aliasDelItem",
      "aliasGet",
      "aliasGetAliasUUID",
      "aliasGetGeoIP",
      "aliasGetItem",
      "aliasGetTableSize",
      "aliasImport",
      "aliasListCategories",
      "aliasListCountries",
      "aliasListNetworkAliases",
      "aliasListUserGroups",
      "aliasReconfigure",
      "aliasSet",
      "aliasSetItem",
      "aliasToggleItem",
      "aliasUtilAdd",
      "aliasUtilAliases",
      "aliasUtilDelete",
      "aliasUtilFindReferences",
      "aliasUtilFlush",
      "aliasUtilList",
      "aliasUtilUpdateBogons",
      "categoryAddItem",
      "categoryDelItem",
      "categoryGet",
      "categoryGetItem",
      "categorySet",
      "categorySetItem",
      "filterBaseApply",
      "filterBaseCancelRollback",
      "filterBaseGet",
      "filterBaseListCategories",
      "filterBaseListNetworkSelectOptions",
      "filterBaseRevert",
      "filterBaseSavepoint",
      "filterBaseSet",
      "filterAddRule",
      "filterDelRule",
      "filterGetInterfaceList",
      "filterGetRule",
      "filterMoveRuleBefore",
      "filterSetRule",
      "filterToggleRule",
      "filterUtilRuleStats",
      "groupAddItem",
      "groupDelItem",
      "groupGet",
      "groupGetItem",
      "groupReconfigure",
      "groupSet",
      "groupSetItem",
      "nptAddRule",
      "nptDelRule",
      "nptGetRule",
      "nptSetRule",
      "nptToggleRule",
      "oneToOneAddRule",
      "oneToOneDelRule",
      "oneToOneGetRule",
      "oneToOneSetRule",
      "oneToOneToggleRule",
      "sourceNatAddRule",
      "sourceNatDelRule",
      "sourceNatGetRule",
      "sourceNatSetRule",
      "sourceNatToggleRule"
    ]
  },
  "auth": {
    "toolName": "auth_manage",
    "methods": [
      "groupAdd",
      "groupDel",
      "groupGet",
      "groupSet",
      "privGet",
      "privGetItem",
      "privSearch",
      "privSet",
      "privSetItem",
      "userAdd",
      "userAddApiKey",
      "userDel",
      "userDelApiKey",
      "userDownload",
      "userGet",
      "userNewOtpSeed",
      "userSearchApiKey",
      "userSet",
      "userUpload"
    ]
  },
  "interfaces": {
    "toolName": "interfaces_manage",
    "methods": [
      "gifSettingsAddItem",
      "gifSettingsDelItem",
      "gifSettingsGet",
      "gifSettingsGetIfOptions",
      "gifSettingsGetItem",
      "gifSettingsReconfigure",
      "gifSettingsSet",
      "gifSettingsSetItem",
      "greSettingsAddItem",
      "greSettingsDelItem",
      "greSettingsGet",
      "greSettingsGetIfOptions",
      "greSettingsGetItem",
      "greSettingsReconfigure",
      "greSettingsSet",
      "greSettingsSetItem",
      "laggSettingsAddItem",
      "laggSettingsDelItem",
      "laggSettingsGet",
      "laggSettingsGetItem",
      "laggSettingsReconfigure",
      "laggSettingsSet",
      "laggSettingsSetItem",
      "loopbackSettingsAddItem",
      "loopbackSettingsDelItem",
      "loopbackSettingsGet",
      "loopbackSettingsGetItem",
      "loopbackSettingsReconfigure",
      "loopbackSettingsSet",
      "loopbackSettingsSetItem",
      "neighborSettingsAddItem",
      "neighborSettingsDelItem",
      "neighborSettingsGet",
      "neighborSettingsGetItem",
      "neighborSettingsReconfigure",
      "neighborSettingsSet",
      "neighborSettingsSetItem",
      "overviewExport",
      "overviewGetInterface",
      "overviewInterfacesInfo",
      "overviewReloadInterface",
      "vipSettingsAddItem",
      "vipSettingsDelItem",
      "vipSettingsGet",
      "vipSettingsGetItem",
      "vipSettingsGetUnusedVhid",
      "vipSettingsReconfigure",
      "vipSettingsSet",
      "vipSettingsSetItem",
      "vlanSettingsAddItem",
      "vlanSettingsDelItem",
      "vlanSettingsGet",
      "vlanSettingsGetItem",
      "vlanSettingsReconfigure",
      "vlanSettingsSet",
      "vlanSettingsSetItem",
      "vxlanSettingsAddItem",
      "vxlanSettingsDelItem",
      "vxlanSettingsGet",
      "vxlanSettingsGetItem",
      "vxlanSettingsReconfigure",
      "vxlanSettingsSet",
      "vxlanSettingsSetItem"
    ]
  },
  "captiveportal": {
    "toolName": "captiveportal_manage",
    "methods": [
      "accessApi",
      "accessLogoff",
      "accessLogon",
      "serviceDelTemplate",
      "serviceGetTemplate",
      "serviceReconfigure",
      "serviceSaveTemplate",
      "serviceSearchTemplates",
      "sessionConnect",
      "sessionDisconnect",
      "sessionList",
      "sessionSearch",
      "sessionZones",
      "settingsAddZone",
      "settingsDelZone",
      "settingsGet",
      "settingsGetZone",
      "settingsSet",
      "settingsSetZone",
      "settingsToggleZone",
      "voucherDropExpiredVouchers",
      "voucherDropVoucherGroup",
      "voucherExpireVoucher",
      "voucherGenerateVouchers",
      "voucherListProviders",
      "voucherListVoucherGroups",
      "voucherListVouchers"
    ]
  },
  "cron": {
    "toolName": "cron_manage",
    "methods": [
      "serviceReconfigure",
      "settingsAddJob",
      "settingsDelJob",
      "settingsGet",
      "settingsGetJob",
      "settingsSet",
      "settingsSetJob",
      "settingsToggleJob"
    ]
  },
  "dhcpv4": {
    "toolName": "dhcpv4_manage",
    "methods": [
      "leasesDelLease",
      "leasesSearchLease",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ]
  },
  "dhcpv6": {
    "toolName": "dhcpv6_manage",
    "methods": [
      "leasesDelLease",
      "leasesSearchLease",
      "leasesSearchPrefix",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ]
  },
  "dhcrelay": {
    "toolName": "dhcrelay_manage",
    "methods": [
      "serviceReconfigure",
      "settingsAddDest",
      "settingsAddRelay",
      "settingsDelDest",
      "settingsDelRelay",
      "settingsGet",
      "settingsGetDest",
      "settingsGetRelay",
      "settingsSet",
      "settingsSetDest",
      "settingsSetRelay",
      "settingsToggleRelay"
    ]
  },
  "diagnostics": {
    "toolName": "diagnostics_manage",
    "methods": [
      "activityGetActivity",
      "cpuUsageGetCPUType",
      "cpuUsageStream",
      "dnsReverseLookup",
      "dnsDiagnosticsGet",
      "dnsDiagnosticsSet",
      "firewallDelState",
      "firewallFlushSources",
      "firewallFlushStates",
      "firewallKillStates",
      "firewallListRuleIds",
      "firewallLog",
      "firewallLogFilters",
      "firewallPfStates",
      "firewallPfStatistics",
      "firewallQueryPfTop",
      "firewallQueryStates",
      "firewallStats",
      "firewallStreamLog",
      "interfaceCarpStatus",
      "interfaceDelRoute",
      "interfaceFlushArp",
      "interfaceGetArp",
      "interfaceGetBpfStatistics",
      "interfaceGetInterfaceConfig",
      "interfaceGetInterfaceNames",
      "interfaceGetInterfaceStatistics",
      "interfaceGetMemoryStatistics",
      "interfaceGetNdp",
      "interfaceGetNetisrStatistics",
      "interfaceGetPfsyncNodes",
      "interfaceGetProtocolStatistics",
      "interfaceGetRoutes",
      "interfaceGetSocketStatistics",
      "interfaceGetVipStatus",
      "interfaceSearchArp",
      "interfaceSearchNdp",
      "lvtemplateAddItem",
      "lvtemplateDelItem",
      "lvtemplateGet",
      "lvtemplateGetItem",
      "lvtemplateSet",
      "lvtemplateSetItem",
      "netflowCacheStats",
      "netflowGetconfig",
      "netflowIsEnabled",
      "netflowReconfigure",
      "netflowSetconfig",
      "netflowStatus",
      "networkinsightExport",
      "networkinsightGetInterfaces",
      "networkinsightGetMetadata",
      "networkinsightGetProtocols",
      "networkinsightGetServices",
      "networkinsightTimeserie",
      "networkinsightTop",
      "packetCaptureDownload",
      "packetCaptureGet",
      "packetCaptureMacInfo",
      "packetCaptureRemove",
      "packetCaptureSearchJobs",
      "packetCaptureSet",
      "packetCaptureStart",
      "packetCaptureStop",
      "packetCaptureView",
      "pingGet",
      "pingRemove",
      "pingSearchJobs",
      "pingSet",
      "pingStart",
      "pingStop",
      "portprobeGet",
      "portprobeSet",
      "systemMemory",
      "systemSystemDisk",
      "systemSystemInformation",
      "systemSystemMbuf",
      "systemSystemResources",
      "systemSystemSwap",
      "systemSystemTemperature",
      "systemSystemTime",
      "systemhealthExportAsCSV",
      "systemhealthGetInterfaces",
      "systemhealthGetRRDlist",
      "systemhealthGetSystemHealth",
      "tracerouteGet",
      "tracerouteSet",
      "trafficInterface",
      "trafficTop",
      "trafficStream"
    ]
  },
  "dnsmasq": {
    "toolName": "dnsmasq_manage",
    "methods": [
      "leasesSearch",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "settingsAddBoot",
      "settingsAddDomain",
      "settingsAddHost",
      "settingsAddOption",
      "settingsAddRange",
      "settingsAddTag",
      "settingsDelBoot",
      "settingsDelDomain",
      "settingsDelHost",
      "settingsDelOption",
      "settingsDelRange",
      "settingsDelTag",
      "settingsDownloadHosts",
      "settingsGet",
      "settingsGetBoot",
      "settingsGetDomain",
      "settingsGetHost",
      "settingsGetOption",
      "settingsGetRange",
      "settingsGetTag",
      "settingsGetTagList",
      "settingsSet",
      "settingsSetBoot",
      "settingsSetDomain",
      "settingsSetHost",
      "settingsSetOption",
      "settingsSetRange",
      "settingsSetTag",
      "settingsUploadHosts"
    ]
  },
  "firmware": {
    "toolName": "firmware_manage",
    "methods": [
      "firmwareAudit",
      "firmwareChangelog",
      "firmwareCheck",
      "firmwareConnection",
      "firmwareGet",
      "firmwareGetOptions",
      "firmwareHealth",
      "firmwareInfo",
      "firmwareLog",
      "firmwarePoweroff",
      "firmwareReboot",
      "firmwareResyncPlugins",
      "firmwareRunning",
      "firmwareSet",
      "firmwareStatus",
      "firmwareSyncPlugins",
      "firmwareUpdate",
      "firmwareUpgrade",
      "firmwareUpgradestatus",
      "firmwareDetails",
      "firmwareInstall",
      "firmwareLicense",
      "firmwareLock",
      "firmwareRemove",
      "firmwareReinstall",
      "firmwareUnlock"
    ]
  },
  "ids": {
    "toolName": "ids_manage",
    "methods": [
      "serviceDropAlertLog",
      "serviceGetAlertInfo",
      "serviceGetAlertLogs",
      "serviceQueryAlerts",
      "serviceReconfigure",
      "serviceReloadRules",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "serviceUpdateRules",
      "settingsAddPolicy",
      "settingsAddPolicyRule",
      "settingsAddUserRule",
      "settingsCheckPolicyRule",
      "settingsDelPolicy",
      "settingsDelPolicyRule",
      "settingsDelUserRule",
      "settingsGet",
      "settingsGetPolicy",
      "settingsGetPolicyRule",
      "settingsGetRuleInfo",
      "settingsGetRuleset",
      "settingsGetRulesetproperties",
      "settingsGetUserRule",
      "settingsListRuleMetadata",
      "settingsListRulesets",
      "settingsSearchInstalledRules",
      "settingsSet",
      "settingsSetPolicy",
      "settingsSetPolicyRule",
      "settingsSetRule",
      "settingsSetRuleset",
      "settingsSetRulesetproperties",
      "settingsSetUserRule",
      "settingsTogglePolicy",
      "settingsTogglePolicyRule",
      "settingsToggleRule",
      "settingsToggleRuleset",
      "settingsToggleUserRule"
    ]
  },
  "ipsec": {
    "toolName": "ipsec_manage",
    "methods": [
      "connectionsAddChild",
      "connectionsAddConnection",
      "connectionsAddLocal",
      "connectionsAddRemote",
      "connectionsConnectionExists",
      "connectionsDelChild",
      "connectionsDelConnection",
      "connectionsDelLocal",
      "connectionsDelRemote",
      "connectionsGet",
      "connectionsGetChild",
      "connectionsGetConnection",
      "connectionsGetLocal",
      "connectionsGetRemote",
      "connectionsIsEnabled",
      "connectionsSet",
      "connectionsSetChild",
      "connectionsSetConnection",
      "connectionsSetLocal",
      "connectionsSetRemote",
      "connectionsSwanctl",
      "connectionsToggle",
      "connectionsToggleChild",
      "connectionsToggleConnection",
      "connectionsToggleLocal",
      "connectionsToggleRemote",
      "keyPairsAddItem",
      "keyPairsDelItem",
      "keyPairsGenKeyPair",
      "keyPairsGet",
      "keyPairsGetItem",
      "keyPairsSet",
      "keyPairsSetItem",
      "leasesPools",
      "leasesSearch",
      "legacySubsystemApplyConfig",
      "legacySubsystemStatus",
      "manualSpdAdd",
      "manualSpdDel",
      "manualSpdGet",
      "manualSpdSet",
      "manualSpdToggle",
      "poolsAdd",
      "poolsDel",
      "poolsGet",
      "poolsSet",
      "poolsToggle",
      "preSharedKeysAddItem",
      "preSharedKeysDelItem",
      "preSharedKeysGet",
      "preSharedKeysGetItem",
      "preSharedKeysSet",
      "preSharedKeysSetItem",
      "sadDelete",
      "sadSearch",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "sessionsConnect",
      "sessionsDisconnect",
      "sessionsSearchPhase1",
      "sessionsSearchPhase2",
      "settingsGet",
      "settingsSet",
      "spdDelete",
      "spdSearch",
      "tunnelDelPhase1",
      "tunnelDelPhase2",
      "tunnelSearchPhase1",
      "tunnelSearchPhase2",
      "tunnelToggle",
      "tunnelTogglePhase1",
      "tunnelTogglePhase2",
      "vtiAdd",
      "vtiDel",
      "vtiGet",
      "vtiSet",
      "vtiToggle"
    ]
  },
  "kea": {
    "toolName": "kea_manage",
    "methods": [
      "ctrlAgentGet",
      "ctrlAgentSet",
      "dhcpv4AddPeer",
      "dhcpv4AddReservation",
      "dhcpv4AddSubnet",
      "dhcpv4DelPeer",
      "dhcpv4DelReservation",
      "dhcpv4DelSubnet",
      "dhcpv4DownloadReservations",
      "dhcpv4Get",
      "dhcpv4GetPeer",
      "dhcpv4GetReservation",
      "dhcpv4GetSubnet",
      "dhcpv4Set",
      "dhcpv4SetPeer",
      "dhcpv4SetReservation",
      "dhcpv4SetSubnet",
      "dhcpv4UploadReservations",
      "leases4Search",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ]
  },
  "monit": {
    "toolName": "monit_manage",
    "methods": [
      "serviceCheck",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "settingsAddAlert",
      "settingsAddService",
      "settingsAddTest",
      "settingsDelAlert",
      "settingsDelService",
      "settingsDelTest",
      "settingsDirty",
      "settingsGet",
      "settingsGetAlert",
      "settingsGetGeneral",
      "settingsGetService",
      "settingsGetTest",
      "settingsSet",
      "settingsSetAlert",
      "settingsSetService",
      "settingsSetTest",
      "settingsToggleAlert",
      "settingsToggleService",
      "statusGet"
    ]
  },
  "openvpn": {
    "toolName": "openvpn_manage",
    "methods": [
      "clientOverwritesAdd",
      "clientOverwritesDel",
      "clientOverwritesGet",
      "clientOverwritesSet",
      "clientOverwritesToggle",
      "exportAccounts",
      "exportDownload",
      "exportProviders",
      "exportStorePresets",
      "exportTemplates",
      "exportValidatePresets",
      "instancesAdd",
      "instancesAddStaticKey",
      "instancesDel",
      "instancesDelStaticKey",
      "instancesGenKey",
      "instancesGet",
      "instancesGetStaticKey",
      "instancesSet",
      "instancesSetStaticKey",
      "instancesToggle",
      "serviceKillSession",
      "serviceReconfigure",
      "serviceRestartService",
      "serviceSearchRoutes",
      "serviceSearchSessions",
      "serviceStartService",
      "serviceStopService"
    ]
  },
  "routes": {
    "toolName": "routes_manage",
    "methods": [
      "gatewayStatus",
      "routesAddroute",
      "routesDelroute",
      "routesGet",
      "routesGetroute",
      "routesReconfigure",
      "routesSet",
      "routesSetroute",
      "routesToggleroute"
    ]
  },
  "routing": {
    "toolName": "routing_manage",
    "methods": [
      "settingsAddGateway",
      "settingsDelGateway",
      "settingsGet",
      "settingsGetGateway",
      "settingsReconfigure",
      "settingsSearchGateway",
      "settingsSet",
      "settingsSetGateway",
      "settingsToggleGateway"
    ]
  },
  "syslog": {
    "toolName": "syslog_manage",
    "methods": [
      "serviceReconfigure",
      "serviceReset",
      "serviceRestart",
      "serviceStart",
      "serviceStats",
      "serviceStatus",
      "serviceStop",
      "settingsAddDestination",
      "settingsDelDestination",
      "settingsGet",
      "settingsGetDestination",
      "settingsSet",
      "settingsSetDestination",
      "settingsToggleDestination"
    ]
  },
  "trafficshaper": {
    "toolName": "trafficshaper_manage",
    "methods": [
      "serviceFlushreload",
      "serviceReconfigure",
      "serviceStatistics",
      "settingsAddPipe",
      "settingsAddQueue",
      "settingsAddRule",
      "settingsDelPipe",
      "settingsDelQueue",
      "settingsDelRule",
      "settingsGet",
      "settingsGetPipe",
      "settingsGetQueue",
      "settingsGetRule",
      "settingsSet",
      "settingsSetPipe",
      "settingsSetQueue",
      "settingsSetRule",
      "settingsTogglePipe",
      "settingsToggleQueue",
      "settingsToggleRule"
    ]
  },
  "trust": {
    "toolName": "trust_manage",
    "methods": [
      "caCaInfo",
      "caCaList",
      "caDel",
      "caGenerateFile",
      "caGet",
      "caRawDump",
      "caSet",
      "certAdd",
      "certCaInfo",
      "certCaList",
      "certDel",
      "certGenerateFile",
      "certGet",
      "certRawDump",
      "certSet",
      "certUserList",
      "crlDel",
      "crlGet",
      "crlGetOcspInfoData",
      "crlRawDump",
      "crlSearch",
      "crlSet",
      "settingsGet",
      "settingsReconfigure",
      "settingsSet"
    ]
  },
  "unbound": {
    "toolName": "unbound_manage",
    "methods": [
      "diagnosticsDumpcache",
      "diagnosticsDumpinfra",
      "diagnosticsListinsecure",
      "diagnosticsListlocaldata",
      "diagnosticsListlocalzones",
      "diagnosticsStats",
      "overviewRolling",
      "overviewIsBlockListEnabled",
      "overviewIsEnabled",
      "overviewSearchQueries",
      "overviewTotals",
      "serviceDnsbl",
      "serviceReconfigure",
      "serviceReconfigureGeneral",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "settingsAddAcl",
      "settingsAddForward",
      "settingsAddHostAlias",
      "settingsAddHostOverride",
      "settingsDelAcl",
      "settingsDelForward",
      "settingsDelHostAlias",
      "settingsDelHostOverride",
      "settingsGet",
      "settingsGetAcl",
      "settingsGetForward",
      "settingsGetHostAlias",
      "settingsGetHostOverride",
      "settingsGetNameservers",
      "settingsSet",
      "settingsSetAcl",
      "settingsSetForward",
      "settingsSetHostAlias",
      "settingsSetHostOverride",
      "settingsToggleAcl",
      "settingsToggleForward",
      "settingsToggleHostAlias",
      "settingsToggleHostOverride",
      "settingsUpdateBlocklist"
    ]
  },
  "wireguard": {
    "toolName": "wireguard_manage",
    "methods": [
      "clientAddClient",
      "clientAddClientBuilder",
      "clientDelClient",
      "clientGet",
      "clientGetClient",
      "clientGetClientBuilder",
      "clientGetServerInfo",
      "clientListServers",
      "clientPsk",
      "clientSet",
      "clientSetClient",
      "clientToggleClient",
      "generalGet",
      "generalSet",
      "serverAddServer",
      "serverDelServer",
      "serverGet",
      "serverGetServer",
      "serverKeyPair",
      "serverSet",
      "serverSetServer",
      "serverToggleServer",
      "serviceReconfigure",
      "serviceRestart",
      "serviceShow",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ]
  },
  "plugins.acmeclient": {
    "toolName": "plugin_acmeclient_manage",
    "methods": [
      "accountsAdd",
      "accountsDel",
      "accountsGet",
      "accountsRegister",
      "accountsSet",
      "accountsToggle",
      "accountsUpdate",
      "actionsAdd",
      "actionsDel",
      "actionsGet",
      "actionsSet",
      "actionsSftpGetIdentity",
      "actionsSftpTestConnection",
      "actionsSshGetIdentity",
      "actionsSshTestConnection",
      "actionsToggle",
      "actionsUpdate",
      "certificatesAdd",
      "certificatesAutomation",
      "certificatesDel",
      "certificatesGet",
      "certificatesImport",
      "certificatesRemovekey",
      "certificatesRevoke",
      "certificatesSet",
      "certificatesSign",
      "certificatesToggle",
      "certificatesUpdate",
      "serviceConfigtest",
      "serviceReconfigure",
      "serviceReset",
      "serviceRestart",
      "serviceSignallcerts",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "settingsFetchCronIntegration",
      "settingsFetchHAProxyIntegration",
      "settingsGet",
      "settingsGetBindPluginStatus",
      "settingsGetGcloudPluginStatus",
      "settingsSet",
      "validationsAdd",
      "validationsDel",
      "validationsGet",
      "validationsSet",
      "validationsToggle",
      "validationsUpdate"
    ]
  },
  "plugins.apcupsd": {
    "toolName": "plugin_apcupsd_manage",
    "methods": [
      "serviceGetUpsStatus",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "settingsGet",
      "settingsSet"
    ]
  },
  "plugins.bind": {
    "toolName": "plugin_bind_manage",
    "methods": [
      "aclAddAcl",
      "aclDelAcl",
      "aclGet",
      "aclGetAcl",
      "aclSet",
      "aclSetAcl",
      "aclToggleAcl",
      "dnsblGet",
      "dnsblSet",
      "domainAddPrimaryDomain",
      "domainAddSecondaryDomain",
      "domainDelDomain",
      "domainGet",
      "domainGetDomain",
      "domainSearchMasterDomain",
      "domainSearchSlaveDomain",
      "domainSet",
      "domainSetDomain",
      "domainToggleDomain",
      "generalGet",
      "generalSet",
      "generalZoneshow",
      "generalZonetest",
      "recordAddRecord",
      "recordDelRecord",
      "recordGet",
      "recordGetRecord",
      "recordSet",
      "recordSetRecord",
      "recordToggleRecord",
      "serviceDnsbl",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ]
  },
  "plugins.caddy": {
    "toolName": "plugin_caddy_manage",
    "methods": [
      "diagnosticsCaddyfile",
      "diagnosticsConfig",
      "diagnosticsGet",
      "diagnosticsSet",
      "generalGet",
      "generalSet",
      "reverseProxyAddAccessList",
      "reverseProxyAddBasicAuth",
      "reverseProxyAddHandle",
      "reverseProxyAddHeader",
      "reverseProxyAddLayer4",
      "reverseProxyAddLayer4Openvpn",
      "reverseProxyAddReverseProxy",
      "reverseProxyAddSubdomain",
      "reverseProxyDelAccessList",
      "reverseProxyDelBasicAuth",
      "reverseProxyDelHandle",
      "reverseProxyDelHeader",
      "reverseProxyDelLayer4",
      "reverseProxyDelLayer4Openvpn",
      "reverseProxyDelReverseProxy",
      "reverseProxyDelSubdomain",
      "reverseProxyGet",
      "reverseProxyGetAccessList",
      "reverseProxyGetAllReverseDomains",
      "reverseProxyGetBasicAuth",
      "reverseProxyGetHandle",
      "reverseProxyGetHeader",
      "reverseProxyGetLayer4",
      "reverseProxyGetLayer4Openvpn",
      "reverseProxyGetReverseProxy",
      "reverseProxyGetSubdomain",
      "reverseProxySet",
      "reverseProxySetAccessList",
      "reverseProxySetBasicAuth",
      "reverseProxySetHandle",
      "reverseProxySetHeader",
      "reverseProxySetLayer4",
      "reverseProxySetLayer4Openvpn",
      "reverseProxySetReverseProxy",
      "reverseProxySetSubdomain",
      "reverseProxyToggleHandle",
      "reverseProxyToggleLayer4",
      "reverseProxyToggleLayer4Openvpn",
      "reverseProxyToggleReverseProxy",
      "reverseProxyToggleSubdomain",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "serviceValidate"
    ]
  },
  "plugins.chrony": {
    "toolName": "plugin_chrony_manage",
    "methods": [
      "generalGet",
      "generalSet",
      "serviceChronyauthdata",
      "serviceChronysources",
      "serviceChronysourcestats",
      "serviceChronytracking",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ]
  },
  "plugins.cicap": {
    "toolName": "plugin_cicap_manage",
    "methods": [
      "antivirusGet",
      "antivirusSet",
      "generalGet",
      "generalSet",
      "serviceCheckclamav",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ]
  },
  "plugins.clamav": {
    "toolName": "plugin_clamav_manage",
    "methods": [
      "generalGet",
      "generalSet",
      "serviceFreshclam",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "serviceVersion",
      "urlAddUrl",
      "urlDelUrl",
      "urlGet",
      "urlGetUrl",
      "urlSet",
      "urlSetUrl",
      "urlToggleUrl"
    ]
  },
  "plugins.collectd": {
    "toolName": "plugin_collectd_manage",
    "methods": [
      "generalGet",
      "generalSet",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ]
  },
  "plugins.crowdsec": {
    "toolName": "plugin_crowdsec_manage",
    "methods": [
      "alertsGet",
      "bouncersGet",
      "decisionsDelete",
      "decisionsGet",
      "generalGet",
      "generalSet",
      "hubGet",
      "machinesGet",
      "serviceDebug",
      "serviceReload",
      "serviceStatus",
      "versionGet"
    ]
  },
  "plugins.dechw": {
    "toolName": "plugin_dechw_manage",
    "methods": [
      "infoPowerStatus"
    ]
  },
  "plugins.diagnostics": {
    "toolName": "plugin_diagnostics_manage",
    "methods": [
      "proofpointEtStatus"
    ]
  },
  "plugins.dmidecode": {
    "toolName": "plugin_dmidecode_manage",
    "methods": [
      "serviceGet"
    ]
  },
  "plugins.dnscryptproxy": {
    "toolName": "plugin_dnscryptproxy_manage",
    "methods": [
      "cloakAddCloak",
      "cloakDelCloak",
      "cloakGet",
      "cloakGetCloak",
      "cloakSet",
      "cloakSetCloak",
      "cloakToggleCloak",
      "dnsblGet",
      "dnsblSet",
      "forwardAddForward",
      "forwardDelForward",
      "forwardGet",
      "forwardGetForward",
      "forwardSet",
      "forwardSetForward",
      "forwardToggleForward",
      "generalGet",
      "generalSet",
      "serverAddServer",
      "serverDelServer",
      "serverGet",
      "serverGetServer",
      "serverSet",
      "serverSetServer",
      "serverToggleServer",
      "serviceDnsbl",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "whitelistAddWhitelist",
      "whitelistDelWhitelist",
      "whitelistGet",
      "whitelistGetWhitelist",
      "whitelistSet",
      "whitelistSetWhitelist",
      "whitelistToggleWhitelist"
    ]
  },
  "plugins.dyndns": {
    "toolName": "plugin_dyndns_manage",
    "methods": [
      "accountsAddItem",
      "accountsDelItem",
      "accountsGet",
      "accountsGetItem",
      "accountsSet",
      "accountsSetItem",
      "accountsToggleItem",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "settingsGet",
      "settingsSet"
    ]
  },
  "plugins.freeradius": {
    "toolName": "plugin_freeradius_manage",
    "methods": [
      "avpairAddAvpair",
      "avpairDelAvpair",
      "avpairGet",
      "avpairGetAvpair",
      "avpairSet",
      "avpairSetAvpair",
      "avpairToggleAvpair",
      "clientAddClient",
      "clientDelClient",
      "clientGet",
      "clientGetClient",
      "clientSearchClient",
      "clientSet",
      "clientSetClient",
      "clientToggleClient",
      "dhcpAddDhcp",
      "dhcpDelDhcp",
      "dhcpGet",
      "dhcpGetDhcp",
      "dhcpSet",
      "dhcpSetDhcp",
      "dhcpToggleDhcp",
      "eapGet",
      "eapSet",
      "generalGet",
      "generalSet",
      "ldapGet",
      "ldapSet",
      "leaseAddLease",
      "leaseDelLease",
      "leaseGet",
      "leaseGetLease",
      "leaseSet",
      "leaseSetLease",
      "leaseToggleLease",
      "proxyAddHomeserver",
      "proxyAddHomeserverpool",
      "proxyAddRealm",
      "proxyDelHomeserver",
      "proxyDelHomeserverpool",
      "proxyDelRealm",
      "proxyGet",
      "proxyGetHomeserver",
      "proxyGetHomeserverpool",
      "proxyGetRealm",
      "proxySearchHomeserver",
      "proxySearchHomeserverpool",
      "proxySearchRealm",
      "proxySet",
      "proxySetHomeserver",
      "proxySetHomeserverpool",
      "proxySetRealm",
      "proxyToggleHomeserver",
      "proxyToggleHomeserverpool",
      "proxyToggleRealm",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "userAddUser",
      "userDelUser",
      "userGet",
      "userGetUser",
      "userSearchUser",
      "userSet",
      "userSetUser",
      "userToggleUser"
    ]
  },
  "plugins.ftpproxy": {
    "toolName": "plugin_ftpproxy_manage",
    "methods": [
      "serviceConfig",
      "serviceReload",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "settingsAddProxy",
      "settingsDelProxy",
      "settingsGetProxy",
      "settingsSearchProxy",
      "settingsSetProxy",
      "settingsToggleProxy"
    ]
  },
  "plugins.gridexample": {
    "toolName": "plugin_gridexample_manage",
    "methods": [
      "settingsAddItem",
      "settingsDelItem",
      "settingsGet",
      "settingsGetItem",
      "settingsSet",
      "settingsSetItem",
      "settingsToggleItem"
    ]
  },
  "plugins.haproxy": {
    "toolName": "plugin_haproxy_manage",
    "methods": [
      "exportConfig",
      "exportDiff",
      "exportDownload",
      "maintenanceCertActions",
      "maintenanceCertDiff",
      "maintenanceCertSync",
      "maintenanceCertSyncBulk",
      "maintenanceFetchCronIntegration",
      "maintenanceGet",
      "maintenanceSearchCertificateDiff",
      "maintenanceSearchServer",
      "maintenanceServerState",
      "maintenanceServerStateBulk",
      "maintenanceServerWeight",
      "maintenanceServerWeightBulk",
      "maintenanceSet",
      "serviceConfigtest",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "settingsAddAcl",
      "settingsAddAction",
      "settingsAddBackend",
      "settingsAddCpu",
      "settingsAddErrorfile",
      "settingsAddFcgi",
      "settingsAddFrontend",
      "settingsAddGroup",
      "settingsAddHealthcheck",
      "settingsAddLua",
      "settingsAddMapfile",
      "settingsAddServer",
      "settingsAddUser",
      "settingsAddmailer",
      "settingsAddresolver",
      "settingsDelAcl",
      "settingsDelAction",
      "settingsDelBackend",
      "settingsDelCpu",
      "settingsDelErrorfile",
      "settingsDelFcgi",
      "settingsDelFrontend",
      "settingsDelGroup",
      "settingsDelHealthcheck",
      "settingsDelLua",
      "settingsDelMapfile",
      "settingsDelServer",
      "settingsDelUser",
      "settingsDelmailer",
      "settingsDelresolver",
      "settingsGet",
      "settingsGetAcl",
      "settingsGetAction",
      "settingsGetBackend",
      "settingsGetCpu",
      "settingsGetErrorfile",
      "settingsGetFcgi",
      "settingsGetFrontend",
      "settingsGetGroup",
      "settingsGetHealthcheck",
      "settingsGetLua",
      "settingsGetMapfile",
      "settingsGetServer",
      "settingsGetUser",
      "settingsGetmailer",
      "settingsGetresolver",
      "settingsSet",
      "settingsSetAcl",
      "settingsSetAction",
      "settingsSetBackend",
      "settingsSetCpu",
      "settingsSetErrorfile",
      "settingsSetFcgi",
      "settingsSetFrontend",
      "settingsSetGroup",
      "settingsSetHealthcheck",
      "settingsSetLua",
      "settingsSetMapfile",
      "settingsSetServer",
      "settingsSetUser",
      "settingsSetmailer",
      "settingsSetresolver",
      "settingsToggleBackend",
      "settingsToggleCpu",
      "settingsToggleFrontend",
      "settingsToggleGroup",
      "settingsToggleLua",
      "settingsToggleServer",
      "settingsToggleUser",
      "settingsTogglemailer",
      "settingsToggleresolver",
      "statisticsCounters",
      "statisticsInfo",
      "statisticsTables"
    ]
  },
  "plugins.helloworld": {
    "toolName": "plugin_helloworld_manage",
    "methods": [
      "serviceReload",
      "serviceTest",
      "settingsGet",
      "settingsSet"
    ]
  },
  "plugins.hwprobe": {
    "toolName": "plugin_hwprobe_manage",
    "methods": [
      "generalGet",
      "generalSet",
      "serviceReconfigure",
      "serviceReport",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ]
  },
  "plugins.iperf": {
    "toolName": "plugin_iperf_manage",
    "methods": [
      "instanceGet",
      "instanceQuery",
      "instanceSet",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ]
  },
  "plugins.lldpd": {
    "toolName": "plugin_lldpd_manage",
    "methods": [
      "generalGet",
      "generalSet",
      "serviceNeighbor",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ]
  },
  "plugins.maltrail": {
    "toolName": "plugin_maltrail_manage",
    "methods": [
      "generalGet",
      "generalSet",
      "sensorGet",
      "sensorSet",
      "serverGet",
      "serverSet",
      "serverserviceReconfigure",
      "serverserviceRestart",
      "serverserviceStart",
      "serverserviceStatus",
      "serverserviceStop",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ]
  },
  "plugins.mdnsrepeater": {
    "toolName": "plugin_mdnsrepeater_manage",
    "methods": [
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "settingsGet",
      "settingsSet"
    ]
  },
  "plugins.muninnode": {
    "toolName": "plugin_muninnode_manage",
    "methods": [
      "generalGet",
      "generalSet",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ]
  },
  "plugins.ndproxy": {
    "toolName": "plugin_ndproxy_manage",
    "methods": [
      "generalGet",
      "generalSet",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ]
  },
  "plugins.netdata": {
    "toolName": "plugin_netdata_manage",
    "methods": [
      "generalGet",
      "generalSet",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ]
  },
  "plugins.netsnmp": {
    "toolName": "plugin_netsnmp_manage",
    "methods": [
      "generalGet",
      "generalSet",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "userAddUser",
      "userDelUser",
      "userGet",
      "userGetUser",
      "userSet",
      "userSetUser",
      "userToggleUser"
    ]
  },
  "plugins.nginx": {
    "toolName": "plugin_nginx_manage",
    "methods": [
      "bansDelban",
      "bansGet",
      "bansSet",
      "logsAccesses",
      "logsErrors",
      "logsStreamaccesses",
      "logsStreamerrors",
      "logsTlsHandshakes",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "serviceVts",
      "settingsAddcachePath",
      "settingsAddcredential",
      "settingsAddcustompolicy",
      "settingsAdderrorpage",
      "settingsAddhttprewrite",
      "settingsAddhttpserver",
      "settingsAddipacl",
      "settingsAddlimitRequestConnection",
      "settingsAddlimitZone",
      "settingsAddlocation",
      "settingsAddnaxsirule",
      "settingsAddresolver",
      "settingsAddsecurityHeader",
      "settingsAddsnifwd",
      "settingsAddstreamserver",
      "settingsAddsyslogTarget",
      "settingsAddtlsFingerprint",
      "settingsAddupstream",
      "settingsAddupstreamserver",
      "settingsAdduserlist",
      "settingsDelcachePath",
      "settingsDelcredential",
      "settingsDelcustompolicy",
      "settingsDelerrorpage",
      "settingsDelhttprewrite",
      "settingsDelhttpserver",
      "settingsDelipacl",
      "settingsDellimitRequestConnection",
      "settingsDellimitZone",
      "settingsDellocation",
      "settingsDelnaxsirule",
      "settingsDelresolver",
      "settingsDelsecurityHeader",
      "settingsDelsnifwd",
      "settingsDelstreamserver",
      "settingsDelsyslogTarget",
      "settingsDeltlsFingerprint",
      "settingsDelupstream",
      "settingsDelupstreamserver",
      "settingsDeluserlist",
      "settingsDownloadrules",
      "settingsGet",
      "settingsGetcachePath",
      "settingsGetcredential",
      "settingsGetcustompolicy",
      "settingsGeterrorpage",
      "settingsGethttprewrite",
      "settingsGethttpserver",
      "settingsGetipacl",
      "settingsGetlimitRequestConnection",
      "settingsGetlimitZone",
      "settingsGetlocation",
      "settingsGetnaxsirule",
      "settingsGetresolver",
      "settingsGetsecurityHeader",
      "settingsGetsnifwd",
      "settingsGetstreamserver",
      "settingsGetsyslogTarget",
      "settingsGettlsFingerprint",
      "settingsGetupstream",
      "settingsGetupstreamserver",
      "settingsGetuserlist",
      "settingsSet",
      "settingsSetcachePath",
      "settingsSetcredential",
      "settingsSetcustompolicy",
      "settingsSeterrorpage",
      "settingsSethttprewrite",
      "settingsSethttpserver",
      "settingsSetipacl",
      "settingsSetlimitRequestConnection",
      "settingsSetlimitZone",
      "settingsSetlocation",
      "settingsSetnaxsirule",
      "settingsSetresolver",
      "settingsSetsecurityHeader",
      "settingsSetsnifwd",
      "settingsSetstreamserver",
      "settingsSetsyslogTarget",
      "settingsSettlsFingerprint",
      "settingsSetupstream",
      "settingsSetupstreamserver",
      "settingsSetuserlist",
      "settingsShowconfig",
      "settingsTestconfig"
    ]
  },
  "plugins.nodeexporter": {
    "toolName": "plugin_nodeexporter_manage",
    "methods": [
      "generalGet",
      "generalSet",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ]
  },
  "plugins.nrpe": {
    "toolName": "plugin_nrpe_manage",
    "methods": [
      "commandAddCommand",
      "commandDelCommand",
      "commandGet",
      "commandGetCommand",
      "commandSet",
      "commandSetCommand",
      "commandToggleCommand",
      "generalGet",
      "generalSet",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ]
  },
  "plugins.ntopng": {
    "toolName": "plugin_ntopng_manage",
    "methods": [
      "generalGet",
      "generalSet",
      "serviceCheckredis",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ]
  },
  "plugins.nut": {
    "toolName": "plugin_nut_manage",
    "methods": [
      "diagnosticsUpsstatus",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "settingsGet",
      "settingsSet"
    ]
  },
  "plugins.openconnect": {
    "toolName": "plugin_openconnect_manage",
    "methods": [
      "generalGet",
      "generalSet",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ]
  },
  "plugins.postfix": {
    "toolName": "plugin_postfix_manage",
    "methods": [
      "addressAddAddress",
      "addressDelAddress",
      "addressGet",
      "addressGetAddress",
      "addressSet",
      "addressSetAddress",
      "addressToggleAddress",
      "antispamGet",
      "antispamSet",
      "domainAddDomain",
      "domainDelDomain",
      "domainGet",
      "domainGetDomain",
      "domainSet",
      "domainSetDomain",
      "domainToggleDomain",
      "generalGet",
      "generalSet",
      "headerchecksAddHeadercheck",
      "headerchecksDelHeadercheck",
      "headerchecksGet",
      "headerchecksGetHeadercheck",
      "headerchecksSet",
      "headerchecksSetHeadercheck",
      "headerchecksToggleHeadercheck",
      "recipientAddRecipient",
      "recipientDelRecipient",
      "recipientGet",
      "recipientGetRecipient",
      "recipientSet",
      "recipientSetRecipient",
      "recipientToggleRecipient",
      "recipientbccAddRecipientbcc",
      "recipientbccDelRecipientbcc",
      "recipientbccGet",
      "recipientbccGetRecipientbcc",
      "recipientbccSet",
      "recipientbccSetRecipientbcc",
      "recipientbccToggleRecipientbcc",
      "senderAddSender",
      "senderDelSender",
      "senderGet",
      "senderGetSender",
      "senderSet",
      "senderSetSender",
      "senderToggleSender",
      "senderbccAddSenderbcc",
      "senderbccDelSenderbcc",
      "senderbccGet",
      "senderbccGetSenderbcc",
      "senderbccSet",
      "senderbccSetSenderbcc",
      "senderbccToggleSenderbcc",
      "sendercanonicalAddSendercanonical",
      "sendercanonicalDelSendercanonical",
      "sendercanonicalGet",
      "sendercanonicalGetSendercanonical",
      "sendercanonicalSet",
      "sendercanonicalSetSendercanonical",
      "sendercanonicalToggleSendercanonical",
      "serviceCheckrspamd",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ]
  },
  "plugins.proxy": {
    "toolName": "plugin_proxy_manage",
    "methods": [
      "serviceDownloadacls",
      "serviceFetchacls",
      "serviceReconfigure",
      "serviceRefreshTemplate",
      "serviceReset",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "settingsAddPACMatch",
      "settingsAddPACProxy",
      "settingsAddPACRule",
      "settingsAddRemoteBlacklist",
      "settingsDelPACMatch",
      "settingsDelPACProxy",
      "settingsDelPACRule",
      "settingsDelRemoteBlacklist",
      "settingsFetchRBCron",
      "settingsGet",
      "settingsGetPACMatch",
      "settingsGetPACProxy",
      "settingsGetPACRule",
      "settingsGetRemoteBlacklist",
      "settingsSearchRemoteBlacklists",
      "settingsSet",
      "settingsSetPACMatch",
      "settingsSetPACProxy",
      "settingsSetPACRule",
      "settingsSetRemoteBlacklist",
      "settingsTogglePACRule",
      "settingsToggleRemoteBlacklist",
      "templateGet",
      "templateReset",
      "templateSet",
      "aclAddCustomPolicy",
      "aclAddPolicy",
      "aclApply",
      "aclDelCustomPolicy",
      "aclDelPolicy",
      "aclGet",
      "aclGetCustomPolicy",
      "aclGetPolicy",
      "aclSet",
      "aclSetCustomPolicy",
      "aclSetPolicy",
      "aclTest",
      "aclToggleCustomPolicy",
      "aclTogglePolicy"
    ]
  },
  "plugins.proxysso": {
    "toolName": "plugin_proxysso_manage",
    "methods": [
      "serviceCreatekeytab",
      "serviceDeletekeytab",
      "serviceGetCheckList",
      "serviceShowkeytab",
      "serviceTestkerblogin",
      "settingsGet",
      "settingsSet"
    ]
  },
  "plugins.puppetagent": {
    "toolName": "plugin_puppetagent_manage",
    "methods": [
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "settingsGet",
      "settingsSet"
    ]
  },
  "plugins.qemuguestagent": {
    "toolName": "plugin_qemuguestagent_manage",
    "methods": [
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "settingsGet",
      "settingsSet"
    ]
  },
  "plugins.quagga": {
    "toolName": "plugin_quagga_manage",
    "methods": [
      "bfdAddNeighbor",
      "bfdDelNeighbor",
      "bfdGet",
      "bfdGetNeighbor",
      "bfdSet",
      "bfdSetNeighbor",
      "bfdToggleNeighbor",
      "bgpAddAspath",
      "bgpAddCommunitylist",
      "bgpAddNeighbor",
      "bgpAddPeergroup",
      "bgpAddPrefixlist",
      "bgpAddRedistribution",
      "bgpAddRoutemap",
      "bgpDelAspath",
      "bgpDelCommunitylist",
      "bgpDelNeighbor",
      "bgpDelPeergroup",
      "bgpDelPrefixlist",
      "bgpDelRedistribution",
      "bgpDelRoutemap",
      "bgpGet",
      "bgpGetAspath",
      "bgpGetCommunitylist",
      "bgpGetNeighbor",
      "bgpGetPeergroup",
      "bgpGetPrefixlist",
      "bgpGetRedistribution",
      "bgpGetRoutemap",
      "bgpSet",
      "bgpSetAspath",
      "bgpSetCommunitylist",
      "bgpSetNeighbor",
      "bgpSetPeergroup",
      "bgpSetPrefixlist",
      "bgpSetRedistribution",
      "bgpSetRoutemap",
      "bgpToggleAspath",
      "bgpToggleCommunitylist",
      "bgpToggleNeighbor",
      "bgpTogglePeergroup",
      "bgpTogglePrefixlist",
      "bgpToggleRedistribution",
      "bgpToggleRoutemap",
      "diagnosticsBfdcounters",
      "diagnosticsBfdneighbors",
      "diagnosticsBfdsummary",
      "diagnosticsBgpneighbors",
      "diagnosticsBgpsummary",
      "diagnosticsGeneralrunningconfig",
      "diagnosticsOspfdatabase",
      "diagnosticsOspfinterface",
      "diagnosticsOspfoverview",
      "diagnosticsOspfv3interface",
      "diagnosticsOspfv3overview",
      "diagnosticsSearchBgproute4",
      "diagnosticsSearchBgproute6",
      "diagnosticsSearchGeneralroute4",
      "diagnosticsSearchGeneralroute6",
      "diagnosticsSearchOspfneighbor",
      "diagnosticsSearchOspfroute",
      "diagnosticsSearchOspfv3database",
      "diagnosticsSearchOspfv3route",
      "generalGet",
      "generalSet",
      "ospf6settingsAddInterface",
      "ospf6settingsAddNetwork",
      "ospf6settingsAddPrefixlist",
      "ospf6settingsAddRedistribution",
      "ospf6settingsAddRoutemap",
      "ospf6settingsDelInterface",
      "ospf6settingsDelNetwork",
      "ospf6settingsDelPrefixlist",
      "ospf6settingsDelRedistribution",
      "ospf6settingsDelRoutemap",
      "ospf6settingsGet",
      "ospf6settingsGetInterface",
      "ospf6settingsGetNetwork",
      "ospf6settingsGetPrefixlist",
      "ospf6settingsGetRedistribution",
      "ospf6settingsGetRoutemap",
      "ospf6settingsSet",
      "ospf6settingsSetInterface",
      "ospf6settingsSetNetwork",
      "ospf6settingsSetPrefixlist",
      "ospf6settingsSetRedistribution",
      "ospf6settingsSetRoutemap",
      "ospf6settingsToggleInterface",
      "ospf6settingsToggleNetwork",
      "ospf6settingsTogglePrefixlist",
      "ospf6settingsToggleRedistribution",
      "ospf6settingsToggleRoutemap",
      "ospfsettingsAddInterface",
      "ospfsettingsAddNetwork",
      "ospfsettingsAddPrefixlist",
      "ospfsettingsAddRedistribution",
      "ospfsettingsAddRoutemap",
      "ospfsettingsDelInterface",
      "ospfsettingsDelNetwork",
      "ospfsettingsDelPrefixlist",
      "ospfsettingsDelRedistribution",
      "ospfsettingsDelRoutemap",
      "ospfsettingsGet",
      "ospfsettingsGetInterface",
      "ospfsettingsGetNetwork",
      "ospfsettingsGetPrefixlist",
      "ospfsettingsGetRedistribution",
      "ospfsettingsGetRoutemap",
      "ospfsettingsSet",
      "ospfsettingsSetInterface",
      "ospfsettingsSetNetwork",
      "ospfsettingsSetPrefixlist",
      "ospfsettingsSetRedistribution",
      "ospfsettingsSetRoutemap",
      "ospfsettingsToggleInterface",
      "ospfsettingsToggleNetwork",
      "ospfsettingsTogglePrefixlist",
      "ospfsettingsToggleRedistribution",
      "ospfsettingsToggleRoutemap",
      "ripGet",
      "ripSet",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "staticAddRoute",
      "staticDelRoute",
      "staticGet",
      "staticGetRoute",
      "staticSet",
      "staticSetRoute",
      "staticToggleRoute"
    ]
  },
  "plugins.radsecproxy": {
    "toolName": "plugin_radsecproxy_manage",
    "methods": [
      "clientsAddItem",
      "clientsDelItem",
      "clientsGet",
      "clientsGetItem",
      "clientsSet",
      "clientsSetItem",
      "clientsToggleItem",
      "generalGet",
      "generalSet",
      "realmsAddItem",
      "realmsDelItem",
      "realmsGet",
      "realmsGetItem",
      "realmsSet",
      "realmsSetItem",
      "realmsToggleItem",
      "rewritesAddItem",
      "rewritesDelItem",
      "rewritesGet",
      "rewritesGetItem",
      "rewritesSet",
      "rewritesSetItem",
      "rewritesToggleItem",
      "serversAddItem",
      "serversDelItem",
      "serversGet",
      "serversGetItem",
      "serversSet",
      "serversSetItem",
      "serversToggleItem",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "tlsAddItem",
      "tlsDelItem",
      "tlsGet",
      "tlsGetItem",
      "tlsSet",
      "tlsSetItem",
      "tlsToggleItem"
    ]
  },
  "plugins.redis": {
    "toolName": "plugin_redis_manage",
    "methods": [
      "serviceReconfigure",
      "serviceResetdb",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "settingsGet",
      "settingsSet"
    ]
  },
  "plugins.relayd": {
    "toolName": "plugin_relayd_manage",
    "methods": [
      "serviceConfigtest",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "settingsDel",
      "settingsDirty",
      "settingsGet",
      "settingsSearch",
      "settingsSet",
      "settingsToggle",
      "statusSum",
      "statusToggle"
    ]
  },
  "plugins.rspamd": {
    "toolName": "plugin_rspamd_manage",
    "methods": [
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "settingsGet",
      "settingsSet"
    ]
  },
  "plugins.shadowsocks": {
    "toolName": "plugin_shadowsocks_manage",
    "methods": [
      "generalGet",
      "generalSet",
      "localGet",
      "localSet",
      "localserviceReconfigure",
      "localserviceRestart",
      "localserviceStart",
      "localserviceStatus",
      "localserviceStop",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ]
  },
  "plugins.siproxd": {
    "toolName": "plugin_siproxd_manage",
    "methods": [
      "domainAddDomain",
      "domainDelDomain",
      "domainGet",
      "domainGetDomain",
      "domainSearchDomain",
      "domainSet",
      "domainSetDomain",
      "domainToggleDomain",
      "generalGet",
      "generalSet",
      "serviceReconfigure",
      "serviceRestart",
      "serviceShowregistrations",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "userAddUser",
      "userDelUser",
      "userGet",
      "userGetUser",
      "userSearchUser",
      "userSet",
      "userSetUser",
      "userToggleUser"
    ]
  },
  "plugins.smart": {
    "toolName": "plugin_smart_manage",
    "methods": [
      "serviceAbort",
      "serviceInfo",
      "serviceList",
      "serviceLogs",
      "serviceTest"
    ]
  },
  "plugins.softether": {
    "toolName": "plugin_softether_manage",
    "methods": [
      "generalGet",
      "generalSet",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ]
  },
  "plugins.sslh": {
    "toolName": "plugin_sslh_manage",
    "methods": [
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "settingsGet",
      "settingsIndex",
      "settingsSet"
    ]
  },
  "plugins.stunnel": {
    "toolName": "plugin_stunnel_manage",
    "methods": [
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "servicesAddItem",
      "servicesDelItem",
      "servicesGet",
      "servicesGetItem",
      "servicesSet",
      "servicesSetItem",
      "servicesToggleItem"
    ]
  },
  "plugins.tailscale": {
    "toolName": "plugin_tailscale_manage",
    "methods": [
      "authenticationGet",
      "authenticationSet",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "settingsAddSubnet",
      "settingsDelSubnet",
      "settingsGet",
      "settingsGetSubnet",
      "settingsReload",
      "settingsSet",
      "settingsSetSubnet",
      "statusGet",
      "statusIp",
      "statusNet",
      "statusSet",
      "status"
    ]
  },
  "plugins.tayga": {
    "toolName": "plugin_tayga_manage",
    "methods": [
      "generalGet",
      "generalSet",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ]
  },
  "plugins.telegraf": {
    "toolName": "plugin_telegraf_manage",
    "methods": [
      "generalGet",
      "generalSet",
      "inputGet",
      "inputSet",
      "keyAddKey",
      "keyDelKey",
      "keyGet",
      "keyGetKey",
      "keySet",
      "keySetKey",
      "keyToggleKey",
      "outputGet",
      "outputSet",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ]
  },
  "plugins.tftp": {
    "toolName": "plugin_tftp_manage",
    "methods": [
      "generalGet",
      "generalSet",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ]
  },
  "plugins.tinc": {
    "toolName": "plugin_tinc_manage",
    "methods": [
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStop",
      "settingsDelHost",
      "settingsDelNetwork",
      "settingsGet",
      "settingsGetHost",
      "settingsGetNetwork",
      "settingsSearchHost",
      "settingsSearchNetwork",
      "settingsSet",
      "settingsSetHost",
      "settingsSetNetwork",
      "settingsToggleHost",
      "settingsToggleNetwork"
    ]
  },
  "plugins.tor": {
    "toolName": "plugin_tor_manage",
    "methods": [
      "exitaclAddacl",
      "exitaclDelacl",
      "exitaclGet",
      "exitaclGetacl",
      "exitaclSet",
      "exitaclSetacl",
      "exitaclToggleacl",
      "generalAddhidservauth",
      "generalDelhidservauth",
      "generalGet",
      "generalGethidservauth",
      "generalSet",
      "generalSethidservauth",
      "generalTogglehidservauth",
      "hiddenserviceAddservice",
      "hiddenserviceDelservice",
      "hiddenserviceGet",
      "hiddenserviceGetservice",
      "hiddenserviceSet",
      "hiddenserviceSetservice",
      "hiddenserviceToggleservice",
      "hiddenserviceaclAddacl",
      "hiddenserviceaclDelacl",
      "hiddenserviceaclGet",
      "hiddenserviceaclGetacl",
      "hiddenserviceaclSet",
      "hiddenserviceaclSetacl",
      "hiddenserviceaclToggleacl",
      "relayGet",
      "relaySet",
      "serviceCircuits",
      "serviceGetHiddenServices",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "serviceStreams",
      "socksaclAddacl",
      "socksaclDelacl",
      "socksaclGet",
      "socksaclGetacl",
      "socksaclSet",
      "socksaclSetacl",
      "socksaclToggleacl"
    ]
  },
  "plugins.turnserver": {
    "toolName": "plugin_turnserver_manage",
    "methods": [
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "settingsGet",
      "settingsSet"
    ]
  },
  "plugins.udpbroadcastrelay": {
    "toolName": "plugin_udpbroadcastrelay_manage",
    "methods": [
      "serviceConfig",
      "serviceGet",
      "serviceReload",
      "serviceRestart",
      "serviceSet",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "settingsAddRelay",
      "settingsDelRelay",
      "settingsGet",
      "settingsGetRelay",
      "settingsSearchRelay",
      "settingsSet",
      "settingsSetRelay",
      "settingsToggleRelay"
    ]
  },
  "plugins.vnstat": {
    "toolName": "plugin_vnstat_manage",
    "methods": [
      "generalGet",
      "generalSet",
      "serviceDaily",
      "serviceHourly",
      "serviceMonthly",
      "serviceReconfigure",
      "serviceResetdb",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "serviceYearly"
    ]
  },
  "plugins.wazuhagent": {
    "toolName": "plugin_wazuhagent_manage",
    "methods": [
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "settingsGet",
      "settingsSet"
    ]
  },
  "plugins.wol": {
    "toolName": "plugin_wol_manage",
    "methods": [
      "wolAddHost",
      "wolDelHost",
      "wolGet",
      "wolGetHost",
      "wolGetwake",
      "wolSet",
      "wolSetHost",
      "wolWakeall"
    ]
  },
  "plugins.zabbixagent": {
    "toolName": "plugin_zabbixagent_manage",
    "methods": [
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop",
      "settingsAddAlias",
      "settingsAddUserparameter",
      "settingsDelAlias",
      "settingsDelUserparameter",
      "settingsGet",
      "settingsGetAlias",
      "settingsGetUserparameter",
      "settingsSet",
      "settingsSetAlias",
      "settingsSetUserparameter",
      "settingsToggleAlias",
      "settingsToggleUserparameter"
    ]
  },
  "plugins.zabbixproxy": {
    "toolName": "plugin_zabbixproxy_manage",
    "methods": [
      "generalGet",
      "generalSet",
      "serviceReconfigure",
      "serviceRestart",
      "serviceStart",
      "serviceStatus",
      "serviceStop"
    ]
  },
  "plugins.zerotier": {
    "toolName": "plugin_zerotier_manage",
    "methods": [
      "networkAdd",
      "networkDel",
      "networkGet",
      "networkInfo",
      "networkSearch",
      "networkSet",
      "networkToggle",
      "settingsGet",
      "settingsSet",
      "settingsStatus"
    ]
  }
};

class OPNsenseMCPServer {
  constructor(config) {
    this.config = config;
    this.client = null;
    this.server = new Server(
      {
        name: 'opnsense-mcp-server',
        version: '0.6.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  ensureClient() {
    if (!this.client) {
      this.client = new OPNsenseClient({
        baseUrl: this.config.url,
        apiKey: this.config.apiKey,
        apiSecret: this.config.apiSecret,
        verifySsl: this.config.verifySsl ?? true,
      });
    }
    return this.client;
  }

  setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: this.getAvailableTools(),
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      const tool = TOOLS.find(t => t.name === name);
      if (!tool) {
        throw new McpError(ErrorCode.MethodNotFound, `Tool ${name} not found`);
      }

      // Skip plugin tools if not enabled
      if (tool.module === 'plugins' && !this.config.includePlugins) {
        throw new McpError(ErrorCode.MethodNotFound, `Plugin tools not enabled. Use --plugins flag to enable.`);
      }

      try {
        const result = await this.callModularTool(tool, args);
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        console.error('Tool call error:', {
          tool: tool.name,
          module: tool.module,
          args,
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        });
        
        // Extract more details from axios errors
        let errorMessage = 'Unknown error';
        if (error instanceof Error) {
          errorMessage = error.message;
          if (error.response) {
            const response = error.response;
            errorMessage = `HTTP ${response.status}: ${response.statusText}\n`;
            if (response.data) {
              errorMessage += `Response: ${JSON.stringify(response.data, null, 2)}`;
            }
          }
        }
        
        return {
          content: [{
            type: 'text',
            text: `Error calling ${tool.name}.${args.method || 'unknown'}: ${errorMessage}`
          }],
        };
      }
    });
  }

  getAvailableTools() {
    return TOOLS.filter(tool => {
      // Include all non-plugin tools
      if (tool.module !== 'plugins') return true;
      // Include plugin tools only if enabled
      return this.config.includePlugins;
    }).map(tool => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema
    }));
  }

  async callModularTool(tool, args) {
    const client = this.ensureClient();
    
    // Validate method parameter
    if (!args.method) {
      throw new Error(`Missing required parameter 'method'. Available methods: ${tool.methods.join(', ')}`);
    }
    
    if (!tool.methods.includes(args.method)) {
      throw new Error(`Invalid method '${args.method}'. Available methods: ${tool.methods.join(', ')}`);
    }
    
    // Get the module
    let moduleObj;
    if (tool.module === 'plugins' && tool.submodule) {
      moduleObj = client.plugins[tool.submodule];
    } else {
      moduleObj = client[tool.module];
    }

    if (!moduleObj) {
      throw new Error(`Module ${tool.module} not found`);
    }

    // Get the method
    const method = moduleObj[args.method];
    if (!method || typeof method !== 'function') {
      throw new Error(`Method ${args.method} not found in module ${tool.module}`);
    }

    // Call the method with params (if provided)
    console.error(`Calling ${tool.module}.${args.method} with params:`, args.params);
    
    // Extract params, excluding the method field
    const { method: _, params = {}, ...otherArgs } = args;
    const callParams = { ...params, ...otherArgs };
    
    // Only pass parameters if there are any
    if (Object.keys(callParams).length > 0) {
      return await method.call(moduleObj, callParams);
    } else {
      return await method.call(moduleObj);
    }
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('OPNsense MCP server v0.6.0 (modular) started');
    console.error(`Core tools: 24 modules`);
    console.error(`Plugin tools: 64 modules (${this.config.includePlugins ? 'enabled' : 'disabled'})`);
    console.error(`Total available: ${this.config.includePlugins ? '88' : '24'} modules`);
  }
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    url: '',
    apiKey: '',
    apiSecret: '',
    verifySsl: true,
    includePlugins: false,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--url':
      case '-u':
        config.url = args[++i];
        break;
      case '--api-key':
      case '-k':
        config.apiKey = args[++i];
        break;
      case '--api-secret':
      case '-s':
        config.apiSecret = args[++i];
        break;
      case '--no-verify-ssl':
        config.verifySsl = false;
        break;
      case '--plugins':
        config.includePlugins = true;
        break;
      case '--help':
      case '-h':
        showHelp();
        process.exit(0);
        break;
    }
  }

  return config;
}

function showHelp() {
  console.log(`
OPNsense MCP Server v0.6.0 (Modular Edition)

Usage: opnsense-mcp-server --url <url> --api-key <key> --api-secret <secret> [options]

Required:
  -u, --url <url>           OPNsense API URL (e.g., https://192.168.1.1)
  -k, --api-key <key>       API Key for authentication
  -s, --api-secret <secret> API Secret for authentication

Options:
  --no-verify-ssl           Disable SSL certificate verification
  --plugins                 Include plugin tools (adds 64 plugin modules)
  -h, --help                Show this help message

Environment Variables:
  OPNSENSE_URL              OPNsense API URL
  OPNSENSE_API_KEY          API Key
  OPNSENSE_API_SECRET       API Secret
  OPNSENSE_VERIFY_SSL       Set to 'false' to disable SSL verification
  INCLUDE_PLUGINS           Set to 'true' to include plugin tools

Examples:
  # Basic usage (24 core modules)
  opnsense-mcp-server --url https://192.168.1.1 --api-key mykey --api-secret mysecret

  # With plugins enabled (88 total modules)
  opnsense-mcp-server --url https://192.168.1.1 --api-key mykey --api-secret mysecret --plugins

Tool Usage:
  Each tool represents a module and accepts a 'method' parameter to specify the operation.
  
  Example: firewall_manage
  - method: "aliasSearchItem" - Search firewall aliases
  - method: "aliasAddItem" - Add a new alias
  - method: "aliasSetItem" - Update an existing alias (requires uuid in params)
  
  Parameters are passed in the 'params' object:
  {
    "method": "aliasSearchItem",
    "params": {
      "searchPhrase": "web",
      "current": 1,
      "rowCount": 20
    }
  }

Based on @richard-stovall/opnsense-typescript-client v0.5.3
`);
}

// Main entry point
async function main() {
  const config = parseArgs();
  
  // Use environment variables as fallback
  config.url = config.url || process.env.OPNSENSE_URL || '';
  config.apiKey = config.apiKey || process.env.OPNSENSE_API_KEY || '';
  config.apiSecret = config.apiSecret || process.env.OPNSENSE_API_SECRET || '';
  if (!config.verifySsl || process.env.OPNSENSE_VERIFY_SSL === 'false') {
    config.verifySsl = false;
  }
  if (config.includePlugins || process.env.INCLUDE_PLUGINS === 'true') {
    config.includePlugins = true;
  }

  // Validate required arguments
  if (!config.url || !config.apiKey || !config.apiSecret) {
    console.error('Error: Missing required arguments\n');
    showHelp();
    process.exit(1);
  }

  // Create and start server
  const server = new OPNsenseMCPServer(config);
  await server.start();
}

// Run the server
main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
