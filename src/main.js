import "./style.css";

const projects = [
  {
    name: "mairu",
    href: "https://github.com/enekos/mairu",
    description: "context synthesis, autonomous navigation",
  },
  {
    name: "gizapedia",
    href: "https://gizapedia.org",
    description: "ontologies of social dynamics",
  },
  {
    name: "ikusmira",
    href: "https://ikusmira.org",
    description: "cultural observation protocols",
  },
];

const socials = [
  { name: "LinkedIn", href: "https://linkedin.com/in/enekosarasola" },
  { name: "Instagram", href: "https://instagram.com/arcaizante" },
  { name: "GitHub", href: "https://github.com/enekos" },
  { name: "X", href: "https://x.com/exocuted" },
];

const app = document.querySelector("#app");

app.innerHTML = `
  <canvas id="shader-canvas" aria-hidden="true"></canvas>
  <div id="noise-overlay"></div>
  <main class="hud">
    <header class="identity">
      <p class="whisper">web / ai / natural language developer</p>
      <h1>Eneko Sarasola</h1>
      <p class="subtitle">Software engineer and natural language processing enthusiast.</p>
    </header>

    <section class="about" aria-label="About me">
      <h2>About Me</h2>
      <p>
        I build software and work with language models. I have over a decade of experience 
        developing web applications and systems in Barcelona, working across EdTech, FinTech, 
        and HR tech.
      </p>
      <p>
        I also maintain Gizapedia and Ikusmira, open encyclopedias for Basque and Spanish 
        speakers, cataloguing social and behavioral patterns.
      </p>
      <p>
        When I'm not coding, I'm usually experimenting with analog photography. 
        Feel free to reach out.
      </p>
      <p>email: <strong>enekos[at]duck.com</strong></p>
    </section>

    <section class="project-list" aria-label="Projects">
      ${projects
    .map(
      (project) => `
          <a class="portal" href="${project.href}" target="_blank" rel="noreferrer">
            <span class="portal-text">
              <span class="portal-label">${project.name}</span>
              <span class="portal-description">${project.description}</span>
            </span>
          </a>
        `,
    )
    .join("")}
    </section>

    <section class="social-list" aria-label="Social Links">
      ${socials
    .map(
      (social) => `
          <a class="social-link" href="${social.href}" target="_blank" rel="noreferrer">
            ${social.name}
          </a>
        `,
    )
    .join(`<span class="social-separator">/</span>`)}
    </section>

    <footer class="hint">
      <p>Observe the flow • <kbd>space</kbd> to breach reality</p>
    </footer>
  </main>
`;

const canvas = document.querySelector("#shader-canvas");
const ctx = canvas.getContext("2d");

if (!ctx) {
  throw new Error("2D canvas is unavailable.");
}

const glyphs = "░▒▓█▄▀■▲▼●◆★✦✧∞∆∇⍙⍣⍟⍰⍡⍢⍣⍤⍥⍨⍩⍪⍫⍬⍭⍮⍯⍰⍱⍲⍳⍴⍵⍶⍷⍸⍹⍺⍻⍼⍽⍾⍿";
const esotericWords = [
  "void", "null", "undefined", "NaN", "infinity", "recursive", "fractal",
  "entropy", "abyss", "liminal", "nexus", "vertex", "phantom", "echo",
  "syntax", "cipher", "flux", "ghost", "trace", "sigil", "loop", "prism"
];

const layers = [
  { fontSize: 32, speed: 440, alpha: 0.35, trail: 35, parallax: 60, depth: 1.8, offset: 0.0, heads: [] },
  { fontSize: 24, speed: 300, alpha: 0.25, trail: 25, parallax: 45, depth: 1.4, offset: 1.1, heads: [] },
  { fontSize: 18, speed: 200, alpha: 0.15, trail: 18, parallax: 30, depth: 1.1, offset: 2.3, heads: [] },
  { fontSize: 14, speed: 120, alpha: 0.10, trail: 12, parallax: 15, depth: 0.8, offset: 3.7, heads: [] },
  { fontSize: 10, speed: 80, alpha: 0.05, trail: 8, parallax: 5, depth: 0.5, offset: 5.2, heads: [] },
];

let jumpCount = 0;
let lastNow = performance.now();
let chaosBlend = 0;
const backdropCycle = {
  orderedMs: 7000,
  chaosMs: 7000,
  maxChaosStrength: 0.42,
};
const cycleStartedAt = performance.now();
const chaosState = { seed: 0 };

function hash(value) {
  const x = Math.sin(value * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function randomGlyph(seed) {
  const index = Math.floor(hash(seed) * glyphs.length) % glyphs.length;
  return glyphs[index];
}

function streamGlyph(layerIndex, columnIndex, rowIndex, frameIndex) {
  const mode = hash(columnIndex * 0.173 + layerIndex * 7.91) > 0.6;
  if (!mode) {
    return randomGlyph(columnIndex * 131.0 + rowIndex * 19.0 + layerIndex * 67.0 + frameIndex);
  }

  const words = esotericWords;
  const word = words[Math.floor(hash(columnIndex * 1.77 + frameIndex * 0.005 + layerIndex * 0.43) * words.length) % words.length];
  const cursor = ((rowIndex % (word.length + 2)) + (word.length + 2)) % (word.length + 2);
  return cursor >= word.length ? "·" : word[cursor].toUpperCase();
}

function triggerChaos() {
  jumpCount += 1;
  chaosState.seed += 1;
  reseedHeads();
}

function smoothstep01(value) {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
}

function chaosTarget(now) {
  const cycleLength = backdropCycle.orderedMs + backdropCycle.chaosMs;
  const omega = (Math.PI * 2) / cycleLength;
  const time = now - cycleStartedAt;

  // Fully continuous oscillator + soft gate for longer calm phases without hard resets.
  const baseWave = 0.5 + 0.5 * Math.sin(time * omega - Math.PI / 2);
  const gatedWave = 0.5 + 0.5 * Math.tanh((baseWave - 0.62) * 8);
  const shapedWave = smoothstep01(gatedWave);
  return backdropCycle.maxChaosStrength * shapedWave;
}

function reseedHeads() {
  const width = canvas.width;
  const height = canvas.height;
  for (const layer of layers) {
    const columnWidth = Math.max(7, layer.fontSize * 0.85);
    const columnCount = Math.ceil(width / columnWidth) + 3;
    const rows = Math.ceil(height / layer.fontSize) + layer.trail + 4;
    layer.heads = Array.from({ length: columnCount }, (_, idx) => {
      return -Math.floor(hash(idx * 17.17 + layer.offset * 97.0 + jumpCount * 13.0) * rows);
    });
  }
}

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.floor(window.innerWidth * dpr);
  const height = Math.floor(window.innerHeight * dpr);
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  reseedHeads();
}

function render(now) {
  const dt = Math.min((now - lastNow) * 0.001, 0.05);
  lastNow = now;
  const width = canvas.width;
  const height = canvas.height;
  const px = 0;
  const py = 0;
  const targetChaos = chaosTarget(now);
  const blendStep = 1 - Math.exp(-1.4 * dt);
  chaosBlend += (targetChaos - chaosBlend) * blendStep;
  const chaos = chaosBlend;

  // Trippy feedback loop with global composite operation
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = `rgba(5, 0, 10, ${0.15 - chaos * 0.04})`;
  ctx.fillRect(0, 0, width, height);

  ctx.globalCompositeOperation = chaos > 0.8 ? "lighter" : "screen";

  for (let li = 0; li < layers.length; li += 1) {
    const layer = layers[li];
    const columnWidth = Math.max(7, layer.fontSize * 0.85);
    const rows = Math.ceil(height / layer.fontSize) + layer.trail + 4;
    const vanishingX = width * 0.5 + px * 120 * layer.depth;

    // Wave distortion over the entire layer
    const layerWave = Math.sin(now * 0.001 + layer.offset) * 20;

    const xShift = px * layer.parallax + layerWave;
    const yShift = py * layer.parallax + Math.cos(now * 0.0008 + layer.offset) * 15;
    const speedScale = 0.5 + hash(li * 21.3 + jumpCount * 0.77) * 1.5;
    const frameIndex = Math.floor(now * 0.02);
    const chaosJitter = chaos * (layer.fontSize * 1.3 + layer.parallax * 0.55);

    ctx.font = `${layer.fontSize}px "Courier New", Courier, monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let ci = 0; ci < layer.heads.length; ci += 1) {
      // Fluid-like column movement
      const colWave = Math.sin(now * 0.002 + ci * 0.1 + li) * 10 * (1 + chaos * 0.55);

      layer.heads[ci] += (layer.speed * speedScale * dt) / layer.fontSize;
      if (layer.heads[ci] > rows + 2) {
        layer.heads[ci] = -Math.floor(hash(ci * 91.7 + li * 29.3 + now * 0.0001) * rows);
      }

      const flatX = ci * columnWidth + xShift + colWave;
      const x = vanishingX + (flatX - vanishingX) * layer.depth;
      const headY = Math.floor(layer.heads[ci]) * layer.fontSize + yShift;

      const baseAngle = hash(ci * 1.17 + li * 8.91 + chaosState.seed * 14.0) * Math.PI * 2;
      const speedWarp = 0.5 + hash(ci * 2.07 + li * 4.37 + chaosState.seed * 3.2) * 2.0;

      const driftX = Math.cos(baseAngle) * chaosJitter * 2.2;
      const driftY = Math.sin(baseAngle) * chaosJitter * 2.2;

      const pulse = 0.5 + 0.5 * Math.sin(now * 0.00035 + baseAngle * 1.3);
      const blastDistance = (80 + pulse * 120) * chaos;
      const blastX = Math.cos(baseAngle + now * 0.001) * blastDistance * speedWarp;
      const blastY = Math.sin(baseAngle - now * 0.001) * blastDistance * speedWarp;

      for (let t = 0; t < layer.trail; t += 1) {
        let y = headY - t * layer.fontSize;

        const row = Math.floor(layer.heads[ci]) - t;
        const intensity = Math.pow(1 - t / layer.trail, 1.5) * layer.alpha;

        // Simpler, pastel colors
        const hue = (now * 0.01 + li * 20 - t * 2 + chaos * 50) % 360;
        const saturation = 35 + chaos * 25;
        const lightness = 65 + intensity * 15 + chaos * 10;
        const alpha = Math.min(1, intensity * (t === 0 ? 1.5 : 1.0));

        const glyph = streamGlyph(li, ci, row, frameIndex);
        let drawX = x;

        // Apply distortions
        const swirl = now * 0.002 * speedWarp + t * 0.2;
        const rowWave = Math.sin(y * 0.01 + now * 0.003) * 15 * (1 + chaos * 0.8);

        drawX += rowWave;

        if (chaos > 0) {
          const trailSpread = 1 + t / layer.trail * 2;
          const orbitX = Math.cos(baseAngle + swirl * 3) * chaosJitter * trailSpread;
          const orbitY = Math.sin(baseAngle - swirl * 2) * chaosJitter * trailSpread;

          drawX += driftX + orbitX + blastX;
          y += driftY + orbitY + blastY;

          // Random scale during chaos
          if (hash(t * 7 + ci) > 0.8) {
            ctx.font = `${layer.fontSize * (1 + chaos * 0.22)}px "Courier New", Courier, monospace`;
          } else {
            ctx.font = `${layer.fontSize}px "Courier New", Courier, monospace`;
          }
        }

        if (y < -layer.fontSize * 3 || y > height + layer.fontSize * 3 || drawX < -100 || drawX > width + 100) {
          continue;
        }

        ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;

        // Chromatic aberration effect on the head character during chaos
        if (t === 0 && chaos > 0.4) {
          ctx.fillStyle = `hsla(340, 70%, 70%, ${alpha})`;
          ctx.fillText(glyph, drawX - chaos * 2, y);
          ctx.fillStyle = `hsla(200, 70%, 70%, ${alpha})`;
          ctx.fillText(glyph, drawX + chaos * 2, y);
          ctx.fillStyle = `hsla(${hue}, ${saturation}%, 90%, ${alpha})`;
        }

        ctx.fillText(glyph, drawX, y);
      }
    }
  }

  // Dark vignette overlay
  ctx.globalCompositeOperation = "multiply";
  const grad = ctx.createRadialGradient(width / 2, height / 2, height * 0.2, width / 2, height / 2, height);
  grad.addColorStop(0, "rgba(0,0,0,0)");
  grad.addColorStop(1, "rgba(5,0,10,0.8)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  requestAnimationFrame(render);
}

window.addEventListener("resize", resize);
window.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    event.preventDefault();
    triggerChaos();
  }
});

resize();
requestAnimationFrame(render);
