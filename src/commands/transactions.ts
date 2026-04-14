import { loadCheckingAccount, loadConfig } from "../config";
import { getTransactions } from "../services/transactions";

const pagination = process.argv[2];
const limit = process.argv[3];

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

  const transactionsData = await getTransactions(config, {
    products,
    pagination,
    limit,
  });

  console.log(`  "Transactions data:"\n`);
  console.log(transactionsData);
} catch (error) {
  console.error("Failed to fetch transactions info:");
  console.error(error);
  process.exit(1);
}
