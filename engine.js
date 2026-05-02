// ==================== STATE ====================
let userVector = { control: 50, energy: 50, focus: 50, method: 50 };
let brandPosition = { x: 0.5, y: 0.5 }; // normalized 0..1 in the field
let isDraggingBrand = false;
let isDraggingJog = false;
let jogDragDim = null;
let animationId = null;
let time = 0;

// ==================== DISTANCE ====================
function calcDistance(user, a) {
  return (
    Math.abs(user.control - a.vector.control) * a.weights.control +
    Math.abs(user.energy - a.vector.energy) * a.weights.energy +
    Math.abs(user.focus - a.vector.focus) * a.weights.focus +
    Math.abs(user.method - a.vector.method) * a.weights.method
  );
}

function getRankings() {
  const ranked = archetypes
    .map((a) => ({ ...a, distance: calcDistance(userVector, a) }))
    .sort((a, b) => a.distance - b.distance);
  return {
    primary: ranked[0],
    secondary: ranked[1],
    conflict: ranked[ranked.length - 1],
    all: ranked,
  };
}

// ==================== FIELD POSITIONS ====================
// 2D projection of 4D archetype vectors using PCA-like layout
// We position archetypes based on their vectors on a 2D plane:
// X axis = (Control - Focus) normalized
// Y axis = (Energy - Method) normalized
function getArchetypeFieldPosition(a) {
  const v = a.vector;
  // Map 4D → 2D using meaningful axis combinations
  const xRaw = (v.control - v.focus) / 100; // left=high focus, right=high control
  const yRaw = (v.energy - v.method) / 100; // top=high method, bottom=high energy

  // Scale and clamp into reasonable field space (margins 0.1 to 0.9)
  const x = clamp(0.5 + xRaw * 0.55, 0.12, 0.88);
  const y = clamp(0.5 - yRaw * 0.55, 0.12, 0.88);
  return { x, y };
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

// ==================== CANVAS DRAWING ====================
const canvas = document.getElementById("field-canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  const field = document.getElementById("panel-field");
  const rect = field.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = rect.width + "px";
  canvas.style.height = rect.height + "px";
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
}

function fieldW() {
  return canvas.width / (window.devicePixelRatio || 1);
}
function fieldH() {
  return canvas.height / (window.devicePixelRatio || 1);
}

function drawField() {
  resizeCanvas();
  const W = fieldW();
  const H = fieldH();
  const r = getRankings();

  ctx.clearRect(0, 0, W, H);

  // ---- Subtle background grid ----
  const pc = window.__pivotCanvas; ctx.strokeStyle = pc ? pc.grid : "rgba(255,255,255,0.03)";
  ctx.lineWidth = 1;
  const gridSize = 40;
  for (let x = 0; x < W; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 0; y < H; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  // ---- Glow zones around primary archetype ----
  const primaryPos = getArchetypeFieldPosition(r.primary);
  const px = primaryPos.x * W;
  const py = primaryPos.y * H;

  const glowGrad = ctx.createRadialGradient(
    px,
    py,
    0,
    px,
    py,
    Math.min(W, H) * 0.35,
  );
  glowGrad.addColorStop(0, r.primary.color + "30");
  glowGrad.addColorStop(0.5, r.primary.color + "10");
  glowGrad.addColorStop(1, "transparent");
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, 0, W, H);

  // ---- Lines from brand to nearest archetypes ----
  const brandX = brandPosition.x * W;
  const brandY = brandPosition.y * H;

  const nearest = r.all.slice(0, 5);
  nearest.forEach((a, i) => {
    const ap = getArchetypeFieldPosition(a);
    const ax = ap.x * W;
    const ay = ap.y * H;

    const alpha = 1 - i * 0.18;
    ctx.strokeStyle =
      a.color +
      Math.round(alpha * 80)
        .toString(16)
        .padStart(2, "0");
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(brandX, brandY);
    ctx.lineTo(ax, ay);
    ctx.stroke();
    ctx.setLineDash([]);
  });

  // ---- Primary connection line (solid, brighter) ----
  ctx.strokeStyle = r.primary.color + "aa";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(brandX, brandY);
  ctx.lineTo(px, py);
  ctx.stroke();

  // ---- Archetype dots ----
  archetypes.forEach((a) => {
    const pos = getArchetypeFieldPosition(a);
    const ax = pos.x * W;
    const ay = pos.y * H;

    const isPrimary = a.id === r.primary.id;
    const isSecondary = a.id === r.secondary.id;
    const isConflict = a.id === r.conflict.id;

    // Pulsation
    const pulse = isPrimary
      ? 1 + Math.sin(time * 0.04 + archetypes.indexOf(a)) * 0.35
      : isSecondary
        ? 1 + Math.sin(time * 0.03 + archetypes.indexOf(a)) * 0.2
        : 1 + Math.sin(time * 0.02 + archetypes.indexOf(a)) * 0.12;

    const baseRadius = isPrimary ? 7 : isSecondary ? 5.5 : 4;
    const radius = baseRadius * pulse;

    // Outer glow
    if (isPrimary) {
      const glow = ctx.createRadialGradient(
        ax,
        ay,
        radius * 0.5,
        ax,
        ay,
        radius * 3.5,
      );
      glow.addColorStop(0, a.color + "cc");
      glow.addColorStop(0.5, a.color + "40");
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(ax, ay, radius * 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    if (isSecondary) {
      const glow = ctx.createRadialGradient(
        ax,
        ay,
        radius * 0.5,
        ax,
        ay,
        radius * 2.5,
      );
      glow.addColorStop(0, a.color + "88");
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(ax, ay, radius * 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    if (isConflict) {
      const glow = ctx.createRadialGradient(
        ax,
        ay,
        radius * 0.3,
        ax,
        ay,
        radius * 2,
      );
      glow.addColorStop(0, "#ff505088");
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(ax, ay, radius * 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Dot itself
    ctx.fillStyle = a.color;
    ctx.shadowColor = a.color;
    ctx.shadowBlur = isPrimary ? 18 : isSecondary ? 10 : 4;
    ctx.beginPath();
    ctx.arc(ax, ay, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // White center for primary & secondary
    if (isPrimary || isSecondary) {
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(ax, ay, radius * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Label
    ctx.fillStyle = isPrimary ? "#ffffff" : "rgba(255,255,255,0.6)";
    ctx.font = `${isPrimary ? "11" : "9"}px Manrope, Inter, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(a.nameRu, ax, ay - radius - 8);
  });

  // ---- Brand dot (on canvas, mirrored from div) ----
  const bDotGlow = ctx.createRadialGradient(
    brandX,
    brandY,
    4,
    brandX,
    brandY,
    20,
  );
  bDotGlow.addColorStop(0, "rgba(255,255,255,0.9)");
  bDotGlow.addColorStop(0.5, "rgba(255,255,255,0.2)");
  bDotGlow.addColorStop(1, "transparent");
  ctx.fillStyle = bDotGlow;
  ctx.beginPath();
  ctx.arc(brandX, brandY, 20, 0, Math.PI * 2);
  ctx.fill();

  // ---- Axis labels ----
  ctx.fillStyle = "rgba(255,255,255,0.15)";
  ctx.font = "9px Manrope, Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("▲ Энергия", W / 2, 18);
  ctx.fillText("▼ Контроль", W / 2, H - 6);
  ctx.textAlign = "left";
  ctx.fillText("◄ Фокус", 10, H / 2 + 3);
  ctx.textAlign = "right";
  ctx.fillText("Метод ►", W - 10, H / 2 + 3);

  // ---- Crosshair at center ----
  ctx.strokeStyle = "rgba(255,255,255,0.04)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(W / 2, 15);
  ctx.lineTo(W / 2, H - 15);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(15, H / 2);
  ctx.lineTo(W - 15, H / 2);
  ctx.stroke();
}

// ==================== ANIMATION LOOP ====================
function animate() {
  time++;
  drawField();
  animationId = requestAnimationFrame(animate);
}

// ==================== BRAND DOT DRAG ====================
function initBrandDrag() {
  const brandDot = document.getElementById("brand-dot");
  const field = document.getElementById("panel-field");

  function getFieldPos(e) {
    const rect = field.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = clamp((clientX - rect.left) / rect.width, 0.02, 0.98);
    const y = clamp((clientY - rect.top) / rect.height, 0.02, 0.98);
    return { x, y };
  }

  function updateVectorFromBrandPos() {
    // Map brand position back to 4D vector
    // X axis: left = low Control/high Focus → right = high Control/low Focus
    // Y axis: top = high Energy/low Method → bottom = low Energy/high Method
    const xNorm = (brandPosition.x - 0.5) / 0.55; // roughly -1..1
    const yNorm = (0.5 - brandPosition.y) / 0.55; // roughly -1..1 (inverted: top → +Energy)

    userVector.control = clamp(
      Math.round(50 + xNorm * 40 + yNorm * 20),
      0,
      100,
    );
    userVector.energy = clamp(Math.round(50 + yNorm * 35 - xNorm * 15), 0, 100);
    userVector.focus = clamp(Math.round(50 - xNorm * 35 + yNorm * 10), 0, 100);
    userVector.method = clamp(Math.round(50 - yNorm * 30 - xNorm * 15), 0, 100);
  }

  function onStart(e) {
    if (e.target === brandDot || e.target.closest("#brand-dot")) {
      isDraggingBrand = true;
      brandDot.style.cursor = "grabbing";
      e.preventDefault();
    }
  }

  function onMove(e) {
    if (!isDraggingBrand) return;
    e.preventDefault();
    const pos = getFieldPos(e);
    brandPosition = pos;
    updateVectorFromBrandPos();
    updateAll();
  }

  function onEnd() {
    if (isDraggingBrand) {
      isDraggingBrand = false;
      document.getElementById("brand-dot").style.cursor = "grab";
    }
  }

  brandDot.addEventListener("mousedown", onStart);
  brandDot.addEventListener("touchstart", onStart, { passive: false });

  document.addEventListener("mousemove", onMove);
  document.addEventListener("touchmove", onMove, { passive: false });

  document.addEventListener("mouseup", onEnd);
  document.addEventListener("touchend", onEnd);

  // Click on empty field area moves brand dot
  field.addEventListener("mousedown", (e) => {
    if (e.target === field || e.target.id === "field-overlay") {
      isDraggingBrand = true;
      const pos = getFieldPos(e);
      brandPosition = pos;
      updateVectorFromBrandPos();
      updateAll();
    }
  });
  field.addEventListener(
    "touchstart",
    (e) => {
      if (e.target === field || e.target.id === "field-overlay") {
        isDraggingBrand = true;
        const pos = getFieldPos(e);
        brandPosition = pos;
        updateVectorFromBrandPos();
        updateAll();
      }
    },
    { passive: false },
  );
}

// ==================== JOG DIAL DRAG ====================
function initJogDials() {
  const dims = ["control", "energy", "focus", "method"];

  dims.forEach((dim) => {
    const track = document.getElementById("jog-track-" + dim);
    if (!track) return;

    function getAngleFromEvent(e) {
      const rect = track.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const dx = clientX - cx;
      const dy = clientY - cy;
      let angle = Math.atan2(dy, dx) * (180 / Math.PI);
      // Normalize to 0-360
      if (angle < 0) angle += 360;
      // Map angle to 0-100: start at -90° (top) going clockwise
      // Top = -90° = 0, Right = 0° = 25, Bottom = 90° = 50, Left = 180° = 75, Top = 270° = 100
      let val = ((angle + 90) % 360) / 3.6;
      return clamp(Math.round(val), 0, 100);
    }

    function onStart(e) {
      isDraggingJog = true;
      jogDragDim = dim;
      track.style.cursor = "grabbing";
      e.preventDefault();
    }

    function onMove(e) {
      if (!isDraggingJog || jogDragDim !== dim) return;
      e.preventDefault();
      const val = getAngleFromEvent(e);
      userVector[dim] = val;
      updateJogDialUI(dim);
      // Reverse-map: update brand position from vector
      updateBrandPositionFromVector();
      updateAll();
    }

    function onEnd() {
      if (isDraggingJog && jogDragDim === dim) {
        isDraggingJog = false;
        jogDragDim = null;
        track.style.cursor = "grab";
      }
    }

    track.addEventListener("mousedown", onStart);
    track.addEventListener("touchstart", onStart, { passive: false });
    document.addEventListener("mousemove", onMove);
    document.addEventListener("touchmove", onMove, { passive: false });
    document.addEventListener("mouseup", onEnd);
    document.addEventListener("touchend", onEnd);
  });
}

function updateJogDialUI(dim) {
  const val = userVector[dim];
  // Update SVG ring
  const ring = document.getElementById("jog-ring-fill-" + dim);
  if (ring) {
    const circumference = 301.59; // 2 * PI * 48
    const offset = circumference - (val / 100) * circumference;
    ring.setAttribute("stroke-dashoffset", offset);
    ring.setAttribute("stroke-dasharray", circumference);
  }
  // Update dot position
  const dot = document.getElementById("jog-dot-" + dim);
  const track = document.getElementById("jog-track-" + dim);
  if (dot && track) {
    const rect = track.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const r = cx - 8;
    // Angle: 0 at top (-90°), clockwise
    const angleRad = ((val / 100) * 360 - 90) * (Math.PI / 180);
    const dx = cx + Math.cos(angleRad) * r;
    const dy = cy + Math.sin(angleRad) * r;
    dot.style.left = dx + "px";
    dot.style.top = dy + "px";
  }
  // Update value text
  const valEl = document.getElementById("jog-val-" + dim);
  if (valEl) valEl.textContent = val;
}

function updateBrandPositionFromVector() {
  // Map 4D vector back to 2D position
  const xRaw = (userVector.control - userVector.focus) / 100;
  const yRaw = (userVector.energy - userVector.method) / 100;
  brandPosition.x = clamp(0.5 + xRaw * 0.55, 0.02, 0.98);
  brandPosition.y = clamp(0.5 - yRaw * 0.55, 0.02, 0.98);
}

// ==================== UPDATE ALL UI ====================
function updateAll() {
  const r = getRankings();

  // Update all jog dials visually
  ["control", "energy", "focus", "method"].forEach((d) => updateJogDialUI(d));

  // Update brand dot DOM position
  const brandDot = document.getElementById("brand-dot");
  const field = document.getElementById("panel-field");
  if (brandDot && field) {
    const rect = field.getBoundingClientRect();
    brandDot.style.left = brandPosition.x * rect.width + "px";
    brandDot.style.top = brandPosition.y * rect.height + "px";
  }

  // HUD status
  const statusText = document.getElementById("hud-status-text");
  if (statusText) statusText.textContent = r.primary.nameRu;

  // Primary card
  document.getElementById("output-primary-name").textContent = r.primary.nameRu;
  document.getElementById("output-primary-behavior").textContent =
    r.primary.behavior_model;
  const primaryDot = document.getElementById("output-primary-dot");
  primaryDot.style.background = r.primary.color;
  primaryDot.style.boxShadow = `0 0 12px ${r.primary.color}`;
  const primaryGlow = document.getElementById("output-primary-glow");
  if (primaryGlow) {
    primaryGlow.style.opacity = "1";
    primaryGlow.style.boxShadow = `inset 0 0 30px ${r.primary.color}30, 0 0 20px ${r.primary.color}20`;
  }
  const primaryCard = document.getElementById("output-primary");
  if (primaryCard) {
    primaryCard.style.borderColor = r.primary.color + "55";
  }

  // Secondary card
  document.getElementById("output-secondary-name").textContent =
    r.secondary.nameRu;
  const secondaryDot = document.getElementById("output-secondary-dot");
  secondaryDot.style.background = r.secondary.color;
  secondaryDot.style.boxShadow = `0 0 8px ${r.secondary.color}`;

  // Conflict card
  document.getElementById("output-conflict-name").textContent =
    r.conflict.nameRu;
  const conflictDot = document.getElementById("output-conflict-dot");
  conflictDot.style.background = r.conflict.color;
  conflictDot.style.boxShadow = `0 0 8px ${r.conflict.color}`;

  // Rules
  document.getElementById("rule-typography").textContent =
    r.primary.ui_rules.typography;
  document.getElementById("rule-spacing").textContent =
    r.primary.ui_rules.spacing;
  document.getElementById("rule-motion").textContent =
    r.primary.ui_rules.motion;
  document.getElementById("rule-visual").textContent =
    r.primary.ui_rules.visual;
}

// ==================== PRESETS ====================
function initPresets() {
  const grid = document.getElementById("presets-grid");
  if (!grid) return;

  grid.innerHTML = archetypes
    .map(
      (a) => `
        <div class="preset-dot"
             style="background:${a.color}; color:${a.color}; box-shadow: 0 0 8px ${a.color}50;"
             data-tooltip="${a.nameRu}"
             data-id="${a.id}"
             title="${a.nameRu}">
        </div>
    `,
    )
    .join("");

  grid.addEventListener("click", (e) => {
    const dot = e.target.closest(".preset-dot");
    if (!dot) return;
    const id = dot.dataset.id;
    const arch = archetypes.find((a) => a.id === id);
    if (!arch) return;

    // Animate to archetype vector
    animateToVector(arch.vector, () => {
      updateBrandPositionFromVector();
      updateAll();
    });
  });
}

function animateToVector(targetVector, callback) {
  const startVector = { ...userVector };
  const duration = 500; // ms
  const startTime = performance.now();

  function step(now) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const ease = 1 - Math.pow(1 - t, 3);

    ["control", "energy", "focus", "method"].forEach((d) => {
      userVector[d] = Math.round(
        startVector[d] + (targetVector[d] - startVector[d]) * ease,
      );
    });

    updateBrandPositionFromVector();
    updateAll();

    if (t < 1) {
      requestAnimationFrame(step);
    } else {
      ["control", "energy", "focus", "method"].forEach((d) => {
        userVector[d] = targetVector[d];
      });
      updateBrandPositionFromVector();
      updateAll();
      if (callback) callback();
    }
  }

  requestAnimationFrame(step);
}

// ==================== EXPORT / MODAL ====================
function generateSite() {
  const r = getRankings();
  const p = r.primary;

  const htmlTemplate = `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${p.nameRu} — Brand Archetype</title>
    <style>
        :root {
            --primary: ${p.color};
            --bg: #faf9f7;
            --text: #1a1a1a;
            --text-secondary: #6b6b6b;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Manrope', 'Inter', sans-serif; background: var(--bg); color: var(--text); }
        nav { display: flex; justify-content: space-between; align-items: center; padding: 16px 32px; border-bottom: 1px solid rgba(0,0,0,0.06); }
        .hero { text-align: center; padding: 120px 24px 80px; }
        .badge { display: inline-block; padding: 8px 18px; border-radius: 100px; background: var(--primary)15; color: var(--primary); font-size: 13px; font-weight: 500; margin-bottom: 24px; }
        h1 { font-size: clamp(32px, 5vw, 52px); font-weight: 300; letter-spacing: -1px; margin-bottom: 16px; }
        .subtitle { font-size: 16px; color: var(--text-secondary); max-width: 480px; margin: 0 auto 32px; line-height: 1.7; }
        .cta { display: inline-block; padding: 14px 36px; border-radius: 14px; background: var(--primary); color: #fff; font-size: 15px; font-weight: 500; text-decoration: none; }
        .blocks { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; max-width: 1000px; margin: 0 auto; padding: 60px 24px; }
        .block { padding: 32px; border-radius: 20px; border: 1px solid rgba(0,0,0,0.06); background: #fff; }
        .block h3 { font-size: 18px; font-weight: 500; margin-bottom: 12px; }
        .block p { font-size: 14px; color: var(--text-secondary); line-height: 1.7; }
        footer { text-align: center; padding: 40px 24px; border-top: 1px solid rgba(0,0,0,0.06); color: var(--text-secondary); font-size: 12px; }
    </style>
</head>
<body>
    <nav>
        <div style="font-weight:600; font-size:15px;">Brand</div>
        <div style="display:flex; gap:20px; font-size:13px;">
            <span>О нас</span><span>Услуги</span><span>Контакты</span>
        </div>
    </nav>
    <section class="hero">
        <div class="badge">${p.nameRu} Архетип</div>
        <h1>${p.heroText}</h1>
        <p class="subtitle">${p.heroSub}</p>
        <a href="#" class="cta">${p.ctaText}</a>
    </section>
    <section class="blocks">
        <div class="block">
            <h3>${p.ux_rules.structure.split(",")[0]}</h3>
            <p>${p.ux_rules.behavior}</p>
        </div>
        <div class="block">
            <h3>Типографика: ${p.ui_rules.typography}</h3>
            <p>${p.ui_rules.visual}</p>
        </div>
        <div class="block">
            <h3>Motion: ${p.ui_rules.motion}</h3>
            <p>${p.behavior_model}</p>
        </div>
    </section>
    <footer>Сгенерировано Brand Archetype OS · Архетип: ${p.nameRu}</footer>
</body>
</html>`;

  // Show modal
  const modalOverlay = document.getElementById("modal-overlay");
  const modalCode = document.getElementById("modal-code");
  const modalArchetype = document.getElementById("modal-archetype");

  modalArchetype.innerHTML = `
        <div class="modal-archetype-dot" style="background:${p.color}; box-shadow: 0 0 10px ${p.color};"></div>
        <span>${p.nameRu} · Primary архетип · [${userVector.control}, ${userVector.energy}, ${userVector.focus}, ${userVector.method}]</span>
    `;
  modalCode.textContent = htmlTemplate;
  modalOverlay.classList.add("active");
}

function closeModal() {
  document.getElementById("modal-overlay").classList.remove("active");
}

function downloadTemplate() {
  const code = document.getElementById("modal-code").textContent;
  const blob = new Blob([code], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const r = getRankings();
  a.download = `brand-${r.primary.id}-template.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ==================== MODAL CLOSE ON OVERLAY CLICK ====================
document
  .getElementById("modal-overlay")
  .addEventListener("click", function (e) {
    if (e.target === this) closeModal();
  });

// ==================== RESIZE HANDLER ====================
window.addEventListener("resize", () => {
  resizeCanvas();
});

// ==================== INIT ====================
document.addEventListener("DOMContentLoaded", () => {
  updateBrandPositionFromVector();
  initBrandDrag();
  initJogDials();
  initPresets();
  updateAll();
  resizeCanvas();
  animate();
});
