// Bind actions and panels
window.bindPanels = function () {
  // ---- Main panel actions (Start, Undo, Reset, Fullscreen) ----
  window.DOM.btnStart.addEventListener("click", () => {
    if (students.length > 0) spinOnce();
  });
  window.DOM.btnUndo.addEventListener("click", () => {
    if (!lastRemoved) return;
    excluded = excluded.filter((id) => id !== lastRemoved);
    saveExcluded(excluded);
    lastRemoved = null;
    render();
  });
  window.DOM.btnReset.addEventListener("click", () => {
    excluded = [];
    saveExcluded(excluded);
    lastRemoved = null;
    render();
  });
  window.DOM.btnFullscreen.addEventListener("click", () => toggleFullscreen());

  // ---- Layout radio button handler ----
  cfgLayoutRadios?.forEach((radio) => {
    radio.addEventListener("change", () => {
      if (radio.checked && !isSpinning) {
        AppConfig.layout = radio.value;
        saveConfig(AppConfig);
        render();
      }
    });
  });

  // ---- Modal dialog actions ----
  window.DOM.modalClose.addEventListener("click", () => hideModal());
  window.DOM.btnOk.addEventListener("click", () => hideModal());
  window.DOM.btnSpeak.addEventListener("click", () => {
    const text = window.DOM.resultName.textContent || "";
    if (text) tts.speak(text);
  });

  // ---- Config Panel: Populate config values and show panel ----
  window.DOM.btnConfig.addEventListener("click", () => {
    window.DOM.shortcutsPanel.hidden = true;
    window.DOM.studentsPanel.hidden = true;
    window.DOM.cfgDuration.value = AppConfig.spinDurationSec;
    window.DOM.cfgMaxTicksPerSec.value = AppConfig.maxTicksPerSecond;
    window.DOM.cfgSoundTick.checked = !!AppConfig.sound.tick;
    window.DOM.cfgSoundWin.checked = !!AppConfig.sound.win;
    window.DOM.cfgExcludeAfterPick.checked = !!AppConfig.excludeAfterPick;
    if (window.DOM.cfgGridCols) window.DOM.cfgGridCols.value = AppConfig.gridCols ?? "";
    if (cfgLayoutRadios && cfgLayoutRadios.length)
      cfgLayoutRadios.forEach(
        (r) => (r.checked = r.value === AppConfig.layout)
      );
    window.DOM.cfgAvatarSize.value = AppConfig.avatarSize;
    uiAvatarSizePreview = null;
    window.DOM.sidePanel.hidden = false;
  });

  window.DOM.cfgClose.addEventListener("click", () => {
    window.DOM.sidePanel.hidden = true;
    uiAvatarSizePreview = null;
    if (!isSpinning) render();
  });

  // ---- Config Save action ----
  window.DOM.cfgSave.addEventListener("click", () => {
    const dur = clamp(toNumber(cfgDuration.value, 4), 1, 20);
    const maxHz = Math.max(
      TIMING_PROFILE.minStartHz,
      toNumber(cfgMaxTicksPerSec.value, 20)
    );
    AppConfig.spinDurationSec = dur;
    AppConfig.maxTicksPerSecond = maxHz;
    AppConfig.sound.tick = !!cfgSoundTick.checked;
    AppConfig.sound.win = !!cfgSoundWin.checked;
    AppConfig.excludeAfterPick = !!cfgExcludeAfterPick.checked;
    // Lưu số cột grid (để trống => null)
    const c = Number(window.DOM.cfgGridCols?.value);
    AppConfig.gridCols = Number.isFinite(c) && c > 0 ? Math.min(50, Math.floor(c)) : null;
    AppConfig.layout =
      (cfgLayoutRadios && cfgLayoutRadios.find((r) => r.checked)?.value) ||
      AppConfig.layout;
    const avSize = Math.max(
      48,
      Math.min(200, Number(cfgAvatarSize.value) || AppConfig.avatarSize)
    );
    AppConfig.avatarSize = avSize;
    uiAvatarSizePreview = null;
    if (window.DOM.layoutSelect) window.DOM.layoutSelect.value = AppConfig.layout;
    saveConfig(AppConfig);
    window.DOM.sidePanel.hidden = true;
    if (!isSpinning) render();
  });

  // ---- Students panel actions ----
  window.DOM.btnStudents?.addEventListener("click", () => {
    window.DOM.shortcutsPanel.hidden = true;
    window.DOM.sidePanel.hidden = true;
    const override = loadStudentsOverride();
    window.DOM.cfgStudentList.value = override ? override.join("\n") : "";
    window.DOM.studentsPanel.hidden = false;
    // Enhance textarea UX khi mở panel: font monospace nhẹ, autosize và cập nhật đếm
    try {
      if (window.DOM.cfgStudentList) {
        window.DOM.cfgStudentList.style.fontFamily = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';
        autoSizeStudentTextarea();
        updateStudentCount();
      }
    } catch (_) {}
  });
  window.DOM.studentsClose?.addEventListener("click", () => {
    window.DOM.studentsPanel.hidden = true;
  });
  window.DOM.cfgStudentsApply?.addEventListener("click", () => {
    const lines = (cfgStudentList.value || "")
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    // Chấp nhận mọi tên (có hoặc không có phần mở rộng)
    const valid = lines; // Không cần filter bằng regex nữa
    saveStudentsOverride(valid);
    window.students = buildStudents();
    excluded = excluded.filter((id) => valid.includes(id));
    saveExcluded(excluded);
    lastRemoved = null;
    render();
  });

  // ---- Students textarea live helpers ----
  function getStudentLines() {
    return (cfgStudentList.value || "")
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }

  function updateStudentCount() {
    if (!window.DOM.studentCount) return;
    const count = getStudentLines().length;
    window.DOM.studentCount.textContent = String(count);
  }

  function autoSizeStudentTextarea() {
    if (!window.DOM.cfgStudentList) return;
    const ta = window.DOM.cfgStudentList;
    ta.style.height = 'auto';
    ta.style.height = Math.min(400, Math.max(160, ta.scrollHeight)) + 'px';
  }

  window.DOM.cfgStudentList?.addEventListener('input', () => {
    autoSizeStudentTextarea();
    updateStudentCount();
  });

  // ---- Live preview avatar size ----
  let avatarSizeSaveTimeout = null;
  window.DOM.cfgAvatarSize?.addEventListener("input", () => {
    const v = clamp(
      toNumber(cfgAvatarSize.value, AppConfig.avatarSize),
      48,
      200
    );
    cfgAvatarSize.value = String(v);
    uiAvatarSizePreview = v;
    if (!isSpinning) render();
    
    // Auto-save to store after 500ms delay (debounce)
    if (avatarSizeSaveTimeout) clearTimeout(avatarSizeSaveTimeout);
    avatarSizeSaveTimeout = setTimeout(() => {
      AppConfig.avatarSize = v;
      saveConfig(AppConfig);
      uiAvatarSizePreview = null; // Clear preview since it's now saved
    }, 500);
  });

  // ---- Live preview grid columns + autosave ----
  const handleGridColsChange = () => {
    const c = Number(window.DOM.cfgGridCols?.value);
    AppConfig.gridCols = Number.isFinite(c) && c > 0 ? Math.min(50, Math.floor(c)) : null;
    saveConfig(AppConfig);
    if (!isSpinning) render();
  };
  window.DOM.cfgGridCols?.addEventListener("input", handleGridColsChange);
  window.DOM.cfgResetDefaults?.addEventListener("click", () => {
    cfgDuration.value = 4.0;
    cfgMaxTicksPerSec.value = 20;
    cfgSoundTick.checked = true;
    cfgSoundWin.checked = true;
    cfgExcludeAfterPick.checked = true;
    cfgLayout.value = "circle";
    cfgAvatarSize.value = 96;
    uiAvatarSizePreview = 96;
    if (!isSpinning) render();
  });

  // ---- Shortcuts panel binding ----
  window.DOM.btnShortcuts?.addEventListener("click", () => {
    window.DOM.sidePanel.hidden = true;
    window.DOM.studentsPanel.hidden = true;
    window.DOM.shortcutsPanel.hidden = false;
  });
  window.DOM.shortcutsClose?.addEventListener("click", () => {
    window.DOM.shortcutsPanel.hidden = true;
  });
};
