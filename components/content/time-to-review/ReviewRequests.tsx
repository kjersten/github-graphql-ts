import { useQuery } from "@apollo/client";
import { useEffect } from "react";

import ReviewRequestSummary from "./ReviewRequestSummary";
import ReviewRequestTeamGroup from "./ReviewRequestTeamGroup";
import DownloadAuditLog from "./DownloadAuditLog";
import LoadingProgress from "./LoadingProgess";
import {
  TEAM_QUERY,
  REVIEWS_FOR_PULLS_WITHIN_DATES_QUERY,
} from "../../../queries/queries";
import { DateRange, Pull, TeamGroup } from "../../../types";
import {
  groupTeamRequests,
  calculateStats,
  getTeamReviewRequests,
} from "./utils";

type Props = {
  org: string | undefined;
  dateRange: DateRange;
};

export default function ReviewRequests(props: Props) {
  const { org, dateRange } = props;
  const {
    data: reviewData,
    loading: reviewLoading,
    error: reviewError,
    fetchMore: fetchMoreReviewRequests,
  } = useQuery(REVIEWS_FOR_PULLS_WITHIN_DATES_QUERY, {
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

      if (nextPage && endCursor) {
        fetchMoreReviewRequests({ variables: { after: endCursor } });
      }
    }
  }, [reviewData, fetchMoreReviewRequests]);

  if (!org) {
    return null;
  }

  if (reviewLoading || teamLoading) {
    return <p>Loading initial set of data...</p>;
  }

  const hasNextPage = reviewData.search.pageInfo.hasNextPage;
  const prs: Pull[] = reviewData.search.nodes;
  const reviewReqs = getTeamReviewRequests(prs);
  const totalPrs = reviewData.search.issueCount;

  if (hasNextPage) {
    return <LoadingProgress currPrs={prs.length} totalPrs={totalPrs} />;
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
