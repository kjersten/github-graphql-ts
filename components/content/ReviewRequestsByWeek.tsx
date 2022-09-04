import { useQuery, gql } from "@apollo/client";
import { Box } from "@chakra-ui/react";

import {
  DateRange,
  Team,
  Pull,
  TeamReviewRequest,
  ReviewRequestedEvent,
  PullRequestReview,
  TeamGroup,
} from "../../types";
import { diffInBizHours, diffInHours } from "../../utilities/date_utils";
import ReviewRequest from "./ReviewRequest";

type Props = {
  org: string | undefined;
  teamFullName: string | undefined;
  week: DateRange;
};

const REVIEW_QUERY = gql`
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

const TEAM_QUERY = gql`
  query Teams($org: String!) {
    organization(login: $org) {
      __typename
      id
      name
      login
      teams(first: 50) {
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
          bizHoursToReview: -1,
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
        console.log(`from ${reviewReq.requestedAt} - ${review.createdAt}`);
        const bizHours = diffInBizHours(
          review.createdAt,
          reviewReq.requestedAt
        );
        console.log(`diff in biz hours is ${bizHours}`);
        reviewReq.reviewedAt = review.createdAt;
        reviewReq.hoursToReview = diffInHours(
          review.createdAt,
          reviewReq.requestedAt
        );
        reviewReq.bizHoursToReview = bizHours;
      }
    }
  });
}

function groupTeamRequests(teams: Team[], teamRequests: TeamReviewRequest[]) {
  const teamGroups: TeamGroup[] = [];
  teams.forEach((team) => {
    const thisTeamReqs = teamRequests.filter((req) => req.teamId === team.id);
    if (thisTeamReqs.length > 0) {
      teamGroups.push({ slug: team.slug, reqs: thisTeamReqs });
    }
  });

  return teamGroups;
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
  const {
    data: reviewData,
    loading: reviewLoading,
    error: reviewError,
  } = useQuery(REVIEW_QUERY, {
    variables: {
      searchQuery: `org:${org} is:pr created:${week.startString}..${week.endString}`,
      pollInterval: 0,
    },
  });
  const {
    data: teamData,
    loading: teamLoading,
    error: teamError,
  } = useQuery(TEAM_QUERY, {
    variables: { org: org },
  });

  if (reviewLoading || teamLoading) {
    return <p>Loading...</p>;
  }

  if (reviewError || teamError) {
    console.error(reviewError);
    console.error(teamError);
    return null;
  }

  const numPrs = reviewData.search.issueCount;
  const prs: Pull[] = reviewData.search.nodes;
  console.log(`loaded batch of PRs at ${new Date().toUTCString()}`);
  const reviewReqs = getTeamReviewRequests(prs);
  const teamGroups = groupTeamRequests(
    teamData.organization.teams.nodes,
    reviewReqs
  );

  function renderTeamGroups(teamGroups: TeamGroup[], prs: Pull[]) {
    const result = teamGroups.map((group: TeamGroup) => {
      return (
        <Box key={`{${group.slug}-group`} paddingBottom={5}>
          {group.slug} - {group.reqs.length} reviews requested
          {renderAuditLog(group.reqs, prs)}
        </Box>
      );
    });

    return result;
  }

  function renderAuditLog(reviewRequests: TeamReviewRequest[], prs: Pull[]) {
    const result = reviewRequests.map((request: TeamReviewRequest) => {
      const pull = prs.find((pr: Pull) => pr.id == request.pullId);
      return (
        <ReviewRequest
          key={`${request.teamId}-${request.pullId}`}
          teamReviewRequest={request}
          pull={pull}
        />
      );
    });

    return result;
  }

  return (
    <>
      <Box paddingBottom={7}>
        {week.startString} - {week.endString}{" "}
        <em>({numPrs} reviews requested total)</em>
      </Box>
      {renderTeamGroups(teamGroups, prs)}
    </>
  );
}

export default ReviewRequestsByWeek;
