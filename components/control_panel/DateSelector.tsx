import { Input } from "@chakra-ui/react";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { DateRange } from "../../types";
import {
  getDefaultDateRange,
  dateToString,
  stringToDate,
} from "../../utilities/date_utils";
import "react-datepicker/dist/react-datepicker.css";
import { isSunday } from "date-fns";

type Dates = [Date | null, Date | null];
type Props = {
  dateRange: DateRange;
  setDateRange: Function;
};

export default function DateSelector(props: Props) {
  const { setDateRange } = props;
  const defaultDates = getDefaultDateRange();
  const customInput = <Input />;
  const [startDate, setStartDate] = useState<Date | null>(
    stringToDate(defaultDates.startString)
  );
  const [endDate, setEndDate] = useState<Date | null>(
    stringToDate(defaultDates.endString)
  );

  const onChange = (dates: Dates): void => {
    setStartDate(dates[0]);
    setEndDate(dates[1]);
    if (Array.isArray(dates)) {
      if (dates[0] !== null && dates[1] !== null) {
        setDateRange({
          startString: dateToString(dates[0]),
          endString: dateToString(dates[1]),
        });
      }
    }
  };
  return (
    <DatePicker
      selected={startDate}
      onChange={onChange}
      startDate={startDate}
      endDate={endDate}
      customInput={customInput}
      filterDate={(date: Date) => isSunday(date)}
      selectsRange
    />
  );
}
