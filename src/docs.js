import { dossiers } from "./projects.js";

const GROUPS = [
  ["apps", "Mac apps"],
  ["work", "Workspace"],
  ["read", "Encyclopedias"],
  ["oss", "Open source"],
];

const early = (slug, label = "Ask for early access") => ({ early: slug, label });

export const docs = [
  {
    slug: "lemazain", name: "lemazain", group: "apps", gloss: "helmsman", kind: "Kubernetes app for the Mac",
    line: "See every cluster you have access to, find what's broken, and fix it without typing kubectl all day.",
    chips: ["€39 once", "macOS 14+", "in early access"],
    who: "You run or debug workloads on Kubernetes and keep a terminal full of `kubectl get` and `kubectl logs`.",
    uses: [
      ["A pod is crash-looping at 9am", "Open the Problems view. Crash loops, OOM kills, stuck rollouts and unready nodes from every namespace are on one screen, so you start from the broken thing instead of hunting for it."],
      ["You need the logs from all replicas", "Pick the deployment and read every container's logs interleaved, with errors marked, instead of opening one terminal per pod."],
      ["You're on the production context", "Contexts that look like prod open read-only and tinted red. Deleting or scaling anything means unlocking first, on purpose."],
      ["You work with CRDs", "Custom resources get the same live tables kubectl shows, because rows come from the API server's own table format. A cert-manager Certificate or a Kafka topic looks like any other kind."],
    ],
    start: [
      { t: "Ask for early access below. When it's ready you get a licence key by email." },
      { t: "Download the app and open it. It reads your existing kubeconfig; there's no kubectl subprocess and nothing else to install." },
      { t: "Paste the key on first launch. One key works on three Macs, and you can manage it from a terminal too:", code: "lemazain license status" },
    ],
    cta: early("lemazain"),
    how: [
      ["Talks to the API server directly", "One ~10 MB Swift binary using your kubeconfig, with TLS pinned to the CA in it. Tables update from real watch streams, not polling."],
      ["Every kind, including CRDs", "The sidebar comes from the cluster's own discovery, so anything the cluster knows about shows up."],
      ["Production is locked by default", "Contexts that look like prod open read-only until you unlock them."],
    ],
    links: [{ label: "Full tour", href: "/lemazain/" }],
  },
  {
    slug: "taula", name: "Taula", group: "apps", gloss: "table", kind: "Postgres & SQLite app for the Mac",
    line: "Browse and edit your databases, and see the exact SQL before anything is written.",
    chips: ["€25 once", "macOS 15+", "in early access"],
    who: "You look at Postgres or SQLite data most days and want something quicker than psql that won't let you break production by accident.",
    uses: [
      ["Fix a few wrong rows", "Edit cells in the grid. Nothing is saved until you commit, and you see the UPDATE statements first. The change journal can undo it afterwards."],
      ["Someone types DELETE without WHERE", "Taula stops and asks. On a connection marked production it asks harder, and takes a snapshot of the table first."],
      ["Follow a foreign key", "Right-click a foreign key and jump to the row it points at, instead of copying an id into a new query."],
      ["Let your coding agent read the database", "taula-mcp exposes your saved connections to an AI agent over MCP, so it can look at real data without you pasting it."],
    ],
    start: [
      { t: "Ask for early access below and you'll get a licence key by email." },
      { t: "Open Taula, paste the key, and add a connection: a Postgres URL, a SQLite file or a Cloudflare D1 database." },
      { t: "If you use an AI coding agent, point it at the MCP server:", code: "taula-mcp   # MCP over stdio, using your saved connections" },
    ],
    cta: early("taula"),
    how: [
      ["Edits are staged as SQL", "Every change becomes a statement you can read before it runs, and a journal entry you can reverse."],
      ["Guardrails that read the SQL", "UPDATE or DELETE without WHERE, TRUNCATE and DROP are caught before they run."],
      ["Native and small", "Swift and SwiftUI, no Electron. Query builder, relations diagram, and an optional assistant that runs on your Mac."],
    ],
    links: [{ label: "Full tour", href: "/taula/" }],
  },
  {
    slug: "adar", name: "adar", group: "apps", gloss: "branch", kind: "Pull-request app for the Mac",
    line: "Review pull requests from one inbox, read the whole diff at once, and hand a PR to your coding agent in one keystroke.",
    chips: ["€9 once", "macOS 26+", "GitHub · Forgejo"],
    who: "You review a lot of pull requests and the GitHub web UI makes you click through tabs and collapsed files to do it.",
    uses: [
      ["Morning review round", "Open the inbox: review requests, your own PRs and threads you're in, each with its checks and review state. Move with j and k."],
      ["A check is red but was re-run", "adar grades checks by name, so a flaky failure that passed on a re-run shows as green. Red means something is still failing."],
      ["A PR has merge conflicts", "The conversation shows a card that merges the base into the PR locally, lists every clashing file, and lets you keep one side per file."],
      ["You want an agent to look at it", "⇧⌘R opens Claude Code, Codex or your own command in a worktree checked out at the PR head."],
    ],
    start: [
      { t: "Log in to GitHub with the gh CLI if you haven't. adar reuses that session; there's no token to paste.", code: "gh auth login" },
      { t: "Ask for early access below, then open adar with the key you get by email." },
      { t: "Your inbox fills in from what's waiting for you. The menu bar icon shows red checks and pending reviews." },
    ],
    cta: early("adar"),
    how: [
      ["Uses your gh login", "No OAuth app and no tokens. Forgejo works too."],
      ["The whole diff in one view", "Syntax highlighted, with the changed words inside a line marked, and a file list that filters and jumps."],
      ["An agent in the checkout", "A worktree at the PR head, ready for whatever agent you use."],
    ],
    links: [{ label: "Full tour", href: "/adar/" }],
  },
  {
    slug: "bidali", name: "bidali", group: "apps", gloss: "to send", kind: "HTTP client for the Mac",
    line: "Send and test API requests from a native app that reads and writes Bruno collections.",
    chips: ["Free", "macOS 14+", "Bruno-compatible"],
    who: "You test HTTP APIs, maybe already use Bruno or Postman, and want your requests to live in git next to the code.",
    uses: [
      ["Keep API requests in the repo", "Every request is a .bru file in a folder. Commit it, review it in a PR, and your teammates open the same collection in bidali or Bruno."],
      ["Chain a login and a call", "A post-response script saves the token with bru.setVar, and the next request uses {{token}}. Same script API as Bruno, no Node needed."],
      ["Run the collection in CI", "The app's runner is also a command-line tool, with JUnit output for your CI.", ],
      ["Move off Postman", "Import Postman collections and environments (pm.* scripts are translated), OpenAPI, Insomnia, HAR, .http files or a pasted curl."],
    ],
    start: [
      { t: "bidali is free. Leave your email below and you'll get the download when it's ready." },
      { t: "Open an existing Bruno collection folder, or import one from Postman, OpenAPI or curl." },
      { t: "Run the whole collection from a terminal or CI:", code: "bidali run . --env staging --reporter junit" },
    ],
    cta: early("bidali", "Get it free when it's ready"),
    how: [
      ["Byte for byte with Bruno", "A request edited here and in Bruno produces the same text. The test suite checks the round trip."],
      ["Scripts on JavaScriptCore", "bru, req, res, test and expect run inside the app. A script that loops forever is stopped after 60 seconds."],
      ["Secrets stay out of git", "Secret environment values live in a file in your home folder, never in the collection."],
    ],
    links: [],
  },
  {
    slug: "bikote", name: "bikote", group: "work", gloss: "pair, couple", kind: "Data workspace, in the browser",
    line: "Tables, AI columns, dashboards, forms and workflows for a team that doesn't write code.",
    chips: ["Private beta", "Web", "Rust · Postgres"],
    who: "Your team runs on spreadsheets that have grown too big, or you keep asking a developer for a quick query.",
    uses: [
      ["A sales pipeline that isn't a spreadsheet", "Import the leads CSV, add an AI column that guesses each company's industry, and build a pipeline dashboard. A workflow emails the owner when a deal over €10k comes in."],
      ["A support desk", "Publish a form for bug reports; every answer is a row. An AI column sets the urgency and a rule warns you when an urgent ticket has no owner."],
      ["Hiring", "Start from the hiring template, collect applications with a form that accepts a CV, and let an AI column summarise each one."],
      ["Questions you'd ask a developer", "Ask the assistant \"which customers haven't paid in 30 days?\". It writes read-only SQL, shows its work, and asks before changing anything."],
    ],
    start: [
      { t: "Ask for an invite in the bikote section above." },
      { t: "Pick a template (CRM, support, inventory or hiring) or drop in a CSV." },
      { t: "Invite your team as owner, admin, editor or viewer." },
    ],
    cta: { href: "#bikote", label: "Ask for an invite" },
    how: [
      ["Your tables are real Postgres tables", "Each workspace is its own schema. SQL from people and from agents runs read-only, with the workspace's own role."],
      ["AI columns run in the background", "Gemini, Anthropic or any OpenAI-compatible model fills cells through a durable queue. You preview three rows before it touches the rest."],
      ["Writes wait for approval", "When the assistant wants to change data, it stops and asks. Tools run with the role of the person chatting."],
    ],
    links: [{ label: "bikote.hirusta.io", href: "https://bikote.hirusta.io" }],
  },
  {
    slug: "gizapedia", name: "gizapedia", group: "read", gloss: "giza: human, of people", kind: "Encyclopedia, in Basque",
    line: "Philosophy, politics, economics, sociology and statistics, written in Basque, with sources.",
    chips: ["Free", "8,099 articles", "11,012 dictionary entries"],
    who: "You study, teach, translate or write about the social sciences in Basque and keep running out of references.",
    uses: [
      ["Writing an essay in Basque", "Read a long article on the topic and follow its references, instead of translating an English or Spanish source yourself."],
      ["Looking for the right term", "The dictionary has eleven thousand entries and grows every day. Useful when you know the word in Spanish but not in Basque."],
      ["Preparing a class", "Articles link to related ones, so you can build a reading list around one idea."],
    ],
    start: [
      { t: "Go to gizapedia.org and search, or start from a field like philosophy or economics." },
      { t: "Every article lists its references and related reading at the end." },
    ],
    cta: { href: "https://gizapedia.org", label: "Open gizapedia.org", out: true },
    how: dossiers.gizapedia.how.slice(0, 3),
    links: [{ label: "How it's built", href: "#p/gizapedia" }],
  },
  {
    slug: "ikusmira", name: "ikusmira", group: "read", gloss: "outlook, perspective", kind: "Educational archive, in Spanish",
    line: "Study routes, ten-minute book summaries and a reading a day, in Spanish, with nothing about you leaving your browser.",
    chips: ["Free", "4,429 articles", "25 study routes"],
    who: "You read in Spanish and want to learn a subject properly, in order, without signing up for anything.",
    uses: [
      ["Learning a subject from zero", "Follow one of the 25 study routes. Each one is an ordered list of articles, from the basics up."],
      ["Deciding whether to read a book", "Read its ten-minute summary first. 104 essential books have one."],
      ["A daily habit", "There's a new reading every day, short enough for a coffee."],
    ],
    start: [
      { t: "Go to ikusmira.org and pick a study route, or search for a topic." },
      { t: "Articles are sorted by difficulty and purpose in your own browser. No account and no tracking of what you read." },
    ],
    cta: { href: "https://ikusmira.org", label: "Open ikusmira.org", out: true },
    how: dossiers.ikusmira.how.slice(0, 3),
    links: [{ label: "How it's built", href: "#p/ikusmira" }],
  },
  {
    slug: "sutegi", name: "sutegi", group: "oss", gloss: "forge", kind: "Rust web framework",
    line: "Build a web app in Rust with no third-party dependencies and a tiny binary, that an AI agent can also operate.",
    chips: ["MIT", "Rust", "crates.io"],
    who: "You write web services in Rust and want small binaries, fast builds and code you can read end to end.",
    uses: [
      ["A small API that ships as one file", "A core-only service is about 394 KB. Copy the binary to a server and run it; it drains requests cleanly on SIGTERM."],
      ["A full app with users and email", "Turn on the features you need: Postgres or SQLite, login and sessions, background jobs, templates, mail, file storage. bikote is built this way."],
      ["Let an agent use your app", "Every route, model and tool is listed as JSON at /__introspect and /__tools, so an LLM can call your app without a custom SDK."],
    ],
    start: [
      { t: "Add it with only the features you need:", code: "sutegi = { version = \"*\", default-features = false, features = [\"sqlite\"] }" },
      { t: "Write the app:", code: dossiers.sutegi.usage.code },
      { t: "Or run the example and look around:", code: "cargo run -p todo-example -- 127.0.0.1:8080\ncurl localhost:8080/__tools" },
    ],
    cta: { href: "https://github.com/enekos/sutegi", label: "sutegi on GitHub", out: true },
    how: dossiers.sutegi.how.slice(0, 3),
    links: [{ label: "Docs", href: "https://enekos.github.io/sutegi/" }, { label: "More detail", href: "#p/sutegi" }],
  },
  {
    slug: "artzain", name: "artzain", group: "oss", gloss: "shepherd", kind: "Process orchestrator",
    line: "Keep a few binaries running on one server, with replicas, restarts and rolling updates, from one small config file.",
    chips: ["Rust", "one binary", "systemd-ready"],
    who: "You deploy prebuilt binaries to a VPS. A process manager is too little and Kubernetes is far too much.",
    uses: [
      ["Three replicas of a web app on one box", "Set replicas = 3 and artzain runs them on 8080, 8081 and 8082, restarts any that crash, and waits for each to be ready."],
      ["Deploy without downtime", "Edit the manifest and artzain replaces replicas one at a time. With max_surge = 1 the new one starts before the old one stops."],
      ["Run it as a service", "Generate a hardened systemd unit with one command and let the server start artzain on boot."],
    ],
    start: [
      { t: "Describe what should run:", code: dossiers.artzain.usage.code },
      { t: "Install it as a system service:", code: "artzain systemd --install" },
    ],
    cta: { href: "https://github.com/enekos/artzain", label: "artzain on GitHub", out: true },
    how: dossiers.artzain.how.slice(0, 3),
    limits: "It doesn't build code, run containers or span machines. You give it a binary that's already built.",
    links: [{ label: "More detail", href: "#p/artzain" }],
  },
  {
    slug: "arrano", name: "arrano", group: "oss", gloss: "eagle", kind: "Pull requests in the terminal",
    line: "Every open pull request you wrote or need to review, across all your repos, on one terminal screen.",
    chips: ["Rust", "terminal", "v0.2.1"],
    who: "You review pull requests across many repos, live in the terminal, and lose track of what's waiting on you in the GitHub web UI.",
    uses: [
      ["Start the day from one list", "Your PRs and your review requests from every repo, grouped by repo, with checks and comments. It refreshes itself every three minutes."],
      ["Review without spamming the author", "Leave comments on exact diff lines; they queue up and go out as one review, so the author gets one notification instead of ten."],
      ["A check failed for no reason", "Press t on the check to re-run the failed jobs of that workflow, then watch it refresh."],
      ["Get a second opinion", "R streams a Claude Code review of the PR, run inside your local checkout with read-only tools. Nothing is posted unless you press P and confirm."],
      ["Turn a rough note into a kind comment", "ctrl-r rewrites your draft with a model running on your own machine. ctrl-z brings your version back."],
    ],
    start: [
      { t: "You need the gh CLI, logged in. Then install:", code: "curl -fsSL https://raw.githubusercontent.com/enekos/arrano/master/install.sh | bash" },
      { t: "Open it:", code: "arrano                  # everything, all orgs\narrano --org my-org     # only one org\narrano --eink           # monochrome, for e-ink screens" },
      { t: "Optional: set LINEAR_API_KEY to see your assigned Linear issues in a fourth tab, and install the claude CLI for reviews." },
    ],
    cta: { href: "https://github.com/enekos/arrano", label: "arrano on GitHub", out: true },
    how: [
      ["Built on gh", "One GitHub search per lane through the gh CLI you already use, so there's no token to set up."],
      ["Fast to browse", "PR details are cached and the ones around your selection are fetched ahead, so moving with j and k doesn't wait on the network."],
      ["Readable diffs", "Syntax highlighting for about thirty languages, with added and removed lines as background tints."],
    ],
    links: [],
  },
  {
    slug: "marrow", name: "marrow", group: "oss", gloss: "", kind: "Search for Markdown",
    line: "Add search to a Markdown site or a docs folder with one binary and one SQLite file.",
    chips: ["Go", "SQLite", "self-hosted"],
    who: "You have a docs folder or a static site that's outgrown in-browser search, and you don't want a hosted search service.",
    uses: [
      ["Search for a big static site", "gizapedia and ikusmira both use it. Full-text and meaning-based search come back from the same query."],
      ["Search docs and GitHub together", "Connect a GitHub App and issues, pull requests and comments are searchable next to the docs."],
      ["Keep the index current", "A webhook re-syncs when the repo changes, and only the changed files are re-indexed."],
    ],
    start: [
      { t: "Install, index a folder, and serve it:", code: dossiers.marrow.usage.code },
    ],
    cta: { href: "https://github.com/enekos/marrow", label: "marrow on GitHub", out: true },
    how: dossiers.marrow.how.slice(0, 3),
    links: [{ label: "Site", href: "https://enekos.github.io/marrow/" }, { label: "More detail", href: "#p/marrow" }],
  },
  {
    slug: "aatxe", name: "aatxe", group: "oss", gloss: "the red bull of the caves", kind: "Performance checks in CI",
    line: "Benchmark every pull request against its base and fail CI only when something really got slower.",
    chips: ["MIT", "TypeScript · Go · Rust", "GitHub Actions"],
    who: "Your service has a hot path you care about, and you've been burned by a slowdown that nobody noticed in review.",
    uses: [
      ["Catch a slow parser before it merges", "Write a benchmark for it. aatxe runs it on the PR and on the base and posts one comment with the difference."],
      ["Stop arguing about noisy numbers", "A change only counts when the median moved enough, the difference is statistically significant and it clears a noise gate. All three, every time."],
      ["One setup for several languages", "TypeScript, Go and Rust benchmarks all produce the same report, so the comparison and the comment work the same everywhere."],
    ],
    start: [
      { t: "Install and write a benchmark:", code: dossiers.aatxe.usage.code },
      { t: "Or add the reusable workflow to your repo:", code: "jobs:\n  perf:\n    uses: enekos/aatxe/.github/workflows/aatxe.yml@main\n    with:\n      lang: ts\n      service: my-svc\n      affected: true" },
    ],
    cta: { href: "https://github.com/enekos/aatxe", label: "aatxe on GitHub", out: true },
    how: dossiers.aatxe.how.slice(0, 3),
    links: [{ label: "More detail", href: "#p/aatxe" }],
  },
];

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const md = (s) => esc(s).replace(/`([^`]+)`/g, "<code>$1</code>");
const copyIcon = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="5" y="5" width="8.5" height="8.5" rx="1.6"/><path d="M10.5 5V3.6A1.1 1.1 0 0 0 9.4 2.5H3.6a1.1 1.1 0 0 0-1.1 1.1v5.8a1.1 1.1 0 0 0 1.1 1.1H5"/></svg>`;

const ctaHTML = (c) => c.early !== undefined
  ? `<a class="btn btn-ink" href="/?early=${c.early}" data-early="${c.early}">${c.label}</a>`
  : `<a class="btn btn-ink" href="${c.href}"${c.out ? ' target="_blank" rel="noreferrer"' : ""}>${c.label}</a>`;

function page(d) {
  return `
  <article class="doc" id="doc-${d.slug}" data-doc="${d.slug}" hidden>
    <header class="doc-h">
      <p class="doc-k">${esc(d.kind)}</p>
      <h3>${esc(d.name)}${d.gloss ? `<span>${esc(d.gloss)}</span>` : ""}</h3>
      <p class="doc-line">${esc(d.line)}</p>
      <ul class="doc-chips">${d.chips.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
    </header>
    <div class="doc-tabs" role="tablist" aria-label="${esc(d.name)} docs">
      <button role="tab" aria-selected="true" data-tab="use">What it's for</button>
      <button role="tab" aria-selected="false" data-tab="start">Get started</button>
      <button role="tab" aria-selected="false" data-tab="how">How it works</button>
    </div>
    <section class="doc-pane" data-pane="use">
      <p class="doc-who"><b>Good fit if</b> ${md(d.who)}</p>
      <div class="doc-uses">
        ${d.uses.map(([h, t], i) => `
        <details class="doc-use"${i === 0 ? " open" : ""}>
          <summary><span>${String(i + 1).padStart(2, "0")}</span>${esc(h)}</summary>
          <p>${md(t)}</p>
        </details>`).join("")}
      </div>
      ${d.limits ? `<p class="doc-limit"><b>Worth knowing</b> ${esc(d.limits)}</p>` : ""}
    </section>
    <section class="doc-pane" data-pane="start" hidden>
      <ol class="doc-steps">
        ${d.start.map((s) => `
        <li><p>${md(s.t)}</p>${s.code ? `<div class="doc-code"><pre><code>${esc(s.code)}</code></pre><button type="button" class="doc-copy" aria-label="Copy">${copyIcon}<span>Copy</span></button></div>` : ""}</li>`).join("")}
      </ol>
    </section>
    <section class="doc-pane" data-pane="how" hidden>
      <dl class="doc-how">${d.how.map(([h, t]) => `<div><dt>${esc(h)}</dt><dd>${md(t)}</dd></div>`).join("")}</dl>
    </section>
    <footer class="doc-f">
      ${ctaHTML(d.cta)}
      ${d.links.map((l) => `<a class="btn btn-ghost" href="${l.href}"${l.href.startsWith("http") ? ' target="_blank" rel="noreferrer"' : ""}>${esc(l.label)}</a>`).join("")}
    </footer>
  </article>`;
}

export const docsHTML = () => `
<div class="docs-ui">
  <aside class="docs-nav">
    <label class="docs-find"><span class="sr">Filter projects</span>
      <input type="search" placeholder="Filter: CI, Rust, Postgres…" data-find autocomplete="off">
    </label>
    ${GROUPS.map(([g, label]) => `
    <div class="docs-group" data-group="${g}">
      <p>${label}</p>
      <ul>${docs.filter((d) => d.group === g).map((d) => `
        <li><a href="#docs/${d.slug}" data-pick-doc="${d.slug}" data-text="${esc([d.name, d.kind, d.line, d.who, d.chips.join(" "), d.uses.map((u) => u.join(" ")).join(" ")].join(" ").toLowerCase())}"><b>${esc(d.name)}</b><span>${esc(d.kind)}</span></a></li>`).join("")}
      </ul>
    </div>`).join("")}
    <p class="docs-none" hidden>Nothing matches that.</p>
  </aside>
  <div class="docs-main">${docs.map(page).join("")}</div>
</div>`;

export function initDocs(root) {
  const picks = [...root.querySelectorAll("[data-pick-doc]")];
  const pages = [...root.querySelectorAll("[data-doc]")];
  const none = root.querySelector(".docs-none");
  let current = null;

  const show = (slug, { focus = false } = {}) => {
    if (!docs.some((d) => d.slug === slug)) slug = docs[0].slug;
    current = slug;
    pages.forEach((p) => { p.hidden = p.dataset.doc !== slug; });
    picks.forEach((a) => a.classList.toggle("on", a.dataset.pickDoc === slug));
    if (focus) root.querySelector(`#doc-${slug} h3`)?.focus?.({ preventScroll: true });
  };

  root.addEventListener("click", (e) => {
    const pick = e.target.closest("[data-pick-doc]");
    if (pick) {
      e.preventDefault();
      show(pick.dataset.pickDoc);
      history.replaceState(null, "", `#docs/${pick.dataset.pickDoc}`);
      if (window.innerWidth < 900) root.querySelector(".docs-main").scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    const tab = e.target.closest("[data-tab]");
    if (tab) {
      const doc = tab.closest(".doc");
      doc.querySelectorAll("[data-tab]").forEach((b) => b.setAttribute("aria-selected", String(b === tab)));
      doc.querySelectorAll("[data-pane]").forEach((p) => { p.hidden = p.dataset.pane !== tab.dataset.tab; });
      return;
    }
    const copy = e.target.closest(".doc-copy");
    if (copy) {
      const text = copy.parentElement.querySelector("code").textContent;
      const label = copy.querySelector("span");
      navigator.clipboard?.writeText(text).then(() => {
        label.textContent = "Copied";
        setTimeout(() => { label.textContent = "Copy"; }, 1600);
      });
    }
  });

  root.addEventListener("keydown", (e) => {
    const tab = e.target.closest("[data-tab]");
    if (!tab || !["ArrowLeft", "ArrowRight"].includes(e.key)) return;
    const tabs = [...tab.parentElement.children];
    const next = tabs[(tabs.indexOf(tab) + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
    next.focus();
    next.click();
  });

  root.querySelector("[data-find]").addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase();
    let shown = 0;
    picks.forEach((a) => {
      const hit = !q || a.dataset.text.includes(q);
      a.parentElement.hidden = !hit;
      if (hit) shown++;
    });
    root.querySelectorAll(".docs-group").forEach((g) => { g.hidden = !g.querySelector("li:not([hidden])"); });
    none.hidden = shown > 0;
    const first = picks.find((a) => !a.parentElement.hidden);
    if (q && first && picks.find((a) => a.dataset.pickDoc === current)?.parentElement.hidden) show(first.dataset.pickDoc);
  });

  const fromHash = () => {
    const h = location.hash.slice(1);
    if (!h.startsWith("docs/")) return false;
    show(h.slice(5));
    root.scrollIntoView({ block: "start" });
    return true;
  };
  window.addEventListener("hashchange", fromHash);
  if (!fromHash()) show(docs[0].slug);
}
