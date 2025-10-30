// Storage helpers and keys
window.STORAGE_KEY = "random-call-excluded-v1";
window.STORAGE_CFG = "random-call-config-v1";
window.STORAGE_STUDENTS = "random-call-students-override-v1";

// Load excluded students IDs from localStorage
window.loadExcluded = function () {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
};

// Save excluded students IDs to localStorage
window.saveExcluded = function (list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (_) {}
};

// Load user config (object) from localStorage
window.loadConfig = function () {
  try {
    const raw = localStorage.getItem(STORAGE_CFG);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
};

// Save user config (object) to localStorage
window.saveConfig = function (cfg) {
  try {
    localStorage.setItem(STORAGE_CFG, JSON.stringify(cfg));
  } catch (_) {}
};

// Load optional override student images list from localStorage
window.loadStudentsOverride = function () {
  try {
    const raw = localStorage.getItem(STORAGE_STUDENTS);
    if (!raw) return null;
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : null;
  } catch (_) {
    return null;
  }
};

// Save student images override list to localStorage
window.saveStudentsOverride = function (list) {
  try {
    localStorage.setItem(STORAGE_STUDENTS, JSON.stringify(list));
  } catch (_) {}
};

// Remove student images override list from localStorage
window.clearStudentsOverride = function () {
  try {
    localStorage.removeItem(STORAGE_STUDENTS);
  } catch (_) {}
};
