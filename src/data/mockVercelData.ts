import { VercelUser, VercelTeam, VercelProject, VercelDeployment, VercelLogEntry, VercelDomain, VercelEnvVar } from '../types/vercel';

export const MOCK_VERCEL_USER: VercelUser = {
  id: 'usr_98a72kc8192801a',
  email: 'fueangtrakul@gmail.com',
  name: 'Fueangtrakul',
  username: 'fueangtrakul-dev',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  billing: {
    plan: 'Pro',
    period: {
      start: Date.now() - 15 * 86400000,
      end: Date.now() + 15 * 86400000,
    },
  },
};

export const MOCK_VERCEL_TEAMS: VercelTeam[] = [
  {
    id: 'team_personal',
    slug: 'personal',
    name: 'Personal Account (Hobby/Pro)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    membership: { role: 'OWNER' },
  },
  {
    id: 'team_981a8c9b201f',
    slug: 'hyperflow-ai',
    name: 'Hyperflow AI Labs',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    membership: { role: 'ADMIN' },
  },
];

export const MOCK_VERCEL_PROJECTS: VercelProject[] = [
  {
    id: 'prj_nextjs_ai_storefront',
    name: 'nextjs-ai-storefront',
    framework: 'nextjs',
    accountId: 'usr_98a72kc8192801a',
    createdAt: Date.now() - 30 * 86400000,
    updatedAt: Date.now() - 120000,
    link: {
      type: 'github',
      repo: 'nextjs-ai-storefront',
      org: 'fueangtrakul',
    },
    targets: {
      production: {
        url: 'nextjs-ai-storefront.vercel.app',
        readySubstate: 'READY',
        createdAt: Date.now() - 180000,
      },
    },
  },
  {
    id: 'prj_fastapi_agent',
    name: 'fastapi-ai-agent',
    framework: 'python',
    accountId: 'usr_98a72kc8192801a',
    createdAt: Date.now() - 14 * 86400000,
    updatedAt: Date.now() - 3600000,
    link: {
      type: 'github',
      repo: 'fastapi-ai-agent',
      org: 'fueangtrakul',
    },
    targets: {
      production: {
        url: 'fastapi-ai-agent.vercel.app',
        readySubstate: 'READY',
        createdAt: Date.now() - 3600000,
      },
    },
  },
  {
    id: 'prj_docs_portal',
    name: 'docs-portal-v2',
    framework: 'astro',
    accountId: 'usr_98a72kc8192801a',
    createdAt: Date.now() - 45 * 86400000,
    updatedAt: Date.now() - 86400000,
    link: {
      type: 'github',
      repo: 'docs-portal-v2',
      org: 'fueangtrakul',
    },
    targets: {
      production: {
        url: 'docs-portal-v2.vercel.app',
        readySubstate: 'READY',
        createdAt: Date.now() - 86400000,
      },
    },
  },
];

export const MOCK_VERCEL_DEPLOYMENTS: VercelDeployment[] = [
  {
    uid: 'dpl_8Nqx7A2u4B9q8',
    name: 'nextjs-ai-storefront',
    url: 'nextjs-ai-storefront-git-main-fueangtrakul.vercel.app',
    created: Date.now() - 180000,
    state: 'READY',
    meta: {
      githubCommitMessage: 'feat(mcp): connect Vercel MCP model context protocol tool endpoints',
      githubCommitRef: 'main',
      githubCommitSha: 'a7c392f',
      githubCommitAuthorName: 'fueangtrakul',
    },
    creator: {
      uid: 'usr_98a72kc8192801a',
      username: 'fueangtrakul-dev',
    },
    source: 'git',
    target: 'production',
  },
  {
    uid: 'dpl_7Bv891kLm09p4',
    name: 'nextjs-ai-storefront',
    url: 'nextjs-ai-storefront-git-feature-chat-fueangtrakul.vercel.app',
    created: Date.now() - 3600000 * 3,
    state: 'READY',
    meta: {
      githubCommitMessage: 'refactor: stream response chunk handling with Server-Sent Events',
      githubCommitRef: 'feature/stream-ui',
      githubCommitSha: '4f2e91a',
      githubCommitAuthorName: 'fueangtrakul',
    },
    creator: {
      uid: 'usr_98a72kc8192801a',
      username: 'fueangtrakul-dev',
    },
    source: 'git',
    target: 'preview',
  },
  {
    uid: 'dpl_5Kx129pQa41n2',
    name: 'fastapi-ai-agent',
    url: 'fastapi-ai-agent-fueangtrakul.vercel.app',
    created: Date.now() - 86400000,
    state: 'READY',
    meta: {
      githubCommitMessage: 'fix: install uv loop dependencies in python edge runner',
      githubCommitRef: 'main',
      githubCommitSha: '9b8210c',
      githubCommitAuthorName: 'fueangtrakul',
    },
    creator: {
      uid: 'usr_98a72kc8192801a',
      username: 'fueangtrakul-dev',
    },
    source: 'git',
    target: 'production',
  },
  {
    uid: 'dpl_2M90pLka8821x',
    name: 'docs-portal-v2',
    url: 'docs-portal-v2-stg.vercel.app',
    created: Date.now() - 86400000 * 2,
    state: 'ERROR',
    meta: {
      githubCommitMessage: 'chore: update mdx component syntax',
      githubCommitRef: 'staging',
      githubCommitSha: 'c8109aa',
      githubCommitAuthorName: 'fueangtrakul',
    },
    creator: {
      uid: 'usr_98a72kc8192801a',
      username: 'fueangtrakul-dev',
    },
    source: 'git',
    target: 'preview',
  },
];

export const MOCK_DEPLOYMENT_LOGS: Record<string, VercelLogEntry[]> = {
  dpl_8Nqx7A2u4B9q8: [
    {
      id: 'log_01',
      timestamp: Date.now() - 175000,
      message: 'Running build in Washington, D.C., USA (East) – iad1',
      type: 'info',
      source: 'build',
    },
    {
      id: 'log_02',
      timestamp: Date.now() - 170000,
      message: 'Cloning github.com/fueangtrakul/nextjs-ai-storefront (Branch: main, Commit: a7c392f)',
      type: 'stdout',
      source: 'build',
    },
    {
      id: 'log_03',
      timestamp: Date.now() - 165000,
      message: 'Detected Next.js 15.1.0 with React 19',
      type: 'info',
      source: 'build',
    },
    {
      id: 'log_04',
      timestamp: Date.now() - 160000,
      message: 'Restored build cache from previous successful deployment [turbo cache hit: 84%]',
      type: 'stdout',
      source: 'build',
    },
    {
      id: 'log_05',
      timestamp: Date.now() - 150000,
      message: '▲ Next.js 15.1.0\n- Environments: production\n- Experiments (reactCompiler: true)',
      type: 'stdout',
      source: 'build',
    },
    {
      id: 'log_06',
      timestamp: Date.now() - 140000,
      message: '✓ Compiled /api/mcp/route in 412ms (Edge Runtime)',
      type: 'stdout',
      source: 'build',
    },
    {
      id: 'log_07',
      timestamp: Date.now() - 130000,
      message: '✓ Generated static pages (18/18) in 890ms',
      type: 'stdout',
      source: 'build',
    },
    {
      id: 'log_08',
      timestamp: Date.now() - 120000,
      message: 'Deploying outputs to Vercel Global Edge Network...',
      type: 'info',
      source: 'build',
    },
    {
      id: 'log_09',
      timestamp: Date.now() - 110000,
      message: 'Ready at https://nextjs-ai-storefront.vercel.app [200 OK]',
      type: 'stdout',
      source: 'runtime',
      statusCode: 200,
    },
    {
      id: 'log_10',
      timestamp: Date.now() - 90000,
      message: '[MCP Server] Handshake initialized: client=cursor version=0.45.1 transport=streamable-http',
      type: 'info',
      source: 'runtime',
      statusCode: 200,
    },
  ],
  dpl_2M90pLka8821x: [
    {
      id: 'err_01',
      timestamp: Date.now() - 86400000 * 2 + 5000,
      message: 'Error: Failed to parse MDX frontmatter in /content/docs/mcp-guide.mdx: Unexpected token ":" at line 14',
      type: 'error',
      source: 'build',
    },
    {
      id: 'err_02',
      timestamp: Date.now() - 86400000 * 2 + 6000,
      message: 'Command "astro build" exited with status code 1',
      type: 'stderr',
      source: 'build',
    },
  ],
};

export const MOCK_VERCEL_DOMAINS: VercelDomain[] = [
  {
    name: 'mystorefront.io',
    apexName: 'mystorefront.io',
    verified: true,
    configuredBy: 'CNAME',
    createdAt: Date.now() - 25 * 86400000,
    intendedNameservers: ['ns1.vercel-dns.com', 'ns2.vercel-dns.com'],
    nameservers: ['ns1.vercel-dns.com', 'ns2.vercel-dns.com'],
  },
  {
    name: 'api.mystorefront.io',
    apexName: 'mystorefront.io',
    verified: true,
    configuredBy: 'A',
    createdAt: Date.now() - 20 * 86400000,
    intendedNameservers: ['ns1.vercel-dns.com', 'ns2.vercel-dns.com'],
    nameservers: ['ns1.vercel-dns.com', 'ns2.vercel-dns.com'],
  },
  {
    name: 'preview.mystorefront.io',
    apexName: 'mystorefront.io',
    verified: false,
    configuredBy: 'CNAME',
    createdAt: Date.now() - 2 * 86400000,
    intendedNameservers: ['ns1.vercel-dns.com', 'ns2.vercel-dns.com'],
    nameservers: ['ns1.external-dns.com'],
  },
];

export const MOCK_VERCEL_ENV_VARS: Record<string, VercelEnvVar[]> = {
  'nextjs-ai-storefront': [
    {
      id: 'env_01',
      key: 'DATABASE_URL',
      value: 'postgresql://postgres:••••••••@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres',
      target: ['production', 'preview'],
      type: 'secret',
      updatedAt: Date.now() - 5 * 86400000,
    },
    {
      id: 'env_02',
      key: 'OPENAI_API_KEY',
      value: 'sk-proj-••••••••••••••••••••••••••••••••',
      target: ['production', 'preview', 'development'],
      type: 'secret',
      updatedAt: Date.now() - 10 * 86400000,
    },
    {
      id: 'env_03',
      key: 'NEXT_PUBLIC_APP_URL',
      value: 'https://nextjs-ai-storefront.vercel.app',
      target: ['production'],
      type: 'plain',
      updatedAt: Date.now() - 12 * 86400000,
    },
    {
      id: 'env_04',
      key: 'VERCEL_MCP_ENDPOINT',
      value: 'https://mcp.vercel.com',
      target: ['production', 'preview', 'development'],
      type: 'plain',
      updatedAt: Date.now() - 1 * 86400000,
    },
  ],
};

export const MOCK_DOCS_RESULTS = [
  {
    title: 'Model Context Protocol (MCP) on Vercel',
    snippet: 'Vercel provides an official MCP server hosted at https://mcp.vercel.com that connects AI coding assistants (Cursor, Claude, VS Code) to Vercel projects, deployments, logs, and analytics.',
    url: 'https://vercel.com/docs/mcp',
  },
  {
    title: 'Connecting Cursor to Vercel MCP',
    snippet: 'Add the Vercel MCP server to your `.cursor/mcp.json` file or run `vercel mcp` to authorize your account via browser-based OAuth.',
    url: 'https://vercel.com/docs/mcp/cursor',
  },
  {
    title: 'Claude Desktop Integration with Vercel',
    snippet: 'Configure `claude_desktop_config.json` with the Vercel MCP server endpoint to let Claude inspect logs, project environments, and build statuses.',
    url: 'https://vercel.com/docs/mcp/claude',
  },
  {
    title: 'Deploying Custom MCP Servers on Vercel',
    snippet: 'You can deploy custom MCP servers using Streamable HTTP transport and @modelcontextprotocol/sdk or mcp-handler on Vercel Edge and Serverless functions.',
    url: 'https://vercel.com/docs/mcp/deploy',
  },
];
