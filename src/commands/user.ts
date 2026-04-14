import { loadConfig } from "../config";
import { getUserInfo } from "../services/user";

const config = await loadConfig().catch((error) => {
  console.error("Failed to load config:");
  console.error(error);
  process.exit(1);
});

try {
  if (!config) {
    throw new Error("Config not found. Please run 'bice login' first.");
  }

  const userInfo = await getUserInfo(config);

  console.log(`  "User info:"\n`);
  console.log(JSON.stringify(userInfo, null, 2));
} catch (error) {
  console.error("Failed to fetch user info:");
  console.error(error);
  process.exit(1);
}
