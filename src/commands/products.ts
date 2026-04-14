import { loadConfig, saveCheckingAccount } from "../config";
import { getProducts } from "../services/products";

const config = await loadConfig().catch((error) => {
  console.error("Failed to load config:");
  console.error(error);
  process.exit(1);
});

try {
  if (!config) {
    throw new Error("Config not found. Please run 'bice login' first.");
  }

  const productsData = await getProducts(config);

  await saveCheckingAccount(productsData);
  console.log(`  "Checking account info saved to config file"\n`);

  console.log(`  "Products data:"\n`);
  console.log(JSON.stringify(productsData, null, 2));
} catch (error) {
  console.error("Failed to fetch products info:");
  console.error(error);
  process.exit(1);
}
