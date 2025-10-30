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
  btnTTS: document.getElementById("btnTTS"),
  voiceSelect: document.getElementById("voiceSelect"),
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
  studentCount: document.getElementById("studentCount"),
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
  // Xóa fallback cũ nếu có
  if (window.DOM.resultImage.nextSibling && window.DOM.resultImage.nextSibling.classList?.contains('result-fallback')) {
    window.DOM.resultImage.nextSibling.remove();
  }
  // Reset lại ảnh
  window.DOM.resultImage.style.display = '';
  window.DOM.resultImage.src = item.url;
  window.DOM.resultImage.alt = item.name;
  window.DOM.resultImage.onerror = function () {
    // Ẩn ảnh, show SVG trophy
    this.style.display = 'none';
    let fb = document.createElement('div');
    fb.className = 'result-fallback';
    fb.style.display = 'flex';
    fb.style.justifyContent = 'center';
    fb.style.alignItems = 'center';
    fb.style.width = '160px';
    fb.style.height = '160px';
    fb.style.margin = '0 auto 12px auto';
    fb.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="140" height="140" viewBox="0 0 128 128" style="display:block;margin:auto;">
        <defs>
          <radialGradient id="goldGrad" cx="50%" cy="40%" r="70%">
            <stop offset="0%" stop-color="#fff6b3"/>
            <stop offset="45%" stop-color="#ffe066"/>
            <stop offset="85%" stop-color="#ffd000"/>
            <stop offset="100%" stop-color="#caa105"/>
          </radialGradient>
          <linearGradient id="baseGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#b78a28"/>
            <stop offset="100%" stop-color="#8a6a20"/>
          </linearGradient>
          <linearGradient id="stemGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#ffe066"/>
            <stop offset="100%" stop-color="#e0b800"/>
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.25"/>
          </filter>
        </defs>
        <!-- shadow ellipse -->
        <ellipse cx="64" cy="114" rx="34" ry="6" fill="#000" opacity="0.15"/>
        <!-- handles -->
        <path d="M20,36 q-8,14 4,28 q9,10 26,10" fill="none" stroke="#e6c100" stroke-width="6" stroke-linecap="round"/>
        <path d="M108,36 q8,14 -4,28 q-9,10 -26,10" fill="none" stroke="#e6c100" stroke-width="6" stroke-linecap="round"/>
        <!-- cup body -->
        <g filter="url(#shadow)">
          <ellipse cx="64" cy="28" rx="34" ry="10" fill="url(#goldGrad)" stroke="#bfa642" stroke-width="2"/>
          <path d="M30 30 q0 34 34 44 q34-10 34-44 z" fill="url(#goldGrad)" stroke="#bfa642" stroke-width="2"/>
        </g>
        <!-- stem -->
        <rect x="52" y="74" width="24" height="12" rx="4" fill="url(#stemGrad)" stroke="#bfa642" stroke-width="2"/>
        <rect x="56" y="64" width="16" height="12" rx="3" fill="#ffd84d" stroke="#bfa642" stroke-width="1.5"/>
        <!-- base -->
        <g filter="url(#shadow)">
          <rect x="40" y="92" width="48" height="10" rx="3" fill="url(#baseGrad)"/>
          <rect x="34" y="102" width="60" height="8" rx="3" fill="#6b5120"/>
        </g>
        <!-- highlights -->
        <path d="M44,40 q8,-10 18,-12" stroke="#fff9d1" stroke-width="3" fill="none" opacity="0.9" stroke-linecap="round"/>
        <path d="M84,46 q-6,8 -14,12" stroke="#fff3a0" stroke-width="2" fill="none" opacity="0.7" stroke-linecap="round"/>
        <!-- sparkles -->
        <g fill="#fff6b3" opacity="0.9">
          <path d="M18 28 l3 5 l-5 3 l5 3 l-3 5 l5 -3 l3 5 l3 -5 l5 3 l-3 -5 l5 -3 l-5 -3 l3 -5 l-5 3 l-3 -5 l-3 5 z" transform="scale(0.15) translate(300, 150)"/>
          <path d="M18 28 l3 5 l-5 3 l5 3 l-3 5 l5 -3 l3 5 l3 -5 l5 3 l-3 -5 l5 -3 l-5 -3 l3 -5 l-5 3 l-3 -5 l-3 5 z" transform="scale(0.12) translate(760, 120)"/>
        </g>
      </svg>
    `;
    window.DOM.resultImage.parentNode.insertBefore(fb, window.DOM.resultImage.nextSibling);
  };
  window.DOM.resultName.textContent = item.name;
  showModal();
  if (window.AppConfig?.tts?.enabled) tts.speak(item.name);
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

// TTS UI bindings
function populateVoices() {
  if (!window.DOM.voiceSelect || !("speechSynthesis" in window)) return;
  const sel = window.DOM.voiceSelect;
  const prev = sel.value;
  sel.innerHTML = "";
  const voices = window.speechSynthesis.getVoices();
  // Filter chỉ giọng Việt Nam
  const viVoices = voices.filter((v) => v.lang && v.lang.toLowerCase().startsWith("vi"));
  viVoices.forEach((v) => {
    const opt = document.createElement("option");
    opt.value = v.voiceURI;
    opt.textContent = `${v.name} (${v.lang})`;
    sel.appendChild(opt);
  });
  const want = window.AppConfig?.tts?.voiceURI;
  if (want && viVoices.find((v) => v.voiceURI === want)) sel.value = want;
  else if (prev && viVoices.find((v) => v.voiceURI === prev)) sel.value = prev;
}

function syncTTSToggleUI() {
  if (!window.DOM.btnTTS) return;
  const on = !!window.AppConfig?.tts?.enabled;
  const icon = window.DOM.btnTTS.querySelector(".material-icons-round");
  if (icon) icon.textContent = on ? "record_voice_over" : "voice_over_off";
  window.DOM.btnTTS.title = on ? "Tắt TTS" : "Bật TTS";
}

if (window.DOM.btnTTS) {
  window.DOM.btnTTS.addEventListener("click", () => {
    const now = !(window.AppConfig?.tts?.enabled);
    if (!window.AppConfig.tts) window.AppConfig.tts = { enabled: now, voiceURI: null };
    window.AppConfig.tts.enabled = now;
    if (window.tts && typeof window.tts.setEnabled === "function") tts.setEnabled(now);
    if (typeof window.saveConfig === "function") saveConfig(window.AppConfig);
    syncTTSToggleUI();
  });
  syncTTSToggleUI();
}

if (window.DOM.voiceSelect) {
  window.DOM.voiceSelect.addEventListener("change", (e) => {
    const uri = e.target.value;
    if (window.tts && typeof window.tts.setVoiceByURI === "function") tts.setVoiceByURI(uri);
  });
  populateVoices();
  if ("speechSynthesis" in window) {
    window.speechSynthesis.addEventListener("voiceschanged", populateVoices);
  }
}

// Global handler: gracefully handle broken IMG resources (e.g., net::ERR_FILE_NOT_FOUND)
// Hide the broken image and add a text fallback if not already handled locally
window.addEventListener(
  "error",
  (event) => {
    const target = event && event.target;
    if (!target || !(target instanceof HTMLElement)) return;
    if (target.tagName !== "IMG") return;
    // Skip result image (handled specially in showResult)
    if (target.id === "resultImage") return;
    // Avoid duplicate injection
    if (target.dataset && target.dataset._handledError === "1") return;
    target.dataset._handledError = "1";
    try {
      const parent = target.parentElement;
      if (!parent) return;
      if (parent.querySelector && parent.querySelector('.avatar-fallback')) return;
      target.style.display = "none";
      const fb = document.createElement("div");
      fb.className = "avatar-fallback";
      fb.textContent = target.getAttribute("alt") || "Không tìm thấy";
      parent.appendChild(fb);
    } catch (_) {}
  },
  true
);
