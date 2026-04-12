import { Hono } from "hono";
import { cors } from "hono/cors";
import { loadConfig } from "@/config";
import { getUserInfo } from "@/services/user";
import type { LoginConfig } from "@/schemas/login";

type Variables = { config: LoginConfig };

const app = new Hono<{ Variables: Variables }>();
app.use("*", cors());

console.log(`BICE CLI API running on: http://localhost:3002`);

app.get("/", (c) => {
  return c.text("🏦 BICE CLI API is running");
});

app.use("/api/*", async (c, next) => {
  const config = await loadConfig();
  c.set("config", config);
  await next();
});

app.get("/api/user", async (c) => {
  const config = c.get("config");
  const userInfo = await getUserInfo(config);
  return c.json(userInfo);
});

export default {
  port: 3002,
  fetch: app.fetch,
};
