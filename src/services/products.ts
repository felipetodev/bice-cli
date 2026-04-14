import { Endpoints } from "../constants";
import { fetcher } from "../services/http/request";
import type { CheckingAccount } from "../schemas/products";
import type { BffAuthConfig } from "../services/http/types";

export async function getProducts(auth: BffAuthConfig) {
  return fetcher<{ productos: CheckingAccount }>({
    endpoint: Endpoints.PRODUCTS,
    method: "POST",
    auth,
    body: { data: true },
  });
}
