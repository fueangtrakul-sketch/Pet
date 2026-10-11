import React, { useState } from 'react';
import {
  Globe,
  Key,
  Terminal,
  ExternalLink,
  ChevronDown,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';
import { VercelUser, VercelTeam } from '../types/vercel';

interface HeaderProps {
  user: VercelUser;
  teams: VercelTeam[];
  selectedTeamId: string;
  onSelectTeam: (teamId: string) => void;
  isDemo: boolean;
  onOpenConnectModal: () => void;
  activeTab: 'playground' | 'config' | 'projects' | 'protocol' | 'prompts';
  setActiveTab: (tab: 'playground' | 'config' | 'projects' | 'protocol' | 'prompts') => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  teams,
  selectedTeamId,
  onSelectTeam,
  isDemo,
  onOpenConnectModal,
  activeTab,
  setActiveTab,
}) => {
  const [showTeamMenu, setShowTeamMenu] = useState(false);

  const currentTeam = teams.find(t => t.id === selectedTeamId) || teams[0];

  return (
    <header className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand & Logo */}
          <div className="flex items-center space-x-3">
            {/* Vercel Iconic Triangle */}
            <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-700/80 shadow-inner group">
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                className="fill-white group-hover:scale-105 transition-transform duration-200"
              >
                <path d="M12 2L2 20H22L12 2Z" />
              </svg>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-white tracking-tight text-base sm:text-lg">
                  Vercel MCP
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-neutral-800 border border-neutral-700 text-neutral-300">
                  v1.2 Protocol
                </span>
              </div>
              <p className="text-xs text-neutral-400 hidden sm:block">
                Model Context Protocol Connector & Explorer
              </p>
            </div>
          </div>

          {/* Center Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-neutral-900/90 border border-neutral-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('playground')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'playground'
                  ? 'bg-neutral-800 text-white shadow-sm border border-neutral-700/60'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              <span>MCP Tools Runner</span>
            </button>

            <button
              onClick={() => setActiveTab('config')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'config'
                  ? 'bg-neutral-800 text-white shadow-sm border border-neutral-700/60'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Config Generator (Cursor/Claude)</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'projects'
                  ? 'bg-neutral-800 text-white shadow-sm border border-neutral-700/60'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>Projects & Deployments</span>
            </button>

            <button
              onClick={() => setActiveTab('protocol')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'protocol'
                  ? 'bg-neutral-800 text-white shadow-sm border border-neutral-700/60'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-purple-400" />
              <span>JSON-RPC Inspector</span>
            </button>

            <button
              onClick={() => setActiveTab('prompts')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'prompts'
                  ? 'bg-neutral-800 text-white shadow-sm border border-neutral-700/60'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>คู่มือ Prompt</span>
            </button>
          </nav>

          {/* Right: Status badge & User/Token button */}
          <div className="flex items-center space-x-3">
            {/* Connection mode badge */}
            <button
              onClick={onOpenConnectModal}
              className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                isDemo
                  ? 'bg-amber-950/40 border-amber-800/60 text-amber-300 hover:bg-amber-900/50'
                  : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300 hover:bg-emerald-900/50'
              }`}
              title="Click to configure Vercel Token or toggle mode"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isDemo ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400 animate-pulse'
                }`}
              />
              <span className="hidden sm:inline">
                {isDemo ? 'Sandbox Mode' : 'Connected (Live Vercel)'}
              </span>
              <Key className="w-3.5 h-3.5 text-neutral-400" />
            </button>

            {/* Team Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowTeamMenu(!showTeamMenu)}
                className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 hover:bg-neutral-800 transition-colors"
              >
                <div className="w-4 h-4 rounded-full bg-neutral-700 flex items-center justify-center text-[10px] uppercase font-bold text-neutral-300">
                  {currentTeam?.name?.[0] || 'T'}
                </div>
                <span className="max-w-[100px] truncate hidden md:inline">
                  {currentTeam?.name || 'Personal'}
                </span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </button>

              {showTeamMenu && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-xl bg-neutral-900 border border-neutral-800 shadow-2xl py-1 z-50 animate-in fade-in slide-in-from-top-2"
                  onClick={() => setShowTeamMenu(false)}
                >
                  <div className="px-3 py-1.5 border-b border-neutral-800 text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
                    Workspaces & Teams
                  </div>
                  {teams.map(t => (
                    <button
                      key={t.id || 'personal'}
                      onClick={() => onSelectTeam(t.id)}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-neutral-800 transition-colors ${
                        selectedTeamId === t.id ? 'text-white font-medium bg-neutral-800/60' : 'text-neutral-300'
                      }`}
                    >
                      <span className="truncate">{t.name}</span>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {t.membership?.role || 'MEMBER'}
                      </span>
                    </button>
                  ))}
                  <div className="border-t border-neutral-800 p-2">
                    <a
                      href="https://vercel.com/dashboard"
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center justify-center space-x-1.5 text-[11px] text-neutral-400 hover:text-white py-1 transition-colors"
                    >
                      <Globe className="w-3 h-3" />
                      <span>เปิด Vercel Dashboard</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* User chip */}
            <div className="flex items-center space-x-2 pl-1">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt={user.name}
                className="w-7 h-7 rounded-full border border-neutral-700 object-cover"
              />
            </div>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden overflow-x-auto py-2 space-x-1 border-t border-neutral-800/80 no-scrollbar">
          <button
            onClick={() => setActiveTab('playground')}
            className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap font-medium ${
              activeTab === 'playground' ? 'bg-neutral-800 text-white' : 'text-neutral-400'
            }`}
          >
            Tools Runner
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap font-medium ${
              activeTab === 'config' ? 'bg-neutral-800 text-white' : 'text-neutral-400'
            }`}
          >
            Config (Cursor/Claude)
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap font-medium ${
              activeTab === 'projects' ? 'bg-neutral-800 text-white' : 'text-neutral-400'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab('protocol')}
            className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap font-medium ${
              activeTab === 'protocol' ? 'bg-neutral-800 text-white' : 'text-neutral-400'
            }`}
          >
            JSON-RPC
          </button>
          <button
            onClick={() => setActiveTab('prompts')}
            className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap font-medium ${
              activeTab === 'prompts' ? 'bg-neutral-800 text-white' : 'text-neutral-400'
            }`}
          >
            คู่มือ Prompt
          </button>
        </div>
      </div>
    </header>
  );
};
