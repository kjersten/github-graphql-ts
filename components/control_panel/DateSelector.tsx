import { Input } from "@chakra-ui/input";
import DatePicker from "react-datepicker";
import { DateRange } from "../../types";
import "react-datepicker/dist/react-datepicker.css";

type Dates = Date | [Date | null, Date | null] | /* for selectsRange */ null;
type Props = {
  dateRange: DateRange;
  setDateRange: Function;
};

const DateSelector = (props: Props) => {
  const { dateRange, setDateRange } = props;
  const { start, end } = dateRange;
  const customInput = <Input />;

  const onChange = (dates: Dates): void => {
    if (
      Array.isArray(dates) &&
      typeof dates[0] === "object" &&
      typeof dates[1] === "object"
    ) {
      setDateRange({ start: dates[0], end: dates[1] });
    }
  };

  return (
    <DatePicker
      selected={end}
      onChange={onChange}
      startDate={start}
      endDate={end}
      customInput={customInput}
      selectsRange
    />
  );
};

export default DateSelector;
