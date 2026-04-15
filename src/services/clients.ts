import { Endpoints } from "../constants";
import { fetcher } from "../services/http/request";
import { type ClientSummary, clientSummarySchema } from "../schemas/clients";
import type { BffAuthConfig } from "../services/http/types";

export async function getClients(auth: BffAuthConfig): Promise<ClientSummary> {
  const response = await fetcher({
    endpoint: Endpoints.CLIENTS,
    method: "GET",
    auth,
    withCredentials: true,
  });

  const parsed = clientSummarySchema.safeParse(response);
  if (!parsed.success) {
    console.error("Failed to parse clients info:", parsed.error);
    throw new Error("Failed to parse clients info");
  }

  return parsed.data;
}
