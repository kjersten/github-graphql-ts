import {
  diffInBizHours,
  diffInHours,
  twoDecimals,
} from "../../../utilities/date_utils";
import {
  Team,
  Pull,
  TeamReviewRequest,
  ReviewRequestedEvent,
  PullRequestReview,
  TeamGroup,
} from "../../../types";

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

export function groupTeamRequests(
  teams: Team[],
  teamRequests: TeamReviewRequest[]
) {
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

export function calculateStats(teamGroups: TeamGroup[]) {
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

export function getTeamReviewRequests(prs: Pull[]) {
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
