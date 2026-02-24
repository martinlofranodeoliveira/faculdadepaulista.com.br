import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

function repairPotentialMojibake(value: string): string {
  // Handles cases like "Ã§" that should be "ç"
  if (!/[ÃÂ]/.test(value)) return value
  const decoded = Buffer.from(value, "latin1").toString("utf8")
  return decoded.includes("\uFFFD") ? value : decoded
}

function encodeHeaderAsUtf8Bytes(value: string): string {
  // Node sends header strings as latin1 bytes. Converting utf8 -> latin1 string
  // preserves the intended utf8 byte sequence on the wire.
  return Buffer.from(value, "utf8").toString("latin1")
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/crm-api": {
        target: "https://crmfasul.com.br",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/crm-api/, "/api"),
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req) => {
            const authHeader = req.headers.authorization
            if (typeof authHeader !== "string" || !authHeader) return

            const repaired = repairPotentialMojibake(authHeader)
            const encoded = encodeHeaderAsUtf8Bytes(repaired)
            proxyReq.setHeader("Authorization", encoded)
          })
        },
      },
      "/fasul-courses-api": {
        target: "https://www.fasuleducacional.edu.br",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/fasul-courses-api/, ""),
      },
    },
  },
})
