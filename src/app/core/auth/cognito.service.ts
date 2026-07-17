import { Injectable } from '@angular/core';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';

import { environment } from '../../../environments/environment';
import { AuthUser } from './models';

const USER_POOL_ID_PATTERN = /^[\w-]+_[0-9a-zA-Z]+$/;

/**
 * Thin promisified wrapper around amazon-cognito-identity-js (SRP auth +
 * session/token refresh). Safe to construct during SSR — the SDK falls back
 * to an in-memory store when `window` is absent — but every method here does
 * real (or potentially network) work, so callers only invoke them from user
 * interaction (form submits) or from a browser-only afterNextRender guard,
 * never eagerly during render.
 */
@Injectable({ providedIn: 'root' })
export class CognitoService {
  private readonly pool = USER_POOL_ID_PATTERN.test(environment.cognito.userPoolId)
    ? new CognitoUserPool({
        UserPoolId: environment.cognito.userPoolId,
        ClientId: environment.cognito.clientId,
      })
    : null;

  /** The pool uses email as the sign-in identifier (`UsernameAttributes: email`);
   * the chosen display name travels as `preferred_username`, which the backend's
   * PostConfirmation trigger persists as the domain `username`. */
  register(username: string, email: string, password: string): Promise<void> {
    const pool = this.requirePool();
    const attributes = [
      new CognitoUserAttribute({ Name: 'email', Value: email }),
      new CognitoUserAttribute({ Name: 'preferred_username', Value: username }),
    ];
    return new Promise((resolve, reject) => {
      pool.signUp(email, password, attributes, [], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  confirmRegistration(email: string, code: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.newUser(email).confirmRegistration(code, true, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  login(email: string, password: string): Promise<AuthUser> {
    const user = this.newUser(email);
    const details = new AuthenticationDetails({ Username: email, Password: password });
    return new Promise((resolve, reject) => {
      user.authenticateUser(details, {
        onSuccess: (session) => resolve(this.toAuthUser(session)),
        onFailure: (err) => reject(err),
      });
    });
  }

  logout(): void {
    this.pool?.getCurrentUser()?.signOut();
  }

  /** Restores a persisted session on app load, refreshing it if needed. Resolves null if there's none/it's invalid/Cognito isn't configured. */
  restoreSession(): Promise<AuthUser | null> {
    const user = this.pool?.getCurrentUser();
    if (!user) {
      return Promise.resolve(null);
    }
    return new Promise((resolve) => {
      user.getSession((err: Error | null, session: CognitoUserSession | null) => {
        resolve(err || !session?.isValid() ? null : this.toAuthUser(session));
      });
    });
  }

  /** Current valid id token, refreshing the session first if needed. Null if logged out/unconfigured. */
  getIdToken(): Promise<string | null> {
    const user = this.pool?.getCurrentUser();
    if (!user) {
      return Promise.resolve(null);
    }
    return new Promise((resolve) => {
      user.getSession((err: Error | null, session: CognitoUserSession | null) => {
        resolve(err || !session?.isValid() ? null : session.getIdToken().getJwtToken());
      });
    });
  }

  requestPasswordReset(email: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.newUser(email).forgotPassword({
        onSuccess: () => resolve(),
        onFailure: (err) => reject(err),
      });
    });
  }

  confirmPasswordReset(email: string, code: string, newPassword: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.newUser(email).confirmPassword(code, newPassword, {
        onSuccess: () => resolve(),
        onFailure: (err) => reject(err),
      });
    });
  }

  private requirePool(): CognitoUserPool {
    if (!this.pool) {
      throw { code: 'NotConfigured' };
    }
    return this.pool;
  }

  private newUser(username: string): CognitoUser {
    return new CognitoUser({ Username: username, Pool: this.requirePool() });
  }

  /** Display name comes from the id token: `preferred_username` set at sign-up,
   * falling back to the email for accounts created without one. */
  private toAuthUser(session: CognitoUserSession): AuthUser {
    const idToken = session.getIdToken();
    const payload = idToken.payload as { preferred_username?: string; email?: string };
    return {
      username: payload.preferred_username ?? payload.email ?? '',
      idToken: idToken.getJwtToken(),
    };
  }
}
