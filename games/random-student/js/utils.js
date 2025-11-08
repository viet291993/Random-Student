// All comments in English per request

// Timing constants shared across modules
window.TIMING_PROFILE = {
  minStartHz: 8, // tốc độ nhanh lúc đầu
  minEndHz: 4, // tốc độ chậm rõ về cuối
  accelPortion: 0.12, // tăng tốc nhanh hơn (ngắn)
  decelPortion: 2, // giảm tốc kéo dài hơn nữa
};

// Clamp a value between min and max (returns min if value is NaN)
window.clamp = function (value, min, max) {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
};

// Convert any value to number or fallback if not finite
window.toNumber = function (value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

// Remove file extension from filename
window.stripExtension = function (filename) {
  const idx = filename.lastIndexOf(".");
  return idx > 0 ? filename.slice(0, idx) : filename;
};

// Get display name from filename (decode + remove extension)
window.getDisplayNameFromFile = function (filename) {
  try {
    const decoded = decodeURIComponent(filename);
    return stripExtension(decoded);
  } catch (_) {
    return stripExtension(filename);
  }
};

// Detect if document is currently in fullscreen mode
window.isRunningInFullscreen = function () {
  return document.fullscreenElement != null;
};

// Toggle fullscreen for the current document (with error handling)
window.toggleFullscreen = async function () {
  try {
    if (!isRunningInFullscreen()) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  } catch (_) {}
};
