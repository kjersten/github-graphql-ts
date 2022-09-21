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
  getMinutes,
} from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

import { DateRange } from "../types";

const DATE_FMT = "yyyy-MM-dd";
const TIME_ZONE = "America/Los_Angeles"; // "Europe/Berlin" to verify
const START_BIZ_HOUR = 9.0;
const END_BIZ_HOUR = 17.0;

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
  return format(date, DATE_FMT);
}

export function diffInHours(
  laterDateString: string | null,
  earlierDateString: string | null
): number {
  if (!laterDateString || !earlierDateString) {
    return -1;
  }
  const earlierDate = utcToZonedTime(new Date(earlierDateString), TIME_ZONE);
  const laterDate = utcToZonedTime(new Date(laterDateString), TIME_ZONE);
  const diffInMinutes = elapsedMinutes(
    getMinutes(earlierDate),
    getMinutes(laterDate)
  );
  const minuteDecimal = twoDecimals(diffInMinutes / 60);
  const diffInHours = differenceInHours(laterDate, earlierDate);
  return diffInHours + minuteDecimal;
}

function elapsedMinutes(earlierMinutes: number, laterMinutes: number): number {
  if (earlierMinutes > laterMinutes) {
    return 60 - earlierMinutes + laterMinutes;
  } else {
    return laterMinutes - earlierMinutes;
  }
}

function sameDay(date1: Date, date2: Date): boolean {
  return getDay(date1) === getDay(date2);
}

function isOnBusinessDay(date: Date): boolean {
  const dayOfWeek = getDay(date);
  return dayOfWeek > 0 && dayOfWeek < 6;
}

function getHourFraction(date: Date): number {
  const hours = getHours(date);
  const minutes = getMinutes(date);
  return hours + minutes / 60;
}

export function twoDecimals(num: number): number {
  return Math.round(num * 100) / 100;
}

export function diffInBizHours(
  laterDateString: string | null,
  earlierDateString: string | null
): number {
  if (!laterDateString || !earlierDateString) {
    return -1;
  }

  const earlierDate = utcToZonedTime(new Date(earlierDateString), TIME_ZONE);
  const laterDate = utcToZonedTime(new Date(laterDateString), TIME_ZONE);
  const startHour = getHourFraction(earlierDate);
  const endHour = getHourFraction(laterDate);
  const startIsBizDay = isOnBusinessDay(earlierDate);

  // start and end within 1 business day
  if (sameDay(earlierDate, laterDate)) {
    const endedBeforeBizDay = endHour <= START_BIZ_HOUR;
    const startedAfterBizDay = startHour >= END_BIZ_HOUR;
    // starts and ends same day outside of business hours
    if (!startIsBizDay || endedBeforeBizDay || startedAfterBizDay) {
      return 0;
    }
    return twoDecimals(
      Math.min(END_BIZ_HOUR, endHour) - Math.max(START_BIZ_HOUR, startHour)
    );
  }

  const hoursOfFullBizDays =
    8 * Math.max(differenceInBusinessDays(laterDate, earlierDate) - 1, 0);
  const startBeforeEod = startHour <= END_BIZ_HOUR;
  const endAfterBod = endHour >= START_BIZ_HOUR;
  const hoursFromStartDay =
    startIsBizDay && startBeforeEod ? END_BIZ_HOUR - startHour : 0;
  const hoursFromEndDay =
    isOnBusinessDay(laterDate) && endAfterBod ? endHour - START_BIZ_HOUR : 0;

  return twoDecimals(hoursOfFullBizDays + hoursFromStartDay + hoursFromEndDay);
}
