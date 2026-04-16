import { z } from "zod/v4";

export const movementsStatusSchema = z.object({
  code: z.string(),
  message: z.string(),
});

export const movementSchema = z.object({
  date: z.string(),
  category: z.string(),
  subCategory: z.string(),
  operationId: z.string(),
  description: z.string(),
  amount: z.string(),
});

export const dailyBalanceSchema = z.object({
  date: z.string(),
  total: z.string(),
  usedOverdraft: z.string(),
});

export const accountInfoSchema = z.object({
  number: z.string(),
  currency: z.string(),
  name: z.string(),
  currencyName: z.string(),
});

export const executiveSchema = z.object({
  name: z.string(),
  email: z.string(),
});

export const bankBranchSchema = z.object({
  name: z.string(),
  address: z.string(),
});

export const totalsSchema = z.object({
  totalCharges: z.string(),
  totalDeposits: z.string(),
  initialBalance: z.string(),
  endingBalance: z.string(),
});

export const overdraftSchema = z.object({
  approved: z.string(),
  available: z.string(),
  used: z.string(),
});

export const movementsDataSchema = z.object({
  account: accountInfoSchema,
  executive: executiveSchema,
  bankBranch: bankBranchSchema,
  totals: totalsSchema,
  overdraft: overdraftSchema,
  movements: z.array(movementSchema),
  dailyBalances: z.array(dailyBalanceSchema),
});

export const movementsResponseSchema = z.object({
  status: movementsStatusSchema,
  data: movementsDataSchema,
});

export type MovementsStatus = z.infer<typeof movementsStatusSchema>;
export type Movement = z.infer<typeof movementSchema>;
export type DailyBalance = z.infer<typeof dailyBalanceSchema>;
export type AccountInfo = z.infer<typeof accountInfoSchema>;
export type Executive = z.infer<typeof executiveSchema>;
export type BankBranch = z.infer<typeof bankBranchSchema>;
export type Totals = z.infer<typeof totalsSchema>;
export type Overdraft = z.infer<typeof overdraftSchema>;
export type MovementsData = z.infer<typeof movementsDataSchema>;
export type MovementsResponse = z.infer<typeof movementsResponseSchema>;
