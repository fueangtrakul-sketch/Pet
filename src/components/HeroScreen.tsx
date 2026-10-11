import React, { useState } from 'react';
import { PawPrint, Sparkles, ChevronRight, Activity, ArrowRight, Volume2, Heart } from 'lucide-react';
import { SoundEffects } from '../services/soundEffects';
import { Card3D } from './Card3D';
import { PetProfile } from '../types/pet';

interface HeroScreenProps {
  onStart: () => void;
  lang: 'en' | 'th';
  activePet?: PetProfile | null;
}

export const HeroScreen: React.FC<HeroScreenProps> = ({ onStart, lang, activePet }) => {
  const [mascotMood, setMascotMood] = useState<'happy' | 'playful' | 'curious'>('happy');

  const handlePress = () => {
    SoundEffects.playBark();
    setTimeout(() => {
      SoundEffects.playPop();
      onStart();
    }, 200);
  };

  const handleMascotClick = () => {
    SoundEffects.playPurr();
    SoundEffects.playMagicChime();
    setMascotMood(prev => (prev === 'happy' ? 'playful' : prev === 'playful' ? 'curious' : 'happy'));
  };

  return (
    <div className="relative min-h-[calc(100vh-100px)] flex flex-col items-center justify-center text-center px-4 py-8 overflow-hidden select-none">
      {/* 3D Floating Ambient Depth Tokens floating in Z space */}
      <div className="absolute top-12 left-10 text-3xl animate-float-3d opacity-60 pointer-events-none drop-shadow-xl hidden md:block" style={{ animationDelay: '0.2s' }}>
        🦴
      </div>
      <div className="absolute bottom-24 left-16 text-3xl animate-float-3d opacity-70 pointer-events-none drop-shadow-xl hidden md:block" style={{ animationDelay: '1.2s' }}>
        🎾
      </div>
      <div className="absolute top-20 right-14 text-3xl animate-float-3d opacity-60 pointer-events-none drop-shadow-xl hidden md:block" style={{ animationDelay: '0.8s' }}>
        🐟
      </div>
      <div className="absolute bottom-28 right-20 text-3xl animate-float-3d opacity-70 pointer-events-none drop-shadow-xl hidden md:block" style={{ animationDelay: '1.6s' }}>
        💖
      </div>

      {/* Center Hero Content with Staggered 3D Spring-Bounce Entrance */}
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center space-y-6 sm:space-y-8 z-10">
        {/* Box 1: Top Tagline Badge */}
        <div className="animate-spring-up stagger-1 inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-400/50 text-emerald-300 text-xs sm:text-sm font-semibold backdrop-blur-md shadow-2xl hover:scale-105 transition-transform">
          <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" style={{ animationDuration: '4s' }} />
          <span>
            {lang === 'th'
              ? '✨ ระบบแปลความคิดและอารมณ์สัตว์เลี้ยงด้วย AI มิติใหม่'
              : '✨ AI-Powered Pet Emotion & Thought Decoding System'}
          </span>
        </div>

        {/* Box 2: 3D Iconic Title */}
        <div className="animate-spring-up stagger-2 relative group">
          <h1 className="font-game text-4xl sm:text-6xl md:text-8xl font-black text-white uppercase tracking-wider text-hero-3d transition-transform group-hover:scale-[1.02] duration-300">
            PET TRANSLATOR MOOD
          </h1>
          <p className="mt-3 text-sm sm:text-base md:text-lg text-emerald-100 font-medium drop-shadow-md max-w-xl mx-auto">
            {lang === 'th'
              ? 'เข้าใจความรู้สึกของน้องหมาและน้องแมวของคุณ ทั้งภาษากาย แววตา และเสียงร้อง'
              : 'Decode body language, ear cues, tail wags, and barks into clear human thoughts'}
          </p>
        </div>

        {/* Box 3: 3D Floating Interactive Mascot Disc */}
        <Card3D depth={10} className="animate-spring-up stagger-3 max-w-md w-full">
          <div
            onClick={handleMascotClick}
            className="glass-panel p-3.5 sm:p-4 rounded-3xl border-emerald-400/40 relative overflow-hidden group cursor-pointer shadow-2xl"
          >
            <div className="flex items-center justify-between space-x-4">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden ring-2 ring-emerald-400/80 shadow-2xl bg-emerald-950 flex items-center justify-center">
                  {activePet?.avatar ? (
                    <img
                      src={activePet.avatar}
                      alt={activePet.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <PawPrint className="w-9 h-9 sm:w-11 sm:h-11 text-emerald-300 fill-emerald-400/40 animate-pulse" />
                  )}
                </div>
                <span className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-emerald-950 text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-md animate-bounce">
                  3D AI
                </span>
              </div>

              <div className="flex-1 text-left">
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs font-bold text-yellow-300 font-game">
                    {activePet?.name ? activePet.name : (lang === 'th' ? 'คู่หูสัตว์เลี้ยงเสมือน' : 'Interactive Pet Avatar')}
                  </span>
                  <span className="text-xs">🐾</span>
                </div>
                <div className="mt-1 bg-black/40 border border-emerald-500/30 rounded-xl px-2.5 py-1 text-xs text-white flex items-center justify-between">
                  <span>
                    {activePet
                      ? lang === 'th'
                        ? `"${activePet.name} พร้อมให้คุณตรวจจับอารมณ์แล้ว!"`
                        : `"${activePet.name} is ready for live mood analysis!"`
                      : lang === 'th'
                      ? mascotMood === 'happy'
                        ? '"ผมกำลังมีความสุขมากๆ ครับโฮ่ง!"'
                        : mascotMood === 'playful'
                        ? '"อยากออกไปวิ่งเล่นในสวนแล้ว!"'
                        : '"มีขนมอร่อยๆ ให้ผมไหมฮะ?"'
                      : mascotMood === 'happy'
                      ? '"I am so full of joy right now!"'
                      : mascotMood === 'playful'
                      ? '"Let\'s go chase balls in the yard!"'
                      : '"Is that a treat for me?"'}
                  </span>
                  <span className="text-sm ml-1.5 animate-pulse">
                    {mascotMood === 'happy' ? '🐶' : mascotMood === 'playful' ? '🐾' : '🐱'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-2 text-[10px] text-emerald-300/80 text-center font-mono">
              {lang === 'th' ? '💡 แตะการ์ดเพื่อฟังเสียงและเปลี่ยนอารมณ์สัตว์เลี้ยง' : '💡 Tap card to hear cute pet reactions'}
            </div>
          </div>
        </Card3D>

        {/* Box 4: The Iconic "PRESS HERE 🐾" Button with 3D Tactile Push Elevation */}
        <div className="animate-spring-up stagger-4 pt-2 sm:pt-4 flex flex-col items-center space-y-3">
          <button
            onClick={handlePress}
            className="group relative flex items-center space-x-3 px-8 sm:px-12 py-4 sm:py-5 rounded-full bg-emerald-950/85 hover:bg-emerald-900/95 border-2 border-emerald-300 text-white font-game text-lg sm:text-2xl font-bold tracking-widest backdrop-blur-xl btn-3d-green shadow-[0_0_45px_rgba(74,222,128,0.7)] cursor-pointer"
          >
            <span className="text-emerald-200 group-hover:text-white transition-colors">
              {lang === 'th' ? 'กดตรงนี้เลย' : 'PRESS HERE'}
            </span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-yellow-400 flex items-center justify-center text-emerald-950 font-bold group-hover:scale-110 group-hover:rotate-12 transition-all shadow-md">
              <PawPrint className="w-5 h-5 sm:w-6 sm:h-6 fill-emerald-950" />
            </div>
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300 group-hover:translate-x-1.5 transition-transform" />
          </button>

          <span className="text-xs text-emerald-300/90 font-mono tracking-wide">
            {lang === 'th' ? '🐾 เริ่มต้นวิเคราะห์และแปลภาษาสัตว์เลี้ยง' : '🐾 Click to start translating pet emotions'}
          </span>
        </div>

        {/* Box 5: 3 Quick Steps Feature Showcase */}
        <div className="animate-spring-up stagger-5 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl w-full pt-4 text-left">
          <div className="glass-panel p-3.5 rounded-2xl border-emerald-500/30 flex items-start space-x-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-900/80 border border-emerald-400/50 flex items-center justify-center shrink-0 font-game text-yellow-300 font-bold text-xs">
              1
            </div>
            <div>
              <h4 className="font-game text-xs font-bold text-white uppercase tracking-wider">
                {lang === 'th' ? 'เลือกสัตว์เลี้ยง' : 'Select Pet'}
              </h4>
              <p className="text-[11px] text-emerald-200/90 leading-tight mt-0.5">
                {lang === 'th' ? 'ระบุโปรไฟล์และสายพันธุ์' : 'Choose companion profile'}
              </p>
            </div>
          </div>

          <div className="glass-panel p-3.5 rounded-2xl border-emerald-500/30 flex items-start space-x-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-900/80 border border-emerald-400/50 flex items-center justify-center shrink-0 font-game text-yellow-300 font-bold text-xs">
              2
            </div>
            <div>
              <h4 className="font-game text-xs font-bold text-white uppercase tracking-wider">
                {lang === 'th' ? 'ตรวจจับสด' : 'Live Scan'}
              </h4>
              <p className="text-[11px] text-emerald-200/90 leading-tight mt-0.5">
                {lang === 'th' ? 'เปิดกล้องหรืออัปโหลดรูปภาพ' : 'Real-time multi-modal AI'}
              </p>
            </div>
          </div>

          <div className="glass-panel p-3.5 rounded-2xl border-emerald-500/30 flex items-start space-x-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-900/80 border border-emerald-400/50 flex items-center justify-center shrink-0 font-game text-yellow-300 font-bold text-xs">
              3
            </div>
            <div>
              <h4 className="font-game text-xs font-bold text-white uppercase tracking-wider">
                {lang === 'th' ? 'ถอดรหัสความคิด' : 'Speech Bubble'}
              </h4>
              <p className="text-[11px] text-emerald-200/90 leading-tight mt-0.5">
                {lang === 'th' ? 'ฟังเสียงพูดและดูสถิติ 3D' : 'Listen with TTS audio voice'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
