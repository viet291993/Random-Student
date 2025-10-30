// Boot
window.excluded = loadExcluded();
window.lastRemoved = null;

// Merge stored config to AppConfig
const persistedCfg = loadConfig();
if (persistedCfg) Object.assign(window.AppConfig, persistedCfg);

// Build initial students
window.students = buildStudents();

window.addEventListener("load", () => {
  if (window.DOM.layoutSelect) window.DOM.layoutSelect.value = AppConfig.layout;
  render();
  bindPanels();
});
