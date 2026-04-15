import { loadConfig } from "../config";
import { getClients } from "../services/clients";
import { getPortfoliosSummary } from "../services/portfolios-summary";

const date = process.argv[2];

const config = await loadConfig().catch((error) => {
  console.error("Failed to load config:");
  console.error(error);
  process.exit(1);
});

try {
  if (!config) {
    throw new Error("Config not found. Please run 'bice login' first.");
  }

  const { ClientId: clientId } = await getClients(config);
  const portfoliosSummary = await getPortfoliosSummary(config, {
    clientId,
    date,
  });

  console.log(`  "Portfolios summary:"\n`);
  console.log(JSON.stringify(portfoliosSummary, null, 2));
} catch (error) {
  console.error("Failed to fetch portfolios summary:");
  console.error(error);
  process.exit(1);
}
