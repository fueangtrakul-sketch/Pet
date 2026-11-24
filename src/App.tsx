import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { HeroScreen } from './components/HeroScreen';
import { ChoosePetScreen } from './components/ChoosePetScreen';
import { LiveAnalysisScreen } from './components/LiveAnalysisScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { ReviewScreen } from './components/ReviewScreen';
import { PetProfile, TranslationLog, ReviewFeedback } from './types/pet';
import { StorageService } from './services/storageService';
import { SoundEffects } from './services/soundEffects';
import { ScreenId } from './components/FlowNavigation';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');

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

  const [lang, setLang] = useState<'th' | 'en'>(() => StorageService.loadSettings().lang);
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    const saved = StorageService.loadSettings().isMuted;
    SoundEffects.setMuted(saved);
    return saved;
  });

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

  const handleAddPet = (newPet: PetProfile) => {
    setPets(prev => {
      const updated = [...prev, newPet];
      StorageService.savePets(updated);
      return updated;
    });
    setActivePet(newPet);
  };

  const handleDeletePet = (petId: string) => {
    setPets(prev => {
      const updated = prev.filter(p => p.id !== petId);
      StorageService.savePets(updated);
      if (activePet?.id === petId) {
        setActivePet(updated[0] || null);
      }
      return updated;
    });
  };

  const handleAddTranslationLog = (newLog: TranslationLog) => {
    setLogs(prev => {
      const updated = [newLog, ...prev];
      StorageService.saveLogs(updated);
      return updated;
    });
  };

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

  const handleScreenChange = (screen: ScreenId) => {
    SoundEffects.playPop();
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0B0D10] text-slate-100 flex flex-col selection:bg-[#4BA393] selection:text-white">
      <Navigation
        currentScreen={currentScreen}
        setCurrentScreen={handleScreenChange}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        lang={lang}
        setLang={setLang}
      />

      <main className="flex-1">
        {currentScreen === 'home' && (
          <HeroScreen
            onStart={() => handleScreenChange('choose')}
            onNavigate={handleScreenChange}
            lang={lang}
            activePet={activePet}
          />
        )}

        {currentScreen === 'choose' && (
          <ChoosePetScreen
            pets={pets}
            activePet={activePet}
            onSelectPet={setActivePet}
            onAddPet={handleAddPet}
            onDeletePet={handleDeletePet}
            onNavigate={handleScreenChange}
            lang={lang}
          />
        )}

        {currentScreen === 'analysis' && (
          <LiveAnalysisScreen
            activePet={activePet}
            lang={lang}
            onAddTranslationLog={handleAddTranslationLog}
            onNavigate={handleScreenChange}
          />
        )}

        {currentScreen === 'dashboard' && (
          <DashboardScreen
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
            reviews={reviews}
            onAddReview={handleAddReview}
            onLikeReview={handleLikeReview}
            pets={pets}
            activePet={activePet}
            lang={lang}
            onNavigate={handleScreenChange}
          />
        )}
      </main>

      <footer className="border-t border-white/[0.06] py-6 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>Pet Translator Mood</span>
          <span>
            {lang === 'th'
              ? 'ระบบแปลภาษากายและอารมณ์สัตว์เลี้ยง · บันทึกข้อมูลบนอุปกรณ์'
              : 'Pet Behavioral & Mood Translation · Local Device Persistence'}
          </span>
        </div>
      </footer>
    </div>
  );
}
