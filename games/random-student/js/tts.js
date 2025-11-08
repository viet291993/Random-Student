// Class TTS: manage speech synthesis for Vietnamese/voice output
class TTS {
  // Set up TTS, attach listener for available voices
  constructor() {
    this.voice = null;
    this.enabled = true;
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
    let best = null;
    // Prefer saved voice if exists
    if (window.AppConfig?.tts?.voiceURI) {
      best = voices.find((v) => v.voiceURI === window.AppConfig.tts.voiceURI);
    }
    if (!best) best = voices.find((v) => v.lang?.toLowerCase() === "vi-vn");
    if (!best)
      best = voices.find((v) => v.lang?.toLowerCase().startsWith("vi"));
    if (!best) best = voices[0];
    this.voice = best || null;
    // Sync enabled from config if available
    if (typeof window.AppConfig?.tts?.enabled === "boolean") {
      this.enabled = window.AppConfig.tts.enabled;
    }
  }
  // Speak text aloud, using selected voice and Vietnamese rate/pitch
  speak(text) {
    if (!("speechSynthesis" in window)) return;
    if (!this.enabled) return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      if (this.voice) utter.voice = this.voice;
      utter.lang = this.voice?.lang || "";
      utter.rate = 1.0;
      utter.pitch = 1.0;
      window.speechSynthesis.speak(utter);
    } catch (_) {}
  }
  // Toggle TTS
  setEnabled(val) {
    this.enabled = !!val;
    if (window.AppConfig?.tts) {
      window.AppConfig.tts.enabled = this.enabled;
      if (typeof window.saveConfig === "function") saveConfig(window.AppConfig);
    }
  }
  // Change voice by voiceURI
  setVoiceByURI(uri) {
    if (!uri || !("speechSynthesis" in window)) return;
    const voices = window.speechSynthesis.getVoices();
    const found = voices.find((v) => v.voiceURI === uri);
    if (found) {
      this.voice = found;
      if (window.AppConfig?.tts) {
        window.AppConfig.tts.voiceURI = uri;
        if (typeof window.saveConfig === "function") saveConfig(window.AppConfig);
      }
    }
  }
}
// Global singleton for text-to-speech
window.tts = new TTS();
