/** Shared API types mirrored from openapi.yaml. */

/** Author of a complaint, as returned on list/feed items. */
export interface Author {
  id: string;
  username: string;
}

/** Standard error envelope returned on every 4xx/5xx (message in Portuguese). */
export interface ApiError {
  error: string;
}
