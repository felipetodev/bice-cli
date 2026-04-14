import { baseHeaders } from "../../constants";
import type { BffAuthConfig } from "../../services/http/types";

export function buildCookieHeader({
  idSesionPersonas,
  bicePersonaCsrf,
  bicePersonaAt,
}: Pick<
  BffAuthConfig,
  "idSesionPersonas" | "bicePersonaCsrf" | "bicePersonaAt"
>): string {
  return `idSesionPersonas=${idSesionPersonas}; bice-persona-csrf=${bicePersonaCsrf}; bice-persona-at=${bicePersonaAt}`;
}

export function buildHeaders(
  auth: BffAuthConfig,
  credentials = false,
  extraHeaders?: HeadersInit,
): HeadersInit {
  return {
    ...baseHeaders,
    cookie: buildCookieHeader(auth),
    ...(credentials
      ? {
          "x-bice-persona-csrf": auth.xBicePersonaCsrf,
          "x-rut-cliente": auth.biceUserId.padStart(10, "0"),
        }
      : {}),
    ...extraHeaders,
  };
}
