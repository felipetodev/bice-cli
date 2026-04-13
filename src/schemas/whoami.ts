import { z } from "zod/v4";

const clientSchema = z.object({
  codClasSegmen: z.string(),
  codSucursal: z.string(),
  glsClasSegmen: z.string(),
  glsSucursal: z.string(),
  idClienteSf: z.string(),
  materno: z.string(),
  nombres: z.string(),
  paterno: z.string(),
});

const executiveAccountSchema = z.object({
  codEjecutivo: z.string(),
  glsEjecutivo: z.string(),
  idSfEjecutivo: z.string(),
  rolEjecutivo: z.string(),
});

const userSchema = z.object({
  idUsuarioSf: z.string().nullable(),
  materno: z.string().nullable(),
  nombres: z.string().nullable(),
  paterno: z.string().nullable(),
  celular: z.string(),
  telefono: z.string(),
  email: z.string(),
  cargo: z.string(),
  tipoContacto: z.string().nullable(),
});

export const whoAmISchema = z.object({
  cliente: clientSchema,
  ejecutivoCuenta: executiveAccountSchema,
  usuario: userSchema,
});

export type Client = z.infer<typeof clientSchema>;
export type ExecutiveAccount = z.infer<typeof executiveAccountSchema>;
export type User = z.infer<typeof userSchema>;
export type WhoAmI = z.infer<typeof whoAmISchema>;
