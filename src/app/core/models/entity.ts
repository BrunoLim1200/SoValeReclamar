/** Entity types mirrored from openapi.yaml. */

/** The fixed kind of an entity a complaint is filed against. */
export type EntityType = 'PLACE' | 'MOVIE' | 'COMPANY' | 'PRODUCT';

/** The thing a complaint is filed against. */
export interface Entity {
  id: string;
  type: EntityType;
  name: string;
  /** User id of the creator; null if unknown. */
  createdBy: string | null;
}

/** Trimmed entity shape returned by the fuzzy search endpoint. */
export interface EntitySearchResult {
  id: string;
  name: string;
  type: EntityType;
}

/** Body for POST /entities. */
export interface CreateEntityInput {
  name: string;
  type: EntityType;
}
