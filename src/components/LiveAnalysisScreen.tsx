import React, { useState, useEffect, useRef } from 'react';
import { Camera, Upload, Mic, Volume2, RotateCcw, Image as ImageIcon, X } from 'lucide-react';
import { PetProfile, VisualAnalysisResult, TranslationLog } from '../types/pet';
import { GeminiPetService } from '../services/geminiPetService';
import { SoundEffects } from '../services/soundEffects';
import { FlowNavigation, ScreenId } from './FlowNavigation';

interface LiveAnalysisScreenProps {
  activePet: PetProfile | null;
  lang: 'en' | 'th';
  onAddTranslationLog: (log: TranslationLog) => void;
  onNavigate?: (screen: ScreenId) => void;
}

export const LiveAnalysisScreen: React.FC<LiveAnalysisScreenProps> = ({
  activePet,
  lang,
  onAddTranslationLog,
  onNavigate,
}) => {
  // Blank 0-state until user supplies media or audio
  const [analysisResult, setAnalysisResult] = useState<VisualAnalysisResult | null>(null);
  const [hasScanned, setHasScanned] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStepText, setScanStepText] = useState('');
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [useWebcam, setUseWebcam] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showOverlayGuides, setShowOverlayGuides] = useState(true);
  const [toastNotification, setToastNotification] = useState<{
    title: string;
    description: string;
  } | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
          console.warn('Webcam unavailable:', err);
          setUseWebcam(false);
        });
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, [useWebcam]);

  const showToast = (title: string, description: string) => {
    setToastNotification({ title, description });
    setTimeout(() => setToastNotification(null), 4500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    SoundEffects.playCameraShutter();
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setUploadedImage(base64);
      setUseWebcam(false);
      setIsAnalyzing(true);
      setScanProgress(25);
      setScanStepText(lang === 'th' ? 'กำลังวิเคราะห์ตำแหน่งใบหน้าและดวงตา...' : 'Analyzing facial orientation...');

      const step1 = setTimeout(() => {
        setScanProgress(65);
        setScanStepText(lang === 'th' ? 'ประเมินท่าทาง ใบหู และหาง...' : 'Evaluating posture and tail position...');
      }, 450);

      try {
        const petSpecies = activePet?.species || 'dog';
        const petName = activePet?.name || (lang === 'th' ? 'สัตว์เลี้ยง' : 'Pet');
        const result = await GeminiPetService.analyzePetImage(base64, petName, petSpecies);

        clearTimeout(step1);
        setScanProgress(100);
        setAnalysisResult(result);
        setHasScanned(true);

        onAddTranslationLog({
          id: `log_${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          petName,
          soundType: 'Body Cue',
          translatedText: result.speechBubbleEn,
          translatedTextTh: result.speechBubbleTh,
          mood: result.moodName.split('/')[0].trim(),
          confidence: result.moodScore,
        });

        SoundEffects.playMagicChime();
        showToast(
          lang === 'th' ? 'วิเคราะห์ภาพสำเร็จ' : 'Visual Analysis Complete',
          `${result.moodName} · ${result.moodScore}%`
        );
      } catch (err) {
        console.error('Error analyzing image:', err);
      } finally {
        setTimeout(() => {
          setIsAnalyzing(false);
          setScanProgress(0);
        }, 350);
      }
    };
    reader.readAsDataURL(file);
  };

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
    setScanProgress(35);
    setScanStepText(lang === 'th' ? 'กำลังวิเคราะห์ภาพจากกล้อง...' : 'Analyzing captured frame...');
    SoundEffects.playCameraShutter();

    const petSpecies = activePet?.species || 'dog';
    const petName = activePet?.name || (lang === 'th' ? 'สัตว์เลี้ยง' : 'Pet');

    try {
      const result = await GeminiPetService.analyzePetImage(base64, petName, petSpecies);
      setScanProgress(100);
      setAnalysisResult(result);
      setHasScanned(true);

      onAddTranslationLog({
        id: `log_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        petName,
        soundType: 'Body Cue',
        translatedText: result.speechBubbleEn,
        translatedTextTh: result.speechBubbleTh,
        mood: result.moodName.split('/')[0].trim(),
        confidence: result.moodScore,
      });

      SoundEffects.playMagicChime();
      showToast(
        lang === 'th' ? 'วิเคราะห์ภาพจากกล้องสำเร็จ' : 'Capture Analyzed',
        `${result.moodName} · ${result.moodScore}%`
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
      setScanProgress(0);
    }
  };

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

  const toggleMicrophone = async () => {
    SoundEffects.playPop();
    const nextState = !isListeningMic;
    setIsListeningMic(nextState);

    if (nextState) {
      const petSpecies = activePet?.species || 'dog';
      const petName = activePet?.name || (lang === 'th' ? 'สัตว์เลี้ยง' : 'Pet');

      setTimeout(async () => {
        const result = await GeminiPetService.analyzePetSound(petSpecies, petName);
        setAnalysisResult(result);
        setHasScanned(true);
        setIsListeningMic(false);

        onAddTranslationLog({
          id: `log_${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          petName,
          soundType: petSpecies === 'dog' ? 'Barking' : 'Meowing',
          translatedText: result.speechBubbleEn,
          translatedTextTh: result.speechBubbleTh,
          mood: result.moodName.split('/')[0].trim(),
          confidence: result.moodScore,
        });

        SoundEffects.playMagicChime();
        showToast(
          lang === 'th' ? 'ถอดรหัสเสียงร้องสำเร็จ' : 'Audio Decoded',
          `${result.moodName} · ${result.moodScore}%`
        );
      }, 1300);
    }
  };

  const handleSpeakSpeechBubble = () => {
    if (!analysisResult) return;
    setIsSpeaking(true);
    const textToSpeak = lang === 'th' ? analysisResult.speechBubbleTh : analysisResult.speechBubbleEn;
    SoundEffects.speakText(textToSpeak, lang);
    setTimeout(() => setIsSpeaking(false), 2400);
  };

  const score = analysisResult ? analysisResult.moodScore : 0;
  const waveformHeights = analysisResult
    ? analysisResult.audioWaveform
    : [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fade-in">
      {/* Subtle Toast Notification */}
      {toastNotification && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-full animate-fade-in">
          <div className="rounded-lg border border-white/[0.12] bg-[#171C23] p-4 shadow-xl flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-100">{toastNotification.title}</p>
              <p className="text-xs text-slate-400 mt-0.5 font-mono tabular-nums">
                {toastNotification.description}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setToastNotification(null)}
              className="text-slate-400 hover:text-slate-200 p-1 cursor-pointer"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-[#4BA393]">
            {lang === 'th' ? 'ขั้นตอนที่ 3 · วิเคราะห์สด' : 'Step 3 · Live Analysis Studio'}
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-slate-100 tracking-tight">
            {lang === 'th' ? 'แปลภาษากายและเสียงร้อง' : 'Visual & Acoustic Mood Decoder'}
          </h1>
          <p className="text-sm text-slate-400">
            {activePet
              ? lang === 'th'
                ? `กำลังวิเคราะห์สำหรับ: ${activePet.name}`
                : `Active profile: ${activePet.name}`
              : lang === 'th'
              ? 'แนบภาพถ่าย เปิดกล้อง หรือบันทึกเสียงร้องเพื่อเริ่มประมวลผล'
              : 'Upload a pet photo, enable live camera, or record audio to begin.'}
          </p>
        </div>

        {(uploadedImage || useWebcam || hasScanned) && (
          <button
            type="button"
            onClick={handleResetToEmpty}
            className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[38px] rounded-lg border border-white/[0.1] bg-[#12161B] hover:bg-[#171C23] text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'th' ? 'ล้างข้อมูลเริ่มต้น' : 'Reset'}</span>
          </button>
        )}
      </div>

      {/* Main 2-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Visual Viewport (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-white/[0.08] bg-[#12161B] flex items-center justify-center">
            {useWebcam && (
              <div className="relative w-full h-full">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                  <button
                    type="button"
                    onClick={handleCaptureWebcam}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#E6EBF0] hover:bg-white text-[#0B0D10] text-xs font-semibold shadow-lg cursor-pointer whitespace-nowrap"
                  >
                    <Camera className="w-4 h-4" />
                    <span>{lang === 'th' ? 'ถ่ายภาพและวิเคราะห์' : 'Capture & Analyze'}</span>
                  </button>
                </div>
              </div>
            )}

            {!useWebcam && uploadedImage && (
              <img
                src={uploadedImage}
                alt="Uploaded pet"
                className="w-full h-full object-cover"
              />
            )}

            {/* Empty 0-State */}
            {!useWebcam && !uploadedImage && (
              <div className="p-8 text-center flex flex-col items-center space-y-4 max-w-sm">
                <div className="w-12 h-12 rounded-xl bg-[#171C23] border border-white/[0.08] flex items-center justify-center text-slate-400">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h2 className="font-display text-base font-medium text-slate-200">
                    {lang === 'th' ? 'ยังไม่มีภาพสำหรับวิเคราะห์' : 'No Media Loaded'}
                  </h2>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {lang === 'th'
                      ? 'อัปโหลดภาพถ่ายสัตว์เลี้ยงของคุณ หรือเปิดกล้องเพื่อสแกนท่าทาง'
                      : 'Upload a photo of your pet or use your camera for visual assessment.'}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[40px] rounded-lg bg-[#3D8B7D] hover:bg-[#4BA393] text-white text-xs font-medium transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{lang === 'th' ? 'อัปโหลดรูปภาพ' : 'Upload Photo'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUseWebcam(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[40px] rounded-lg border border-white/[0.1] bg-[#171C23] hover:bg-[#1E252E] text-slate-200 text-xs font-medium transition-colors cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{lang === 'th' ? 'เปิดกล้องสด' : 'Open Camera'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Minimal Architectural Posture Overlay */}
            {showOverlayGuides && !isAnalyzing && hasScanned && uploadedImage && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[20%] left-[32%] w-[36%] h-[42%] border border-white/30 rounded-lg">
                  <span className="absolute -top-0.5 -left-0.5 w-3 h-3 border-t-2 border-l-2 border-[#4BA393]" />
                  <span className="absolute -top-0.5 -right-0.5 w-3 h-3 border-t-2 border-r-2 border-[#4BA393]" />
                  <span className="absolute -bottom-0.5 -left-0.5 w-3 h-3 border-b-2 border-l-2 border-[#4BA393]" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 border-b-2 border-r-2 border-[#4BA393]" />
                </div>
              </div>
            )}

            {/* Clean Progress Overlay during Scan */}
            {isAnalyzing && (
              <div className="absolute inset-0 bg-[#0B0D10]/75 backdrop-blur-xs flex flex-col justify-end p-6 z-20">
                <div className="absolute left-0 right-0 h-[1px] bg-[#4BA393] animate-scan-line pointer-events-none" />
                <div className="rounded-lg bg-[#12161B] border border-white/[0.1] p-4 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-200 font-medium">{scanStepText}</span>
                    <span className="font-mono tabular-nums text-slate-300">{scanProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                    <div
                      className="h-full bg-[#4BA393] transition-all duration-300"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Viewport Controls Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[38px] rounded-lg border border-white/[0.1] bg-[#12161B] hover:bg-[#171C23] text-xs font-medium text-slate-200 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-slate-400" />
                <span>{lang === 'th' ? 'เลือกไฟล์ภาพ' : 'Choose Photo'}</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => setUseWebcam(!useWebcam)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 min-h-[38px] rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                  useWebcam
                    ? 'border-rose-500/40 bg-rose-950/30 text-rose-300'
                    : 'border-white/[0.1] bg-[#12161B] hover:bg-[#171C23] text-slate-200'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{useWebcam ? (lang === 'th' ? 'ปิดกล้อง' : 'Stop Camera') : (lang === 'th' ? 'กล้องสด' : 'Camera')}</span>
              </button>

              {hasScanned && uploadedImage && (
                <button
                  type="button"
                  onClick={() => setShowOverlayGuides(!showOverlayGuides)}
                  className="px-3 py-2 min-h-[38px] rounded-lg border border-white/[0.1] bg-[#12161B] hover:bg-[#171C23] text-xs font-medium text-slate-300 transition-colors cursor-pointer"
                >
                  {lang === 'th'
                    ? `เส้นไกด์: ${showOverlayGuides ? 'เปิด' : 'ปิด'}`
                    : `Guides: ${showOverlayGuides ? 'On' : 'Off'}`}
                </button>
              )}
            </div>

            <span className="text-xs text-slate-500 font-mono tabular-nums">
              {hasScanned ? (lang === 'th' ? 'วิเคราะห์แล้ว' : 'Completed') : (lang === 'th' ? 'สถานะ: รอข้อมูล' : 'Idle · 0')}
            </span>
          </div>
        </div>

        {/* Right: Structured Readout (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Card 1: Audio Input & Mood Score */}
          <div className="rounded-xl border border-white/[0.08] bg-[#12161B] p-5 space-y-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-sm font-semibold text-slate-100">
                  {lang === 'th' ? 'ผลประเมินอารมณ์และเสียง' : 'Mood & Acoustic Index'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {analysisResult
                    ? analysisResult.moodName
                    : lang === 'th' ? 'ยังไม่มีข้อมูลจากการสแกน' : 'Awaiting input'}
                </p>
              </div>

              <button
                type="button"
                onClick={toggleMicrophone}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[38px] rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  isListeningMic
                    ? 'bg-rose-600 text-white'
                    : 'border border-white/[0.1] bg-[#171C23] hover:bg-[#1F2630] text-slate-200'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>
                  {isListeningMic
                    ? lang === 'th' ? 'กำลังฟัง...' : 'Listening...'
                    : lang === 'th' ? 'บันทึกเสียงร้อง' : 'Record Sound'}
                </span>
              </button>
            </div>

            {/* Linear Score Bar */}
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-400">
                  {lang === 'th' ? 'ดัชนีอารมณ์' : 'Mood Score'}
                </span>
                <span className="font-mono text-2xl font-semibold text-slate-100 tabular-nums">
                  {score}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#0B0D10] overflow-hidden border border-white/[0.06]">
                <div
                  className="h-full bg-[#4BA393] transition-all duration-500"
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>

            {/* Minimal Acoustic Frequency Bars */}
            <div className="pt-3 border-t border-white/[0.06] space-y-2">
              <div className="h-12 rounded-lg bg-[#0B0D10] border border-white/[0.06] px-3 flex items-center justify-between gap-1.5">
                {waveformHeights.map((height, idx) => (
                  <div
                    key={idx}
                    className={`flex-1 rounded-sm transition-all duration-300 ${
                      hasScanned || isListeningMic ? 'bg-[#4BA393]' : 'bg-white/[0.1]'
                    }`}
                    style={{
                      height: isListeningMic
                        ? `${Math.max(18, ((idx * 17) % 60) + 25)}%`
                        : hasScanned
                        ? `${Math.max(18, height * 0.75)}%`
                        : '4px',
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-between text-[11px] font-mono text-slate-500 tabular-nums">
                <span>0 Hz</span>
                <span>
                  {isListeningMic
                    ? lang === 'th' ? 'กำลังรับสัญญาณเสียง' : 'Capturing'
                    : hasScanned
                    ? lang === 'th' ? 'สเปกตรัมเสียงร้อง' : 'Frequency Profile'
                    : lang === 'th' ? 'ไม่มีสัญญาณ' : 'Silent'}
                </span>
                <span>12 kHz</span>
              </div>
            </div>
          </div>

          {/* Card 2: Translated Inner Thought */}
          <div className="rounded-xl border border-white/[0.08] bg-[#12161B] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">
                {lang === 'th' ? 'คำแปลความคิดสัตว์เลี้ยง' : 'Translated Expression'}
              </span>
              {hasScanned && analysisResult && (
                <button
                  type="button"
                  onClick={handleSpeakSpeechBubble}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#4BA393] hover:text-[#6AC2B2] cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isSpeaking ? (lang === 'th' ? 'กำลังเล่น...' : 'Playing...') : (lang === 'th' ? 'ฟังเสียง' : 'Listen')}</span>
                </button>
              )}
            </div>

            {hasScanned && analysisResult ? (
              <p className="text-base font-medium text-slate-100 leading-relaxed">
                “{lang === 'th' ? analysisResult.speechBubbleTh : analysisResult.speechBubbleEn}”
              </p>
            ) : (
              <p className="text-sm text-slate-500">
                {lang === 'th'
                  ? 'ผลการแปลความหมายจะปรากฏที่นี่หลังจากอัปโหลดภาพหรือบันทึกเสียง'
                  : 'Translation output will appear once an image or sound sample is analyzed.'}
              </p>
            )}
          </div>

          {/* Card 3: Body Language & Care Guidance */}
          <div className="rounded-xl border border-white/[0.08] bg-[#12161B] p-5 space-y-4">
            <h3 className="font-display text-sm font-semibold text-slate-100">
              {lang === 'th' ? 'รายละเอียดภาษากายและคำแนะนำ' : 'Posture Cues & Care Guidance'}
            </h3>

            {hasScanned && analysisResult ? (
              <>
                <dl className="divide-y divide-white/[0.06] text-xs">
                  <div className="py-2 flex justify-between gap-4">
                    <dt className="text-slate-400 shrink-0">{lang === 'th' ? 'ใบหู' : 'Ears'}</dt>
                    <dd className="text-slate-200 text-right">{analysisResult.bodyLanguage.ears}</dd>
                  </div>
                  <div className="py-2 flex justify-between gap-4">
                    <dt className="text-slate-400 shrink-0">{lang === 'th' ? 'หาง' : 'Tail'}</dt>
                    <dd className="text-slate-200 text-right">{analysisResult.bodyLanguage.tail}</dd>
                  </div>
                  <div className="py-2 flex justify-between gap-4">
                    <dt className="text-slate-400 shrink-0">{lang === 'th' ? 'ท่าทาง' : 'Posture'}</dt>
                    <dd className="text-slate-200 text-right">{analysisResult.bodyLanguage.posture}</dd>
                  </div>
                  <div className="py-2 flex justify-between gap-4">
                    <dt className="text-slate-400 shrink-0">{lang === 'th' ? 'แววตา' : 'Eyes'}</dt>
                    <dd className="text-slate-200 text-right">{analysisResult.bodyLanguage.eyes}</dd>
                  </div>
                </dl>

                <div className="pt-3 border-t border-white/[0.08]">
                  <p className="text-xs font-medium text-[#4BA393] mb-1">
                    {lang === 'th' ? 'คำแนะนำการดูแล' : 'Care Recommendation'}
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {lang === 'th' ? analysisResult.careTipTh : analysisResult.careTipEn}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-xs text-slate-500 leading-relaxed">
                {lang === 'th'
                  ? 'ยังไม่มีข้อมูลท่าทาง (0 รายการ)'
                  : 'No behavioral cue breakdown recorded yet.'}
              </p>
            )}
          </div>
        </div>
      </div>

      {onNavigate && (
        <FlowNavigation
          currentScreen="analysis"
          onNavigate={onNavigate}
          lang={lang}
        />
      )}
    </div>
  );
};
