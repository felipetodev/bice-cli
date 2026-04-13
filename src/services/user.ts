import { Endpoints } from "@/constants";
import { userInfoSchema, type UserInfo } from "@/schemas/user";
import { fetcher } from "@/services/http/request";
import type { BffAuthConfig } from "@/services/http/types";

export async function getUserInfo(auth: BffAuthConfig): Promise<UserInfo> {
  const response = await fetcher({
    endpoint: Endpoints.USER,
    method: "GET",
    auth,
  });

  const parsed = userInfoSchema.safeParse(response);
  if (!parsed.success) {
    console.error("Failed to parse user info:", parsed.error);
    throw new Error("Failed to parse user info");
  }

  return parsed.data;
}
