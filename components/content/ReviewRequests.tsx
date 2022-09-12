import { useQuery, gql } from "@apollo/client";
import {
  Box,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  AccordionItem,
} from "@chakra-ui/react";
import { useEffect } from "react";

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
  dateRange: DateRange;
};

const REVIEW_QUERY = gql`
  query allPrsForTimerange($searchQuery: String!, $after: String) {
    search(query: $searchQuery, type: ISSUE, first: 50, after: $after) {
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
  let totalReviewed = 0;
  let totalHours = 0;
  let totalBizHours = 0;
  teamGroups.forEach((team) => {
    let numNotReviewed = 0;
    let numReviewed = 0;
    let hours = 0;
    let bizHours = 0;
    team.reqs.forEach((req) => {
      if (req.hoursToReview == -1) {
        numNotReviewed += 1;
        totalNotReviewed += 1;
      } else {
        numReviewed += 1;
        totalReviewed += 1;
        hours += req.hoursToReview;
        totalHours += req.hoursToReview;
        bizHours += req.bizHoursToReview;
        totalBizHours += req.bizHoursToReview;
      }
    });
    team.notReviewed = numNotReviewed;
    if (numReviewed > 0) {
      team.avgHoursToReview = Math.round((hours / numReviewed) * 10) / 10;
      team.avgBizHoursToReview = Math.round((bizHours / numReviewed) * 10) / 10;
    }
  });
  return {
    total: totalNotReviewed + totalReviewed,
    totalNotReviewed: totalNotReviewed,
    avgHoursToReview: Math.round((totalHours / totalReviewed) * 10) / 10,
    avgBizHoursToReview: Math.round((totalBizHours / totalReviewed) * 10) / 10,
  };
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
      const after = reviewData.search.pageInfo.endCursor;
      console.log("endcursor", reviewData.search.pageInfo.endCursor);

      if (nextPage && after !== null) {
        fetchMoreReviewRequests({ variables: { after: after } });
      }
    }
  }, [reviewData, fetchMoreReviewRequests]);

  if (reviewLoading || teamLoading) {
    return <p>Loading...</p>;
  }

  if (reviewError || teamError) {
    console.error(reviewError);
    console.error(teamError);
    return null;
  }

  const hasNextPage = reviewData.search.pageInfo.hasNextPage;
  const prs: Pull[] = reviewData.search.nodes;
  console.log(`loaded batch of PRs at ${new Date().toUTCString()}`);
  console.log(`has next page? ${hasNextPage}`);

  const reviewReqs = getTeamReviewRequests(prs);
  const teamGroups = groupTeamRequests(
    teamData.organization.teams.nodes,
    reviewReqs
  );
  const overallStats = calculateStats(teamGroups);

  function renderSummary(stats: any) {
    return (
      <Box paddingBottom={5}>
        <Heading as="h3" size="lg">
          Overall Stats
        </Heading>
        <StatGroup paddingBottom={3}>
          <Stat>
            <StatLabel>Reviews Requested</StatLabel>
            <StatNumber>{stats.total}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Review Requests Not Done</StatLabel>
            <StatNumber>{stats.totalNotReviewed}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Avg Total Hours</StatLabel>
            <StatNumber>{stats.avgHoursToReview}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Avg Biz Hours to Review</StatLabel>
            <StatNumber>{stats.avgBizHoursToReview}</StatNumber>
          </Stat>
        </StatGroup>
      </Box>
    );
  }

  function renderTeamGroups(teamGroups: TeamGroup[], prs: Pull[]) {
    const result = teamGroups.map((group: TeamGroup) => {
      return (
        <Box key={`{${group.slug}-group`} paddingBottom={5}>
          <Heading as="h3" size="lg">
            {group.slug}
          </Heading>
          <StatGroup paddingBottom={3}>
            <Stat>
              <StatLabel>Requested</StatLabel>
              <StatNumber>{group.reqs.length}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Not Reviewed</StatLabel>
              <StatNumber>{group.notReviewed}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Avg Total Hours</StatLabel>
              <StatNumber>{group.avgHoursToReview}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Avg Biz Hours to Review</StatLabel>
              <StatNumber>{group.avgBizHoursToReview}</StatNumber>
            </Stat>
          </StatGroup>
          <Accordion allowToggle>
            <AccordionItem>
              <AccordionButton>
                PRs
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>{renderAuditLog(group.reqs, prs)}</AccordionPanel>
            </AccordionItem>
          </Accordion>
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
      {renderSummary(overallStats)}
      {renderTeamGroups(teamGroups, prs)}
    </>
  );
}

export default ReviewRequests;
