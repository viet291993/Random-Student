// Storage utilities - Save/load game config
// Comments in English only

const STORAGE_KEY = "mushroomGameConfig";

function saveConfig(config) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error("Failed to save config:", e);
  }
}

function loadConfig() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to load config:", e);
  }
  return null;
}

window.saveConfig = saveConfig;
window.loadConfig = loadConfig;

