import { chromium } from "playwright-chromium";
import { saveConfig } from "@/config";
import {
  PASSWORD,
  RUT,
  PORTAL_URL as PAGE_LOGIN_URL,
  baseHeaders,
} from "@/constants";

let browser: ReturnType<typeof chromium.launch> | null = null;

const username = process.argv[2];
const password = process.argv[3];

const getBrowser = async () => {
  if (browser) return browser;

  browser = chromium.launch({
    headless: false,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-blink-features=AutomationControlled",
    ],
  });

  return browser;
};

const envCredentials = RUT && PASSWORD;
const cliCredentials = username && password;

if (!envCredentials && !cliCredentials) {
  console.error(
    "Error: Missing RUT or Password environment variables. Please set BICE_RUT and BICE_PASSWORD.\n",
  );
  console.error("Alternative option: bice login <your_id> <your_password>");
  console.error("\n  id          Your BICE rut without dots or hyphen");
  console.error("  password    Your BICE password");
  process.exit(1);
}

const login = async () => {
  console.log(`\n  "Banco BICE CLI Login"`);
  console.log(
    `  "Opening browser for authentication... Login to your BICE account and grant access to the CLI."\n`,
  );

  const browser = await getBrowser();

  const context = await browser.newContext({
    viewport: { width: 1024, height: 768 },
    userAgent: baseHeaders["user-agent"],
  });

  const page = await context.newPage();

  await page.goto(PAGE_LOGIN_URL, {
    waitUntil: "domcontentloaded",
    timeout: 30_000,
  });

  console.log(`  "Waiting for login page to load..."`);

  await page.fill("input#username", RUT || username);
  await page.fill("input#password", PASSWORD || password);
  await page.click("input#kc-login");

  console.log(`  "Submitting login form..."`);

  await page.waitForTimeout(3_000);

  console.log(`  "Checking login status..."`);

  if (page.url().includes("https://auth.bice.cl")) {
    console.error(
      "  Login failed. Please check your credentials and try again.",
    );
    console.error(
      "  [Caution]: More than 3 failed login attempts may lock your account.",
    );
    await browser.close();
    process.exit(1);
  }

  console.log(`  "Login successful! Extracting session data..."`);

  let bicePersonaId = "";
  let bicePersonaAuth = "";
  let bicePersonaCsrf = "";
  let bicePersonaAt = "";
  let idSesionPersonas = "";

  while (true) {
    const cookies = await context.cookies();
    const hasCsrf = cookies.some(
      (cookie) => cookie.name === "bice-persona-csrf",
    );
    const hasAt = cookies.some((cookie) => cookie.name === "bice-persona-at");
    if (hasCsrf && hasAt) break;
    await page.waitForTimeout(1_000);
  }

  const cookies = await context.cookies();
  for (const cookie of cookies) {
    if (cookie.name === "bice-persona-id") {
      bicePersonaId = cookie.value;
    } else if (cookie.name === "bice-persona-auth") {
      bicePersonaAuth = cookie.value;
    } else if (cookie.name === "bice-persona-csrf") {
      bicePersonaCsrf = cookie.value;
    } else if (cookie.name === "bice-persona-at") {
      bicePersonaAt = cookie.value;
    } else if (cookie.name === "idSesionPersonas") {
      idSesionPersonas = cookie.value;
    }
  }

  const xBicePersonaCsrf = await page.evaluate(() => {
    return window.sessionStorage.getItem("csrf-person")!;
  });

  console.log(`  "Session data extracted successfully!"`);

  await saveConfig({
    biceUserId: RUT || username,
    bicePersonaId,
    bicePersonaAuth,
    bicePersonaCsrf,
    bicePersonaAt,
    xBicePersonaCsrf,
    idSesionPersonas,
  });

  console.log(`  "Session data saved to config file!"`);

  await browser.close();
};

login().catch((error) => {
  console.error("Login failed:");
  console.error(error);
  browser = null;
  process.exit(1);
});
