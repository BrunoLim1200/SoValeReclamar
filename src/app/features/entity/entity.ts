import {
  Component,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  input,
  untracked,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ComplaintCard } from '../../shared/ui/complaint-card/complaint-card';
import { EntityType } from '../../core/models';
import { EntityStore } from './entity.store';

const ENTITY_TYPE_LABELS: Record<EntityType, string> = {
  PLACE: 'Local',
  MOVIE: 'Filme',
  COMPANY: 'Empresa',
  PRODUCT: 'Produto',
};

/**
 * Public entity page: the entity's complaints, most corroborated first.
 * There's no GET /entities/{id} in the API, so `name`/`type` arrive as query
 * params from whichever link sent the user here (feed card, entity search)
 * and are simply absent on a bare/refreshed URL — the complaints list still
 * loads either way, just without the header.
 */
@Component({
  selector: 'app-entity',
  imports: [ComplaintCard, RouterLink],
  templateUrl: './entity.html',
  styleUrl: './entity.scss',
})
export class Entity {
  private readonly store = inject(EntityStore);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly id = input.required<string>();
  readonly name = input<string>();
  readonly type = input<EntityType>();

  protected readonly complaints = this.store.complaints;
  protected readonly loading = this.store.loading;
  protected readonly error = this.store.error;

  protected readonly typeLabel = computed(() => {
    const type = this.type();
    return type ? ENTITY_TYPE_LABELS[type] : null;
  });

  constructor() {
    // Reactively (re)load when the entity id changes — the component is reused
    // across /entities/:id navigations. Registered in the constructor so it's
    // in a valid injection context (nesting effect() inside afterNextRender is
    // not, and throws NG0203). The browser guard keeps the HTTP call off the
    // SSR path, where it would otherwise block the render. load() is called
    // untracked: it reads store.loading() internally, and tracking that here
    // would re-fire the effect on every load completion — an infinite loop.
    effect(() => {
      const id = this.id();
      if (this.isBrowser) {
        untracked(() => this.store.load(id));
      }
    });
  }

  protected retry(): void {
    this.store.load(this.id());
  }
}
