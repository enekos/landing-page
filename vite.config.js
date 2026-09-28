import { existsSync } from "node:fs";
import { join } from "node:path";
import { defineConfig } from "vite";

const APPS = ["lemazain", "taula", "adar"];

const BACKEND = Object.fromEntries(APPS.map((a) => [a, `https://${a}.pages.dev`]));

const folderIndex = () => ({
  name: "folder-index",
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      const [path, query = ""] = req.url.split("?");
      const app = APPS.find((a) => path === `/${a}` || path.startsWith(`/${a}/`));
      if (app) {
        const dir = path.endsWith("/") ? path : `${path}/`;
        if (existsSync(join(server.config.publicDir, dir, "index.html"))) {
          req.url = `${dir}index.html${query ? `?${query}` : ""}`;
        }
      }
      next();
    });
  },
});

export default defineConfig({
  plugins: [folderIndex()],
  server: {
    proxy: {
      "/api/early-access": { target: "http://localhost:8787" },
      ...Object.fromEntries(APPS.flatMap((a) => ["api", "dl", "appcast.xml"].map((p) => [
        `/${a}/${p}`,
        { target: BACKEND[a], changeOrigin: true, rewrite: (url) => url.slice(a.length + 1) },
      ]))),
    },
  },
});
