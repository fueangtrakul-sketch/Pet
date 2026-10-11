export interface VercelUser {
  id: string;
  email: string;
  name: string;
  username: string;
  avatar?: string;
  billing?: {
    plan: string;
    period?: {
      start: number;
      end: number;
    };
  };
}

export interface VercelTeam {
  id: string;
  slug: string;
  name: string;
  avatar?: string;
  membership?: {
    role: string;
  };
}

export interface VercelProject {
  id: string;
  name: string;
  framework: string;
  accountId: string;
  updatedAt: number;
  createdAt: number;
  link?: {
    type: string;
    repo: string;
    org: string;
  };
  targets?: {
    production?: {
      url: string;
      readySubstate?: string;
      createdAt: number;
    };
  };
  latestDeployments?: VercelDeployment[];
}

export interface VercelDeployment {
  uid: string;
  name: string;
  url: string;
  created: number;
  state: 'BUILDING' | 'ERROR' | 'INITIALIZING' | 'QUEUED' | 'READY' | 'CANCELED';
  meta?: {
    githubCommitMessage?: string;
    githubCommitRef?: string;
    githubCommitSha?: string;
    githubCommitAuthorName?: string;
  };
  creator?: {
    uid: string;
    username: string;
    avatar?: string;
  };
  source?: string;
  target?: string;
}

export interface VercelLogEntry {
  id: string;
  timestamp: number;
  message: string;
  type: 'stdout' | 'stderr' | 'info' | 'error';
  statusCode?: number;
  source?: 'build' | 'runtime' | 'edge';
}

export interface VercelDomain {
  name: string;
  apexName: string;
  verified: boolean;
  configuredBy?: string;
  createdAt: number;
  expiresAt?: number;
  intendedNameservers?: string[];
  nameservers?: string[];
}

export interface VercelEnvVar {
  id: string;
  key: string;
  value: string;
  target: ('production' | 'preview' | 'development')[];
  type: 'plain' | 'secret' | 'encrypted';
  updatedAt: number;
}

export interface McpToolDefinition {
  name: string;
  description: string;
  category: 'projects' | 'deployments' | 'domains' | 'env' | 'logs' | 'docs' | 'analytics';
  inputSchema: {
    type: string;
    properties: Record<string, {
      type: string;
      description: string;
      default?: any;
      enum?: string[];
    }>;
    required?: string[];
  };
  defaultParams?: Record<string, any>;
}

export interface McpToolCallRequest {
  jsonrpc: '2.0';
  id: string | number;
  method: 'tools/call';
  params: {
    name: string;
    arguments: Record<string, any>;
  };
}

export interface McpToolCallResponse {
  jsonrpc: '2.0';
  id: string | number;
  result?: {
    content: Array<{
      type: 'text' | 'image' | 'resource';
      text?: string;
      data?: any;
    }>;
    isError?: boolean;
  };
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}
