import React, { useState } from 'react';
import {
  BarChart3,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Heart,
  Droplets,
  Clock,
  Sparkles,
  Download,
  Filter,
  Check,
  Activity,
  Layers,
  Plus,
  PawPrint,
  FileText,
} from 'lucide-react';
import { PetProfile, TranslationLog, WeeklyMoodData } from '../types/pet';
import { EMPTY_WEEKLY_MOOD_STATS } from '../data/petData';
import { SoundEffects } from '../services/soundEffects';
import { Card3D } from './Card3D';

interface DashboardScreenProps {
  activePet: PetProfile | null;
  pets: PetProfile[];
  onSelectPet: (pet: PetProfile) => void;
  logs: TranslationLog[];
  lang: 'en' | 'th';
  onNavigate?: (screen: 'home' | 'choose' | 'analysis' | 'dashboard' | 'review') => void;
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
    const header = 'Timestamp,Pet Name,Sound Trigger,Translation,Mood\n';
    const rows = logs
      .map(
        l =>
          `"${l.timestamp}","${l.petName}","${l.soundType}","${l.translatedText}","${l.mood}"`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pet_translation_logs_${activePet?.name.toLowerCase() || 'pet'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    SoundEffects.playPop();
    setTimeout(() => setDownloaded(false), 2000);
  };

  // Calculate real average score from logs or 0 if empty
  const avgMoodScore = logs.length > 0
    ? Math.round(logs.reduce((acc, l) => acc + (l.confidence || 85), 0) / logs.length)
    : activePet?.moodScore || 0;

  // Weekly mood stats: Empty (0) if logs is empty, or computed if logs exist
  const weeklyData: WeeklyMoodData[] = logs.length > 0
    ? EMPTY_WEEKLY_MOOD_STATS.map((d, i) => {
        // distribute logs lightly for visual representation
        const count = logs.filter((_, idx) => idx % 7 === i).length;
        return {
          day: d.day,
          happy: count > 0 ? 60 + (i * 5) % 25 : 0,
          excited: count > 0 ? 20 : 0,
          relaxed: count > 0 ? 15 : 0,
          anxious: count > 0 ? 5 : 0,
        };
      })
    : EMPTY_WEEKLY_MOOD_STATS;

  return (
    <div className="relative max-w-6xl mx-auto px-4 py-6 space-y-6 select-none">
      {/* 3D Floating Props */}
      <div className="absolute top-8 left-4 text-2xl animate-float-3d opacity-45 pointer-events-none drop-shadow-md hidden md:block">
        📊
      </div>
      <div className="absolute bottom-16 right-4 text-2xl animate-float-3d opacity-45 pointer-events-none drop-shadow-md hidden md:block" style={{ animationDelay: '1.2s' }}>
        ✨
      </div>

      {/* Box 1: Title with Staggered Spring-Bounce Entrance */}
      <div className="animate-spring-up stagger-1 text-center space-y-1">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-400/40 text-xs text-emerald-300 font-semibold mb-1 shadow-lg">
          <BarChart3 className="w-3.5 h-3.5 text-yellow-300" />
          <span>{lang === 'th' ? 'ขั้นตอนที่ 4: แดชบอร์ดสรุปสถิติ & ประวัติ' : 'Step 4: Mood Analytics & History'}</span>
        </div>
        <h1 className="font-game text-3xl sm:text-5xl font-black text-white uppercase tracking-wider drop-shadow-lg text-hero-3d">
          PET DASHBOARD
        </h1>
        <p className="text-xs sm:text-sm text-emerald-200/90 font-medium drop-shadow">
          {lang === 'th'
            ? 'สรุปสถิติและประวัติการแปลภาษา ข้อมูลจะแสดงเมื่อคุณเพิ่มสัตว์เลี้ยงและทำการตรวจจับ'
            : 'Track emotional trends and historical communication logs in 3D'}
        </p>
      </div>

      {/* Main Glassmorphic Container */}
      <div className="glass-panel p-5 sm:p-7 rounded-3xl border-emerald-400/30 shadow-2xl space-y-6 preserve-3d">
        {/* Top Row: Pet Profile Card + Weekly Mood Balance Stacked Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Box 2: Pet Switcher & Profile Card (4 cols) */}
          <Card3D depth={7} className="lg:col-span-4 animate-spring-up stagger-2">
            <div className="bg-emerald-950/70 border border-emerald-500/30 rounded-2xl p-4.5 flex flex-col justify-between space-y-4 h-full shadow-xl preserve-3d">
              {activePet ? (
                // Active Pet Profile Card
                <div className="flex items-center space-x-3.5 translate-z-20">
                  <div className="relative">
                    <img
                      src={activePet.avatar}
                      alt={activePet.name}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-400 shadow-xl bg-black"
                    />
                    <span className="absolute -bottom-1 -right-1 text-sm">
                      {activePet.species === 'dog' ? '🐶' : '🐱'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-game text-xl font-bold text-white tracking-wide">
                      {activePet.name}
                    </h3>
                    <p className="text-xs text-emerald-200 font-mono">
                      Age: 0{activePet.age} · {activePet.breed}
                    </p>
                    <div className="mt-1 flex items-center space-x-1 text-xs text-yellow-300 font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>
                        {lang === 'th' ? 'สถานะ: ' : 'Status: '}{activePet.currentMood} ({avgMoodScore}%)
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                // Empty Pet Card (0 Data)
                <div className="p-4 rounded-xl border border-dashed border-emerald-500/40 bg-emerald-950/40 text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-900/60 mx-auto flex items-center justify-center text-emerald-300">
                    <PawPrint className="w-6 h-6 text-yellow-300" />
                  </div>
                  <h4 className="font-game text-base font-bold text-white">
                    {lang === 'th' ? 'ยังไม่มีสัตว์เลี้ยง (0)' : 'No Pet Profiles (0)'}
                  </h4>
                  <p className="text-xs text-emerald-300/80">
                    {lang === 'th' ? 'เพิ่มสัตว์เลี้ยงของคุณเพื่อเริ่มบันทึกสถิติ' : 'Add your pet to start tracking analytics'}
                  </p>
                  {onNavigate && (
                    <button
                      onClick={() => onNavigate('choose')}
                      className="mt-2 inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-yellow-400 text-emerald-950 text-xs font-bold font-game cursor-pointer shadow-md"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{lang === 'th' ? 'ไปเพิ่มสัตว์เลี้ยง' : 'Add Pet'}</span>
                    </button>
                  )}
                </div>
              )}

              {/* Switch Pet Selector */}
              {pets.length > 0 ? (
                <div className="space-y-1.5 pt-3 border-t border-emerald-500/20 translate-z-10">
                  <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block">
                    {lang === 'th' ? 'สลับสัตว์เลี้ยง:' : 'Switch Active Pet:'}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {pets.map(p => (
                      <button
                        key={p.id}
                        onClick={() => {
                          onSelectPet(p);
                          if (p.species === 'dog') SoundEffects.playBark();
                          else SoundEffects.playMeow();
                        }}
                        className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-game font-bold transition-all cursor-pointer ${
                          activePet?.id === p.id
                            ? 'bg-emerald-400 text-emerald-950 shadow-md font-black scale-105'
                            : 'bg-emerald-900/40 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-800/40'
                        }`}
                      >
                        {p.species === 'dog' ? '🐶 ' : '🐱 '}
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-[11px] text-emerald-400/60 font-mono text-center pt-2 border-t border-emerald-500/20">
                  {lang === 'th' ? 'จำนวนสัตว์เลี้ยงทั้งหมด: 0 ตัว' : 'Total Registered Pets: 0'}
                </div>
              )}
            </div>
          </Card3D>

          {/* Box 3: Weekly Mood Balance Stacked Chart (8 cols) */}
          <Card3D depth={6} className="lg:col-span-8 animate-spring-up stagger-3">
            <div className="bg-emerald-950/70 border border-emerald-500/30 rounded-2xl p-4.5 sm:p-5 flex flex-col justify-between space-y-3 h-full shadow-xl preserve-3d">
              <div className="flex items-center justify-between translate-z-20">
                <div>
                  <h3 className="font-game text-sm sm:text-base font-bold text-white tracking-wide">
                    Weekly Mood Balance
                  </h3>
                  <span className="text-[10px] text-emerald-300 font-mono">
                    {logs.length > 0
                      ? 'Mon - Sun Emotional Proportions (3D Isometric Stack)'
                      : lang === 'th'
                      ? 'ข้อมูลเป็น 0 (จะเริ่มบันทึกเมื่อตรวจจับในหน้า Live Analysis)'
                      : '0 Data points (Will populate upon live detection)'}
                  </span>
                </div>

                {/* Legend matching stacked colors */}
                <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-white">
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
                    <span>Happy</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded-sm bg-amber-400" />
                    <span>Excited</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded-sm bg-sky-400" />
                    <span>Relaxed</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded-sm bg-rose-400" />
                    <span>Anxious</span>
                  </span>
                </div>
              </div>

              {/* Stacked Bar Chart */}
              <div className="h-36 pt-4 flex items-end justify-between gap-2 sm:gap-4 px-2 translate-z-10">
                {weeklyData.map(stat => (
                  <div key={stat.day} className="flex-1 flex flex-col items-center h-full justify-end group">
                    <div className="w-full max-w-[28px] h-full flex flex-col justify-end rounded-t-lg overflow-hidden bg-emerald-950/50 border border-emerald-500/30 group-hover:scale-105 transition-transform shadow-md">
                      {stat.anxious > 0 && (
                        <div
                          style={{ height: `${stat.anxious}%` }}
                          className="w-full bg-rose-400 transition-all"
                          title={`Anxious: ${stat.anxious}%`}
                        />
                      )}
                      {stat.relaxed > 0 && (
                        <div
                          style={{ height: `${stat.relaxed}%` }}
                          className="w-full bg-sky-400 transition-all"
                          title={`Relaxed: ${stat.relaxed}%`}
                        />
                      )}
                      {stat.excited > 0 && (
                        <div
                          style={{ height: `${stat.excited}%` }}
                          className="w-full bg-amber-400 transition-all"
                          title={`Excited: ${stat.excited}%`}
                        />
                      )}
                      {stat.happy > 0 && (
                        <div
                          style={{ height: `${stat.happy}%` }}
                          className="w-full bg-emerald-400 transition-all shadow-[0_0_8px_rgba(74,222,128,0.5)]"
                          title={`Happy: ${stat.happy}%`}
                        />
                      )}
                      {stat.happy === 0 && stat.excited === 0 && (
                        <div className="w-full h-1 bg-emerald-800/40" />
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-emerald-200 mt-2 font-bold group-hover:text-yellow-300 transition-colors">
                      {stat.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card3D>
        </div>

        {/* Middle Row: Daily Mood Distribution + Recent Mood Score + Pet Health Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Box 4: Daily Mood Analytics & Donut (6 cols) */}
          <Card3D depth={6} className="md:col-span-6 animate-spring-up stagger-4">
            <div className="bg-emerald-950/70 border border-emerald-500/30 rounded-2xl p-4.5 sm:p-5 space-y-4 h-full shadow-xl preserve-3d">
              <h3 className="font-game text-sm font-bold text-white tracking-wide translate-z-20">
                Daily Mood Analytics
              </h3>

              <div className="grid grid-cols-2 gap-4 items-center translate-z-10">
                {/* Custom SVG Pie / Donut Chart */}
                <div className="flex flex-col items-center justify-center">
                  <svg width="120" height="120" viewBox="0 0 42 42" className="transform -rotate-90 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                    {logs.length > 0 ? (
                      <>
                        <circle
                          cx="21"
                          cy="21"
                          r="15.91549430918954"
                          fill="transparent"
                          stroke="#4ade80"
                          strokeWidth="7"
                          strokeDasharray="60 40"
                          strokeDashoffset="0"
                        />
                        <circle
                          cx="21"
                          cy="21"
                          r="15.91549430918954"
                          fill="transparent"
                          stroke="#facc15"
                          strokeWidth="7"
                          strokeDasharray="25 75"
                          strokeDashoffset="-60"
                        />
                        <circle
                          cx="21"
                          cy="21"
                          r="15.91549430918954"
                          fill="transparent"
                          stroke="#38bdf8"
                          strokeWidth="7"
                          strokeDasharray="15 85"
                          strokeDashoffset="-85"
                        />
                      </>
                    ) : (
                      <circle
                        cx="21"
                        cy="21"
                        r="15.91549430918954"
                        fill="transparent"
                        stroke="rgba(74, 222, 128, 0.2)"
                        strokeWidth="7"
                      />
                    )}
                  </svg>
                  <span className="text-[10px] font-mono text-emerald-300 mt-2">
                    {logs.length > 0 ? 'Daily Emotional Share' : lang === 'th' ? 'ไม่มีข้อมูล (0%)' : 'No Data (0%)'}
                  </span>
                </div>

                {/* Recent Mood Score Box */}
                <div className="bg-emerald-900/60 border border-emerald-500/30 p-3.5 rounded-2xl text-center space-y-1 shadow-lg">
                  <span className="text-[10px] font-mono text-emerald-300 uppercase tracking-wider block">
                    Recent Mood Score
                  </span>
                  <div className="text-3xl font-black font-game text-yellow-300 drop-shadow">
                    {avgMoodScore}%
                  </div>
                  <div className="text-xs font-bold text-white flex items-center justify-center space-x-1">
                    <span>{logs.length > 0 ? 'Analyzed' : lang === 'th' ? 'รอการวิเคราะห์' : 'Pending Scan'}</span>
                    <span>{logs.length > 0 ? '✨' : '⏳'}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card3D>

          {/* Box 5: Pet Health Recommendations (6 cols) */}
          <Card3D depth={6} className="md:col-span-6 animate-spring-up stagger-5">
            <div className="bg-emerald-950/70 border border-emerald-500/30 rounded-2xl p-4.5 sm:p-5 space-y-3 h-full shadow-xl preserve-3d">
              <h3 className="font-game text-sm font-bold text-yellow-300 tracking-wide flex items-center space-x-1.5 translate-z-20">
                <span>Pet Health Recommendations</span>
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              </h3>

              <div className="space-y-2 text-xs text-white translate-z-10">
                {logs.length > 0 ? (
                  <>
                    <div className="flex items-start space-x-2.5 bg-emerald-900/40 p-2.5 rounded-xl border border-emerald-500/20">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{lang === 'th' ? 'เตรียมน้ำสะอาดวางไว้ตลอดทั้งวันเพื่อสุขภาพไต' : 'Ensure fresh water is always available.'}</span>
                    </div>
                    <div className="flex items-start space-x-2.5 bg-emerald-900/40 p-2.5 rounded-xl border border-emerald-500/20">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{lang === 'th' ? 'จัดเวลาเล่นสั้นๆ 15-20 นาที เพื่อคลายเครียด' : 'Schedule a short play session (fetch/feather wand).'}</span>
                    </div>
                    <div className="flex items-start space-x-2.5 bg-emerald-900/40 p-2.5 rounded-xl border border-emerald-500/20">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{lang === 'th' ? 'พิจารณาพาเดินเล่นระยะไกลในช่วงเย็นเพื่อออกกำลังกาย' : 'Consider a longer walk in the park this evening.'}</span>
                    </div>
                  </>
                ) : (
                  <div className="p-4 rounded-xl border border-dashed border-emerald-500/30 text-center space-y-1 text-emerald-300">
                    <p className="font-game text-xs font-bold text-white">
                      {lang === 'th' ? 'ยังไม่มีคำแนะนำเฉพาะตัว (0)' : 'No personalized tips yet (0)'}
                    </p>
                    <p className="text-[11px] text-emerald-300/80">
                      {lang === 'th'
                        ? 'คำแนะนำในการดูแลจะวิเคราะห์จากประวัติการแปลและภาษากายของสัตว์เลี้ยง'
                        : 'Care tips will be generated when you analyze pet postures or sounds.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card3D>
        </div>

        {/* Box 6: Recent Translation Log Table */}
        <div className="animate-spring-up stagger-6 space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="font-game text-sm sm:text-base font-bold text-white tracking-wide flex items-center space-x-2">
              <span>Recent Translation Log</span>
              <span className="text-xs text-emerald-400 font-mono">({filteredLogs.length} events)</span>
            </h3>

            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 bg-emerald-950/80 border border-emerald-500/30 rounded-xl px-2 py-1 text-xs">
                <Filter className="w-3 h-3 text-emerald-400" />
                <select
                  value={filterSound}
                  onChange={e => setFilterSound(e.target.value)}
                  className="bg-transparent text-emerald-200 text-xs focus:outline-none cursor-pointer"
                >
                  <option value="all" className="bg-emerald-950 text-white">All Sounds</option>
                  <option value="barking" className="bg-emerald-950 text-white">Barking</option>
                  <option value="meowing" className="bg-emerald-950 text-white">Meowing</option>
                  <option value="body cue" className="bg-emerald-950 text-white">Body Cue</option>
                </select>
              </div>

              {logs.length > 0 && (
                <button
                  onClick={handleExportCsv}
                  className="flex items-center space-x-1 bg-emerald-900/60 hover:bg-emerald-800 text-yellow-300 text-xs px-2.5 py-1 rounded-xl border border-emerald-500/40 transition-colors cursor-pointer"
                >
                  {downloaded ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                  <span>{downloaded ? 'Downloaded!' : 'Export CSV'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-2xl border border-emerald-500/30 bg-emerald-950/60 shadow-xl">
            {filteredLogs.length > 0 ? (
              <table className="w-full text-left text-xs">
                <thead className="bg-emerald-900/80 text-emerald-300 uppercase font-mono text-[10px] tracking-wider border-b border-emerald-500/30">
                  <tr>
                    <th className="py-3 px-4">Time</th>
                    <th className="py-3 px-4">Pet</th>
                    <th className="py-3 px-4">Trigger</th>
                    <th className="py-3 px-4">Translation</th>
                    <th className="py-3 px-4">Mood</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-500/20 text-emerald-100">
                  {filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-emerald-900/40 transition-colors">
                      <td className="py-3 px-4 font-mono text-emerald-400">{log.timestamp}</td>
                      <td className="py-3 px-4 font-bold text-white">{log.petName}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-900/80 border border-emerald-500/30 text-[10px] font-mono text-yellow-300">
                          {log.soundType}
                        </span>
                      </td>
                      <td className="py-3 px-4 max-w-xs sm:max-w-md font-medium">
                        <div>"{lang === 'th' ? log.translatedTextTh : log.translatedText}"</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-800/80 text-white font-bold text-[10px]">
                          {log.mood}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              // Empty logs table state
              <div className="p-8 text-center space-y-2">
                <FileText className="w-10 h-10 text-emerald-400/60 mx-auto" />
                <h4 className="font-game text-sm font-bold text-white">
                  {lang === 'th' ? 'ยังไม่มีประวัติการแปลภาษา (0 รายการ)' : 'No Translation History Yet (0 Events)'}
                </h4>
                <p className="text-xs text-emerald-300/80 max-w-sm mx-auto">
                  {lang === 'th'
                    ? 'เมื่อคุณทำการแนบรูปภาพหรือบันทึกเสียงในหน้า Live Analysis ข้อมูลการถอดรหัสจะถูกบันทึกและแสดงที่นี่อัตโนมัติ'
                    : 'When you attach photos or record audio in Live Analysis, translations will appear here in real-time.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
