// Simple audio (WebAudio) for Mushroom Game
// SoundPlayer: handles correct/wrong audio cues for UI feedback
// Comments in English only

class SoundPlayer {
  // Create SoundPlayer instance with a null audio context
  constructor() {
    this.audioCtx = null;
  }

  // Lazily instantiate AudioContext, cross-browser
  ensureCtx() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  // Play correct sound (rising tone effect)
  correct() {
    if (!window.MushroomConfig?.settings?.sound?.enabled) return;
    this.ensureCtx();
    const ctx = this.audioCtx;
    
    // Create a pleasant rising tone
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    o.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.3); // C6
    g.gain.setValueAtTime(0.15, ctx.currentTime); // Increased from 0.08 to 0.15
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.4);
  }

  // Play wrong sound (descending tone)
  wrong() {
    if (!window.MushroomConfig?.settings?.sound?.enabled) return;
    this.ensureCtx();
    const ctx = this.audioCtx;
    
    // Create a descending tone
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "square";
    o.frequency.setValueAtTime(440, ctx.currentTime); // A4
    o.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.2); // A3
    g.gain.setValueAtTime(0.06, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.3);
  }

  // Play click sound (short beep)
  click() {
    if (!window.MushroomConfig?.settings?.sound?.enabled) return;
    this.ensureCtx();
    const ctx = this.audioCtx;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = 600;
    g.gain.value = 0.03;
    o.connect(g).connect(ctx.destination);
    const now = ctx.currentTime;
    o.start(now);
    o.stop(now + 0.05);
  }
}

// Create global singleton for audio cues
window.sounds = new SoundPlayer();

