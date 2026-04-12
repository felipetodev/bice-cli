import { Hono } from "hono";
import { cors } from "hono/cors";
import { loadConfig } from "@/config";
import { getUserInfo } from "@/services/user";
import type { LoginConfig } from "@/schemas/login";

type Variables = { config: LoginConfig };

const app = new Hono<{ Variables: Variables }>();
app.use("*", cors());

console.log("BICE CLI API running on: http://localhost:3002");

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
  try {
    const userInfo = await getUserInfo(config);
    return c.json(userInfo);
  } catch (error) {
    console.error("Error fetching user info:\n", JSON.stringify(error));
    return c.json({ error: "Failed to fetch user info" }, 500);
  }
});

export default {
  port: 3002,
  fetch: app.fetch,
};
