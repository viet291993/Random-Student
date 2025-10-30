// DOM refs grouped for better code hygiene
window.DOM = {
  elCircle: document.getElementById("circleContainer"),
  elGrid: document.getElementById("gridContainer"),
  btnStart: document.getElementById("btnStart"),
  btnUndo: document.getElementById("btnUndo"),
  btnReset: document.getElementById("btnReset"),
  layoutSelect: document.getElementById("layoutSelect"),
  btnFullscreen: document.getElementById("btnFullscreen"),
  btnConfig: document.getElementById("btnConfig"),
  btnStudents: document.getElementById("btnStudents"),
  btnShortcuts: document.getElementById("btnShortcuts"),
  sidePanel: document.getElementById("configPanel"),
  cfgClose: document.getElementById("configClose"),
  cfgSave: document.getElementById("cfgSave"),
  cfgDuration: document.getElementById("cfgDuration"),
  cfgMaxTicksPerSec: document.getElementById("cfgMaxTicksPerSec"),
  cfgSoundTick: document.getElementById("cfgSoundTick"),
  cfgSoundWin: document.getElementById("cfgSoundWin"),
  cfgExcludeAfterPick: document.getElementById("cfgExcludeAfterPick"),
  cfgLayout: document.getElementById("cfgLayout"),
  cfgAvatarSize: document.getElementById("cfgAvatarSize"),
  studentsPanel: document.getElementById("studentsPanel"),
  studentsClose: document.getElementById("studentsClose"),
  cfgStudentList: document.getElementById("cfgStudentList"),
  cfgStudentsApply: document.getElementById("cfgStudentsApply"),
  cfgStudentsClear: document.getElementById("cfgStudentsClear"),
  btnImportList: document.getElementById("btnImportList"),
  btnExportList: document.getElementById("btnExportList"),
  fileImportInput: document.getElementById("fileImportInput"),
  shortcutsPanel: document.getElementById("shortcutsPanel"),
  shortcutsClose: document.getElementById("shortcutsClose"),
  cfgResetDefaults: document.getElementById("cfgResetDefaults"),
  modal: document.getElementById("resultModal"),
  modalClose: document.getElementById("modalClose"),
  btnOk: document.getElementById("btnOk"),
  btnSpeak: document.getElementById("btnSpeak"),
  resultImage: document.getElementById("resultImage"),
  resultName: document.getElementById("resultName"),
  btnHideToolbar: document.getElementById("btnHideToolbar"),
  btnShowToolbar: document.getElementById("btnShowToolbar"),
};

// UI state
window.uiAvatarSizePreview = null;

window.getAvatarSize = function () {
  return uiAvatarSizePreview ?? AppConfig.avatarSize;
};

// Rendering
window.cfgLayoutRadios = [
  document.getElementById("layoutCircle"),
  document.getElementById("layoutGrid"),
];

window.render = function () {
  const available = window.students.filter(
    (s) => !window.excluded.includes(s.id)
  );
  window.DOM.btnUndo.disabled = !window.lastRemoved;
  const layout = AppConfig.layout;
  if (window.cfgLayoutRadios && window.cfgLayoutRadios.length) {
    window.cfgLayoutRadios.forEach((r) => (r.checked = r.value === layout));
  }
  window.DOM.elCircle.hidden = layout !== "circle";
  window.DOM.elGrid.hidden = layout !== "grid";
  if (layout === "circle") renderCircle(available);
  else renderGrid(available);
};

window.renderCircle = function (available) {
  window.DOM.elCircle.innerHTML = "";
  const N = available.length;
  const CIRCLE_PADDING = 6;
  // Auto avatar size khi N lớn (ưu tiên lấy preview nếu có, sau đó giảm dần đến min)
  let avSize = window.uiAvatarSizePreview ?? AppConfig.avatarSize;
  if (N >= 18) avSize = Math.max(44, Math.round((220 / N) * 5));
  if (N > 40) avSize = 28;
  const radius =
    Math.min(
      window.DOM.elCircle.clientWidth,
      window.DOM.elCircle.clientHeight
    ) /
      2 -
    avSize / 2 -
    CIRCLE_PADDING;
  const centerX = window.DOM.elCircle.clientWidth / 2;
  const centerY = window.DOM.elCircle.clientHeight / 2;
  const LABEL_EXTRA_OFFSET = 16;
  const labelOffset = avSize / 2 + LABEL_EXTRA_OFFSET;
  // Tính xem ẩn tên hay không
  const hideName = avSize < 44 || N > 30;
  const alwaysShow = avSize > 80;
  available.forEach((s, idx) => {
    const angle = (idx / N) * Math.PI * 2 - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    const wrapper = document.createElement("div");
    wrapper.className = "avatar";
    wrapper.style.width = `${avSize}px`;
    wrapper.style.height = `${avSize}px`;
    wrapper.style.left = `${x}px`;
    wrapper.style.top = `${y}px`;
    const img = document.createElement("img");
    img.src = s.url;
    img.alt = s.name;
    img.addEventListener("error", () => {
      img.remove();
      const fb = document.createElement("div");
      fb.className = "avatar-fallback";
      fb.textContent = s.name;
      wrapper.appendChild(fb);
    });
    wrapper.appendChild(img);
    // Nhãn tên
    const label = document.createElement("div");
    label.className = "name-tag";
    label.textContent = s.name;
    label.style.left = `${x}px`;
    label.style.top = `${y + labelOffset}px`;
    if (hideName && !alwaysShow) {
      label.style.opacity = 0;
      wrapper.title = s.name;
      wrapper.addEventListener("mouseenter", () => {
        label.style.opacity = 1;
      });
      wrapper.addEventListener("mouseleave", () => {
        label.style.opacity = 0;
      });
    } else {
      label.style.opacity = 1;
    }
    window.DOM.elCircle.appendChild(wrapper);
    window.DOM.elCircle.appendChild(label);
  });
};

window.renderGrid = function (available) {
  window.DOM.elGrid.innerHTML = "";
  available.forEach((s) => {
    const wrapper = document.createElement("div");
    wrapper.className = "avatar";
    wrapper.style.width = `${getAvatarSize()}px`;
    wrapper.style.height = `${getAvatarSize()}px`;
    const img = document.createElement("img");
    img.src = s.url;
    img.alt = s.name;
    img.addEventListener("error", () => {
      img.remove();
      const fb = document.createElement("div");
      fb.className = "avatar-fallback";
      fb.textContent = s.name;
      wrapper.appendChild(fb);
    });
    wrapper.title = s.name;
    wrapper.appendChild(img);
    window.DOM.elGrid.appendChild(wrapper);
  });
};

// Modal helpers
window.showModal = function () {
  window.DOM.modal.hidden = false;
};
window.hideModal = function () {
  window.DOM.modal.hidden = true;
};
window.showResult = function (item) {
  window.DOM.resultImage.src = item.url;
  window.DOM.resultName.textContent = item.name;
  showModal();
  tts.speak(item.name);
};

// Event hide/show toolbar - presentation mode
if (window.DOM.btnHideToolbar) {
  window.DOM.btnHideToolbar.addEventListener("click", () => {
    document.body.classList.add("presentation-hide-toolbar");
    window.DOM.btnShowToolbar.style.display = "";
  });
}
if (window.DOM.btnShowToolbar) {
  window.DOM.btnShowToolbar.addEventListener("click", () => {
    document.body.classList.remove("presentation-hide-toolbar");
    window.DOM.btnShowToolbar.style.display = "none";
  });
}
