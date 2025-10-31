// Config defaults (can be overridden via UI). Comments in English only
window.AppConfig = {
  // Layout can be 'circle' or 'grid'. Default confirmed: circle
  layout: "circle",

  // Spin behavior
  spinDurationSec: 4.0, // default ~4 seconds
  maxTicksPerSecond: 20, // max highlight changes per second

  // Sounds
  sound: {
    tick: true,
    win: true,
  },

  // Exclusion after pick
  excludeAfterPick: true,

  // Avatar visuals
  avatarSize: 96, // px

  // Grid layout
  gridCols: null, // null => auto-fit; number => số item mỗi hàng

  // Text-to-Speech
  tts: {
    enabled: true,
    voiceURI: null, // preferred voice uri; null = auto
  },
};
