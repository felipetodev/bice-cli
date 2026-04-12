import { baseHeaders, BFF_URL, Endpoints } from "@/constants";
import { loadConfig, saveCheckingAccount } from "@/config";

const config = await loadConfig().catch((error) => {
  console.error("Failed to load config:");
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

  const response = await fetch(`${BFF_URL}/${Endpoints.PRODUCTS}`, {
    method: "POST",
    headers: {
      ...baseHeaders,
      cookie: `idSesionPersonas=${idSesionPersonas}; bice-persona-csrf=${bicePersonaCsrf}; bice-persona-at=${bicePersonaAt}`,
      "x-bice-persona-csrf": xBicePersonaCsrf,
      "x-rut-cliente": RUT.padStart(10, "0"),
    },
    body: JSON.stringify({ data: true }),
  });

  if (!response.ok) {
    const text = await response.text();
    if (text.includes("The Token has expired")) {
      throw new Error(
        "Session expired. Please run 'bice login' again to refresh your session.",
      );
    }

    throw new Error(
      `Error fetching products: ${response.status} ${response.statusText} - ${text}`,
    );
  }

  const productsData = await response.json();

  await saveCheckingAccount(productsData);
  console.log(`  "Checking account info saved to config file"\n`);

  console.log(`  "Products data:"\n`);
  console.log(JSON.stringify(productsData, null, 2));
} catch (error) {
  console.error(error);
  process.exit(1);
}
