import { z } from "zod/v4";

export const checkingAccountSchema = z.object({
  Cuenta_Corriente: z.array(z.object({ numeroCuenta: z.string() })),
  Cuenta_Retiro_AFP: z.array(z.object({ numeroCuenta: z.string() })),
  Cuenta_Vista: z.array(z.object({ numeroCuenta: z.string() })),
});

export const productsSchema = z.object({
  cuenta_corriente: z.string(),
  cuenta_retiro_afp: z.string().nullable().default(null),
  cuenta_vista: z.string().nullable().default(null),
});

export type CheckingAccount = z.infer<typeof checkingAccountSchema>;
export type ProductsConfig = z.infer<typeof productsSchema>;
