import { McpToolDefinition } from '../types/vercel';

export const VERCEL_MCP_TOOLS: McpToolDefinition[] = [
  {
    name: 'list_projects',
    description: 'List all Vercel projects belonging to the user or selected team, including framework and production URLs.',
    category: 'projects',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Maximum number of projects to return (1-100)',
          default: 10,
        },
        search: {
          type: 'string',
          description: 'Search string to filter projects by name',
        },
      },
    },
    defaultParams: {
      limit: 10,
      search: '',
    },
  },
  {
    name: 'get_project',
    description: 'Retrieve detailed information, git repository linkage, and build configurations for a specific project.',
    category: 'projects',
    inputSchema: {
      type: 'object',
      properties: {
        projectIdOrName: {
          type: 'string',
          description: 'The unique project ID or project name slug',
        },
      },
      required: ['projectIdOrName'],
    },
    defaultParams: {
      projectIdOrName: 'nextjs-ai-storefront',
    },
  },
  {
    name: 'list_deployments',
    description: 'List recent deployments for all projects or a specific project, with current build and health status.',
    category: 'deployments',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: {
          type: 'string',
          description: 'Optional project ID to filter deployments',
        },
        limit: {
          type: 'number',
          description: 'Number of deployments to retrieve (1-100)',
          default: 10,
        },
        state: {
          type: 'string',
          description: 'Filter by deployment state (BUILDING, ERROR, READY, CANCELED)',
          enum: ['READY', 'BUILDING', 'ERROR', 'CANCELED', 'ALL'],
        },
      },
    },
    defaultParams: {
      limit: 5,
      state: 'ALL',
    },
  },
  {
    name: 'get_deployment',
    description: 'Retrieve details for a specific deployment by ID or URL, including build times and inspect URL.',
    category: 'deployments',
    inputSchema: {
      type: 'object',
      properties: {
        deploymentIdOrUrl: {
          type: 'string',
          description: 'Deployment UID or vercel.app URL',
        },
      },
      required: ['deploymentIdOrUrl'],
    },
    defaultParams: {
      deploymentIdOrUrl: 'dpl_8Nqx7A2u4B9q8',
    },
  },
  {
    name: 'get_deployment_logs',
    description: 'Fetch build logs or runtime execution logs for troubleshooting deployment errors or exceptions.',
    category: 'logs',
    inputSchema: {
      type: 'object',
      properties: {
        deploymentId: {
          type: 'string',
          description: 'The target deployment ID to inspect logs for',
        },
        type: {
          type: 'string',
          description: 'Type of logs to retrieve',
          enum: ['all', 'build', 'runtime', 'error'],
        },
        limit: {
          type: 'number',
          description: 'Max log lines to fetch',
          default: 50,
        },
      },
      required: ['deploymentId'],
    },
    defaultParams: {
      deploymentId: 'dpl_8Nqx7A2u4B9q8',
      type: 'all',
      limit: 50,
    },
  },
  {
    name: 'list_domains',
    description: 'List all custom domains, apex domains, and verification states across projects.',
    category: 'domains',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: {
          type: 'string',
          description: 'Optional project filter for attached domains',
        },
        verifiedOnly: {
          type: 'boolean',
          description: 'Only show verified domains',
          default: false,
        },
      },
    },
    defaultParams: {
      verifiedOnly: false,
    },
  },
  {
    name: 'list_env_vars',
    description: 'Retrieve environment variables configured for a project (Production, Preview, Development targets).',
    category: 'env',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: {
          type: 'string',
          description: 'Project ID or name slug',
        },
      },
      required: ['projectId'],
    },
    defaultParams: {
      projectId: 'nextjs-ai-storefront',
    },
  },
  {
    name: 'create_env_var',
    description: 'Add or update an environment variable for a project with target environments.',
    category: 'env',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: {
          type: 'string',
          description: 'Project ID or name slug',
        },
        key: {
          type: 'string',
          description: 'Variable key name (e.g. DATABASE_URL, AI_MODEL)',
        },
        value: {
          type: 'string',
          description: 'Variable value',
        },
        target: {
          type: 'string',
          description: 'Target environment: production, preview, or development',
          enum: ['production', 'preview', 'development', 'all'],
        },
      },
      required: ['projectId', 'key', 'value'],
    },
    defaultParams: {
      projectId: 'nextjs-ai-storefront',
      key: 'NEXT_PUBLIC_API_URL',
      value: 'https://api.mystore.com',
      target: 'all',
    },
  },
  {
    name: 'search_documentation',
    description: 'Search official Vercel documentation, Next.js guides, Edge Functions, and deployment best practices.',
    category: 'docs',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Keywords or question to search in Vercel docs',
        },
      },
      required: ['query'],
    },
    defaultParams: {
      query: 'model context protocol mcp setup cursor',
    },
  },
  {
    name: 'query_analytics',
    description: 'Query Vercel Web Analytics data such as pageviews, visitors, top paths, and Core Web Vitals.',
    category: 'analytics',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: {
          type: 'string',
          description: 'Target project name or ID',
        },
        range: {
          type: 'string',
          description: 'Time range for metrics',
          enum: ['24h', '7d', '30d'],
        },
      },
      required: ['projectId'],
    },
    defaultParams: {
      projectId: 'nextjs-ai-storefront',
      range: '7d',
    },
  },
  {
    name: 'use_vercel_cli',
    description: 'Execute Vercel CLI actions directly via MCP (e.g. vercel deploy, vercel env pull, vercel logs).',
    category: 'deployments',
    inputSchema: {
      type: 'object',
      properties: {
        command: {
          type: 'string',
          description: 'CLI command and arguments (e.g. "deploy --prod", "env ls")',
        },
      },
      required: ['command'],
    },
    defaultParams: {
      command: 'deploy --prod',
    },
  },
];
