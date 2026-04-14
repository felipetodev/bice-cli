import { Endpoints } from "../constants";
import { fetcher } from "../services/http/request";
import type { BffAuthConfig } from "../services/http/types";

type GetBalanceParams = {
  productNumber: string;
};

export async function getBalance(
  auth: BffAuthConfig,
  { productNumber }: GetBalanceParams,
) {
  return fetcher({
    endpoint: Endpoints.BALANCE,
    method: "POST",
    auth,
    body: {
      productNumber: productNumber.padStart(11, "0"),
    },
  });
}
