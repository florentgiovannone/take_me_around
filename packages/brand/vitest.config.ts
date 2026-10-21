import { defineConfig } from "vitest/config"
import { transformWithEsbuild } from "vite"

export default defineConfig({
  esbuild: { jsx: "automatic" },
  plugins: [
    {
      name: "jsx-in-ts-test-files",
      enforce: "pre",
      async transform(code, id) {
        if (!id.endsWith(".test.ts")) return
        return transformWithEsbuild(code, id, {
          loader: "tsx",
          jsx: "automatic",
        })
      },
    },
  ],
  test: { environment: "node" },
})
