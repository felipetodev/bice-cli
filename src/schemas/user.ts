import { z } from "zod/v4";

const clientSchema = z.object({
  nombres: z.string(),
  paterno: z.string().nullable(),
  materno: z.string().nullable(),
  codClasSegmen: z.string().nullable(),
  codSucursal: z.string().nullable(),
  glsClasSegmen: z.string().nullable(),
  glsSucursal: z.string().nullable(),
  idClienteSF: z.string().nullable(),
});

const userSchema = z.object({
  idUsuarioSF: z.string().nullable(),
  materno: z.string().nullable(),
  nombres: z.string(),
  paterno: z.string().nullable(),
  celular: z.string().nullable(),
  telefono: z.string().nullable(),
  email: z.string(),
  cargo: z.string().nullable(),
  tipoContacto: z.string().nullable(),
  cliPer: z.boolean(),
});

const executiveAccountSchema = z.object({
  codEjecutivo: z.string().nullable(),
  glsEjecutivo: z.string().nullable(),
  idSFEjecutivo: z.string().nullable(),
  rolEjecutivo: z.string().nullable(),
});

export const userInfoSchema = z.object({
  sub: z.string(),
  mascara: z.string(),
  mascara_timestamp: z.number(),
  preferred_username: z.string(),
  given_name: z.string(),
  family_name: z.string(),
  name: z.string(),
  email_verified: z.boolean(),
  cliente: clientSchema,
  usuario: userSchema,
  ejecutivoCuenta: executiveAccountSchema,
  delegados: z.array(z.unknown()),
});

export type Client = z.infer<typeof clientSchema>;
export type User = z.infer<typeof userSchema>;
export type ExecutiveAccount = z.infer<typeof executiveAccountSchema>;
export type UserInfo = z.infer<typeof userInfoSchema>;
