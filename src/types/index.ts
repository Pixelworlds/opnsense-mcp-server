import { z } from 'zod';
import type { OPNsenseClient } from '@richard-stovall/opnsense-typescript-client';

// Configuration schema following MCP patterns
export const ServerConfigSchema = z.object({
  opnsense: z.object({
    url: z.string().url().describe('OPNsense API URL'),
    apiKey: z.string().describe('OPNsense API Key'),
    apiSecret: z.string().describe('OPNsense API Secret'),
    verifySsl: z.boolean().default(true).describe('Enable SSL verification'),
  }),
  plugins: z.object({
    includeAll: z.boolean().default(true).describe('Include all plugins'),
    enabled: z.array(z.string()).optional().describe('List of enabled plugins'),
    disabled: z.array(z.string()).optional().describe('List of disabled plugins'),
  }).optional(),
});

export type ServerConfig = z.infer<typeof ServerConfigSchema>;

export interface ModuleMetadata {
  name: string;
  description: string;
  isPlugin: boolean;
  available: boolean;
  methods: string[];
}

export interface ToolMetadata {
  name: string;
  description: string;
  module: string;
  method: string;
  isPlugin: boolean;
  inputSchema?: z.ZodObject<any>;
}

export interface ResourceMetadata {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
  module: string;
  isPlugin: boolean;
}

export interface PromptMetadata {
  name: string;
  description: string;
  arguments: Array<{
    name: string;
    description: string;
    required: boolean;
  }>;
  tools: string[];
  isPlugin: boolean;
}

export interface ServerContext {
  client?: OPNsenseClient;
  config?: ServerConfig;
  availableModules: Set<string>;
  installedPlugins: Set<string>;
}

export interface BuildConfig {
  core: {
    description: string;
    modules: Record<string, boolean>;
  };
  plugins: {
    description: string;
    includeAll: boolean;
    modules: Record<string, boolean>;
  };
  build: {
    outputFile: string;
    sourcemap: boolean;
    minify: boolean;
    format: 'cjs' | 'esm';
  };
}