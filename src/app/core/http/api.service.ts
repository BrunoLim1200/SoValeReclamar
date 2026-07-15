import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ComplaintListItem, EntitySearchResult, FeedResponse } from '../models';

/**
 * Typed client for the Só Vale Reclamar API (see openapi.yaml).
 * The single place that talks HTTP to the backend — components use it via stores.
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  /** GET /feed — global ranked feed, 10 per page. */
  getFeed(page: number): Observable<FeedResponse> {
    return this.http.get<FeedResponse>(`${this.baseUrl}/feed`, {
      params: { page },
    });
  }

  /** GET /entities/search?q= — fuzzy entity search (min 2 chars, max 10 results). */
  searchEntities(q: string): Observable<EntitySearchResult[]> {
    return this.http.get<EntitySearchResult[]>(`${this.baseUrl}/entities/search`, {
      params: { q },
    });
  }

  /** GET /entities/{id}/complaints — top complaints for an entity. */
  getEntityComplaints(entityId: string): Observable<ComplaintListItem[]> {
    return this.http.get<ComplaintListItem[]>(
      `${this.baseUrl}/entities/${entityId}/complaints`,
    );
  }
}
