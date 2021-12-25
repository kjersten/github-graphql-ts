export interface DateRange {
  start: Date;
  end: Date;
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
  timelineItems: TimelineItems;
}
