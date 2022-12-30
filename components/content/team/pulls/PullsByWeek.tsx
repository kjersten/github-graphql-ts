import { useQuery } from "@apollo/client";
import { Box } from "@chakra-ui/react";

import PullDetail from "./PullDetail";
import { PULLS_BY_AUTHOR_QUERY } from "../../../../queries/queries";
import { DateRange, Pull } from "../../../../types";

type Props = {
  org: string | undefined;
  login: string | undefined;
  week: DateRange;
};

export default function PullsByWeek(props: Props) {
  const { org, login, week } = props;

  const { data, loading, error } = useQuery(PULLS_BY_AUTHOR_QUERY, {
    variables: {
      searchQuery: `author:${login} org:${org} is:pr merged:${week.startString}..${week.endString}`,
    },
  });

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    console.error(error);
    return null;
  }

  const numPrs = data.search.issueCount;
  const prs = data.search.nodes;

  return (
    <Box>
      {week.startString} - {week.endString} <em>({numPrs} PRs merged)</em>
      {prs.map((pull: Pull) => (
        <PullDetail key={pull.id} pull={pull} />
      ))}
    </Box>
  );
}
