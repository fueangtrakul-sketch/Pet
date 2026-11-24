import { PetProfile, TranslationLog, ReviewFeedback } from '../types/pet';

const STORAGE_KEYS = {
  PETS: 'pet_translator_mood_pets_v1',
  ACTIVE_PET_ID: 'pet_translator_mood_active_pet_id_v1',
  LOGS: 'pet_translator_mood_logs_v1',
  REVIEWS: 'pet_translator_mood_reviews_v1',
  SETTINGS: 'pet_translator_mood_settings_v1',
};

const INITIAL_REVIEWS: ReviewFeedback[] = [
  {
    id: 'rev_01',
    authorName: 'นันทน์ พ.',
    petName: 'ส้ม (Scottish Fold)',
    rating: 5,
    comment: 'ระบบวิเคราะห์ภาษากายและการแปลเสียงเพอร์ทำงานได้ละเอียดและเข้าใจง่ายมาก ช่วยสังเกตพฤติกรรมแมวช่วงที่รู้สึกเครียดได้ดีขึ้นจริง',
    category: 'accuracy',
    createdAt: '10 ต.ค. 2026',
    likes: 14,
  },
  {
    id: 'rev_02',
    authorName: 'Sarah W.',
    petName: 'Cooper (Golden Retriever)',
    rating: 5,
    comment: 'Clean interface without distractions. Uploading a quick photo gives clear posture insights and practical care notes immediately.',
    category: 'features',
    createdAt: '09 ต.ค. 2026',
    likes: 21,
  },
  {
    id: 'rev_03',
    authorName: 'เมธาวี ร.',
    petName: 'บัดดี้ (Corgi)',
    rating: 5,
    comment: 'ชอบหน้าสรุปสถิติรายสัปดาห์และระบบบันทึกข้อมูลอัตโนมัติ เปิดกลับมาดูย้อนหลังและส่งออกเป็น CSV ให้สัตวแพทย์ดูได้สะดวกมากค่ะ',
    category: 'general',
    createdAt: '08 ต.ค. 2026',
    likes: 9,
  },
];

export class StorageService {
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

  public static loadActivePetId(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_PET_ID);
    } catch {
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

  public static loadSettings(): { lang: 'th' | 'en'; isMuted: boolean } {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
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
