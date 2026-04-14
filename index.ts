#!/usr/bin/env bun
import { resolve, dirname } from "path";
import { readFileSync } from "fs";
import chalk from "chalk";
import { printBiceLogo } from "./src/ui/logo";

const ROOT = dirname(Bun.main);
const command = process.argv[2];

const pkgPath = resolve(ROOT, "package.json");
const currentVersion = JSON.parse(readFileSync(pkgPath, "utf-8")).version;

const commands: Record<string, string> = {
  login: "src/commands/login.ts",
  logout: "src/commands/logout.ts",
  user: "src/commands/user.ts",
  whoami: "src/commands/whoami.ts",
  balance: "src/commands/balance.ts",
  products: "src/commands/products.ts",
  transactions: "src/commands/transactions.ts",
  "monthly-summary": "src/commands/monthly-summary.ts",
  server: "src/api/index.ts",
};

if (!command || command === "help" || !commands[command]) {
  const d = chalk.dim;
  const c = chalk.cyan;
  const b = chalk.bold;

  printBiceLogo(currentVersion);

  console.log(`\
${b("Banking")}
  ${c("login")} ${d("<RUT> <password>")}                 Log in with bank credentials
  ${c("user")}                                   Show user info
  ${c("logout")}                                 Disconnect and clear session
  ${c("products")}                               List all products
  ${c("balance")}                                Quick balance check
  ${c("transactions")} ${d("<page> <limit>")}            View period transactions (default: page=1, limit=40)
  ${c("monthly-summary")} ${d("<periods>")}         View monthly summary (e.g. 'bice monthly-summary 6' for the last 6 months)
  WIP: ${"movements"} ${d("<month> <year>")}          View monthly movements (e.g. 'bice movements april')

${b("Session")}
  ${c("whoami")}                                 Show session info and accounts

${b("API")}
  ${c("server")}                                 Start REST API server (port 3002)

${d("Usage:")}  bice <command> [args...]
`);
  process.exit(command && command !== "help" ? 1 : 0);
}

const args = process.argv.slice(3);
const proc = Bun.spawn(
  ["bun", "run", resolve(ROOT, commands[command]), ...args],
  {
    stdio: ["inherit", "inherit", "inherit"],
  },
);
const exitCode = await proc.exited;
process.exit(exitCode);
