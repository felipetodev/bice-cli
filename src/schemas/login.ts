import { z } from "zod/v4";

export const loginSchema = z.object({
  biceUserId: z.string(),
  bicePersonaId: z.string(),
  bicePersonaAuth: z.string(),
  bicePersonaCsrf: z.string(),
  bicePersonaAt: z.string(),
  xBicePersonaCsrf: z.string(),
  idSesionPersonas: z.string(),
});

export type LoginConfig = z.infer<typeof loginSchema>;
