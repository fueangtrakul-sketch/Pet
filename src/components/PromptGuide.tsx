import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Terminal,
  Layers,
  Lock,
  Globe,
  BarChart3,
  Search,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';

interface PromptRecipe {
  title: string;
  category: string;
  toolUsed: string;
  thaiPrompt: string;
  engPrompt: string;
  description: string;
  tags: string[];
}

export const PromptGuide: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const recipes: PromptRecipe[] = [
    {
      title: 'ตรวจสอบสาเหตุที่การ Deploy ล่าสุดพัง (Error Troubleshooting)',
      category: 'logs',
      toolUsed: 'get_deployment_logs + get_deployment',
      thaiPrompt:
        'ช่วยดึง logs ของ deployment ล่าสุดใน Vercel ให้หน่อย ดูว่าเกิด error ตรงไหน และช่วยแนะนำวิธีแก้ไขโค้ดให้ด้วย',
      engPrompt:
        'Fetch the logs from the latest Vercel deployment, identify why it failed, and help me fix the code.',
      description:
        'เมื่อถามประโยคนี้ AI จะเรียกเครื่องมือ `get_deployment_logs` ของ Vercel MCP เพื่ออ่าน Build Logs และ Runtime Logs มาวิเคราะห์ทันที',
      tags: ['Logs', 'Debug', 'Build Error'],
    },
    {
      title: 'เช็คสถานะการ Deploy และ Preview URL ของโปรเจกต์',
      category: 'deployments',
      toolUsed: 'list_deployments',
      thaiPrompt:
        'เช็คสถานะ deployments ทั้งหมดของโปรเจกต์นี้ใน Vercel หน่อยว่าพร้อมใช้งานหรือยัง และขอ URL สำหรับพรีวิวด้วย',
      engPrompt:
        'Check the status of recent deployments for this project on Vercel and provide the preview URL.',
      description:
        'AI จะเรียก `list_deployments` และสรุปให้ว่าแต่ละ commit deploy สำเร็จ (READY) หรือไม่ พร้อมลิงก์เปิดดูเว็บไซต์',
      tags: ['Deployments', 'Status', 'Preview URL'],
    },
    {
      title: 'เพิ่มหรือตรวจดู Environment Variables ในโปรเจกต์',
      category: 'env',
      toolUsed: 'list_env_vars + create_env_var',
      thaiPrompt:
        'ตรวจดูตัวแปร Environment Variables ของโปรเจกต์ใน Vercel ให้หน่อยว่ามี DATABASE_URL และ AUTH_SECRET หรือยัง ถ้ายังไม่มีช่วยแนะนำขั้นตอนตั้งค่า',
      engPrompt:
        'Inspect the environment variables for this Vercel project to see if DATABASE_URL is configured.',
      description:
        'AI จะเรียก `list_env_vars` เพื่ออ่านรายชื่อตัวแปรในสภาพแวดล้อม Production, Preview และ Development',
      tags: ['Environment Variables', 'Secrets', 'Config'],
    },
    {
      title: 'ตรวจสอบการเชื่อมต่อ Custom Domain และ DNS Records',
      category: 'domains',
      toolUsed: 'list_domains',
      thaiPrompt:
        'เช็คโดเมนที่ผูกกับ Vercel หน่อยว่าสถานะ Verified แล้วหรือยัง ต้องตั้งค่า CNAME หรือ A record เพิ่มเติมไหม',
      engPrompt:
        'Check custom domains connected to this Vercel project and let me know if DNS records are properly verified.',
      description:
        'AI จะดึงรายชื่อโดเมนและ nameservers ผ่าน `list_domains` มาตรวจสอบความถูกต้องของ DNS',
      tags: ['Domains', 'DNS', 'SSL'],
    },
    {
      title: 'ดูสถิติผู้เข้าชมเว็บไซต์และประสิทธิภาพ Web Vitals',
      category: 'analytics',
      toolUsed: 'query_analytics',
      thaiPrompt:
        'สรุปข้อมูล Web Analytics จาก Vercel ในรอบ 7 วันที่ผ่านมาให้หน่อย เช่น ยอดผู้เข้าชม หน้าที่มีคนเข้ามากที่สุด และค่า LCP',
      engPrompt:
        'Summarize the Vercel Web Analytics for the last 7 days including page views, top paths, and Core Web Vitals.',
      description:
        'AI จะเรียก `query_analytics` เพื่อดึงข้อมูล Traffic และความเร็วในการแสดงผลเว็บไซต์',
      tags: ['Analytics', 'Speed', 'SEO'],
    },
    {
      title: 'ค้นหาเทคนิคการใช้งาน Vercel และ Next.js จากเอกสารทางการ',
      category: 'docs',
      toolUsed: 'search_documentation',
      thaiPrompt:
        'ค้นหาเอกสาร Vercel ให้หน่อยว่าวิธีการตั้งค่า Edge Runtime และ Server-Sent Events (SSE) ใน Next.js 15 ต้องเขียนอย่างไร',
      engPrompt:
        'Search Vercel documentation for best practices on configuring Edge Runtime and Server-Sent Events in Next.js.',
      description:
        'AI จะค้นหาข้อมูลสดจาก Vercel Documentation ผ่าน `search_documentation` มาอ้างอิงในการเขียนโค้ด',
      tags: ['Docs', 'Next.js', 'Best Practices'],
    },
  ];

  const handleCopyPrompt = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-6 space-y-2">
        <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Prompt Recipes for AI Coding Assistants</span>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          ตัวอย่างคำสั่ง Prompt สำหรับ Cursor, Claude Desktop และ VS Code
        </h2>
        <p className="text-sm text-neutral-400 leading-relaxed max-w-3xl">
          หลังจากที่คุณนำไฟล์ตั้งค่า Vercel MCP ไปใส่ในโปรแกรมแล้ว คุณสามารถพูดคุยกับ AI
          โดยใช้ประโยคตัวอย่างเหล่านี้ได้ทันที AI จะเรียกเครื่องมือ MCP ของ Vercel โดยอัตโนมัติ
        </p>
      </div>

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recipes.map((recipe, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-3.5 flex flex-col justify-between hover:border-neutral-700 transition-all shadow-md"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-bold text-white leading-snug">
                  {recipe.title}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700 shrink-0">
                  {recipe.category}
                </span>
              </div>

              {/* Behind the scenes MCP tool */}
              <div className="flex items-center space-x-1.5 text-[11px] text-blue-400 font-mono">
                <Terminal className="w-3.5 h-3.5" />
                <span>MCP Tool: {recipe.toolUsed}</span>
              </div>

              {/* Prompt box */}
              <div className="bg-black/60 border border-neutral-800/90 rounded-xl p-3 space-y-2">
                <div className="text-xs text-neutral-200 leading-relaxed font-sans">
                  "{recipe.thaiPrompt}"
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-[11px]">
                  <span className="text-neutral-500 font-mono italic">
                    คลิกเพื่อคัดลอกข้อความ
                  </span>
                  <button
                    onClick={() => handleCopyPrompt(recipe.thaiPrompt, idx)}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">คัดลอกแล้ว!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>คัดลอก Prompt</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <p className="text-xs text-neutral-400 leading-relaxed">
                {recipe.description}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-neutral-800/80">
              {recipe.tags.map(t => (
                <span
                  key={t}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-950 border border-neutral-800 text-neutral-400"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
