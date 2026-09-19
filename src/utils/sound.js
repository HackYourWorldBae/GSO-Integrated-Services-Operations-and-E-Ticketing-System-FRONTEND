/**
 * Audio Notification Utility for GSO Dashboards
 *
 * Uses browser Web Audio API to synthesize a clean, premium acoustic chime
 * without requiring any external audio files or network requests.
 * Fully offline-capable and resilient.
 */

let audioCtx = null;
const SOUND_STORAGE_KEY = 'gso_sound_enabled';

/**
 * Initialize or get active AudioContext
 */
function getAudioContext() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// Auto-unlock AudioContext on first user interaction to satisfy browser autoplay policies
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    try {
      const ctx = getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume();
      }
    } catch {
      // Ignore initial permission edge-cases
    }
  };
  window.addEventListener('click', unlockAudio, { once: true, passive: true });
  window.addEventListener('keydown', unlockAudio, { once: true, passive: true });
  window.addEventListener('touchstart', unlockAudio, { once: true, passive: true });
}

/**
 * Check if notification sound is currently enabled (default: true)
 */
export function isSoundEnabled() {
  if (typeof localStorage === 'undefined') return true;
  const stored = localStorage.getItem(SOUND_STORAGE_KEY);
  return stored !== 'false';
}

/**
 * Enable or disable notification sounds
 */
export function setSoundEnabled(enabled) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(SOUND_STORAGE_KEY, enabled ? 'true' : 'false');
  }
}

/**
 * Toggle sound setting
 */
export function toggleSoundEnabled() {
  const next = !isSoundEnabled();
  setSoundEnabled(next);
  if (next) {
    playNotificationSound(true); // Preview sound when turned on
  }
  return next;
}

/**
 * Plays a pleasant, subtle two-tone dashboard chime (D5 -> A5)
 * @param {boolean} force - if true, bypasses mute check (e.g. for previewing when toggled on)
 */
export function playNotificationSound(force = false) {
  if (!force && !isSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    // Master Gain
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.18, now);
    masterGain.connect(ctx.destination);

    // Note 1: 587.33 Hz (D5) - mellow harmonic base
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);

    gain1.gain.setValueAtTime(0.001, now);
    gain1.gain.exponentialRampToValueAtTime(0.7, now + 0.02);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gain1);
    gain1.connect(masterGain);

    osc1.start(now);
    osc1.stop(now + 0.38);

    // Note 2: 880.00 Hz (A5) - clear acoustic bell chime
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880.00, now + 0.09);

    gain2.gain.setValueAtTime(0.001, now + 0.09);
    gain2.gain.exponentialRampToValueAtTime(0.85, now + 0.11);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

    osc2.connect(gain2);
    gain2.connect(masterGain);

    osc2.start(now + 0.09);
    osc2.stop(now + 0.58);
  } catch (e) {
    // Non-fatal audio playback error (e.g. muted tab or unsupported platform)
    console.debug('Dashboard notification audio played or skipped:', e);
  }
}
