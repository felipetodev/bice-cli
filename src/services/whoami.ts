import { Endpoints } from "@/constants";
import { fetcher } from "@/services/http/request";
import { whoAmISchema, type WhoAmI } from "@/schemas/whoami";
import type { BffAuthConfig } from "@/services/http/types";

export async function getWhoami(auth: BffAuthConfig): Promise<WhoAmI> {
  const response = await fetcher({
    endpoint: Endpoints.WHOAMI,
    method: "GET",
    auth,
    withCredentials: true,
  });

  const parsed = whoAmISchema.safeParse(response);
  if (!parsed.success) {
    console.error("Failed to parse whoami response:", parsed.error);
    throw new Error("Failed to parse whoami response");
  }

  return parsed.data;
}
