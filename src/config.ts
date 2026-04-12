import { existsSync } from "fs";
import { join } from "path";
import { CONFIG_CHECKING_ACCOUNT_FILENAME, CONFIG_FILENAME } from "@/constants";
import { loginSchema, type LoginConfig } from "@/schemas/login";
import { CheckingAccount, productsSchema } from "@/schemas/products";

const CONFIG_PATH = join(import.meta.dir, "..", CONFIG_FILENAME);
const CHECKING_ACCOUNT_PATH = join(
  import.meta.dir,
  "..",
  CONFIG_CHECKING_ACCOUNT_FILENAME,
);

export async function loadConfig() {
  if (!existsSync(CONFIG_PATH)) {
    throw new Error(
      `No config found. Please run 'bice login' to save your session info.`,
    );
  }
  const text = await Bun.file(CONFIG_PATH).text();

  const parsed = loginSchema.safeParse(JSON.parse(text));
  if (!parsed.success) {
    throw new Error(`Invalid config: ${parsed.error.message}`);
  }

  return parsed.data;
}

export async function saveConfig(config: LoginConfig): Promise<void> {
  await Bun.write(CONFIG_PATH, JSON.stringify(config, null, 2));
}

export async function removeConfig(): Promise<void> {
  const { unlinkSync } = await import("fs");
  if (existsSync(CONFIG_PATH)) {
    unlinkSync(CONFIG_PATH);
  }
}

export async function saveCheckingAccount({
  productos,
}: {
  productos: CheckingAccount;
}): Promise<void> {
  const cards = {} as Record<string, string>;
  for (const product of Object.keys(productos) as Array<
    keyof CheckingAccount
  >) {
    cards[product.toLocaleLowerCase()] = productos[product][0].numeroCuenta;
  }

  await Bun.write(CHECKING_ACCOUNT_PATH, JSON.stringify(cards, null, 2));
}

export async function loadCheckingAccount() {
  if (!existsSync(CHECKING_ACCOUNT_PATH)) {
    throw new Error(
      `No checking account config found. Please run 'bice products' to save your checking account info.`,
    );
  }
  const text = await Bun.file(CHECKING_ACCOUNT_PATH).text();

  const parsed = productsSchema.safeParse(JSON.parse(text));

  if (!parsed.success) {
    throw new Error(`Invalid checking account config: ${parsed.error.message}`);
  }

  return parsed.data;
}
