// Class TTS: manage speech synthesis for Vietnamese/voice output
class TTS {
  // Set up TTS, attach listener for available voices
  constructor() {
    this.voice = null;
    this._initVoices();
    window.speechSynthesis?.addEventListener("voiceschanged", () =>
      this._initVoices()
    );
  }
  // Initialize best voice (prefer VI, fallback to first available)
  _initVoices() {
    if (!("speechSynthesis" in window)) return;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return;
    let best = voices.find((v) => v.lang?.toLowerCase() === "vi-vn");
    if (!best)
      best = voices.find((v) => v.lang?.toLowerCase().startsWith("vi"));
    if (!best) best = voices[0];
    this.voice = best || null;
  }
  // Speak text aloud, using selected voice and Vietnamese rate/pitch
  speak(text) {
    if (!("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      if (this.voice) utter.voice = this.voice;
      utter.lang = this.voice?.lang || "vi-VN";
      utter.rate = 1.0;
      utter.pitch = 1.0;
      window.speechSynthesis.speak(utter);
    } catch (_) {}
  }
}
// Global singleton for text-to-speech
window.tts = new TTS();
