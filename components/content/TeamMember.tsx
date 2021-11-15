import { Heading, Box } from "@chakra-ui/react";

import WeeklyPulls from "./WeeklyPulls";
import { parseWeeks } from "../../utilities/date_utils";
import { DateRange } from "../../types";

type Props = {
  org: string | undefined;
  login: string | undefined;
  name: string | undefined;
  dateRange: DateRange;
};

function TeamMember(props: Props) {
  const { org, login, name, dateRange } = props;
  const weeks = parseWeeks(dateRange);

  return (
    <Box paddingBottom={5}>
      <Heading as="h2" size="sm">
        {name} <em>({login})</em>
      </Heading>
      {weeks.map((week: DateRange) => (
        <WeeklyPulls
          key={week.start.toString()}
          org={org}
          login={login}
          week={week}
        />
      ))}
    </Box>
  );
}

export default TeamMember;
