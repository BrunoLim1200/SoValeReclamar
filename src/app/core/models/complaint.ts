/** Complaint types mirrored from openapi.yaml. */
import { Author } from './common';

/** A complaint as returned by POST /complaints. */
export interface Complaint {
  id: string;
  entityId: string;
  authorId: string;
  title: string;
  content: string;
  mediaUrl: string | null;
  corroborationCount: number;
  createdAt: string;
}

/** A complaint as returned by GET /entities/{id}/complaints. */
export interface ComplaintListItem {
  id: string;
  title: string;
  content: string;
  mediaUrl: string | null;
  corroborationCount: number;
  createdAt: string;
  author: Author;
}

/** Body for POST /complaints. */
export interface CreateComplaintInput {
  entityId: string;
  title: string;
  content: string;
  /** Optional mediaUrl returned by POST /uploads/presigned-url. */
  mediaUrl?: string | null;
}
