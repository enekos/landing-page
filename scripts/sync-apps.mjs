#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync, copyFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://hirusta.io";
const PROJECTS = join(process.env.HOME, "eneko_projects");

const APPS = ["lemazain", "taula", "adar"];

const DROP = new Set(["_headers", "_redirects", "robots.txt", "404.html"]);
const BACKEND = ["api", "dl", "appcast.xml"];

const git = (repo, ...args) => execFileSync("git", ["-C", repo, ...args], { encoding: "utf8" }).trim();

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

function extract(slug) {
  const repo = join(PROJECTS, slug);
  git(repo, "fetch", "-q", "origin");
  const ref = git(repo, "symbolic-ref", "--short", "refs/remotes/origin/HEAD");
  const sha = git(repo, "rev-parse", "--short", ref);
  const tmp = mkdtempSync(join(tmpdir(), `sync-${slug}-`));
  const tar = execFileSync("git", ["-C", repo, "archive", ref, "site/public"]);
  execFileSync("tar", ["-x", "-C", tmp], { input: tar });
  return { dir: join(tmp, "site/public"), tmp, ref, sha };
}

const outPath = (rel) => {
  if (!rel.endsWith(".html") || rel.endsWith("index.html")) return rel;
  return rel.replace(/\.html$/, "/index.html");
};

function rewriter(slug, files) {
  const base = `/${slug}`;
  const pages = new Set();
  const top = new Set(BACKEND);
  for (const rel of files) {
    top.add(rel.split("/")[0].replace(/\.html$/, ""));
    if (rel.endsWith(".html")) pages.add(rel.replace(/(\/)?index\.html$/, "").replace(/\.html$/, ""));
  }

  const firsts = [...top].map((s) => s.replace(/[.]/g, "\\.")).join("|");
  const path = new RegExp(`(["'(\`=]\\s*)/(${firsts})(?=[/"'?#)\`\\s]|$)([^"'?#)\`\\s]*)`, "g");

  const page = (p) => {
    const clean = p.replace(/\/$/, "");
    return pages.has(clean) ? `${clean}/` : p;
  };

  return (text) => text
    .replace(/https:\/\/(lemazain|taula|adar)\.pages\.dev(\/[^"'<>\s)]*)?/g, (_, app, rest = "/") => {
      const [, p, tail] = rest.match(/^\/?([^?#]*)(.*)$/);
      const dir = !p || p.endsWith("/") || p.includes(".") ? p : `${p}/`;
      return `${SITE}/${app}/${dir}${tail}`;
    })
    .replace(path, (_, lead, first, rest) => `${lead}${base}/${page(first + rest)}`)
    .replace(/((?:href|action)=["'])\/(["'#?])/g, `$1${base}/$2`);
}

function earlyAccess(slug, html) {
  const buy = new RegExp(`<a ([^>]*)href="/${slug}/(?:api/checkout|pricing/)"([^>]*)>\\s*(Buy[^<]*)(?:<span[^>]*>[^<]*</span>)?\\s*</a>`, "g");
  return html
    .replace(buy, (_, pre, post, label) => {
      const text = label.trim() === "Buy" ? "Early access" : "Request early access";
      return `<a ${pre}href="/${slug}/?early=${slug}" data-early="${slug}"${post}>${text}</a>`;
    })
    .replace("</body>", `<script src="/early-access.js" defer></script>\n</body>`);
}

function sync(slug) {
  const { dir, tmp, ref, sha } = extract(slug);
  const dest = join(ROOT, "public", slug);
  rmSync(dest, { recursive: true, force: true });

  const files = walk(dir).map((p) => relative(dir, p)).filter((rel) => !DROP.has(rel));
  const rewrite = rewriter(slug, files);

  for (const rel of files) {
    const out = join(dest, outPath(rel));
    mkdirSync(dirname(out), { recursive: true });
    if (rel.endsWith(".html")) writeFileSync(out, earlyAccess(slug, rewrite(readFileSync(join(dir, rel), "utf8"))));
    else if (/\.(css|js|xml|txt|json)$/.test(rel)) writeFileSync(out, rewrite(readFileSync(join(dir, rel), "utf8")));
    else copyFileSync(join(dir, rel), out);
  }

  writeEmbed(slug, dest);
  rmSync(tmp, { recursive: true, force: true });
  console.log(`${slug}: ${files.length} files from ${ref} @ ${sha} → public/${slug}/`);
}

const FIT_WIDTH = 1080;
const FIT_MIN = 600;

function writeEmbed(slug, dest) {
  const index = readFileSync(join(dest, "index.html"), "utf8");
  const styles = [...index.matchAll(/<link rel="stylesheet" href="([^"]+)">/g)].map((m) => m[1]);
  const scripts = [...index.matchAll(/<script src="([^"]+)" defer><\/script>/g)].map((m) => m[1])
    .filter((s) => !s.endsWith("/site.js") && s !== "/early-access.js");
  const win = index.match(/<div [^>]*id="stage-win"[^>]*>/);
  if (!win) throw new Error(`${slug}: no tour window (#stage-win) found in index.html`);

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${slug} window</title>
${styles.map((s) => `<link rel="stylesheet" href="${s}">`).join("\n")}
<style>
  html,body{margin:0;background:transparent;overflow:hidden}
  body{padding:0}
  .embed{width:100vw;height:100vh;display:flex;align-items:stretch}
  .embed > div{flex:1;margin:0!important;max-width:none!important;height:100%}
</style>
</head>
<body>
<div class="embed">${win[0].replace(/ data-narrow/, "")}</div></div>
<script>
  const embed = document.querySelector(".embed");
  const fit = () => {
    const s = innerWidth < ${FIT_MIN} ? 1 : Math.min(1, innerWidth / ${FIT_WIDTH});
    embed.style.zoom = s;
    embed.style.width = \`\${innerWidth / s}px\`;
    embed.style.height = \`\${innerHeight / s}px\`;
  };
  fit();
  addEventListener("resize", fit);
</script>
${scripts.map((s) => `<script src="${s}" defer></script>`).join("\n")}
</body>
</html>
`;
  mkdirSync(join(dest, "embed"), { recursive: true });
  writeFileSync(join(dest, "embed", "index.html"), html);
  writeTour(slug, index);
}

const text = (html) => html.replace(/<[^>]+>/g, "").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();

function writeTour(slug, index) {
  const tour = [...index.matchAll(/<article class="step[^"]*" data-state="([a-z]+)">([\s\S]*?)<\/article>/g)].map(([, state, body]) => ({
    state,
    tag: text(body.match(/<span class="tag">([\s\S]*?)<\/span>/)?.[1] ?? state),
    head: text(body.match(/<h3>([\s\S]*?)<\/h3>/)?.[1] ?? ""),
    body: text(body.match(/<p>([\s\S]*?)<\/p>/)?.[1] ?? ""),
  }));
  if (!tour.length) throw new Error(`${slug}: no tour steps found in index.html`);
  mkdirSync(join(ROOT, "src", "tours"), { recursive: true });
  writeFileSync(join(ROOT, "src", "tours", `${slug}.json`), `${JSON.stringify(tour, null, 2)}\n`);
}

const args = process.argv.slice(2);
const embedsOnly = args.includes("--embeds");
const only = args.filter((a) => !a.startsWith("--"));
for (const slug of only.length ? only : APPS) {
  if (embedsOnly) writeEmbed(slug, join(ROOT, "public", slug));
  else sync(slug);
}
