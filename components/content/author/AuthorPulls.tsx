import { useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import { Box, Heading } from "@chakra-ui/react";

import type { RootState } from "../../../rstore/store";
import { getWeeksOfPastSixMonths } from "../../../utilities/date-utils";
import { CHECK_USER } from "../../../queries/queries";
import BadParams from "./BadParams";
import { DateRange } from "../../../types";
import PullsByWeek from "../shared/PullsByWeek";

type Props = {
  slug: string | undefined;
};

export default function AuthorPulls(props: Props) {
  const { slug } = props;
  const org = useSelector((state: RootState) => state.team.org);
  const weeks: Array<DateRange> = getWeeksOfPastSixMonths();
  const { data, loading, error } = useQuery(CHECK_USER, {
    variables: { login: slug },
  });

  if (!org) {
    return <BadParams />;
  }

  if (error) {
    console.error(error);
    return <BadParams />;
  }

  if (loading) {
    return <Box>Loading...</Box>;
  }

  const user = data.user;

  return (
    <Box>
      <Heading as="h1" size="lg" pb={5} pt={5}>
        {user.name} <em>({user.login})</em>
      </Heading>
      {weeks.map((week: DateRange) => (
        <Box pb={3} key={week.startString + "_pulls"}>
          <PullsByWeek org={org} login={user.login} week={week} />
        </Box>
      ))}
    </Box>
  );
}
