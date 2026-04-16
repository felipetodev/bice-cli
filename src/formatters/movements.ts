import { MONTHS_DICT } from "../constants";
import { Period } from "../schemas/account-periods";

type GetPeriodRangeParams = {
  periods: Period[];
  month?: string;
  year?: string;
};

export function getPeriodRange({ periods, month, year }: GetPeriodRangeParams) {
  const actualMonth = month
    ? MONTHS_DICT[month.toLowerCase() as keyof typeof MONTHS_DICT]
    : String(new Date().getMonth());
  const actualYear = year || String(new Date().getFullYear());

  return periods.find(
    (p) => p.periodNumber === actualMonth && p.year === actualYear,
  );
}
