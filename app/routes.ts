import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/landing.tsx"),
  route("app", "routes/home.tsx"),
  route("changelog", "routes/changelog.tsx"),
  route("admin", "routes/admin.tsx"),
] satisfies RouteConfig;
