export type PetSpecies = 'dog' | 'cat' | 'other';

export interface PetProfile {
  id: string;
  name: string;
  species: PetSpecies;
  breed: string;
  age: number;
  avatar: string;
  gender: 'male' | 'female';
  personality: string[];
  currentMood: string;
  moodScore: number;
}

export interface MoodBreakdown {
  happy: number;
  excited: number;
  relaxed: number;
  scaredOrAnxious: number;
  hungry: number;
}

export interface TranslationLog {
  id: string;
  timestamp: string;
  petName: string;
  soundType: 'Barking' | 'Meowing' | 'Whining' | 'Purring' | 'Howling' | 'Body Cue';
  translatedText: string;
  translatedTextTh: string;
  mood: string;
  confidence: number;
}

export interface VisualAnalysisResult {
  moodName: string;
  moodScore: number;
  speechBubbleEn: string;
  speechBubbleTh: string;
  careTipEn: string;
  careTipTh: string;
  bodyLanguage: {
    ears: string;
    tail: string;
    posture: string;
    eyes: string;
  };
  audioWaveform: number[];
}

export interface WeeklyMoodData {
  day: string;
  happy: number;
  excited: number;
  relaxed: number;
  anxious: number;
}

export type ReviewCategory = 'general' | 'accuracy' | 'features' | 'ui';

export interface ReviewFeedback {
  id: string;
  authorName: string;
  petName?: string;
  rating: number; // 1 to 5 stars
  comment: string;
  category: ReviewCategory;
  createdAt: string;
  likes: number;
}
