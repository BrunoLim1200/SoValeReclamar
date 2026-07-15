import {
  Component,
  DestroyRef,
  afterNextRender,
  inject,
  viewChild,
  ElementRef,
} from '@angular/core';

import { ComplaintCard } from '../../shared/ui/complaint-card/complaint-card';
import { FeedStore } from './feed.store';

@Component({
  selector: 'app-feed',
  imports: [ComplaintCard],
  templateUrl: './feed.html',
  styleUrl: './feed.scss',
})
export class Feed {
  private readonly store = inject(FeedStore);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly items = this.store.items;
  protected readonly loading = this.store.loading;
  protected readonly hasMore = this.store.hasMore;
  protected readonly error = this.store.error;

  private readonly sentinel =
    viewChild<ElementRef<HTMLElement>>('sentinel');

  constructor() {
    // Browser-only: load the first page and wire up infinite scroll. Guarded by
    // afterNextRender so nothing touches IntersectionObserver during SSR.
    afterNextRender(() => {
      this.store.loadNext();

      const el = this.sentinel()?.nativeElement;
      if (!el) {
        return;
      }
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            this.store.loadNext();
          }
        },
        { rootMargin: '400px' },
      );
      observer.observe(el);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  protected retry(): void {
    this.store.loadNext();
  }
}
