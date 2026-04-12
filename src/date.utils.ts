import {
  parse,
  startOfMonth,
  endOfMonth,
  previousFriday,
  nextMonday,
  isWeekend,
  format,
} from "date-fns";

export function getMonthDateRange(
  monthName: string,
  year = new Date().getFullYear(),
) {
  const date = parse(monthName, "MMMM", new Date(year, 0, 1));

  let start = startOfMonth(date);
  let end = endOfMonth(date);

  if (isWeekend(start)) start = previousFriday(start);
  if (isWeekend(end)) end = nextMonday(end);

  return {
    startDate: format(start, "yyyyMMdd"),
    endDate: format(end, "yyyyMMdd"),
  };
}
