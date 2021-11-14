import { Heading, Box } from "@chakra-ui/react";

import WeeklyPulls from "./WeeklyPulls";
import { Week } from "./TeamMembers";

type Props = {
  org: string | undefined;
  login: string | undefined;
  name: string | undefined;
  weeks: Array<Week>;
};

function TeamMember(props: Props) {
  const { org, login, name, weeks } = props;

  return (
    <Box paddingBottom={5}>
      <Heading as="h2" size="sm">
        {name}
      </Heading>
      {weeks.map((week: Week) => (
        <WeeklyPulls key={week.beginDate} org={org} login={login} week={week} />
      ))}
    </Box>
  );
}

export default TeamMember;
