import {
  format,
  subWeeks,
  previousSunday,
  isSunday,
  eachWeekOfInterval,
} from "date-fns";

import { DateRange } from "../types";

const dateFmt = "yyyy-MM-dd";

export function getDefaultDateRange(): DateRange {
  const today = new Date();
  let end = previousSunday(today);
  if (isSunday(today)) {
    end = today;
  }
  const start = subWeeks(end, 2);

  return { start, end };
}

export function parseWeeks(dateRange: DateRange): Array<DateRange> {
  const sundays = eachWeekOfInterval(dateRange);
  return sundays.reduce((acc: Array<DateRange>, curr, currIndex) => {
    if (currIndex !== 0) {
      acc.push({ start: sundays[currIndex - 1], end: curr });
    }
    return acc;
  }, []);
}

export function dateToString(date: Date): string {
  return format(date, dateFmt);
}
