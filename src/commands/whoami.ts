import { loadCheckingAccount, loadConfig } from "@/config";
import { formatMaskedProducts, formatWhoAmI } from "@/formatters";
import { getWhoami } from "@/services/whoami";

const config = await loadConfig().catch((error) => {
  console.error("Failed to load config:");
  console.error(error);
  process.exit(1);
});

const products = await loadCheckingAccount().catch(() => undefined);

try {
  if (!config) {
    throw new Error("Config not found. Please run 'bice login' first.");
  }

  const whoami = await getWhoami(config);

  console.log(`  "Whoami info:"\n`);
  console.log(
    JSON.stringify(
      {
        id: config.biceUserId,
        expires_at: config.sessionExpiresAt,
        is_valid: new Date(config.sessionExpiresAt) > new Date(),
        products: formatMaskedProducts(products),
        ...formatWhoAmI(whoami),
      },
      null,
      2,
    ),
  );

  if (!products) {
    console.log(
      `\n  "[Note]: If "products" is null, run 'bice products' first to load them, then run 'bice whoami' again."`,
    );
  }
} catch (error) {
  console.error("Failed to fetch whoami info:");
  console.error(error);
  process.exit(1);
}
