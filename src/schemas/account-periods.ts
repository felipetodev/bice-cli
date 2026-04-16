import { z } from "zod/v4";

export const statusSchema = z.object({
  code: z.string(),
  message: z.string(),
});

export const periodSchema = z.object({
  periodNumber: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  year: z.string(),
  formattedStartDate: z.string(),
  formattedEndDate: z.string(),
});

export const accountSchema = z.object({
  formattedProductNumber: z.string(),
  maskedProductNumber: z.string(),
  productCode: z.string(),
  productName: z.string(),
  productTypeName: z.string(),
  currencyCode: z.string(),
  alias: z.string().nullable(),
  isFavorite: z.boolean(),
  periods: z.array(periodSchema),
});

export const accountHistoricPeriodsDataSchema = z.object({
  accounts: z.array(accountSchema),
});

export const accountHistoricPeriodsResponseSchema = z.object({
  status: statusSchema,
  data: accountHistoricPeriodsDataSchema,
});

export type Status = z.infer<typeof statusSchema>;
export type Period = z.infer<typeof periodSchema>;
export type Account = z.infer<typeof accountSchema>;
export type AccountHistoricPeriodsData = z.infer<
  typeof accountHistoricPeriodsDataSchema
>;
export type AccountHistoricPeriodsResponse = z.infer<
  typeof accountHistoricPeriodsResponseSchema
>;
