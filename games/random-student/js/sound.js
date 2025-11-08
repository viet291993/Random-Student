// Simple audio (WebAudio)
// SoundPlayer: handles tick/win audio cues for UI feedback
class SoundPlayer {
  // Create SoundPlayer instance with a null audio context
  constructor() {
    this.audioCtx = null;
  }
  // Lazily instantiate AudioContext, cross-browser
  ensureCtx() {
    if (!this.audioCtx)
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Play tick sound (short beep)
  tick() {
    if (!AppConfig.sound.tick) return;
    this.ensureCtx();
    const ctx = this.audioCtx;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "square";
    o.frequency.value = 800;
    g.gain.value = 0.05;
    o.connect(g).connect(ctx.destination);
    const now = ctx.currentTime;
    o.start(now);
    o.stop(now + 0.03);
  }
  // Play win sound (rising tone effect)
  win() {
    if (!AppConfig.sound.win) return;
    this.ensureCtx();
    const ctx = this.audioCtx;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(440, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.35);
    g.gain.setValueAtTime(0.06, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.5);
  }
}
// Create global singleton for audio cues
window.sounds = new SoundPlayer();
