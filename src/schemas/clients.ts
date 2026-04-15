import { z } from "zod/v4";

export const clientSummarySchema = z.object({
  ClientId: z.string(),
  LegalId: z.string(),
  FullName: z.string(),
  RiskId: z.number(),
  Amount: z.number(),
  fechaHoy: z.string(),
  fechaHoraHoy: z.string(),
  fechaConsulta: z.string(),
  fechaHoraConsulta: z.string(),
  fechaHoraSistema: z.string(),
});

export type ClientSummary = z.infer<typeof clientSummarySchema>;
