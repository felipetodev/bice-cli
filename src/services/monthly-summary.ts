import { Endpoints } from "../constants";
import { fetcher } from "../services/http/request";
import type { ProductsConfig } from "../schemas/products";
import type { BffAuthConfig } from "../services/http/types";

type GetMonthlySummaryParams = {
  periodsQuantity?: string;
  products: ProductsConfig;
};

export async function getMonthlySummary(
  auth: BffAuthConfig,
  { periodsQuantity, products }: GetMonthlySummaryParams,
) {
  return fetcher({
    endpoint: Endpoints.MONTHLY_SUMMARY,
    method: "POST",
    auth,
    body: {
      currency: "CLP",
      periodsQuantity: Number(periodsQuantity || 4),
      productNumber: products.cuenta_corriente.padStart(11, "0"),
    },
  });
}
