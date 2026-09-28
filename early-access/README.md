# hirusta-early-access

Early-access sign-ups for lemazain, Taula and adar. One Worker, one D1 table.

- `POST /api/early-access` `{email, apps: ["taula", …], source, company}`. `company` is a honeypot: when it's filled in, the Worker answers 200 and stores nothing.
- `GET /api/early-access/export` with `Authorization: Bearer $ADMIN_TOKEN` returns every sign-up as a CSV.

Each email is stored once per app, and each IP (salted and hashed) can send 8 sign-ups an hour. The dialog lives in `public/early-access.js`, and every page on hirusta.io loads it, including the synced app sites.

## Local

```sh
npx wrangler d1 execute hirusta-early-access --local --file schema.sql
npx wrangler dev --port 8787       # vite proxies /api/early-access here
```

`.dev.vars` holds `ADMIN_TOKEN` and `IP_SALT` for local runs.

## First deploy (not done yet)

hirusta.io is served by Apache and its DNS isn't on Cloudflare, so the Worker runs on workers.dev and Apache forwards the path to it:

```sh
npx wrangler d1 create hirusta-early-access      # paste the id into wrangler.jsonc
npx wrangler d1 execute hirusta-early-access --remote --file schema.sql
npx wrangler secret put ADMIN_TOKEN
npx wrangler secret put IP_SALT
npx wrangler secret put PROXY_TOKEN
npx wrangler deploy
```

```apache
SSLProxyEngine on
RequestHeader set X-Real-IP "%{REMOTE_ADDR}s"
RequestHeader set X-Proxy-Token "<PROXY_TOKEN>"
ProxyPass        /api/early-access https://hirusta-early-access.<account>.workers.dev/api/early-access
ProxyPassReverse /api/early-access https://hirusta-early-access.<account>.workers.dev/api/early-access
```

Behind the proxy, `cf-connecting-ip` is the droplet's own address. The Worker reads `X-Real-IP` instead, but only when `X-Proxy-Token` matches, so a request sent straight to workers.dev can't pick its own IP. Without the two header lines, every visitor shares one rate limit. Pull the list with:

```sh
curl -H "Authorization: Bearer $ADMIN_TOKEN" https://hirusta.io/api/early-access/export
```
