import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { HeroScreen } from './components/HeroScreen';
import { ChoosePetScreen } from './components/ChoosePetScreen';
import { LiveAnalysisScreen } from './components/LiveAnalysisScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { ReviewScreen } from './components/ReviewScreen';
import { PetRunnerOverlay } from './components/PetRunnerOverlay';
import { PetProfile, TranslationLog, ReviewFeedback } from './types/pet';
import { StorageService } from './services/storageService';
import { Parallax3DBackground } from './components/Parallax3DBackground';
import { SoundEffects } from './services/soundEffects';
import { Sparkles, PawPrint, Eye, Activity, BarChart3, Home, Star } from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'choose' | 'analysis' | 'dashboard' | 'review'>('home');

  // Load persistent user data from StorageService (Restores all data when returning!)
  const [pets, setPets] = useState<PetProfile[]>(() => StorageService.loadPets());
  const [activePet, setActivePet] = useState<PetProfile | null>(() => {
    const savedPets = StorageService.loadPets();
    const activeId = StorageService.loadActivePetId();
    if (activeId && savedPets.length > 0) {
      const found = savedPets.find(p => p.id === activeId);
      if (found) return found;
    }
    return savedPets[0] || null;
  });
  const [logs, setLogs] = useState<TranslationLog[]>(() => StorageService.loadLogs());
  const [reviews, setReviews] = useState<ReviewFeedback[]>(() => StorageService.loadReviews());

  // Settings
  const [lang, setLang] = useState<'th' | 'en'>(() => StorageService.loadSettings().lang);
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    const saved = StorageService.loadSettings().isMuted;
    SoundEffects.setMuted(saved);
    return saved;
  });

  // Persistent storage auto-save effects
  useEffect(() => {
    StorageService.savePets(pets);
  }, [pets]);

  useEffect(() => {
    StorageService.saveActivePetId(activePet?.id || null);
  }, [activePet]);

  useEffect(() => {
    StorageService.saveLogs(logs);
  }, [logs]);

  useEffect(() => {
    StorageService.saveReviews(reviews);
  }, [reviews]);

  useEffect(() => {
    StorageService.saveSettings({ lang, isMuted });
    SoundEffects.setMuted(isMuted);
  }, [lang, isMuted]);

  // Pet management
  const handleAddPet = (newPet: PetProfile) => {
    setPets(prev => {
      const updated = [...prev, newPet];
      StorageService.savePets(updated);
      return updated;
    });
    setActivePet(newPet);
  };

  const handleAddTranslationLog = (newLog: TranslationLog) => {
    setLogs(prev => {
      const updated = [newLog, ...prev];
      StorageService.saveLogs(updated);
      return updated;
    });
  };

  // Review management
  const handleAddReview = (newReview: ReviewFeedback) => {
    setReviews(prev => {
      const updated = [newReview, ...prev];
      StorageService.saveReviews(updated);
      return updated;
    });
  };

  const handleLikeReview = (reviewId: string) => {
    setReviews(prev => {
      const updated = prev.map(r => (r.id === reviewId ? { ...r, likes: r.likes + 1 } : r));
      StorageService.saveReviews(updated);
      return updated;
    });
  };

  const handleScreenChange = (screen: 'home' | 'choose' | 'analysis' | 'dashboard' | 'review') => {
    if (screen !== currentScreen) {
      SoundEffects.playFootstepsPatter(5);
    } else {
      SoundEffects.playPop();
    }
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen text-white font-sans overflow-x-hidden selection:bg-emerald-400 selection:text-emerald-950">
      {/* Interactive 3D Parallax Dark Forest Background with Mouse Tilt and Floating Particles */}
      <Parallax3DBackground />

      {/* App Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation Bar */}
        <Navigation
          currentScreen={currentScreen}
          setCurrentScreen={handleScreenChange}
          activePet={activePet}
          pets={pets}
          onSelectPet={setActivePet}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
          lang={lang}
          setLang={setLang}
        />

        {/* Screen Views */}
        <main className="flex-1 pb-20">
          {currentScreen === 'home' && (
            <HeroScreen
              key="home"
              onStart={() => handleScreenChange('choose')}
              lang={lang}
              activePet={activePet}
            />
          )}

          {currentScreen === 'choose' && (
            <ChoosePetScreen
              key="choose"
              pets={pets}
              activePet={activePet}
              onSelectPet={setActivePet}
              onAddPet={handleAddPet}
              onNavigate={handleScreenChange}
              lang={lang}
            />
          )}

          {currentScreen === 'analysis' && (
            <LiveAnalysisScreen
              key="analysis"
              activePet={activePet}
              lang={lang}
              onAddTranslationLog={handleAddTranslationLog}
              onNavigate={handleScreenChange}
            />
          )}

          {currentScreen === 'dashboard' && (
            <DashboardScreen
              key="dashboard"
              activePet={activePet}
              pets={pets}
              onSelectPet={setActivePet}
              logs={logs}
              lang={lang}
              onNavigate={handleScreenChange}
            />
          )}

          {currentScreen === 'review' && (
            <ReviewScreen
              key="review"
              reviews={reviews}
              onAddReview={handleAddReview}
              onLikeReview={handleLikeReview}
              pets={pets}
              activePet={activePet}
              lang={lang}
            />
          )}
        </main>

        {/* Scampering Pet Running Animation across tabs with Paw Prints Trail */}
        <PetRunnerOverlay
          currentScreen={currentScreen}
          activePet={activePet}
        />

        {/* 5-Quadrant Screen Quick Switcher Bar */}
        <div className="sticky bottom-3 z-40 max-w-2xl mx-auto px-3 w-full">
          <div className="glass-panel py-2 px-2.5 rounded-2xl flex items-center justify-between border-emerald-400/50 shadow-2xl backdrop-blur-xl gap-1">
            {/* 1. Home / หน้าแรก */}
            <button
              onClick={() => handleScreenChange('home')}
              className={`flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                currentScreen === 'home'
                  ? 'bg-yellow-400 text-emerald-950 shadow-lg scale-105 font-black'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-900/40'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>{lang === 'th' ? '1.หน้าแรก' : '1.Home'}</span>
              {currentScreen === 'home' && <span className="text-xs animate-bounce">🐾</span>}
            </button>

            {/* 2. Choose / เลือกสัตว์ */}
            <button
              onClick={() => handleScreenChange('choose')}
              className={`flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                currentScreen === 'choose'
                  ? 'bg-yellow-400 text-emerald-950 shadow-lg scale-105 font-black'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-900/40'
              }`}
            >
              <PawPrint className="w-3.5 h-3.5" />
              <span>{lang === 'th' ? '2.เลือกสัตว์' : '2.Pets'}</span>
              {currentScreen === 'choose' && (
                <span className="text-xs animate-bounce">
                  {activePet ? (activePet.species === 'dog' ? '🐶' : '🐱') : '🐾'}
                </span>
              )}
            </button>

            {/* 3. Live / ตรวจจับสด */}
            <button
              onClick={() => handleScreenChange('analysis')}
              className={`flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                currentScreen === 'analysis'
                  ? 'bg-yellow-400 text-emerald-950 shadow-lg scale-105 font-black'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-900/40'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{lang === 'th' ? '3.ตรวจจับสด' : '3.Live'}</span>
              {currentScreen === 'analysis' && <span className="text-xs animate-bounce">👁️</span>}
            </button>

            {/* 4. Dashboard / เเดชบอร์ด */}
            <button
              onClick={() => handleScreenChange('dashboard')}
              className={`flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                currentScreen === 'dashboard'
                  ? 'bg-yellow-400 text-emerald-950 shadow-lg scale-105 font-black'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-900/40'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{lang === 'th' ? '4.แดชบอร์ด' : '4.Stats'}</span>
              {currentScreen === 'dashboard' && <span className="text-xs animate-bounce">📊</span>}
            </button>

            {/* 5. Review / รีวิว & เรตติ้ง */}
            <button
              onClick={() => handleScreenChange('review')}
              className={`flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                currentScreen === 'review'
                  ? 'bg-yellow-400 text-emerald-950 shadow-lg scale-105 font-black'
                  : 'text-yellow-200 hover:text-white hover:bg-emerald-900/40'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{lang === 'th' ? '5.รีวิว' : '5.Review'}</span>
              {currentScreen === 'review' && <span className="text-xs animate-bounce">⭐</span>}
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-4 text-xs text-emerald-200/70 drop-shadow">
          <p>Pet Translator Mood · AI Pet Emotion & Body Language System</p>
        </footer>
      </div>
    </div>
  );
}
