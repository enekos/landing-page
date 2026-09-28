const GRAD = `<defs><linearGradient id="appg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#215CCC"/><stop offset="1" stop-color="#732EA8"/></linearGradient></defs>`;

const icon = (inner) =>
  `<svg class="app-icon" viewBox="0 0 64 64" aria-hidden="true">${GRAD}<rect width="64" height="64" rx="15" fill="url(#appg)"/>${inner}</svg>`;

export const apps = [
  {
    slug: "lemazain",
    name: "lemazain",
    kind: "Kubernetes IDE",
    etym: "Basque for helmsman — the Greek κυβερνήτης",
    headline: "Kubernetes at cluster scale, native on your Mac.",
    lede: "Live tables for every kind, one screen that shows what is broken, and production locked until you say otherwise.",
    points: [
      ["Every kind, CRDs included", "Rows from the API server's own Table projection, patched in place by a watch."],
      ["A Problems view", "Crash loops, OOM kills, stuck rollouts and unready nodes, across every namespace."],
      ["Production is read-only", "Contexts that look like prod open locked and tinted red until you unlock them."],
    ],
    price: "€39",
    requires: "macOS 14+",
    replaces: "Lens, k9s",
    href: "/lemazain/",
    icon: icon(`<g fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round"><circle cx="32" cy="32" r="11"/><path d="M32 10v11M32 43v11M10 32h11M43 32h11M16.4 16.4l7.8 7.8M39.8 39.8l7.8 7.8M16.4 47.6l7.8-7.8M39.8 24.2l7.8-7.8"/></g><circle cx="32" cy="32" r="3.6" fill="#fff"/>`),
  },
  {
    slug: "taula",
    name: "Taula",
    kind: "Database manager",
    etym: "Basque for table",
    headline: "Postgres and SQLite, at home on your Mac.",
    lede: "Browse tables, edit cells, and read the exact SQL before anything is written. Fast enough that you stop reaching for psql.",
    points: [
      ["Edits you can read first", "Every change is staged as SQL you see before it runs, with a journal to undo it."],
      ["Guardrails", "UPDATE or DELETE without WHERE, TRUNCATE and DROP ask first — harder on prod."],
      ["Postgres, SQLite, D1", "Query builder, ERD, foreign-key jumps and an optional local assistant."],
    ],
    price: "€25",
    requires: "macOS 15+",
    replaces: "TablePlus, psql",
    href: "/taula/",
    icon: icon(`<rect x="14" y="16" width="36" height="32" rx="3" fill="none" stroke="#fff" stroke-width="2.6"/><rect x="14" y="16" width="36" height="10" rx="3" fill="#fff" fill-opacity=".92"/><path d="M26 26v22M38 26v22M14 37h36" stroke="#fff" stroke-width="2.6"/>`),
  },
  {
    slug: "adar",
    name: "adar",
    kind: "Pull-request client",
    etym: "Basque for branch",
    headline: "Pull requests at the speed of your keyboard.",
    lede: "One inbox, the whole diff in one view, checks that tell the truth, and an agent terminal already sitting in the PR's checkout.",
    points: [
      ["One inbox", "Review requests, your PRs and threads you are in, with checks and review state on the row."],
      ["Green means green", "Checks graded by name, so a flaky failure re-run to green is a pass."],
      ["An agent in the checkout", "⇧⌘R opens Claude Code, Codex or your own command on a worktree at the PR head."],
    ],
    price: "€9",
    requires: "macOS 26+",
    replaces: "GitHub's web UI",
    href: "/adar/",
    icon: icon(`<g fill="none" stroke="#fff" stroke-width="3.8" stroke-linecap="round"><path d="M24 19v26"/><path d="M41 23c0 13-17 9-17 20"/></g><g fill="#fff"><circle cx="24" cy="15" r="4.8"/><circle cx="24" cy="49" r="4.8"/><circle cx="41" cy="18" r="4.8"/></g>`),
  },
];

export const windowFor = (slug) =>
  `<iframe src="/${slug}/embed/" title="${slug} window" loading="lazy" tabindex="-1" scrolling="no"></iframe>`;
