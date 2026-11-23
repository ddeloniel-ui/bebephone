// Pure Web Audio API retro sound & nostalgic lo-fi synthesizer
// Zero external audio dependencies so every sound works offline & reliably.

class RetroSoundEngine {
  private ctx: AudioContext | null = null;
  private ringInterval: number | null = null;
  private lofiInterval: number | null = null;
  private ringMuted = false;
  private lofiPlaying = false;
  private lofiStep = 0;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public unlock(): boolean {
    const ctx = this.ensureContext();
    return Boolean(ctx && ctx.state === 'running');
  }

  public isAudioUnlocked(): boolean {
    return Boolean(this.ctx && this.ctx.state === 'running');
  }

  public setRingMuted(muted: boolean): void {
    this.ringMuted = muted;
    if (muted) {
      this.stopRingtoneLoop();
    }
  }

  public getRingMuted(): boolean {
    return this.ringMuted;
  }

  private playSingleRetroRingBurst(): void {
    if (this.ringMuted) return;
    const ctx = this.ensureContext();
    if (!ctx || ctx.state !== 'running') return;

    const now = ctx.currentTime;
    const duration = 0.85;

    // Classic vintage dual-bell / electronic telephone trill (440Hz + 480Hz + 20Hz FM)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    const masterGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc1.type = 'triangle';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(1180, now);
    osc2.frequency.setValueAtTime(1420, now);

    // Rapid mechanical bell clapper modulation
    lfo.type = 'square';
    lfo.frequency.setValueAtTime(22, now);
    lfoGain.gain.setValueAtTime(160, now);
    lfo.connect(lfoGain);
    lfoGain.connect(osc1.frequency);
    lfoGain.connect(osc2.frequency);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.Q.setValueAtTime(1.6, now);

    masterGain.gain.setValueAtTime(0.0001, now);
    masterGain.gain.linearRampToValueAtTime(0.065, now + 0.03);
    masterGain.gain.setValueAtTime(0.065, now + duration - 0.06);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(masterGain);
    masterGain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    lfo.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
    lfo.stop(now + duration);
  }

  public startRingtoneLoop(): void {
    this.stopRingtoneLoop();
    if (this.ringMuted) return;

    const triggerRing = () => {
      if (this.ringMuted) return;
      this.playSingleRetroRingBurst();
    };

    // Attempt immediately, then repeat every 2.4s matching CSS vibration cadence
    triggerRing();
    this.ringInterval = window.setInterval(triggerRing, 2400);
  }

  public stopRingtoneLoop(): void {
    if (this.ringInterval !== null) {
      window.clearInterval(this.ringInterval);
      this.ringInterval = null;
    }
  }

  public playHandsetLift(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Mechanical plastic cradle spring clunk
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(210, now);
    osc.frequency.exponentialRampToValueAtTime(65, now + 0.09);

    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);

    // Subtle second spring click
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(680, now + 0.05);
    osc2.frequency.exponentialRampToValueAtTime(320, now + 0.1);
    gain2.gain.setValueAtTime(0.05, now + 0.05);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.05);
    osc2.stop(now + 0.12);
  }

  public playKeypadTone(key: string): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Classic DTMF matrix frequencies + Nokia softkey tones
    const dtmf: Record<string, [number, number]> = {
      '1': [697, 1209],
      '2': [697, 1336],
      '3': [697, 1477],
      '4': [770, 1209],
      '5': [770, 1336],
      '6': [770, 1477],
      '7': [852, 1209],
      '8': [852, 1336],
      '9': [852, 1477],
      '*': [941, 1209],
      '0': [941, 1336],
      '#': [941, 1477],
      ok: [880, 1320],
      del: [520, 740],
      nav: [740, 1110],
    };

    const pair = dtmf[key] || [800, 1200];
    const oscA = ctx.createOscillator();
    const oscB = ctx.createOscillator();
    const gain = ctx.createGain();

    oscA.type = 'sine';
    oscB.type = 'sine';
    oscA.frequency.setValueAtTime(pair[0], now);
    oscB.frequency.setValueAtTime(pair[1], now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.06, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.095);

    oscA.connect(gain);
    oscB.connect(gain);
    gain.connect(ctx.destination);

    oscA.start(now);
    oscB.start(now);
    oscA.stop(now + 0.1);
    oscB.stop(now + 0.1);
  }

  public playErrorBeep(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    [0, 0.14].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(220, now + offset);
      osc.frequency.setValueAtTime(175, now + offset + 0.05);

      gain.gain.setValueAtTime(0.05, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.11);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.12);
    });
  }

  public playSuccessChime(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Gentle nostalgic 4-note Nokia-like ascending arpeggio
    const notes = [659.25, 783.99, 987.77, 1318.51];
    notes.forEach((freq, idx) => {
      const start = now + idx * 0.09;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(0.075, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.24);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.25);
    });
  }

  public playSmsAlert(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Classic Nokia SMS double-beep: dit-dit, dit-dit
    const timings = [0, 0.09, 0.24, 0.33];
    timings.forEach((t) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(1568, now + t);
      gain.gain.setValueAtTime(0.028, now + t);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + t + 0.065);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + t);
      osc.stop(now + t + 0.07);
    });
  }

  public playTypeTick(): void {
    const ctx = this.ensureContext();
    if (!ctx || ctx.state !== 'running') return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1250 + Math.random() * 140, now);
    gain.gain.setValueAtTime(0.008, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.022);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.025);
  }

  public playPaperFlip(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Gentle filtered noise burst simulating crisp archival cardstock flipping
    const bufferSize = Math.floor(ctx.sampleRate * 0.16);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1100, now);
    filter.frequency.exponentialRampToValueAtTime(2200, now + 0.14);
    filter.Q.setValueAtTime(1.2, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.055, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.17);
  }

  public toggleLofiMusic(): boolean {
    if (this.lofiPlaying) {
      this.stopLofiMusic();
      return false;
    }
    this.startLofiMusic();
    return true;
  }

  public isLofiPlaying(): boolean {
    return this.lofiPlaying;
  }

  public startLofiMusic(): void {
    if (this.lofiPlaying) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    this.lofiPlaying = true;
    this.lofiStep = 0;

    // Warm nostalgic 90s lo-fi chord progression (Fmaj7 -> Em7 -> Dm7 -> Cmaj7)
    const chords: number[][] = [
      [174.61, 220.0, 261.63, 329.63], // Fmaj7
      [164.81, 196.0, 246.94, 293.66], // Em7
      [146.83, 174.61, 220.0, 261.63], // Dm7
      [130.81, 164.81, 196.0, 246.94], // Cmaj7
    ];

    const melody: (number | null)[] = [
      523.25, 659.25, 587.33, null,
      493.88, 587.33, 523.25, null,
      440.0, 523.25, 493.88, 440.0,
      392.0, null, 440.0, 493.88,
    ];

    const playBeat = () => {
      if (!this.lofiPlaying) return;
      const audio = this.ensureContext();
      if (!audio || audio.state !== 'running') return;

      const now = audio.currentTime;
      const step = this.lofiStep % 16;

      // Play warm Rhodes-like chord every 4 steps
      if (step % 4 === 0) {
        const chordIdx = Math.floor(step / 4) % chords.length;
        const chord = chords[chordIdx];

        const filter = audio.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(780, now);

        const master = audio.createGain();
        master.gain.setValueAtTime(0.0001, now);
        master.gain.linearRampToValueAtTime(0.028, now + 0.14);
        master.gain.exponentialRampToValueAtTime(0.003, now + 1.85);

        filter.connect(master);
        master.connect(audio.destination);

        chord.forEach((freq, i) => {
          const osc = audio.createOscillator();
          osc.type = i % 2 === 0 ? 'sine' : 'triangle';
          // Tiny tape-warble detune
          osc.frequency.setValueAtTime(freq * (1 + (Math.random() - 0.5) * 0.003), now);
          osc.connect(filter);
          osc.start(now);
          osc.stop(now + 1.9);
        });
      }

      // Soft music-box / electric piano upper note
      const note = melody[step];
      if (note) {
        const osc = audio.createOscillator();
        const filter = audio.createBiquadFilter();
        const gain = audio.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(note, now);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, now);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.022, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(audio.destination);
        osc.start(now);
        osc.stop(now + 0.48);
      }

      this.lofiStep += 1;
    };

    playBeat();
    this.lofiInterval = window.setInterval(playBeat, 500);
  }

  public stopLofiMusic(): void {
    this.lofiPlaying = false;
    if (this.lofiInterval !== null) {
      window.clearInterval(this.lofiInterval);
      this.lofiInterval = null;
    }
  }
}

export const soundEngine = new RetroSoundEngine();
