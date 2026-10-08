import type { AtmosphereId } from '../types/music';

type NoiseKind = 'white' | 'pink' | 'brown' | 'crackle';

const PENTATONIC = [196, 220, 261.63, 293.66, 329.63, 392, 440, 523.25];

/**
 * Generates atmospheres procedurally with the Web Audio API —
 * nothing is downloaded and nothing plays until the user presses play.
 */
export class AtmosphereEngine {
  analyser: AnalyserNode | null = null;
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private stops: Array<() => void> = [];
  private buffers = new Map<NoiseKind, AudioBuffer>();
  private generation = 0;

  async play(id: AtmosphereId, volume: number): Promise<void> {
    const ctx = this.ensure();
    if (ctx.state === 'suspended') await ctx.resume();
    this.generation += 1;
    this.stopNodes();
    const master = this.master;
    if (!master || id === 'silence') return;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(0, ctx.currentTime);
    const bus = ctx.createGain();
    bus.connect(master);
    this.stops.push(() => bus.disconnect());
    this.build(id, bus);
    this.setVolume(volume);
  }

  pause(): void {
    const { ctx, master } = this;
    if (!ctx || !master) return;
    this.generation += 1;
    const gen = this.generation;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(0, ctx.currentTime, 0.12);
    window.setTimeout(() => {
      if (gen === this.generation) this.stopNodes();
    }, 700);
  }

  setVolume(value: number): void {
    const { ctx, master } = this;
    if (!ctx || !master) return;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(value * 0.55, ctx.currentTime, 0.25);
  }

  dispose(): void {
    this.stopNodes();
    void this.ctx?.close();
    this.ctx = null;
    this.master = null;
    this.analyser = null;
  }

  private ensure(): AudioContext {
    if (this.ctx) return this.ctx;
    const w = window as Window & {webkitAudioContext?: typeof AudioContext;};
    const Ctor = window.AudioContext ?? w.webkitAudioContext;
    if (!Ctor) throw new Error('Audio is unavailable in this browser.');
    const ctx = new Ctor();
    const master = ctx.createGain();
    master.gain.value = 0;
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = 0.85;
    master.connect(analyser);
    analyser.connect(ctx.destination);
    this.ctx = ctx;
    this.master = master;
    this.analyser = analyser;
    return ctx;
  }

  private stopNodes(): void {
    this.stops.forEach((stop) => {
      try {
        stop();
      } catch {

        /* node already stopped */}
    });
    this.stops = [];
  }

  private noiseBuffer(kind: NoiseKind): AudioBuffer {
    const cached = this.buffers.get(kind);
    if (cached) return cached;
    const ctx = this.ensure();
    const length = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0,b1 = 0,b2 = 0,b3 = 0,b4 = 0,b5 = 0,b6 = 0,last = 0;
    for (let i = 0; i < length; i += 1) {
      const white = Math.random() * 2 - 1;
      if (kind === 'white') data[i] = white;else
      if (kind === 'pink') {
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.969 * b2 + white * 0.153852;
        b3 = 0.8665 * b3 + white * 0.3104856;
        b4 = 0.55 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.016898;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      } else if (kind === 'brown') {
        last = (last + 0.02 * white) / 1.02;
        data[i] = last * 3.5;
      } else {
        data[i] = Math.random() < 0.0006 ? white * (0.4 + Math.random() * 0.6) : 0;
      }
    }
    this.buffers.set(kind, buffer);
    return buffer;
  }

  private filter(type: BiquadFilterType, frequency: number, q = 0.7): BiquadFilterNode {
    const f = this.ensure().createBiquadFilter();
    f.type = type;
    f.frequency.value = frequency;
    f.Q.value = q;
    return f;
  }

  private noise(kind: NoiseKind, dest: AudioNode, level: number, ...filters: BiquadFilterNode[]): GainNode {
    const ctx = this.ensure();
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer(kind);
    src.loop = true;
    const gain = ctx.createGain();
    gain.gain.value = level;
    let node: AudioNode = src;
    filters.forEach((f) => {
      node.connect(f);
      node = f;
    });
    node.connect(gain);
    gain.connect(dest);
    src.start(0, Math.random() * 3);
    this.stops.push(() => {
      src.stop();
      src.disconnect();
      gain.disconnect();
      filters.forEach((f) => f.disconnect());
    });
    return gain;
  }

  private lfo(rate: number, depth: number, target: AudioParam): void {
    const ctx = this.ensure();
    const osc = ctx.createOscillator();
    osc.frequency.value = rate;
    const amount = ctx.createGain();
    amount.gain.value = depth;
    osc.connect(amount);
    amount.connect(target);
    osc.start();
    this.stops.push(() => {
      osc.stop();
      osc.disconnect();
      amount.disconnect();
    });
  }

  private drone(frequency: number, dest: AudioNode, level: number, detune = 0, type: OscillatorType = 'sine'): void {
    const ctx = this.ensure();
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = frequency;
    osc.detune.value = detune;
    const gain = ctx.createGain();
    gain.gain.value = level;
    osc.connect(gain);
    gain.connect(dest);
    osc.start();
    this.stops.push(() => {
      osc.stop();
      osc.disconnect();
      gain.disconnect();
    });
  }

  private every(ms: number, chance: number, fn: () => void): void {
    const id = window.setInterval(() => {
      if (Math.random() < chance) fn();
    }, ms);
    this.stops.push(() => window.clearInterval(id));
  }

  private tone(dest: AudioNode, frequency: number, duration: number, level: number, type: OscillatorType = 'sine', glideTo?: number): void {
    const ctx = this.ensure();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, t);
    if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t + duration * 0.6);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(level, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(t);
    osc.stop(t + duration + 0.05);
    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };
  }

  private burst(dest: AudioNode, duration: number, level: number, frequency: number): void {
    const ctx = this.ensure();
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer('white');
    const f = this.filter('bandpass', frequency, 1.2);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(level, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    src.connect(f);
    f.connect(gain);
    gain.connect(dest);
    src.start(t, Math.random() * 3, duration + 0.1);
    src.onended = () => {
      src.disconnect();
      f.disconnect();
      gain.disconnect();
    };
  }

  private space(dest: AudioNode): AudioNode {
    const ctx = this.ensure();
    const input = ctx.createGain();
    const delay = ctx.createDelay(1.5);
    delay.delayTime.value = 0.42;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.38;
    const tone = this.filter('lowpass', 1800);
    input.connect(dest);
    input.connect(delay);
    delay.connect(tone);
    tone.connect(feedback);
    feedback.connect(delay);
    tone.connect(dest);
    this.stops.push(() => {
      input.disconnect();
      delay.disconnect();
      feedback.disconnect();
      tone.disconnect();
    });
    return input;
  }

  private build(id: AtmosphereId, bus: GainNode): void {
    switch (id) {
      case 'rain':{
          this.noise('pink', bus, 0.55, this.filter('highpass', 500), this.filter('lowpass', 7000));
          this.noise('brown', bus, 0.35, this.filter('lowpass', 500));
          this.every(90, 0.35, () => this.tone(bus, 2400 + Math.random() * 2400, 0.05, 0.012));
          break;
        }
      case 'ocean':{
          const swell = this.noise('brown', bus, 0.5, this.filter('lowpass', 800));
          this.lfo(0.08, 0.42, swell.gain);
          const foam = this.noise('pink', bus, 0.06, this.filter('highpass', 2000));
          this.lfo(0.08, 0.05, foam.gain);
          break;
        }
      case 'forest':{
          const wind = this.noise('pink', bus, 0.18, this.filter('bandpass', 1200, 0.4));
          this.lfo(0.05, 0.12, wind.gain);
          this.noise('brown', bus, 0.2, this.filter('lowpass', 300));
          this.every(2200, 0.55, () => {
            const base = 2600 + Math.random() * 1400;
            const chirps = 1 + Math.floor(Math.random() * 3);
            for (let i = 0; i < chirps; i += 1) {
              window.setTimeout(() => this.tone(bus, base, 0.12, 0.03, 'sine', base * 1.35), i * 140);
            }
          });
          break;
        }
      case 'cafe':{
          const murmur = this.noise('brown', bus, 0.7, this.filter('bandpass', 450, 0.9));
          this.lfo(0.25, 0.15, murmur.gain);
          this.noise('pink', bus, 0.07, this.filter('bandpass', 1800, 0.8));
          this.every(1600, 0.35, () => this.tone(bus, 3100 + Math.random() * 1500, 0.25, 0.02, 'triangle'));
          break;
        }
      case 'library':{
          this.noise('brown', bus, 0.4, this.filter('lowpass', 220));
          this.drone(60, bus, 0.015);
          this.every(4200, 0.35, () => this.burst(bus, 0.35, 0.05, 2200));
          break;
        }
      case 'late-night':{
          const f = this.filter('lowpass', 700);
          f.connect(bus);
          this.stops.push(() => f.disconnect());
          [110, 130.81, 164.81, 196].forEach((fr, i) => this.drone(fr, f, 0.05, i % 2 ? 6 : -6));
          this.lfo(0.04, 300, f.frequency);
          this.noise('brown', bus, 0.12, this.filter('lowpass', 260));
          break;
        }
      case 'vinyl':{
          this.noise('crackle', bus, 0.6, this.filter('highpass', 900));
          this.noise('brown', bus, 0.1, this.filter('lowpass', 180));
          const room = this.space(bus);
          const chords = [
          [220, 277.18, 329.63],
          [196, 246.94, 293.66],
          [174.61, 220, 261.63]];

          let index = 0;
          const playChord = () => {
            chords[index % chords.length].forEach((fr, i) =>
            window.setTimeout(() => this.tone(room, fr, 3.2, 0.035, 'triangle'), i * 60)
            );
            index += 1;
          };
          playChord();
          this.every(3600, 1, playChord);
          break;
        }
      case 'piano':{
          const room = this.space(bus);
          this.tone(room, 261.63, 3.5, 0.06, 'triangle');
          this.every(850, 0.5, () => {
            const note = PENTATONIC[Math.floor(Math.random() * PENTATONIC.length)];
            this.tone(room, note * (Math.random() < 0.3 ? 2 : 1), 3.5, 0.06, 'triangle');
          });
          break;
        }
      case 'ambient':{
          const f = this.filter('lowpass', 900);
          f.connect(bus);
          this.stops.push(() => f.disconnect());
          [146.83, 220, 293.66, 369.99].forEach((fr) => {
            this.drone(fr, f, 0.035, -5);
            this.drone(fr, f, 0.035, 5);
          });
          this.lfo(0.03, 400, f.frequency);
          break;
        }
      default:
        break;
    }
  }
}