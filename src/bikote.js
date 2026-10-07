import { reducedMotion } from "./engine.js";

const ROWS = [
  { deal: "New logo #1571", company: "Arraun Bikes", owner: "Leire Garai", amount: 18400, stage: "Won", close: "2026-09-12", industry: "Mobility" },
  { deal: "Renewal #413", company: "Txoko Foods", owner: "Mikel Agirre", amount: 6200, stage: "Proposal", close: "2026-10-30", industry: "Food & drink" },
  { deal: "Expansion #3704", company: "Nordlicht GmbH", owner: "Tom Kemp", amount: 42000, stage: "Negotiation", close: "2026-11-15", industry: "Energy" },
  { deal: "Pilot #1491", company: "Kai Studio", owner: "Priya Nair", amount: 3900, stage: "Lead", close: "2026-12-01", industry: "Design" },
  { deal: "New logo #1825", company: "Itsaso Labs", owner: "Leire Garai", amount: 27500, stage: "Won", close: "2026-09-28", industry: "Biotech" },
  { deal: "Upsell #369", company: "Mendi Outdoor", owner: "Mikel Agirre", amount: 11800, stage: "Proposal", close: "2026-10-21", industry: "Retail" },
  { deal: "Renewal #75", company: "Haizea Wind", owner: "Tom Kemp", amount: 15300, stage: "Negotiation", close: "2026-11-02", industry: "Energy" },
  { deal: "New logo #1642", company: "Gaztelu Hotels", owner: "Priya Nair", amount: 8700, stage: "Lead", close: "2026-12-10", industry: "Hospitality" },
];
const NEW_ROW = { deal: "New logo #1958", company: "Lauburu Coffee", owner: "Leire Garai", amount: 9600, stage: "Lead", close: "2026-12-15", industry: "Food & drink" };

const SCENES = [
  { key: "import", tag: "Import", head: "Drop in a spreadsheet.", body: "Drag a CSV onto the page and it becomes a table. Column types are guessed for you, and you can fix them later." },
  { key: "smart", tag: "AI columns", head: "Let AI fill in the boring columns.", body: "Write a prompt that uses other columns, try it on three rows, then let it fill the rest in the background." },
  { key: "ask", tag: "Ask", head: "Ask questions in plain words.", body: "An assistant reads your tables with read-only SQL and shows its work. Anything that changes data waits for your OK." },
  { key: "dash", tag: "Dashboards", head: "Charts without writing SQL.", body: "Pick a table, a measure and a grouping. Share the dashboard with your team or with a read-only link." },
  { key: "form", tag: "Forms", head: "Forms that land as rows.", body: "Publish a form, and every answer becomes a row. A workflow can pick it up from there and send the email for you." },
];

const eur = (n) => `€${n.toLocaleString("en-US")}`;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

const ICONS = {
  home: "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
  inbox: "M3 13h5l1.5 3h5L16 13h5M5 5h14l2 8v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6z",
  code: "m8 7-5 5 5 5M16 7l5 5-5 5",
  chart: "M4 20h16M7 16v-5M12 16V6M17 16v-8",
  grid: "M4 4h16v16H4zM4 10h16M4 15h16M10 4v16",
  bot: "M5 9h14v10H5zM12 5v4M9 13h.01M15 13h.01M9.5 16h5",
  flow: "M4 4h6v6H4zM14 14h6v6h-6zM7 10v4a3 3 0 0 0 3 3h4",
  form: "M6 3h9l4 4v14H6zM9 11h7M9 15h7M9 7h3",
  shield: "M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6z",
  table: "M4 5h16v14H4zM4 10h16M10 10v9",
  sparkle: "M12 4v4M12 16v4M4 12h4M16 12h4M7 7l2 2M15 15l2 2M17 7l-2 2M9 15l-2 2",
  upload: "M12 16V4M7 9l5-5 5 5M4 16v4h16v-4",
  plus: "M12 5v14M5 12h14",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4",
  filter: "M4 5h16l-6 8v6l-4-2v-4z",
  sort: "M8 4v16M4 8l4-4 4 4M16 20V4M12 16l4 4 4-4",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  send: "M21 3 3 10l7 3 3 7z",
  refresh: "M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7",
  link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
  pen: "M4 20h4L19 9l-4-4L4 16z",
  down: "m6 9 6 6 6-6",
  back: "M19 12H5M11 6l-6 6 6 6",
  check: "m5 12 5 5L20 7",
  cols: "M4 4h16v16H4zM12 4v16",
  file: "M6 3h8l5 5v13H6zM14 3v5h5",
};
const ic = (name, cls = "") => `<svg class="bk-i ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[name]}"/></svg>`;

const favicon = `<svg class="bk-fav" viewBox="0 0 24 24" aria-hidden="true"><rect x="1" y="1" width="22" height="22" fill="#fff" stroke="#0A0A0A" stroke-width="2"/><rect x="5" y="5" width="6" height="14" fill="#2433FF"/><rect x="13" y="5" width="6" height="14" fill="#FFD60A"/></svg>`;
const cursor = `<svg viewBox="0 0 20 22" aria-hidden="true"><path d="M2 1.5 17.5 11l-7 1.4L7 19.8z" fill="#0A0A0A" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>`;

const NAV = [
  ["home", "Home"], ["inbox", "Inbox", 3], ["code", "Queries"], ["chart", "Dashboards"], ["grid", "Reports"],
  ["bot", "Agents"], ["flow", "Workflows"], ["form", "Forms"], ["shield", "Rules"],
];
const TABLES = [["Contacts", 140], ["Deals", 8], ["Tickets", 82], ["Products", 27]];

export const bikoteHTML = () => `
<div class="bk-show" data-bk>
  <div class="bk-app" aria-hidden="true">
    <div class="bk-chrome">
      <span class="bk-dots"><i></i><i></i><i></i></span>
      <span class="bk-url">${favicon}<span>bikote.hirusta.io/w/demo-co/<b data-url>tables/deals</b></span></span>
    </div>
    <div class="bk-body">
      <nav class="bk-side">
        <div class="bk-ws"><i>D</i><b>Demo Co</b>${ic("down")}</div>
        <div class="bk-sbody">
          <span class="bk-search">${ic("search")}Search…<kbd>⌘K</kbd></span>
          ${NAV.map(([i, n, badge]) => `<span class="bk-nav" data-nav="${n}">${ic(i)}${n}${badge ? `<em>${badge}</em>` : ""}</span>`).join("")}
          <p class="bk-sh">Tables <span>+</span></p>
          ${TABLES.map(([n, c]) => `<span class="bk-nav bk-tbl" data-nav="${n}">${ic("table")}${n}<small data-tcount="${n}">${c}</small></span>`).join("")}
        </div>
        <div class="bk-me"><i></i>leire@demo.co<span>owner</span></div>
      </nav>
      <div class="bk-main" data-main></div>
    </div>
    <div class="bk-cursor" data-cursor>${cursor}</div>
  </div>
  <ol class="bk-steps" aria-label="What bikote does">
    ${SCENES.map((s, i) => `
    <li class="bk-step${i === 0 ? " on" : ""}" data-scene="${s.key}">
      <button type="button" aria-pressed="${i === 0}">
        <span class="bk-n">0${i + 1}</span><b>${s.tag}</b><span class="bk-h">${s.head}</span>
      </button>
      <i class="bk-prog" aria-hidden="true"></i>
    </li>`).join("")}
  </ol>
  <p class="bk-cap" aria-live="polite" data-cap>${SCENES[0].body}</p>
</div>`;

const pageHead = ({ back = "", icon = "", title, sub, actions = "" }) => `
  <header class="bk-ph">
    <div>${back ? `<p class="bk-back">${ic("back")}${back}</p>` : ""}<h4>${icon ? ic(icon) : ""}${title}</h4><p class="bk-sub">${sub}</p></div>
    <div class="bk-acts">${actions}</div>
  </header>`;

const btn = (label, { kind = "", icon = "", attr = "" } = {}) => `<span class="bk-btn ${kind}" ${attr}>${icon ? ic(icon) : ""}${label}</span>`;

const typeIcon = { text: "Aa", num: "#", choice: "◉", date: "▦", ai: "✦" };
const COLS = [
  ["Deal", "text"], ["Company", "text", "bk-hide-s"], ["Owner", "text", "bk-hide-s"], ["Amount", "num", "bk-num"], ["Stage", "choice"], ["Close date", "date", "bk-hide-m"],
];
const stagePill = (s) => `<span class="bk-pill" data-stage="${s.toLowerCase()}">${s}</span>`;
const cells = (r) => [esc(r.deal), esc(r.company), esc(r.owner), eur(r.amount), stagePill(r.stage), r.close];
const rowHTML = (r, n, cls = "") => `
  <tr class="${cls}"><td class="bk-rn"><i class="bk-cb"></i><span>${n}</span></td>
    ${cells(r).map((c, j) => `<td class="${COLS[j][2] ?? ""}">${c}</td>`).join("")}</tr>`;
const gridHTML = (rows, { start = 1, total = rows.length } = {}) => `
  <div class="bk-grid">
    <table>
      <colgroup><col class="c-rn"><col class="c-deal"><col class="bk-hide-s"><col class="c-own bk-hide-s"><col class="c-amt"><col class="c-stage"><col class="c-date bk-hide-m"></colgroup>
      <thead><tr><th class="bk-rn"><i class="bk-cb"></i></th>${COLS.map(([n, t, cls = ""]) => `<th class="${cls}"><em data-t="${t}">${typeIcon[t]}</em>${n}</th>`).join("")}</tr></thead>
      <tbody data-rows>${rows.map((r, i) => rowHTML(r, start + i)).join("")}</tbody>
    </table>
    <div class="bk-gf"><span data-range>1–${total} of ${total}</span><span class="bk-sel">100 / page ${ic("down")}</span><span class="bk-btn bk-ghost bk-dis">Previous</span><span class="bk-pg">1 / 1</span><span class="bk-btn bk-ghost">Next</span></div>
  </div>
  <p class="bk-keys"><kbd>↵</kbd> edit · <kbd>⇧</kbd>+arrows select · <kbd>⌘C</kbd> / <kbd>⌘V</kbd> copy &amp; paste cells · <kbd>⌘Z</kbd> undo · <kbd>space</kbd> open row</p>`;

const tableTools = `
  <div class="bk-tabs"><b>Data</b><span>Columns</span><span>Imports</span><span>History</span><span>API</span></div>
  <div class="bk-tools"><span class="bk-in bk-find">${ic("search")}Search this table…<kbd>/</kbd></span>${btn("Filter", { kind: "bk-flat", icon: "filter" })}${btn("Sort", { kind: "bk-flat", icon: "sort" })}<span class="bk-grow"></span>${btn("Columns", { kind: "bk-flat", icon: "cols" })}</div>`;

const dealsHead = (n) => pageHead({
  title: "Deals",
  sub: `Open and closed opportunities. <span data-sub>${n} rows, 7 columns.</span>`,
  actions: btn("Import", { icon: "upload" }) + btn("Smart column", { kind: "bk-y", icon: "sparkle", attr: "data-smart" }) + btn("Add row", { kind: "bk-go", icon: "plus" }),
});

export function initBikote(root) {
  const app = root.querySelector(".bk-app");
  const main = root.querySelector("[data-main]");
  const cur = root.querySelector("[data-cursor]");
  const cap = root.querySelector("[data-cap]");
  const url = root.querySelector("[data-url]");
  const steps = [...root.querySelectorAll(".bk-step")];
  const navs = [...root.querySelectorAll("[data-nav]")];
  const STOP = Symbol("stop");
  let token = 0;
  let paused = true;

  const wait = (ms, t) => new Promise((resolve, reject) => {
    let left = reducedMotion ? 0 : ms;
    const tick = () => {
      if (t !== token) return reject(STOP);
      if (paused && !reducedMotion) return setTimeout(tick, 120);
      if (left <= 0) return resolve();
      const d = Math.min(left, 60);
      left -= d;
      setTimeout(tick, d);
    };
    tick();
  });

  const type = async (el, text, t, speed = 34) => {
    if (reducedMotion) { el.textContent = text; return; }
    for (let i = 1; i <= text.length; i++) {
      el.textContent = text.slice(0, i);
      await wait(speed, t);
    }
  };

  const point = async (el, t, { click = false, dx = 0.5, dy = 0.5 } = {}) => {
    if (!el) return;
    const a = app.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    cur.classList.add("on");
    cur.style.transform = `translate(${r.left - a.left + r.width * dx}px, ${r.top - a.top + r.height * dy}px)`;
    await wait(720, t);
    if (click) {
      cur.classList.add("press");
      el.classList.add("pressed");
      await wait(200, t);
      cur.classList.remove("press");
      el.classList.remove("pressed");
    }
  };

  const go = (name, path) => {
    navs.forEach((n) => n.classList.toggle("on", n.dataset.nav === name));
    url.textContent = path;
  };
  const setCount = (n) => { root.querySelector('[data-tcount="Deals"]').textContent = n; };
  const toast = (html) => {
    main.insertAdjacentHTML("beforeend", `<div class="bk-toast">${html}</div>`);
    const el = main.lastElementChild;
    requestAnimationFrame(() => el.classList.add("on"));
  };

  const countUp = async (el, to, t, fmt = (n) => n.toLocaleString("en-US")) => {
    const n = 18;
    for (let i = 1; i <= n; i++) {
      el.textContent = fmt(Math.round(to * (1 - (1 - i / n) ** 3)));
      await wait(40, t);
    }
  };

  const scenes = {
    async import(t) {
      go("Deals", "tables/new");
      setCount("–");
      main.innerHTML = `
        ${pageHead({ back: "Tables", title: "New table", sub: "Start empty, from a template, or from a file you already have." })}
        <div class="bk-tabs"><span>Empty</span><span>Template</span><b>From a file</b><span>Paste text</span></div>
        <div class="bk-drop" data-drop>
          <div class="bk-drop-in">${ic("upload")}<b>Drop a CSV or JSON file here</b><span>or paste rows straight from a spreadsheet</span></div>
          <div class="bk-file" data-file><i>CSV</i><b>deals.csv</b><span>8 rows · 6 columns · 1.2 KB</span></div>
        </div>`;
      const drop = main.querySelector("[data-drop]");
      const file = main.querySelector("[data-file]");
      await wait(400, t);
      file.classList.add("fly");
      await point(drop, t, { dy: 0.62 });
      drop.classList.add("over");
      await wait(500, t);
      file.classList.add("dropped");
      await wait(350, t);
      main.innerHTML = `
        ${pageHead({ back: "Tables", title: "deals.csv", sub: "We guessed a type for every column. Change any of them before importing." })}
        <div class="bk-map">${COLS.map(([n, ty], i) => `<div class="bk-mapc" style="--i:${i}"><b>${n}</b><span class="bk-sel"><em data-t="${ty}">${typeIcon[ty]}</em>${{ text: "Text", num: "Number", choice: "Choice", date: "Date" }[ty]} ${ic("down")}</span><small>${esc(cells(ROWS[0])[i].replace(/<[^>]+>/g, ""))}</small></div>`).join("")}</div>
        <div class="bk-mapf"><span>Unique key</span><span class="bk-sel">Deal ${ic("down")}</span><span class="bk-grow"></span>${btn("Import 8 rows", { kind: "bk-go", attr: "data-go" })}</div>`;
      await wait(900, t);
      await point(main.querySelector("[data-go]"), t, { click: true });
      cur.classList.remove("on");
      go("Deals", "tables/deals");
      main.innerHTML = `${dealsHead(0)}${tableTools}${gridHTML([])}`;
      const body = main.querySelector("[data-rows]");
      for (let i = 0; i < ROWS.length; i++) {
        body.insertAdjacentHTML("beforeend", rowHTML(ROWS[i], i + 1, "in"));
        main.querySelector("[data-range]").textContent = `1–${i + 1} of ${i + 1}`;
        main.querySelector("[data-sub]").textContent = `${i + 1} rows, 6 columns.`;
        setCount(i + 1);
        await wait(110, t);
      }
      toast(`${ic("check")} 8 rows imported · 0 errors`);
      await wait(2800, t);
    },

    async smart(t) {
      go("Deals", "tables/deals");
      setCount(8);
      main.innerHTML = `${dealsHead(8)}${tableTools}${gridHTML(ROWS)}
        <aside class="bk-drawer" data-drawer>
          <div class="bk-dh"><b>${ic("sparkle")}New smart column</b><span>×</span></div>
          <label>Name<span class="bk-in" data-name></span></label>
          <label>Prompt<span class="bk-in bk-prompt" data-prompt></span><small>Use {{column}} to pass a value from the row.</small></label>
          <div class="bk-two"><label>Type<span class="bk-sel">Choice ${ic("down")}</span></label><label>Model<span class="bk-sel">Gemini 2.5 Flash ${ic("down")}</span></label></div>
          <div class="bk-prev" data-prev><p>Preview on 3 rows</p>${ROWS.slice(0, 3).map((r) => `<div><span>${esc(r.company)}</span><b data-p="${esc(r.industry)}"></b></div>`).join("")}</div>
          <div class="bk-df">${btn("Preview", { attr: "data-try" })}${btn("Add column", { kind: "bk-go", attr: "data-save" })}</div>
        </aside>`;
      await wait(300, t);
      await point(main.querySelector("[data-smart]"), t, { click: true });
      const drawer = main.querySelector("[data-drawer]");
      drawer.classList.add("on");
      await wait(400, t);
      await type(main.querySelector("[data-name]"), "Industry", t, 50);
      const prompt = main.querySelector("[data-prompt]");
      const text = "Which industry is {{Company}} in? Answer in one or two words.";
      for (let i = 1; i <= text.length; i++) {
        prompt.innerHTML = esc(text.slice(0, i)).replace(/\{\{Company\}\}/, "<mark>{{Company}}</mark>");
        if (!reducedMotion) await wait(22, t);
      }
      prompt.innerHTML = esc(text).replace(/\{\{Company\}\}/, "<mark>{{Company}}</mark>");
      await point(main.querySelector("[data-try]"), t, { click: true });
      const prev = main.querySelector("[data-prev]");
      prev.classList.add("on");
      for (const b of prev.querySelectorAll("[data-p]")) {
        b.classList.add("busy");
        await wait(320, t);
        b.classList.remove("busy");
        b.textContent = b.dataset.p;
      }
      await wait(500, t);
      await point(main.querySelector("[data-save]"), t, { click: true });
      drawer.classList.remove("on");
      cur.classList.remove("on");
      main.querySelector("colgroup").insertAdjacentHTML("beforeend", `<col class="c-ai">`);
      main.querySelector("thead tr").insertAdjacentHTML("beforeend", `<th class="bk-ai-h"><em data-t="ai">✦</em>Industry</th>`);
      main.querySelector("[data-sub]").textContent = "8 rows, 7 columns.";
      const tds = [...main.querySelectorAll("tbody tr")].map((tr, i) => {
        tr.insertAdjacentHTML("beforeend", `<td class="bk-ai busy" data-ai="${esc(ROWS[i].industry)}"><span></span></td>`);
        return tr.lastElementChild;
      });
      toast(`${ic("sparkle")} Filling 8 cells in the background…`);
      await wait(700, t);
      for (const c of tds) {
        c.classList.remove("busy");
        c.classList.add("done");
        c.querySelector("span").textContent = c.dataset.ai;
        await wait(230, t);
      }
      await wait(2200, t);
    },

    async ask(t) {
      go("Agents", "agents/data-analyst");
      main.innerHTML = `
        ${pageHead({ back: "Agents", icon: "bot", title: "Data analyst", sub: "Answers questions about your data with real numbers.", actions: `<span class="bk-seg"><b>Chat</b><span>Settings</span><span>Memory</span><span>Activity</span></span>` })}
        <div class="bk-agent">
          <div class="bk-convs">
            <div class="bk-convh"><b>Conversations</b>${btn("New", { icon: "plus" })}</div>
            <div class="bk-conv on"><span data-ctitle>New conversation</span><small>now</small></div>
            <div class="bk-conv"><span>Which companies have the most open tickets?</span><small>3 d ago</small></div>
            <div class="bk-conv"><span>Forecast for December</span><small>8 d ago</small></div>
          </div>
          <div class="bk-chat">
            <div class="bk-msgs" data-msgs>
              <div class="bk-empty" data-empty>${ic("bot")}<b>Ask Data analyst</b><p>It can see your tables, run read-only SQL and search the workspace. It asks before changing anything.</p>
                <div class="bk-sugg"><span>What changed in the last 7 days?</span><span>Which numbers look unusual right now?</span></div></div>
            </div>
            <div class="bk-composer"><span class="bk-cin"><span data-q></span><i class="bk-caret"></i></span><span class="bk-send">${ic("send")}</span></div>
          </div>
        </div>`;
      const msgs = main.querySelector("[data-msgs]");
      const q = "Which won deals are over €10k?";
      await wait(500, t);
      await type(main.querySelector("[data-q]"), q, t, 38);
      await wait(250, t);
      main.querySelector("[data-q]").textContent = "";
      main.querySelector("[data-empty]").remove();
      main.querySelector("[data-ctitle]").textContent = q;
      msgs.insertAdjacentHTML("beforeend", `<div class="bk-msg me">${esc(q)}</div>`);
      await wait(500, t);
      msgs.insertAdjacentHTML("beforeend", `
        <div class="bk-tool"><p>${ic("code")}<b>run_sql</b><span>read-only</span><i class="bk-spin"></i></p><pre data-sql></pre></div>`);
      await type(msgs.querySelector("[data-sql]"), "select company, amount from deals\nwhere stage = 'Won' and amount > 10000\norder by amount desc", t, 14);
      await wait(350, t);
      const tool = msgs.querySelector(".bk-tool");
      tool.classList.add("ok");
      tool.insertAdjacentHTML("beforeend", `<table class="bk-mini"><tr><th>company</th><th class="bk-num">amount</th></tr><tr><td>Itsaso Labs</td><td class="bk-num">27,500</td></tr><tr><td>Arraun Bikes</td><td class="bk-num">18,400</td></tr><tr><td colspan="2" class="bk-muted">2 rows · 4 ms</td></tr></table>`);
      await wait(700, t);
      msgs.insertAdjacentHTML("beforeend", `<div class="bk-msg ai" data-a></div>`);
      await type(msgs.querySelector("[data-a]"), "Two: Itsaso Labs (€27,500) and Arraun Bikes (€18,400), both Leire's. Want me to flag them for a thank-you email?", t, 13);
      await wait(500, t);
      msgs.insertAdjacentHTML("beforeend", `
        <div class="bk-approve"><p><b>Wants to change 2 rows</b><span>update_rows · deals · <code>thank_you = yes</code></span></p>
        <span class="bk-acts">${btn("Reject")}${btn("Approve", { kind: "bk-go", attr: "data-ok" })}</span></div>`);
      await wait(400, t);
      const ok = msgs.querySelector("[data-ok]");
      await point(ok, t, { click: true });
      cur.classList.remove("on");
      msgs.querySelector(".bk-approve").classList.add("ok");
      ok.innerHTML = `${ic("check")}Approved`;
      await wait(400, t);
      msgs.insertAdjacentHTML("beforeend", `<div class="bk-msg ai">Done. Both rows are flagged.</div>`);
      await wait(2200, t);
    },

    async dash(t) {
      go("Dashboards", "dashboards/sales-overview");
      const byMonth = [11, 11, 8.5, 12, 11.3, 12.4, 11.5, 8.3, 10.8, 9.9, 11.1, 12.3];
      const slices = [["Open", 26, "#2433FF"], ["On hold", 25, "#FFD60A"], ["Lost", 24, "#0A0A0A"], ["Won", 25, "#FF5A36"]];
      let acc = 0;
      main.innerHTML = `
        ${pageHead({ back: "Dashboards", title: "Sales overview", sub: "Pipeline and wins at a glance", actions: `<span class="bk-sel bk-wsel">No auto-refresh ${ic("down")}</span>${btn("", { icon: "refresh" })}${btn("Share", { icon: "link", attr: "data-share" })}${btn("Edit", { icon: "pen" })}` })}
        <div class="bk-dash">
          <div class="bk-w bk-wf"><p>Deal status</p><span class="bk-sel">Open ${ic("down")}</span></div>
          <div class="bk-tiles">
            ${[["Pipeline (open)", "n1"], ["Won this year", "n2"], ["Open deals", "n3"], ["Avg. deal", "n4"]].map(([h, k]) => `<div class="bk-w"><p>${h}</p><b data-${k}>0</b></div>`).join("")}
          </div>
          <div class="bk-charts">
            <div class="bk-w"><p>Deals by status</p>
              <div class="bk-donut-wrap"><div class="bk-donut"><svg viewBox="0 0 42 42">${slices.map(([, p, c]) => { const el = `<circle r="15.9" cx="21" cy="21" fill="none" stroke="${c}" stroke-width="8" pathLength="100" style="--d:${p} ${100 - p}" stroke-dashoffset="${-acc}"/>`; acc += p; return el; }).join("")}</svg><span><b>498.9k</b>total</span></div>
              <ul>${slices.map(([n, p, c]) => `<li><i style="background:${c}"></i>${n}<b>${p}%</b></li>`).join("")}</ul></div>
            </div>
            <div class="bk-w"><p>Closing per month</p>
              <div class="bk-bars"><div class="bk-axis"><span>15k</span><span>10k</span><span>5k</span><span>0</span></div>
              ${byMonth.map((v, i) => `<div><i style="--h:${(v / 15) * 100}%"></i><span>${String(i + 1).padStart(2, "0")}</span></div>`).join("")}</div>
            </div>
          </div>
        </div>`;
      await wait(300, t);
      main.querySelector(".bk-dash").classList.add("go");
      await Promise.all([
        countUp(main.querySelector("[data-n1]"), 85900, t, eur),
        countUp(main.querySelector("[data-n2]"), 45900, t, eur),
        countUp(main.querySelector("[data-n3]"), 6, t),
        countUp(main.querySelector("[data-n4]"), 16650, t, eur),
      ]);
      await wait(700, t);
      const bar = main.querySelectorAll(".bk-bars > div:not(.bk-axis)")[11];
      await point(bar.querySelector("i"), t, { dy: 0.3 });
      bar.classList.add("hot");
      bar.insertAdjacentHTML("beforeend", `<em class="bk-tip" style="--tiph:${(12.3 / 15) * 100}%">2026-12 · €12,300</em>`);
      await wait(1200, t);
      await point(main.querySelector("[data-share]"), t, { click: true });
      cur.classList.remove("on");
      toast(`${ic("link")} Read-only link copied`);
      await wait(2200, t);
    },

    async form(t) {
      go("Forms", "forms/request-a-demo");
      main.innerHTML = `
        ${pageHead({ back: "Forms", icon: "form", title: "Request a demo", sub: "Answers go to <b>Deals</b>. Workflow <b>New lead</b> runs on every answer.", actions: `<span class="bk-seg"><span>Build</span><b>Preview</b><span>Share</span><span>Results</span></span>` })}
        <div class="bk-tf">
          <i class="bk-tfbar" data-bar></i>
          <div class="bk-tfq" data-q>
            <p class="bk-tfn" data-n>1 →</p>
            <h5 data-h>What's your name?</h5>
            <span class="bk-tfin" data-in><span data-v></span><i class="bk-caret"></i></span>
            <span class="bk-btn bk-go" data-ok>OK ${ic("check")}</span><small>press <b>Enter ↵</b></small>
          </div>
        </div>`;
      const qs = [["What's your name?", "Maite Zubiri"], ["Which company are you with?", NEW_ROW.company], ["Roughly what's your budget?", eur(NEW_ROW.amount)]];
      const bar = main.querySelector("[data-bar]");
      for (let i = 0; i < qs.length; i++) {
        const q = main.querySelector("[data-q]");
        q.classList.remove("in");
        main.querySelector("[data-n]").textContent = `${i + 1} →`;
        main.querySelector("[data-h]").textContent = qs[i][0];
        main.querySelector("[data-v]").textContent = "";
        void q.offsetWidth;
        q.classList.add("in");
        await wait(500, t);
        await type(main.querySelector("[data-v]"), qs[i][1], t, 45);
        await wait(250, t);
        await point(main.querySelector("[data-ok]"), t, { click: true });
        bar.style.setProperty("--p", (i + 1) / qs.length);
      }
      cur.classList.remove("on");
      main.querySelector("[data-q]").outerHTML = `<div class="bk-tfq in bk-thanks">${ic("check")}<h5>Thanks, Maite!</h5><p>We'll be in touch within a day.</p></div>`;
      await wait(1300, t);
      go("Deals", "tables/deals");
      main.innerHTML = `${dealsHead(8)}${tableTools}${gridHTML(ROWS)}`;
      await wait(500, t);
      const body = main.querySelector("[data-rows]");
      body.insertAdjacentHTML("afterbegin", rowHTML({ ...NEW_ROW, owner: "Leire Garai" }, 9, "in fresh"));
      main.querySelector("[data-range]").textContent = "1–9 of 9";
      main.querySelector("[data-sub]").textContent = "9 rows, 7 columns.";
      setCount(9);
      await wait(700, t);
      toast(`${ic("flow")} Workflow “New lead” · emailed Leire`);
      await wait(2600, t);
    },
  };

  const select = (i) => {
    steps.forEach((el, j) => {
      el.classList.toggle("on", j === i);
      el.querySelector("button").setAttribute("aria-pressed", String(j === i));
      el.style.setProperty("--p", j < i ? 1 : 0);
    });
    cap.textContent = SCENES[i].body;
  };

  async function play(i) {
    const t = ++token;
    select(i);
    cur.classList.remove("on");
    const started = performance.now();
    const step = steps[i];
    let held = 0;
    let last = started;
    const bar = (now) => {
      if (t !== token) return;
      if (paused) held += now - last;
      last = now;
      step.style.setProperty("--p", Math.min((now - started - held) / 12000, 0.96));
      requestAnimationFrame(bar);
    };
    if (!reducedMotion) requestAnimationFrame(bar);
    try {
      await scenes[SCENES[i].key](t);
      step.style.setProperty("--p", 1);
      if (reducedMotion) { cur.classList.remove("on"); return; }
      await wait(200, t);
      play((i + 1) % SCENES.length);
    } catch (e) {
      if (e !== STOP) throw e;
    }
  }

  steps.forEach((el, i) => el.querySelector("button").addEventListener("click", () => play(i)));

  new IntersectionObserver(([e]) => {
    paused = !e.isIntersecting;
  }, { threshold: 0.25 }).observe(app);

  play(0);
}

const CASES = [
  {
    key: "sales", tag: "Sales pipeline", who: "A five-person sales team",
    before: "Leads live in a shared spreadsheet. Nobody knows which deals are stuck, and the big ones get noticed late.",
    steps: [
      ["Import", "Drop the leads CSV in. It becomes a deals table with amounts, stages and owners."],
      ["AI column", "Add an industry column that fills itself from the company name."],
      ["Workflow", "When a deal over €10k is added, email its owner."],
      ["Dashboard", "Pipeline by stage and win rate, shared with the team by link."],
    ],
  },
  {
    key: "support", tag: "Support desk", who: "A small product team",
    before: "Bug reports arrive by email and chat. Some get answered twice, some never.",
    steps: [
      ["Form", "Publish a bug report form. Every answer lands as a row in a tickets table."],
      ["AI column", "Set the urgency of each ticket from its description."],
      ["Rule", "No urgent ticket may stay without an owner. You get an email when one does."],
      ["Inbox", "Each person gets notified about the tickets they watch."],
    ],
  },
  {
    key: "hiring", tag: "Hiring", who: "A founder hiring two people",
    before: "CVs are in a downloads folder, notes in a doc, and the shortlist in your head.",
    steps: [
      ["Template", "Start from the hiring template: candidates, stages, notes."],
      ["Form", "An application form with a CV upload, so every candidate is a row."],
      ["AI column", "A two-line summary of each CV, and the years of experience pulled out of it."],
      ["Report", "Candidates per stage, refreshed every time you open it."],
    ],
  },
  {
    key: "stock", tag: "Stock & orders", who: "A shop with a warehouse",
    before: "The supplier sends a spreadsheet every week and someone copies it by hand.",
    steps: [
      ["Import", "Paste the supplier's sheet. Matching rows are updated by SKU, new ones added."],
      ["Rule", "Stock may never go below zero. Imports that break it are flagged with the rows."],
      ["Schedule", "Every Monday, a workflow emails the list of items to reorder."],
      ["Ask", "\"What sold most last month?\" The assistant answers with read-only SQL."],
    ],
  },
];

export const bikoteCasesHTML = () => `
<div class="bk-cases">
  <div class="bk-cases-h">
    <h3>What it looks like in practice</h3>
    <div class="bk-case-tabs" role="tablist" aria-label="Use cases">
      ${CASES.map((c, i) => `<button type="button" role="tab" aria-selected="${i === 0}" data-case="${c.key}">${c.tag}</button>`).join("")}
    </div>
  </div>
  ${CASES.map((c, i) => `
  <article class="bk-case" data-case-panel="${c.key}"${i === 0 ? "" : " hidden"}>
    <div class="bk-case-before"><p class="bk-case-k">${c.who}, today</p><p>${c.before}</p></div>
    <ol class="bk-case-steps">
      ${c.steps.map(([k, t], j) => `<li style="--i:${j}"><span>${k}</span><p>${t}</p></li>`).join("")}
    </ol>
  </article>`).join("")}
</div>`;

export function initBikoteCases(root) {
  root.addEventListener("click", (e) => {
    const tab = e.target.closest("[data-case]");
    if (!tab) return;
    root.querySelectorAll("[data-case]").forEach((b) => b.setAttribute("aria-selected", String(b === tab)));
    root.querySelectorAll("[data-case-panel]").forEach((p) => { p.hidden = p.dataset.casePanel !== tab.dataset.case; });
  });
}

