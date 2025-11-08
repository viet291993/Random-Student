// Main initialization - Mushroom Game
// Comments in English only

// Load stored config
const storedConfig = loadConfig();
if (storedConfig) {
  if (storedConfig.words) {
    window.MushroomConfig.words = storedConfig.words;
  }
  if (storedConfig.settings) {
    Object.assign(window.MushroomConfig.settings, storedConfig.settings);
  }
}

// Initialize game on load
window.addEventListener("load", () => {
  // Load stored config first
  const stored = loadConfig();
  if (stored) {
    if (stored.words) {
      window.MushroomConfig.words = stored.words;
    }
    if (stored.settings) {
      Object.assign(window.MushroomConfig.settings, stored.settings);
    }
  }
  
  // Update rhyme display
  if (typeof updateRhymeDisplay === "function") {
    updateRhymeDisplay();
  }
  
  initGame();
  renderMushrooms();
});

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  const tag = e.target && e.target.tagName ? e.target.tagName.toLowerCase() : "";
  const isTyping = tag === "input" || tag === "textarea" || tag === "select";
  if (isTyping) return;
  if (e.ctrlKey || e.metaKey || e.altKey) return;

  switch (e.key) {
    case "m":
    case "M":
      if (window.DOM.btnBackToMenu) window.DOM.btnBackToMenu.click();
      break;
    case "c":
    case "C":
      if (window.DOM.btnConfig) window.DOM.btnConfig.click();
      break;
    case "Escape":
      if (window.DOM.configPanel && !window.DOM.configPanel.hidden) {
        window.DOM.configPanel.hidden = true;
      }
      break;
    default:
      break;
  }
});

