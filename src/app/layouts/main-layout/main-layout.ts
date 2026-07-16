import { Component, afterNextRender, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { AuthStore } from '../../core/auth/auth.store';

/** App shell: top navbar (with auth state) + routed content. */
@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
  private readonly store = inject(AuthStore);

  protected readonly user = this.store.user;
  protected readonly isAuthenticated = this.store.isAuthenticated;

  constructor() {
    // Browser-only: session restore can hit the network (token refresh),
    // same reason Feed/Entity defer their initial load this way.
    afterNextRender(() => this.store.restoreSession());
  }

  protected logout(): void {
    this.store.logout();
  }
}
