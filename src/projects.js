// ----------------------------------------------------------------------------
//  Long-form project pages. A node in the field carries one sentence; this is
//  the rest: what the thing is, why it exists, and how it works.
//
//  Each dossier is addressable at /#p/<slug>, so a repo README can link
//  straight at it. Keys match the labels used in data.js.
// ----------------------------------------------------------------------------

export const dossiers = {
  // --- archive --------------------------------------------------------------

  gizapedia: {
    tagline: "An open encyclopedia of the human and social sciences, in Basque.",
    etym: "giza eta gizarte zientzien entziklopedia",
    meta: [
      ["stack", "Hugo · Rust · marrow"],
      ["live", "gizapedia.org"],
      ["scale", "~21,000 pages"],
    ],
    what:
      "Philosophy, politics, economics, sociology and statistics: long-form " +
      "articles plus a dictionary of about eleven thousand entries, published as a " +
      "static site. Written and maintained by one person.",
    why:
      "Basque-language coverage of academic and social-science topics is thin, " +
      "uneven and mostly uncited. Gizapedia is an attempt to fill that in with " +
      "cited, edited articles.",
    how: [
      [
        "static, at scale",
        "Hugo builds around 21,000 pages. A Rust preprocessing step does the data " +
        "transforms and the linting before Hugo sees the content.",
      ],
      [
        "computed fields in sidecars",
        "Denormalized data sits in data/ JSON keyed by slug rather than in " +
        "per-entry frontmatter, so regenerating the 11,012-entry dictionary touches " +
        "two files instead of eleven thousand.",
      ],
      [
        "tag links resolve client-side",
        "Cross-reference tag pages would add about 17,000 stubs; they are resolved " +
        "from sharded JSON in the browser instead. A clean build is 12.5 seconds " +
        "and 631 MB of output, with no 404s behind those links.",
      ],
      [
        "structured references",
        "Articles carry references: and see_also: frontmatter (321 and 1,330 " +
        "entries), kept in sync by a Rust extractor that handles all five heading " +
        "conventions the corpus accumulated before the schema existed.",
      ],
      [
        "lint before commit",
        "markdownlint, ESLint, Stylelint and Prettier behind a Husky pre-commit " +
        "hook.",
      ],
    ],
    links: [{ label: "gizapedia.org", href: "https://gizapedia.org" }],
    related: ["ikusmira", "marrow"],
  },

  ikusmira: {
    tagline: "A Spanish-language educational archive, classified in the browser.",
    etym: "basque — a lookout, a vantage point",
    meta: [
      ["stack", "Hugo · marrow · iratxo (wasm)"],
      ["live", "ikusmira.org"],
      ["scale", "~4,000 articles"],
    ],
    what:
      "Around four thousand articles published with Hugo and searched by marrow. " +
      "iratxo, a wasm rule engine, classifies them in the reader's browser using " +
      "four Spanish rule packs covering intent, complexity, safety and study path. " +
      "The intent ribbon on search, the /consulta page and the reading-mode badge " +
      "are all produced client-side.",
    why:
      "A Spanish-language sibling to gizapedia on the same stack, and a test of " +
      "running the classification layer entirely in the browser: no inference " +
      "call, no backend, no per-reader cost, and nothing about what someone reads " +
      "leaves the page.",
    how: [
      [
        "search",
        "marrow indexes the corpus and serves hybrid full-text and vector search " +
        "from one SQLite file, the same engine that backs gizapedia.",
      ],
      [
        "classification in wasm",
        "iratxo compiles the rule packs to wasm and ships them as static assets, " +
        "so every classification runs on the reader's machine.",
      ],
      [
        "the same rules lint the corpus",
        "An author-side script runs the identical rule packs over all four thousand " +
        "articles in about two seconds, so reader and editor cannot see different " +
        "results.",
      ],
      [
        "classifier as an asset",
        "The rule packs are static wasm files served alongside the pages, so the " +
        "site builds in about two seconds either way.",
      ],
    ],
    links: [{ label: "ikusmira.org", href: "https://ikusmira.org" }],
    related: ["gizapedia", "marrow"],
  },

  // --- agents ---------------------------------------------------------------

  mairu: {
    tagline: "A coding agent with a local context server behind it.",
    etym: "basque — a mythological figure who builds by night",
    meta: [
      ["stack", "Go · Svelte · SQLite · Meilisearch"],
      ["surface", "CLI · TUI · REST · WebSocket · web · mobile"],
      ["license", "Blue Oak Model License"],
    ],
    what:
      "A monorepo with three parts: the Mairu coding agent, a context server, and " +
      "a dashboard for both. The agent gets its context by querying a memory store " +
      "that has already indexed your code, notes and history, ranked by vector " +
      "similarity, full-text match, recency and importance.",
    why:
      "Agents work better with project-specific context, and that context is " +
      "private. Mairu keeps ingestion and retrieval on your own machine or " +
      "network, reachable from the terminal, the browser or a phone.",
    how: [
      [
        "context server",
        "Ingestion, embedding and retrieval live in a standalone Go service. The " +
        "agent is one client of it, so the browser extension, the mobile app and " +
        "the ACP bridge read the same memory.",
      ],
      [
        "hybrid retrieval",
        "Vector cosine and full-text search run together over Meilisearch, then " +
        "results are re-ranked app-side by recency and importance.",
      ],
      [
        "config cascade",
        "Built-in defaults, then ~/.config/mairu/config.toml, then a project " +
        ".mairu.toml, then MAIRU_ environment variables, then CLI flags. " +
        "Per-repository behaviour without a per-repository install.",
      ],
      [
        "separate redaction binary",
        "pii-redact ships as its own CLI, so any log stream can be scrubbed " +
        "before it leaves the machine.",
      ],
      [
        "AST ingestion",
        "Code is parsed rather than split into fixed windows (TypeScript and " +
        "JavaScript so far), with an LLM pass that merges near-duplicate memories.",
      ],
    ],
    usage: {
      label: "quickstart",
      code: `./bootstrap.sh
make mairu-build

mairu setup
mairu init --defaults
mairu doctor            # check system health

make dashboard          # context server + web dashboard`,
    },
    links: [
      { label: "github", href: "https://github.com/enekos/mairu" },
      { label: "landing", href: "https://enekos.github.io/mairu-landing/" },
    ],
    related: ["odei", "iraun", "marrow", "aatxe"],
  },

  odei: {
    tagline: "A coding agent for the terminal, in one 2.5 MiB binary.",
    etym: "basque — cloud; the storm spirit, one of Mari's weather forms",
    meta: [
      ["stack", "Rust · Swift (SwiftUI) · Kimi"],
      ["version", "v0.1.0 · 2.5 MiB, no runtime deps"],
      ["license", "Apache-2.0"],
    ],
    what:
      "It reads and edits files, runs commands, and searches the web from your " +
      "shell — no editor integration, no daemon, no account beyond a Kimi " +
      "Coding-plan key. Seventeen tools, a permission gate, persistent sessions " +
      "and a journal of every call. `odei ask` is the same loop as a filter, and " +
      "`odei serve` speaks NDJSON to a SwiftUI app that reuses the whole engine.",
    why:
      "Most coding agents arrive as a Node install and an IDE panel. I wanted " +
      "one that behaves like a Unix program: a single file on PATH, output " +
      "closer to a shell than to a TUI, and a machine-readable surface so a " +
      "script can drive a turn instead of watching one.",
    how: [
      [
        "structure without reading",
        "A hand-written structural scanner — no tree-sitter, no grammars — " +
        "recovers the declaration skeleton of Rust, TypeScript, Python, Go and " +
        "C-family sources. A 600-line file costs about 35 lines of context, so " +
        "the model picks a start_line instead of reading top to bottom.",
      ],
      [
        "large results go off-transcript",
        "A tool result over 8 KB is written to disk and the conversation keeps " +
        "its head, its tail and a handle. A 170 KB build log costs ~8 KB until " +
        "something in the middle actually matters; read_tool_result fetches the " +
        "rest by byte range or by search.",
      ],
      [
        "one engine, three front ends",
        "The terminal shell, the NDJSON protocol and the macOS app share the " +
        "loop, the tools, the gate, the sessions and the journal. A tool event " +
        "already carries the label, the stat, the elapsed time and the diff as " +
        "typed hunks, so a front end renders a call without parsing tool output.",
      ],
      [
        "three prefixes before the model sees anything",
        "@path attaches a file whole or a directory as its outline, !command " +
        "runs it yourself and rides along with the next message, and #note " +
        "appends a bullet to AGENTS.md that is in force from the next turn on.",
      ],
      [
        "auto mode, with a static classifier",
        "Routine development runs directly; pushes, publishes, destructive " +
        "commands and writes outside the workspace stop for one prompt, and " +
        "`a` saves a rule. Non-interactive runs deny rather than hang, and name " +
        "what they denied in the payload.",
      ],
      [
        "behavioural evals",
        "`odei eval` runs the real agent loop against throwaway workspaces and " +
        "scores a turn from the call journal rather than from the prose, so the " +
        "assertions are about what ran, not what the model claimed.",
      ],
    ],
    usage: {
      label: "install and ask",
      code: `curl -fsSL https://raw.githubusercontent.com/enekos/odei/master/install.sh | sh

odei setup            # stores the Kimi key in ~/.odei/config.json
cd your_project && odei

# or as an ordinary filter
git diff | odei ask "review this"
cargo test 2>&1 | odei ask --output-format json "why did this fail?"`,
    },
    links: [{ label: "github", href: "https://github.com/enekos/odei" }],
    related: ["mairu", "iraun", "aatxe"],
  },

  iraun: {
    tagline: "A state-machine SDK for durable agents, in Rust.",
    etym: "basque — to last, to endure",
    meta: [
      ["stack", "Rust · SQLite · Postgres"],
      ["version", "v0.2.0"],
      ["license", "Apache-2.0"],
    ],
    what:
      "An agent is written as actions over an immutable state, wired into a graph " +
      "with conditional transitions. The engine runs that graph one step at a " +
      "time, to completion, or streaming, and writes the state down after every " +
      "transition, so a run can be resumed where it stopped or forked from any " +
      "earlier step.",
    why:
      "Agent runs die part-way through: crashes, rate limits, deploys, tool calls " +
      "that never return. Persisting each step means a run resumes instead of " +
      "starting over. Native Rust, with no Python runtime in the loop.",
    how: [
      [
        "immutable state, explicit deltas",
        "update, append, extend, increment, wipe, merge and subset, with a stable " +
        "serialized shape and a field-level serde registry for fields that need " +
        "to persist differently.",
      ],
      [
        "a row per step",
        "Each step is saved as (partition_key, app_id, sequence_id, position, " +
        "status). A failure stores the state as it was before the action ran, " +
        "marked failed, so a retry starts from a coherent point.",
      ],
      [
        "resume and fork",
        "initialize_from reloads state and position together. fork_from branches " +
        "off any historical step and records a parent pointer.",
      ],
      [
        "conditions",
        "when (with Django-style __gte suffixes), expr (a built-in expression " +
        "evaluator) and default, combined with &, | and !. Graph validation " +
        "rejects duplicate names, unknown targets and redundant defaults before a " +
        "run starts.",
      ],
      [
        "stable on-disk format",
        "The SQLite schema and tracking layout hold across releases, so old " +
        "checkpoints still load. Runs land in ~/.iraun/<project>/<app_id>/ as " +
        "graph.json, metadata.json and log.jsonl.",
      ],
    ],
    usage: {
      label: "a machine that counts to ten",
      code: `cargo add iraun

use iraun::prelude::*;

let counter = FunctionAction::new(["count"], ["count"], |_ctx, state| {
    let count: i64 = state.get_as("count")?;
    Ok((result! { "count" => count + 1 },
        state.update([("count", json!(count + 1))])))
});

let app = Application::builder()
    .with_action("counter", counter)
    .with_action("done", ResultAction::new(["count"]))
    .with_conditional_transition("counter", "counter", expr("count < 10")?)
    .with_transition("counter", "done")
    .with_state(state! { "count" => 0 })
    .with_entrypoint("counter")
    .build()?;`,
    },
    links: [
      { label: "github", href: "https://github.com/enekos/iraun" },
      { label: "docs.rs", href: "https://docs.rs/iraun" },
    ],
    related: ["mairu", "sutegi"],
  },

  // --- systems --------------------------------------------------------------

  sutegi: {
    tagline: "A Rust web framework with no third-party dependencies.",
    etym: "basque — the forge, the smithy",
    meta: [
      ["stack", "Rust · std only"],
      ["version", "v0.9.0 · 27 crates"],
      ["license", "MIT"],
    ],
    what:
      "The HTTP/1.1 server, JSON codec, router, ORM query builder, PostgreSQL " +
      "wire driver, template engine, crypto and LLM tool layer are all written on " +
      "the standard library. No tokio, hyper, serde or clap.",
    why:
      "Two things I wanted at once: small binaries, and an application an agent " +
      "can operate without an SDK. Dropping the async runtime covers the first; " +
      "exposing every route, model and tool as JSON covers the second.",
    how: [
      [
        "no dependencies",
        "Every component is std-only code. A core-only service is about 394 KB; " +
        "a full app with ORM, auth, queue and bundled SQLite is about 1.31 MB.",
      ],
      [
        "threads instead of a runtime",
        "An HTTP/1.1 thread-pool server on std::net with keep-alive and adaptive " +
        "accept backoff. WebSockets use a separate kqueue/epoll reactor, which " +
        "idles 80k sockets at 0.0% CPU.",
      ],
      [
        "opt-in crates",
        "27 crates behind facade features: orm, sqlite, postgres, queue, auth, " +
        "mail, template, storage, channels, presence, actors. Only JSON, HTTP and " +
        "the router are always compiled in.",
      ],
      [
        "introspection endpoints",
        "GET /__introspect returns the whole app surface as JSON. GET /__tools is " +
        "an LLM tool-calling manifest, and POST /__tools/:name invokes one with " +
        "arguments validated against the schema first.",
      ],
      [
        "one Backend seam",
        "The same SQL runs on SQLite for a single node or Postgres for many, " +
        "including the durable job queue, whose claim is a single " +
        "UPDATE … RETURNING and which reports which exclusivity guarantee you " +
        "actually get.",
      ],
    ],
    usage: {
      label: "an app, whole",
      code: `use sutegi::prelude::*;

fn main() -> std::io::Result<()> {
    App::new("hello")
        .get("/", "Health check", |_| "sutegi up")
        .get("/hello/:name", "Greet",
             |c| format!("hi, {}", c.param("name").unwrap_or("world")))
        .serve()
}

// curl localhost:8080/__introspect   full app surface, as JSON
// curl localhost:8080/__tools        LLM tool-calling manifest`,
    },
    links: [
      { label: "docs", href: "https://enekos.github.io/sutegi/" },
      { label: "github", href: "https://github.com/enekos/sutegi" },
      { label: "crates.io", href: "https://crates.io/crates/sutegi" },
    ],
    related: ["artzain", "aatxe", "iraun"],
  },

  artzain: {
    tagline: "A small orchestrator for prebuilt binaries, with Kubernetes-style config.",
    etym: "basque — shepherd",
    meta: [
      ["stack", "Rust · tokio · a five-dependency budget"],
      ["version", "v0.3.0"],
    ],
    what:
      "One artzain.toml declares which apps should run and how many replicas of " +
      "each. `artzain up` runs a reconcile loop that keeps reality matching that " +
      "file: starting processes, restarting crashed ones with exponential backoff, " +
      "running HTTP readiness and liveness probes, rolling apps when the manifest " +
      "changes, and shutting the fleet down on Ctrl-C.",
    why:
      "Sutegi apps ship as single binaries that already expose /__ready, " +
      "/__health and /__metrics and drain on SIGTERM. Running a fleet of them on " +
      "one box needs replicas, crash recovery and rolling updates, which is more " +
      "than a process manager does and far less than Kubernetes.",
    how: [
      [
        "no git, no Docker, no daemon",
        "It runs a binary that already exists; it never clones, pulls or builds. " +
        "Children are OS processes in their own process groups. `up` runs in the " +
        "foreground and a JSON state file is the control plane: `status` reads it, " +
        "`down` signals it.",
      ],
      [
        "one loop, 500 ms a tick",
        "Reload, re-verify checks, reap, terminate undesired, roll stale, spawn " +
        "missing, probe, snapshot. No shared state and no locks.",
      ],
      [
        "rolling on manifest change",
        "Edit the manifest and stale instances are replaced one at a time, " +
        "honouring maxUnavailable. With max_surge = 1 the replacement comes up on " +
        "a temporary port before the old one stops, so there is no downtime and no " +
        "proxy.",
      ],
      [
        "hardening",
        "env_clear plus an explicit inherit_env allowlist, per-app user/group " +
        "privilege drop that fails closed, 0700/0600 permissions, bounded log " +
        "rotation, orphan reclamation from a stale state file, and a generated " +
        "hardened systemd unit.",
      ],
      [
        "debounced reloads",
        "Manifest reloads wait a tick and a zero-app parse is rejected, so the " +
        "empty window left by a truncate-then-write editor cannot tear the fleet " +
        "down. Availability during a roll is measured against desired replicas, " +
        "not present ones, so a retiring instance's exit does not read as spare " +
        "capacity.",
      ],
      [
        "hand-written probes",
        "TCP and HTTP/1.1 readiness and liveness written directly instead of " +
        "pulling in an HTTP client, which keeps the dependency count at five.",
      ],
    ],
    usage: {
      label: "a three-replica fleet",
      code: `# artzain.toml
project = "demo"

[[app]]
name = "web"
bin = "./target/release/web"   # a prebuilt binary
port = 8080
replicas = 3                   # runs on 8080, 8081, 8082

$ artzain plan     # validate + show the startup plan
$ artzain up       # reconcile and supervise (Ctrl-C to stop)
$ artzain status   # in another shell
$ artzain down`,
    },
    links: [{ label: "github", href: "https://github.com/enekos/artzain" }],
    related: ["sutegi", "marrow"],
  },

  marrow: {
    tagline: "Local-first hybrid search for Markdown repositories.",
    meta: [
      ["stack", "Go · SQLite (FTS5 + sqlite-vec)"],
      ["version", "v0.3.0"],
    ],
    what:
      "Full-text search and vector similarity in one SQLite database. Point it at " +
      "a directory of Markdown and it indexes it; give it a GitHub App and it also " +
      "indexes issues, pull requests and comments, so both answer the same query. " +
      "One static binary, one file, a small HTTP API.",
    why:
      "A client-side index gets unwieldy past a few thousand pages, and hosted " +
      "search adds a service dependency to a static site. Marrow is a binary and " +
      "a database file you can copy.",
    how: [
      [
        "both modes, one database",
        "FTS5 and sqlite-vec live in the same SQLite file, so there is no second " +
        "service to run and the two indexes cannot drift apart.",
      ],
      [
        "language detection",
        "Query language is detected across English, Spanish and Basque, with a " +
        "per-document lang frontmatter fallback and a flag to pin one language.",
      ],
      [
        "issues as documents",
        "A GitHub App webhook keeps issues, pull requests and comments in the same " +
        "index as the prose, handling opened, edited, reopened, closed and " +
        "synchronize events.",
      ],
      [
        "one process, many sites",
        "A `vps` build tag adds per-site CORS, API keys, rate limiting and " +
        "scheduled background sync, so one binary can back several static sites. " +
        "Without the tag none of that is compiled in.",
      ],
    ],
    usage: {
      label: "index and serve",
      code: `curl -sSL https://raw.githubusercontent.com/enekos/marrow/master/install.sh | sh

marrow sync  -dir ./docs -db marrow.db -source local -default-lang en
marrow serve -db marrow.db -addr :8080 -detect-lang=true

curl -X POST localhost:8080/search \\
  -d '{"q": "go best practices", "limit": 10}'`,
    },
    links: [
      { label: "github", href: "https://github.com/enekos/marrow" },
      { label: "site", href: "https://enekos.github.io/marrow/" },
    ],
    related: ["gizapedia", "ikusmira", "mairu"],
  },

  // --- tooling --------------------------------------------------------------

  aatxe: {
    tagline: "Benchmarks every pull request against its base and gates CI on regressions.",
    etym: "basque — the red bull spirit that leaves its cave at night to punish wrongdoers",
    meta: [
      ["stack", "Rust · TypeScript / Go / Rust SDKs · GitHub Actions"],
      ["version", "v0.1.1"],
      ["license", "MIT"],
    ],
    what:
      "Aatxe benches the code on a pull request, compares it statistically against " +
      "the base, and posts one sticky comment that fails CI when something " +
      "regressed. TypeScript, Go and Rust SDKs emit a shared JSON report format. " +
      "It ships as a static binary and as a reusable GitHub Actions workflow.",
    why:
      "Benchmark numbers in CI need a rule for what counts as a regression, and " +
      "every language tends to reimplement the comparison, the report and the " +
      "gate. Aatxe keeps the per-language part to a small SDK and does the rest " +
      "once.",
    how: [
      [
        "three conditions, all required",
        "A change is flagged only when the median shift is large enough, it is " +
        "significant under Mann–Whitney U (non-parametric, with continuity and tie " +
        "correction), and it clears a noise gate.",
      ],
      [
        "polyglot at the boundary",
        "Per-language SDKs emit one JSON RunReport. The Rust CLI does the " +
        "comparison, the markdown, the sticky comment and the affected-set " +
        "resolution, so a fourth language means an SDK, not a CLI change.",
      ],
      [
        "a pure core",
        "aatxe-core has no IO and no globals; side effects sit behind traits. " +
        "Tests inject an in-memory filesystem and git, so the stats, the verdict, " +
        "the rendering and the import graph are covered without a fixture repo.",
      ],
      [
        "local comparison",
        "`aatxe perf-vs --against <ref>` materializes a sibling worktree, benches " +
        "both sides and runs them through the same comparator CI uses. About 15 " +
        "seconds, instead of a round trip through GitHub Actions.",
      ],
      [
        "optional agent review",
        "A mixture-of-agents reviewer on top: four persona proposers run in " +
        "parallel, a deterministic pass dedups them, and a separate judge decides " +
        "what survives. Its own sticky comment and gate; the perf verdict is " +
        "unaffected.",
      ],
    ],
    usage: {
      label: "install and bench",
      code: `curl -fsSL https://raw.githubusercontent.com/enekos/aatxe/master/scripts/install.sh | sh

// TypeScript
import { bench } from '@aatxe/bench'
bench('parse: phone', () => parsePhone('+34 612 345 678'))

$ aatxe run
$ aatxe compare --fail-on-regression   # exit 2 when a regression is real`,
    },
    links: [{ label: "github", href: "https://github.com/enekos/aatxe" }],
    related: ["sutegi", "mairu"],
  },

  tartalo: {
    tagline: "A statically-typed scripting language that compiles to POSIX sh or a native binary.",
    etym: "basque — the one-eyed giant of the mountains",
    meta: [
      ["stack", "Go · POSIX sh · shellcheck"],
      ["status", "pre-alpha"],
    ],
    what:
      "A small scripting language with TypeScript-like syntax and two backends: " +
      "POSIX sh when you want a portable script, or a self-contained native binary " +
      "when you want to ship a tool. Types are checked at compile time.",
    why:
      "Shell scripts fail at runtime. Rewriting them in another language usually " +
      "costs you the single file you can copy and run anywhere. Emitting sh keeps " +
      "that and moves type errors to compile time.",
    how: [
      [
        "two backends, one source",
        "`--target=sh` emits a POSIX script and verifies it with shellcheck. " +
        "`--target=native` emits Go and compiles a static binary, with --goos and " +
        "--goarch for cross-compilation.",
      ],
      [
        "type checker",
        "Lexer, parser, type checker, emitter. Generic functions use inference-only " +
        "call sites and monomorphisation in both backends. Maps and arrays come " +
        "with a small builtin set plus map/filter/reduce/zip and a |> pipeline " +
        "operator.",
      ],
      [
        "concurrency in both backends",
        "`parallel { task { … } }` for structured fork-join, and `spawn` with typed " +
        "chan[T] mailboxes for long-lived workers. On sh these become backgrounded " +
        "subshells and wait; on native, goroutines and a WaitGroup.",
      ],
      [
        "awk escape hatch",
        "awk(xs, \"<expr>\") runs one awk process over a numeric array instead of " +
        "a shell loop, for numeric work where process count dominates.",
      ],
      [
        "toolchain",
        "build, run, test, check, fmt and bench, plus an LSP with diagnostics, " +
        "hover, goto-definition, symbols, references, rename and completion. " +
        "Imports resolve transitively, so the entry file is the whole build " +
        "command.",
      ],
    ],
    usage: {
      label: "hello, twice",
      code: `// hello.tt
func main(): void {
  let who: string = "world"
  echo("Hello, \${who}!")
}

$ tartalo build hello.tt -o hello.sh                # POSIX sh
$ tartalo build hello.tt --target=native -o hello   # native binary
$ tartalo check hello.tt                            # type-check only`,
    },
    links: [
      { label: "github", href: "https://github.com/enekos/tartalo" },
      { label: "site", href: "https://enekos.github.io/tartalo/" },
    ],
    related: ["aatxe", "artzain"],
  },
};

// Field order, so prev/next through the dossiers follows the shape of the work
// rather than the alphabet.
export const dossierOrder = Object.keys(dossiers);

export const hasDossier = (slug) => Object.hasOwn(dossiers, slug);
