import { Endpoints } from "@/constants";
import { fetcher } from "@/services/http/request";
import type { ProductsConfig } from "@/schemas/products";
import type { BffAuthConfig } from "@/services/http/types";

type GetTransactionsParams = {
  products: ProductsConfig;
  pagination?: string;
  limit?: string;
};

export async function getTransactions(
  auth: BffAuthConfig,
  { products, pagination, limit }: GetTransactionsParams,
) {
  return fetcher({
    endpoint: Endpoints.TRANSACTIONS,
    method: "POST",
    auth,
    body: {
      productNumber: products.cuenta_corriente.padStart(11, "0"),
      pageMov: Number(pagination || "1"),
      limitMov: Number(limit || "40"),
      currency: "CLP",
    },
  });
}
