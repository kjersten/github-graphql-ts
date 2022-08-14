import { useQuery, gql } from "@apollo/client";
import { Box } from "@chakra-ui/react";

import { DateRange, Pull } from "../../types";
import PullDetailComments from "./PullDetailComments";

type Props = {
  org: string | undefined;
  login: string | undefined;
  week: DateRange;
};

const QUERY = gql`
  query comments($searchQuery: String!) {
    search(query: $searchQuery, type: ISSUE, last: 100) {
      issueCount
      nodes {
        ... on PullRequest {
          id
          url
          title
          author {
            login
          }
          createdAt
          mergedAt
          additions
          deletions
          repository {
            name
          }
          reviewThreads(last: 20) {
            totalCount
            nodes {
              ... on PullRequestReviewThread {
                comments(last: 20) {
                  totalCount
                  nodes {
                    ... on PullRequestReviewComment {
                      author {
                        login
                      }
                    }
                  }
                }
              }
            }
          }
          readyForReview: timelineItems(
            first: 1
            itemTypes: READY_FOR_REVIEW_EVENT
          ) {
            nodes {
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

// TODO: consider adding the following:
// * the reviewer's latest review status (comment, approved, etc)
// * filtering comments by date range (we may double count for long-running PRs)

function CommentsByWeek(props: Props) {
  const { org, login, week } = props;
  const { data, loading, error } = useQuery(QUERY, {
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
        <PullDetailComments key={pull.id} pull={pull} reviewer={login} />
      ))}
    </Box>
  );
}

export default CommentsByWeek;
