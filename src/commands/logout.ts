import { removeConfig } from "../config";

try {
  await removeConfig();
  console.log(`  "Disconnected successfully! Local config removed."\n`);
} catch {}
