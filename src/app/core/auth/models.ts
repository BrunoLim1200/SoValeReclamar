/** The signed-in user, as far as the frontend needs to know. */
export interface AuthUser {
  username: string;
  idToken: string;
}
