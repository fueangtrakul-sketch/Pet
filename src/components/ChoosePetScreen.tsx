import React, { useState, useRef } from 'react';
import {
  PawPrint,
  ChevronRight,
  Mic,
  Camera,
  Calendar,
  Sparkles,
  Plus,
  Check,
  CheckCircle2,
  Heart,
  Volume2,
  Upload,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import { PetProfile, PetSpecies } from '../types/pet';
import { SoundEffects } from '../services/soundEffects';
import { Card3D } from './Card3D';

interface ChoosePetScreenProps {
  pets: PetProfile[];
  activePet: PetProfile | null;
  onSelectPet: (pet: PetProfile) => void;
  onAddPet: (pet: PetProfile) => void;
  onNavigate: (screen: 'home' | 'choose' | 'analysis' | 'dashboard' | 'review') => void;
  lang: 'en' | 'th';
}

export const ChoosePetScreen: React.FC<ChoosePetScreenProps> = ({
  pets,
  activePet,
  onSelectPet,
  onAddPet,
  onNavigate,
  lang,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPetName, setNewPetName] = useState('');
  const [newPetSpecies, setNewPetSpecies] = useState<PetSpecies>('dog');
  const [newPetBreed, setNewPetBreed] = useState('');
  const [newPetAge, setNewPetAge] = useState<number>(1);
  const [newPetAvatar, setNewPetAvatar] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  const handleSelect = (pet: PetProfile) => {
    onSelectPet(pet);
    if (pet.species === 'dog') {
      SoundEffects.playBark();
    } else {
      SoundEffects.playMeow();
    }
  };

  const handleFeatureClick = (feature: 'voice' | 'visual' | 'history') => {
    SoundEffects.playPop();
    if (feature === 'visual' || feature === 'voice') {
      onNavigate('analysis');
    } else {
      onNavigate('dashboard');
    }
  };

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setNewPetAvatar(reader.result as string);
      SoundEffects.playCameraShutter();
    };
    reader.readAsDataURL(file);
  };

  const handleCreatePet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPetName.trim()) return;

    // Default emoji avatar if no custom image was uploaded
    const fallbackAvatar =
      newPetAvatar ||
      (newPetSpecies === 'dog'
        ? 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23064e3b"/><text x="50" y="65" font-size="50" text-anchor="middle">🐶</text></svg>'
        : 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23064e3b"/><text x="50" y="65" font-size="50" text-anchor="middle">🐱</text></svg>');

    const newPet: PetProfile = {
      id: `pet_${Date.now()}`,
      name: newPetName.trim(),
      species: newPetSpecies,
      breed: newPetBreed.trim() || (newPetSpecies === 'dog' ? 'Canine' : 'Feline'),
      age: Number(newPetAge) || 1,
      avatar: fallbackAvatar,
      gender: 'male',
      personality: ['Sweet', 'Friendly'],
      currentMood: 'Ready to Scan',
      moodScore: 85,
    };

    onAddPet(newPet);
    onSelectPet(newPet);
    setShowAddModal(false);
    setNewPetName('');
    setNewPetBreed('');
    setNewPetAvatar(null);
    SoundEffects.playMagicChime();
  };

  return (
    <div className="relative max-w-6xl mx-auto px-4 py-6 space-y-8 select-none">
      {/* 3D Floating Background Props */}
      <div className="absolute top-10 left-4 text-3xl animate-float-3d opacity-50 pointer-events-none drop-shadow-lg hidden md:block">
        🦴
      </div>
      <div className="absolute bottom-16 right-6 text-3xl animate-float-3d opacity-50 pointer-events-none drop-shadow-lg hidden md:block" style={{ animationDelay: '1.4s' }}>
        🐟
      </div>

      {/* Box 1: Title & Tagline with Staggered Spring Bounce */}
      <div className="animate-spring-up stagger-1 text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-400/40 text-xs text-emerald-300 font-semibold mb-1 shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          <span>{lang === 'th' ? 'ขั้นตอนที่ 2: เลือกและเพิ่มสัตว์เลี้ยงของคุณ' : 'Step 2: Add & Select Your Pet'}</span>
        </div>
        <h1 className="font-game text-3xl sm:text-5xl font-black text-white uppercase tracking-wider drop-shadow-lg text-hero-3d">
          CHOOSE YOUR PET
        </h1>
        <p className="text-sm sm:text-base text-emerald-200 font-medium drop-shadow max-w-lg mx-auto">
          {lang === 'th'
            ? 'ช่องว่างสำหรับเพิ่มสัตว์เลี้ยงของคุณเอง เพื่อเริ่มการแปลภาษาและวิเคราะห์อารมณ์'
            : 'Add your own pet profiles to begin personalized live mood analysis and translation'}
        </p>
      </div>

      {/* Box 2: Main Glassmorphic Showcase with 3D Tilt & Multi-Layer Perspective */}
      <Card3D depth={8} className="animate-spring-up stagger-2">
        <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-2xl border-emerald-400/40 preserve-3d">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Pet Showcase (User's pet or Empty Slot) */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center space-y-4">
              {pets.length > 0 && activePet ? (
                // Show Active Pet Uploaded by User
                <div className="relative group w-full max-w-lg overflow-hidden rounded-2xl border-2 border-emerald-400/60 shadow-2xl bg-emerald-950/40 transform transition-transform duration-500 hover:scale-[1.02] preserve-3d">
                  <div className="aspect-[4/3] w-full overflow-hidden flex items-center justify-center bg-black/60">
                    <img
                      src={activePet.avatar}
                      alt={activePet.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-transparent to-transparent pointer-events-none" />

                  {/* 3D Floating Overlay Selection badges with Z Depth */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between translate-z-30">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-game font-bold text-white bg-emerald-900/90 px-3.5 py-1.5 rounded-xl border border-emerald-400/50 backdrop-blur-md shadow-xl flex items-center space-x-1.5">
                        <span>{activePet.species === 'dog' ? '🐶' : '🐱'}</span>
                        <span>{activePet.name}</span>
                      </span>
                      <span className="text-xs text-emerald-200 bg-black/60 px-2.5 py-1 rounded-lg border border-emerald-500/30 font-mono">
                        {activePet.breed}
                      </span>
                    </div>

                    <span className="text-xs font-semibold text-yellow-300 bg-black/75 px-3 py-1.5 rounded-xl backdrop-blur-md border border-yellow-400/40 shadow-lg flex items-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                      <span>{activePet.currentMood}</span>
                    </span>
                  </div>
                </div>
              ) : (
                // 100% EMPTY STATE SLOT FOR USER'S PET
                <div className="w-full max-w-lg aspect-[4/3] rounded-2xl border-2 border-dashed border-emerald-400/60 bg-emerald-950/40 p-6 flex flex-col items-center justify-center text-center space-y-4 shadow-2xl">
                  <div className="w-20 h-20 rounded-3xl bg-emerald-900/60 border border-emerald-400/40 flex items-center justify-center shadow-lg">
                    <PawPrint className="w-10 h-10 text-emerald-400/80 animate-bounce" />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-mono text-yellow-300 font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 uppercase">
                      ● ช่องแสดงสัตว์เลี้ยง (ว่างเปล่า 0 ตัว)
                    </span>
                    <h3 className="font-game text-xl font-bold text-white tracking-wide">
                      {lang === 'th' ? 'ยังไม่มีสัตว์เลี้ยงของคุณ' : 'No Pets Added Yet'}
                    </h3>
                    <p className="text-xs text-emerald-200/80 max-w-xs leading-relaxed">
                      {lang === 'th'
                        ? 'กดปุ่มเพิ่มสัตว์เลี้ยงด้านล่างเพื่อเพิ่มน้องหมาหรือน้องแมวของคุณพร้อมรูปถ่าย'
                        : 'Click the button below to add your own dog or cat with your custom photo.'}
                    </p>
                  </div>

                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-yellow-400 text-emerald-950 font-game font-bold text-xs btn-3d-yellow shadow-xl cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>{lang === 'th' ? 'เพิ่มสัตว์เลี้ยงของคุณทันที' : 'Add Your Pet Now'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Right: Interactive Pet Selector Cards & Add Button */}
            <div className="lg:col-span-5 space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center justify-between">
                <span>{lang === 'th' ? `โปรไฟล์สัตว์เลี้ยง (${pets.length} ตัว)` : `Pet Profiles (${pets.length})`}</span>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center space-x-1 text-yellow-300 hover:text-yellow-200 transition-colors text-xs font-bold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{lang === 'th' ? '+ เพิ่มสัตว์เลี้ยง' : '+ Add Pet'}</span>
                </button>
              </div>

              {/* Pet Cards or Empty Slot */}
              {pets.length > 0 ? (
                <div className="space-y-3">
                  {pets.map((pet, idx) => {
                    const isSelected = activePet?.id === pet.id;
                    return (
                      <Card3D
                        key={pet.id}
                        depth={6}
                        className={`animate-spring-up ${idx === 0 ? 'stagger-3' : idx === 1 ? 'stagger-4' : 'stagger-5'}`}
                      >
                        <div
                          onClick={() => handleSelect(pet)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between preserve-3d ${
                            isSelected
                              ? 'bg-emerald-900/90 border-emerald-300 shadow-xl shadow-emerald-950/80 scale-[1.01]'
                              : 'bg-emerald-950/50 border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-900/50'
                          }`}
                        >
                          <div className="flex items-center space-x-3.5 translate-z-20">
                            <div className="relative">
                              <img
                                src={pet.avatar}
                                alt={pet.name}
                                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-400/90 shadow-lg bg-black"
                              />
                              <span className="absolute -bottom-1 -right-1 text-xs">
                                {pet.species === 'dog' ? '🐶' : '🐱'}
                              </span>
                            </div>

                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-game text-lg font-bold text-white tracking-wide">
                                  {pet.name}
                                </h3>
                                {isSelected && (
                                  <span className="w-4 h-4 rounded-full bg-emerald-400 flex items-center justify-center shadow">
                                    <Check className="w-3 h-3 text-emerald-950 font-bold" />
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-emerald-200 font-medium">
                                {pet.breed} · {pet.age} {lang === 'th' ? 'ขวบ' : 'yrs'}
                              </p>
                              <span className="text-[11px] text-yellow-300 font-semibold">
                                {lang === 'th' ? 'อารมณ์: ' : 'Mood: '}
                                {pet.currentMood} ({pet.moodScore}%)
                              </span>
                            </div>
                          </div>

                          <div className="text-right translate-z-20">
                            <span
                              className={`text-xs px-3 py-1.5 rounded-xl font-bold uppercase ${
                                isSelected
                                  ? 'bg-yellow-400 text-emerald-950 shadow-md font-game'
                                  : 'bg-emerald-900/50 text-emerald-300 border border-emerald-500/30'
                              }`}
                            >
                              {isSelected ? (lang === 'th' ? 'เลือกอยู่' : 'Active') : (lang === 'th' ? 'เลือก' : 'Select')}
                            </span>
                          </div>
                        </div>
                      </Card3D>
                    );
                  })}
                </div>
              ) : (
                // Empty right card
                <div
                  onClick={() => setShowAddModal(true)}
                  className="p-6 rounded-2xl border-2 border-dashed border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-900/30 hover:border-emerald-400 text-center space-y-2 cursor-pointer transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-900/70 mx-auto flex items-center justify-center text-emerald-300">
                    <Plus className="w-5 h-5 text-yellow-300" />
                  </div>
                  <h4 className="font-game text-sm font-bold text-white">
                    {lang === 'th' ? 'ช่องว่างสำหรับเพิ่มสัตว์เลี้ยง (0)' : 'Empty Slot — Add Your Pet (0)'}
                  </h4>
                  <p className="text-xs text-emerald-300/80">
                    {lang === 'th' ? 'คลิกที่นี่เพื่อเพิ่มสัตว์เลี้ยงตัวแรก' : 'Click here to add your first pet'}
                  </p>
                </div>
              )}

              {/* Action to Jump straight into Live Analysis */}
              <button
                onClick={() => {
                  SoundEffects.playPop();
                  onNavigate('analysis');
                }}
                className="animate-spring-up stagger-6 w-full mt-4 flex items-center justify-center space-x-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-400 to-green-500 text-emerald-950 font-game font-bold text-base btn-3d-green shadow-xl cursor-pointer"
              >
                <PawPrint className="w-5 h-5 fill-current" />
                <span>
                  {activePet
                    ? lang === 'th'
                      ? `เริ่มแปลภาษาของ ${activePet.name} ทันที`
                      : `Start Translating ${activePet.name}`
                    : lang === 'th'
                    ? 'ไปที่หน้าตรวจจับสด (Live Analysis)'
                    : 'Go to Live Analysis'}
                </span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </Card3D>

      {/* The 3 Feature Action Cards with 3D Tilt */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Voice Analysis */}
        <Card3D depth={9} className="animate-spring-up stagger-7">
          <div
            onClick={() => handleFeatureClick('voice')}
            className="glass-panel glass-card-hover p-6 rounded-3xl cursor-pointer space-y-3 border-emerald-500/30 h-full preserve-3d"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-900/70 border border-emerald-400/50 flex items-center justify-center text-emerald-300 shadow-md translate-z-20">
              <Mic className="w-6 h-6 text-yellow-300" />
            </div>
            <div className="translate-z-10">
              <h3 className="font-game text-lg font-bold text-white tracking-wide flex items-center space-x-2">
                <span>Voice Analysis</span>
                <span className="text-yellow-400">🎤</span>
              </h3>
              <p className="text-xs text-emerald-100/90 mt-1 leading-relaxed">
                {lang === 'th'
                  ? 'อัปโหลดหรือบันทึกเสียงร้องของสัตว์เลี้ยง เพื่อถอดรหัสคลื่นเสียงและตรวจจับอารมณ์'
                  : 'Upload pet sounds for mood extraction. Decodes frequency spectrum into emotional state.'}
              </p>
            </div>
            <div className="pt-2 flex items-center space-x-1.5 text-xs font-bold text-emerald-300 translate-z-20">
              <span>{lang === 'th' ? 'เข้าสู่โหมดวิเคราะห์เสียง' : 'Open Voice Analyzer'}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </Card3D>

        {/* Card 2: Visual Cue Reader */}
        <Card3D depth={9} className="animate-spring-up stagger-8">
          <div
            onClick={() => handleFeatureClick('visual')}
            className="glass-panel glass-card-hover p-6 rounded-3xl cursor-pointer space-y-3 border-emerald-500/30 h-full preserve-3d"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-900/70 border border-emerald-400/50 flex items-center justify-center text-emerald-300 shadow-md translate-z-20">
              <Camera className="w-6 h-6 text-emerald-300" />
            </div>
            <div className="translate-z-10">
              <h3 className="font-game text-lg font-bold text-white tracking-wide flex items-center space-x-2">
                <span>Visual Cue Reader</span>
                <span className="text-emerald-400">👁️</span>
              </h3>
              <p className="text-xs text-emerald-100/90 mt-1 leading-relaxed">
                {lang === 'th'
                  ? 'วิเคราะห์รูปถ่ายและกล้องสด เพื่อตรวจจับภาษากาย ตำแหน่งหู หาง และแววตา'
                  : 'Analyse photos for body language. Real-time skeletal tracking of ears, posture, and tail wag.'}
              </p>
            </div>
            <div className="pt-2 flex items-center space-x-1.5 text-xs font-bold text-emerald-300 translate-z-20">
              <span>{lang === 'th' ? 'เปิดกล้องสแกนภาษากาย' : 'Open Visual Reader'}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </Card3D>

        {/* Card 3: Mood History */}
        <Card3D depth={9} className="animate-spring-up stagger-9">
          <div
            onClick={() => handleFeatureClick('history')}
            className="glass-panel glass-card-hover p-6 rounded-3xl cursor-pointer space-y-3 border-emerald-500/30 h-full preserve-3d"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-900/70 border border-emerald-400/50 flex items-center justify-center text-emerald-300 shadow-md translate-z-20">
              <Calendar className="w-6 h-6 text-yellow-300" />
            </div>
            <div className="translate-z-10">
              <h3 className="font-game text-lg font-bold text-white tracking-wide flex items-center space-x-2">
                <span>Mood History</span>
                <span className="text-amber-300">📊</span>
              </h3>
              <p className="text-xs text-emerald-100/90 mt-1 leading-relaxed">
                {lang === 'th'
                  ? 'ดูประวัติอารมณ์ย้อนหลัง สถิติความสุข และสรุปสุขภาพสัตว์เลี้ยงแบบ 3D'
                  : 'Historical mood logs, weekly balance, and smart wellness care tips.'}
              </p>
            </div>
            <div className="pt-2 flex items-center space-x-1.5 text-xs font-bold text-emerald-300 translate-z-20">
              <span>{lang === 'th' ? 'เปิดแดชบอร์ดสถิติ' : 'View Mood History'}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </Card3D>
      </div>

      {/* Modal: Add Pet (with custom photo upload!) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel max-w-md w-full p-6 rounded-3xl border-2 border-emerald-400 bg-emerald-950/95 shadow-2xl relative space-y-4 animate-spring-up">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-emerald-300 hover:text-white p-1 rounded-lg hover:bg-emerald-900/50 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-yellow-400 text-emerald-950 font-bold">
                🐾
              </div>
              <div>
                <h3 className="font-game text-xl font-bold text-white">
                  {lang === 'th' ? 'เพิ่มสัตว์เลี้ยงของคุณ' : 'Add Your Pet'}
                </h3>
                <p className="text-xs text-emerald-300 font-mono">
                  {lang === 'th' ? 'ใส่ข้อมูลและอัปโหลดรูปถ่ายจริง' : 'Enter details & upload real photo'}
                </p>
              </div>
            </div>

            <form onSubmit={handleCreatePet} className="space-y-4 pt-2">
              {/* Pet Photo Upload Slot */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-emerald-200 block">
                  {lang === 'th' ? 'รูปถ่ายสัตว์เลี้ยง (แนบรูปภาพของคุณ)' : 'Pet Photo (Upload Your Image)'}
                </label>
                <div className="flex items-center space-x-3">
                  <div
                    onClick={() => avatarInputRef.current?.click()}
                    className="w-16 h-16 rounded-2xl border-2 border-dashed border-emerald-400/80 bg-black/50 overflow-hidden flex items-center justify-center cursor-pointer hover:border-yellow-400 transition-colors shadow-inner"
                  >
                    {newPetAvatar ? (
                      <img src={newPetAvatar} alt="Pet Avatar Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="w-6 h-6 text-emerald-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-xl bg-emerald-900/80 border border-emerald-500/40 text-xs font-bold text-emerald-200 hover:bg-emerald-800 transition-colors cursor-pointer"
                    >
                      {newPetAvatar ? (lang === 'th' ? 'เปลี่ยนรูปภาพ' : 'Change Image') : (lang === 'th' ? '📁 เลือกรูปถ่าย' : '📁 Choose Image')}
                    </button>
                    <p className="text-[10px] text-emerald-300/70 mt-1">
                      {lang === 'th' ? 'รองรับ JPG, PNG หรือภาพถ่ายจากมือถือ' : 'Supports JPG, PNG or mobile photos'}
                    </p>
                  </div>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFile}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Pet Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-emerald-200 block">
                  {lang === 'th' ? 'ชื่อสัตว์เลี้ยง *' : 'Pet Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={newPetName}
                  onChange={e => setNewPetName(e.target.value)}
                  placeholder={lang === 'th' ? 'เช่น เจ้าส้ม, โมจิ, บัดดี้' : 'e.g. Milo, Mochi, Buddy'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-900/60 border border-emerald-400/50 text-white placeholder-emerald-400/40 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              {/* Species Selection */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-emerald-200 block">
                  {lang === 'th' ? 'ชนิดสัตว์เลี้ยง' : 'Species'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewPetSpecies('dog')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer ${
                      newPetSpecies === 'dog'
                        ? 'bg-yellow-400 text-emerald-950 border-yellow-300 font-game shadow-md'
                        : 'bg-emerald-900/40 text-emerald-300 border-emerald-500/30'
                    }`}
                  >
                    <span>🐶</span>
                    <span>{lang === 'th' ? 'สุนัข / น้องหมา' : 'Dog'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewPetSpecies('cat')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer ${
                      newPetSpecies === 'cat'
                        ? 'bg-yellow-400 text-emerald-950 border-yellow-300 font-game shadow-md'
                        : 'bg-emerald-900/40 text-emerald-300 border-emerald-500/30'
                    }`}
                  >
                    <span>🐱</span>
                    <span>{lang === 'th' ? 'แมว / น้องแมว' : 'Cat'}</span>
                  </button>
                </div>
              </div>

              {/* Breed & Age */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-emerald-200 block">
                    {lang === 'th' ? 'สายพันธุ์' : 'Breed'}
                  </label>
                  <input
                    type="text"
                    value={newPetBreed}
                    onChange={e => setNewPetBreed(e.target.value)}
                    placeholder={newPetSpecies === 'dog' ? 'Golden, Corgi' : 'Scottish, Persian'}
                    className="w-full px-3 py-2 rounded-xl bg-emerald-900/60 border border-emerald-400/50 text-white placeholder-emerald-400/40 text-xs focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-emerald-200 block">
                    {lang === 'th' ? 'อายุ (ปี)' : 'Age (yrs)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={newPetAge}
                    onChange={e => setNewPetAge(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-emerald-900/60 border border-emerald-400/50 text-white text-xs focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-yellow-400 text-emerald-950 font-game font-bold text-sm btn-3d-yellow shadow-xl cursor-pointer"
                >
                  {lang === 'th' ? '✓ บันทึกสัตว์เลี้ยง' : '✓ Save Pet Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
