/** Feed types mirrored from openapi.yaml. */
import { Author } from './common';

/** A complaint in the global ranked feed (carries its entity). */
export interface FeedItem {
  id: string;
  title: string;
  content: string;
  mediaUrl: string | null;
  corroborationCount: number;
  createdAt: string;
  author: Author;
  entity: {
    id: string;
    name: string;
  };
}

/** Pagination metadata for the feed. */
export interface FeedMetadata {
  currentPage: number;
  hasMore: boolean;
  nextPage: number | null;
}

/** Response of GET /feed. */
export interface FeedResponse {
  data: FeedItem[];
  metadata: FeedMetadata;
}
