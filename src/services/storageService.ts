import { PetProfile, TranslationLog, ReviewFeedback } from '../types/pet';

const STORAGE_KEYS = {
  PETS: 'pet_translator_mood_pets_v1',
  ACTIVE_PET_ID: 'pet_translator_mood_active_pet_id_v1',
  LOGS: 'pet_translator_mood_logs_v1',
  REVIEWS: 'pet_translator_mood_reviews_v1',
  SETTINGS: 'pet_translator_mood_settings_v1',
};

// Default initial community reviews to make the review page feel alive and engaging
const INITIAL_REVIEWS: ReviewFeedback[] = [
  {
    id: 'rev_01',
    authorName: 'คุณนันทน์ (ทาสแมว)',
    petName: 'น้องส้ม (Scottish Fold)',
    rating: 5,
    comment: 'ฟีเจอร์สแกนตรวจจับสดแม่นยำมากครับ แปลเสียงเพอร์กับภาษากายตอนนอนอาบแดดได้ตรงใจสุดๆ ชอบ UI 3D ที่ขยับตามเมาส์ สวยลื่นตามาก!',
    category: 'accuracy',
    createdAt: '10 ต.ค. 2026',
    likes: 14,
  },
  {
    id: 'rev_02',
    authorName: 'Sarah W.',
    petName: 'Cooper (Golden Retriever)',
    rating: 5,
    comment: 'The 3D tactile card animations and audio waveform analyzer are incredible! My dog barks when excited and the speech bubble translates it instantly. 10/10!',
    category: 'features',
    createdAt: '09 ต.ค. 2026',
    likes: 21,
  },
  {
    id: 'rev_03',
    authorName: 'คุณเมย์ & โกลเด้นจอมซน',
    petName: 'บัดดี้ (Corgi)',
    rating: 5,
    comment: 'ชอบที่มีระบบบันทึกแดชบอร์ดและคำแนะนำการดูแลสุขภาพเฉพาะตัว แนะนำให้เพื่อนๆ คนรักสัตว์มาลองใช้กันเยอะๆ นะคะ',
    category: 'general',
    createdAt: '08 ต.ค. 2026',
    likes: 9,
  },
];

export class StorageService {
  // Pets
  public static loadPets(): PetProfile[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PETS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Failed to load pets from storage:', e);
    }
    return [];
  }

  public static savePets(pets: PetProfile[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(pets));
    } catch (e) {
      console.warn('Failed to save pets to storage:', e);
    }
  }

  // Active Pet ID
  public static loadActivePetId(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_PET_ID);
    } catch (e) {
      return null;
    }
  }

  public static saveActivePetId(id: string | null): void {
    try {
      if (id) {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_PET_ID, id);
      } else {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_PET_ID);
      }
    } catch (e) {
      console.warn('Failed to save active pet id:', e);
    }
  }

  // Translation Logs
  public static loadLogs(): TranslationLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LOGS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Failed to load logs from storage:', e);
    }
    return [];
  }

  public static saveLogs(logs: TranslationLog[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
    } catch (e) {
      console.warn('Failed to save logs to storage:', e);
    }
  }

  // Reviews & Feedback
  public static loadReviews(): ReviewFeedback[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Failed to load reviews from storage:', e);
    }
    return INITIAL_REVIEWS;
  }

  public static saveReviews(reviews: ReviewFeedback[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    } catch (e) {
      console.warn('Failed to save reviews to storage:', e);
    }
  }

  // Settings
  public static loadSettings(): { lang: 'th' | 'en'; isMuted: boolean } {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      // default
    }
    return { lang: 'th', isMuted: false };
  }

  public static saveSettings(settings: { lang: 'th' | 'en'; isMuted: boolean }): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings to storage:', e);
    }
  }
}
