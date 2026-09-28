import { addTask, reducedMotion } from "./engine.js";

const bar = (url) => `
  <div class="bw-bar"><span class="lights"><i></i><i></i><i></i></span>
    <span class="bw-nav">‹ ›</span><span class="bw-url"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3.5 5.5V4a2.5 2.5 0 0 1 5 0v1.5M3 5.5h6v4.5H3z" fill="none" stroke="currentColor" stroke-width="1.1"/></svg>${url}</span></div>`;

const view = (url, page, cls = "") => `
  <div class="bw ${cls}">${bar(url)}<div class="bw-view"><div class="bw-page">${page}</div></div></div>`;

const spiral = `<svg class="gz-logo" viewBox="0 0 40 40" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round">
  <path d="M20 21c0-1.7 1.4-3 3-3s3.2 1.6 3.2 3.6c0 3.2-2.8 5.6-6.2 5.6-4 0-7-3.4-7-7.4 0-4.9 4-8.6 8.8-8.6 5.8 0 10.2 4.8 10.2 10.6 0 6.8-5.6 12.2-12.4 12.2"/>
  <path d="M14.5 33.2C9.4 31 6 26 6 20.2 6 12.4 12.4 6 20.2 6c4.8 0 9 2.3 11.6 6"/></g></svg>`;

const gizaHome = `
  <div class="gz">
    <div class="gz-rule"></div>
    <header class="gz-mast">${spiral}<span class="gz-name">Gizapedia</span></header>
    <p class="gz-sub">Giza · Gizarte · Zientziak</p>
    <nav class="gz-nav">
      <span class="on">Hasiera</span><span>Arakatu</span><span>Azken artikuluak</span><span>Hiztegia</span><span>Ikasliburuak</span><span>Nor garen</span>
      <div class="gz-search" data-type="giza"><span class="gz-q" data-q>Bilatu entziklopedian…</span><i class="gz-caret"></i><b>↵</b>
        <ul class="gz-drop" data-drop></ul></div>
    </nav>
    <p class="gz-eyebrow">Edizio irekia · 2026</p>
    <h4 class="gz-title">Giza eta gizarte zientzien<br>entziklopedia</h4>
    <p class="gz-lede"><em>Euskaraz</em>: filosofia, politika, ekonomia, soziologia, estatistika &amp; gehiago.</p>
    <p class="gz-count"><b data-tick="8099">8,099</b><span>artikulu gizapedian</span></p>
    <div class="gz-cta"><span class="gz-btn">Arakatu entziklopedia →</span><span class="gz-btn gz-btn--ghost">Hiztegira jauzi</span></div>
    <div class="gz-az"><small>A – Z</small>${"ABDEFGHIJKLMNOPRSTUXZ".split("").map((l) => `<span>${l}</span>`).join("")}</div>
  </div>`;

const gizaArticle = `
  <div class="gz gz--art">
    <div class="gz-rule"></div>
    <p class="gz-crumb">Hasiera › Biografiak › Espainiako historia</p>
    <div class="gz-art">
      <div class="gz-art-main">
        <h4 class="gz-art-h">Maria Kristina Borboikoa</h4>
        <p class="gz-art-meta">Biografia · irailak 23, 2026 · 9 min irakurketa</p>
        <p class="gz-art-p"><b>Maria Kristina Borboikoa</b> (Palermo, 1806 – Sainte-Adresse, 1878) Bi Sizilietako Erresumako printzesa izan zen, <a>Espainiako erregina ezkontidea</a> <a>Fernando VII.aren</a> emaztea izan zenez, eta erreginaorde eta erregina ama, <a>Elisabet II.a</a> erreginaren ama zenez.<sup>[1]</sup></p>
        <p class="gz-art-p">Erreginaorde zelarik, bi aldiz joan behar izan zuen erbestera; lehen <a>karlistaldiaren</a> garaian liberalen babesa bilatu zuen, eta <a>Esparterok</a> erregeordetza kendu zion 1840an.<sup>[2]</sup> Bere ezkontza sekretuak eta negozioek ospe txarra ekarri zioten…</p>
        <h5>Erreferentziak</h5>
        <ol class="gz-refs"><li>Burdiel, I. <i>Isabel II. Una biografía</i>. Taurus, 2010.</li><li>Fontana, J. <i>La época del liberalismo</i>. Crítica, 2007.</li></ol>
      </div>
      <aside class="gz-box">
        <div class="gz-portrait"><span>MK</span></div>
        <b>Maria Kristina</b>
        <dl><dt>Jaiotza</dt><dd>1806, Palermo</dd><dt>Heriotza</dt><dd>1878, Sainte-Adresse</dd><dt>Ezkontidea</dt><dd>Fernando VII.a</dd><dt>Seme-alabak</dt><dd>Elisabet II.a</dd></dl>
      </aside>
    </div>
  </div>`;

const gizaDict = `
  <div class="card gz-dict">
    <p class="card-k">Gizapedia hiztegia · 11,012 sarrera</p>
    <p class="gz-dict-w">jakintza <i>iz.</i></p>
    <div class="gz-tabs"><span class="on">Definizioa</span><span>Erabilera</span><span>Tesauroa</span><span>Itzulpenak</span></div>
    <p class="gz-dict-d"><b>1</b> Ikasiz edo esperientziaz lortutako ezagutza multzoa.</p>
    <p class="gz-dict-d"><b>2</b> Diziplina edo zientzia jakin bat. <i>Giza jakintzak.</i></p>
    <p class="gz-dict-tr"><span>es</span>saber <span>en</span>knowledge <span>fr</span>savoir</p>
  </div>`;

const gizaGraph = `
  <div class="card gz-graph">
    <p class="card-k">Ikus, gainera · 1,330 lotura</p>
    <svg viewBox="0 0 260 150" aria-hidden="true">
      <g class="gz-edges">
        <path d="M130 75 60 30"/><path d="M130 75 206 28"/><path d="M130 75 44 112"/><path d="M130 75 214 118"/><path d="M130 75 132 138"/><path d="M60 30 44 112"/>
      </g>
      <g class="gz-nodes">
        <circle cx="130" cy="75" r="7" class="c"/><circle cx="60" cy="30" r="4.5"/><circle cx="206" cy="28" r="4.5"/><circle cx="44" cy="112" r="4.5"/><circle cx="214" cy="118" r="4.5"/><circle cx="132" cy="138" r="4.5"/>
      </g>
      <g class="gz-labels">
        <text x="130" y="60" class="c">Maria Kristina</text><text x="60" y="20">Fernando VII.a</text><text x="206" y="18">Elisabet II.a</text>
        <text x="44" y="128">Karlistaldiak</text><text x="214" y="134">Espartero</text><text x="176" y="146">Erregeordetza</text>
      </g>
    </svg>
  </div>`;

export const gizaScene = () => `
  <div class="scene scene--giza" data-scene>
    <div class="layer l-back">${view("gizapedia.org/biografiak/maria-kristina-borboikoa/", gizaArticle, "bw--giza")}</div>
    <div class="layer l-front">${view("gizapedia.org", gizaHome, "bw--giza")}</div>
    <div class="layer l-chip l-chip--a">${gizaDict}</div>
    <div class="layer l-chip l-chip--b">${gizaGraph}</div>
  </div>`;

const constellation = (() => {
  const pts = [[610, 70], [650, 110], [700, 80], [740, 130], [790, 70], [830, 120], [880, 90], [920, 150], [640, 190], [700, 210], [760, 180], [820, 220], [870, 200], [930, 60], [590, 140]];
  const links = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [1, 8], [8, 9], [9, 10], [10, 11], [11, 12], [12, 7], [6, 13], [0, 14], [14, 8], [3, 10]];
  return `<svg class="ik-const" viewBox="560 30 400 220" aria-hidden="true">
    ${links.map(([a, b]) => `<line x1="${pts[a][0]}" y1="${pts[a][1]}" x2="${pts[b][0]}" y2="${pts[b][1]}"/>`).join("")}
    ${pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.2"/>`).join("")}
    <text x="600" y="52">MATEMÁTICA Y ESTADÍSTICA</text><text x="836" y="48">POLÍTICA</text><text x="572" y="98">SOCIOLOGÍA</text><text x="880" y="178">RELIGIÓN</text><text x="720" y="240">ARQUEOLOGÍA</text>
  </svg>`;
})();

const ikusHome = `
  <div class="ik">
    <header class="ik-head">
      <span class="ik-logo"><i></i>IKUSMIRA</span>
      <nav><span>Hoy</span><span>Ideas clave</span><span>Itinerarios</span><span>Resúmenes</span><span>Glosario</span><span>Colabora</span></nav>
      <span class="ik-search-btn"><svg viewBox="0 0 16 16"><circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="m10.5 10.5 3 3" stroke="currentColor" stroke-width="1.5"/></svg>Buscar <kbd>⌘K</kbd></span>
    </header>
    <section class="ik-hero">
      ${constellation}
      <h4>Tu enciclopedia en <em>español</em>.<br><span class="ik-indent">Para <em>entender, aprender y citar</em>.</span></h4>
      <div class="ik-cta"><span class="ik-btn">Empezar por un itinerario →</span><span class="ik-btn ik-btn--ghost">Ver las 25 categorías ↓</span></div>
    </section>
    <div class="ik-row">
      <div><small>Lectura de hoy · artículo · geografía</small><b>Frente cálido</b><small>3 min · cambia cada día</small></div>
      <div><small>Continuar leyendo</small><b>Cómo aprende una máquina</b><i class="ik-progress"><i style="width:38%"></i></i></div>
      <div><small>Tu racha</small><b><span class="ik-big" data-tick="12">12</span> días seguidos</b><small>Mi biblioteca →</small></div>
    </div>
  </div>`;

const img = (name) => `<img src="/archives/${name}.jpg" alt="" loading="lazy" decoding="async">`;

const ikusGrid = `
  <div class="ik ik--grid">
    <p class="ik-sec"><span>§</span>Artículos</p>
    <h4 class="ik-grid-h">Artículos destacados</h4>
    <div class="ik-grid">
      <article class="ik-big-card">${img("dreyfus-degradacion")}<small>Derecho · 6 min</small><b>El caso Dreyfus y el bordereau</b>
        <p>Una nota rota en una papelera bastó para condenar a un capitán inocente.</p></article>
      <article>${img("hf-cottingley-salto")}<small>Fotografía · 6 min</small><b>Las hadas de Cottingley</b></article>
      <article>${img("hf-yezhov-original")}<small>Fotografía · 5 min</small><b>Los borrados de Stalin</b></article>
      <article>${img("sabana-negativos")}<small>Religión · 7 min</small><b>La Sábana Santa y el radiocarbono</b></article>
      <article>${img("animales-savigny")}<small>Derecho · 6 min</small><b>Los juicios a animales</b></article>
    </div>
  </div>`;

const ikusPalette = `
  <div class="card ik-pal">
    <div class="ik-pal-in"><svg viewBox="0 0 16 16"><circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="m10.5 10.5 3 3" stroke="currentColor" stroke-width="1.5"/></svg><span data-q></span><i class="ik-caret"></i><kbd>esc</kbd></div>
    <div class="ik-pal-class"><span class="ik-pal-k">iratxo · wasm · en tu navegador</span><span class="ik-ms" data-ms>0.4 ms</span></div>
    <div class="ik-chips" data-chips></div>
    <ul class="ik-pal-res" data-res></ul>
  </div>`;

const ikusShelves = `
  <div class="card ik-shelf">
    <p class="card-k">Todo el archivo, <em>por estantes</em></p>
    ${[["Historia", 100, 612], ["Filosofía", 81, 498], ["Derecho", 63, 389], ["Ciencia y tecnología", 55, 341], ["Literatura", 46, 287], ["Arte", 34, 208], ["Religión", 27, 167]]
    .map(([k, v, n]) => `<p><span>${k}</span><i style="--w:${v}%"></i><b>${n}</b></p>`).join("")}
  </div>`;

export const ikusScene = () => `
  <div class="scene scene--ikus" data-scene>
    <div class="layer l-back">${view("ikusmira.org/#destacados", ikusGrid, "bw--ikus")}</div>
    <div class="layer l-front">${view("ikusmira.org", ikusHome, "bw--ikus")}</div>
    <div class="layer l-chip l-chip--a">${ikusPalette}</div>
    <div class="layer l-chip l-chip--b">${ikusShelves}</div>
  </div>`;

const GIZA_QUERIES = [
  ["Hannah Arendt", ["Hannah Arendt", "Arendt, totalitarismoaren jatorriak", "Gaizkiaren hutsaltasuna"]],
  ["gizarte kontratua", ["Gizarte kontratua", "Rousseau, Jean-Jacques", "Hobbes eta Leviatana"]],
  ["batez besteko", ["Batez besteko aritmetikoa", "Mediana", "Desbideratze estandarra"]],
];

const IKUS_QUERIES = [
  ["¿por qué condenaron a Dreyfus?", [["intención", "entender"], ["complejidad", "media"], ["seguridad", "ok"], ["ruta", "Derecho"]],
    ["El caso Dreyfus y el bordereau", "Antisemitismo en la Tercera República", "Zola, «J'accuse…!»"]],
  ["radiocarbono sábana santa", [["intención", "verificar"], ["complejidad", "alta"], ["seguridad", "ok"], ["ruta", "Ciencia"]],
    ["La Sábana Santa y el radiocarbono", "Datación por carbono 14", "Método científico y reliquias"]],
  ["resumen del Quijote", [["intención", "repasar"], ["complejidad", "baja"], ["seguridad", "ok"], ["ruta", "Literatura"]],
    ["Don Quijote, segunda parte: resumen por capítulos", "Cervantes en diez minutos", "Novela picaresca"]],
];

function typist(el, queries, render, { typeMs = 70, holdMs = 2600, idle } = {}) {
  const q = el.querySelector("[data-q]");
  let i = 0;
  let pos = 0;
  let phase = "type";
  let next = 0;
  return (now) => {
    if (now < next) return;
    const [text] = queries[i];
    if (phase === "type") {
      pos += 1;
      q.textContent = text.slice(0, pos);
      el.classList.add("typing");
      if (pos >= text.length) { phase = "hold"; render(queries[i], true); next = now + holdMs; return; }
      next = now + typeMs + Math.random() * 60;
    } else if (phase === "hold") {
      phase = "erase";
      render(queries[i], false);
      next = now + 40;
    } else {
      pos -= 2;
      q.textContent = text.slice(0, Math.max(0, pos));
      if (pos <= 0) {
        phase = "type";
        i = (i + 1) % queries.length;
        if (idle) { q.textContent = idle; el.classList.remove("typing"); }
        next = now + 900;
        return;
      }
      next = now + 25;
    }
  };
}

function gizaSearch(scene) {
  const box = scene.querySelector('[data-type="giza"]');
  const drop = box.querySelector("[data-drop]");
  return typist(box, GIZA_QUERIES, ([, results], on) => {
    drop.innerHTML = on ? results.map((r, k) => `<li class="${k === 0 ? "on" : ""}">${r}<small>${k === 0 ? "artikulua" : "ikus, gainera"}</small></li>`).join("") : "";
    box.classList.toggle("open", on);
  }, { idle: "Bilatu entziklopedian…" });
}

function ikusSearch(scene) {
  const pal = scene.querySelector(".ik-pal");
  const chips = pal.querySelector("[data-chips]");
  const res = pal.querySelector("[data-res]");
  const ms = pal.querySelector("[data-ms]");
  return typist(pal, IKUS_QUERIES, ([, tags, results], on) => {
    if (!on) { chips.classList.remove("on"); res.classList.remove("on"); return; }
    ms.textContent = `${(0.2 + Math.random() * 0.5).toFixed(1)} ms`;
    chips.innerHTML = tags.map(([k, v]) => `<span><small>${k}</small>${v}</span>`).join("");
    res.innerHTML = results.map((r, k) => `<li class="${k === 0 ? "on" : ""}">${r}</li>`).join("");
    chips.classList.add("on");
    res.classList.add("on");
  }, { typeMs: 55 });
}

const PAGE_W = 1000;
function fit(scene) {
  const ro = new ResizeObserver(() => {
    for (const v of scene.querySelectorAll(".bw-view")) v.style.setProperty("--s", (v.clientWidth / PAGE_W).toFixed(4));
  });
  for (const v of scene.querySelectorAll(".bw-view")) ro.observe(v);
}

export function initArchives(root) {
  const scenes = [...root.querySelectorAll("[data-scene]")];
  scenes.forEach(fit);
  if (reducedMotion) {
    for (const s of scenes) s.style.setProperty("--t", "1");
    return () => {};
  }

  const loops = [gizaSearch(scenes[0]), ikusSearch(scenes[1])];
  const visible = new Set();
  const io = new IntersectionObserver((es) => {
    for (const e of es) e.isIntersecting ? visible.add(e.target) : visible.delete(e.target);
  });
  scenes.forEach((s) => io.observe(s));
  addTask((now) => scenes.forEach((s, k) => { if (visible.has(s)) loops[k](now); }));

  return (vh) => {
    for (const s of scenes) {
      const r = s.getBoundingClientRect();
      const t = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.75)));
      s.style.setProperty("--t", t.toFixed(3));
    }
  };
}
