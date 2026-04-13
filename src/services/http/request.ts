import { BFF_URL, Endpoints } from "@/constants";
import { buildHeaders } from "@/services/http/headers";
import {
  BffErrorCode,
  BffRequestError,
  type BffAuthConfig,
} from "@/services/http/types";

function mapErrorCode(status: number, responseBody: string): BffErrorCode {
  if (responseBody.includes("The Token has expired")) {
    return BffErrorCode.SESSION_EXPIRED;
  }

  if (status === 401 || status === 403) {
    return BffErrorCode.UNAUTHORIZED;
  }

  if (status >= 400 && status < 500) {
    return BffErrorCode.BAD_REQUEST;
  }

  return BffErrorCode.BFF_ERROR;
}

function buildErrorMessage({
  code,
  status,
  statusText,
  endpoint,
  responseBody,
}: {
  code: BffErrorCode;
  status: number;
  statusText: string;
  endpoint: Endpoints;
  responseBody: string;
}): string {
  if (code === BffErrorCode.SESSION_EXPIRED) {
    return "Session expired. Please run 'bice login' again to refresh your session.";
  }

  if (code === BffErrorCode.UNAUTHORIZED) {
    return "Unauthorized request. Please run 'bice login' again.";
  }

  if (code === BffErrorCode.BAD_REQUEST) {
    return `Bad request to '${endpoint}' (${status} ${statusText}). ${responseBody}`;
  }

  return `BFF request failed at '${endpoint}' (${status} ${statusText}). ${responseBody}`;
}

export async function fetcher<T = unknown>({
  endpoint,
  method,
  auth,
  body,
  withCredentials,
}: {
  endpoint: Endpoints;
  method: "GET" | "POST";
  auth: BffAuthConfig;
  body?: unknown;
  withCredentials?: boolean;
}): Promise<T> {
  const response = await fetch(`${BFF_URL}/${endpoint}`, {
    method,
    headers: buildHeaders(auth, withCredentials || method === "POST"),
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    const responseBody = await response.text();
    const code = mapErrorCode(response.status, responseBody);

    throw new BffRequestError({
      message: buildErrorMessage({
        code,
        status: response.status,
        statusText: response.statusText,
        endpoint,
        responseBody,
      }),
      status: response.status,
      statusText: response.statusText,
      endpoint,
      responseBody,
      code,
    });
  }

  return (await response.json()) as T;
}
