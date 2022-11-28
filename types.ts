export interface DateRange {
  startString: string;
  endString: string;
}

export interface Pull {
  id: string;
  author: Actor;
  title: string;
  url: string;
  createdAt: string;
  mergedAt: string;
  additions: number;
  deletions: number;
  repository: Repository;
  readyForReview: {
    nodes: ReadyForReviewEvent[];
  };
  reviewThreads: {
    totalCount: number;
    nodes: PullRequestReviewThread[] | null;
  } | null;
  reviews: {
    nodes: PullRequestReview[];
  } | null;
  reviewRequestedEvents: {
    nodes: ReviewRequestedEvent[];
  } | null;
}

export interface Actor {
  login: string;
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  combinedSlug: string;
}

export interface Repository {
  name: string;
}

export interface PullRequestReview {
  author: Actor;
  createdAt: string;
  onBehalfOf: {
    nodes: Team[];
  };
}

export interface PullRequestReviewThread {
  comments: {
    totalCount: number;
    nodes: PullRequestReviewComment[];
  };
}

export interface PullRequestReviewComment {
  author: Actor;
}

export interface ReadyForReviewEvent {
  __typename: string;
  createdAt: string;
}

export interface ReviewRequestedEvent {
  __typename: string;
  createdAt: string;
  requestedReviewer: {
    __typename: string | null;
    id: string | null;
    slug: string | null;
    combinedSlug: string | null;
  };
}

export interface TeamReviewRequest {
  pullId: string;
  teamId: string;
  teamSlug: string | null;
  url: string | null;
  requestedAt: string;
  reviewedAt: string | null;
  hoursToReview: number;
  bizHoursToReview: number;
}

export interface TeamGroup {
  slug: string;
  reqs: TeamReviewRequest[];
  notReviewed: number | null;
  avgHoursToReview: number | null;
  avgBizHoursToReview: number | null;
}
