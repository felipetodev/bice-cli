import { Hono } from "hono";
import { cors } from "hono/cors";
import { loadCheckingAccount, loadConfig } from "../config";
import { getWhoami } from "../services/whoami";
import { getUserInfo } from "../services/user";
import { getBalance } from "../services/balance";
import { getProducts } from "../services/products";
import { getTransactions } from "../services/transactions";
import { getMonthlySummary } from "../services/monthly-summary";
import { formatWhoAmI, formatMaskedProducts } from "../formatters";
import type { LoginConfig } from "../schemas/login";
import type { ProductsConfig } from "../schemas/products";

type Variables = { config: LoginConfig; products: ProductsConfig };

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
    {
      endpoint: "/api/monthly-summary",
      description: "Fetches monthly summary for a given product",
      query_params: {
        periods: "Number of past months to include in the summary (default: 4)",
      },
    },
  ]);
});

app.use("/api/*", async (c, next) => {
  const config = await loadConfig();
  const products = await loadCheckingAccount();
  c.set("config", config);
  c.set("products", products);
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
  const products = c.get("products");
  try {
    const whoami = await getWhoami(config);

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
  const products = c.get("products");
  const { page, limit } = c.req.query();

  try {
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
  const products = c.get("products");

  try {
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

app.get("/api/monthly-summary", async (c) => {
  const config = c.get("config");
  const products = c.get("products");
  const { periods } = c.req.query();

  try {
    const monthlySummaries = await getMonthlySummary(config, {
      products,
      periodsQuantity: periods,
    });
    return c.json(monthlySummaries);
  } catch (error) {
    console.error("Error fetching monthly summary:\n", JSON.stringify(error));
    return c.json({ error: "Failed to fetch monthly summary info" }, 500);
  }
});

export default {
  port: 3002,
  fetch: app.fetch,
};
