import { loadCheckingAccount, loadConfig } from "@/config";
import { getBalance } from "@/services/balance";

const config = await loadConfig().catch((error) => {
  console.error("Failed to load config:");
  console.error(error);
  process.exit(1);
});

const products = await loadCheckingAccount().catch((error) => {
  console.error(error);
  process.exit(1);
});

try {
  if (!config) {
    throw new Error("Config not found. Please run 'bice login' first.");
  }

  if (!products) {
    throw new Error("Checking account config not found.");
  }

  let productsBalance = {};
  for (const [productName, productNumber] of Object.entries(products)) {
    if (!productNumber) continue;

    const balanceInfo = await getBalance(config, { productNumber });

    productsBalance = {
      ...productsBalance,
      [productName]: balanceInfo,
    };
  }

  console.log(`  "Balance info:"\n`);
  console.log(JSON.stringify(productsBalance, null, 2));
} catch (error) {
  console.error("Failed to fetch balance info:");
  console.error(error);
  process.exit(1);
}
