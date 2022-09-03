import { useQuery, gql } from "@apollo/client";
import {
  Box,
  Flex,
  Link,
  Spacer,
  Tooltip,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  Wrap,
  TagRightIcon,
} from "@chakra-ui/react";
import {
  FaBan,
  FaRegComments,
  FaCalendarCheck,
  FaMinusCircle,
  FaPlusCircle,
  FaRegClock,
} from "react-icons/fa";
import { differenceInBusinessDays } from "date-fns";

import {
  DateRange,
  Pull,
  TeamReviewRequest,
  ReviewRequestedEvent,
  PullRequestReview,
} from "../../types";
import { diffInHours } from "../../utilities/date_utils";
import ReviewRequest from "./ReviewRequest";

type Props = {
  org: string | undefined;
  teamFullName: string | undefined;
  week: DateRange;
};

const QUERY = gql`
  query reviewRequests($searchQuery: String!) {
    search(query: $searchQuery, type: ISSUE, last: 100) {
      issueCount
      nodes {
        ... on PullRequest {
          __typename
          id
          url
          title
          author {
            __typename
            login
          }
          createdAt
          mergedAt
          additions
          deletions
          repository {
            __typename
            id
            name
          }
          reviewRequestedEvents: timelineItems(
            first: 10
            itemTypes: REVIEW_REQUESTED_EVENT
          ) {
            nodes {
              ... on ReviewRequestedEvent {
                __typename
                id
                createdAt
                requestedReviewer {
                  ... on Team {
                    __typename
                    id
                    slug
                    combinedSlug
                  }
                }
              }
            }
          }
          reviews(first: 10) {
            nodes {
              ... on PullRequestReview {
                __typename
                id
                createdAt
                author {
                  login
                }
                onBehalfOf(first: 1) {
                  nodes {
                    __typename
                    id
                    name
                    slug
                    combinedSlug
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

function registerReviewRequests(
  prId: string,
  reviewRequests: ReviewRequestedEvent[],
  teamRequests: TeamReviewRequest[]
) {
  reviewRequests.forEach((request: ReviewRequestedEvent) => {
    if (request.requestedReviewer.id !== null) {
      const existingRequest = teamRequests.find(
        (req) =>
          req.pullId === prId && request.requestedReviewer.id === req.teamId
      );
      if (!existingRequest) {
        teamRequests.push({
          pullId: prId,
          teamId: request.requestedReviewer.id,
          requestedAt: request.createdAt,
          reviewedAt: null,
          hoursToReview: -1,
        });
      }
    }
  });
}

function registerReviews(
  prId: string,
  reviews: PullRequestReview[],
  teamRequests: TeamReviewRequest[]
) {
  reviews.forEach((review: PullRequestReview) => {
    if (review.onBehalfOf.nodes.length > 0) {
      const reviewReq = teamRequests.find(
        (req) =>
          req.pullId === prId && review.onBehalfOf.nodes[0].id === req.teamId
      );
      if (reviewReq && !reviewReq.reviewedAt) {
        reviewReq.reviewedAt = review.createdAt;
        reviewReq.hoursToReview = diffInHours(
          review.createdAt,
          reviewReq.requestedAt
        );
      }
    }
  });
}

function getTeamReviewRequests(prs: Pull[]) {
  const teamRequests: TeamReviewRequest[] = [];
  prs.forEach((pr: Pull) => {
    if (pr.reviewRequestedEvents !== null) {
      registerReviewRequests(
        pr.id,
        pr.reviewRequestedEvents.nodes,
        teamRequests
      );
    }
    if (pr.reviews !== null) {
      registerReviews(pr.id, pr.reviews.nodes, teamRequests);
    }
  });
  return teamRequests;
}

function ReviewRequestsByWeek(props: Props) {
  const { org, week } = props;
  const { data, loading, error } = useQuery(QUERY, {
    variables: {
      searchQuery: `org:${org} is:pr created:${week.startString}..${week.endString}`,
      pollInterval: 0,
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
  const prs: Pull[] = data.search.nodes;
  console.log(`loaded batch of PRs at ${new Date().toUTCString()}`);
  const reviewReqs = getTeamReviewRequests(prs);

  return (
    <Box>
      {week.startString} - {week.endString}{" "}
      <em>({numPrs} reviews requested)</em>
      {reviewReqs.map((revReq: TeamReviewRequest) => (
        <ReviewRequest
          teamReviewRequest={revReq}
          pull={prs.find((pr: Pull) => pr.id === revReq.pullId)}
          key={`${revReq.pullId}-${revReq.teamId}`}
        />
      ))}
    </Box>
  );
}

export default ReviewRequestsByWeek;
