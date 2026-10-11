import { PetProfile, TranslationLog, WeeklyMoodData, VisualAnalysisResult } from '../types/pet';

// App starts with 0 pets and 0 logs as requested:
// Users add their own pets and upload their own photos/sounds
export const DEFAULT_PETS: PetProfile[] = [];

export const INITIAL_TRANSLATION_LOGS: TranslationLog[] = [];

export const EMPTY_WEEKLY_MOOD_STATS: WeeklyMoodData[] = [
  { day: 'Mon', happy: 0, excited: 0, relaxed: 0, anxious: 0 },
  { day: 'Tue', happy: 0, excited: 0, relaxed: 0, anxious: 0 },
  { day: 'Wed', happy: 0, excited: 0, relaxed: 0, anxious: 0 },
  { day: 'Thu', happy: 0, excited: 0, relaxed: 0, anxious: 0 },
  { day: 'Fri', happy: 0, excited: 0, relaxed: 0, anxious: 0 },
  { day: 'Sat', happy: 0, excited: 0, relaxed: 0, anxious: 0 },
  { day: 'Sun', happy: 0, excited: 0, relaxed: 0, anxious: 0 },
];

export const PRESET_ANALYSIS_MODES: Record<string, VisualAnalysisResult> = {
  happy_dog: {
    moodName: 'Happy / Excited',
    moodScore: 86,
    speechBubbleEn: 'I want to play outside! Grab the ball and let\'s run!',
    speechBubbleTh: 'หนูอยากออกไปวิ่งเล่นข้างนอกแล้วฮะ! หยิบลูกบอลแล้วไปวิ่งกัน!',
    careTipEn: 'Ensure access to fresh water. Consider a short walk or game of fetch!',
    careTipTh: 'วางน้ำสะอาดไว้ให้ดื่มเสมอ แนะนำให้พาออกไปเดินเล่นหรือเล่นปาบอลสั้นๆ',
    bodyLanguage: {
      ears: 'Forward and relaxed (Alert & friendly)',
      tail: 'High wagging at 3.4 Hz (High joy & trust)',
      posture: 'Play-bow stretch (Inviting human interaction)',
      eyes: 'Bright, dilated pupils with soft blinking',
    },
    audioWaveform: [35, 60, 85, 45, 95, 70, 40, 90, 65, 30, 80, 50],
  },
  curious_cat: {
    moodName: 'Content / Curious',
    moodScore: 92,
    speechBubbleEn: 'What is that moving over there? Can I pounce on it?',
    speechBubbleTh: 'ตรงนั้นมีอะไรขยับอยู่เหรอเหมียว? ขอกระโจนใส่ได้ไหมนะ?',
    careTipEn: 'Engage with a feather wand or laser toy to satisfy hunting instinct!',
    careTipTh: 'เล่นไม้ตกแมวหรือของเล่นขยับได้ เพื่อตอบสนองสัญชาตญาณนักล่าที่สนุกสนาน',
    bodyLanguage: {
      ears: 'Pivoting forward (Curious & focused)',
      tail: 'Upright with gentle curved tip (Friendly greeting)',
      posture: 'Crouched ready to pounce (Playful stalking)',
      eyes: 'Wide eyes, slow blinking (Sign of pure affection)',
    },
    audioWaveform: [20, 35, 50, 40, 75, 55, 30, 45, 60, 35, 40, 25],
  },
  hungry_pup: {
    moodName: 'Eager / Food Seeking',
    moodScore: 78,
    speechBubbleEn: 'I smell tasty treats! Is it dinner time yet? Please please please!',
    speechBubbleTh: 'ได้กลิ่นของอร่อยลอยมา! ถึงเวลากินข้าวหรือยังฮะ ขอนะๆๆ!',
    careTipEn: 'Check regular feeding schedule. Use treats for positive reinforcement!',
    careTipTh: 'ตรวจสอบเวลาอาหารตามตาราง สามารถให้ขนมชิ้นเล็กเพื่อฝึกคำสั่งได้ดี',
    bodyLanguage: {
      ears: 'Perked up towards the kitchen',
      tail: 'Fast sweeping wag (Anticipation)',
      posture: 'Sitting politely while staring at treat bowl',
      eyes: 'Big puppy eyes with gentle head tilt',
    },
    audioWaveform: [40, 70, 90, 60, 85, 95, 75, 60, 80, 50, 45, 30],
  },
  sleepy_cat: {
    moodName: 'Sleepy / Cozy',
    moodScore: 95,
    speechBubbleEn: 'Do not disturb my catnap... just let me sleep in the sun.',
    speechBubbleTh: 'อย่าเพิ่งกวนเวลานอนกลางวันนะเหมียว... ขอนอนอาบแดดอุ่นๆ ตรงนี้',
    careTipEn: 'Provide a warm, quiet, cushioned spot for undisturbed rest.',
    careTipTh: 'จัดเตรียมเบาะนุ่มๆ ในมุมที่เงียบสงบและอบอุ่นสำหรับการพักผ่อน',
    bodyLanguage: {
      ears: 'Relaxed and drooping sideways (Deep comfort)',
      tail: 'Tucked closely around body (Conserving heat & security)',
      posture: 'Loaf or curled up ball (Maximum contentment)',
      eyes: 'Gently closed with rhythmic breathing',
    },
    audioWaveform: [15, 20, 25, 30, 35, 30, 25, 20, 15, 20, 25, 18],
  },
};
