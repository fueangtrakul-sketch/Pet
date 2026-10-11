import React, { useState } from 'react';
import {
  Play,
  Terminal,
  Layers,
  FolderGit2,
  FileText,
  Search,
  Globe,
  Lock,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Clock,
  Copy,
  Check,
  Code2,
  ExternalLink,
  Loader2,
  Eye,
  EyeOff,
  Filter,
} from 'lucide-react';
import { VERCEL_MCP_TOOLS } from '../data/mcpToolsDefinitions';
import { VercelApiService } from '../services/vercelApi';
import { McpToolDefinition, McpToolCallRequest, McpToolCallResponse } from '../types/vercel';

export const McpPlayground: React.FC = () => {
  const [selectedToolName, setSelectedToolName] = useState<string>('list_projects');
  const [params, setParams] = useState<Record<string, any>>({ limit: 10, search: '' });
  const [activeOutputTab, setActiveOutputTab] = useState<'visual' | 'raw'>('visual');
  const [executing, setExecuting] = useState(false);
  const [lastExecution, setLastExecution] = useState<{
    request: McpToolCallRequest;
    response: McpToolCallResponse;
    durationMs: number;
    rawText: string;
  } | null>(null);
  const [copiedRaw, setCopiedRaw] = useState(false);
  const [revealedEnvs, setRevealedEnvs] = useState<Record<string, boolean>>({});
  const [logFilter, setLogFilter] = useState('');

  const selectedTool: McpToolDefinition =
    VERCEL_MCP_TOOLS.find(t => t.name === selectedToolName) || VERCEL_MCP_TOOLS[0];

  const handleSelectTool = (tool: McpToolDefinition) => {
    setSelectedToolName(tool.name);
    setParams(tool.defaultParams || {});
  };

  const handleParamChange = (key: string, value: any) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const handleExecute = async () => {
    setExecuting(true);
    try {
      const result = await VercelApiService.executeMcpToolCall(
        selectedToolName,
        params,
        VercelApiService.getStoredToken(),
        VercelApiService.getStoredTeam()
      );
      setLastExecution(result);
    } catch (err: any) {
      console.error('Tool execution error:', err);
    } finally {
      setExecuting(false);
    }
  };

  // Run automatically on initial mount if not yet executed
  React.useEffect(() => {
    if (!lastExecution) {
      handleExecute();
    }
  }, [selectedToolName]);

  const handleCopyRaw = () => {
    if (!lastExecution) return;
    navigator.clipboard.writeText(
      JSON.stringify(
        {
          request: lastExecution.request,
          response: lastExecution.response,
        },
        null,
        2
      )
    );
    setCopiedRaw(true);
    setTimeout(() => setCopiedRaw(false), 2000);
  };

  // Tool icon mapper
  const getToolIcon = (name: string) => {
    switch (name) {
      case 'list_projects':
      case 'get_project':
        return <FolderGit2 className="w-4 h-4 text-blue-400" />;
      case 'list_deployments':
      case 'get_deployment':
        return <Layers className="w-4 h-4 text-emerald-400" />;
      case 'get_deployment_logs':
        return <Terminal className="w-4 h-4 text-purple-400" />;
      case 'list_domains':
        return <Globe className="w-4 h-4 text-cyan-400" />;
      case 'list_env_vars':
      case 'create_env_var':
        return <Lock className="w-4 h-4 text-amber-400" />;
      case 'search_documentation':
        return <Search className="w-4 h-4 text-indigo-400" />;
      case 'query_analytics':
        return <BarChart3 className="w-4 h-4 text-pink-400" />;
      case 'use_vercel_cli':
        return <Terminal className="w-4 h-4 text-orange-400" />;
      default:
        return <Code2 className="w-4 h-4 text-neutral-400" />;
    }
  };

  // Parse result data if available
  const resultJson = lastExecution?.response?.result?.content?.[0]?.text
    ? JSON.parse(lastExecution.response.result.content[0].text)
    : null;

  return (
    <div className="space-y-6">
      {/* Playground Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-neutral-900/60 border border-neutral-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Vercel MCP Tools Playground
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-950 border border-blue-800 text-blue-300 font-mono">
              Live Runner
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            ทดสอบการเรียกใช้งาน MCP Tools ตามมาตรฐาน Model Context Protocol 2.0 (Streamable HTTP / SSE)
          </p>
        </div>

        <button
          onClick={handleExecute}
          disabled={executing}
          className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-all shadow-lg shadow-white/5 disabled:opacity-50"
        >
          {executing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>กำลังรัน Tool...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Execute MCP Tool ({selectedTool.name})</span>
            </>
          )}
        </button>
      </div>

      {/* Main Grid: Tool List + Param Form + Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Tools List (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 px-1">
              รายการ MCP Tools ที่พร้อมใช้งาน ({VERCEL_MCP_TOOLS.length})
            </div>

            <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1">
              {VERCEL_MCP_TOOLS.map(tool => {
                const isActive = selectedToolName === tool.name;
                return (
                  <button
                    key={tool.name}
                    onClick={() => handleSelectTool(tool)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all ${
                      isActive
                        ? 'bg-neutral-800 border-white/30 text-white shadow-sm'
                        : 'bg-neutral-950/40 border-neutral-800/80 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 shrink-0">
                        {getToolIcon(tool.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-mono font-semibold truncate text-white">
                          {tool.name}
                        </div>
                        <div className="text-[11px] text-neutral-400 line-clamp-1">
                          {tool.description}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Params & Output (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Tool Details & Input Parameters */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm font-bold text-white">
                    {selectedTool.name}
                  </span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700">
                    Category: {selectedTool.category}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-1">
                  {selectedTool.description}
                </p>
              </div>
            </div>

            {/* Parameter Inputs */}
            <div className="pt-3 border-t border-neutral-800 space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                พารามิเตอร์ (Arguments)
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(selectedTool.inputSchema.properties).map(([key, schema]) => (
                  <div key={key} className="space-y-1">
                    <label className="text-[11px] font-mono text-neutral-300 flex items-center justify-between">
                      <span>{key}</span>
                      <span className="text-neutral-500 font-sans text-[10px]">
                        {schema.type}
                        {selectedTool.inputSchema.required?.includes(key) ? ' (จำเป็น)' : ''}
                      </span>
                    </label>

                    {schema.enum ? (
                      <select
                        value={params[key] || schema.enum[0]}
                        onChange={e => handleParamChange(key, e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                      >
                        {schema.enum.map(opt => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : schema.type === 'boolean' ? (
                      <div className="flex items-center space-x-2 pt-1">
                        <input
                          type="checkbox"
                          checked={!!params[key]}
                          onChange={e => handleParamChange(key, e.target.checked)}
                          className="w-4 h-4 accent-white rounded cursor-pointer"
                        />
                        <span className="text-xs text-neutral-400">{schema.description}</span>
                      </div>
                    ) : (
                      <input
                        type={schema.type === 'number' ? 'number' : 'text'}
                        value={params[key] !== undefined ? params[key] : ''}
                        placeholder={schema.description}
                        onChange={e =>
                          handleParamChange(
                            key,
                            schema.type === 'number' ? Number(e.target.value) : e.target.value
                          )
                        }
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-blue-500 font-mono"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Execution Result Area */}
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
            {/* Output Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-neutral-950/90 border-b border-neutral-800">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveOutputTab('visual')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeOutputTab === 'visual'
                      ? 'bg-neutral-800 text-white border border-neutral-700/60'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Visual Inspector</span>
                </button>

                <button
                  onClick={() => setActiveOutputTab('raw')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeOutputTab === 'raw'
                      ? 'bg-neutral-800 text-white border border-neutral-700/60'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Raw MCP JSON-RPC</span>
                </button>
              </div>

              <div className="flex items-center space-x-3">
                {lastExecution && (
                  <span className="inline-flex items-center space-x-1 text-[11px] font-mono text-neutral-400">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    <span>{lastExecution.durationMs}ms</span>
                  </span>
                )}

                <button
                  onClick={handleCopyRaw}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white text-xs transition-colors"
                >
                  {copiedRaw ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">คัดลอกแล้ว</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Payload</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Output Content */}
            <div className="p-5 min-h-[320px] max-h-[500px] overflow-y-auto bg-black/50">
              {executing ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-3 text-neutral-400">
                  <Loader2 className="w-7 h-7 animate-spin text-blue-400" />
                  <p className="text-xs font-mono">
                    กำลังประมวลผลคำขอ MCP ({selectedTool.name})...
                  </p>
                </div>
              ) : activeOutputTab === 'raw' ? (
                /* RAW JSON-RPC VIEW */
                <div className="space-y-4 font-mono text-xs">
                  <div>
                    <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1 font-semibold">
                      MCP Client Request (JSON-RPC 2.0)
                    </div>
                    <pre className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800 text-blue-300 overflow-x-auto">
                      <code>{JSON.stringify(lastExecution?.request, null, 2)}</code>
                    </pre>
                  </div>

                  <div>
                    <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1 font-semibold">
                      Vercel MCP Server Response
                    </div>
                    <pre className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800 text-emerald-300 overflow-x-auto">
                      <code>{JSON.stringify(lastExecution?.response, null, 2)}</code>
                    </pre>
                  </div>
                </div>
              ) : (
                /* VISUAL INSPECTOR VIEW */
                <div>
                  {selectedToolName === 'list_projects' && resultJson?.projects && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {resultJson.projects.map((proj: any) => (
                        <div
                          key={proj.id}
                          className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2 hover:border-neutral-700 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-xs font-bold text-white font-mono">{proj.name}</h4>
                              <span className="text-[10px] text-neutral-400 font-mono">
                                Framework: {proj.framework}
                              </span>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300">
                              Active
                            </span>
                          </div>

                          {proj.targets?.production?.url && (
                            <a
                              href={`https://${proj.targets.production.url}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-blue-400 hover:underline flex items-center space-x-1"
                            >
                              <span className="truncate">{proj.targets.production.url}</span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {(selectedToolName === 'list_deployments' || selectedToolName === 'get_deployment') && (
                    <div className="space-y-3">
                      {selectedToolName === 'get_deployment' && resultJson?.deployment && (
                        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-bold text-white">
                              {resultJson.deployment.name}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 font-mono">
                              {resultJson.deployment.state}
                            </span>
                          </div>
                          <div className="text-xs text-neutral-300">
                            Commit: {resultJson.deployment.meta?.githubCommitMessage}
                          </div>
                          <div className="text-xs text-neutral-400 font-mono">
                            Regions: {resultJson.edgeRegions?.join(', ')} | Build: {resultJson.buildDurationSeconds}s
                          </div>
                        </div>
                      )}

                      {resultJson?.deployments?.map((dep: any) => (
                        <div
                          key={dep.uid}
                          className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between space-x-3 hover:border-neutral-700 transition-colors"
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="font-mono text-xs font-semibold text-white truncate">
                                {dep.url}
                              </span>
                              <span
                                className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                                  dep.state === 'READY'
                                    ? 'bg-emerald-950 border border-emerald-800 text-emerald-300'
                                    : dep.state === 'ERROR'
                                    ? 'bg-rose-950 border border-rose-800 text-rose-300'
                                    : 'bg-blue-950 border border-blue-800 text-blue-300'
                                }`}
                              >
                                {dep.state}
                              </span>
                            </div>
                            <p className="text-[11px] text-neutral-400 truncate">
                              {dep.meta?.githubCommitMessage || 'Manual deployment'}
                            </p>
                          </div>

                          <div className="text-right text-[11px] text-neutral-500 font-mono shrink-0">
                            {dep.target || 'preview'}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedToolName === 'get_deployment_logs' && resultJson?.logs && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 mb-2">
                        <Filter className="w-3.5 h-3.5 text-neutral-500" />
                        <input
                          type="text"
                          placeholder="กรองข้อความ Logs..."
                          value={logFilter}
                          onChange={e => setLogFilter(e.target.value)}
                          className="bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1 text-xs text-white placeholder-neutral-600 focus:outline-none"
                        />
                      </div>

                      <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 font-mono text-[11px] space-y-1.5 max-h-[320px] overflow-y-auto">
                        {resultJson.logs
                          .filter((l: any) =>
                            logFilter ? l.message.toLowerCase().includes(logFilter.toLowerCase()) : true
                          )
                          .map((log: any, i: number) => (
                            <div
                              key={i}
                              className={`flex items-start space-x-2 ${
                                log.type === 'error'
                                  ? 'text-rose-400'
                                  : log.type === 'info'
                                  ? 'text-blue-400'
                                  : 'text-neutral-300'
                              }`}
                            >
                              <span className="text-neutral-600 shrink-0">
                                {new Date(log.timestamp).toLocaleTimeString()}
                              </span>
                              <span className="whitespace-pre-wrap">{log.message}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {selectedToolName === 'list_domains' && resultJson?.domains && (
                    <div className="space-y-2">
                      {resultJson.domains.map((dom: any) => (
                        <div
                          key={dom.name}
                          className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between"
                        >
                          <div>
                            <div className="text-xs font-mono font-bold text-white">{dom.name}</div>
                            <div className="text-[10px] text-neutral-400 font-mono">
                              DNS Record: {dom.configuredBy} | Nameservers: {dom.nameservers?.join(', ')}
                            </div>
                          </div>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                              dom.verified
                                ? 'bg-emerald-950 border border-emerald-800 text-emerald-300'
                                : 'bg-amber-950 border border-amber-800 text-amber-300'
                            }`}
                          >
                            {dom.verified ? 'Verified' : 'Pending Verification'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedToolName === 'list_env_vars' && resultJson?.envs && (
                    <div className="space-y-2">
                      {resultJson.envs.map((env: any) => {
                        const isRevealed = revealedEnvs[env.id];
                        return (
                          <div
                            key={env.id}
                            className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between"
                          >
                            <div className="space-y-1">
                              <div className="font-mono text-xs font-semibold text-emerald-400">
                                {env.key}
                              </div>
                              <div className="font-mono text-[11px] text-neutral-400">
                                {isRevealed ? env.value : '••••••••••••••••••••••••••••••••'}
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() =>
                                  setRevealedEnvs(prev => ({ ...prev, [env.id]: !isRevealed }))
                                }
                                className="p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white"
                              >
                                {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono">
                                {env.target?.join(', ')}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {selectedToolName === 'search_documentation' && resultJson?.results && (
                    <div className="space-y-3">
                      {resultJson.results.map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1.5 hover:border-neutral-700 transition-colors"
                        >
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-semibold text-blue-400 hover:underline flex items-center space-x-1"
                          >
                            <span>{item.title}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <p className="text-xs text-neutral-300 leading-relaxed">{item.snippet}</p>
                          <span className="text-[10px] font-mono text-neutral-500">{item.url}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedToolName === 'query_analytics' && resultJson && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                          <div className="text-[10px] uppercase font-mono text-neutral-400">Total Visitors</div>
                          <div className="text-lg font-bold text-white mt-1">
                            {resultJson.visitors?.toLocaleString()}
                          </div>
                        </div>
                        <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                          <div className="text-[10px] uppercase font-mono text-neutral-400">Pageviews</div>
                          <div className="text-lg font-bold text-white mt-1">
                            {resultJson.pageviews?.toLocaleString()}
                          </div>
                        </div>
                        <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 col-span-2 sm:col-span-1">
                          <div className="text-[10px] uppercase font-mono text-neutral-400">LCP Web Vital</div>
                          <div className="text-sm font-bold text-emerald-400 mt-1">
                            {resultJson.webVitals?.lcp}
                          </div>
                        </div>
                      </div>

                      <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-800 space-y-2">
                        <div className="text-xs font-semibold text-white">Top Paths</div>
                        {resultJson.topPages?.map((p: any) => (
                          <div key={p.path} className="flex justify-between text-xs text-neutral-300 font-mono">
                            <span>{p.path}</span>
                            <span className="text-neutral-500">{p.visitors.toLocaleString()} visitors</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedToolName === 'use_vercel_cli' && resultJson && (
                    <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 font-mono text-xs text-neutral-200 whitespace-pre leading-relaxed">
                      {resultJson.stdout}
                    </div>
                  )}

                  {selectedToolName === 'create_env_var' && resultJson && (
                    <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/80 text-emerald-300 text-xs space-y-2">
                      <div className="flex items-center space-x-2 font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>{resultJson.message}</span>
                      </div>
                      <div className="font-mono text-[11px] text-neutral-300">
                        Variable Key: {resultJson.created?.key} | ID: {resultJson.created?.id}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
