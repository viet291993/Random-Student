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
    AppConfig.layout =
      (cfgLayoutRadios && cfgLayoutRadios.find((r) => r.checked)?.value) ||
      AppConfig.layout;
    const avSize = Math.max(
      48,
      Math.min(200, Number(cfgAvatarSize.value) || AppConfig.avatarSize)
    );
    AppConfig.avatarSize = avSize;
    uiAvatarSizePreview = null;
    if (layoutSelect) layoutSelect.value = AppConfig.layout;
    saveConfig(AppConfig);
    sidePanel.hidden = true;
    if (!isSpinning) render();
  });

  // ---- Students panel actions ----
  window.DOM.btnStudents?.addEventListener("click", () => {
    window.DOM.shortcutsPanel.hidden = true;
    window.DOM.sidePanel.hidden = true;
    const override = loadStudentsOverride();
    window.DOM.cfgStudentList.value = override ? override.join("\n") : "";
    window.DOM.studentsPanel.hidden = false;
  });
  window.DOM.studentsClose?.addEventListener("click", () => {
    window.DOM.studentsPanel.hidden = true;
  });
  window.DOM.cfgStudentsApply?.addEventListener("click", () => {
    const lines = (cfgStudentList.value || "")
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    const valid = lines.filter((s) => /\.[a-zA-Z0-9]{2,5}$/.test(s));
    saveStudentsOverride(valid);
    students = buildStudents();
    excluded = excluded.filter((id) => valid.includes(id));
    saveExcluded(excluded);
    lastRemoved = null;
    render();
  });
  window.DOM.cfgStudentsClear?.addEventListener("click", () => {
    clearStudentsOverride();
    cfgStudentList.value = "";
    students = buildStudents();
    render();
  });
  window.DOM.btnImportList?.addEventListener("click", () => {
    fileImportInput?.click();
  });
  window.DOM.fileImportInput?.addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result || "");
        let list = [];
        if (file.name.toLowerCase().endsWith(".json")) {
          const arr = JSON.parse(text);
          if (Array.isArray(arr)) list = arr;
        } else {
          list = text
            .split(/\r?\n/)
            .map((s) => s.trim())
            .filter((s) => s.length > 0);
        }
        cfgStudentList.value = list.join("\n");
      } catch (_) {}
    };
    reader.readAsText(file, "utf-8");
    e.target.value = "";
  });
  window.DOM.btnExportList?.addEventListener("click", () => {
    let lines = [];
    const override = loadStudentsOverride();
    if (override && override.length) lines = override;
    else if (cfgStudentList?.value) {
      lines = cfgStudentList.value
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    } else {
      lines = [...STUDENT_IMAGES];
    }
    const content = lines.join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "students.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  // ---- Live preview avatar size ----
  window.DOM.cfgAvatarSize?.addEventListener("input", () => {
    const v = clamp(
      toNumber(cfgAvatarSize.value, AppConfig.avatarSize),
      48,
      200
    );
    cfgAvatarSize.value = String(v);
    uiAvatarSizePreview = v;
    if (!isSpinning) render();
  });
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
