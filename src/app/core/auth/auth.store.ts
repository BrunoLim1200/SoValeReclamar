import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

import { CognitoService } from './cognito.service';
import { mapCognitoError } from './cognito-error';
import { AuthUser } from './models';

interface AuthState {
  user: AuthUser | null;
  /** True until the browser-only session-restore check completes. */
  initializing: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  initializing: true,
  loading: false,
  error: null,
};

/**
 * Session state for the whole app. Methods return a success boolean instead
 * of throwing — components check it (and `error()`) to decide what to do
 * next, same pattern as FeedStore/EntityStore.
 */
export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ user }) => ({
    isAuthenticated: computed(() => user() !== null),
  })),
  withMethods((store, cognito = inject(CognitoService)) => ({
    /** Clears transient form feedback. The store is a root singleton, so each
     * auth page calls this on entry to avoid showing another page's leftover
     * error/loading state. */
    resetFeedback(): void {
      patchState(store, { loading: false, error: null });
    },

    async restoreSession(): Promise<void> {
      const user = await cognito.restoreSession();
      patchState(store, { user, initializing: false });
    },

    async register(username: string, email: string, password: string): Promise<boolean> {
      patchState(store, { loading: true, error: null });
      try {
        await cognito.register(username, email, password);
        patchState(store, { loading: false });
        return true;
      } catch (err) {
        patchState(store, { loading: false, error: mapCognitoError(err) });
        return false;
      }
    },

    async confirmRegistration(username: string, code: string): Promise<boolean> {
      patchState(store, { loading: true, error: null });
      try {
        await cognito.confirmRegistration(username, code);
        patchState(store, { loading: false });
        return true;
      } catch (err) {
        patchState(store, { loading: false, error: mapCognitoError(err) });
        return false;
      }
    },

    async login(username: string, password: string): Promise<boolean> {
      patchState(store, { loading: true, error: null });
      try {
        const user = await cognito.login(username, password);
        patchState(store, { user, loading: false });
        return true;
      } catch (err) {
        patchState(store, { loading: false, error: mapCognitoError(err) });
        return false;
      }
    },

    logout(): void {
      cognito.logout();
      patchState(store, { user: null });
    },

    async requestPasswordReset(username: string): Promise<boolean> {
      patchState(store, { loading: true, error: null });
      try {
        await cognito.requestPasswordReset(username);
        patchState(store, { loading: false });
        return true;
      } catch (err) {
        patchState(store, { loading: false, error: mapCognitoError(err) });
        return false;
      }
    },

    async confirmPasswordReset(
      username: string,
      code: string,
      newPassword: string,
    ): Promise<boolean> {
      patchState(store, { loading: true, error: null });
      try {
        await cognito.confirmPasswordReset(username, code, newPassword);
        patchState(store, { loading: false });
        return true;
      } catch (err) {
        patchState(store, { loading: false, error: mapCognitoError(err) });
        return false;
      }
    },
  })),
);
