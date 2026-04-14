import { loadCheckingAccount, loadConfig } from "../config";
import { getMonthlySummary } from "../services/monthly-summary";

const periods = process.argv[2];

const config = await loadConfig().catch((error) => {
  console.error("Failed to load config:");
  console.error(error);
  process.exit(1);
});

const products = await loadCheckingAccount().catch((error) => {
  console.error("Failed to load products:");
  console.error(error);
  process.exit(1);
});

try {
  if (!config) {
    throw new Error("Config not found. Please run 'bice login' first.");
  }

  const monthlySummaries = await getMonthlySummary(config, {
    products,
    periodsQuantity: periods,
  });

  console.log(`  "Monthly summaries:"\n`);
  console.log(monthlySummaries);
} catch (error) {
  console.error("Failed to fetch monthly summaries:");
  console.error(error);
  process.exit(1);
}
