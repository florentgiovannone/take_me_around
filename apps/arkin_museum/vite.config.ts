import fs from "node:fs"
import path from "node:path"
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
  const arkinDashboard =
    (
      process.env.VITE_ARKIN_DASHBOARD_URL ||
      fileEnv.VITE_ARKIN_DASHBOARD_URL ||
      "https://arkin.takemearound.gallery"
    )
      .trim()
      .replace(/\/$/, "")

  return {
    server: {
      fs: {
        allow: [path.resolve(__dirname, "../..")],
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
          lines.push(
            `/dashboard      ${arkinDashboard}/dashboard/museum     301!`
          )
          lines.push(
            `/dashboard/*    ${arkinDashboard}/dashboard/museum/:splat  301!`
          )
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
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
          configure: (proxy) => {
            if (apiTarget.includes("ngrok")) {
              proxy.on("proxyReq", (proxyReq) => {
                proxyReq.setHeader("ngrok-skip-browser-warning", "true")
              })
            }
          },
        },
      },
    },
    preview: {
      host: true,
      allowedHosts: true,
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
          configure: (proxy) => {
            if (apiTarget.includes("ngrok")) {
              proxy.on("proxyReq", (proxyReq) => {
                proxyReq.setHeader("ngrok-skip-browser-warning", "true")
              })
            }
          },
        },
      },
    },
  }
})
