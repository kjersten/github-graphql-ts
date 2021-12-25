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
  const startString = dateToString(start);
  const endString = dateToString(end);

  return { start, end, startString, endString };
}

export function parseWeeks(dateRange: DateRange): Array<DateRange> {
  const sundays = eachWeekOfInterval(dateRange);
  return sundays.reduce((acc: Array<DateRange>, curr, currIndex) => {
    if (currIndex !== 0) {
      const start = sundays[currIndex - 1];
      const end = curr;
      acc.push({
        start,
        end,
        startString: dateToString(start),
        endString: dateToString(end),
      });
    }
    return acc;
  }, []);
}

export function dateToString(date: Date): string {
  return format(date, dateFmt);
}
