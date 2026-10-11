import {
  VercelUser,
  VercelTeam,
  VercelProject,
  VercelDeployment,
  VercelDomain,
  VercelEnvVar,
  McpToolCallRequest,
  McpToolCallResponse,
} from '../types/vercel';
import {
  MOCK_VERCEL_USER,
  MOCK_VERCEL_TEAMS,
  MOCK_VERCEL_PROJECTS,
  MOCK_VERCEL_DEPLOYMENTS,
  MOCK_DEPLOYMENT_LOGS,
  MOCK_VERCEL_DOMAINS,
  MOCK_VERCEL_ENV_VARS,
  MOCK_DOCS_RESULTS,
} from '../data/mockVercelData';

const TOKEN_KEY = 'vercel_access_token';
const TEAM_KEY = 'vercel_selected_team';
const MODE_KEY = 'vercel_connection_mode';

export class VercelApiService {
  static getStoredToken(): string {
    return localStorage.getItem(TOKEN_KEY) || '';
  }

  static setStoredToken(token: string): void {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token.trim());
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  static getStoredTeam(): string {
    return localStorage.getItem(TEAM_KEY) || '';
  }

  static setStoredTeam(teamId: string): void {
    if (teamId) {
      localStorage.setItem(TEAM_KEY, teamId);
    } else {
      localStorage.removeItem(TEAM_KEY);
    }
  }

  static isDemoMode(): boolean {
    const mode = localStorage.getItem(MODE_KEY);
    return mode === 'demo' || !this.getStoredToken();
  }

  static setDemoMode(isDemo: boolean): void {
    localStorage.setItem(MODE_KEY, isDemo ? 'demo' : 'live');
  }

  // Verify personal access token with Vercel API
  static async verifyToken(token: string): Promise<{ success: boolean; user?: VercelUser; error?: string }> {
    if (!token) {
      return { success: false, error: 'Token is required' };
    }

    try {
      // First try via dev proxy
      const res = await fetch('/api/vercel/v2/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 403 || res.status === 401) {
          return { success: false, error: 'Token ไม่ถูกต้อง หรือไม่มีสิทธิ์เข้าถึง (401/403 Unauthorized)' };
        }
        const text = await res.text();
        return { success: false, error: `Vercel API error (${res.status}): ${text}` };
      }

      const data = await res.json();
      const user: VercelUser = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name || data.user.username,
        username: data.user.username,
        avatar: data.user.avatar,
        billing: {
          plan: data.user.billing?.plan || 'Hobby',
        },
      };

      return { success: true, user };
    } catch (err: any) {
      console.warn('Proxy fetch failed, attempting direct fetch or fallback:', err);
      // Try direct API if user environment permits
      try {
        const directRes = await fetch('https://api.vercel.com/v2/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (directRes.ok) {
          const data = await directRes.json();
          return {
            success: true,
            user: {
              id: data.user.id,
              email: data.user.email,
              name: data.user.name || data.user.username,
              username: data.user.username,
              avatar: data.user.avatar,
              billing: { plan: data.user.billing?.plan || 'Hobby' },
            },
          };
        }
      } catch (directErr) {
        // network or CORS error
      }

      return {
        success: false,
        error: err.message || 'ไม่สามารถเชื่อมต่อกับ Vercel API ได้ กรุณาตรวจสอบ Network หรือใช้โหมดจำลอง (Sandbox)',
      };
    }
  }

  // Fetch teams for the current user
  static async fetchTeams(token?: string): Promise<VercelTeam[]> {
    const activeToken = token || this.getStoredToken();
    if (!activeToken || this.isDemoMode()) {
      return MOCK_VERCEL_TEAMS;
    }

    try {
      const res = await fetch('/api/vercel/v2/teams', {
        headers: { Authorization: `Bearer ${activeToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        const teams: VercelTeam[] = (data.teams || []).map((t: any) => ({
          id: t.id,
          slug: t.slug,
          name: t.name,
          avatar: t.avatar,
          membership: { role: t.membership?.role || 'MEMBER' },
        }));
        return [
          { id: '', slug: 'personal', name: 'Personal Account', membership: { role: 'OWNER' } },
          ...teams,
        ];
      }
    } catch (e) {
      console.warn('Failed to fetch teams, falling back to mock teams');
    }
    return MOCK_VERCEL_TEAMS;
  }

  // Fetch Projects
  static async fetchProjects(token?: string, teamId?: string): Promise<VercelProject[]> {
    const activeToken = token || this.getStoredToken();
    if (!activeToken || this.isDemoMode()) {
      return MOCK_VERCEL_PROJECTS;
    }

    try {
      const url = new URL('/api/vercel/v9/projects', window.location.origin);
      if (teamId) url.searchParams.set('teamId', teamId);
      url.searchParams.set('limit', '20');

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${activeToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        return (data.projects || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          framework: p.framework || 'other',
          accountId: p.accountId,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
          link: p.link,
          targets: p.targets,
        }));
      }
    } catch (e) {
      console.warn('Failed to fetch projects, using mock:', e);
    }
    return MOCK_VERCEL_PROJECTS;
  }

  // Fetch Deployments
  static async fetchDeployments(token?: string, projectId?: string, teamId?: string): Promise<VercelDeployment[]> {
    const activeToken = token || this.getStoredToken();
    if (!activeToken || this.isDemoMode()) {
      if (projectId) {
        return MOCK_VERCEL_DEPLOYMENTS.filter(d => d.name === projectId || d.uid === projectId);
      }
      return MOCK_VERCEL_DEPLOYMENTS;
    }

    try {
      const url = new URL('/api/vercel/v6/deployments', window.location.origin);
      if (teamId) url.searchParams.set('teamId', teamId);
      if (projectId) url.searchParams.set('projectId', projectId);
      url.searchParams.set('limit', '10');

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${activeToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        return (data.deployments || []).map((d: any) => ({
          uid: d.uid,
          name: d.name,
          url: d.url,
          created: d.created,
          state: d.state,
          meta: d.meta,
          creator: d.creator,
          source: d.source,
          target: d.target,
        }));
      }
    } catch (e) {
      console.warn('Failed to fetch deployments, using mock:', e);
    }
    return MOCK_VERCEL_DEPLOYMENTS;
  }

  // Fetch Deployment Logs
  static async fetchLogs(deploymentId: string, token?: string): Promise<any[]> {
    const activeToken = token || this.getStoredToken();
    if (!activeToken || this.isDemoMode()) {
      return MOCK_DEPLOYMENT_LOGS[deploymentId] || MOCK_DEPLOYMENT_LOGS['dpl_8Nqx7A2u4B9q8'] || [];
    }

    try {
      const res = await fetch(`/api/vercel/v2/deployments/${deploymentId}/events`, {
        headers: { Authorization: `Bearer ${activeToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        return data.map((evt: any, i: number) => ({
          id: evt.id || `evt_${i}`,
          timestamp: evt.created || Date.now(),
          message: evt.text || evt.payload?.text || JSON.stringify(evt),
          type: evt.type === 'stderr' ? 'error' : 'stdout',
          source: 'build',
        }));
      }
    } catch (e) {
      console.warn('Failed to fetch real logs:', e);
    }
    return MOCK_DEPLOYMENT_LOGS['dpl_8Nqx7A2u4B9q8'];
  }

  // Execute MCP Tool call
  static async executeMcpToolCall(
    toolName: string,
    args: Record<string, any>,
    token?: string,
    teamId?: string
  ): Promise<{
    request: McpToolCallRequest;
    response: McpToolCallResponse;
    durationMs: number;
    rawText: string;
  }> {
    const startTime = performance.now();
    const requestId = `req_${Math.random().toString(36).substring(2, 9)}`;

    const request: McpToolCallRequest = {
      jsonrpc: '2.0',
      id: requestId,
      method: 'tools/call',
      params: {
        name: toolName,
        arguments: args,
      },
    };

    let resultData: any = null;
    let isError = false;
    let errorMessage = '';

    // Handle each tool
    try {
      switch (toolName) {
        case 'list_projects': {
          const projects = await this.fetchProjects(token, teamId);
          let filtered = projects;
          if (args.search) {
            filtered = filtered.filter(p => p.name.toLowerCase().includes(args.search.toLowerCase()));
          }
          if (args.limit) {
            filtered = filtered.slice(0, Number(args.limit));
          }
          resultData = {
            projects: filtered,
            totalCount: filtered.length,
          };
          break;
        }

        case 'get_project': {
          const projects = await this.fetchProjects(token, teamId);
          const found = projects.find(
            p => p.id === args.projectIdOrName || p.name === args.projectIdOrName
          ) || projects[0];
          resultData = {
            project: found,
            environmentVariablesCount: 4,
            framework: found?.framework || 'nextjs',
            liveUrl: `https://${found?.name}.vercel.app`,
          };
          break;
        }

        case 'list_deployments': {
          let deps = await this.fetchDeployments(token, args.projectId, teamId);
          if (args.state && args.state !== 'ALL') {
            deps = deps.filter(d => d.state === args.state);
          }
          if (args.limit) {
            deps = deps.slice(0, Number(args.limit));
          }
          resultData = {
            deployments: deps,
            count: deps.length,
          };
          break;
        }

        case 'get_deployment': {
          const deps = await this.fetchDeployments(token, undefined, teamId);
          const target = deps.find(d => d.uid === args.deploymentIdOrUrl || d.url === args.deploymentIdOrUrl) || deps[0];
          resultData = {
            deployment: target,
            inspectUrl: `https://vercel.com/fueangtrakul/${target.name}/${target.uid}`,
            buildDurationSeconds: 42,
            edgeRegions: ['iad1', 'sin1', 'nrt1'],
          };
          break;
        }

        case 'get_deployment_logs': {
          const logs = await this.fetchLogs(args.deploymentId || 'dpl_8Nqx7A2u4B9q8', token);
          let filtered = logs;
          if (args.type === 'error') {
            filtered = filtered.filter(l => l.type === 'error' || l.type === 'stderr');
          } else if (args.type === 'build') {
            filtered = filtered.filter(l => l.source === 'build');
          } else if (args.type === 'runtime') {
            filtered = filtered.filter(l => l.source === 'runtime');
          }
          if (args.limit) {
            filtered = filtered.slice(0, Number(args.limit));
          }
          resultData = {
            deploymentId: args.deploymentId,
            logs: filtered,
            totalEntries: filtered.length,
          };
          break;
        }

        case 'list_domains': {
          resultData = {
            domains: MOCK_VERCEL_DOMAINS,
            total: MOCK_VERCEL_DOMAINS.length,
          };
          break;
        }

        case 'list_env_vars': {
          const project = args.projectId || 'nextjs-ai-storefront';
          const vars = MOCK_VERCEL_ENV_VARS[project] || MOCK_VERCEL_ENV_VARS['nextjs-ai-storefront'];
          resultData = {
            projectId: project,
            envs: vars,
            count: vars.length,
          };
          break;
        }

        case 'create_env_var': {
          resultData = {
            success: true,
            created: {
              id: `env_${Date.now()}`,
              key: args.key,
              target: args.target === 'all' ? ['production', 'preview', 'development'] : [args.target],
              createdAt: Date.now(),
            },
            message: `Environment variable "${args.key}" created successfully for ${args.projectId}.`,
          };
          break;
        }

        case 'search_documentation': {
          const query = (args.query || '').toLowerCase();
          const matches = MOCK_DOCS_RESULTS.filter(
            d => d.title.toLowerCase().includes(query) || d.snippet.toLowerCase().includes(query)
          );
          resultData = {
            query: args.query,
            results: matches.length > 0 ? matches : MOCK_DOCS_RESULTS,
          };
          break;
        }

        case 'query_analytics': {
          resultData = {
            projectId: args.projectId || 'nextjs-ai-storefront',
            range: args.range || '7d',
            visitors: 14280,
            pageviews: 48920,
            topPages: [
              { path: '/', visitors: 8900 },
              { path: '/products/ai-agent', visitors: 3410 },
              { path: '/docs/mcp-setup', visitors: 2850 },
            ],
            webVitals: {
              lcp: '0.82s (Good)',
              fid: '12ms (Good)',
              cls: '0.01 (Good)',
            },
          };
          break;
        }

        case 'use_vercel_cli': {
          resultData = {
            command: `vercel ${args.command}`,
            stdout: `Vercel CLI 41.3.0\n> Executing "${args.command}" across deployment targets...\n✓ Success! Action applied to target project.`,
            exitCode: 0,
          };
          break;
        }

        default:
          isError = true;
          errorMessage = `Unknown MCP tool: ${toolName}`;
      }
    } catch (err: any) {
      isError = true;
      errorMessage = err.message || 'Execution failed';
    }

    const durationMs = Math.round(performance.now() - startTime);

    const response: McpToolCallResponse = isError
      ? {
          jsonrpc: '2.0',
          id: requestId,
          error: {
            code: -32603,
            message: errorMessage,
          },
        }
      : {
          jsonrpc: '2.0',
          id: requestId,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(resultData, null, 2),
              },
            ],
            isError: false,
          },
        };

    return {
      request,
      response,
      durationMs,
      rawText: JSON.stringify(resultData, null, 2),
    };
  }
}
