import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

import { ApiService } from '../../core/http/api.service';
import { FeedItem } from '../../core/models';

interface FeedState {
  items: FeedItem[];
  /** Next page to request (1-based); null when there are no more pages. */
  nextPage: number | null;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: FeedState = {
  items: [],
  nextPage: 1,
  hasMore: true,
  loading: false,
  error: null,
};

/**
 * Paginated global feed. `loadNext()` is idempotent while a request is in
 * flight and stops once the API reports no more pages — safe to call repeatedly
 * from an IntersectionObserver.
 */
export const FeedStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, api = inject(ApiService)) => ({
    loadNext(): void {
      const page = store.nextPage();
      if (store.loading() || !store.hasMore() || page === null) {
        return;
      }
      patchState(store, { loading: true, error: null });
      api.getFeed(page).subscribe({
        next: (res) =>
          patchState(store, {
            items: [...store.items(), ...res.data],
            nextPage: res.metadata.nextPage,
            hasMore: res.metadata.hasMore,
            loading: false,
          }),
        error: () =>
          patchState(store, {
            loading: false,
            error: 'Não foi possível carregar o feed. Tente novamente.',
          }),
      });
    },
  })),
);
