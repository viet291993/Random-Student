// Theme management system
// Comments in English only

const THEME_STORAGE_KEY = "app-theme-v1";
const CUSTOM_THEME_KEY = "app-theme-custom-v1";
const DEFAULT_THEME = "dark";

// Built-in themes definition
const BUILT_IN_THEMES = {
  dark: {
    name: "Tối",
    bg: "#0f172a",
    fg: "#e2e8f0",
    muted: "#94a3b8",
    primary: "#22c55e",
    secondary: "#38bdf8",
    danger: "#ef4444",
    highlight: "#fde68a",
  },
  light: {
    name: "Sáng",
    bg: "#ffffff",
    fg: "#1e293b",
    muted: "#64748b",
    primary: "#16a34a",
    secondary: "#0284c7",
    danger: "#dc2626",
    highlight: "#ca8a04",
  },
  blue: {
    name: "Xanh dương",
    bg: "#0c1226",
    fg: "#e0f2fe",
    muted: "#7dd3fc",
    primary: "#3b82f6",
    secondary: "#60a5fa",
    danger: "#ef4444",
    highlight: "#fbbf24",
  },
  green: {
    name: "Xanh lá",
    bg: "#0a1f0a",
    fg: "#dcfce7",
    muted: "#86efac",
    primary: "#22c55e",
    secondary: "#4ade80",
    danger: "#ef4444",
    highlight: "#fbbf24",
  },
  purple: {
    name: "Tím",
    bg: "#1a0f2e",
    fg: "#f3e8ff",
    muted: "#c084fc",
    primary: "#a855f7",
    secondary: "#c084fc",
    danger: "#ef4444",
    highlight: "#fbbf24",
  },
  orange: {
    name: "Cam",
    bg: "#2a1a0f",
    fg: "#fff7ed",
    muted: "#fdba74",
    primary: "#f97316",
    secondary: "#fb923c",
    danger: "#ef4444",
    highlight: "#fbbf24",
  },
};

// Apply theme colors to HTML element
function applyThemeColors(colors) {
  const root = document.documentElement;
  root.style.setProperty("--bg", colors.bg);
  root.style.setProperty("--fg", colors.fg);
  root.style.setProperty("--muted", colors.muted);
  root.style.setProperty("--primary", colors.primary);
  root.style.setProperty("--secondary", colors.secondary);
  root.style.setProperty("--danger", colors.danger);
  root.style.setProperty("--highlight", colors.highlight);
}

// Get current theme name
function getCurrentTheme() {
  try {
    const theme = localStorage.getItem(THEME_STORAGE_KEY);
    return theme || DEFAULT_THEME;
  } catch (e) {
    return DEFAULT_THEME;
  }
}

// Set theme (built-in or custom)
function setTheme(themeName) {
  if (themeName === "custom") {
    const customTheme = getCustomTheme();
    if (customTheme) {
      applyThemeColors(customTheme);
      saveTheme("custom");
      return true;
    }
    return false; // No custom theme available
  }

  const theme = BUILT_IN_THEMES[themeName];
  if (!theme) {
    console.warn(`Theme "${themeName}" not found, using default`);
    setTheme(DEFAULT_THEME);
    return false;
  }

  applyThemeColors(theme);
  saveTheme(themeName);
  return true;
}

// Save theme name to storage
function saveTheme(themeName) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, themeName);
  } catch (e) {
    console.error("Failed to save theme:", e);
  }
}

// Load theme from storage and apply
function loadTheme() {
  const themeName = getCurrentTheme();
  setTheme(themeName);
}

// Get all available themes (built-in + custom if exists)
function getAvailableThemes() {
  const themes = Object.keys(BUILT_IN_THEMES).map((key) => ({
    id: key,
    name: BUILT_IN_THEMES[key].name,
    colors: BUILT_IN_THEMES[key],
  }));

  const customTheme = getCustomTheme();
  if (customTheme) {
    themes.push({
      id: "custom",
      name: "Tùy chỉnh",
      colors: customTheme,
    });
  }

  return themes;
}

// Custom theme functions
function getCustomTheme() {
  try {
    const stored = localStorage.getItem(CUSTOM_THEME_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (e) {
    console.error("Failed to load custom theme:", e);
    return null;
  }
}

function setCustomTheme(colors) {
  applyThemeColors(colors);
  saveTheme("custom");
}

function saveCustomTheme(colors) {
  try {
    localStorage.setItem(CUSTOM_THEME_KEY, JSON.stringify(colors));
    setTheme("custom");
    return true;
  } catch (e) {
    console.error("Failed to save custom theme:", e);
    return false;
  }
}

function deleteCustomTheme() {
  try {
    localStorage.removeItem(CUSTOM_THEME_KEY);
    // If current theme is custom, switch to default
    if (getCurrentTheme() === "custom") {
      setTheme(DEFAULT_THEME);
    }
    return true;
  } catch (e) {
    console.error("Failed to delete custom theme:", e);
    return false;
  }
}

// Auto-load theme on page load
if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", () => {
    loadTheme();
  });
}

// Export functions to window
if (typeof window !== "undefined") {
  window.ThemeManager = {
    getCurrentTheme,
    setTheme,
    saveTheme,
    loadTheme,
    getAvailableThemes,
    getCustomTheme,
    setCustomTheme,
    saveCustomTheme,
    deleteCustomTheme,
    BUILT_IN_THEMES,
    DEFAULT_THEME,
  };
}

