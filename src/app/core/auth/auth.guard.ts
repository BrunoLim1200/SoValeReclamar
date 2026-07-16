import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthStore } from './auth.store';

/**
 * Blocks a route unless the user is authenticated, redirecting to login with
 * a returnUrl otherwise. Not yet attached to any route — no write-action
 * page (create-complaint) exists yet — but ready for when one lands.
 *
 * Known gap: this checks `isAuthenticated()` synchronously, so a direct
 * navigation to a guarded route before `restoreSession()` (kicked off from
 * MainLayout) resolves will incorrectly redirect to login even for an
 * already-logged-in user. Revisit (e.g. await `initializing()`) once this is
 * actually wired to a route.
 */
export const authGuard: CanActivateFn = (_route, state) => {
  const store = inject(AuthStore);
  const router = inject(Router);
  if (store.isAuthenticated()) {
    return true;
  }
  return router.createUrlTree(['/auth/login'], { queryParams: { returnUrl: state.url } });
};
