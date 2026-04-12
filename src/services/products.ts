import { Endpoints } from "@/constants";
import type { CheckingAccount } from "@/schemas/products";
import { fetcher } from "@/services/http/request";
import type { BffAuthConfig } from "@/services/http/types";

export async function getProducts(auth: BffAuthConfig) {
  return fetcher<{ productos: CheckingAccount }>({
    endpoint: Endpoints.PRODUCTS,
    method: "POST",
    auth,
    body: { data: true },
  });
}
