import { Hono } from "hono";
import { cors } from "hono/cors";
import { loadCheckingAccount, loadConfig } from "@/config";
import { getWhoami } from "@/services/whoami";
import { getUserInfo } from "@/services/user";
import { getBalance } from "@/services/balance";
import { getProducts } from "@/services/products";
import { getTransactions } from "@/services/transactions";
import { formatWhoAmI, formatMaskedProducts } from "@/formatters";
import type { LoginConfig } from "@/schemas/login";

type Variables = { config: LoginConfig };

const app = new Hono<{ Variables: Variables }>();
app.use("*", cors());

console.log("🏦 BICE CLI API running on: http://localhost:3002");

app.get("/", (c) => {
  return c.json([
    {
      endpoint: "/api/user",
      description: "Fetches user information",
    },
    {
      endpoint: "/api/whoami",
      description:
        "Fetches session information and products linked to the account",
    },
    {
      endpoint: "/api/products",
      description: "Fetches all products for the linked account",
    },
    {
      endpoint: "/api/transactions",
      description: "Fetches transactions for the linked products",
      query_params: {
        page: "Page number for pagination (default: 1)",
        limit: "Number of transactions per page (default: 40)",
      },
    },
    {
      endpoint: "/api/balance",
      description: "Fetches balance for the linked products",
    },
  ]);
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

app.get("/api/whoami", async (c) => {
  const config = c.get("config");
  try {
    const whoami = await getWhoami(config);
    const products = await loadCheckingAccount().catch(() => undefined);

    return c.json({
      id: config.biceUserId,
      expires_at: config.sessionExpiresAt,
      is_valid: new Date(config.sessionExpiresAt) > new Date(),
      products: formatMaskedProducts(products),
      ...formatWhoAmI(whoami),
    });
  } catch (error) {
    console.error("Error fetching whoami info:\n", JSON.stringify(error));
    return c.json({ error: "Failed to fetch whoami info" }, 500);
  }
});

app.get("/api/products", async (c) => {
  const config = c.get("config");
  try {
    const productsData = await getProducts(config);
    return c.json(productsData);
  } catch (error) {
    console.error("Error fetching products:\n", JSON.stringify(error));
    return c.json({ error: "Failed to fetch products info" }, 500);
  }
});

app.get("/api/transactions", async (c) => {
  const config = c.get("config");
  const { page, limit } = c.req.query();

  try {
    const products = await loadCheckingAccount();
    const transactionsData = await getTransactions(config, {
      products,
      limit,
      pagination: page,
    });
    return c.json(transactionsData);
  } catch (error) {
    console.error("Error fetching transactions:\n", JSON.stringify(error));
    return c.json({ error: "Failed to fetch transactions info" }, 500);
  }
});

app.get("/api/balance", async (c) => {
  const config = c.get("config");
  try {
    const products = await loadCheckingAccount();

    let productsBalance = {};
    for (const [productName, productNumber] of Object.entries(products)) {
      if (!productNumber) continue;

      const balanceInfo = await getBalance(config, { productNumber });

      productsBalance = {
        ...productsBalance,
        [productName]: balanceInfo,
      };
    }

    return c.json(productsBalance);
  } catch (error) {
    console.error("Error fetching balance:\n", JSON.stringify(error));
    return c.json({ error: "Failed to fetch balance info" }, 500);
  }
});

export default {
  port: 3002,
  fetch: app.fetch,
};
