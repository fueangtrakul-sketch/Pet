import { GoogleGenAI } from '@google/genai';
import { VisualAnalysisResult } from '../types/pet';
import { PRESET_ANALYSIS_MODES } from '../data/petData';

export class GeminiPetService {
  private static getClient(): GoogleGenAI | null {
    const apiKey =
      import.meta.env?.VITE_GEMINI_API_KEY ||
      (typeof globalThis !== 'undefined' ? (globalThis as Record<string, unknown>).GEMINI_API_KEY as string | undefined : undefined);
    if (!apiKey) return null;
    return new GoogleGenAI({ apiKey });
  }

  public static async analyzePetImage(
    imageBase64: string,
    petName: string = 'Pet',
    species: 'dog' | 'cat' | 'other' = 'dog'
  ): Promise<VisualAnalysisResult> {
    const ai = this.getClient();

    if (!ai) {
      await new Promise(r => setTimeout(r, 700));
      return species === 'cat' ? PRESET_ANALYSIS_MODES.curious_cat : PRESET_ANALYSIS_MODES.happy_dog;
    }

    try {
      const prompt = `You are the behavioral analysis engine of "Pet Translator Mood", an app that translates pet body language and sounds into human thoughts.
Analyze this photo of a ${species} named ${petName}.
Observe:
1. Ear orientation (forward, pinned back, relaxed, perked)
2. Eye expression (soft blinking, wide alert, dilated pupils)
3. Tail posture / body pose (play-bow, curled, relaxed, stretching)
4. Overall emotional mood (Happy, Excited, Hungry, Sleepy, Curious, Scared)

Respond ONLY with valid JSON in this exact structure:
{
  "moodName": "Happy / Excited",
  "moodScore": 88,
  "speechBubbleEn": "I want to play outside! Let's chase that ball right now.",
  "speechBubbleTh": "หนูอยากออกไปวิ่งเล่นข้างนอกแล้วครับ ไปเล่นโยนบอลกันเถอะ",
  "careTipEn": "Ensure access to fresh water. Consider a short walk or game of fetch.",
  "careTipTh": "วางน้ำสะอาดไว้ให้ดื่มเสมอ แนะนำให้พาออกไปเดินเล่นหรือเล่นปาบอลสั้นๆ",
  "bodyLanguage": {
    "ears": "Ears forward and attentive",
    "tail": "Upright wagging indicating playful excitement",
    "posture": "Relaxed stance ready to move",
    "eyes": "Bright, direct gaze with relaxed brows"
  }
}`;

      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: cleanBase64,
                },
              },
              { text: prompt },
            ],
          },
        ],
      });

      const text = response.text || '';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          ...parsed,
          audioWaveform: [35, 60, 85, 45, 95, 70, 40, 90, 65, 30, 80, 50],
        };
      }
    } catch (e) {
      console.warn('Gemini Pet analysis error, falling back to preset:', e);
    }

    return species === 'cat' ? PRESET_ANALYSIS_MODES.curious_cat : PRESET_ANALYSIS_MODES.happy_dog;
  }

  public static async analyzePetSound(
    species: 'dog' | 'cat' | 'other' = 'dog',
    _petName: string = 'Pet'
  ): Promise<VisualAnalysisResult> {
    await new Promise(r => setTimeout(r, 700));

    if (species === 'cat') {
      return {
        moodName: 'Content / Purring',
        moodScore: 94,
        speechBubbleEn: 'I feel safe and comfortable here. Please keep petting gently.',
        speechBubbleTh: 'รู้สึกปลอดภัยและสบายใจมาก ช่วยลูบคางเบาๆ ต่ออีกนิดนะ',
        careTipEn: 'Purring releases endorphins. Your cat feels exceptionally safe and comfortable.',
        careTipTh: 'เสียงเพอร์บ่งบอกถึงความผ่อนคลายและปลอดภัยอย่างเต็มที่',
        bodyLanguage: {
          ears: 'Neutral slightly tilted (Blissful calm)',
          tail: 'Slow gentle swaying at low frequency',
          posture: 'Curled in resting position',
          eyes: 'Half-closed sleepy contentment',
        },
        audioWaveform: [25, 45, 65, 80, 90, 75, 60, 85, 70, 50, 40, 30],
      };
    }

    return {
      moodName: 'Excited / Play Bark',
      moodScore: 89,
      speechBubbleEn: 'I have plenty of energy right now. Let us go play outside!',
      speechBubbleTh: 'ตอนนี้มีพลังเหลือเฟือเลย ออกไปวิ่งเล่นหรือเดินเล่นกันเถอะ',
      careTipEn: 'A high-pitch staccato bark signals joyful excitement. Great time for outdoor activity.',
      careTipTh: 'เสียงเห่าสั้นเป็นจังหวะบ่งบอกถึงความกระตือรือร้น เหมาะแก่การพาออกไปทำกิจกรรมกลางแจ้ง',
      bodyLanguage: {
        ears: 'Ears pricked upwards in high alertness',
        tail: 'High vigorous tail wagging',
        posture: 'Front paws poised in play stance',
        eyes: 'Wide clear eyes full of excitement',
      },
      audioWaveform: [45, 75, 95, 60, 100, 85, 55, 90, 75, 45, 80, 60],
    };
  }
}
