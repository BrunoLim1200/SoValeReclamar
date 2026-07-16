import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

import { ApiService } from '../../core/http/api.service';
import { ComplaintListItem } from '../../core/models';

interface EntityState {
  complaints: ComplaintListItem[];
  loading: boolean;
  error: string | null;
}

const initialState: EntityState = {
  complaints: [],
  loading: false,
  error: null,
};

/**
 * Complaints filed against a single entity. The API returns the full
 * (max 20) list in one call — no pagination here, unlike the feed.
 */
export const EntityStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, api = inject(ApiService)) => ({
    load(entityId: string): void {
      if (store.loading()) {
        return;
      }
      patchState(store, { loading: true, error: null });
      api.getEntityComplaints(entityId).subscribe({
        next: (complaints) => patchState(store, { complaints, loading: false }),
        error: () =>
          patchState(store, {
            loading: false,
            error: 'Não foi possível carregar as reclamações. Tente novamente.',
          }),
      });
    },
  })),
);
