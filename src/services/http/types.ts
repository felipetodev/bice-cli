import type { LoginConfig } from "@/schemas/login";

export type BffAuthConfig = Pick<
  LoginConfig,
  | "biceUserId"
  | "bicePersonaCsrf"
  | "bicePersonaAt"
  | "idSesionPersonas"
  | "xBicePersonaCsrf"
>;

export enum BffErrorCode {
  SESSION_EXPIRED = "SESSION_EXPIRED",
  UNAUTHORIZED = "UNAUTHORIZED",
  BAD_REQUEST = "BAD_REQUEST",
  BFF_ERROR = "BFF_ERROR",
}

export class BffRequestError extends Error {
  readonly status: number;
  readonly statusText: string;
  readonly endpoint: string;
  readonly responseBody: string;
  readonly code: BffErrorCode;

  constructor({
    message,
    status,
    statusText,
    endpoint,
    responseBody,
    code,
  }: {
    message: string;
    status: number;
    statusText: string;
    endpoint: string;
    responseBody: string;
    code: BffErrorCode;
  }) {
    super(message);
    this.name = "BffRequestError";
    this.status = status;
    this.statusText = statusText;
    this.endpoint = endpoint;
    this.responseBody = responseBody;
    this.code = code;
  }
}
