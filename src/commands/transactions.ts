import { baseHeaders, BFF_URL, Endpoints } from "@/constants";
import { loadCheckingAccount, loadConfig } from "@/config";

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

  const {
    biceUserId: RUT,
    bicePersonaCsrf,
    bicePersonaAt,
    xBicePersonaCsrf,
    idSesionPersonas,
  } = config;

  const response = await fetch(`${BFF_URL}/${Endpoints.TRANSACTIONS}`, {
    method: "POST",
    headers: {
      ...baseHeaders,
      cookie: `idSesionPersonas=${idSesionPersonas}; bice-persona-csrf=${bicePersonaCsrf}; bice-persona-at=${bicePersonaAt}`,
      "x-bice-persona-csrf": xBicePersonaCsrf,
      "x-rut-cliente": RUT.padStart(10, "0"),
    },
    body: JSON.stringify({
      productNumber: products!.cuenta_corriente.padStart(11, "0"),
      pageMov: Number(pagination || "1"),
      limitMov: Number(limit || "40"),
      currency: "CLP",
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    if (text.includes("The Token has expired")) {
      throw new Error(
        "Session expired. Please run 'bice login' again to refresh your session.",
      );
    }

    throw new Error(
      `Error fetching transactions: ${response.status} ${response.statusText} - ${text}`,
    );
  }

  const transactionsData = await response.json();

  console.log(`  "Transactions data:"\n`);
  console.log(transactionsData);
} catch (error) {
  console.error(error);
  process.exit(1);
}
