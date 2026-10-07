import lemazainTour from "./tours/lemazain.json";
import taulaTour from "./tours/taula.json";
import adarTour from "./tours/adar.json";
import bidaliTour from "./tours/bidali.json";

const GRAD = `<defs><linearGradient id="appg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#215CCC"/><stop offset="1" stop-color="#732EA8"/></linearGradient></defs>`;

const icon = (inner) =>
  `<svg class="app-icon" viewBox="0 0 64 64" aria-hidden="true">${GRAD}<rect width="64" height="64" rx="15" fill="url(#appg)"/>${inner}</svg>`;

export const apps = [
  {
    slug: "lemazain",
    name: "lemazain",
    kind: "Kubernetes IDE",
    etym: "Basque for helmsman — the Greek κυβερνήτης",
    headline: "A calm, native Mac app for Kubernetes.",
    lede: "Live tables for every kind of resource, one screen that shows what's broken, and production clusters locked until you choose to unlock them.",
    price: "€39",
    requires: "macOS 14+",
    replaces: "Lens, k9s",
    href: "/lemazain/",
    tour: lemazainTour,
    icon: icon(`<g fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round"><circle cx="32" cy="32" r="11"/><path d="M32 10v11M32 43v11M10 32h11M43 32h11M16.4 16.4l7.8 7.8M39.8 39.8l7.8 7.8M16.4 47.6l7.8-7.8M39.8 24.2l7.8-7.8"/></g><circle cx="32" cy="32" r="3.6" fill="#fff"/>`),
  },
  {
    slug: "taula",
    name: "Taula",
    kind: "Database manager",
    etym: "Basque for table",
    headline: "A friendly Mac app for Postgres and SQLite.",
    lede: "Browse tables, edit cells, and see the exact SQL before anything is saved. I made it so I'd reach for psql a little less.",
    price: "€25",
    requires: "macOS 15+",
    replaces: "TablePlus, psql",
    href: "/taula/",
    tour: taulaTour,
    icon: icon(`<rect x="14" y="16" width="36" height="32" rx="3" fill="none" stroke="#fff" stroke-width="2.6"/><rect x="14" y="16" width="36" height="10" rx="3" fill="#fff" fill-opacity=".92"/><path d="M26 26v22M38 26v22M14 37h36" stroke="#fff" stroke-width="2.6"/>`),
  },
  {
    slug: "adar",
    name: "adar",
    kind: "Pull-request client",
    etym: "Basque for branch",
    headline: "Pull requests, mostly from the keyboard.",
    lede: "Your reviews in one inbox, the whole diff on one screen, check results you can trust, and a terminal for your coding agent, already in the PR's checkout.",
    price: "€9",
    requires: "macOS 26+",
    replaces: "GitHub's web UI",
    href: "/adar/",
    tour: adarTour,
    icon: icon(`<g fill="none" stroke="#fff" stroke-width="3.8" stroke-linecap="round"><path d="M24 19v26"/><path d="M41 23c0 13-17 9-17 20"/></g><g fill="#fff"><circle cx="24" cy="15" r="4.8"/><circle cx="24" cy="49" r="4.8"/><circle cx="41" cy="18" r="4.8"/></g>`),
  },
  {
    slug: "bidali",
    name: "bidali",
    kind: "HTTP client",
    etym: "Basque for to send",
    headline: "Your Bruno collections, in a native Mac app.",
    lede: "Requests stay as .bru files you can commit and diff, Bruno scripts run without Node, and the same runner works from the command line.",
    price: "Free",
    free: true,
    requires: "macOS 14+",
    replaces: "Bruno, Postman",
    href: null,
    tour: bidaliTour,
    icon: icon(`<path d="M47 17 15 30.5l12.6 4.9L32.5 48z" fill="#fff"/><path d="M47 17 27.6 35.4" stroke="url(#appg)" stroke-width="3" stroke-linecap="round"/>`),
  },
];

export const windowFor = (slug) =>
  `<iframe src="/${slug}/embed/" title="${slug} window" loading="lazy" tabindex="-1" scrolling="no"></iframe>`;
