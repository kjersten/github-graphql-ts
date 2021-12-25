import { parseWeeks } from "../../utilities/date_utils";
import { DateRange } from "../../types";
import PullsByWeek from "./PullsByWeek";

type Props = {
  org: string | undefined;
  login: string | undefined;
  dateRange: DateRange;
};

function PullsForRange(props: Props) {
  const { org, login, dateRange } = props;
  const weeks = parseWeeks(dateRange);

  return (
    <>
      {weeks.map((week: DateRange) => (
        <PullsByWeek
          key={login + week.start.toString()}
          org={org}
          login={login}
          week={week}
        />
      ))}
    </>
  );
}

export default PullsForRange;
