// UI rendering and interactions - Mushroom Game
// Comments in English only

window.DOM = {
  mushroomGrid: document.getElementById("mushroomGrid"),
  configPanel: document.getElementById("configPanel"),
  configClose: document.getElementById("configClose"),
  btnConfig: document.getElementById("btnConfig"),
  btnBackToMenu: document.getElementById("btnBackToMenu"),
  cfgCorrectWords: document.getElementById("cfgCorrectWords"),
  cfgWrongWords: document.getElementById("cfgWrongWords"),
  cfgTargetRhyme: document.getElementById("cfgTargetRhyme"),
  cfgWordsApply: document.getElementById("cfgWordsApply"),
  cfgWordsReset: document.getElementById("cfgWordsReset"),
  cfgShuffleWords: document.getElementById("cfgShuffleWords"),
  cfgSoundEnabled: document.getElementById("cfgSoundEnabled"),
  cfgFontSize: document.getElementById("cfgFontSize"),
  fontSizeValue: document.getElementById("fontSizeValue"),
  wordCount: document.getElementById("wordCount"),
  correctCount: document.getElementById("correctCount"),
  wrongCount: document.getElementById("wrongCount"),
  rhymeDisplay: document.getElementById("rhymeDisplay"),
  rhymeDisplayWrong: document.getElementById("rhymeDisplayWrong"),
  gameInstruction: document.getElementById("gameInstructionText"),
  instructionRhyme: document.getElementById("instructionRhyme"),
  progressCount: document.getElementById("progressCount"),
  totalCount: document.getElementById("totalCount"),
  correctProgressCount: document.getElementById("correctProgressCount"),
  wrongProgressCount: document.getElementById("wrongProgressCount"),
};

// Render mushrooms
function renderMushrooms() {
  if (!window.DOM.mushroomGrid) return;

  window.DOM.mushroomGrid.innerHTML = "";

  window.gameState.words.forEach((word, index) => {
    const card = createMushroomCard(word, index);
    window.DOM.mushroomGrid.appendChild(card);
  });
}

// Create mushroom card
function createMushroomCard(word, index) {
  const card = document.createElement("div");
  card.className = "mushroom-card";
  card.setAttribute("data-mushroom-index", index);

  // Container for mushroom with text overlay
  const mushroomContainer = document.createElement("div");
  mushroomContainer.className = "mushroom-container";

  // Mushroom image
  const img = document.createElement("img");
  img.src = "images/nam.png";
  img.alt = "Cây nấm";
  img.className = "mushroom-image";
  mushroomContainer.appendChild(img);

  // Word text (on top of mushroom cap)
  const text = document.createElement("p");
  text.className = "mushroom-text";
  text.textContent = word.text;
  mushroomContainer.appendChild(text);

  card.appendChild(mushroomContainer);

  // Click handler
  card.addEventListener("click", () => {
    if (!window.gameState.clickedMushrooms.has(index)) {
      handleMushroomClick(index);
    }
  });

  return card;
}


// Update word counts
function updateWordCounts() {
  if (!window.DOM.cfgCorrectWords || !window.DOM.cfgWrongWords) return;

  const correctText = window.DOM.cfgCorrectWords.value.trim();
  const wrongText = window.DOM.cfgWrongWords.value.trim();
  
  const correctLines = correctText.split("\n").filter((line) => line.trim());
  const wrongLines = wrongText.split("\n").filter((line) => line.trim());

  const correct = correctLines.length;
  const wrong = wrongLines.length;
  const total = correct + wrong;

  if (window.DOM.wordCount) window.DOM.wordCount.textContent = total;
  if (window.DOM.correctCount) window.DOM.correctCount.textContent = correct;
  if (window.DOM.wrongCount) window.DOM.wrongCount.textContent = wrong;
}

// Parse word list from two textareas
function parseWordList(correctText, wrongText) {
  const words = [];

  // Parse correct words
  const correctLines = correctText.split("\n").filter((line) => line.trim());
  correctLines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed) {
      words.push({
        text: trimmed,
        correct: true,
      });
    }
  });

  // Parse wrong words
  const wrongLines = wrongText.split("\n").filter((line) => line.trim());
  wrongLines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed) {
      words.push({
        text: trimmed,
        correct: false,
      });
    }
  });

  return words;
}

// Format word list to two textareas
function formatWordList(words) {
  const correct = words.filter((w) => w.correct).map((w) => w.text);
  const wrong = words.filter((w) => !w.correct).map((w) => w.text);
  
  return {
    correct: correct.join("\n"),
    wrong: wrong.join("\n"),
  };
}

// Update rhyme display
function updateRhymeDisplay() {
  const rhyme = window.MushroomConfig.settings.targetRhyme || "ôn/ôt";
  
  if (window.DOM.rhymeDisplay) {
    window.DOM.rhymeDisplay.textContent = rhyme;
  }
  if (window.DOM.rhymeDisplayWrong) {
    window.DOM.rhymeDisplayWrong.textContent = rhyme;
  }
  if (window.DOM.instructionRhyme) {
    window.DOM.instructionRhyme.textContent = rhyme;
  }
}

// Load config to UI
function loadConfigToUI() {
  // Load target rhyme
  if (window.DOM.cfgTargetRhyme) {
    const rhyme = window.MushroomConfig.settings.targetRhyme || "ôn/ôt";
    window.DOM.cfgTargetRhyme.value = rhyme;
  }
  updateRhymeDisplay();

  // Load word list to two textareas
  const formatted = formatWordList(window.MushroomConfig.words);
  if (window.DOM.cfgCorrectWords) {
    window.DOM.cfgCorrectWords.value = formatted.correct;
  }
  if (window.DOM.cfgWrongWords) {
    window.DOM.cfgWrongWords.value = formatted.wrong;
  }
  updateWordCounts();

  // Load settings
  if (window.DOM.cfgShuffleWords) {
    window.DOM.cfgShuffleWords.checked =
      window.MushroomConfig.settings.shuffleWords;
  }
  if (window.DOM.cfgSoundEnabled) {
    window.DOM.cfgSoundEnabled.checked =
      window.MushroomConfig.settings.sound?.enabled ?? true;
  }
  if (window.DOM.cfgFontSize) {
    const fontSize = window.MushroomConfig.settings.fontSize || 18;
    window.DOM.cfgFontSize.value = fontSize;
    if (window.DOM.fontSizeValue) {
      window.DOM.fontSizeValue.textContent = fontSize;
    }
    applyFontSize(fontSize);
  }
}

// Save config from UI
function saveConfigFromUI() {
  // Parse word list from two textareas
  const correctText = window.DOM.cfgCorrectWords ? window.DOM.cfgCorrectWords.value.trim() : "";
  const wrongText = window.DOM.cfgWrongWords ? window.DOM.cfgWrongWords.value.trim() : "";
  const words = parseWordList(correctText, wrongText);

  if (words.length === 0) {
    alert("Vui lòng nhập ít nhất một từ!");
    return false;
  }

  // Update config
  window.MushroomConfig.words = words;

  // Update settings
  if (window.DOM.cfgTargetRhyme) {
    const rhyme = window.DOM.cfgTargetRhyme.value.trim();
    if (rhyme) {
      window.MushroomConfig.settings.targetRhyme = rhyme;
    } else {
      window.MushroomConfig.settings.targetRhyme = "ôn/ôt"; // Default
    }
  }
  if (window.DOM.cfgShuffleWords) {
    window.MushroomConfig.settings.shuffleWords =
      window.DOM.cfgShuffleWords.checked;
  }
  if (window.DOM.cfgSoundEnabled) {
    if (!window.MushroomConfig.settings.sound) {
      window.MushroomConfig.settings.sound = {};
    }
    window.MushroomConfig.settings.sound.enabled =
      window.DOM.cfgSoundEnabled.checked;
  }
  if (window.DOM.cfgFontSize) {
    const fontSize = parseInt(window.DOM.cfgFontSize.value) || 18;
    window.MushroomConfig.settings.fontSize = fontSize;
    applyFontSize(fontSize);
  }

  // Update rhyme display
  updateRhymeDisplay();

  // Save to storage
  saveConfig(window.MushroomConfig);

  return true;
}

// Apply font size to mushroom text
function applyFontSize(size) {
  document.documentElement.style.setProperty('--mushroom-text-size', `${size}px`);
}

// Event handlers
if (window.DOM.cfgCorrectWords) {
  window.DOM.cfgCorrectWords.addEventListener("input", updateWordCounts);
}
if (window.DOM.cfgWrongWords) {
  window.DOM.cfgWrongWords.addEventListener("input", updateWordCounts);
}
if (window.DOM.cfgTargetRhyme) {
  window.DOM.cfgTargetRhyme.addEventListener("input", () => {
    updateRhymeDisplay();
  });
}

if (window.DOM.cfgFontSize) {
  window.DOM.cfgFontSize.addEventListener("input", (e) => {
    const size = parseInt(e.target.value) || 18;
    if (window.DOM.fontSizeValue) {
      window.DOM.fontSizeValue.textContent = size;
    }
    applyFontSize(size);
  });
}

if (window.DOM.cfgWordsApply) {
  window.DOM.cfgWordsApply.addEventListener("click", () => {
    if (saveConfigFromUI()) {
      initGame();
      renderMushrooms();
      showToast("Đã áp dụng cài đặt!", "success");
      window.DOM.configPanel.hidden = true;
    }
  });
}

if (window.DOM.cfgWordsReset) {
  window.DOM.cfgWordsReset.addEventListener("click", () => {
    // Reset to default config
    window.MushroomConfig = {
      words: [
        { text: "thôn xóm", correct: true },
        { text: "cồn cát", correct: true },
        { text: "con chồn", correct: true },
        { text: "cột đèn", correct: true },
        { text: "cà rốt", correct: true },
        { text: "thốt nốt", correct: true },
        { text: "con lợn", correct: false },
        { text: "bàn", correct: false },
        { text: "dế mèn", correct: false },
        { text: "nón", correct: false },
        { text: "cá", correct: false },
        { text: "tô", correct: false },
      ],
      settings: {
        showResultDelay: 500,
        animationDuration: 600,
        shuffleWords: true,
        sound: {
          enabled: true,
        },
      },
    };
    loadConfigToUI();
  });
}


if (window.DOM.configClose) {
  window.DOM.configClose.addEventListener("click", () => {
    window.DOM.configPanel.hidden = true;
  });
}

if (window.DOM.btnConfig) {
  window.DOM.btnConfig.addEventListener("click", () => {
    loadConfigToUI();
    window.DOM.configPanel.hidden = false;
  });
}

if (window.DOM.btnBackToMenu) {
  window.DOM.btnBackToMenu.addEventListener("click", () => {
    window.location.href = "../../index.html";
  });
}

// Fullscreen handler
const btnFullscreen = document.getElementById("btnFullscreen");
if (btnFullscreen) {
  btnFullscreen.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable fullscreen:", err);
      });
    } else {
      document.exitFullscreen();
    }
  });

  // Update icon when fullscreen changes
  document.addEventListener("fullscreenchange", () => {
    const icon = btnFullscreen.querySelector(".material-icons-round");
    if (icon) {
      icon.textContent = document.fullscreenElement ? "fullscreen_exit" : "fullscreen";
    }
  });

  // Keyboard shortcut (F key)
  document.addEventListener("keydown", (e) => {
    if (e.key === "f" || e.key === "F") {
      if (e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
        e.preventDefault();
        btnFullscreen.click();
      }
    }
  });
}

// Show toast notification
function showToast(message, type = "info") {
  // Remove existing toast
  const existingToast = document.getElementById("toast");
  if (existingToast) {
    existingToast.remove();
  }

  // Create toast
  const toast = document.createElement("div");
  toast.id = "toast";
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="material-icons-round toast-icon">${type === "success" ? "check_circle" : "info"}</span>
    <span class="toast-message">${message}</span>
  `;
  document.body.appendChild(toast);

  // Show toast
  setTimeout(() => {
    toast.classList.add("show");
  }, 10);

  // Hide toast after delay
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// Completion modal handlers
const completionModal = document.getElementById("completionModal");
const modalClose = document.getElementById("modalClose");
const btnPlayAgain = document.getElementById("btnPlayAgain");
const btnBackToMenuFromModal = document.getElementById("btnBackToMenuFromModal");

if (modalClose) {
  modalClose.addEventListener("click", () => {
    if (completionModal) completionModal.hidden = true;
  });
}

if (completionModal) {
  completionModal.addEventListener("click", (e) => {
    if (e.target === completionModal || e.target.classList.contains("modal-overlay")) {
      completionModal.hidden = true;
    }
  });
}

if (btnPlayAgain) {
  btnPlayAgain.addEventListener("click", () => {
    if (completionModal) completionModal.hidden = true;
    window.initGame();
    window.renderMushrooms();
  });
}

if (btnBackToMenuFromModal) {
  btnBackToMenuFromModal.addEventListener("click", () => {
    window.location.href = "../../index.html";
  });
}

window.renderMushrooms = renderMushrooms;
window.loadConfigToUI = loadConfigToUI;
window.saveConfigFromUI = saveConfigFromUI;
window.updateRhymeDisplay = updateRhymeDisplay;

