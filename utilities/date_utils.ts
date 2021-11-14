import { format, subWeeks, previousSunday, isSunday } from "date-fns";

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
