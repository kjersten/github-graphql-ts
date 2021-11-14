import { format, subWeeks, previousSunday, isSunday } from "date-fns";

import { DateRange } from "../types";

const dateFmt = "yyyy-MM-dd";

export function getDefaultDateRange(): DateRange {
  const today = new Date();
  let endDateRaw = previousSunday(today);
  if (isSunday(today)) {
    endDateRaw = today;
  }

  const start = format(subWeeks(endDateRaw, 2), dateFmt);
  const end = format(endDateRaw, dateFmt);

  return { start, end };
}
