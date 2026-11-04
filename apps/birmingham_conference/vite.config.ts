/// <reference types="vitest/config" />
import fs from "node:fs"
import path from "node:path"
import type { ClientRequest } from "node:http"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"
import { createAdminGateMiddleware } from "./src/adminGateDevMiddleware"
import { conferenceRedirects } from "./src/conferenceRedirects"
import { createRegistrationsReadMiddleware } from "./src/registrationsReadDevMiddleware"

export default defineConfig(({ mode }) => {
  const fileEnv = loadEnv(mode, process.cwd(), "")
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
  const registrationBase = (
    process.env.VITE_BIRMINGHAM_REGISTRATION_URL ||
    fileEnv.VITE_BIRMINGHAM_REGISTRATION_URL ||
    ""
  )
    .trim()
    .replace(/\/$/, "")
  const adminBase = (
    process.env.VITE_ADMIN_PROXY_TARGET ||
    fileEnv.VITE_ADMIN_PROXY_TARGET ||
    "https://tma-mac.netlify.app"
  )
    .trim()
    .replace(/\/$/, "")
  const packagesDir = path.resolve(__dirname, "../../packages")
  const dashboardPassword = (
    process.env.DASHBOARD_PASSWORD ||
    process.env.VITE_DASHBOARD_PASSWORD ||
    fileEnv.DASHBOARD_PASSWORD ||
    fileEnv.VITE_DASHBOARD_PASSWORD ||
    ""
  ).trim()
  const adminDashboardPassword = (
    process.env.ADMIN_DASHBOARD_PASSWORD ||
    fileEnv.ADMIN_DASHBOARD_PASSWORD ||
    ""
  ).trim()
  const registrationsReadKey = (
    process.env.REGISTRATIONS_READ_KEY ||
    fileEnv.REGISTRATIONS_READ_KEY ||
    ""
  ).trim()

  const withNgrok = (
    target: string,
    extra?: (proxyReq: ClientRequest) => void
  ) => ({
    target,
    changeOrigin: true,
    configure: (proxy: { on: (event: string, fn: (proxyReq: ClientRequest) => void) => void }) => {
      proxy.on("proxyReq", (proxyReq) => {
        extra?.(proxyReq)
        if (target.includes("ngrok")) {
          proxyReq.setHeader("ngrok-skip-browser-warning", "true")
        }
      })
    },
  })

  const apiProxy = {
    "/api": {
      ...withNgrok(apiTarget, (proxyReq) => {
        if (dashboardPassword) {
          proxyReq.setHeader("X-Dashboard-Password", dashboardPassword)
        }
      }),
      bypass(req: { url?: string }) {
        const path = req.url?.split("?")[0]
        if (
          path === "/api/admin-session" ||
          path === "/api/admin/registrations" ||
          path === "/api/pack-registration"
        ) {
          return req.url
        }
        return null
      },
    },
    ...(adminBase
      ? {
          "/admin": {
            ...withNgrok(adminBase),
            rewrite: adminBase.includes("tma-mac.netlify.app")
              ? (path: string) => `/registration-api${path}`
              : undefined,
          },
          "/static": {
            ...withNgrok(adminBase),
            rewrite: adminBase.includes("tma-mac.netlify.app")
              ? (path: string) => `/registration-api${path}`
              : undefined,
          },
        }
      : {}),
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
        "@tma/analytics-store-codes": path.join(packagesDir, "analytics-store-codes/src/index.ts"),
        "@tma/dashboard-scope": path.join(packagesDir, "dashboard-scope/src/index.ts"),
        "@tma/dashboard-ui": path.join(packagesDir, "dashboard-ui/src/index.ts"),
      },
    },
    plugins: [
      react(),
      {
        name: "admin-dashboard-gate",
        configureServer(server) {
          server.middlewares.use(createAdminGateMiddleware(adminDashboardPassword))
          server.middlewares.use(
            createRegistrationsReadMiddleware({
              adminPassword: adminDashboardPassword,
              registrationBase,
              readKey: registrationsReadKey,
            })
          )
        },
        configurePreviewServer(server) {
          server.middlewares.use(createAdminGateMiddleware(adminDashboardPassword))
          server.middlewares.use(
            createRegistrationsReadMiddleware({
              adminPassword: adminDashboardPassword,
              registrationBase,
              readKey: registrationsReadKey,
            })
          )
        },
      },
      {
        name: "netlify-redirects",
        closeBundle() {
          const lines = conferenceRedirects({ proxyBase, registrationBase })
          const out = path.resolve(process.cwd(), "dist", "_redirects")
          fs.mkdirSync(path.dirname(out), { recursive: true })
          fs.writeFileSync(out, `${lines.join("\n")}\n`)
        },
      },
    ],
    test: {
      environment: "node",
    },
    build: {
      cssMinify: "esbuild",
    },
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
