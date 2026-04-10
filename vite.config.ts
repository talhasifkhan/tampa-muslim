import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const isNetlify = process.env.NETLIFY === "true";

export default defineConfig(({ command }) => ({
  base: command === "build" && !isNetlify ? "/tampa-muslim/" : "/",
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
}));
