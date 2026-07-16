import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { PLATFORM_ID, inject } from '@angular/core';
import { from, switchMap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CognitoService } from '../auth/cognito.service';

/**
 * Attaches the Cognito id token to requests aimed at our API, when a session
 * exists. Browser-only — token lookup can refresh the session over the
 * network, which must never block SSR (see Entity's afterNextRender note).
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!isPlatformBrowser(inject(PLATFORM_ID)) || !req.url.startsWith(environment.apiBaseUrl)) {
    return next(req);
  }
  const cognito = inject(CognitoService);
  return from(cognito.getIdToken()).pipe(
    switchMap((token) =>
      next(token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req),
    ),
  );
};
