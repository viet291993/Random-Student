// Global keyboard shortcuts
document.addEventListener("keydown", (e) => {
  const tag =
    e.target && e.target.tagName ? e.target.tagName.toLowerCase() : "";
  const isTyping =
    tag === "input" || tag === "textarea" || tag === "select" || e.isComposing;
  if (isTyping) return;
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  switch (e.key) {
    case " ":
      e.preventDefault();
      if (!isSpinning) window.DOM.btnStart.click();
      break;
    case "u":
    case "U":
      window.DOM.btnUndo.click();
      break;
    case "r":
    case "R":
      window.DOM.btnReset.click();
      break;
    case "f":
    case "F":
      e.preventDefault();
      window.DOM.btnFullscreen.click();
      break;
    case "c":
    case "C":
      window.DOM.btnConfig.click();
      break;
    case "d":
    case "D":
      window.DOM.btnStudents?.click();
      break;
    default:
      break;
  }
});
