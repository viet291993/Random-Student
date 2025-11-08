// Game configuration - Mushroom Game
// Comments in English only

window.MushroomConfig = {
  // Default words list
  words: [
    // Correct words (contains "ôn" or "ôt") - 6 words
    { text: "thôn xóm", correct: true },
    { text: "cồn cát", correct: true },
    { text: "con chồn", correct: true },
    { text: "cột đèn", correct: true },
    { text: "cà rốt", correct: true },
    { text: "thốt nốt", correct: true },
    // Wrong words (doesn't contain "ôn" or "ôt") - 6 words
    { text: "con lợn", correct: false },
    { text: "bàn", correct: false },
    { text: "dế mèn", correct: false },
    { text: "nón", correct: false },
    { text: "cá", correct: false },
    { text: "tô", correct: false },
  ],

  // Game settings
  settings: {
    showResultDelay: 500, // ms delay before showing result
    animationDuration: 600, // ms for animation
    shuffleWords: true, // Shuffle words on start
    targetRhyme: "ôn/ôt", // Target rhyme to find (e.g., "ôn/ôt", "an/at", "en/et")
    fontSize: 18, // Font size for mushroom text (px)
    sound: {
      enabled: true, // Enable/disable sound
    },
  },
};
