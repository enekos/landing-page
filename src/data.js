// ----------------------------------------------------------------------------
//  The whole site is one embedding.
//
//  Every piece of content — a project, a social handle, a line about why — is
//  a point scattered around its cluster centroid in a 2-D projection. The page
//  scrolls now, but the projection is still where every position, hue and
//  neighbour on it comes from.
// ----------------------------------------------------------------------------

// Deterministic pseudo-random, so the projection is stable across reloads.
export const frand = (n) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const TAU = Math.PI * 2;

// Scatter every item around its cluster centroid. Salt shifts the whole
// projection so two clouds built from the same indices don't rhyme.
export function project(nodes, salt = 0) {
  nodes.forEach((n, i) => {
    const angle = frand((i + salt) * 1.7 + 3.1) * TAU;
    const radius = 60 + frand((i + salt) * 2.3 + 9.4) * 150;
    n.x = n.c[0] + Math.cos(angle) * radius;
    n.y = n.c[1] + Math.sin(angle) * radius;
  });
  return nodes;
}

// Nearest neighbours, with a similarity score derived from distance. Drives
// both the mesh drawn between points and the ≈ readout under each card.
const SIM_REF = 1100;
export function link(nodes) {
  for (const n of nodes) {
    n.neighbors = nodes
      .filter((m) => m !== n)
      .map((m) => ({ node: m, d: Math.hypot(m.x - n.x, m.y - n.y) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 3)
      .map((e) => ({ node: e.node, sim: Math.max(0, 1 - e.d / SIM_REF) }));
  }
  return nodes;
}

function build(clusters, items, salt = 0) {
  const nodes = items.map((item, i) => {
    const cl = clusters[item.cluster];
    return { ...item, i, hue: cl.hue, clusterName: cl.name, c: cl.c, x: 0, y: 0 };
  });
  return link(project(nodes, salt));
}

// ----------------------------------------------------------------------------
//  Index region — the clusters are the shape of the work, not a nav bar.
// ----------------------------------------------------------------------------

// Cluster order is the reading order: it drives the flattened index, and the
// archive sits next to `self` because the two encyclopedias are the work with
// readers, not just repositories.
export const homeClusters = {
  self: { name: "self", hue: 205, c: [0, -520] },
  archive: { name: "archive", hue: 28, c: [430, -230] },
  agents: { name: "agents", hue: 168, c: [-540, -350] },
  systems: { name: "systems", hue: 284, c: [-560, 240] },
  tooling: { name: "tooling", hue: 138, c: [300, 480] },
  signal: { name: "signal", hue: 342, c: [-200, 620] },
};

// Item order is traversal order: arrive on the intro, step straight into the
// two archives, and only then into the code that serves them.
const homeItems = [
  {
    cluster: "self", label: "eneko", kind: "lead",
    lines: [
      "Hi, I'm Eneko. I write software for a living, and in my spare time I look after two online encyclopedias and build the small Mac apps I wanted for my own work.",
    ],
  },
  {
    cluster: "self", label: "why", kind: "stack",
    lines: [
      "Encyclopedias, because a language needs good reference works, and I can write some of them.",
      "No dependencies, because I like understanding every line I ship.",
      "Single binaries, because I'd like these to still run in ten years, on someone else's machine.",
      "Everything on your own device, because what you read is nobody's business but yours.",
      "And easy for AI agents to read, because more and more of the readers are programs.",
    ],
  },

  {
    cluster: "archive", label: "gizapedia", kind: "entry", flagship: true,
    href: "https://gizapedia.org",
    eyebrow: "live · ~21,000 pages",
    lines: ["Open encyclopedia of the human and social sciences, in Basque. Long-form articles and an 11,000-entry dictionary, written and maintained by me."],
  },
  {
    cluster: "archive", label: "ikusmira", kind: "entry", flagship: true,
    href: "https://ikusmira.org",
    eyebrow: "live · ~4,000 articles",
    lines: ["Spanish-language educational archive, classified in the reader's own browser by a wasm rule engine — no inference call, no backend, nothing about what you read leaving the page."],
  },

  {
    cluster: "self", label: "barcelona", kind: "p",
    lines: [
      "I've been building web apps and backends in Barcelona for over ten years, in education, finance and HR software.",
    ],
  },
  {
    cluster: "self", label: "analog", kind: "p",
    lines: ["Away from the keyboard, I shoot analog film and develop it myself."],
  },
  {
    cluster: "self", label: "contact", kind: "contact",
    lines: ["enekos [at] duck.com"],
    note: "Say hi. I reply.",
  },

  {
    cluster: "agents", label: "mairu", kind: "entry",
    href: "https://github.com/enekos/mairu",
    lines: ["Coding agent with a local context server, in Go."],
  },
  {
    cluster: "agents", label: "odei", kind: "entry",
    href: "https://github.com/enekos/odei",
    lines: ["Coding agent for the terminal in a 2.5 MiB Rust binary — Kimi-powered, no daemon, no editor integration."],
  },
  {
    cluster: "agents", label: "iraun", kind: "entry",
    href: "https://github.com/enekos/iraun",
    lines: ["State-machine SDK for durable agents, in Rust."],
  },

  {
    cluster: "systems", label: "sutegi", kind: "entry",
    href: "https://github.com/enekos/sutegi",
    lines: ["Web framework for Rust with no third-party dependencies."],
  },
  {
    cluster: "systems", label: "artzain", kind: "entry",
    href: "https://github.com/enekos/artzain",
    lines: ["Small orchestrator in Rust for prebuilt binaries — declarative manifest, reconcile loop, rolling updates."],
  },
  {
    cluster: "systems", label: "marrow", kind: "entry",
    href: "https://github.com/enekos/marrow",
    lines: ["Local-first hybrid search for Markdown repos — FTS5 and vector similarity in SQLite."],
  },

  {
    cluster: "tooling", label: "aatxe", kind: "entry",
    href: "https://github.com/enekos/aatxe",
    lines: ["Microbenchmark harness — benches every PR against base and gates CI on regressions."],
  },
  {
    cluster: "tooling", label: "tartalo", kind: "entry",
    href: "https://github.com/enekos/tartalo",
    lines: ["Statically-typed scripting language — compiles to POSIX sh or to native binaries."],
  },

  {
    cluster: "signal", label: "github", kind: "entry",
    href: "https://github.com/enekos", lines: ["@enekos"],
  },
  {
    cluster: "signal", label: "linkedin", kind: "entry",
    href: "https://linkedin.com/in/enekosarasola", lines: ["in/enekosarasola"],
  },
  {
    cluster: "signal", label: "instagram", kind: "entry",
    href: "https://instagram.com/arcaizante", lines: ["@arcaizante — the analog half"],
  },
  {
    cluster: "signal", label: "x", kind: "entry",
    href: "https://x.com/exocuted", lines: ["@exocuted"],
  },

];

export const homeNodes = build(homeClusters, homeItems, 0);

const hue = (cluster) => homeClusters[cluster].hue;
export const basqueNames = [
  { word: "lemazain", gloss: "helmsman", what: "a Kubernetes app", href: "#app-lemazain", x: -300, y: -540, big: true, hue: hue("self") },
  { word: "taula", gloss: "table", what: "a Postgres & SQLite app", href: "#app-taula", x: 330, y: -500, big: true, hue: hue("self") },
  { word: "adar", gloss: "branch", what: "a pull-request app", href: "#app-adar", x: -80, y: -330, big: true, hue: hue("self") },
  { word: "arrano", gloss: "eagle", what: "pull requests in the terminal", href: "#docs/arrano", x: 440, y: -290, hue: hue("tooling") },
  { word: "gizapedia", gloss: "giza: human, of people", what: "an encyclopedia in Basque", href: "#p/gizapedia", x: -150, y: -100, big: true, hue: hue("archive") },
  { word: "bidali", gloss: "to send", what: "an HTTP client", href: "#app-bidali", x: 320, y: -120, big: true, hue: hue("self") },
  { word: "bikote", gloss: "pair, couple", what: "a data workspace, in beta", href: "#bikote", x: -230, y: 150, big: true, hue: hue("systems") },
  { word: "aatxe", gloss: "the red bull of the caves", what: "a benchmark harness", href: "#p/aatxe", x: 60, y: 100, hue: hue("tooling") },
  { word: "artzain", gloss: "shepherd", what: "a small orchestrator", href: "#p/artzain", x: 450, y: 130, hue: hue("systems") },
  { word: "ikusmira", gloss: "outlook, perspective", what: "an archive in Spanish", href: "#p/ikusmira", x: -60, y: 430, big: true, hue: hue("archive") },
  { word: "sutegi", gloss: "forge", what: "a Rust web framework", href: "#p/sutegi", x: 360, y: 400, hue: hue("systems") },
];


// The self cluster is the origin the name is measured against — drift away from
// it and the identity in the corner starts to come apart.
export const origin = homeClusters.self.c;

export const flatText = (lines) =>
  lines.map((l) => (Array.isArray(l) ? l.join(" ") : l)).join(" ");
