import React, { useState } from 'react';
import {
  X,
  Key,
  ShieldCheck,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Info,
} from 'lucide-react';
import { VercelApiService } from '../services/vercelApi';
import { VercelUser } from '../types/vercel';

interface ConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDemo: boolean;
  onConnectionChange: (user: VercelUser, isDemo: boolean) => void;
}

export const ConnectionModal: React.FC<ConnectionModalProps> = ({
  isOpen,
  onClose,
  isDemo,
  onConnectionChange,
}) => {
  const [tokenInput, setTokenInput] = useState(VercelApiService.getStoredToken());
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleVerifyAndSave = async () => {
    if (!tokenInput.trim()) {
      setStatusMessage({ type: 'error', text: 'กรุณากรอก Vercel Access Token' });
      return;
    }

    setLoading(true);
    setStatusMessage({ type: 'info', text: 'กำลังเชื่อมต่อและตรวจสอบสิทธิ์กับ Vercel API...' });

    try {
      const result = await VercelApiService.verifyToken(tokenInput.trim());

      if (result.success && result.user) {
        VercelApiService.setStoredToken(tokenInput.trim());
        VercelApiService.setDemoMode(false);
        setStatusMessage({
          type: 'success',
          text: `เชื่อมต่อสำเร็จ! เข้าสู่ระบบในชื่อ ${result.user.name} (${result.user.billing?.plan || 'Plan'})`,
        });
        setTimeout(() => {
          onConnectionChange(result.user!, false);
          onClose();
        }, 800);
      } else {
        setStatusMessage({
          type: 'error',
          text: result.error || 'ไม่สามารถยืนยัน Token ได้ กรุณาตรวจสอบว่า Token ยังไม่หมดอายุ',
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchToDemo = () => {
    VercelApiService.setDemoMode(true);
    setStatusMessage({ type: 'success', text: 'สลับไปยังโหมดจำลอง (Interactive MCP Sandbox) เรียบร้อย' });
    setTimeout(() => {
      onConnectionChange(
        {
          id: 'usr_demo_fueangtrakul',
          email: 'fueangtrakul@gmail.com',
          name: 'Fueangtrakul (Sandbox)',
          username: 'fueangtrakul',
          billing: { plan: 'Pro' },
        },
        true
      );
      onClose();
    }, 400);
  };

  const handleClearToken = () => {
    VercelApiService.setStoredToken('');
    VercelApiService.setDemoMode(true);
    setTokenInput('');
    setStatusMessage({ type: 'info', text: 'ลบ Token แล้ว ระบบสลับไปใช้ Sandbox Mode อัตโนมัติ' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-neutral-800 border border-neutral-700/80 rounded-xl text-neutral-200">
              <Key className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">ตั้งค่าการเชื่อมต่อ Vercel MCP</h3>
              <p className="text-xs text-neutral-400">เชื่อมโยงบัญชี Vercel หรือทดสอบผ่าน Sandbox</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Status Message */}
          {statusMessage && (
            <div
              className={`p-3.5 rounded-xl border text-xs flex items-start space-x-2.5 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
                  : statusMessage.type === 'error'
                  ? 'bg-rose-950/40 border-rose-800/80 text-rose-300'
                  : 'bg-blue-950/40 border-blue-800/80 text-blue-300'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-400" />
              ) : statusMessage.type === 'error' ? (
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-400" />
              ) : (
                <Loader2 className="w-4 h-4 mt-0.5 shrink-0 animate-spin text-blue-400" />
              )}
              <div className="flex-1">{statusMessage.text}</div>
            </div>
          )}

          {/* Option 1: Live Personal Access Token */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center space-x-1.5">
                <span>Vercel Personal Access Token</span>
                <span className="text-neutral-500 font-normal font-sans">(แนะนำสำหรับการใช้งานจริง)</span>
              </label>
              <a
                href="https://vercel.com/account/tokens"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center space-x-1 transition-colors"
              >
                <span>สร้าง Token บน Vercel</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative">
              <input
                type="password"
                placeholder="vercel_pat_xxxxxxxxxxxxxxxxxxxxxxxx"
                value={tokenInput}
                onChange={e => setTokenInput(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 font-mono transition-colors"
              />
            </div>

            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Token จะถูกจัดเก็บเฉพาะใน Local Storage บนเบราว์เซอร์ของคุณ ไม่ถูกส่งต่อไปยังบุคคลที่สาม
              และใช้ในการเรียก Vercel API / MCP endpoints เท่านั้น
            </p>
          </div>

          {/* Action Buttons for Token */}
          <div className="flex items-center space-x-3 pt-1">
            <button
              onClick={handleVerifyAndSave}
              disabled={loading}
              className="flex-1 flex items-center justify-center space-x-2 bg-white text-black hover:bg-neutral-200 font-medium px-4 py-2.5 rounded-xl text-xs transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>กำลังตรวจสอบ...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>ตรวจสอบ & เชื่อมต่อทันที</span>
                </>
              )}
            </button>

            {tokenInput && (
              <button
                onClick={handleClearToken}
                className="px-3 py-2.5 rounded-xl border border-neutral-800 text-neutral-400 hover:text-rose-400 hover:border-rose-900/50 text-xs transition-colors"
              >
                ลบ Token
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-800" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
              <span className="bg-neutral-900 px-3 text-neutral-500">หรือ</span>
            </div>
          </div>

          {/* Option 2: Sandbox Mode */}
          <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-semibold text-white">
                  โหมดจำลอง (Interactive MCP Sandbox)
                </h4>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                isDemo ? 'bg-amber-950 border border-amber-800 text-amber-300' : 'bg-neutral-800 text-neutral-400'
              }`}>
                {isDemo ? 'กำลังใช้งาน' : 'สแตนด์บาย'}
              </span>
            </div>

            <p className="text-[11px] text-neutral-400">
              ทดสอบการทำงานของเครื่องมือ MCP ทั้งหมด (ดู Projects, Deployments, Build Logs, Env Vars และ Docs Search) ได้ทันทีโดยไม่ต้องใส่ Token
            </p>

            <button
              onClick={handleSwitchToDemo}
              className="mt-1 w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-200 transition-colors"
            >
              <span>ทดลองใช้งานผ่าน Sandbox Mode</span>
            </button>
          </div>

          {/* Guide Note */}
          <div className="flex items-start space-x-2 text-[11px] text-neutral-400 bg-neutral-950/40 p-3 rounded-xl border border-neutral-800/60">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-neutral-300 font-medium">Vercel MCP Endpoint อย่างเป็นทางการ:</span>{' '}
              <code className="text-blue-400 bg-neutral-800/80 px-1 py-0.5 rounded">https://mcp.vercel.com</code>{' '}
              รองรับทั้งการเชื่อมต่อตรงผ่าน OAuth ใน Cursor และ Claude Desktop
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
