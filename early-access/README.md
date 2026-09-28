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

## Production

Deployed on 2026-09-28 to https://hirusta-early-access.begiarenhezurra.workers.dev, with the D1 database `hirusta-early-access` (`70ee3974-…`, weur). hirusta.io's form posts there directly; the Worker only answers CORS for `https://hirusta.io`. The secrets `ADMIN_TOKEN`, `IP_SALT` and `PROXY_TOKEN` are set, and copies are in `~/.config/hirusta/early-access.env`.

```sh
npx wrangler deploy
npx wrangler d1 execute hirusta-early-access --remote --command "SELECT * FROM signups ORDER BY created_at"
curl -H "Authorization: Bearer $ADMIN_TOKEN" https://hirusta-early-access.begiarenhezurra.workers.dev/api/early-access/export
```

`PROXY_TOKEN` is only needed if Apache ever proxies `/api/early-access` on hirusta.io. In that case Apache has to send `X-Real-IP` and `X-Proxy-Token`, because behind a proxy `cf-connecting-ip` is the droplet's own address.
