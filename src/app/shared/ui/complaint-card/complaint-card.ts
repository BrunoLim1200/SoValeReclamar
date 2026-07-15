import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';

import { FeedItem } from '../../../core/models';

/**
 * Dumb card that renders a single feed complaint. Presentation only — no data
 * fetching, no engagement actions (corroborate lands with auth, phase 2).
 */
@Component({
  selector: 'app-complaint-card',
  imports: [DatePipe],
  templateUrl: './complaint-card.html',
  styleUrl: './complaint-card.scss',
})
export class ComplaintCard {
  readonly item = input.required<FeedItem>();
}
