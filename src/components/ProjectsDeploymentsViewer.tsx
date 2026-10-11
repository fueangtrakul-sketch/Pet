import React, { useState, useEffect } from 'react';
import {
  FolderGit2,
  ExternalLink,
  GitBranch,
  Layers,
  Terminal,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { VercelApiService } from '../services/vercelApi';
import { VercelProject, VercelDeployment } from '../types/vercel';

interface ProjectsDeploymentsViewerProps {
  onSelectMcpTool: (toolName: string, params: Record<string, any>) => void;
}

export const ProjectsDeploymentsViewer: React.FC<ProjectsDeploymentsViewerProps> = ({
  onSelectMcpTool,
}) => {
  const [projects, setProjects] = useState<VercelProject[]>([]);
  const [deployments, setDeployments] = useState<VercelDeployment[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [projList, depList] = await Promise.all([
        VercelApiService.fetchProjects(),
        VercelApiService.fetchDeployments(undefined, selectedProjectId || undefined),
      ]);
      setProjects(projList);
      setDeployments(depList);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedProjectId]);

  return (
    <div className="space-y-6">
      {/* Overview header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-neutral-900/60 border border-neutral-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Vercel Projects & Deployments
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            ข้อมูลโปรเจกต์และการ Deploy ทั้งหมดที่เชื่อมโยงกับ Vercel MCP Server
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center space-x-2 px-3 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 text-xs font-medium transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>รีเฟรชข้อมูล</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            โปรเจกต์ของคุณ ({projects.length})
          </h3>
          {selectedProjectId && (
            <button
              onClick={() => setSelectedProjectId('')}
              className="text-xs text-blue-400 hover:underline"
            >
              แสดงโปรเจกต์ทั้งหมด
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.map(p => {
            const isSelected = selectedProjectId === p.id;
            return (
              <div
                key={p.id}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-800/90 border-blue-500/80 shadow-md'
                    : 'bg-neutral-900/80 border-neutral-800 hover:border-neutral-700'
                }`}
                onClick={() => setSelectedProjectId(isSelected ? '' : p.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-xl bg-neutral-950 border border-neutral-800 text-blue-400">
                      <FolderGit2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white font-mono truncate max-w-[150px]">
                        {p.name}
                      </h4>
                      <span className="text-[10px] text-neutral-400 capitalize">
                        {p.framework}
                      </span>
                    </div>
                  </div>

                  {p.targets?.production?.url && (
                    <a
                      href={`https://${p.targets.production.url}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                {p.link?.repo && (
                  <div className="mt-3 flex items-center space-x-1.5 text-[11px] text-neutral-400 font-mono">
                    <GitBranch className="w-3 h-3 text-neutral-500" />
                    <span className="truncate">
                      {p.link.org}/{p.link.repo}
                    </span>
                  </div>
                )}

                {/* MCP Action buttons */}
                <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[11px]">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onSelectMcpTool('get_project', { projectIdOrName: p.name });
                    }}
                    className="text-neutral-400 hover:text-blue-400 font-mono"
                  >
                    MCP: get_project
                  </button>

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onSelectMcpTool('list_env_vars', { projectId: p.name });
                    }}
                    className="text-neutral-400 hover:text-amber-400 font-mono"
                  >
                    MCP: list_env
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deployments Stream */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
          ประวัติ Deployments ล่าสุด ({deployments.length})
        </h3>

        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl overflow-hidden divide-y divide-neutral-800/80">
          {deployments.map(dep => (
            <div
              key={dep.uid}
              className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-neutral-800/40 transition-colors"
            >
              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  {dep.state === 'READY' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : dep.state === 'ERROR' ? (
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                  ) : (
                    <Clock className="w-4 h-4 text-blue-400 animate-spin" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <a
                      href={`https://${dep.url}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-mono font-semibold text-white hover:text-blue-400 hover:underline"
                    >
                      {dep.url}
                    </a>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.2 rounded-full ${
                        dep.state === 'READY'
                          ? 'bg-emerald-950 border border-emerald-800 text-emerald-300'
                          : dep.state === 'ERROR'
                          ? 'bg-rose-950 border border-rose-800 text-rose-300'
                          : 'bg-blue-950 border border-blue-800 text-blue-300'
                      }`}
                    >
                      {dep.state}
                    </span>
                    <span className="text-[10px] px-2 py-0.2 rounded bg-neutral-800 text-neutral-400 uppercase font-mono">
                      {dep.target || 'preview'}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-400 font-sans">
                    {dep.meta?.githubCommitMessage || 'Direct deployment from CLI / MCP'}
                  </p>

                  <div className="flex items-center space-x-3 text-[11px] text-neutral-500 font-mono">
                    {dep.meta?.githubCommitRef && <span>Branch: {dep.meta.githubCommitRef}</span>}
                    {dep.meta?.githubCommitSha && <span>SHA: {dep.meta.githubCommitSha}</span>}
                    <span>{new Date(dep.created).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Action: Open logs via MCP */}
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() =>
                    onSelectMcpTool('get_deployment_logs', { deploymentId: dep.uid, type: 'all' })
                  }
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-700 text-xs font-medium text-neutral-300 hover:text-white hover:border-neutral-500 transition-colors"
                >
                  <Terminal className="w-3.5 h-3.5 text-purple-400" />
                  <span>ดู Logs ผ่าน MCP</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
