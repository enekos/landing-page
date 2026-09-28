// ----------------------------------------------------------------------------
//  Latent-field engine.
//
//  One renderer, two clouds. Everything on the page — both fields, the cipher
//  decoding, the name in the corner — is driven by a single animation clock,
//  because the old version ran a render loop per canvas plus one requestAnimationFrame
//  per decoding line, and the phone spent its budget context-switching between
//  them instead of drawing.
// ----------------------------------------------------------------------------

const mq = (q) => window.matchMedia(q).matches;

export const reducedMotion = mq("(prefers-reduced-motion: reduce)");
export const coarse = mq("(pointer: coarse)");
export const lowPower = coarse || mq("(max-width: 760px)") || (navigator.hardwareConcurrency || 8) <= 4;

export const TAU = Math.PI * 2;
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

// ---------------------------------------------------------------------------
//  One clock
// ---------------------------------------------------------------------------

const tasks = new Set();
let rafId = 0;
let prev = 0;

// Phones run a strict every-other-frame cadence. A steady 30fps reads calmer
// than a 60fps loop that drops every third frame — the jitter was never the
// frame rate, it was the variance.
const GATE = lowPower ? 28 : 0;

function beat(now) {
  rafId = 0;
  if (now - prev < GATE) {
    rafId = requestAnimationFrame(beat);
    return;
  }
  const dt = Math.min((now - prev) * 0.001, 0.05);
  prev = now;
  for (const fn of tasks) fn(now, dt);
  if (tasks.size && !document.hidden) rafId = requestAnimationFrame(beat);
}

function wake() {
  if (rafId || document.hidden || !tasks.size) return;
  prev = performance.now();
  rafId = requestAnimationFrame(beat);
}

export function addTask(fn) {
  tasks.add(fn);
  wake();
  return () => tasks.delete(fn);
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
  } else {
    wake();
  }
});

// ---------------------------------------------------------------------------
//  Cipher decoding
//
//  Text resolves out of noise. The old implementation rebuilt every string on
//  every animation frame, from a separate loop per line: five lines of prose
//  meant five reflows and five repaints of blurred text per frame. Now one
//  task walks every live line at ~22Hz and only touches the DOM when the
//  string actually changed.
// ---------------------------------------------------------------------------

const CIPHER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#%&*<>/\\=+~λΩ∅∴⊥π∂∇⊕≡⟨⟩".split("");
export const cipherGlyph = () => CIPHER[(Math.random() * CIPHER.length) | 0];

const DECODE_STEP = 45;
const SPAN = 600; // ms from first glyph resolving to last

export function decode(items) {
  if (reducedMotion) {
    for (const it of items) {
      it.el.textContent = it.text;
    }
    return () => {};
  }

  const live = items.map((it) => ({ ...it, out: "", done: false }));
  for (const it of live) it.el.classList.add("dec");

  const t0 = performance.now();
  let step = 0;
  const buf = [];

  const stop = addTask((now) => {
    if (now - step < DECODE_STEP) return;
    step = now;
    let pending = false;

    for (const it of live) {
      if (it.done) continue;
      const t = now - t0 - it.delay;
      const { text } = it;
      const len = text.length;
      buf.length = 0;
      let settled = true;

      for (let i = 0; i < len; i += 1) {
        const c = text[i];
        if (c === " ") {
          buf.push(" ");
        } else if (t >= (i / len) * SPAN + (i % 5) * 22) {
          buf.push(c);
        } else {
          buf.push(cipherGlyph());
          settled = false;
        }
      }

      const out = buf.join("");
      if (out !== it.out) {
        it.out = out;
        it.el.textContent = out;
      }
      if (settled) {
        it.done = true;
        it.el.classList.remove("dec");
      } else {
        pending = true;
      }
    }

    if (!pending) stop();
  });

  return stop;
}

// ---------------------------------------------------------------------------
//  Sprite caches
//
//  Every glow in the cloud is one cached bitmap stamped at a new size. Building
//  gradients per node per frame was the single most expensive thing the old
//  renderer did.
// ---------------------------------------------------------------------------

const glowCache = new Map();
const bloomCache = new Map();

function sprite(size, paint) {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  paint(c.getContext("2d"), size);
  return c;
}

export function glowSprite(hue) {
  let s = glowCache.get(hue);
  if (s) return s;
  s = sprite(64, (g, size) => {
    const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, `hsla(${hue}, 90%, 70%, 0.85)`);
    grad.addColorStop(0.4, `hsla(${hue}, 90%, 62%, 0.32)`);
    grad.addColorStop(1, `hsla(${hue}, 90%, 60%, 0)`);
    g.fillStyle = grad;
    g.fillRect(0, 0, size, size);
  });
  glowCache.set(hue, s);
  return s;
}

export function bloomSprite(hue) {
  let s = bloomCache.get(hue);
  if (s) return s;
  s = sprite(256, (g, size) => {
    const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, `hsla(${hue}, 85%, 60%, 0.22)`);
    grad.addColorStop(0.45, `hsla(${hue}, 70%, 45%, 0.05)`);
    grad.addColorStop(1, "hsla(0,0%,0%,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, size, size);
  });
  bloomCache.set(hue, s);
  return s;
}

// ---------------------------------------------------------------------------
//  The field
// ---------------------------------------------------------------------------

export function createField(cfg) {
  const {
    canvas,
    map = null,
    nodes,
    measure,
    labels = false,
    reprojectable = false,
    // Where on screen the point you are standing on lands. Pushing it off the
    // middle is what keeps the light out from behind the prose: on a wide
    // screen the point sits left and the card reads to its right.
    anchor = () => [0.5, 0.5],
    cardEl = null,
    onFocus = () => {},
    onActivate = () => {},
    onReadout = () => {},
  } = cfg;

  const ctx = canvas.getContext("2d");
  const mapCtx = map ? map.getContext("2d") : null;

  const MIN_Z = 0.24;
  const MAX_Z = 1.2;
  const FOCUS_Z = cfg.focusZoom ?? 0.62;
  const OPEN_Z = cfg.openZoom ?? 0.32;

  const centroid = nodes.reduce(
    (a, n) => ({ x: a.x + n.x / nodes.length, y: a.y + n.y / nodes.length }),
    { x: 0, y: 0 },
  );

  const cam = { x: centroid.x, y: centroid.y, z: OPEN_Z, tx: centroid.x, ty: centroid.y, tz: FOCUS_Z };
  const view = { cam, focus: 0, hue: nodes[0].hue };

  let cw = 0;
  let ch = 0;
  let dpr = 1;
  let breatheX = 0;
  let breatheY = 0;
  let tick = 0;
  let hover = -1;
  let freeRoam = false;
  let release = null;
  let anneal = 0;
  let redraw = 0;
  const placed = []; // flat x0,y0,x1,y1 runs, reused each frame

  // With reduced motion the field holds perfectly still, so it is drawn on
  // demand rather than kept on the clock — no loop, no battery.
  function invalidate() {
    if (!reducedMotion || !release || redraw) return;
    redraw = requestAnimationFrame((t) => {
      redraw = 0;
      draw(t, 0.016);
    });
  }

  // Per-node paint constants, resolved once instead of formatted per frame.
  for (const n of nodes) {
    n.core = `hsl(${n.hue}, 95%, 80%)`;
    n.coreLit = `hsl(${n.hue}, 95%, 90%)`;
    n.glow = glowSprite(n.hue);
    n.r0 = n.flagship ? 6.2
      : n.kind === "portal" || n.kind === "verdict" ? 5.5
        : n.kind === "quote" || n.kind === "lead" ? 4.6
          : n.kind === "entry" ? 3.8 : 3.2;
  }

  // The mesh only changes when the projection does.
  let mesh = [];
  function rebuildMesh() {
    mesh = [];
    for (const n of nodes) {
      const nb = n.neighbors[0];
      if (nb && nb.node.i > n.i) mesh.push([n, nb.node]);
    }
  }
  rebuildMesh();

  // Ambient dust. Grouped into three depth bands so the whole field is three
  // fills a frame rather than one per speck.
  const MOTES = reducedMotion ? 0 : lowPower ? 30 : 72;
  const bands = [[], [], []];
  for (let i = 0; i < MOTES; i += 1) {
    const depth = 0.35 + fract(i * 2.2 + 1) * 0.8;
    const m = {
      x: (fract(i * 3.7) - 0.5) * 2600,
      y: (fract(i * 8.1 + 5) - 0.5) * 2200,
      depth,
      r: 0.5 + fract(i * 4.4) * 1.3,
      sp: 0.0001 + fract(i * 6.6) * 0.0003,
      ph: fract(i * 9.9) * TAU,
      amp: 8 + fract(i * 1.3) * 22,
    };
    bands[Math.min(2, ((depth - 0.35) / 0.27) | 0)].push(m);
  }
  const bandFill = [
    "hsla(225, 45%, 82%, 0.06)",
    "hsla(225, 45%, 82%, 0.08)",
    "hsla(225, 45%, 82%, 0.10)",
  ];

  function fract(n) {
    const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  }

  // --- labels -------------------------------------------------------------
  // Canvas text is slow to lay out and identical every frame, so each label is
  // rendered once into its own bitmap and stamped from then on.
  function buildLabels() {
    if (!labels) return;
    for (const n of nodes) {
      const text = n.label.toUpperCase();
      const c = document.createElement("canvas");
      let g = c.getContext("2d");
      const px = (n.flagship ? 12 : 10) * dpr;
      const font = `${n.flagship ? "700 " : ""}${px}px "Space Mono", ui-monospace, monospace`;
      g.font = font;
      try { g.letterSpacing = `${0.2 * px}px`; } catch { /* older Safari */ }
      const w = Math.ceil(g.measureText(text).width) + 8 * dpr;
      const h = Math.ceil(px * 2);
      c.width = w;
      c.height = h;
      g = c.getContext("2d");
      g.font = font;
      try { g.letterSpacing = `${0.2 * px}px`; } catch { /* older Safari */ }
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillStyle = `hsl(${n.hue}, ${n.flagship ? 85 : 60}%, ${n.flagship ? 92 : 86}%)`;
      g.fillText(text, w / 2, h / 2);
      n.labelSprite = c;
      n.labelW = w / dpr;
      n.labelH = h / dpr;
    }
  }

  // --- geometry -----------------------------------------------------------
  // screen point the camera is pinned to, resolved on resize
  let cx = 0;
  let cy = 0;
  const sx = (wx) => cx + breatheX + (wx - cam.x) * cam.z;
  const sy = (wy) => cy + breatheY + (wy - cam.y) * cam.z;

  function nearestToCam() {
    let best = nodes[0];
    let bd = Infinity;
    for (const n of nodes) {
      const d = Math.hypot(n.x - cam.x, n.y - cam.y);
      if (d < bd) { bd = d; best = n; }
    }
    return best;
  }

  function hitTest(px, py, slop = 26) {
    let hit = null;
    let hd = slop;
    for (const n of nodes) {
      const d = Math.hypot(sx(n.x) - px, sy(n.y) - py);
      if (d < hd) { hd = d; hit = n; }
    }
    return hit;
  }

  // --- render -------------------------------------------------------------
  function draw(now, dt) {
    if (!reducedMotion) {
      const kp = 1 - Math.exp(-6 * dt);
      const kz = 1 - Math.exp(-4 * dt);
      cam.x += (cam.tx - cam.x) * kp;
      cam.y += (cam.ty - cam.y) * kp;
      cam.z += (cam.tz - cam.z) * kz;
      breatheX = Math.sin(now * 0.00021) * 16;
      breatheY = Math.cos(now * 0.00017) * 12;
    }

    // A re-projection eases every point to its new coordinates; the mesh and
    // the minimap are rebuilt as it settles.
    if (anneal > 0) {
      const k = 1 - Math.exp(-3.4 * dt);
      let moving = false;
      for (const n of nodes) {
        n.x += (n.px - n.x) * k;
        n.y += (n.py - n.y) * k;
        if (Math.abs(n.px - n.x) > 0.6 || Math.abs(n.py - n.y) > 0.6) moving = true;
      }
      const f = nodes[view.focus];
      cam.tx = f.x;
      cam.ty = f.y;
      if (!moving) {
        anneal = 0;
        cfg.onAnneal?.();
        rebuildMesh();
        mapStatic = null;
      }
    }

    ctx.clearRect(0, 0, cw, ch);

    const fnode = nodes[view.focus];
    const fx = sx(fnode.x);
    const fy = sy(fnode.y);
    const pulse = reducedMotion ? 1 : 0.7 + 0.3 * Math.sin(now * 0.004);

    // atmospheric bloom behind the focused point
    const bR = Math.max(cw, ch) * 0.6;
    ctx.drawImage(bloomSprite(fnode.hue), fx - bR, fy - bR, bR * 2, bR * 2);

    // dust — one path per depth band
    if (MOTES) {
      ctx.globalCompositeOperation = "screen";
      for (let b = 0; b < 3; b += 1) {
        const band = bands[b];
        if (!band.length) continue;
        ctx.fillStyle = bandFill[b];
        ctx.beginPath();
        for (const m of band) {
          const dx = Math.sin(now * m.sp + m.ph) * m.amp;
          const dy = Math.cos(now * m.sp * 0.8 + m.ph) * m.amp;
          const px = cx + breatheX * m.depth + (m.x + dx - cam.x * m.depth) * cam.z;
          const py = cy + breatheY * m.depth + (m.y + dy - cam.y * m.depth) * cam.z;
          if (px < -20 || px > cw + 20 || py < -20 || py > ch + 20) continue;
          const r = m.r * cam.z * m.depth;
          if (lowPower) ctx.rect(px - r, py - r, r * 2, r * 2);
          else { ctx.moveTo(px + r, py); ctx.arc(px, py, r, 0, TAU); }
        }
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    }

    // nearest-neighbour mesh — one path, one stroke
    ctx.lineWidth = 1;
    ctx.strokeStyle = "hsla(220, 50%, 70%, 0.05)";
    ctx.beginPath();
    for (const [a, b] of mesh) {
      ctx.moveTo(sx(a.x), sy(a.y));
      ctx.lineTo(sx(b.x), sy(b.y));
    }
    ctx.stroke();

    // the reading thread, in index order. Animated dashes force a re-tessellation
    // every frame; on phones the thread simply holds still.
    if (!lowPower && !reducedMotion) ctx.lineDashOffset = -((now * 0.02) % 1000);
    ctx.setLineDash([2, 7]);
    ctx.strokeStyle = "hsla(210, 70%, 78%, 0.14)";
    ctx.beginPath();
    for (let i = 0; i < nodes.length; i += 1) {
      const px = sx(nodes[i].x);
      const py = sy(nodes[i].y);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.lineDashOffset = 0;

    // the focused point's own links, lit
    ctx.lineWidth = 1.2;
    for (const nb of fnode.neighbors) {
      ctx.strokeStyle = `hsla(${fnode.hue}, 85%, 72%, ${0.18 + nb.sim * 0.45})`;
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.lineTo(sx(nb.node.x), sy(nb.node.y));
      ctx.stroke();
    }

    // glows — one composite-mode switch for the whole cloud, not two per point
    ctx.globalCompositeOperation = "lighter";
    for (const n of nodes) {
      const px = sx(n.x);
      const py = sy(n.y);
      if (px < -90 || px > cw + 90 || py < -90 || py > ch + 90) { n.vis = false; continue; }
      n.vis = true;
      n.sx = px;
      n.sy = py;
      const isF = n.i === view.focus;
      n.fog = isF ? 1 : clamp(1 - Math.hypot(n.x - fnode.x, n.y - fnode.y) / 1500, 0.28, 1);
      const base = n.r0 * (0.75 + cam.z * 0.4);
      n.rad = isF ? base * (1.6 + pulse * 0.3) : n.i === hover ? base * 1.35 : base;
      const gs = n.rad * (isF ? 16 : 8);
      ctx.globalAlpha = (isF ? 0.95 : n.i === hover ? 0.7 : 0.4) * n.fog;
      ctx.drawImage(n.glow, px - gs / 2, py - gs / 2, gs, gs);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";

    // cores
    for (const n of nodes) {
      if (!n.vis) continue;
      const isF = n.i === view.focus;
      ctx.globalAlpha = (isF ? 1 : 0.85) * n.fog;
      ctx.fillStyle = isF ? n.coreLit : n.core;
      ctx.beginPath();
      ctx.arc(n.sx, n.sy, n.rad, 0, TAU);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // field rings around the focus
    if (fnode.vis) {
      for (let k = 1; k <= 2; k += 1) {
        ctx.strokeStyle = `hsla(${fnode.hue}, 90%, 82%, ${0.35 / k + pulse * 0.12})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(fx, fy, fnode.rad + 8 * k + pulse * 3, 0, TAU);
        ctx.stroke();
      }
    }

    // Labels, once you are close enough to read them — but never underneath the
    // card, where they would print straight through the prose.
    if (labels && cam.z > 0.3) {
      const near = clamp((cam.z - 0.3) / 0.2, 0, 1);
      const box = cardBox;
      placed.length = 0;
      for (const n of nodes) {
        if (!n.vis || !n.labelSprite) continue;
        // The card already names the point you are standing on.
        if (n.i === view.focus) continue;
        if (box && n.sx > box.x0 && n.sx < box.x1 && n.sy > box.y0 && n.sy < box.y1) continue;

        const x0 = n.sx - n.labelW / 2;
        const y0 = n.sy + n.rad + 6;
        const x1 = x0 + n.labelW;
        const y1 = y0 + n.labelH;
        // First label to claim a patch of screen keeps it; two names printed on
        // top of each other read as neither.
        let clash = false;
        for (let k = 0; k < placed.length; k += 4) {
          if (x0 < placed[k + 2] && x1 > placed[k] && y0 < placed[k + 3] && y1 > placed[k + 1]) {
            clash = true;
            break;
          }
        }
        if (clash) continue;
        placed.push(x0, y0, x1, y1);

        ctx.globalAlpha = near * (n.i === hover ? 0.8 : (n.flagship ? 0.62 : 0.34) * n.fog);
        ctx.drawImage(n.labelSprite, x0, y0, n.labelW, n.labelH);
      }
      ctx.globalAlpha = 1;
    }

    // Readouts and the minimap are instruments, not animation. Every fourth
    // frame is plenty and it keeps DOM writes off the critical path — except
    // straight after a resize, which clears the minimap's backing store.
    if (tick++ % 4 === 0 || !mapStatic) {
      onReadout(cam.x / 700, cam.y / 700, fnode);
      drawMap();
    }
  }

  // The card's footprint, so labels can stay out of it. Measured only when the
  // card actually changes, never inside the render loop.
  let cardBox = null;
  function measureCard() {
    if (!cardEl) return;
    const r = cardEl.getBoundingClientRect();
    const c = canvas.getBoundingClientRect();
    cardBox = {
      x0: r.left - c.left - 14,
      x1: r.right - c.left + 14,
      y0: r.top - c.top - 14,
      y1: r.bottom - c.top + 14,
    };
  }

  // --- minimap ------------------------------------------------------------
  let mapStatic = null;
  let mapBox = null;

  function buildMapStatic() {
    if (!map) return;
    const w = map.width;
    const h = map.height;
    const pad = 16 * dpr;
    let minX = Infinity; let maxX = -Infinity; let minY = Infinity; let maxY = -Infinity;
    for (const n of nodes) {
      minX = Math.min(minX, n.x); maxX = Math.max(maxX, n.x);
      minY = Math.min(minY, n.y); maxY = Math.max(maxY, n.y);
    }
    const s = Math.min((w - pad * 2) / (maxX - minX), (h - pad * 2) / (maxY - minY));
    mapBox = { minX, minY, s, pad };

    mapStatic = document.createElement("canvas");
    mapStatic.width = w;
    mapStatic.height = h;
    const g = mapStatic.getContext("2d");
    g.strokeStyle = "hsla(220, 50%, 70%, 0.12)";
    g.lineWidth = 0.5 * dpr;
    g.beginPath();
    for (const [a, b] of mesh) {
      g.moveTo(pad + (a.x - minX) * s, pad + (a.y - minY) * s);
      g.lineTo(pad + (b.x - minX) * s, pad + (b.y - minY) * s);
    }
    g.stroke();
    for (const n of nodes) {
      g.fillStyle = `hsla(${n.hue}, 85%, 60%, 0.55)`;
      g.beginPath();
      g.arc(pad + (n.x - minX) * s, pad + (n.y - minY) * s, 1.6 * dpr, 0, TAU);
      g.fill();
    }
  }

  function drawMap() {
    if (!mapCtx) return;
    if (!mapStatic) buildMapStatic();
    const { minX, minY, s, pad } = mapBox;
    const mx = (wx) => pad + (wx - minX) * s;
    const my = (wy) => pad + (wy - minY) * s;
    mapCtx.clearRect(0, 0, map.width, map.height);
    mapCtx.drawImage(mapStatic, 0, 0);

    const f = nodes[view.focus];
    mapCtx.fillStyle = `hsla(${f.hue}, 85%, 85%, 1)`;
    mapCtx.beginPath();
    mapCtx.arc(mx(f.x), my(f.y), 3 * dpr, 0, TAU);
    mapCtx.fill();
    mapCtx.strokeStyle = `hsla(${f.hue}, 85%, 85%, 0.7)`;
    mapCtx.lineWidth = 1 * dpr;
    mapCtx.beginPath();
    mapCtx.arc(mx(f.x), my(f.y), 6 * dpr, 0, TAU);
    mapCtx.stroke();

    mapCtx.strokeStyle = "hsla(0, 0%, 100%, 0.35)";
    mapCtx.lineWidth = 0.75 * dpr;
    mapCtx.beginPath();
    mapCtx.moveTo(mx(cam.x) - 4 * dpr, my(cam.y));
    mapCtx.lineTo(mx(cam.x) + 4 * dpr, my(cam.y));
    mapCtx.moveTo(mx(cam.x), my(cam.y) - 4 * dpr);
    mapCtx.lineTo(mx(cam.x), my(cam.y) + 4 * dpr);
    mapCtx.stroke();
  }

  // --- sizing -------------------------------------------------------------
  function resize() {
    // Phones draw at 1 device pixel per CSS pixel. On a field of soft glows the
    // difference is invisible, and it is 4× fewer pixels to fill than a retina
    // buffer — the cheapest frame-time we can buy.
    dpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1 : 2);
    const [w, h] = measure();
    cw = w;
    ch = h;
    const [ax, ay] = anchor();
    cx = w * ax;
    cy = h * ay;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (map) {
      const side = parseFloat(getComputedStyle(map).width) || 130;
      map.width = Math.floor(side * dpr);
      map.height = Math.floor(side * dpr);
      mapStatic = null;
    }
    buildLabels();
    measureCard();
    invalidate();
  }

  // --- focus --------------------------------------------------------------
  function setFocus(index, instant = false) {
    view.focus = (index + nodes.length) % nodes.length;
    const n = nodes[view.focus];
    view.hue = n.hue;
    cam.tx = n.x;
    cam.ty = n.y;
    cam.tz = clamp(cam.tz < MIN_Z + 0.02 ? FOCUS_Z : Math.max(cam.tz, FOCUS_Z), MIN_Z, MAX_Z);
    if (instant || reducedMotion) {
      cam.x = n.x;
      cam.y = n.y;
      cam.z = cam.tz;
    }
    onFocus(n);
    measureCard();
    invalidate();
  }

  function reproject() {
    if (!reprojectable || reducedMotion || anneal) return;
    const salt = 1 + Math.floor(Math.random() * 90);
    for (const n of nodes) {
      const angle = fract((n.i + salt) * 1.7 + 3.1) * TAU;
      const radius = 60 + fract((n.i + salt) * 2.3 + 9.4) * 150;
      n.px = n.c[0] + Math.cos(angle) * radius;
      n.py = n.c[1] + Math.sin(angle) * radius;
    }
    anneal = 1;
  }

  // --- pointer ------------------------------------------------------------
  const pointers = new Map();
  let dragging = false;
  let moved = false;
  let lastX = 0;
  let lastY = 0;
  let downX = 0;
  let downY = 0;
  let pinch = 0;

  canvas.addEventListener("pointerdown", (e) => {
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      pinch = Math.hypot(a.x - b.x, a.y - b.y);
      dragging = false;
      return;
    }
    dragging = true;
    moved = false;
    lastX = downX = e.clientX;
    lastY = downY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
    canvas.classList.add("grabbing");
  });

  canvas.addEventListener("pointermove", (e) => {
    if (pointers.has(e.pointerId)) pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinch > 0) cam.tz = clamp(cam.tz * (d / pinch), MIN_Z, MAX_Z);
      cam.z = cam.tz;
      pinch = d;
      freeRoam = true;
      return;
    }

    if (!dragging) {
      if (coarse) return;
      const rect = canvas.getBoundingClientRect();
      const h = hitTest(e.clientX - rect.left, e.clientY - rect.top, 22);
      const idx = h ? h.i : -1;
      if (idx !== hover) {
        hover = idx;
        canvas.style.cursor = idx >= 0 ? "pointer" : "";
      }
      return;
    }

    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    if (Math.hypot(e.clientX - downX, e.clientY - downY) > 4) moved = true;
    cam.tx -= dx / cam.z;
    cam.ty -= dy / cam.z;
    cam.x -= dx / cam.z;
    cam.y -= dy / cam.z;
    lastX = e.clientX;
    lastY = e.clientY;
    freeRoam = true;
    invalidate();
  });

  function endPointer(e) {
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinch = 0;
    if (!dragging) {
      if (freeRoam && !pointers.size) {
        freeRoam = false;
        setFocus(nearestToCam().i);
      }
      return;
    }
    dragging = false;
    canvas.classList.remove("grabbing");
    const rect = canvas.getBoundingClientRect();

    if (!moved) {
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const hit = hitTest(px, py);
      freeRoam = false;
      if (hit) {
        // A second tap on the point you are already reading opens it.
        if (hit.i === view.focus) onActivate(hit);
        else setFocus(hit.i);
      } else {
        cam.tx = cam.x + (px - cx - breatheX) / cam.z;
        cam.ty = cam.y + (py - cy - breatheY) / cam.z;
        setFocus(nearestToCam().i);
      }
    } else if (freeRoam) {
      freeRoam = false;
      setFocus(nearestToCam().i);
    }
  }

  canvas.addEventListener("pointerup", endPointer);
  canvas.addEventListener("pointercancel", endPointer);

  canvas.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      cam.tz = clamp(cam.tz * Math.exp(-e.deltaY * 0.0015), MIN_Z, MAX_Z);
      if (reducedMotion) cam.z = cam.tz;
      invalidate();
    },
    { passive: false },
  );

  // --- lifecycle ----------------------------------------------------------
  return {
    nodes,
    view,
    cam,
    setFocus,
    reproject,
    resize,
    next: () => setFocus(view.focus + 1),
    prev: () => setFocus(view.focus - 1),
    current: () => nodes[view.focus],
    start(from = 0, instant = reducedMotion) {
      if (!release) release = reducedMotion ? () => {} : addTask(draw);
      resize();
      cam.x = centroid.x;
      cam.y = centroid.y;
      cam.z = OPEN_Z;
      cam.tz = FOCUS_Z;
      freeRoam = false;
      setFocus(from, instant);
    },
    stop() {
      if (release) release();
      release = null;
      if (redraw) cancelAnimationFrame(redraw);
      redraw = 0;
    },
    // stop() + start() flies the camera home again, which is right when you
    // come back from a portal and wrong when a reading pane simply covered the
    // field for a while. resume() picks the loop back up where it was.
    resume() {
      if (!release) release = reducedMotion ? () => {} : addTask(draw);
    },
    running: () => Boolean(release),
  };
}
