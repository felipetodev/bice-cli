import { Endpoints } from "../constants";
import { fetcher } from "../services/http/request";
import type { BffAuthConfig } from "../services/http/types";

type GetPortfoliosSummaryParams = {
  clientId: string;
  date: string;
};

export async function getPortfoliosSummary(
  auth: BffAuthConfig,
  { clientId, date }: GetPortfoliosSummaryParams,
) {
  return fetcher({
    endpoint: Endpoints.PORTFOLIOS_SUMMARY,
    method: "GET",
    auth,
    params: {
      clientId,
      date,
      moneda: "CLP",
    },
    withCredentials: true,
  });
}
