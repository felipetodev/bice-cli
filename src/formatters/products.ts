import type { ProductsConfig } from "../schemas/products";

export function formatMaskedProducts(products?: ProductsConfig) {
  if (!products) return null;
  const maskedProducts: Record<string, string> = {};

  for (const [productKey, productValue] of Object.entries(products)) {
    if (!productValue) continue;
    maskedProducts[productKey] = `${productValue.slice(0, -4)}****`;
  }

  return maskedProducts;
}
