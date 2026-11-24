import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SoundEffects } from '../services/soundEffects';

export type ScreenId = 'home' | 'choose' | 'analysis' | 'dashboard' | 'review';

export interface StepInfo {
  id: ScreenId;
  stepNumber: number;
  titleTh: string;
  titleEn: string;
}

export const SCREEN_STEPS: StepInfo[] = [
  { id: 'home', stepNumber: 1, titleTh: 'หน้าแรก', titleEn: 'Overview' },
  { id: 'choose', stepNumber: 2, titleTh: 'โปรไฟล์สัตว์เลี้ยง', titleEn: 'Pet Profiles' },
  { id: 'analysis', stepNumber: 3, titleTh: 'วิเคราะห์สด', titleEn: 'Live Studio' },
  { id: 'dashboard', stepNumber: 4, titleTh: 'สถิติและประวัติ', titleEn: 'Analytics' },
  { id: 'review', stepNumber: 5, titleTh: 'รีวิวและข้อเสนอแนะ', titleEn: 'Reviews' },
];

interface FlowNavigationProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  lang: 'en' | 'th';
  className?: string;
}

export const FlowNavigation: React.FC<FlowNavigationProps> = ({
  currentScreen,
  onNavigate,
  lang,
  className = '',
}) => {
  const currentIndex = SCREEN_STEPS.findIndex(s => s.id === currentScreen);
  const prevStep = currentIndex > 0 ? SCREEN_STEPS[currentIndex - 1] : null;
  const nextStep = currentIndex < SCREEN_STEPS.length - 1 ? SCREEN_STEPS[currentIndex + 1] : null;

  const handleNav = (screen: ScreenId) => {
    SoundEffects.playPop();
    onNavigate(screen);
  };

  return (
    <nav
      aria-label={lang === 'th' ? 'การนำทางระหว่างขั้นตอน' : 'Step navigation'}
      className={`w-full border-t border-white/[0.08] pt-6 mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}
    >
      {/* Previous Step */}
      <div className="w-full sm:w-auto flex justify-start">
        {prevStep ? (
          <button
            type="button"
            onClick={() => handleNav(prevStep.id)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[42px] rounded-lg border border-white/[0.1] bg-[#12161B] hover:bg-[#181D24] text-slate-300 hover:text-slate-100 text-sm font-medium transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4BA393]"
          >
            <ChevronLeft className="w-4 h-4 text-slate-400" />
            <span>
              {lang === 'th' ? `ย้อนกลับ · ${prevStep.titleTh}` : `Back · ${prevStep.titleEn}`}
            </span>
          </button>
        ) : (
          <span className="hidden sm:inline-block text-xs text-slate-500">
            {lang === 'th' ? 'เริ่มต้นการใช้งาน' : 'Start of workflow'}
          </span>
        )}
      </div>

      {/* Step Counter & Subtle Progress */}
      <div className="flex items-center gap-3 text-xs text-slate-400 font-mono tabular-nums">
        <span>
          {currentIndex + 1} / {SCREEN_STEPS.length}
        </span>
        <div className="flex items-center gap-1.5" role="group" aria-label="Steps">
          {SCREEN_STEPS.map((step, idx) => (
            <button
              key={step.id}
              type="button"
              onClick={() => handleNav(step.id)}
              title={lang === 'th' ? step.titleTh : step.titleEn}
              aria-label={lang === 'th' ? step.titleTh : step.titleEn}
              className={`h-1.5 rounded-full transition-all duration-150 cursor-pointer ${
                idx === currentIndex
                  ? 'w-6 bg-[#4BA393]'
                  : idx < currentIndex
                  ? 'w-2 bg-slate-500 hover:bg-slate-400'
                  : 'w-2 bg-white/[0.12] hover:bg-white/[0.25]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Next Step */}
      <div className="w-full sm:w-auto flex justify-end">
        {nextStep ? (
          <button
            type="button"
            onClick={() => handleNav(nextStep.id)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[42px] rounded-lg bg-[#3D8B7D] hover:bg-[#4BA393] text-white text-sm font-medium transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4BA393]"
          >
            <span>
              {lang === 'th' ? `หน้าถัดไป · ${nextStep.titleTh}` : `Next · ${nextStep.titleEn}`}
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => handleNav('home')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[42px] rounded-lg border border-white/[0.12] bg-[#171C23] hover:bg-[#1E252E] text-slate-200 text-sm font-medium transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4BA393]"
          >
            <span>{lang === 'th' ? 'กลับสู่หน้าแรก' : 'Return to Overview'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </nav>
  );
};
