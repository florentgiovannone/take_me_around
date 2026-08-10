/// <reference types="vitest/config" />
import fs from "node:fs"
import path from "node:path"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"

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

  return {
    plugins: [
      react(),
      {
        name: "netlify-redirects",
        closeBundle() {
          const lines: string[] = []
          if (proxyBase) {
            lines.push(`/api/*  ${proxyBase}/api/:splat  200`)
          }
          lines.push("/*    /index.html   200")
          const out = path.resolve(process.cwd(), "dist", "_redirects")
          fs.mkdirSync(path.dirname(out), { recursive: true })
          fs.writeFileSync(out, `${lines.join("\n")}\n`)
        },
      },
    ],
    test: {
      environment: "node",
    },
    server: {
      host: true,
      allowedHosts: true,
      fs: {
        allow: [path.resolve(__dirname, "../..")],
      },
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
