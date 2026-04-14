import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from "vite-plugin-pwa";

const isNetlify = process.env.NETLIFY === "true";

export default defineConfig(({ command }) => ({
  base: command === "build" && !isNetlify ? "/tampa-muslim/" : "/",
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: false, // using public/manifest.json directly
      workbox: {
        globPatterns: ["**/*.{js,css,html,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/docs\.google\.com\/spreadsheets\//,
            handler: "NetworkFirst",
            options: {
              cacheName: "csv-data",
              expiration: { maxAgeSeconds: 60 * 60 }, // 1 hour
              networkTimeoutSeconds: 5,
            },
          },
        ],
      },
    }),
  ],
}));
