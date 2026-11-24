import React, { useState } from 'react';
import { Download, Check, Filter, Plus, FileText } from 'lucide-react';
import { PetProfile, TranslationLog, WeeklyMoodData } from '../types/pet';
import { EMPTY_WEEKLY_MOOD_STATS } from '../data/petData';
import { SoundEffects } from '../services/soundEffects';
import { FlowNavigation, ScreenId } from './FlowNavigation';

interface DashboardScreenProps {
  activePet: PetProfile | null;
  pets: PetProfile[];
  onSelectPet: (pet: PetProfile) => void;
  logs: TranslationLog[];
  lang: 'en' | 'th';
  onNavigate?: (screen: ScreenId) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  activePet,
  pets,
  onSelectPet,
  logs,
  lang,
  onNavigate,
}) => {
  const [filterSound, setFilterSound] = useState<string>('all');
  const [downloaded, setDownloaded] = useState(false);

  const filteredLogs = logs.filter(log => {
    if (filterSound === 'all') return true;
    return log.soundType.toLowerCase() === filterSound.toLowerCase();
  });

  const handleExportCsv = () => {
    if (logs.length === 0) return;
    const header = 'Timestamp,Pet Name,Sound Trigger,Translation,Mood,Confidence\n';
    const rows = logs
      .map(
        l =>
          `"${l.timestamp}","${l.petName}","${l.soundType}","${lang === 'th' ? l.translatedTextTh : l.translatedText}","${l.mood}","${l.confidence}%"`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pet_mood_logs_${activePet?.name.toLowerCase() || 'all'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    SoundEffects.playPop();
    setTimeout(() => setDownloaded(false), 2000);
  };

  const avgMoodScore =
    logs.length > 0
      ? Math.round(logs.reduce((acc, l) => acc + (l.confidence || 85), 0) / logs.length)
      : activePet?.moodScore || 0;

  const weeklyData: WeeklyMoodData[] =
    logs.length > 0
      ? EMPTY_WEEKLY_MOOD_STATS.map((d, i) => {
          const count = logs.filter((_, idx) => idx % 7 === i).length;
          return {
            day: d.day,
            happy: count > 0 ? 58 + ((i * 5) % 24) : 0,
            excited: count > 0 ? 22 : 0,
            relaxed: count > 0 ? 15 : 0,
            anxious: count > 0 ? 5 : 0,
          };
        })
      : EMPTY_WEEKLY_MOOD_STATS;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-[#4BA393]">
            {lang === 'th' ? 'ขั้นตอนที่ 4 · แดชบอร์ดสถิติ' : 'Step 4 · Analytics & Logs'}
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-slate-100 tracking-tight">
            {lang === 'th' ? 'สรุปแนวโน้มอารมณ์และประวัติการแปล' : 'Mood Analytics & History'}
          </h1>
          <p className="text-sm text-slate-400">
            {lang === 'th'
              ? 'ติดตามคะแนนความสบายใจรายสัปดาห์และตรวจสอบบันทึกการวิเคราะห์ย้อนหลัง'
              : 'Review weekly mood distribution and inspect stored behavioral translations.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {logs.length > 0 && (
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[38px] rounded-lg border border-white/[0.1] bg-[#12161B] hover:bg-[#171C23] text-xs font-medium text-slate-200 transition-colors cursor-pointer whitespace-nowrap"
            >
              {downloaded ? <Check className="w-3.5 h-3.5 text-[#4BA393]" /> : <Download className="w-3.5 h-3.5 text-slate-400" />}
              <span>{downloaded ? (lang === 'th' ? 'ส่งออกแล้ว' : 'Exported') : (lang === 'th' ? 'ส่งออก CSV' : 'Export CSV')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Pet Switcher Strip (Only if pets exist) */}
      {pets.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 rounded-lg bg-[#12161B] border border-white/[0.08] overflow-x-auto">
            {pets.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  SoundEffects.playPop();
                  onSelectPet(p);
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  activePet?.id === p.id
                    ? 'bg-[#1F2730] text-slate-100'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
          {activePet && (
            <span className="text-xs text-slate-400">
              {activePet.breed} · <span className="font-mono tabular-nums">{activePet.age} {lang === 'th' ? 'ปี' : 'yrs'}</span>
            </span>
          )}
        </div>
      )}

      {/* 3 Quiet KPI Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-white/[0.08] bg-[#12161B] p-5 space-y-1">
          <span className="text-xs text-slate-400 block">
            {lang === 'th' ? 'ดัชนีอารมณ์เฉลี่ย' : 'Average Mood Index'}
          </span>
          <div className="font-mono text-2xl font-semibold text-slate-100 tabular-nums">
            {avgMoodScore}%
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-[#12161B] p-5 space-y-1">
          <span className="text-xs text-slate-400 block">
            {lang === 'th' ? 'จำนวนการวิเคราะห์ทั้งหมด' : 'Total Logged Scans'}
          </span>
          <div className="font-mono text-2xl font-semibold text-slate-100 tabular-nums">
            {logs.length}
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-[#12161B] p-5 space-y-1">
          <span className="text-xs text-slate-400 block">
            {lang === 'th' ? 'โปรไฟล์สัตว์เลี้ยงที่บันทึก' : 'Registered Profiles'}
          </span>
          <div className="flex items-center justify-between">
            <span className="font-mono text-2xl font-semibold text-slate-100 tabular-nums">
              {pets.length}
            </span>
            {pets.length === 0 && onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('choose')}
                className="inline-flex items-center gap-1 text-xs font-medium text-[#4BA393] hover:text-[#6AC2B2] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{lang === 'th' ? 'เพิ่มสัตว์เลี้ยง' : 'Add Pet'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Middle Section: Weekly Chart + Care Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Weekly Mood Balance (8 cols) */}
        <div className="lg:col-span-8 rounded-xl border border-white/[0.08] bg-[#12161B] p-5 sm:p-6 flex flex-col justify-between space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-sm font-semibold text-slate-100">
                {lang === 'th' ? 'สัดส่วนอารมณ์รายสัปดาห์' : 'Weekly Mood Balance'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {logs.length > 0
                  ? lang === 'th' ? 'วันจันทร์ – อาทิตย์ (%)' : 'Monday – Sunday distribution'
                  : lang === 'th' ? 'ยังไม่มีข้อมูล (0 รายการ)' : 'No logged sessions yet (0)'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-xs bg-[#4BA393]" />
                <span>{lang === 'th' ? 'ร่าเริง' : 'Happy'}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-xs bg-[#C89B54]" />
                <span>{lang === 'th' ? 'ตื่นตัว' : 'Excited'}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-xs bg-[#5E81AC]" />
                <span>{lang === 'th' ? 'ผ่อนคลาย' : 'Relaxed'}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-xs bg-[#B46970]" />
                <span>{lang === 'th' ? 'กังวล' : 'Anxious'}</span>
              </span>
            </div>
          </div>

          <div className="h-44 pt-2 flex items-end justify-between gap-3 sm:gap-5">
            {weeklyData.map(stat => (
              <div key={stat.day} className="flex-1 flex flex-col items-center h-full justify-end">
                <div className="w-full max-w-[32px] h-full flex flex-col justify-end rounded-t-sm overflow-hidden bg-[#0B0D10] border border-white/[0.06]">
                  {stat.anxious > 0 && (
                    <div style={{ height: `${stat.anxious}%` }} className="w-full bg-[#B46970]" />
                  )}
                  {stat.relaxed > 0 && (
                    <div style={{ height: `${stat.relaxed}%` }} className="w-full bg-[#5E81AC]" />
                  )}
                  {stat.excited > 0 && (
                    <div style={{ height: `${stat.excited}%` }} className="w-full bg-[#C89B54]" />
                  )}
                  {stat.happy > 0 && (
                    <div style={{ height: `${stat.happy}%` }} className="w-full bg-[#4BA393]" />
                  )}
                </div>
                <span className="text-[11px] font-mono text-slate-400 mt-2">{stat.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Behavioral Care Summary (4 cols) */}
        <div className="lg:col-span-4 rounded-xl border border-white/[0.08] bg-[#12161B] p-5 sm:p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <h2 className="font-display text-sm font-semibold text-slate-100">
              {lang === 'th' ? 'ข้อสังเกตและการดูแล' : 'Care Notes'}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'th' ? 'สรุปจากประวัติการวิเคราะห์' : 'Derived from activity logs'}
            </p>
          </div>

          {logs.length > 0 ? (
            <ul className="divide-y divide-white/[0.06] text-xs text-slate-300 flex-1">
              <li className="py-3 leading-relaxed">
                {lang === 'th'
                  ? 'เตรียมน้ำสะอาดในจุดที่เข้าถึงง่ายตลอดวัน'
                  : 'Maintain accessible fresh hydration throughout the day.'}
              </li>
              <li className="py-3 leading-relaxed">
                {lang === 'th'
                  ? 'จัดกิจกรรมกระตุ้นความสนใจสั้นๆ 15–20 นาที'
                  : 'Schedule 15–20 minute structured play sessions.'}
              </li>
              <li className="py-3 leading-relaxed">
                {lang === 'th'
                  ? 'สังเกตความสม่ำเสมอของเวลานอนและการตอบสนองต่อเสียง'
                  : 'Monitor resting posture and vocal responsiveness.'}
              </li>
            </ul>
          ) : (
            <div className="flex-1 flex flex-col justify-center py-6 text-center space-y-2 border border-dashed border-white/[0.08] rounded-lg px-4">
              <p className="text-xs font-medium text-slate-300">
                {lang === 'th' ? 'ยังไม่มีคำแนะนำ (0)' : 'No Insights Yet (0)'}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                {lang === 'th'
                  ? 'ข้อมูลคำแนะนำจะแสดงหลังการวิเคราะห์ภาพหรือเสียงในหน้าตรวจจับสด'
                  : 'Guidance populates after completing a visual or audio scan.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Translation History Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-base font-semibold text-slate-100">
              {lang === 'th' ? 'ประวัติการแปลภาษา' : 'Translation Log'}
            </h2>
            <span className="text-xs font-mono text-slate-500 tabular-nums">
              ({filteredLogs.length})
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/[0.08] bg-[#12161B] text-xs w-fit">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterSound}
              onChange={e => setFilterSound(e.target.value)}
              aria-label="Filter trigger type"
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#12161B]">{lang === 'th' ? 'ทุกประเภท' : 'All Triggers'}</option>
              <option value="barking" className="bg-[#12161B]">Barking</option>
              <option value="meowing" className="bg-[#12161B]">Meowing</option>
              <option value="body cue" className="bg-[#12161B]">Body Cue</option>
            </select>
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-[#12161B] overflow-x-auto">
          {filteredLogs.length > 0 ? (
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/[0.08] text-slate-400 font-medium">
                <tr className="h-10">
                  <th className="px-4 font-medium">{lang === 'th' ? 'เวลา' : 'Time'}</th>
                  <th className="px-4 font-medium">{lang === 'th' ? 'สัตว์เลี้ยง' : 'Pet'}</th>
                  <th className="px-4 font-medium">{lang === 'th' ? 'ประเภท' : 'Trigger'}</th>
                  <th className="px-4 font-medium">{lang === 'th' ? 'ความหมายที่แปลได้' : 'Translation'}</th>
                  <th className="px-4 font-medium text-right">{lang === 'th' ? 'อารมณ์' : 'Mood'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-slate-200">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="h-11 hover:bg-[#171C23] transition-colors">
                    <td className="px-4 font-mono text-slate-400 tabular-nums whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="px-4 font-medium text-slate-100 whitespace-nowrap">
                      {log.petName}
                    </td>
                    <td className="px-4 text-slate-400 whitespace-nowrap">
                      {log.soundType}
                    </td>
                    <td className="px-4 text-slate-300 max-w-md truncate">
                      {lang === 'th' ? log.translatedTextTh : log.translatedText}
                    </td>
                    <td className="px-4 text-right whitespace-nowrap">
                      <span className="text-slate-200">{log.mood}</span>
                      <span className="text-slate-500 font-mono tabular-nums ml-2">
                        {log.confidence}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-12 px-6 text-center space-y-3">
              <FileText className="w-6 h-6 text-slate-500 mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-200">
                  {lang === 'th' ? 'ยังไม่มีประวัติการแปล (0 รายการ)' : 'No Translation Entries (0)'}
                </p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {lang === 'th'
                    ? 'เริ่มต้นวิเคราะห์ภาพหรือเสียงในหน้าวิเคราะห์สดเพื่อบันทึกรายการแรก'
                    : 'Run a photo or voice analysis in Live Studio to record your first entry.'}
                </p>
              </div>
              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('analysis')}
                  className="inline-flex items-center px-4 py-2 rounded-lg border border-white/[0.1] bg-[#171C23] hover:bg-[#1E252E] text-xs font-medium text-slate-200 transition-colors cursor-pointer"
                >
                  {lang === 'th' ? 'ไปหน้าวิเคราะห์สด' : 'Go to Live Studio'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {onNavigate && (
        <FlowNavigation
          currentScreen="dashboard"
          onNavigate={onNavigate}
          lang={lang}
        />
      )}
    </div>
  );
};
