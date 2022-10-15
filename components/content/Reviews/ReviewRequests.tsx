import { useQuery, gql } from "@apollo/client";
import { Alert, Box, Spinner, Stack } from "@chakra-ui/react";
import { useEffect } from "react";

import {
  DateRange,
  Team,
  Pull,
  TeamReviewRequest,
  ReviewRequestedEvent,
  PullRequestReview,
  TeamGroup,
} from "../../../types";
import {
  diffInBizHours,
  diffInHours,
  twoDecimals,
} from "../../../utilities/date_utils";
import ReviewRequestSummary from "./ReviewRequestSummary";
import ReviewRequestTeamGroup from "./ReviewRequestTeamGroup";
import DownloadAuditLog from "./DownloadAuditLog";

type Props = {
  org: string | undefined;
  teamFullName: string | undefined;
  dateRange: DateRange;
};

const REVIEW_QUERY = gql`
  query allPrsForTimerange($searchQuery: String!, $after: String) {
    search(query: $searchQuery, type: ISSUE, first: 45, after: $after) {
      issueCount
      pageInfo {
        endCursor
        hasNextPage
      }
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
  prUrl: string,
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
          url: prUrl,
          teamSlug: request.requestedReviewer.slug,
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
        const bizHours = diffInBizHours(
          review.createdAt,
          reviewReq.requestedAt
        );
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
      teamGroups.push({
        slug: team.slug,
        reqs: thisTeamReqs,
        notReviewed: null,
        avgHoursToReview: null,
        avgBizHoursToReview: null,
      });
    }
  });

  return teamGroups;
}

function calculateStats(teamGroups: TeamGroup[]) {
  let totalNotReviewed = 0;
  const hoursArray: number[] = [];
  const bizHoursArray: number[] = [];
  const reviewAudit: TeamReviewRequest[] = [];
  teamGroups.forEach((team) => {
    let numNotReviewed = 0;
    let numReviewed = 0;
    let hours = 0;
    let bizHours = 0;
    team.reqs.forEach((req) => {
      if (req.hoursToReview === -1) {
        numNotReviewed += 1;
        totalNotReviewed += 1;
      } else {
        reviewAudit.push(req);
        numReviewed += 1;
        hours += req.hoursToReview;
        bizHours += req.bizHoursToReview;
        hoursArray.push(req.hoursToReview);
        bizHoursArray.push(req.bizHoursToReview);
      }
    });
    team.notReviewed = numNotReviewed;
    if (numReviewed > 0) {
      team.avgHoursToReview = twoDecimals(hours / numReviewed);
      team.avgBizHoursToReview = twoDecimals(bizHours / numReviewed);
    }
  });
  hoursArray.sort((a, b) => a - b);
  bizHoursArray.sort((a, b) => a - b);
  const hoursToReview50 = hoursArray[Math.floor(hoursArray.length * 0.5) - 1];
  const bizHoursToReview50 =
    bizHoursArray[Math.floor(hoursArray.length * 0.5) - 1];
  const hoursToReview75 = hoursArray[Math.floor(hoursArray.length * 0.75) - 1];
  const bizHoursToReview75 =
    bizHoursArray[Math.floor(hoursArray.length * 0.75) - 1];
  const hoursToReview90 = hoursArray[Math.floor(hoursArray.length * 0.9) - 1];
  const bizHoursToReview90 =
    bizHoursArray[Math.floor(hoursArray.length * 0.9) - 1];
  const totalHoursComp = hoursArray.reduce((prev, curr) => prev + curr, 0);
  const totalBizHoursComp = bizHoursArray.reduce(
    (prev, curr) => prev + curr,
    0
  );
  return {
    total: totalNotReviewed + hoursArray.length,
    totalNotReviewed: totalNotReviewed,
    avgHoursToReview: twoDecimals(totalHoursComp / hoursArray.length),
    avgBizHoursToReview: twoDecimals(totalBizHoursComp / hoursArray.length),
    hoursToReview50,
    bizHoursToReview50,
    hoursToReview75,
    bizHoursToReview75,
    hoursToReview90,
    bizHoursToReview90,
    reviewAudit,
  };
}

function getTeamReviewRequests(prs: Pull[]) {
  const teamRequests: TeamReviewRequest[] = [];
  prs.forEach((pr: Pull) => {
    if (pr.reviewRequestedEvents !== null) {
      registerReviewRequests(
        pr.id,
        pr.url,
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

function ReviewRequests(props: Props) {
  const { org, dateRange } = props;
  const {
    data: reviewData,
    loading: reviewLoading,
    error: reviewError,
    fetchMore: fetchMoreReviewRequests,
  } = useQuery(REVIEW_QUERY, {
    variables: {
      searchQuery: `org:${org} is:pr created:${dateRange.startString}..${dateRange.endString}`,
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
  useEffect(() => {
    if (reviewData && fetchMoreReviewRequests) {
      const nextPage = reviewData.search.pageInfo.hasNextPage;
      const endCursor = reviewData.search.pageInfo.endCursor;
      console.log("endcursor", endCursor);

      if (nextPage && endCursor) {
        fetchMoreReviewRequests({ variables: { after: endCursor } });
      }
    }
  }, [reviewData, fetchMoreReviewRequests]);

  if (reviewLoading || teamLoading) {
    return <p>Loading initial set of data...</p>;
  }

  const hasNextPage = reviewData.search.pageInfo.hasNextPage;
  const prs: Pull[] = reviewData.search.nodes;
  const reviewReqs = getTeamReviewRequests(prs);
  const totalPrs = reviewData.search.issueCount;
  console.log(
    `loaded ${prs.length} batch of PRs at ${new Date().toUTCString()}`
  );
  console.log(`has next page? ${hasNextPage}`);

  if (hasNextPage) {
    return (
      <Alert status="info">
        <Stack direction="row" spacing={4}>
          <Spinner speed="1.5s" />
          <Box>
            Loading PRs for this time period... {prs?.length} of {totalPrs}
          </Box>
        </Stack>
      </Alert>
    );
  }

  if (reviewError || teamError) {
    console.error(reviewError);
    console.error(teamError);
    return null;
  }

  const teamGroups = groupTeamRequests(
    teamData.organization.teams.nodes,
    reviewReqs
  );
  const overallStats = calculateStats(teamGroups);
  const reviewAudit = overallStats.reviewAudit;
  const auditFileName = `reviewRequests ${dateRange.startString} - ${dateRange.endString}.csv`;

  function renderTeamGroups(teamGroups: TeamGroup[], prs: Pull[]) {
    const result = teamGroups.map((group: TeamGroup) => {
      return (
        <ReviewRequestTeamGroup
          prs={prs}
          group={group}
          key={group.slug + "-group"}
        />
      );
    });

    return result;
  }

  return (
    <>
      <DownloadAuditLog
        auditFileName={auditFileName}
        reviewAudit={reviewAudit}
      />
      <ReviewRequestSummary
        stats={overallStats}
        prsForTimePeriod={totalPrs}
        prsFetched={prs.length}
      />
      {renderTeamGroups(teamGroups, prs)}
    </>
  );
}

export default ReviewRequests;
