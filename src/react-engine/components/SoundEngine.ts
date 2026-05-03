// =============================================================================
// ArchetypeOS — SoundEngine
// Lightweight audio layer for micro-interactions. Uses Web Audio API
// to generate subtle tones without external dependencies.
//
// Sound palette:
//   - "water-drop": soft sine ping on slider adjustment
//   - "paper-rustle": filtered noise on module selection
//   - "pulse-confirm": warm chord when archetype is identified
//   - "ambient-drone": continuous subtle tone based on archetype
// =============================================================================

export type SoundPreset = "water-drop" | "paper-rustle" | "pulse-confirm" | "ambient-drone";

interface ActiveOscillator {
  osc: OscillatorNode;
  gain: GainNode;
  stopAt: number;
}

export class SoundEngine {
  private _ctx: AudioContext | null = null;
  private _enabled = true;
  private _activeDrone: ActiveOscillator | null = null;
  private _volume = 0.15; // subtle by default
  private _droneFrequency = 220; // A3 — calm center

  /** Initialize on first user interaction (required by browsers) */
  init(): void {
    if (this._ctx) return;
    try {
      this._ctx = new AudioContext();
      console.log("[SoundEngine] Audio context ready.");
    } catch {
      console.warn("[SoundEngine] Web Audio not available.");
      this._enabled = false;
    }
  }

  /** Enable / disable sounds */
  set enabled(v: boolean) {
    this._enabled = v;
    if (!v) this.stopDrone();
  }

  get enabled(): boolean {
    return this._enabled;
  }

  set volume(v: number) {
    this._volume = Math.max(0, Math.min(1, v));
  }

  // ---- One-shot sounds ----

  /** Play a short interaction sound */
  play(preset: SoundPreset, variation: number = 0): void {
    if (!this._enabled || !this._ctx) return;

    // Resume if suspended (autoplay policy)
    if (this._ctx.state === "suspended") {
      this._ctx.resume();
    }

    switch (preset) {
      case "water-drop":
        this._playWaterDrop(variation);
        break;
      case "paper-rustle":
        this._playPaperRustle();
        break;
      case "pulse-confirm":
        this._playPulseConfirm(variation);
        break;
      case "ambient-drone":
        this._startDrone(variation);
        break;
    }
  }

  /** Start a continuous ambient drone matching the archetype */
  startDrone(frequency: number = 220): void {
    if (!this._enabled || !this._ctx) return;
    this._droneFrequency = frequency;
    this.stopDrone();
    this.play("ambient-drone", frequency);
  }

  /** Stop the ambient drone */
  stopDrone(): void {
    if (this._activeDrone) {
      const { osc, gain } = this._activeDrone;
      gain.gain.linearRampToValueAtTime(0, this._ctx!.currentTime + 0.5);
      osc.stop(this._ctx!.currentTime + 0.6);
      this._activeDrone = null;
    }
  }

  // ---- Internal sound generators ----

  private _playWaterDrop(variation: number): void {
    const ctx = this._ctx!;
    const freq = 800 + variation * 400 + Math.random() * 100; // 800–1300 Hz
    const now = ctx.currentTime;

    // Two quick sine pings — a "drop"
    [0, 0.06].forEach((delay) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + delay);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.6, now + delay + 0.1);

      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(this._volume * 0.6, now + delay + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.15);

      osc.connect(gain).connect(ctx.destination);
      osc.start(now + delay);
      osc.stop(now + delay + 0.16);
    });
  }

  private _playPaperRustle(): void {
    const ctx = this._ctx!;
    const now = ctx.currentTime;
    const duration = 0.12;

    // White noise burst through a bandpass filter
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(3000, now);
    filter.Q.setValueAtTime(0.5, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(this._volume * 0.3, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    source.connect(filter).connect(gain).connect(ctx.destination);
    source.start(now);
    source.stop(now + duration);
  }

  private _playPulseConfirm(variation: number): void {
    const ctx = this._ctx!;
    const now = ctx.currentTime;
    const baseFreq = 261.63 + variation * 130; // C4 to C5 range

    // A warm major triad — C, E, G
    const notes = [baseFreq, baseFreq * 1.25, baseFreq * 1.5];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = i === 0 ? "triangle" : "sine";
      osc.frequency.setValueAtTime(freq, now + i * 0.05);

      gain.gain.setValueAtTime(0, now + i * 0.05);
      gain.gain.linearRampToValueAtTime(this._volume * 0.4, now + i * 0.05 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.8);

      osc.connect(gain).connect(ctx.destination);
      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.9);
    });
  }

  private _startDrone(frequency: number): void {
    const ctx = this._ctx!;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(frequency, now);

    // Add subtle harmonic
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(frequency * 1.5, now);
    gain2.gain.setValueAtTime(this._volume * 0.08, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(this._volume * 0.12, now + 1.5);

    osc.connect(gain).connect(ctx.destination);
    osc2.connect(gain2).connect(ctx.destination);
    osc.start(now);
    osc2.start(now);

    this._activeDrone = {
      osc,
      gain,
      stopAt: now + 3600, // will be stopped manually
    };
  }
}

// Singleton
export const soundEngine = new SoundEngine();
