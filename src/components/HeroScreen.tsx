import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { heroPetStudioPortrait } from '../assets';
import { PetProfile } from '../types/pet';
import { SoundEffects } from '../services/soundEffects';
import { FlowNavigation, ScreenId } from './FlowNavigation';

interface HeroScreenProps {
  onStart: () => void;
  lang: 'en' | 'th';
  activePet?: PetProfile | null;
  onNavigate?: (screen: ScreenId) => void;
}

export const HeroScreen: React.FC<HeroScreenProps> = ({
  onStart,
  lang,
  activePet,
  onNavigate,
}) => {
  const [imgError, setImgError] = useState(false);

  const handleNav = (screen: ScreenId) => {
    SoundEffects.playPop();
    if (onNavigate) {
      onNavigate(screen);
    } else {
      onStart();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 animate-fade-in">
      {/* Main 2-Column Editorial Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
        {/* Left Column: Value Proposition & Primary Action */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
          <div className="space-y-4">
            <p className="text-xs font-medium tracking-wide text-[#4BA393]">
              {lang === 'th'
                ? 'ระบบวิเคราะห์พฤติกรรมและอารมณ์สัตว์เลี้ยง'
                : 'Behavioral Audio & Visual Pet Translation'}
            </p>

            <h1
              className="font-display font-semibold tracking-tight text-slate-100 leading-[1.15]"
              style={{ fontSize: 'clamp(2.25rem, 4vw, 3.35rem)', textWrap: 'balance' }}
            >
              {lang === 'th'
                ? 'เข้าใจความรู้สึกสัตว์เลี้ยงผ่านภาษากายและเสียง'
                : 'Understand your pet through posture and acoustic analysis'}
            </h1>

            <p className="text-base text-slate-400 leading-relaxed max-w-xl">
              {lang === 'th'
                ? 'ถอดรหัสท่าทาง แววตา ใบหู และโทนเสียงร้องของสุนัขและแมวให้เป็นข้อความที่เข้าใจง่าย พร้อมบันทึกประวัติและแนวโน้มอารมณ์อย่างเป็นระบบ'
                : 'Translate canine and feline posture, ear orientation, and vocal tones into structured emotional insights with persistent daily mood tracking.'}
            </p>
          </div>

          {/* Primary & Secondary Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => handleNav('analysis')}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3 min-h-[46px] rounded-lg bg-[#3D8B7D] hover:bg-[#4BA393] text-white text-sm font-medium transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4BA393]"
            >
              <span>
                {lang === 'th' ? 'เริ่มวิเคราะห์อารมณ์' : 'Start Live Analysis'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => handleNav('choose')}
              className="inline-flex items-center justify-center px-5 py-3 min-h-[46px] rounded-lg border border-white/[0.1] bg-[#12161B] hover:bg-[#171C23] text-slate-300 hover:text-white text-sm font-medium transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4BA393]"
            >
              {activePet
                ? lang === 'th'
                  ? `จัดการโปรไฟล์ · ${activePet.name}`
                  : `Manage Profile · ${activePet.name}`
                : lang === 'th'
                ? 'เพิ่มโปรไฟล์สัตว์เลี้ยง'
                : 'Create Pet Profile'}
            </button>
          </div>

          {/* Quiet Key Context */}
          <div className="pt-4 border-t border-white/[0.06] flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
            <span>{lang === 'th' ? 'รองรับสุนัขและแมว' : 'Dogs & Cats'}</span>
            <span aria-hidden="true">·</span>
            <span>{lang === 'th' ? 'วิเคราะห์จากภาพถ่าย กล้องสด และเสียง' : 'Photo, Camera & Audio'}</span>
            <span aria-hidden="true">·</span>
            <span>{lang === 'th' ? 'บันทึกข้อมูลถาวรบนอุปกรณ์' : 'Persistent Local History'}</span>
          </div>
        </div>

        {/* Right Column: Clean Editorial Studio Photograph */}
        <div className="lg:col-span-6">
          <div className="relative h-full min-h-[300px] lg:min-h-[400px] rounded-xl overflow-hidden border border-white/[0.08] bg-[#12161B]">
            {!imgError ? (
              <img
                src={heroPetStudioPortrait}
                alt={lang === 'th' ? 'สุนัขและแมวในสตูดิโอแสงธรรมชาติ' : 'Calm dog and cat portrait in dark studio lighting'}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#12161B] text-slate-500 text-sm">
                Pet Translator Mood
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D10]/85 via-[#0B0D10]/20 to-transparent pointer-events-none" />

            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs text-slate-300 font-medium">
                  {activePet
                    ? lang === 'th'
                      ? `สัตว์เลี้ยงที่เลือกไว้: ${activePet.name}`
                      : `Selected companion: ${activePet.name}`
                    : lang === 'th'
                    ? 'พร้อมสำหรับการวิเคราะห์แบบเรียลไทม์'
                    : 'Ready for behavioral interpretation'}
                </p>
                <p className="text-xs text-slate-400">
                  {lang === 'th'
                    ? 'ตรวจจับตำแหน่งหู · ทิศทางหาง · ลักษณะท่าทาง · คลื่นเสียง'
                    : 'Ear posture · Tail movement · Body stance · Vocal frequency'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Minimal 3-Step Workflow Overview */}
      <section className="mt-16 pt-12 border-t border-white/[0.08]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          <div className="space-y-2">
            <span className="text-xs font-mono text-slate-500 tabular-nums">01</span>
            <h2 className="font-display text-base font-semibold text-slate-100">
              {lang === 'th' ? 'สร้างโปรไฟล์สัตว์เลี้ยง' : 'Register Pet Profile'}
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              {lang === 'th'
                ? 'เพิ่มข้อมูลสายพันธุ์ อายุ และรูปภาพสัตว์เลี้ยงของคุณ เพื่อใช้เป็นข้อมูลอ้างอิงเฉพาะตัว'
                : 'Add species, breed, age, and photo to tailor behavioral interpretation to your pet.'}
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono text-slate-500 tabular-nums">02</span>
            <h2 className="font-display text-base font-semibold text-slate-100">
              {lang === 'th' ? 'ตรวจจับภาพและเสียงสด' : 'Analyze Posture & Sound'}
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              {lang === 'th'
                ? 'แนบภาพถ่าย เปิดกล้อง หรือบันทึกเสียงร้อง เพื่อแปลความหมายและดูคะแนนความสบายใจ'
                : 'Upload an image, capture from camera, or record vocalizations to decode mood and intent.'}
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono text-slate-500 tabular-nums">03</span>
            <h2 className="font-display text-base font-semibold text-slate-100">
              {lang === 'th' ? 'ติดตามสถิติและคำแนะนำ' : 'Track Trends & Care'}
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              {lang === 'th'
                ? 'สรุปประวัติการแปลอารมณ์รายสัปดาห์ พร้อมบันทึกเก็บไว้อัตโนมัติและส่งออกรายงานได้'
                : 'Review weekly emotional balance, historical translation logs, and exportable records.'}
            </p>
          </div>
        </div>
      </section>

      <FlowNavigation
        currentScreen="home"
        onNavigate={handleNav}
        lang={lang}
      />
    </div>
  );
};
