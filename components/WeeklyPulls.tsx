import { useQuery, gql } from "@apollo/client";
import {
  Heading,
  Stack,
  Box,
  HStack,
  VStack,
  FormControl,
  FormLabel,
  Switch,
  Skeleton,
  SkeletonCircle,
} from "@chakra-ui/react";

import PullDetail from "./PullDetail";
import { Week } from "./TeamMembers";

type Props = {
  org: string | undefined;
  login: string | undefined;
  week: Week;
};

type Repository = {
  name: string;
};

type Comments = {
  totalCount: number;
};

type Pull = {
  id: string;
  title: string;
  url: string;
  createdAt: Date;
  mergedAt: Date;
  additions: number;
  deletions: number;
  repository: Repository;
  comments: Comments;
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
            nodes {
              __typename
              ... on ReadyForReviewEvent {
                createdAt
              }
            }
          }
        }
      }
    }
  }
`;

function WeeklyPulls(props: Props) {
  const { org, login, week } = props;

  const { data, loading, error } = useQuery(QUERY, {
    variables: {
      searchQuery: `author:${login} org:${org} is:pr merged:${week.beginDate}..${week.endDate}`,
    },
  });

  // get
  // time to close PR (from non-draft to merge)
  // # of comments on PR
  // also...
  // # of PR reviews
  // # of comments on other people's PRs

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    console.error(error);
    return null;
  }
  console.log(data);
  const numPrs = data.search.issueCount;
  const prs = data.search.nodes;

  return (
    <Box>
      {week.beginDate} - {week.endDate} <em>({numPrs} PRs merged)</em>
      {prs.map((pull: Pull) => (
        <PullDetail key={pull.id} pull={pull} />
      ))}
    </Box>
  );
}

export type { Pull, Comments, Repository };
export default WeeklyPulls;
