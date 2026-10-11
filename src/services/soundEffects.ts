/**
 * Web Audio API synthesizer for adorable pet sounds, footsteps, camera, and magical chimes
 */

class SoundEffectsService {
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = false;

  private getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Cute Dog Bark sound
  public playBark() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      const now = ctx.currentTime;

      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.12);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);

      setTimeout(() => {
        if (this.isMuted) return;
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'triangle';
        const now2 = ctx.currentTime;
        osc2.frequency.setValueAtTime(540, now2);
        osc2.frequency.exponentialRampToValueAtTime(300, now2 + 0.14);
        gain2.gain.setValueAtTime(0.35, now2);
        gain2.gain.exponentialRampToValueAtTime(0.01, now2 + 0.16);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now2);
        osc2.stop(now2 + 0.17);
      }, 130);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // Cute Cat Meow sound
  public playMeow() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const now = ctx.currentTime;

      osc.frequency.setValueAtTime(620, now);
      osc.frequency.linearRampToValueAtTime(880, now + 0.18);
      osc.frequency.exponentialRampToValueAtTime(450, now + 0.45);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.48);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch (e) {
      console.warn('Meow audio error:', e);
    }
  }

  // Purring sound effect
  public playPurr() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(55, now);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.62);
    } catch (e) {
      console.warn('Purr audio error:', e);
    }
  }

  // UI button click / tap sound
  public playPop() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.08);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {}
  }

  // Pet scampering / running footsteps sound (patter patter patter)
  public playFootstepsPatter(count = 4) {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      for (let i = 0; i < count; i++) {
        const time = now + i * 0.08;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // light wooden tap
        osc.type = 'sine';
        osc.frequency.setValueAtTime(700 + (i % 2) * 120, time);
        osc.frequency.exponentialRampToValueAtTime(350, time + 0.04);

        gain.gain.setValueAtTime(0.18, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + 0.05);
      }
    } catch (e) {}
  }

  // Camera shutter click when image is captured / uploaded
  public playCameraShutter() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // 1. Shutter open click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.07);

      // 2. Shutter close click
      setTimeout(() => {
        if (this.isMuted) return;
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        const now2 = ctx.currentTime;
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(900, now2);
        osc2.frequency.exponentialRampToValueAtTime(180, now2 + 0.06);
        gain2.gain.setValueAtTime(0.25, now2);
        gain2.gain.exponentialRampToValueAtTime(0.01, now2 + 0.07);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now2);
        osc2.stop(now2 + 0.08);
      }, 70);
    } catch (e) {}
  }

  // Scanning radar laser sound
  public playScanningLaser() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.linearRampToValueAtTime(1250, now + 0.35);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.02, now + 0.38);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) {}
  }

  // Sparkling Magical Scan Success Chime (Celebratory arpeggio)
  public playMagicChime() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Chord frequencies: C6 (1046Hz), E6 (1318Hz), G6 (1567Hz), C7 (2093Hz)
      const freqs = [1046, 1318, 1567, 2093];

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const noteTime = now + idx * 0.09;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.22, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.48);
      });
    } catch (e) {}
  }

  // Ferocious 3D Lion Roar & Snap Bite sound effect!
  public playLionRoarBite() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // 1. Deep guttural lion throat rumble (sawtooth low freq sweep)
      const rumbleOsc = ctx.createOscillator();
      const rumbleGain = ctx.createGain();
      rumbleOsc.type = 'sawtooth';
      rumbleOsc.frequency.setValueAtTime(140, now);
      rumbleOsc.frequency.linearRampToValueAtTime(75, now + 0.35);
      rumbleOsc.frequency.linearRampToValueAtTime(50, now + 0.7);

      rumbleGain.gain.setValueAtTime(0.01, now);
      rumbleGain.gain.linearRampToValueAtTime(0.38, now + 0.12);
      rumbleGain.gain.exponentialRampToValueAtTime(0.02, now + 0.75);

      rumbleOsc.connect(rumbleGain);
      rumbleGain.connect(ctx.destination);
      rumbleOsc.start(now);
      rumbleOsc.stop(now + 0.78);

      // 2. Powerful resonant roar roar surge
      const roarOsc = ctx.createOscillator();
      const roarGain = ctx.createGain();
      roarOsc.type = 'triangle';
      roarOsc.frequency.setValueAtTime(280, now + 0.05);
      roarOsc.frequency.linearRampToValueAtTime(180, now + 0.28);
      roarOsc.frequency.exponentialRampToValueAtTime(80, now + 0.6);

      roarGain.gain.setValueAtTime(0.01, now + 0.05);
      roarGain.gain.linearRampToValueAtTime(0.32, now + 0.2);
      roarGain.gain.exponentialRampToValueAtTime(0.01, now + 0.65);

      roarOsc.connect(roarGain);
      roarGain.connect(ctx.destination);
      roarOsc.start(now + 0.05);
      roarOsc.stop(now + 0.7);

      // 3. Sharp Jaw Snap / Bite Clack at peak (t=0.38s)
      setTimeout(() => {
        if (this.isMuted) return;
        const snapCtx = this.getAudioContext();
        const snapNow = snapCtx.currentTime;

        const snapOsc = ctx.createOscillator();
        const snapGain = ctx.createGain();
        snapOsc.type = 'square';
        snapOsc.frequency.setValueAtTime(420, snapNow);
        snapOsc.frequency.exponentialRampToValueAtTime(80, snapNow + 0.08);

        snapGain.gain.setValueAtTime(0.45, snapNow);
        snapGain.gain.exponentialRampToValueAtTime(0.005, snapNow + 0.09);

        snapOsc.connect(snapGain);
        snapGain.connect(snapCtx.destination);
        snapOsc.start(snapNow);
        snapOsc.stop(snapNow + 0.1);
      }, 380);
    } catch (e) {
      console.warn('Lion roar audio error:', e);
    }
  }

  // Speak the pet's translation out loud!
  public speakText(text: string, lang: 'th' | 'en' = 'en') {
    if (this.isMuted || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'th' ? 'th-TH' : 'en-US';
    utterance.pitch = 1.35;
    utterance.rate = 1.05;

    window.speechSynthesis.speak(utterance);
  }
}


export const SoundEffects = new SoundEffectsService();
