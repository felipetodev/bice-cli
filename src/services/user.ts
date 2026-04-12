import { baseHeaders, BFF_URL, Endpoints } from "@/constants";
import { UserInfo, userInfoSchema } from "@/schemas/user";
import type { LoginConfig } from "@/schemas/login";

export async function getUserInfo({
  bicePersonaCsrf,
  bicePersonaAt,
  idSesionPersonas,
}: Partial<LoginConfig>): Promise<UserInfo> {
  const response = await fetch(`${BFF_URL}/${Endpoints.USER}`, {
    method: "GET",
    headers: {
      ...baseHeaders,
      cookie: `idSesionPersonas=${idSesionPersonas}; bice-persona-csrf=${bicePersonaCsrf}; bice-persona-at=${bicePersonaAt}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch user info: ${response.status} ${response.statusText}: ${await response.text()}`,
    );
  }

  const parsed = userInfoSchema.safeParse(await response.json());
  if (!parsed.success) {
    console.error("Failed to parse user info:", parsed.error);
    throw new Error("Failed to parse user info");
  }

  return parsed.data;
}
