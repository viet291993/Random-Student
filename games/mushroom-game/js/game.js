// Game logic - Mushroom Game
// Comments in English only

window.gameState = {
  words: [],
  clickedMushrooms: new Set(),
  isAnimating: false,
};

// Initialize game
function initGame() {
  // Load config
  const stored = loadConfig();
  if (stored && stored.words && stored.words.length > 0) {
    window.MushroomConfig.words = stored.words;
  }
  if (stored && stored.settings) {
    Object.assign(window.MushroomConfig.settings, stored.settings);
  }

  // Prepare words
  let words = [...window.MushroomConfig.words];
  
  // Shuffle if enabled
  if (window.MushroomConfig.settings.shuffleWords) {
    words = shuffleArray(words);
  }

  // Limit to 12 words
  words = words.slice(0, 12);

  window.gameState.words = words;
  window.gameState.clickedMushrooms.clear();
  window.gameState.isAnimating = false;
  
  // Update progress
  updateProgress();
}

// Shuffle array
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Check if word contains target rhyme
function checkWord(word) {
  const rhyme = window.MushroomConfig.settings.targetRhyme || "ôn/ôt";
  const normalized = word.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  // Extract rhyme patterns (e.g., "ôn/ôt" -> ["on", "ot"])
  const patterns = rhyme.split("/").map((r) => {
    // Remove tone marks and convert to lowercase
    return r.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  });
  
  // Check if word contains any of the patterns
  return patterns.some((pattern) => normalized.includes(pattern));
}

// Update progress
function updateProgress() {
  if (!window.DOM.progressCount || !window.DOM.totalCount) return;
  
  const total = window.gameState.words.length;
  const clicked = window.gameState.clickedMushrooms.size;
  const correct = Array.from(window.gameState.clickedMushrooms).filter(
    (idx) => window.gameState.words[idx]?.correct
  ).length;
  const wrong = clicked - correct;

  // Count total correct words in the list
  const totalCorrect = window.gameState.words.filter(
    (word) => word.correct === true
  ).length;

  window.DOM.totalCount.textContent = total;
  window.DOM.progressCount.textContent = clicked;
  if (window.DOM.correctProgressCount) {
    window.DOM.correctProgressCount.textContent = correct;
  }
  if (window.DOM.wrongProgressCount) {
    window.DOM.wrongProgressCount.textContent = wrong;
  }

  // Check if game is complete - when all correct mushrooms are found
  if (correct === totalCorrect && totalCorrect > 0) {
    setTimeout(() => {
      showCompletionModal(correct, wrong, total);
    }, 500);
  }
}

// Handle mushroom click
function handleMushroomClick(index) {
  if (window.gameState.isAnimating) return;
  if (window.gameState.clickedMushrooms.has(index)) return;

  const word = window.gameState.words[index];
  const isCorrect = word.correct;
  const actualCheck = checkWord(word.text);

  // Mark as clicked
  window.gameState.clickedMushrooms.add(index);
  window.gameState.isAnimating = true;

  // Play sound
  if (window.sounds) {
    if (isCorrect) {
      window.sounds.correct();
    } else {
      window.sounds.wrong();
    }
  }

  // Show result
  showResult(isCorrect, word.text);

  // Update mushroom card
  const card = document.querySelector(`[data-mushroom-index="${index}"]`);
  if (card) {
    card.classList.add("clicked");
    if (isCorrect) {
      card.classList.add("correct");
    } else {
      card.classList.add("wrong");
    }
  }

  // Update progress
  updateProgress();

  // Reset animation state after delay
  setTimeout(() => {
    window.gameState.isAnimating = false;
  }, window.MushroomConfig.settings.animationDuration + 100);
}

// Show result notification
function showResult(isCorrect, wordText) {
  const notification = document.getElementById("resultNotification");
  const icon = document.getElementById("resultIcon");
  const text = document.getElementById("resultText");
  const content = notification?.querySelector(".notification-content");

  if (!notification || !icon || !text) return;

  const rhyme = window.MushroomConfig.settings.targetRhyme || "ôn/ôt";

  // Set content
  icon.textContent = isCorrect ? "✅" : "❌";
  text.textContent = isCorrect
    ? `Đúng! "${wordText}" có vần ${rhyme}`
    : `Sai! "${wordText}" không có vần ${rhyme}`;

  // Set class
  notification.className = `result-notification ${isCorrect ? "correct" : "wrong"}`;
  
  // Reset animation to ensure it plays every time
  if (content) {
    content.style.animation = "none";
    // Force reflow to reset animation
    void content.offsetWidth;
    content.style.animation = "";
  }
  
  notification.hidden = false;

  // Hide after delay
  setTimeout(() => {
    notification.hidden = true;
  }, 2000);
}

// Create firework effect
function createFireworks() {
  const container = document.body;
  const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7', '#ec4899'];
  
  // Create multiple firework bursts across the screen
  const burstCount = 8; // Increased from 3 to 8
  for (let i = 0; i < burstCount; i++) {
    setTimeout(() => {
      createFireworkBurst(container, colors);
    }, i * 150); // Reduced delay from 300ms to 150ms for faster bursts
  }
}

// Create a single firework burst
function createFireworkBurst(container, colors) {
  const firework = document.createElement('div');
  firework.className = 'firework';
  
  // Random position across the entire screen
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const margin = 100; // Margin from edges
  
  const randomX = margin + Math.random() * (screenWidth - margin * 2);
  const randomY = margin + Math.random() * (screenHeight - margin * 2);
  
  firework.style.left = `${randomX}px`;
  firework.style.top = `${randomY}px`;
  
  container.appendChild(firework);
  
  // Create particles - increased count and distance
  const particleCount = 30; // Increased from 20 to 30
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'firework-particle';
    
    const angle = (Math.PI * 2 * i) / particleCount;
    const distance = 120 + Math.random() * 60; // Increased from 80-120 to 120-180
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Calculate end position
    const endX = Math.cos(angle) * distance;
    const endY = Math.sin(angle) * distance;
    
    particle.style.setProperty('--end-x', `${endX}px`);
    particle.style.setProperty('--end-y', `${endY}px`);
    particle.style.backgroundColor = color;
    particle.style.boxShadow = `0 0 15px ${color}, 0 0 30px ${color}`; // Increased glow
    
    firework.appendChild(particle);
  }
  
  // Remove after animation
  setTimeout(() => {
    firework.remove();
  }, 1500);
}

// Show completion modal
function showCompletionModal(correct, wrong, total) {
  const modal = document.getElementById("completionModal");
  const correctEl = document.getElementById("completionCorrect");
  const wrongEl = document.getElementById("completionWrong");
  const totalEl = document.getElementById("completionTotal");
  const scoreEl = document.getElementById("completionScore");

  if (!modal) return;

  // Count total correct words in the list
  const totalCorrect = window.gameState.words.filter(
    (word) => word.correct === true
  ).length;

  if (correctEl) correctEl.textContent = correct;
  if (wrongEl) wrongEl.textContent = wrong;
  if (totalEl) totalEl.textContent = total;
  
  // Calculate score:
  // Base score: (correct / totalCorrect) * 100 (max 100% if all correct found)
  // Penalty: -10 points for each wrong mushroom clicked
  // Minimum score: 0%
  let baseScore = totalCorrect > 0 ? (correct / totalCorrect) * 100 : 0;
  let penalty = wrong * 10; // -10 points per wrong mushroom
  let finalScore = Math.max(0, Math.round(baseScore - penalty));
  
  // Cap at 100%
  finalScore = Math.min(100, finalScore);
  
  if (scoreEl) scoreEl.textContent = `${finalScore}%`;

  // Show modal
  modal.hidden = false;
  
  // Create fireworks effect
  setTimeout(() => {
    createFireworks();
  }, 300);
}

window.initGame = initGame;
window.handleMushroomClick = handleMushroomClick;
window.checkWord = checkWord;

