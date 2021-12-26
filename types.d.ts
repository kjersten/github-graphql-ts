export interface DateRange {
  start: Date;
  end: Date;
  startString: string;
  endString: string;
}

export interface Pull {
  id: string;
  title: string;
  url: string;
  createdAt: string;
  mergedAt: string;
  additions: number;
  deletions: number;
  repository: Repository;
  comments: Comments;
  reviewThreads: ReviewThreads;
  timelineItems: TimelineItems;
}
