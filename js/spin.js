// Spin logic
window.isSpinning = false;
window.highlightIndex = -1;
window.currentList = [];

// Get all avatar nodes currently used for highlighting based on layout
window.getAvatarNodes = function () {
  const layout = AppConfig.layout;
  if (layout === "circle")
    return Array.from(window.DOM.elCircle.querySelectorAll(".avatar"));
  return Array.from(window.DOM.elGrid.querySelectorAll(".avatar"));
};

// Highlight avatar at provided index, remove highlight from all others
window.setHighlight = function (idx) {
  const nodes = getAvatarNodes();
  nodes.forEach((n) => n.classList.remove("highlight"));
  if (idx >= 0 && idx < nodes.length) nodes[idx].classList.add("highlight");
};

// Randomly choose a winner (index) from total students
window.chooseWinnerIndex = function (total) {
  return Math.floor(Math.random() * total);
};

// Main spinning function: randomize, animate highlight and pick winner
window.spinOnce = async function () {
  if (isSpinning) return;
  currentList = students.filter((s) => !excluded.includes(s.id));
  if (currentList.length === 0) return;

  isSpinning = true;
  window.DOM.btnStart.disabled = true;
  if (window.DOM.layoutSelect) window.DOM.layoutSelect.disabled = true;
  const total = currentList.length;
  let winnerIdx = chooseWinnerIndex(total);
  const duration = clamp(toNumber(AppConfig.spinDurationSec, 4), 1, 20);
  const maxHz = Math.max(
    window.TIMING_PROFILE.minStartHz,
    toNumber(AppConfig.maxTicksPerSecond, 20)
  );
  const accelPortion = window.TIMING_PROFILE.accelPortion;
  const decelPortion = window.TIMING_PROFILE.decelPortion;
  const steadyPortion = 1 - accelPortion - decelPortion;
  const t0 = performance.now();
  let lastTickTime = t0;
  let elapsed = 0;
  let idx = highlightIndex >= 0 ? highlightIndex : 0;
  // Calculate highlight interval (Hz) based on animation phase
  function phaseHz(tNorm) {
    if (tNorm < accelPortion) {
      const p = tNorm / accelPortion;
      return (
        window.TIMING_PROFILE.minStartHz +
        (maxHz - window.TIMING_PROFILE.minStartHz) * p * p
      );
    }
    if (tNorm < accelPortion + steadyPortion) return maxHz;
    const p = (tNorm - accelPortion - steadyPortion) / decelPortion;
    return Math.max(
      window.TIMING_PROFILE.minEndHz,
      maxHz * (1 - Math.pow(p, 2.9))
    );
  }
  return new Promise((resolve) => {
    const step = (now) => {
      if (!isSpinning) return resolve();
      elapsed = (now - t0) / 1000;
      const tNorm = Math.min(1, elapsed / duration);
      const hz = phaseHz(tNorm);
      const intervalMs = 1000 / hz;
      if (now - lastTickTime >= intervalMs) {
        idx = (idx + 1) % total;
        highlightIndex = idx;
        setHighlight(idx);
        sounds.tick();
        lastTickTime = now;
      }
      if (elapsed < duration) {
        requestAnimationFrame(step);
      } else {
        idx = winnerIdx;
        highlightIndex = idx;
        setHighlight(idx);
        sounds.win();
        const picked = currentList[idx];
        // Mark winner node and fire confetti
        const nodes = getAvatarNodes();
        nodes.forEach((n) => n.classList.remove("win"));
        const winNode = nodes[idx];
        if (winNode) {
          winNode.classList.add("win");
          confettiAtElement?.(winNode);
          setTimeout(() => winNode.classList.remove("win"), 2500);
        }
        showResult(picked);
        if (AppConfig.excludeAfterPick) {
          excluded = Array.from(new Set([...excluded, picked.id]));
          lastRemoved = picked.id;
          saveExcluded(excluded);
        } else {
          lastRemoved = null;
        }
        isSpinning = false;
        window.DOM.btnStart.disabled = false;
        if (window.DOM.layoutSelect) window.DOM.layoutSelect.disabled = false;
        render();
        resolve();
      }
    };
    requestAnimationFrame(step);
  });
};
