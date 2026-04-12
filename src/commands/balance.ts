import { loadCheckingAccount, loadConfig } from "@/config";
import { baseHeaders, BFF_URL, Endpoints } from "@/constants";

const config = await loadConfig().catch((error) => {
  console.error("❌ Failed to load config:");
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

  const {
    biceUserId: RUT,
    bicePersonaCsrf,
    bicePersonaAt,
    xBicePersonaCsrf,
    idSesionPersonas,
  } = config;

  let productsBalance = {};
  for (const [productName, productNumber] of Object.entries(products!)) {
    if (!productNumber) continue;

    const response = await fetch(`${BFF_URL}/${Endpoints.BALANCE}`, {
      method: "POST",
      headers: {
        ...baseHeaders,
        cookie: `idSesionPersonas=${idSesionPersonas}; bice-persona-csrf=${bicePersonaCsrf}; bice-persona-at=${bicePersonaAt}`,
        "x-bice-persona-csrf": xBicePersonaCsrf,
        "x-rut-cliente": RUT.padStart(10, "0"),
      },
      body: JSON.stringify({
        productNumber: productNumber.padStart(11, "0"),
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch balance info: ${response.status} ${response.statusText}`,
      );
    }

    const balanceInfo = await response.json();
    productsBalance = {
      ...productsBalance,
      [productName]: balanceInfo,
    };
  }

  console.log(`  "Balance info:"\n`);
  console.log(JSON.stringify(productsBalance, null, 2));
} catch (error) {
  console.error("❌ Failed to fetch balance info:");
  console.error(error);
}
