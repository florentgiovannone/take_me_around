import fs from "node:fs"
import path from "node:path"
import type { ClientRequest } from "node:http"
import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const fileEnv = loadEnv(mode, process.cwd(), "")
  // Netlify injects VITE_* into process.env at build time; loadEnv alone only reads .env files.
  const proxyBase = (
    process.env.VITE_API_PROXY_TARGET ||
    process.env.VITE_API_BASE_URL ||
    fileEnv.VITE_API_PROXY_TARGET ||
    fileEnv.VITE_API_BASE_URL ||
    ""
  )
    .trim()
    .replace(/\/$/, "")
  const apiTarget = proxyBase || "http://127.0.0.1:5050"
  const packagesDir = path.resolve(__dirname, "../../packages")
  const dashboardPassword = (
    process.env.DASHBOARD_PASSWORD ||
    process.env.VITE_DASHBOARD_PASSWORD ||
    fileEnv.DASHBOARD_PASSWORD ||
    fileEnv.VITE_DASHBOARD_PASSWORD ||
    ""
  ).trim()

  const apiProxy = {
    "/api": {
      target: apiTarget,
      changeOrigin: true,
      configure: (proxy: { on: (event: string, fn: (proxyReq: ClientRequest) => void) => void }) => {
        proxy.on("proxyReq", (proxyReq) => {
          if (dashboardPassword) {
            proxyReq.setHeader("X-Dashboard-Password", dashboardPassword)
          }
          if (apiTarget.includes("ngrok")) {
            proxyReq.setHeader("ngrok-skip-browser-warning", "true")
          }
        })
      },
    },
  }

  return {
    resolve: {
      alias: {
        "@tma/config": path.join(packagesDir, "config/src/index.ts"),
        "@tma/analytics-gallery": path.join(packagesDir, "analytics-gallery/src/index.ts"),
        "@tma/analytics-arkin": path.join(packagesDir, "analytics-arkin/src/index.ts"),
        "@tma/analytics-museum": path.join(packagesDir, "analytics-museum/src/index.ts"),
        "@tma/analytics-church-of-england": path.join(
          packagesDir,
          "analytics-church-of-england/src/index.ts"
        ),
        "@tma/analytics-tma-demo": path.join(packagesDir, "analytics-tma-demo/src/index.ts"),
        "@tma/dashboard-scope": path.join(packagesDir, "dashboard-scope/src/index.ts"),
        "@tma/dashboard-ui": path.join(packagesDir, "dashboard-ui/src/index.ts"),
      },
    },
    plugins: [
      react(),
      {
        name: "netlify-redirects",
        closeBundle() {
          const lines: string[] = []
          if (proxyBase) {
            lines.push(`/api/*  ${proxyBase}/api/:splat  200`)
          } else {
            console.warn(
              "[netlify-redirects] Set VITE_API_PROXY_TARGET (or VITE_API_BASE_URL) at build time so /api is proxied."
            )
          }
          lines.push("/*    /index.html   200")
          const out = path.resolve(process.cwd(), "dist", "_redirects")
          fs.mkdirSync(path.dirname(out), { recursive: true })
          fs.writeFileSync(out, `${lines.join("\n")}\n`)
          if (process.env.NETLIFY === "true" && !proxyBase) {
            throw new Error(
              "Netlify build: set VITE_API_PROXY_TARGET (ngrok URL, no trailing slash) in site environment variables."
            )
          }
        },
      },
    ],
    server: {
      host: true,
      allowedHosts: true,
      fs: {
        allow: [path.resolve(__dirname, "../..")],
      },
      proxy: apiProxy,
    },
    preview: {
      host: true,
      allowedHosts: true,
      proxy: apiProxy,
    },
  }
})
