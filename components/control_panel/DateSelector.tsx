import { Input } from "@chakra-ui/input";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { DateRange } from "../../types";
import { getDefaultDateRange } from "../../utilities/date_utils";
import "react-datepicker/dist/react-datepicker.css";
import { isWeekend } from "date-fns";

type Dates = Date | [Date | null, Date | null] | /* for selectsRange */ null;
type Props = {
  setDateRange: Function;
};

const DateSelector = (props: Props) => {
  const { setDateRange } = props;
  const defaultDates = getDefaultDateRange();
  const customInput = <Input />;
  const [startDate, setStartDate] = useState<Date | null>(defaultDates.start);
  const [endDate, setEndDate] = useState<Date | null>(defaultDates.end);

  const onChange = (dates: Dates): void => {
    if (Array.isArray(dates)) {
      setStartDate(dates[0]);
      setEndDate(dates[1]);
      if (dates[0] !== null && dates[1] !== null) {
        setDateRange({ start: dates[0], end: dates[1] });
      }
    }
  };

  return (
    <DatePicker
      selected={endDate}
      onChange={onChange}
      startDate={startDate}
      endDate={endDate}
      customInput={customInput}
      filterDate={(date: Date) => isWeekend(date)}
      selectsRange
    />
  );
};

export default DateSelector;
