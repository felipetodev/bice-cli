import { loadConfig } from "../config";
import { getPeriodRange } from "../formatters/movements";
import { getAccountsPeriods } from "../services/account-periods";
import { getMovements } from "../services/movements";

const month = process.argv[2];
const year = process.argv[3];

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
    data: { accounts },
  } = await getAccountsPeriods(config);
  const { periods, maskedProductNumber: account, currencyCode } = accounts[0];

  const period = getPeriodRange({ periods, month, year });

  if (!period) {
    throw new Error(
      `No period found for the given month "${month}" and year "${year || new Date().getFullYear()}"`,
    );
  }

  const { movements } = await getMovements(config, {
    account,
    currencyCode,
    startDate: period.startDate,
    endDate: period.endDate,
  });

  console.log(`  "Historic account movements data:"\n`);
  console.log(JSON.stringify(movements, null, 2));
} catch (error) {
  console.error("Failed to fetch movements info:");
  console.error(error);
  process.exit(1);
}
