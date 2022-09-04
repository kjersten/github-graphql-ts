import {
  format,
  subWeeks,
  getDay,
  previousSunday,
  isSunday,
  getHours,
  eachWeekOfInterval,
  differenceInHours,
  differenceInBusinessDays,
} from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

import { DateRange } from "../types";

const dateFmt = "yyyy-MM-dd";
const timeZone = "America/Los_Angeles"; // "Europe/Berlin" to verify
const startBizHour = 9;
const endBizHour = 17;

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

export function diffInHours(
  laterDateString: string | null,
  earlierDateString: string | null
): number {
  if (!laterDateString || !earlierDateString) {
    return -1;
  }
  const earlierDate = utcToZonedTime(new Date(earlierDateString), timeZone);
  const laterDate = utcToZonedTime(new Date(laterDateString), timeZone);
  return differenceInHours(laterDate, earlierDate);
}

function sameDay(date1: Date, date2: Date): boolean {
  return getDay(date1) === getDay(date2);
}

function isOnBusinessDay(date: Date): boolean {
  const dayOfWeek = getDay(date);
  return dayOfWeek > 0 && dayOfWeek < 6;
}

export function diffInBizHours(
  laterDateString: string | null,
  earlierDateString: string | null
): number {
  if (!laterDateString || !earlierDateString) {
    return -1;
  }
  const earlierDate = utcToZonedTime(new Date(earlierDateString), timeZone);
  const laterDate = utcToZonedTime(new Date(laterDateString), timeZone);
  const startHour = getHours(earlierDate);
  const endHour = getHours(laterDate);
  const startIsBizDay = isOnBusinessDay(earlierDate);
  // start and end within 1 business day
  if (sameDay(earlierDate, laterDate)) {
    const endedBeforeBizDay = endHour <= startBizHour;
    const startedAfterBizDay = startHour >= endBizHour;
    if (!startIsBizDay || endedBeforeBizDay || startedAfterBizDay) {
      return 0;
    }
    return Math.min(endBizHour, endHour) - Math.max(startBizHour, startHour);
  }

  const hoursOfFullBizDays =
    8 * Math.max(differenceInBusinessDays(laterDate, earlierDate) - 1, 0);
  const startBeforeEod = startHour <= endBizHour;
  const endAfterBod = endHour >= startBizHour;
  const hoursFromStartDay =
    startIsBizDay && startBeforeEod ? endBizHour - startHour : 0;
  const hoursFromEndDay =
    isOnBusinessDay(laterDate) && endAfterBod ? endHour - startBizHour : 0;

  return hoursOfFullBizDays + hoursFromStartDay + hoursFromEndDay;
}
