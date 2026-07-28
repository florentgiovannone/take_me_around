import fs from "node:fs";
import path from "node:path";
import {
  netlifyProductionRequiresProxyTarget,
  shouldEmitApiProxyRedirectLine,
} from "./apiProxyRedirectsPolicy.mjs";

const proxyFrom =
  process.env.VITE_API_PROXY_TARGET ||
  process.env.API_PROXY_TARGET ||
  process.env.VITE_API_BASE_URL ||
  "";
const target = proxyFrom.trim().replace(/\/$/, "");

const lines = [];
if (shouldEmitApiProxyRedirectLine(target)) {
  lines.push(`/api/*  ${target}/api/:splat  200`);
}
lines.push("/*    /index.html   200");

const publicRedirects = path.resolve(process.cwd(), "public", "_redirects");
const distRedirects = path.resolve(process.cwd(), "dist", "_redirects");
const content = `${lines.join("\n")}\n`;
fs.mkdirSync(path.dirname(publicRedirects), { recursive: true });
fs.writeFileSync(publicRedirects, content);
if (fs.existsSync(path.resolve(process.cwd(), "dist"))) {
  fs.writeFileSync(distRedirects, content);
}

if (target) {
  if (!process.env.VITE_API_PROXY_TARGET && process.env.VITE_API_BASE_URL) {
    console.warn(
      "Using VITE_API_BASE_URL for /api proxy (prefer VITE_API_PROXY_TARGET on Netlify).",
    );
  }
  if (shouldEmitApiProxyRedirectLine(target)) {
    console.log(`Wrote public/_redirects → proxy /api/* to ${target}`);
  } else {
    console.log(
      "Wrote public/_redirects (Netlify non-production: /api/* not mapped — use VITE_API_BASE_URL in the client).",
    );
  }
} else if (netlifyProductionRequiresProxyTarget()) {
  console.error(
    "\nNetlify production build failed: set environment variable VITE_API_PROXY_TARGET\n" +
      "  Example: https://YOUR-SUBDOMAIN.ngrok-free.app\n" +
      "  (Flask + ngrok must be running when users hit the dashboard.)\n",
  );
  process.exit(1);
} else if (process.env.NETLIFY === "true") {
  console.warn(
    "Netlify preview/branch: no VITE_API_PROXY_TARGET — ok if VITE_API_BASE_URL is set for API calls.",
  );
} else {
  console.warn(
    "No VITE_API_PROXY_TARGET — /api/* will not be proxied (ok for local dev).",
  );
}
