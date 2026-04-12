import { z } from "zod/v4";

export const productsSchema = z.object({
  cuenta_corriente: z.string(),
  cuenta_retiro_afp: z.string().nullable().default(null),
  cuenta_vista: z.string().nullable().default(null),
});

export type ProductsConfig = z.infer<typeof productsSchema>;
