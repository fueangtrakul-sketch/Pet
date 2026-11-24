import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { SoundEffects } from '../services/soundEffects';
import { ScreenId, SCREEN_STEPS } from './FlowNavigation';

interface NavigationProps {
  currentScreen: ScreenId;
  setCurrentScreen: (screen: ScreenId) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  lang: 'en' | 'th';
  setLang: (lang: 'en' | 'th') => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentScreen,
  setCurrentScreen,
  isMuted,
  setIsMuted,
  lang,
  setLang,
}) => {
  const handleNavClick = (screen: ScreenId) => {
    SoundEffects.playPop();
    setCurrentScreen(screen);
  };

  const toggleSound = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    SoundEffects.setMuted(nextState);
    if (!nextState) {
      SoundEffects.playPop();
    }
  };

  const toggleLang = () => {
    SoundEffects.playPop();
    setLang(lang === 'en' ? 'th' : 'en');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0D10]/90 backdrop-blur-md border-b border-white/[0.08]">
      {/* Desktop 3-Zone Top Bar */}
      <div className="max-w-6xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between gap-8">
        {/* Zone 1: Single clean wordmark */}
        <button
          type="button"
          onClick={() => handleNavClick('home')}
          className="font-display text-base font-semibold tracking-tight text-slate-100 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4BA393] rounded"
        >
          Pet Translator Mood
        </button>

        {/* Zone 2: Clean single-line text links */}
        <nav
          aria-label={lang === 'th' ? 'เมนูหลัก' : 'Primary Navigation'}
          className="hidden md:flex items-center gap-6 h-full"
        >
          {SCREEN_STEPS.map(step => {
            const isActive = currentScreen === step.id;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => handleNavClick(step.id)}
                className={`relative h-full inline-flex items-center text-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none ${
                  isActive
                    ? 'text-slate-100'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{lang === 'th' ? step.titleTh : step.titleEn}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#4BA393]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Language, Sound & Primary Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={toggleSound}
            className="p-2 min-h-[38px] min-w-[38px] rounded-lg border border-white/[0.08] bg-[#12161B] hover:bg-[#171C23] text-slate-400 hover:text-slate-200 transition-colors cursor-pointer flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4BA393]"
            title={isMuted ? (lang === 'th' ? 'เปิดเสียง' : 'Unmute') : (lang === 'th' ? 'ปิดเสียง' : 'Mute')}
            aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={toggleLang}
            className="px-2.5 py-1.5 min-h-[38px] rounded-lg border border-white/[0.08] bg-[#12161B] hover:bg-[#171C23] text-xs font-mono font-medium text-slate-300 hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4BA393]"
            title="Switch Language (TH / EN)"
          >
            {lang === 'th' ? 'TH' : 'EN'}
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('analysis')}
            className="hidden sm:inline-flex items-center px-4 py-2 min-h-[38px] rounded-lg bg-[#E6EBF0] hover:bg-white text-[#0B0D10] text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4BA393]"
          >
            {lang === 'th' ? 'เริ่มวิเคราะห์' : 'Analyze'}
          </button>
        </div>
      </div>

      {/* Compact Mobile Navigation Row (single line, subtle) */}
      <div className="flex md:hidden border-t border-white/[0.06] px-4 overflow-x-auto gap-5 h-10 items-center">
        {SCREEN_STEPS.map(step => {
          const isActive = currentScreen === step.id;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => handleNavClick(step.id)}
              className={`relative h-full inline-flex items-center text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer ${
                isActive ? 'text-slate-100' : 'text-slate-400'
              }`}
            >
              <span>{lang === 'th' ? step.titleTh : step.titleEn}</span>
              {isActive && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#4BA393]" />}
            </button>
          );
        })}
      </div>
    </header>
  );
};
