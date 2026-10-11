import React, { useState } from 'react';
import {
  Terminal,
  Send,
  Code2,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Info,
  Clock,
} from 'lucide-react';
import { VERCEL_MCP_TOOLS } from '../data/mcpToolsDefinitions';

export const McpProtocolInspector: React.FC = () => {
  const [method, setMethod] = useState<'initialize' | 'tools/list' | 'resources/list' | 'custom'>('initialize');
  const [customBody, setCustomBody] = useState<string>(
    JSON.stringify(
      {
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
          protocolVersion: '2024-11-05',
          capabilities: {
            roots: { listChanged: true },
            sampling: {},
          },
          clientInfo: {
            name: 'cursor-ide',
            version: '0.45.1',
          },
        },
      },
      null,
      2
    )
  );
  const [responseOutput, setResponseOutput] = useState<string | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSendRequest = () => {
    const start = performance.now();
    let res: any = {};

    try {
      const parsedReq = JSON.parse(customBody);
      const reqMethod = parsedReq.method || method;

      if (reqMethod === 'initialize') {
        res = {
          jsonrpc: '2.0',
          id: parsedReq.id || 1,
          result: {
            protocolVersion: '2024-11-05',
            serverInfo: {
              name: 'vercel-mcp',
              version: '1.2.0',
              description: 'Official Vercel Model Context Protocol Server',
            },
            capabilities: {
              tools: { listChanged: false },
              resources: { subscribe: false, listChanged: false },
              prompts: { listChanged: false },
            },
          },
        };
      } else if (reqMethod === 'tools/list') {
        res = {
          jsonrpc: '2.0',
          id: parsedReq.id || 2,
          result: {
            tools: VERCEL_MCP_TOOLS.map(t => ({
              name: t.name,
              description: t.description,
              inputSchema: t.inputSchema,
            })),
          },
        };
      } else if (reqMethod === 'resources/list') {
        res = {
          jsonrpc: '2.0',
          id: parsedReq.id || 3,
          result: {
            resources: [
              {
                uri: 'vercel://projects/recent',
                name: 'Recent Vercel Projects',
                mimeType: 'application/json',
              },
              {
                uri: 'vercel://deployments/active',
                name: 'Active Deployments',
                mimeType: 'application/json',
              },
            ],
          },
        };
      } else {
        res = {
          jsonrpc: '2.0',
          id: parsedReq.id || 99,
          result: {
            status: 'ok',
            methodExecuted: reqMethod,
            timestamp: new Date().toISOString(),
          },
        };
      }
    } catch (e: any) {
      res = {
        jsonrpc: '2.0',
        id: null,
        error: {
          code: -32700,
          message: `Parse error: Invalid JSON payload (${e.message})`,
        },
      };
    }

    setLatency(Math.round(performance.now() - start + 28)); // realistic simulated streamable HTTP latency
    setResponseOutput(JSON.stringify(res, null, 2));
  };

  const handleSelectPreset = (preset: 'initialize' | 'tools/list' | 'resources/list') => {
    setMethod(preset);
    if (preset === 'initialize') {
      setCustomBody(
        JSON.stringify(
          {
            jsonrpc: '2.0',
            id: 1,
            method: 'initialize',
            params: {
              protocolVersion: '2024-11-05',
              capabilities: { roots: { listChanged: true } },
              clientInfo: { name: 'cursor-ide', version: '0.45.1' },
            },
          },
          null,
          2
        )
      );
    } else if (preset === 'tools/list') {
      setCustomBody(
        JSON.stringify(
          {
            jsonrpc: '2.0',
            id: 2,
            method: 'tools/list',
            params: {},
          },
          null,
          2
        )
      );
    } else if (preset === 'resources/list') {
      setCustomBody(
        JSON.stringify(
          {
            jsonrpc: '2.0',
            id: 3,
            method: 'resources/list',
            params: {},
          },
          null,
          2
        )
      );
    }
  };

  const handleCopy = () => {
    if (!responseOutput) return;
    navigator.clipboard.writeText(responseOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Overview header */}
      <div className="bg-neutral-900/60 border border-neutral-800 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-white tracking-tight">
              MCP Protocol & JSON-RPC 2.0 Inspector
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-950 border border-purple-800 text-purple-300 font-mono">
              Spec 2024-11-05
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            ทดสอบการส่งข้อความ JSON-RPC เพื่อเจรจาโปรโตคอล (Negotiation) และตรวจสอบเครื่องมือทั้งหมดใน Vercel MCP
          </p>
        </div>

        <button
          onClick={handleSendRequest}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-all shadow-md"
        >
          <Send className="w-3.5 h-3.5" />
          <span>ส่งคำขอ (Send JSON-RPC)</span>
        </button>
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mr-2">
          คำขอมาตรฐาน:
        </span>
        <button
          onClick={() => handleSelectPreset('initialize')}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-colors ${
            method === 'initialize'
              ? 'bg-purple-900/50 border border-purple-500/80 text-white'
              : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
          }`}
        >
          initialize (Handshake)
        </button>
        <button
          onClick={() => handleSelectPreset('tools/list')}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-colors ${
            method === 'tools/list'
              ? 'bg-purple-900/50 border border-purple-500/80 text-white'
              : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
          }`}
        >
          tools/list (List Tools)
        </button>
        <button
          onClick={() => handleSelectPreset('resources/list')}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-colors ${
            method === 'resources/list'
              ? 'bg-purple-900/50 border border-purple-500/80 text-white'
              : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
          }`}
        >
          resources/list (List Resources)
        </button>
      </div>

      {/* Dual Windows: Request and Response */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Window */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col h-full shadow-xl">
          <div className="px-4 py-3 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
            <span className="text-xs font-mono text-neutral-300 font-semibold flex items-center space-x-1.5">
              <Code2 className="w-3.5 h-3.5 text-blue-400" />
              <span>JSON-RPC Request</span>
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">Streamable HTTP Transport</span>
          </div>
          <div className="p-3 bg-black/60 flex-1">
            <textarea
              rows={14}
              value={customBody}
              onChange={e => {
                setCustomBody(e.target.value);
                setMethod('custom');
              }}
              className="w-full h-full bg-transparent font-mono text-xs text-blue-300 focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Response Window */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col h-full shadow-xl">
          <div className="px-4 py-3 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
            <span className="text-xs font-mono text-neutral-300 font-semibold flex items-center space-x-1.5">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Server Response</span>
            </span>

            <div className="flex items-center space-x-3">
              {latency && (
                <span className="text-[11px] font-mono text-emerald-400 flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{latency}ms</span>
                </span>
              )}
              {responseOutput && (
                <button
                  onClick={handleCopy}
                  className="p-1 rounded text-neutral-400 hover:text-white"
                  title="Copy response"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>
          </div>

          <div className="p-4 bg-black/60 flex-1 overflow-x-auto max-h-[380px] overflow-y-auto">
            {responseOutput ? (
              <pre className="font-mono text-xs text-emerald-300 whitespace-pre leading-relaxed">
                <code>{responseOutput}</code>
              </pre>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-neutral-500 font-mono">
                กด "ส่งคำขอ (Send JSON-RPC)" เพื่อดูการตอบกลับจาก Vercel MCP Server
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
