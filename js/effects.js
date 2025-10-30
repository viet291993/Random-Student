// Simple confetti effect
(function () {
  // Render confetti effect at x, y with customizable options
  function confettiAt(x, y, opts = {}) {
    const count = opts.count ?? 120;
    const duration = opts.duration ?? 900;
    const gravity = opts.gravity ?? 1200; // px/s^2
    const spread = opts.spread ?? Math.PI;
    const colors = opts.colors || [
      "#22c55e",
      "#38bdf8",
      "#a78bfa",
      "#ef4444",
      "#f59e0b",
    ];

    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.inset = "0";
    canvas.style.pointerEvents = "none";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    // Create all particles with random properties
    const particles = [];
    for (let i = 0; i < count; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * spread;
      const speed = 300 + Math.random() * 300;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: 2 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: duration,
      });
    }

    const start = performance.now();
    // Animate/confetti particles
    function tick(now) {
      const t = now - start;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        const dt = 16; // ms approx
        p.vy += (gravity * dt) / 1000;
        p.x += (p.vx * dt) / 1000;
        p.y += (p.vy * dt) / 1000;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      if (t < duration) requestAnimationFrame(tick);
      else canvas.remove();
    }
    requestAnimationFrame(tick);
  }

  // Helper: Run confetti effect centered at given DOM element
  window.confettiAtElement = function (el) {
    try {
      const rect = el.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      confettiAt(x, y);
    } catch (_) {
      confettiAt(window.innerWidth / 2, window.innerHeight / 2);
    }
  };
})();
