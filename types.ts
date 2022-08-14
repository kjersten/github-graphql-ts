export interface DateRange {
  start: Date;
  end: Date;
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

export interface PullWithReviewStats extends Pull {
  reviewedAt: string | null;
  readyAt: string;
  hoursToReview: number;
  bizDaysToMerge: number;
}

export interface Actor {
  login: string;
}

export interface Team {
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
  type: string;
  createdAt: string;
}

export interface ReviewRequestedEvent {
  type: string;
  createdAt: string;
  requestedReviewer: {
    type: string;
    slug: string | null;
    combinedSlug: string | null;
  };
}
