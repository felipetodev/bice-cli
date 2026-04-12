export const CONFIG_FILENAME = ".bice-config.json";
export const CONFIG_CHECKING_ACCOUNT_FILENAME = ".bice-checking-account.json";

// user config
export const RUT = Bun.env.BICE_RUT;
export const PASSWORD = Bun.env.BICE_PASSWORD;

// bice portal url
export const PORTAL_URL = "https://portalpersonas.bice.cl" as const;

// bff endpoints
export const BFF_URL = "https://gw.bice.cl" as const;
export enum Endpoints {
  USER = "oauth-agent-personas/userInfo",
  PRODUCTS = "portalpersonas/bff-portal-hbp/v1/products",
  BALANCE = "portalpersonas/bff-checking-account-transactions-100/v1/balance",
  TRANSACTIONS = "portalpersonas/bff-checking-account-transactions-100/v1/transactions",
  MOVEMENTS = "portalpersonas/bff-historic-account-movements-portal/v1/movements",
}

export const baseHeaders = {
  accept: "application/json, text/plain, */*",
  "accept-language": "es,en;q=0.9",
  "cache-control": "no-cache",
  "content-type": "application/json",
  origin: PORTAL_URL,
  pragma: "no-cache",
  priority: "u=1, i",
  referer: PORTAL_URL + "/",
  "sec-ch-ua":
    '"Chromium";v="146", "Not-A.Brand";v="24", "Google Chrome";v="146"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"macOS"',
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-site",
  "user-agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36",
};
