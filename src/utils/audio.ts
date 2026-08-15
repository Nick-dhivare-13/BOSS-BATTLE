/**
 * Web Audio API synthesizer for rich gaming and productivity sound effects.
 * Supports customizable volume, sound selection, and mute preferences.
 */

export type SoundEffect =
  | 'task'
  | 'subtask'
  | 'habit'
  | 'block'
  | 'study_complete'
  | 'break_complete'
  | 'reminder'
  | 'alarm'
  | 'xp'
  | 'level'
  | 'boss_hit'
  | 'boss_defeat'
  | 'streak_milestone';

export type AlarmSoundType = 'bell' | 'digital' | 'classic' | 'strong_alert' | 'arcade' | 'chime' | 'victory';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export const playSound = (
  type: SoundEffect,
  soundEnabled: boolean = true,
  volume: number = 0.5,
  alarmType: AlarmSoundType = 'bell'
) => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    const effectiveVolume = Math.max(0.01, Math.min(1, volume));
    masterGain.gain.setValueAtTime(effectiveVolume, now);
    masterGain.connect(ctx.destination);

    if (type === 'task' || type === 'block') {
      // Pleasant double chime
      const osc1 = ctx.createOscillator();
      const g1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5
      g1.gain.setValueAtTime(0.25, now);
      g1.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc1.connect(g1);
      g1.connect(masterGain);
      osc1.start(now);
      osc1.stop(now + 0.2);
    } else if (type === 'subtask') {
      // Crisp soft pop
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.08);
      g.gain.setValueAtTime(0.2, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(g);
      g.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'habit') {
      // Warm chord strike
      [440, 554.37, 659.25].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.03);
        g.gain.setValueAtTime(0.18, now + i * 0.03);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(g);
        g.connect(masterGain);
        osc.start(now + i * 0.03);
        osc.stop(now + 0.3);
      });
    } else if (type === 'reminder') {
      // Gentle 3-note notification chime
      [587.33, 739.99, 880].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.1);
        g.gain.setValueAtTime(0.2, now + i * 0.1);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.4);
        osc.connect(g);
        g.connect(masterGain);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.4);
      });
    } else if (type === 'xp' || type === 'boss_hit') {
      // RPG coin/attack sound
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
      g.gain.setValueAtTime(0.22, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(g);
      g.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'study_complete' || type === 'level' || type === 'streak_milestone') {
      // 5-note victory fanfare
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);
        g.gain.setValueAtTime(0.25, now + idx * 0.09);
        g.gain.exponentialRampToValueAtTime(0.001, now + (idx + 1) * 0.12 + 0.15);
        osc.connect(g);
        g.connect(masterGain);
        osc.start(now + idx * 0.09);
        osc.stop(now + (idx + 1) * 0.12 + 0.15);
      });
    } else if (type === 'break_complete') {
      // Re-energize chime
      [659.25, 783.99, 987.77].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        g.gain.setValueAtTime(0.22, now + idx * 0.12);
        g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.5);
        osc.connect(g);
        g.connect(masterGain);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.5);
      });
    } else if (type === 'boss_defeat') {
      // Grand victory theme
      const notes = [392.0, 523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        g.gain.setValueAtTime(0.2, now + idx * 0.12);
        g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.4);
        osc.connect(g);
        g.connect(masterGain);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.4);
      });
    } else if (type === 'alarm') {
      // Study & Break Alarm System
      if (alarmType === 'bell') {
        // High resonance bell chime
        [587.33, 880, 1174.66, 1760].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);
          g.gain.setValueAtTime(0.35 / (i + 1), now);
          g.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);
          osc.connect(g);
          g.connect(masterGain);
          osc.start(now);
          osc.stop(now + 1.4);
        });
      } else if (alarmType === 'digital') {
        // Crisp digital watch / timer double-beeps
        [0, 0.12, 0.28, 0.4].forEach((delay) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(1046.5, now + delay); // C6
          g.gain.setValueAtTime(0.2, now + delay);
          g.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.08);
          osc.connect(g);
          g.connect(masterGain);
          osc.start(now + delay);
          osc.stop(now + delay + 0.08);
        });
      } else if (alarmType === 'classic') {
        // Classic mechanical ringing bell pulse
        for (let i = 0; i < 8; i++) {
          const t = now + i * 0.08;
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const g = ctx.createGain();
          osc1.type = 'triangle';
          osc2.type = 'square';
          osc1.frequency.setValueAtTime(740, t);
          osc2.frequency.setValueAtTime(746, t); // Detuned for mechanical chime vibrato
          g.gain.setValueAtTime(0.2, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
          osc1.connect(g);
          osc2.connect(g);
          g.connect(masterGain);
          osc1.start(t);
          osc2.start(t);
          osc1.stop(t + 0.07);
          osc2.stop(t + 0.07);
        }
      } else if (alarmType === 'strong_alert') {
        // Urgent high-priority acoustic siren alert
        [0, 0.22, 0.44].forEach((t) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(880, now + t);
          osc.frequency.exponentialRampToValueAtTime(1760, now + t + 0.16);
          g.gain.setValueAtTime(0.28, now + t);
          g.gain.exponentialRampToValueAtTime(0.001, now + t + 0.2);
          osc.connect(g);
          g.connect(masterGain);
          osc.start(now + t);
          osc.stop(now + t + 0.2);
        });
      } else if (alarmType === 'chime') {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.15);
          g.gain.setValueAtTime(0.25, now + idx * 0.15);
          g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 0.8);
          osc.connect(g);
          g.connect(masterGain);
          osc.start(now + idx * 0.15);
          osc.stop(now + idx * 0.15 + 0.8);
        });
      } else {
        // Arcade retro fanfare
        const pattern = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5];
        pattern.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.1);
          g.gain.setValueAtTime(0.25, now + idx * 0.1);
          g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.15);
          osc.connect(g);
          g.connect(masterGain);
          osc.start(now + idx * 0.1);
          osc.stop(now + idx * 0.1 + 0.15);
        });
      }
    }
  } catch (e) {
    console.warn('Audio playback error', e);
  }
};
