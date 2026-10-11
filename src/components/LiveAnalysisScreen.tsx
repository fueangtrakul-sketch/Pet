import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  Upload,
  Mic,
  Volume2,
  Sparkles,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Share2,
  Heart,
  Activity,
  X,
  Eye,
  Sliders,
  Image as ImageIcon,
  RotateCcw,
} from 'lucide-react';
import { PetProfile, VisualAnalysisResult, TranslationLog } from '../types/pet';
import { GeminiPetService } from '../services/geminiPetService';
import { SoundEffects } from '../services/soundEffects';
import { Card3D } from './Card3D';

interface LiveAnalysisScreenProps {
  activePet: PetProfile | null;
  lang: 'en' | 'th';
  onAddTranslationLog: (log: TranslationLog) => void;
  onNavigate?: (screen: 'home' | 'choose' | 'analysis' | 'dashboard' | 'review') => void;
}

export const LiveAnalysisScreen: React.FC<LiveAnalysisScreenProps> = ({
  activePet,
  lang,
  onAddTranslationLog,
  onNavigate,
}) => {
  // Empty initial state: No media, 0 data, no fake AI sample photos
  const [analysisResult, setAnalysisResult] = useState<VisualAnalysisResult | null>(null);
  const [hasScanned, setHasScanned] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStepText, setScanStepText] = useState('');
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [useWebcam, setUseWebcam] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showWireframe, setShowWireframe] = useState(true);
  const [is3DMode, setIs3DMode] = useState(true);
  const [toastNotification, setToastNotification] = useState<{
    show: boolean;
    title: string;
    description: string;
    moodScore: number;
  } | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle webcam stream
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (useWebcam) {
      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: 'user' } })
        .then(s => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch(err => {
          console.warn('Webcam permission denied or unavailable:', err);
          setUseWebcam(false);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, [useWebcam]);

  // Handle image file upload with rich scanning FX & sound
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Play camera shutter sound!
    SoundEffects.playCameraShutter();

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setUploadedImage(base64);
      setUseWebcam(false);
      setIsAnalyzing(true);
      setScanProgress(15);
      setScanStepText(lang === 'th' ? 'ตรวจจับใบหน้าและดวงตาสัตว์เลี้ยง...' : 'Detecting facial landmarks & eyes...');

      // 2. Play laser scanning sound effect!
      SoundEffects.playScanningLaser();

      // Simulated multi-step visual scan telemetry
      const step1 = setTimeout(() => {
        setScanProgress(45);
        setScanStepText(lang === 'th' ? 'วิเคราะห์การเอียงของหูและทิศทางหาง...' : 'Analyzing ear posture & tail wag angle...');
        SoundEffects.playFootstepsPatter(2);
      }, 450);

      const step2 = setTimeout(() => {
        setScanProgress(80);
        setScanStepText(lang === 'th' ? 'ถอดรหัสความคิดและระดับอารมณ์ด้วย AI...' : 'Decoding inner thoughts with Multimodal AI...');
        SoundEffects.playScanningLaser();
      }, 900);

      try {
        const petSpecies = activePet?.species || 'dog';
        const petName = activePet?.name || (lang === 'th' ? 'สัตว์เลี้ยงของคุณ' : 'Your Pet');
        const result = await GeminiPetService.analyzePetImage(
          base64,
          petName,
          petSpecies
        );
        clearTimeout(step1);
        clearTimeout(step2);

        setScanProgress(100);
        setScanStepText(lang === 'th' ? 'ประมวลผลสำเร็จ 100%' : 'Analysis Complete 100%');
        setAnalysisResult(result);
        setHasScanned(true);

        // Add to translation log
        onAddTranslationLog({
          id: `log_${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          petName,
          soundType: 'Body Cue',
          translatedText: result.speechBubbleEn,
          translatedTextTh: result.speechBubbleTh,
          mood: result.moodName.split('/')[0].trim(),
          confidence: result.moodScore,
        });

        // 3. Play Celebratory Magic Chime Sound!
        setTimeout(() => {
          SoundEffects.playMagicChime();
          if (petSpecies === 'dog') {
            SoundEffects.playBark();
          } else {
            SoundEffects.playMeow();
          }

          // Trigger Success Toast Notification!
          setToastNotification({
            show: true,
            title: lang === 'th' ? 'สแกนรูปภาพสำเร็จแล้ว! ✨🐾' : 'Pet Scan Complete! ✨🐾',
            description: lang === 'th'
              ? `ตรวจพบอารมณ์: ${result.moodName} (${result.moodScore}%) - "${result.speechBubbleTh}"`
              : `Mood Detected: ${result.moodName} (${result.moodScore}%) - "${result.speechBubbleEn}"`,
            moodScore: result.moodScore,
          });

          // Auto-hide toast after 5s
          setTimeout(() => {
            setToastNotification(null);
          }, 5000);
        }, 300);
      } catch (err) {
        console.error('Error analyzing image:', err);
      } finally {
        setTimeout(() => {
          setIsAnalyzing(false);
          setScanProgress(0);
        }, 600);
      }
    };
    reader.readAsDataURL(file);
  };

  // Capture snapshot from webcam to analyze
  const handleCaptureWebcam = async () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const base64 = canvas.toDataURL('image/jpeg');

    setUploadedImage(base64);
    setUseWebcam(false);
    setIsAnalyzing(true);
    setScanProgress(20);
    setScanStepText(lang === 'th' ? 'กำลังวิเคราะห์ภาพจากกล้องสด...' : 'Analyzing webcam feed...');
    SoundEffects.playCameraShutter();

    const petSpecies = activePet?.species || 'dog';
    const petName = activePet?.name || (lang === 'th' ? 'สัตว์เลี้ยงของคุณ' : 'Your Pet');

    try {
      const result = await GeminiPetService.analyzePetImage(base64, petName, petSpecies);
      setScanProgress(100);
      setAnalysisResult(result);
      setHasScanned(true);

      onAddTranslationLog({
        id: `log_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        petName,
        soundType: 'Body Cue',
        translatedText: result.speechBubbleEn,
        translatedTextTh: result.speechBubbleTh,
        mood: result.moodName.split('/')[0].trim(),
        confidence: result.moodScore,
      });

      SoundEffects.playMagicChime();
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
      setScanProgress(0);
    }
  };

  // Reset to empty state (0 data)
  const handleResetToEmpty = () => {
    SoundEffects.playPop();
    setUploadedImage(null);
    setUseWebcam(false);
    setAnalysisResult(null);
    setHasScanned(false);
    setIsListeningMic(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Toggle Microphone & analyze sound
  const toggleMicrophone = async () => {
    SoundEffects.playPop();
    const nextState = !isListeningMic;
    setIsListeningMic(nextState);

    if (nextState) {
      const petSpecies = activePet?.species || 'dog';
      const petName = activePet?.name || (lang === 'th' ? 'สัตว์เลี้ยงของคุณ' : 'Your Pet');

      if (petSpecies === 'dog') {
        SoundEffects.playBark();
      } else {
        SoundEffects.playMeow();
      }

      // Simulate listening and analyzing
      setTimeout(async () => {
        const result = await GeminiPetService.analyzePetSound(petSpecies, petName);
        setAnalysisResult(result);
        setHasScanned(true);
        setIsListeningMic(false);

        onAddTranslationLog({
          id: `log_${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          petName,
          soundType: petSpecies === 'dog' ? 'Barking' : 'Meowing',
          translatedText: result.speechBubbleEn,
          translatedTextTh: result.speechBubbleTh,
          mood: result.moodName.split('/')[0].trim(),
          confidence: result.moodScore,
        });

        SoundEffects.playMagicChime();
        setToastNotification({
          show: true,
          title: lang === 'th' ? 'ถอดรหัสเสียงร้องสำเร็จ! 🎙️' : 'Vocalization Decoded! 🎙️',
          description: lang === 'th'
            ? `ตรวจพบอารมณ์: ${result.moodName} (${result.moodScore}%) - "${result.speechBubbleTh}"`
            : `Mood: ${result.moodName} (${result.moodScore}%) - "${result.speechBubbleEn}"`,
          moodScore: result.moodScore,
        });
      }, 1500);
    }
  };

  // Speak speech bubble using TTS
  const handleSpeakSpeechBubble = () => {
    if (!analysisResult) return;
    setIsSpeaking(true);
    const textToSpeak = lang === 'th' ? analysisResult.speechBubbleTh : analysisResult.speechBubbleEn;
    SoundEffects.speakText(textToSpeak, lang);
    setTimeout(() => setIsSpeaking(false), 2500);
  };

  // Compute needle angle for speedometer gauge (0 to 100 maps to -90 deg to 90 deg)
  const score = analysisResult ? analysisResult.moodScore : 0;
  const needleRotation = (score / 100) * 180 - 90;

  // Waveform heights: flat baseline if not scanned and not listening
  const waveformHeights = analysisResult
    ? analysisResult.audioWaveform
    : [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4];

  return (
    <div className="relative max-w-6xl mx-auto px-4 py-6 space-y-6 select-none">
      {/* 3D Floating Props */}
      <div className="absolute top-8 right-6 text-2xl animate-float-3d opacity-45 pointer-events-none drop-shadow-md hidden md:block">
        ✨
      </div>
      <div className="absolute bottom-12 left-4 text-2xl animate-float-3d opacity-45 pointer-events-none drop-shadow-md hidden md:block" style={{ animationDelay: '1.8s' }}>
        🐾
      </div>

      {/* Toast Notification Alert with Glowing Emerald Card & Sound */}
      {toastNotification && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 max-w-md w-full animate-spring-up">
          <div className="glass-panel p-4 rounded-2xl border-2 border-emerald-400 bg-emerald-950/95 shadow-2xl shadow-emerald-950 flex items-start space-x-3 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-yellow-400/20 rounded-full blur-xl pointer-events-none" />

            <div className="p-2.5 rounded-xl bg-yellow-400 text-emerald-950 font-bold shrink-0 shadow-lg">
              <Sparkles className="w-5 h-5 fill-current animate-spin" style={{ animationDuration: '3s' }} />
            </div>

            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center space-x-2">
                <h4 className="font-game text-sm font-bold text-white tracking-wide">
                  {toastNotification.title}
                </h4>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-800 text-yellow-300 font-mono font-bold">
                  {toastNotification.moodScore}%
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 mt-1 leading-snug line-clamp-2">
                {toastNotification.description}
              </p>
            </div>

            <button
              onClick={() => setToastNotification(null)}
              className="text-emerald-300 hover:text-white p-1 rounded-lg hover:bg-emerald-800/40 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Box 1: Title with Staggered Spring-Bounce Entrance */}
      <div className="animate-spring-up stagger-1 text-center space-y-1">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-400/40 text-xs text-emerald-300 font-semibold mb-1 shadow-lg">
          <Eye className="w-3.5 h-3.5 text-emerald-400" />
          <span>{lang === 'th' ? 'ขั้นตอนที่ 3: ตรวจจับภาษากายและคลื่นเสียงสด' : 'Step 3: Live Posture & Voice Decoder'}</span>
        </div>
        <h1 className="font-game text-3xl sm:text-5xl font-black text-white uppercase tracking-wider drop-shadow-lg text-hero-3d">
          LIVE ANALYSIS
        </h1>
        <p className="text-xs sm:text-sm text-emerald-200 font-medium drop-shadow">
          {lang === 'th'
            ? 'ช่องว่างสำหรับแนบรูปภาพหรือเปิดกล้องสด ข้อมูลจะแสดงเมื่อคุณใส่รูปภาพหรือบันทึกเสียง'
            : 'Blank detection slot. Attach your pet photo or record audio to reveal real-time analysis.'}
        </p>
      </div>

      {/* Main Glassmorphic Container */}
      <div className="glass-panel p-5 sm:p-7 rounded-3xl border-emerald-400/40 shadow-2xl space-y-6 preserve-3d">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Visual Viewport with 3D AR Pose Overlay (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            {/* Box 2: 3D Holographic Camera Viewport / Empty Slot */}
            <Card3D depth={is3DMode ? 8 : 2} className="animate-spring-up stagger-2">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border-2 border-emerald-400/60 bg-black/85 shadow-2xl flex items-center justify-center group ring-2 ring-emerald-500/20 preserve-3d">
                {/* STATE A: WEBCAM IS ACTIVE */}
                {useWebcam && (
                  <div className="relative w-full h-full">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover transform -scale-x-100"
                    />
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30">
                      <button
                        onClick={handleCaptureWebcam}
                        className="px-4 py-2 rounded-xl bg-yellow-400 text-emerald-950 font-game font-bold text-xs btn-3d-yellow shadow-xl flex items-center space-x-1.5 cursor-pointer"
                      >
                        <Camera className="w-4 h-4" />
                        <span>{lang === 'th' ? 'ถ่ายภาพและวิเคราะห์ทันที' : 'Snap & Analyze Now'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* STATE B: IMAGE IS UPLOADED */}
                {!useWebcam && uploadedImage && (
                  <div className="relative w-full h-full">
                    <img
                      src={uploadedImage}
                      alt="Uploaded Pet Media"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* STATE C: 100% EMPTY BLANK PLACEHOLDER (0 DATA) */}
                {!useWebcam && !uploadedImage && (
                  <div className="flex flex-col items-center justify-center p-6 text-center space-y-4 max-w-md w-full">
                    <div className="w-20 h-20 rounded-3xl bg-emerald-950/80 border-2 border-dashed border-emerald-400/60 flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-300">
                      <ImageIcon className="w-10 h-10 text-emerald-400/80 animate-pulse" />
                    </div>

                    <div className="space-y-1">
                      <div className="inline-flex items-center space-x-1 text-[11px] font-mono font-bold text-yellow-300 uppercase px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40">
                        <span>● ช่องตรวจจับสด (ว่างเปล่า 0)</span>
                      </div>
                      <h3 className="font-game text-lg sm:text-xl font-bold text-white tracking-wide">
                        {lang === 'th' ? 'ยังไม่มีข้อมูลสัตว์เลี้ยง' : 'No Pet Media Uploaded Yet'}
                      </h3>
                      <p className="text-xs text-emerald-200/80 leading-relaxed max-w-sm">
                        {lang === 'th'
                          ? 'แนบรูปภาพสัตว์เลี้ยงของคุณ หรือเปิดกล้องสด เพื่อให้ระบบเริ่มสแกนภาษากายและถอดรหัสอารมณ์'
                          : 'Attach your pet’s photo or start live camera feed. Analysis will appear upon upload.'}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-game font-bold bg-yellow-400 text-emerald-950 btn-3d-yellow shadow-xl cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        <span>{lang === 'th' ? '📁 แนบรูปสัตว์เลี้ยง' : '📁 Upload Pet Photo'}</span>
                      </button>

                      <button
                        onClick={() => setUseWebcam(true)}
                        className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-900/80 border border-emerald-400/60 text-emerald-200 hover:bg-emerald-800 transition-all cursor-pointer shadow-lg"
                      >
                        <Camera className="w-4 h-4 text-emerald-400" />
                        <span>{lang === 'th' ? '📷 เปิดกล้องสด' : '📷 Open Camera'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 3D Perspective Ground Plane Grid */}
                <div
                  className="absolute inset-x-0 bottom-0 h-28 pointer-events-none opacity-20"
                  style={{
                    background: 'radial-gradient(ellipse at bottom, rgba(74, 222, 128, 0.4) 0%, transparent 70%)',
                    transform: 'perspective(400px) rotateX(60deg)',
                  }}
                />

                {/* Augmented Reality AI Tracking Wireframe Overlay (Only shown when image/webcam is present and scanned) */}
                {showWireframe && !isAnalyzing && hasScanned && (uploadedImage || useWebcam) && (
                  <div className="absolute inset-0 pointer-events-none select-none">
                    {/* Face Bounding Box with Corner Brackets & Z Depth */}
                    <div className="absolute top-[22%] left-[34%] w-[32%] h-[36%] border border-cyan-400/70 rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                      <span className="absolute -top-1 -left-1 w-3.5 h-3.5 border-t-2 border-l-2 border-white" />
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 border-t-2 border-r-2 border-white" />
                      <span className="absolute -bottom-1 -left-1 w-3.5 h-3.5 border-b-2 border-l-2 border-white" />
                      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 border-b-2 border-r-2 border-white" />

                      <div className="absolute -top-5 left-1 text-[10px] font-mono text-cyan-300 font-bold bg-black/75 px-1.5 rounded border border-cyan-500/40">
                        [3D_HEAD_TRACK: 98.7%]
                      </div>
                    </div>

                    {/* Skeletal Pose Lines */}
                    <svg className="absolute inset-0 w-full h-full opacity-85" viewBox="0 0 100 100">
                      <line x1="50" y1="36" x2="50" y2="52" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="1,1" />
                      <line x1="50" y1="52" x2="42" y2="82" stroke="#ffffff" strokeWidth="0.8" />
                      <line x1="50" y1="52" x2="58" y2="82" stroke="#ffffff" strokeWidth="0.8" />
                      <line x1="50" y1="52" x2="50" y2="72" stroke="#38bdf8" strokeWidth="0.8" />
                      <line x1="50" y1="72" x2="35" y2="76" stroke="#38bdf8" strokeWidth="1" />

                      <circle cx="50" cy="36" r="1.5" fill="#38bdf8" />
                      <circle cx="50" cy="52" r="1.5" fill="#4ade80" />
                      <circle cx="42" cy="82" r="1.5" fill="#facc15" />
                      <circle cx="58" cy="82" r="1.5" fill="#facc15" />
                      <circle cx="35" cy="76" r="2" fill="#ef4444" className="animate-ping" />
                    </svg>

                    {/* Telemetry HUD tags with 3D elevation */}
                    {analysisResult && (
                      <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-500/40 text-[10px] font-mono text-emerald-300 space-y-0.5 shadow-lg">
                        <div className="flex items-center space-x-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>AI POSE: {analysisResult.bodyLanguage.posture}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-yellow-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                          <span>TAIL WAG: {analysisResult.bodyLanguage.tail}</span>
                        </div>
                      </div>
                    )}

                    <div className="absolute top-3 right-3 bg-emerald-950/85 border border-emerald-400/50 text-[10px] font-mono text-yellow-300 px-2.5 py-1 rounded-full flex items-center space-x-1.5 shadow-lg">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>3D VISION · 60 FPS</span>
                    </div>
                  </div>
                )}

                {/* Holographic Laser Scanning Overlay during upload */}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-emerald-950/60 backdrop-blur-[2px] flex flex-col justify-between p-6 z-30 select-none">
                    <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_20px_#22d3ee,0_0_40px_#4ade80] animate-laser-scan pointer-events-none" />

                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="relative w-44 h-44 rounded-full border border-cyan-400/50 flex items-center justify-center animate-radar-spin">
                        <div className="w-32 h-32 rounded-full border border-emerald-400/60 border-dashed" />
                        <div className="absolute w-full h-[1px] bg-cyan-400/30" />
                        <div className="absolute h-full w-[1px] bg-cyan-400/30" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono text-cyan-300 font-bold bg-black/80 px-3 py-1.5 rounded-xl border border-cyan-500/40 backdrop-blur-md shadow-lg">
                      <span className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                        <span>AI MULTIMODAL 3D SCANNING...</span>
                      </span>
                      <span className="text-yellow-300">{scanProgress}%</span>
                    </div>

                    <div className="bg-black/85 backdrop-blur-md p-3.5 rounded-2xl border border-emerald-400/50 space-y-2 shadow-2xl">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-white font-game">{scanStepText}</span>
                        <span className="text-emerald-300 font-bold">{scanProgress}%</span>
                      </div>

                      <div className="w-full bg-emerald-950 h-2.5 rounded-full overflow-hidden border border-emerald-500/30">
                        <div
                          className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-yellow-300 h-full transition-all duration-300 rounded-full"
                          style={{ width: `${scanProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card3D>

            {/* Box 3: Controls Bar with Staggered Spring Bounce */}
            <div className="animate-spring-up stagger-3 flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setUseWebcam(!useWebcam)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    useWebcam
                      ? 'bg-rose-900/70 border-rose-400 text-rose-200'
                      : 'bg-emerald-900/50 border-emerald-500/30 text-emerald-200 hover:bg-emerald-800/60'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{useWebcam ? (lang === 'th' ? 'ปิดกล้อง' : 'Stop Cam') : (lang === 'th' ? 'เปิดกล้องสด' : 'Live Camera')}</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-yellow-400 text-emerald-950 btn-3d-yellow shadow-md cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{lang === 'th' ? 'แนบรูปภาพสัตว์เลี้ยง' : 'Attach Pet Photo'}</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {(uploadedImage || useWebcam || hasScanned) && (
                  <button
                    onClick={handleResetToEmpty}
                    className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-mono bg-neutral-900/80 border border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800 cursor-pointer"
                    title="Reset to 0"
                  >
                    <RotateCcw className="w-3 h-3 text-yellow-400" />
                    <span>{lang === 'th' ? 'ล้างเป็น 0' : 'Reset (0)'}</span>
                  </button>
                )}

                <button
                  onClick={() => setShowWireframe(!showWireframe)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-mono border transition-all cursor-pointer ${
                    showWireframe
                      ? 'bg-cyan-950/70 border-cyan-400/60 text-cyan-300'
                      : 'bg-neutral-900 border-neutral-700 text-neutral-400'
                  }`}
                  title="Toggle AR Pose Skeleton"
                >
                  AI Wireframe: {showWireframe ? 'ON' : 'OFF'}
                </button>

                <button
                  onClick={() => setIs3DMode(!is3DMode)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-mono border transition-all cursor-pointer ${
                    is3DMode
                      ? 'bg-emerald-900/70 border-emerald-400 text-yellow-300 font-bold'
                      : 'bg-neutral-900 border-neutral-700 text-neutral-400'
                  }`}
                  title="Toggle 3D Viewport Tilt"
                >
                  3D Tilt: {is3DMode ? 'ON 🌀' : 'OFF'}
                </button>
              </div>

              {/* Status indicator */}
              <div className="flex items-center space-x-1.5 text-xs text-emerald-300 font-mono">
                <span className={`w-2 h-2 rounded-full ${hasScanned ? 'bg-emerald-400' : 'bg-neutral-500'}`} />
                <span>{hasScanned ? (lang === 'th' ? 'วิเคราะห์แล้ว' : 'Scanned') : (lang === 'th' ? 'สถานะ: ว่างเปล่า 0' : 'State: Empty (0)')}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Audio Analysis + Mood Gauge + Speech Bubble (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Box 4: 3D Audio Bark Analysis Waveform */}
            <Card3D depth={7} className="animate-spring-up stagger-4">
              <div className="glass-panel p-4.5 rounded-2xl border-emerald-500/30 space-y-2.5 shadow-xl preserve-3d">
                <div className="flex items-center justify-between translate-z-20">
                  <h3 className="text-xs font-game font-bold text-emerald-200 tracking-wider">
                    3D Acoustic Waveform Analyzer
                  </h3>
                  <button
                    onClick={toggleMicrophone}
                    className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isListeningMic
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-emerald-900/60 text-emerald-300 hover:bg-emerald-800'
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>{isListeningMic ? (lang === 'th' ? 'กำลังบันทึก...' : 'Listening...') : (lang === 'th' ? 'บันทึกเสียงร้อง' : 'Record Sound')}</span>
                  </button>
                </div>

                {/* Pulsing Acoustic Waveform in 3D Perspective */}
                <div
                  className="h-16 bg-black/70 rounded-xl border border-emerald-500/25 px-3 flex items-center justify-between space-x-1 shadow-inner relative overflow-hidden"
                  style={{ perspective: '300px' }}
                >
                  {/* Subtle 3D floor reflection */}
                  <div className="absolute inset-x-0 bottom-0 h-4 bg-emerald-500/10 pointer-events-none" />

                  {waveformHeights.map((height, i) => (
                    <div
                      key={i}
                      className={`w-1.5 sm:w-2 rounded-full transition-all duration-300 ${
                        hasScanned || isListeningMic
                          ? 'bg-gradient-to-t from-cyan-400 via-emerald-300 to-yellow-300 shadow-[0_0_10px_rgba(74,222,128,0.6)]'
                          : 'bg-emerald-800/40'
                      }`}
                      style={{
                        height: isListeningMic
                          ? `${Math.max(15, (height * (0.8 + Math.random() * 0.4)) * 0.55)}px`
                          : hasScanned
                          ? `${height * 0.55}px`
                          : '4px',
                        animation: isListeningMic ? `pulse 0.5s ease infinite alternate ${i * 0.05}s` : 'none',
                        transform: 'translateZ(15px)',
                      }}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[10px] font-mono text-emerald-400/80 px-1">
                  <span>0 Hz</span>
                  <span>{hasScanned || isListeningMic ? 'Acoustic Frequency Spectrum' : (lang === 'th' ? 'รอรับสัญญาณเสียง (ว่างเปล่า)' : 'No Audio Input')}</span>
                  <span>12 kHz</span>
                </div>
              </div>
            </Card3D>

            {/* Box 5: 3D Speedometer Mood Gauge */}
            <Card3D depth={7} className="animate-spring-up stagger-5">
              <div className="glass-panel p-4.5 rounded-2xl border-emerald-500/30 text-center space-y-2 shadow-xl preserve-3d">
                <div className="flex items-center justify-between px-1 translate-z-20">
                  <span className="text-xs font-game font-bold text-white tracking-wide">
                    {analysisResult ? `${analysisResult.moodName} (${analysisResult.moodScore}%)` : (lang === 'th' ? 'ระดับอารมณ์: 0%' : 'Mood Level: 0%')}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-900/80 text-emerald-300 border border-emerald-500/30">
                    {hasScanned ? 'Confidence 96%' : 'Confidence 0%'}
                  </span>
                </div>

                {/* Custom SVG Speedometer Meter with 3D Bevel & Needle Shadow */}
                <div className="relative flex items-center justify-center pt-2">
                  <svg width="200" height="110" viewBox="0 0 200 110" className="overflow-visible drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]">
                    <defs>
                      <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#4ade80" />
                        <stop offset="30%" stopColor="#facc15" />
                        <stop offset="70%" stopColor="#fb923c" />
                        <stop offset="100%" stopColor="#f87171" />
                      </linearGradient>
                      <filter id="needleGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.8"/>
                      </filter>
                    </defs>

                    {/* Semicircle Track */}
                    <path
                      d="M 20 100 A 80 80 0 0 1 180 100"
                      fill="none"
                      stroke="rgba(16, 185, 129, 0.25)"
                      strokeWidth="16"
                      strokeLinecap="round"
                    />

                    {/* Semicircle Active Color */}
                    <path
                      d="M 20 100 A 80 80 0 0 1 180 100"
                      fill="none"
                      stroke="url(#gaugeGradient)"
                      strokeWidth="12"
                      strokeLinecap="round"
                    />

                    {/* Needle Pointer with 3D Depth Shadow */}
                    <g
                      transform={`translate(100, 100) rotate(${needleRotation})`}
                      className="transition-transform duration-700 ease-out"
                      filter="url(#needleGlow)"
                    >
                      <line x1="0" y1="0" x2="0" y2="-72" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
                      <line x1="0" y1="0" x2="0" y2="-68" stroke="#facc15" strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx="0" cy="0" r="8" fill="#ffffff" />
                      <circle cx="0" cy="0" r="4" fill="#15803d" />
                    </g>
                  </svg>
                </div>

                <div className="flex justify-between text-[11px] font-bold text-emerald-300 px-4">
                  <span>0% (Empty)</span>
                  <span className="text-yellow-300 font-game">{hasScanned && analysisResult ? `${analysisResult.moodScore}%` : '0%'}</span>
                  <span>100%</span>
                </div>
              </div>
            </Card3D>

            {/* Box 6: 3D Speech Bubble Pet Thought Translation with 3D Bobbing */}
            <Card3D depth={8} className="animate-spring-up stagger-6 animate-float-3d">
              <div className="bg-white text-emerald-950 p-4 sm:p-5 rounded-3xl shadow-2xl relative border-2 border-emerald-300 space-y-2 preserve-3d">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-emerald-700 translate-z-20">
                  <span className="flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                    <span>{lang === 'th' ? 'ความคิดของสัตว์เลี้ยง (AI Thought)' : "Pet's Inner Voice"}</span>
                  </span>
                  {hasScanned && analysisResult && (
                    <button
                      onClick={handleSpeakSpeechBubble}
                      className="flex items-center space-x-1 text-emerald-800 hover:text-emerald-950 font-game text-xs font-bold cursor-pointer"
                      title="Speak Out Loud"
                    >
                      <Volume2 className="w-4 h-4 text-emerald-600" />
                      <span>{isSpeaking ? 'Playing...' : (lang === 'th' ? 'ฟังเสียงพูด' : 'Listen')}</span>
                    </button>
                  )}
                </div>

                {hasScanned && analysisResult ? (
                  <p className="font-game text-base sm:text-lg font-bold text-emerald-950 leading-snug translate-z-10">
                    "{lang === 'th' ? analysisResult.speechBubbleTh : analysisResult.speechBubbleEn}"
                  </p>
                ) : (
                  <div className="py-2 text-center space-y-1">
                    <p className="font-game text-sm sm:text-base font-bold text-emerald-800/80 italic translate-z-10">
                      {lang === 'th'
                        ? '💭 รอคุณแนบรูปภาพหรือบันทึกเสียงสัตว์เลี้ยง...'
                        : '💭 Waiting for pet photo or sound input...'}
                    </p>
                    <p className="text-[11px] text-emerald-600 font-medium">
                      {lang === 'th'
                        ? 'เมื่อใส่ข้อมูล ระบบจะถอดรหัสความคิดและอารมณ์ออกมาเป็นประโยคที่นี่'
                        : 'When you upload an image or audio, thoughts will be decoded here.'}
                    </p>
                  </div>
                )}

                {/* 3D Bubble Triangle pointer */}
                <div className="absolute -top-3 left-8 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[14px] border-b-white" />
              </div>
            </Card3D>
          </div>
        </div>

        {/* Box 7: Pet Care Tip Card */}
        <Card3D depth={6} className="animate-spring-up stagger-7">
          <div className="glass-panel p-4.5 rounded-2xl border-emerald-400/40 bg-emerald-900/50 flex items-start space-x-3.5 shadow-xl preserve-3d">
            <div className="p-2.5 rounded-xl bg-yellow-400 text-emerald-950 font-bold shrink-0 mt-0.5 shadow-lg font-game text-base translate-z-20">
              🐾
            </div>
            <div className="space-y-0.5 translate-z-10">
              <h4 className="text-xs font-game font-bold text-yellow-300 uppercase tracking-wide">
                {lang === 'th' ? 'คำแนะนำในการดูแลสัตว์เลี้ยง (Pet Care Tip)' : 'Pet Care Tip'}
              </h4>
              <p className="text-xs text-white leading-relaxed font-medium">
                {hasScanned && analysisResult
                  ? lang === 'th' ? analysisResult.careTipTh : analysisResult.careTipEn
                  : lang === 'th'
                  ? '💡 คำแนะนำเฉพาะสำหรับสัตว์เลี้ยงของคุณจะปรากฏที่นี่หลังทำการตรวจจับภาษากายหรือเสียงร้อง'
                  : '💡 Tailored pet care advice will appear here after analyzing posture or voice cues.'}
              </p>
            </div>
          </div>
        </Card3D>
      </div>
    </div>
  );
};
