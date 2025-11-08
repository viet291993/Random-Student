// Theme UI management
// Comments in English only

const COLOR_VARS = [
  { key: "bg", label: "Nền" },
  { key: "fg", label: "Chữ" },
  { key: "muted", label: "Mờ" },
  { key: "primary", label: "Chính" },
  { key: "secondary", label: "Phụ" },
  { key: "danger", label: "Nguy hiểm" },
  { key: "highlight", label: "Nổi bật" },
];

let currentEditingColors = {};

// Initialize theme UI
function initThemeUI() {
  const btnTheme = document.getElementById("btnTheme");
  const themeModal = document.getElementById("themeModal");
  const themeModalClose = document.getElementById("themeModalClose");
  const themeModalBackdrop = themeModal?.querySelector(".theme-modal-backdrop");
  const themeGrid = document.getElementById("themeGrid");
  const themeCustomBtn = document.getElementById("themeCustomBtn");
  const themeEditorModal = document.getElementById("themeEditorModal");
  const themeEditorClose = document.getElementById("themeEditorClose");
  const themeEditorBackdrop = themeEditorModal?.querySelector(".theme-editor-backdrop");
  const themeEditorCancel = document.getElementById("themeEditorCancel");
  const themeEditorSave = document.getElementById("themeEditorSave");
  const themeEditorReset = document.getElementById("themeEditorReset");

  if (!btnTheme || !themeModal || !themeEditorModal) {
    console.error("Theme UI elements not found");
    return;
  }

  // Open theme selector
  btnTheme.addEventListener("click", () => {
    renderThemeGrid();
    themeModal.hidden = false;
  });

  // Close theme selector
  function closeThemeModal() {
    themeModal.hidden = true;
  }

  themeModalClose?.addEventListener("click", closeThemeModal);
  themeModalBackdrop?.addEventListener("click", closeThemeModal);

  // Open custom theme editor
  themeCustomBtn?.addEventListener("click", () => {
    openThemeEditor();
  });

  // Close theme editor
  function closeThemeEditor() {
    themeEditorModal.hidden = true;
    currentEditingColors = {};
  }

  themeEditorClose?.addEventListener("click", closeThemeEditor);
  themeEditorBackdrop?.addEventListener("click", closeThemeEditor);
  themeEditorCancel?.addEventListener("click", closeThemeEditor);

  // Save custom theme
  themeEditorSave?.addEventListener("click", () => {
    saveCustomTheme();
    closeThemeEditor();
    closeThemeModal();
  });

  // Reset custom theme
  themeEditorReset?.addEventListener("click", () => {
    if (confirm("Bạn có chắc muốn xóa custom theme?")) {
      window.ThemeManager?.deleteCustomTheme();
      closeThemeEditor();
      closeThemeModal();
      renderThemeGrid();
    }
  });

  // Render theme grid
  function renderThemeGrid() {
    if (!themeGrid) return;

    themeGrid.innerHTML = "";

    const themes = window.ThemeManager?.getAvailableThemes() || [];
    const currentTheme = window.ThemeManager?.getCurrentTheme();

    themes.forEach((theme) => {
      const card = document.createElement("div");
      card.className = "theme-card";
      if (theme.id === currentTheme) {
        card.classList.add("active");
      }

      const preview = document.createElement("div");
      preview.className = "theme-preview";
      preview.style.setProperty("--preview-primary", theme.colors.primary);
      preview.style.setProperty("--preview-secondary", theme.colors.secondary);
      preview.style.background = `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`;

      const name = document.createElement("p");
      name.className = "theme-name";
      name.textContent = theme.name;

      card.appendChild(preview);
      card.appendChild(name);

      if (theme.id === currentTheme) {
        const badge = document.createElement("span");
        badge.className = "theme-badge";
        badge.textContent = "Đang dùng";
        card.appendChild(badge);
      }

      card.addEventListener("click", () => {
        if (window.ThemeManager?.setTheme(theme.id)) {
          renderThemeGrid();
        }
      });

      themeGrid.appendChild(card);
    });
  }

  // Open theme editor
  function openThemeEditor() {
    const customTheme = window.ThemeManager?.getCustomTheme();
    const defaultTheme = window.ThemeManager?.BUILT_IN_THEMES?.[window.ThemeManager?.DEFAULT_THEME || "dark"];

    // Initialize editing colors with custom theme or default
    currentEditingColors = customTheme
      ? { ...customTheme }
      : defaultTheme
      ? { ...defaultTheme }
      : {};

    renderColorFields();
    updatePreview();
    updateResetButton();

    themeEditorModal.hidden = false;
  }

  // Render color fields
  function renderColorFields() {
    const themeColorFields = document.getElementById("themeColorFields");
    if (!themeColorFields) return;

    themeColorFields.innerHTML = "";

    COLOR_VARS.forEach(({ key, label }) => {
      const field = document.createElement("div");
      field.className = "theme-color-field";

      const labelEl = document.createElement("label");
      labelEl.className = "theme-color-label";
      labelEl.textContent = label;

      const wrapper = document.createElement("div");
      wrapper.className = "theme-color-input-wrapper";

      const input = document.createElement("input");
      input.type = "text";
      input.className = "theme-color-input";
      input.value = currentEditingColors[key] || "#000000";
      input.placeholder = "#000000";
      input.pattern = "^#[0-9A-Fa-f]{6}$";

      const picker = document.createElement("input");
      picker.type = "color";
      picker.className = "theme-color-picker";
      picker.value = currentEditingColors[key] || "#000000";

      // Sync color picker and text input
      picker.addEventListener("input", (e) => {
        input.value = e.target.value;
        currentEditingColors[key] = e.target.value;
        updatePreview();
      });

      input.addEventListener("input", (e) => {
        const value = e.target.value;
        if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
          picker.value = value;
          currentEditingColors[key] = value;
          updatePreview();
        }
      });

      wrapper.appendChild(input);
      wrapper.appendChild(picker);
      field.appendChild(labelEl);
      field.appendChild(wrapper);
      themeColorFields.appendChild(field);
    });
  }

  // Update preview box
  function updatePreview() {
    const previewBox = document.getElementById("themePreviewBox");
    if (!previewBox) return;

    previewBox.style.setProperty("--preview-bg", currentEditingColors.bg || "#0f172a");
    previewBox.style.setProperty("--preview-fg", currentEditingColors.fg || "#e2e8f0");
    previewBox.style.setProperty("--preview-primary", currentEditingColors.primary || "#22c55e");
    previewBox.style.setProperty("--preview-secondary", currentEditingColors.secondary || "#38bdf8");

    const button = previewBox.querySelector(".theme-preview-button");
    if (button) {
      button.style.background = currentEditingColors.primary || "#22c55e";
    }
  }

  // Update reset button visibility
  function updateResetButton() {
    const customTheme = window.ThemeManager?.getCustomTheme();
    if (themeEditorReset) {
      themeEditorReset.style.display = customTheme ? "inline-flex" : "none";
    }
  }

  // Save custom theme
  function saveCustomTheme() {
    // Validate all colors are present
    const hasAllColors = COLOR_VARS.every(({ key }) => currentEditingColors[key]);
    if (!hasAllColors) {
      alert("Vui lòng điền đầy đủ tất cả màu sắc!");
      return;
    }

    if (window.ThemeManager?.saveCustomTheme(currentEditingColors)) {
      renderThemeGrid();
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initThemeUI);
} else {
  initThemeUI();
}

