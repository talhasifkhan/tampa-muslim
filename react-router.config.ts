import type { Config } from "@react-router/dev/config";

const isNetlify = process.env.NETLIFY === "true";
const isProd = process.env.NODE_ENV === "production";

export default {
  ssr: false,
  basename: isProd && !isNetlify ? "/tampa-muslim" : "/",
} satisfies Config;
