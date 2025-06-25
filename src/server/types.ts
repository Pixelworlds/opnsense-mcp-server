/**
 * Type definitions for the OPNsense MCP Server
 * These types are exported for use by consumers of the package
 */

export interface ServerConfig {
  host?: string;
  apiKey?: string;
  apiSecret?: string;
  verifySsl?: boolean;
  plugins?: boolean;
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface ToolHandler {
  (args: any): Promise<{
    content: Array<{ type: 'text'; text: string }>;
  }>;
}

export interface ToolHandlers {
  [toolName: string]: ToolHandler;
}

export interface ModuleInitialization {
  tools: ToolDefinition[];
  handlers: ToolHandlers;
  resources?: any[];
  prompts?: any[];
}

export interface ResourceDefinition {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
  schema?: ResourceSchema;
  examples?: ResourceExample[];
  relatedResources?: string[];
  accessPatterns?: AccessPattern[];
}

export interface ResourceSchema {
  type: string;
  properties: Record<string, PropertyDefinition>;
  required?: string[];
}

export interface PropertyDefinition {
  type: string;
  description?: string;
  format?: string;
  enum?: string[];
  items?: PropertyDefinition;
  properties?: Record<string, PropertyDefinition>;
}

export interface ResourceExample {
  name: string;
  description: string;
  data: any;
}

export interface AccessPattern {
  pattern: string;
  description: string;
  example: string;
}
