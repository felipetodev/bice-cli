import { Endpoints } from "../constants";
import {
  AccountHistoricPeriodsResponse,
  accountHistoricPeriodsResponseSchema,
} from "../schemas/account-periods";
import { fetcher } from "../services/http/request";
import type { BffAuthConfig } from "../services/http/types";

export async function getAccountsPeriods(
  auth: BffAuthConfig,
): Promise<AccountHistoricPeriodsResponse> {
  const response = await fetcher({
    endpoint: Endpoints.ACCOUNTS_PERIODS,
    method: "POST",
    auth,
    body: {
      currencyType: "MN",
    },
  });

  const parse = accountHistoricPeriodsResponseSchema.safeParse(response);
  if (!parse.success) {
    console.error("Failed to parse accounts periods response:", parse.error);
    throw new Error("Invalid accounts periods response format");
  }

  return parse.data;
}
