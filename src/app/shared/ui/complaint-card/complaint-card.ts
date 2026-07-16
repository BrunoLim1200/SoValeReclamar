import { DatePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ComplaintListItem, FeedItem } from '../../../core/models';

/**
 * Dumb card that renders a single complaint. Presentation only — no data
 * fetching, no engagement actions (corroborate lands with auth, phase 2).
 * Accepts either a feed item (carries its entity) or an entity-page item
 * (no entity — already on that entity's page); the entity badge only
 * renders when the item has one.
 */
@Component({
  selector: 'app-complaint-card',
  imports: [DatePipe, RouterLink],
  templateUrl: './complaint-card.html',
  styleUrl: './complaint-card.scss',
})
export class ComplaintCard {
  readonly item = input.required<FeedItem | ComplaintListItem>();

  protected readonly entity = computed(() => {
    const item = this.item();
    return 'entity' in item ? item.entity : null;
  });
}
