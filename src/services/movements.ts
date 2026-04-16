import { Endpoints } from "../constants";
import { MovementsData, movementsResponseSchema } from "../schemas/movements";
import { fetcher } from "../services/http/request";
import type { BffAuthConfig } from "../services/http/types";

type GetMovementsParams = {
  account: string;
  currencyCode: string;
  endDate: string;
  startDate: string;
};

export async function getMovements(
  auth: BffAuthConfig,
  { account, currencyCode, endDate, startDate }: GetMovementsParams,
): Promise<MovementsData> {
  const response = await fetcher({
    endpoint: Endpoints.MOVEMENTS,
    method: "POST",
    auth,
    body: {
      account,
      currencyCode,
      endDate,
      startDate,
    },
  });

  const parse = movementsResponseSchema.safeParse(response);
  if (!parse.success) {
    console.error("Failed to parse movements response:", parse.error);
    throw new Error("Invalid movements response format");
  }

  return parse.data.data;
}
