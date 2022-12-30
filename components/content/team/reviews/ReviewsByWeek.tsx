import { useQuery } from "@apollo/client";
import { Box } from "@chakra-ui/react";

import { DateRange, Pull } from "../../../../types";
import PullDetailReviews from "./PullDetailReviews";
import { REVIEWS_QUERY } from "../../../../queries/queries";

type Props = {
  org: string | undefined;
  login: string | undefined;
  week: DateRange;
};

// TODO: consider adding the following:
// * the reviewer's latest review status (comment, approved, etc)
// * filtering comments by date range (we may double count for long-running PRs)

export default function ReviewsByWeek(props: Props) {
  const { org, login, week } = props;
  const { data, loading, error } = useQuery(REVIEWS_QUERY, {
    variables: {
      searchQuery: `org:${org} reviewed-by:${login} -author:${login} is:pr updated:${week.startString}..${week.endString}`,
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
      {week.startString} - {week.endString}
      {"  "}
      <em>(reviewed {numPrs} PRs)</em>
      {prs.map((pull: Pull) => (
        <PullDetailReviews key={pull.id} pull={pull} reviewer={login} />
      ))}
    </Box>
  );
}
