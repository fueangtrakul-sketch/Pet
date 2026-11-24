import React, { useState, useRef } from 'react';
import { Plus, Upload, X, Check, Trash2, ArrowRight, PawPrint } from 'lucide-react';
import { PetProfile, PetSpecies } from '../types/pet';
import { SoundEffects } from '../services/soundEffects';
import { FlowNavigation, ScreenId } from './FlowNavigation';

interface ChoosePetScreenProps {
  pets: PetProfile[];
  activePet: PetProfile | null;
  onSelectPet: (pet: PetProfile) => void;
  onAddPet: (pet: PetProfile) => void;
  onDeletePet?: (petId: string) => void;
  onNavigate: (screen: ScreenId) => void;
  lang: 'en' | 'th';
}

export const ChoosePetScreen: React.FC<ChoosePetScreenProps> = ({
  pets,
  activePet,
  onSelectPet,
  onAddPet,
  onDeletePet,
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
    SoundEffects.playPop();
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

    const initialLetter = encodeURIComponent(newPetName.trim().charAt(0).toUpperCase());
    const fallbackAvatar =
      newPetAvatar ||
      `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23171C23"/><text x="100" y="118" font-family="sans-serif" font-size="72" font-weight="600" fill="%234BA393" text-anchor="middle">${initialLetter}</text></svg>`;

    const newPet: PetProfile = {
      id: `pet_${Date.now()}`,
      name: newPetName.trim(),
      species: newPetSpecies,
      breed:
        newPetBreed.trim() ||
        (newPetSpecies === 'dog'
          ? lang === 'th' ? 'สุนัข' : 'Dog'
          : newPetSpecies === 'cat'
          ? lang === 'th' ? 'แมว' : 'Cat'
          : lang === 'th' ? 'สัตว์เลี้ยง' : 'Pet'),
      age: Math.max(0, Number(newPetAge) || 0),
      avatar: fallbackAvatar,
      gender: 'male',
      personality: [],
      currentMood: lang === 'th' ? 'รอการวิเคราะห์' : 'Ready',
      moodScore: 0,
    };

    onAddPet(newPet);
    onSelectPet(newPet);
    setShowAddModal(false);
    setNewPetName('');
    setNewPetBreed('');
    setNewPetAge(1);
    setNewPetAvatar(null);
    SoundEffects.playMagicChime();
  };

  const getSpeciesLabel = (species: PetSpecies) => {
    if (species === 'dog') return lang === 'th' ? 'สุนัข' : 'Dog';
    if (species === 'cat') return lang === 'th' ? 'แมว' : 'Cat';
    return lang === 'th' ? 'อื่นๆ' : 'Other';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-[#4BA393]">
            {lang === 'th' ? 'ขั้นตอนที่ 2 · โปรไฟล์สัตว์เลี้ยง' : 'Step 2 · Companion Profiles'}
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-slate-100 tracking-tight">
            {lang === 'th' ? 'เลือกหรือเพิ่มสัตว์เลี้ยงของคุณ' : 'Select or Register Your Pet'}
          </h1>
          <p className="text-sm text-slate-400">
            {lang === 'th'
              ? 'จัดการโปรไฟล์เพื่อเก็บประวัติการแปลอารมณ์แยกตามสัตว์เลี้ยงแต่ละตัว'
              : 'Organize profiles to maintain dedicated mood logs for each companion.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[42px] rounded-lg bg-[#3D8B7D] hover:bg-[#4BA393] text-white text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4BA393]"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === 'th' ? 'เพิ่มสัตว์เลี้ยง' : 'Add Pet'}</span>
        </button>
      </div>

      {/* Main Content */}
      {pets.length === 0 ? (
        /* Clean Empty 0-State */
        <div className="rounded-xl border border-dashed border-white/[0.14] bg-[#12161B] py-16 px-6 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#171C23] border border-white/[0.08] flex items-center justify-center text-slate-400">
            <PawPrint className="w-5 h-5" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h2 className="font-display text-base font-semibold text-slate-200">
              {lang === 'th' ? 'ยังไม่มีข้อมูลสัตว์เลี้ยง (0)' : 'No Pet Profiles Registered (0)'}
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              {lang === 'th'
                ? 'เริ่มต้นด้วยการเพิ่มข้อมูลสัตว์เลี้ยงและรูปถ่ายของคุณ ข้อมูลทั้งหมดจะถูกบันทึกไว้ในอุปกรณ์'
                : 'Add your first dog or cat profile with a photo. Profiles remain saved on your device.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[42px] rounded-lg bg-[#E6EBF0] hover:bg-white text-[#0B0D10] text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'th' ? 'เพิ่มสัตว์เลี้ยงตัวแรก' : 'Add First Pet'}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Active Pet Detail Panel (Left 5 cols) */}
          <div className="lg:col-span-5 rounded-xl border border-white/[0.08] bg-[#12161B] overflow-hidden">
            {activePet ? (
              <div>
                <div className="aspect-[4/3] w-full bg-[#0B0D10] overflow-hidden border-b border-white/[0.06]">
                  <img
                    src={activePet.avatar}
                    alt={activePet.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h2 className="font-display text-xl font-semibold text-slate-100">
                        {activePet.name}
                      </h2>
                      <p className="text-xs text-slate-400">
                        {getSpeciesLabel(activePet.species)} <span aria-hidden="true">·</span> {activePet.breed}{' '}
                        <span aria-hidden="true">·</span>{' '}
                        <span className="font-mono tabular-nums">
                          {activePet.age} {lang === 'th' ? 'ปี' : 'yrs'}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      {lang === 'th' ? 'สถานะล่าสุด' : 'Latest Status'}
                    </span>
                    <span className="font-medium text-slate-200 font-mono tabular-nums">
                      {activePet.currentMood} {activePet.moodScore > 0 ? `(${activePet.moodScore}%)` : ''}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      SoundEffects.playPop();
                      onNavigate('analysis');
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[42px] rounded-lg bg-[#3D8B7D] hover:bg-[#4BA393] text-white text-sm font-medium transition-colors cursor-pointer"
                  >
                    <span>
                      {lang === 'th'
                        ? `วิเคราะห์อารมณ์ของ ${activePet.name}`
                        : `Analyze ${activePet.name}`}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          {/* Pet List (Right 7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
              <span>
                {lang === 'th'
                  ? `รายชื่อสัตว์เลี้ยงทั้งหมด (${pets.length})`
                  : `Registered Profiles (${pets.length})`}
              </span>
            </div>

            <div className="divide-y divide-white/[0.06] rounded-xl border border-white/[0.08] bg-[#12161B] overflow-hidden">
              {pets.map(pet => {
                const isSelected = activePet?.id === pet.id;
                return (
                  <div
                    key={pet.id}
                    onClick={() => handleSelect(pet)}
                    className={`p-4 flex items-center justify-between gap-4 transition-colors cursor-pointer ${
                      isSelected ? 'bg-[#171C23]' : 'hover:bg-[#151A20]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img
                        src={pet.avatar}
                        alt={pet.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-lg object-cover bg-[#0B0D10] border border-white/[0.08] shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-display text-sm font-semibold text-slate-100 truncate">
                            {pet.name}
                          </h3>
                          {isSelected && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#4BA393] shrink-0">
                              <Check className="w-3.5 h-3.5" />
                              <span>{lang === 'th' ? 'ใช้งานอยู่' : 'Active'}</span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          {getSpeciesLabel(pet.species)} · {pet.breed} ·{' '}
                          <span className="font-mono tabular-nums">
                            {pet.age} {lang === 'th' ? 'ปี' : 'yrs'}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`px-3 py-1.5 rounded-md text-xs font-medium ${
                          isSelected
                            ? 'bg-[#3D8B7D]/20 text-[#6AC2B2]'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {isSelected ? (lang === 'th' ? 'เลือกแล้ว' : 'Selected') : (lang === 'th' ? 'เลือก' : 'Select')}
                      </span>

                      {onDeletePet && (
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            SoundEffects.playPop();
                            onDeletePet(pet.id);
                          }}
                          className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-white/[0.04] transition-colors cursor-pointer"
                          title={lang === 'th' ? 'ลบโปรไฟล์' : 'Remove profile'}
                          aria-label={lang === 'th' ? `ลบ ${pet.name}` : `Remove ${pet.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Flow Navigation */}
      <FlowNavigation
        currentScreen="choose"
        onNavigate={onNavigate}
        lang={lang}
      />

      {/* Clean Dark Modal: Add Pet */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-pet-title"
        >
          <div className="w-full max-w-md rounded-xl border border-white/[0.1] bg-[#12161B] p-6 space-y-5 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <h2 id="add-pet-title" className="font-display text-lg font-semibold text-slate-100">
                  {lang === 'th' ? 'เพิ่มโปรไฟล์สัตว์เลี้ยง' : 'Register New Pet'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {lang === 'th' ? 'ระบุข้อมูลพื้นฐานและแนบภาพถ่าย' : 'Enter basic details and upload a photo'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePet} className="space-y-4">
              {/* Photo upload */}
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="w-16 h-16 rounded-lg border border-dashed border-white/[0.2] bg-[#0B0D10] overflow-hidden flex items-center justify-center text-slate-400 hover:border-[#4BA393] transition-colors cursor-pointer shrink-0"
                >
                  {newPetAvatar ? (
                    <img src={newPetAvatar} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="w-5 h-5" />
                  )}
                </button>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg border border-white/[0.1] bg-[#171C23] hover:bg-[#1E252E] text-xs font-medium text-slate-200 transition-colors cursor-pointer"
                  >
                    {newPetAvatar
                      ? lang === 'th' ? 'เปลี่ยนรูปภาพ' : 'Change Photo'
                      : lang === 'th' ? 'อัปโหลดรูปถ่าย' : 'Upload Photo'}
                  </button>
                  <p className="text-xs text-slate-500">
                    {lang === 'th' ? 'รองรับไฟล์ JPG, PNG' : 'Supports JPG, PNG'}
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

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 block">
                  {lang === 'th' ? 'ชื่อสัตว์เลี้ยง *' : 'Pet Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={newPetName}
                  onChange={e => setNewPetName(e.target.value)}
                  placeholder={lang === 'th' ? 'เช่น ส้ม, โมจิ, บัดดี้' : 'e.g. Milo, Cooper'}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0D10] border border-white/[0.1] text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#4BA393]"
                />
              </div>

              {/* Species Segmented Buttons */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 block">
                  {lang === 'th' ? 'ชนิดสัตว์เลี้ยง' : 'Species'}
                </label>
                <div className="grid grid-cols-3 gap-2 p-1 rounded-lg bg-[#0B0D10] border border-white/[0.08]">
                  {(['dog', 'cat', 'other'] as PetSpecies[]).map(sp => (
                    <button
                      key={sp}
                      type="button"
                      onClick={() => setNewPetSpecies(sp)}
                      className={`py-2 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                        newPetSpecies === sp
                          ? 'bg-[#1F2730] text-slate-100'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {getSpeciesLabel(sp)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Breed & Age */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 block">
                    {lang === 'th' ? 'สายพันธุ์' : 'Breed'}
                  </label>
                  <input
                    type="text"
                    value={newPetBreed}
                    onChange={e => setNewPetBreed(e.target.value)}
                    placeholder={newPetSpecies === 'dog' ? 'Golden, Corgi' : 'British Shorthair'}
                    className="w-full px-3 py-2 rounded-lg bg-[#0B0D10] border border-white/[0.1] text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#4BA393]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 block">
                    {lang === 'th' ? 'อายุ (ปี)' : 'Age (Years)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={newPetAge}
                    onChange={e => setNewPetAge(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-[#0B0D10] border border-white/[0.1] text-sm font-mono tabular-nums text-slate-100 focus:outline-none focus:border-[#4BA393]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  {lang === 'th' ? 'ยกเลิก' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-[#3D8B7D] hover:bg-[#4BA393] text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  {lang === 'th' ? 'บันทึกข้อมูล' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
