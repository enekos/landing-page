const APPS = new Set(["lemazain", "taula", "adar", "bidali", "bikote"]);
const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;
const PER_IP_PER_HOUR = 8;

const json = (body, status, headers) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", ...headers } });

function cors(request, env) {
  const origin = request.headers.get("origin");
  const allowed = (env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim());
  if (!origin || !allowed.includes(origin)) return {};
  return {
    "access-control-allow-origin": origin,
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type",
    vary: "origin",
  };
}

function clientIp(request, env) {
  const proxied = env.PROXY_TOKEN && request.headers.get("x-proxy-token") === env.PROXY_TOKEN;
  const forwarded = proxied && request.headers.get("x-real-ip");
  return forwarded || request.headers.get("cf-connecting-ip") || "";
}

async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function signup(request, env, headers) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "bad_json" }, 400, headers);
  }

  if (body.company) return json({ ok: true }, 200, headers);

  const email = String(body.email || "").trim().toLowerCase();
  if (!EMAIL.test(email)) return json({ ok: false, error: "bad_email" }, 400, headers);

  const apps = [...new Set((Array.isArray(body.apps) ? body.apps : [body.app]).filter((a) => APPS.has(a)))];
  if (!apps.length) return json({ ok: false, error: "no_app" }, 400, headers);

  const ip = clientIp(request, env);
  const ipHash = ip ? (await sha256(`${env.IP_SALT || ""}:${ip}`)).slice(0, 32) : null;
  if (ipHash) {
    const { n } = await env.DB.prepare(
      "SELECT count(*) AS n FROM signups WHERE ip_hash = ? AND created_at > strftime('%Y-%m-%dT%H:%M:%SZ', 'now', '-1 hour')",
    ).bind(ipHash).first();
    if (n >= PER_IP_PER_HOUR) return json({ ok: false, error: "slow_down" }, 429, headers);
  }

  const source = String(body.source || "").slice(0, 200) || null;
  const country = request.cf?.country || null;
  const insert = env.DB.prepare(
    "INSERT INTO signups (email, app, source, country, ip_hash) VALUES (?, ?, ?, ?, ?) ON CONFLICT (email, app) DO NOTHING",
  );
  await env.DB.batch(apps.map((app) => insert.bind(email, app, source, country, ipHash)));
  return json({ ok: true, apps }, 200, headers);
}

async function exportCsv(request, env) {
  const auth = request.headers.get("authorization") || "";
  if (!env.ADMIN_TOKEN || auth !== `Bearer ${env.ADMIN_TOKEN}`) return new Response("unauthorized", { status: 401 });
  const { results } = await env.DB.prepare(
    "SELECT email, app, source, country, created_at FROM signups ORDER BY created_at",
  ).all();
  const cell = (v) => (v == null ? "" : /[",\n]/.test(v) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
  const rows = [["email", "app", "source", "country", "created_at"], ...results.map((r) => [r.email, r.app, r.source, r.country, r.created_at])];
  return new Response(rows.map((r) => r.map(cell).join(",")).join("\n") + "\n", {
    headers: { "content-type": "text/csv; charset=utf-8" },
  });
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    const headers = cors(request, env);

    if (pathname === "/api/early-access") {
      if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
      if (request.method === "POST") return signup(request, env, headers);
      return json({ ok: false, error: "method" }, 405, headers);
    }
    if (pathname === "/api/early-access/export" && request.method === "GET") return exportCsv(request, env);
    return new Response("not found", { status: 404 });
  },
};
