import { useQuery, gql } from "@apollo/client";
import { Box } from "@chakra-ui/react";

import PullDetail from "./PullDetail";
import { DateRange, Pull } from "../../types";
import { dateToString } from "../../utilities/date_utils";

type Props = {
  org: string | undefined;
  login: string | undefined;
  week: DateRange;
};

const QUERY = gql`
  query PRs($searchQuery: String!) {
    search(query: $searchQuery, type: ISSUE, last: 100) {
      issueCount
      nodes {
        ... on PullRequest {
          id
          url
          title
          createdAt
          mergedAt
          additions
          deletions
          repository {
            name
          }
          comments(first: 1) {
            totalCount
          }
          timelineItems(first: 1, itemTypes: READY_FOR_REVIEW_EVENT) {
            items: nodes {
              ... on ReadyForReviewEvent {
                type: __typename
                createdAt
              }
            }
          }
        }
      }
    }
  }
`;

function PullsByWeek(props: Props) {
  const { org, login, week } = props;
  const startDate = dateToString(week.start);
  const endDate = dateToString(week.end);

  const { data, loading, error } = useQuery(QUERY, {
    variables: {
      searchQuery: `author:${login} org:${org} is:pr merged:${startDate}..${endDate}`,
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
      {startDate} - {endDate} <em>({numPrs} PRs merged)</em>
      {prs.map((pull: Pull) => (
        <PullDetail key={pull.id} pull={pull} />
      ))}
    </Box>
  );
}

export default PullsByWeek;
