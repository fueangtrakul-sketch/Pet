import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Languages,
  Activity,
  BarChart3,
  PawPrint,
  Home,
  Sparkles,
  Star,
} from 'lucide-react';
import { PetProfile } from '../types/pet';
import { SoundEffects } from '../services/soundEffects';

interface NavigationProps {
  currentScreen: 'home' | 'choose' | 'analysis' | 'dashboard' | 'review';
  setCurrentScreen: (screen: 'home' | 'choose' | 'analysis' | 'dashboard' | 'review') => void;
  activePet: PetProfile | null;
  pets: PetProfile[];
  onSelectPet: (pet: PetProfile) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  lang: 'en' | 'th';
  setLang: (lang: 'en' | 'th') => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentScreen,
  setCurrentScreen,
  activePet,
  pets,
  onSelectPet,
  isMuted,
  setIsMuted,
  lang,
  setLang,
}) => {
  const [runningTabMascot, setRunningTabMascot] = useState<string | null>(null);

  const handleNavClick = (screen: 'home' | 'choose' | 'analysis' | 'dashboard' | 'review') => {
    if (screen !== currentScreen) {
      setRunningTabMascot(screen);
      SoundEffects.playFootstepsPatter(4);
      setTimeout(() => setRunningTabMascot(null), 1000);
    } else {
      SoundEffects.playPop();
    }
    setCurrentScreen(screen);
  };

  const toggleSound = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    SoundEffects.setMuted(nextState);
    if (!nextState) {
      if (activePet?.species === 'dog') {
        SoundEffects.playBark();
      } else if (activePet?.species === 'cat') {
        SoundEffects.playMeow();
      } else {
        SoundEffects.playMagicChime();
      }
    }
  };

  const toggleLang = () => {
    SoundEffects.playPop();
    setLang(lang === 'en' ? 'th' : 'en');
  };

  return (
    <header className="sticky top-0 z-50 w-full px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass-panel rounded-2xl px-4 py-2.5 sm:px-6 shadow-2xl relative">
        {/* Brand / Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center space-x-2.5 text-left group cursor-pointer focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-900/40 group-hover:scale-105 transition-transform">
            <PawPrint className="w-5 h-5 text-emerald-950 fill-emerald-950" />
          </div>
          <div>
            <span className="font-game text-base sm:text-lg font-bold text-white tracking-wider block drop-shadow-sm">
              PET TRANSLATOR MOOD
            </span>
            <span className="text-[10px] text-emerald-300/80 font-medium tracking-wide hidden sm:block">
              {lang === 'th' ? 'ระบบแปลภาษาและอารมณ์สัตว์เลี้ยง AI' : 'AI Emotion & Speech Decoder'}
            </span>
          </div>
        </button>

        {/* Center Screen Tabs with Running Pet Mascot on Switch */}
        <nav className="hidden lg:flex items-center space-x-1.5 bg-emerald-950/70 border border-emerald-500/30 p-1.5 rounded-2xl relative">
          {/* Home */}
          <button
            onClick={() => handleNavClick('home')}
            className={`relative flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              currentScreen === 'home'
                ? 'bg-emerald-400 text-emerald-950 shadow-lg shadow-emerald-900/50 font-bold scale-[1.02]'
                : 'text-emerald-200/80 hover:text-white hover:bg-emerald-900/40'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>{lang === 'th' ? 'หน้าแรก' : 'Home'}</span>
            {currentScreen === 'home' && (
              <span className="text-xs animate-bounce ml-0.5">🐾</span>
            )}
          </button>

          {/* Choose Pet */}
          <button
            onClick={() => handleNavClick('choose')}
            className={`relative flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              currentScreen === 'choose'
                ? 'bg-emerald-400 text-emerald-950 shadow-lg shadow-emerald-900/50 font-bold scale-[1.02]'
                : 'text-emerald-200/80 hover:text-white hover:bg-emerald-900/40'
            }`}
          >
            <PawPrint className="w-3.5 h-3.5" />
            <span>{lang === 'th' ? 'เลือกสัตว์เลี้ยง' : 'Choose Pet'}</span>
            {currentScreen === 'choose' && (
              <span className="text-xs animate-bounce ml-0.5">
                {activePet ? (activePet.species === 'dog' ? '🐶' : '🐱') : '🐾'}
              </span>
            )}
          </button>

          {/* Live Analysis */}
          <button
            onClick={() => handleNavClick('analysis')}
            className={`relative flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              currentScreen === 'analysis'
                ? 'bg-emerald-400 text-emerald-950 shadow-lg shadow-emerald-900/50 font-bold scale-[1.02]'
                : 'text-emerald-200/80 hover:text-white hover:bg-emerald-900/40'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{lang === 'th' ? 'ตรวจจับสด' : 'Live Analysis'}</span>
            {currentScreen === 'analysis' && (
              <span className="text-xs animate-bounce ml-0.5">👁️</span>
            )}
          </button>

          {/* Pet Dashboard */}
          <button
            onClick={() => handleNavClick('dashboard')}
            className={`relative flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              currentScreen === 'dashboard'
                ? 'bg-emerald-400 text-emerald-950 shadow-lg shadow-emerald-900/50 font-bold scale-[1.02]'
                : 'text-emerald-200/80 hover:text-white hover:bg-emerald-900/40'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{lang === 'th' ? 'แดชบอร์ด' : 'Pet Dashboard'}</span>
            {currentScreen === 'dashboard' && (
              <span className="text-xs animate-bounce ml-0.5">📊</span>
            )}
          </button>

          {/* Reviews & Feedback Tab */}
          <button
            onClick={() => handleNavClick('review')}
            className={`relative flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              currentScreen === 'review'
                ? 'bg-yellow-400 text-emerald-950 shadow-lg shadow-yellow-900/50 font-bold scale-[1.02]'
                : 'text-yellow-200/90 hover:text-white hover:bg-emerald-900/40'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${currentScreen === 'review' ? 'fill-emerald-950' : 'fill-yellow-400 text-yellow-400'}`} />
            <span>{lang === 'th' ? 'รีวิว & เรตติ้ง' : 'Reviews'}</span>
            {currentScreen === 'review' && (
              <span className="text-xs animate-bounce ml-0.5">⭐</span>
            )}
          </button>
        </nav>

        {/* Right Controls: Pet Quick Switcher, Sound, Lang */}
        <div className="flex items-center space-x-2.5">
          {/* 3D Motion Hint Badge */}
          <div
            className="hidden xl:flex items-center space-x-1.5 bg-emerald-950/70 border border-emerald-400/30 px-2.5 py-1 rounded-xl text-[10px] font-mono text-emerald-300 shadow-sm"
            title={lang === 'th' ? 'เลื่อนเมาส์เพื่อหมุนมุมมองภาพ 3D รอบทิศทาง' : 'Move cursor to rotate 3D parallax view'}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{lang === 'th' ? '3D เลื่อนตามเมาส์' : '3D Mouse Tilt'}</span>
          </div>

          {/* Active Pet Chip */}
          <div className="flex items-center space-x-1.5 bg-emerald-900/40 border border-emerald-500/30 px-2 py-1 rounded-xl">
            {activePet ? (
              <>
                <img
                  src={activePet.avatar}
                  alt={activePet.name}
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-emerald-400 bg-black"
                />
                <span className="text-xs font-bold text-white font-game hidden sm:inline">
                  {activePet.name}
                </span>
              </>
            ) : (
              <>
                <div className="w-6 h-6 rounded-full bg-emerald-800/80 flex items-center justify-center text-xs">
                  🐾
                </div>
                <span className="text-xs font-medium text-emerald-300 font-game hidden sm:inline">
                  {lang === 'th' ? 'ยังไม่มีสัตว์' : 'No Pet'}
                </span>
              </>
            )}
          </div>

          {/* Sound FX Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
              isMuted
                ? 'bg-neutral-900/60 border-neutral-700 text-neutral-400'
                : 'bg-emerald-900/50 border-emerald-500/40 text-emerald-300'
            }`}
            title={isMuted ? 'เปิดเสียงเอฟเฟกต์ (Unmute)' : 'ปิดเสียงเอฟเฟกต์ (Mute)'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Language Switcher */}
          <button
            onClick={toggleLang}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-emerald-900/50 border border-emerald-500/40 text-emerald-200 text-xs font-bold hover:bg-emerald-800/60 transition-colors cursor-pointer"
            title="Switch Language (TH / EN)"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{lang.toUpperCase()}</span>
          </button>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="flex lg:hidden mt-2 justify-center space-x-1 glass-panel p-1.5 rounded-xl overflow-x-auto">
        <button
          onClick={() => handleNavClick('home')}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center space-x-1 ${
            currentScreen === 'home' ? 'bg-emerald-400 text-emerald-950 shadow-md' : 'text-emerald-200'
          }`}
        >
          <span>{lang === 'th' ? 'หน้าแรก' : 'Home'}</span>
          {currentScreen === 'home' && <span>🐾</span>}
        </button>
        <button
          onClick={() => handleNavClick('choose')}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center space-x-1 ${
            currentScreen === 'choose' ? 'bg-emerald-400 text-emerald-950 shadow-md' : 'text-emerald-200'
          }`}
        >
          <span>{lang === 'th' ? 'เลือกสัตว์' : 'Pets'}</span>
          {currentScreen === 'choose' && (
            <span>{activePet ? (activePet.species === 'dog' ? '🐶' : '🐱') : '🐾'}</span>
          )}
        </button>
        <button
          onClick={() => handleNavClick('analysis')}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center space-x-1 ${
            currentScreen === 'analysis' ? 'bg-emerald-400 text-emerald-950 shadow-md' : 'text-emerald-200'
          }`}
        >
          <span>{lang === 'th' ? 'ตรวจจับสด' : 'Live'}</span>
          {currentScreen === 'analysis' && <span>👁️</span>}
        </button>
        <button
          onClick={() => handleNavClick('dashboard')}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center space-x-1 ${
            currentScreen === 'dashboard' ? 'bg-emerald-400 text-emerald-950 shadow-md' : 'text-emerald-200'
          }`}
        >
          <span>{lang === 'th' ? 'แดชบอร์ด' : 'Stats'}</span>
          {currentScreen === 'dashboard' && <span>📊</span>}
        </button>
        <button
          onClick={() => handleNavClick('review')}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center space-x-1 ${
            currentScreen === 'review' ? 'bg-yellow-400 text-emerald-950 shadow-md' : 'text-yellow-200'
          }`}
        >
          <Star className="w-3 h-3 fill-current inline" />
          <span>{lang === 'th' ? 'รีวิว' : 'Review'}</span>
          {currentScreen === 'review' && <span>⭐</span>}
        </button>
      </div>
    </header>
  );
};
