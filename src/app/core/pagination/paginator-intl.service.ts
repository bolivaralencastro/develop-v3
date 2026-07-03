import { Injectable, OnDestroy } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslocoService } from '@ngneat/transloco';
import { Subscription } from 'rxjs';

@Injectable()
export class PaginatorIntlService extends MatPaginatorIntl implements OnDestroy {
  private subscription: Subscription;

  constructor(private transloco: TranslocoService) {
    super();
    this.translate();
  }

  private translate(): void {
    this.itemsPerPageLabel = this.transloco.translate('paginator.items-per-page');
    this.nextPageLabel = this.transloco.translate('paginator.next-page');
    this.previousPageLabel = this.transloco.translate('paginator.previous-page');
    this.firstPageLabel = this.transloco.translate('paginator.first-page');
    this.lastPageLabel = this.transloco.translate('paginator.last-page');

    this.getRangeLabel = (page, pageSize, length) => {
      if (length === 0 || pageSize === 0) {
        return this.transloco.translate('paginator.range', {
          start: 0,
          end: 0,
          total: length,
        });
      }

      const startIndex = page * pageSize;
      const endIndex = Math.min(startIndex + pageSize, length);

      return this.transloco.translate('paginator.range', {
        start: startIndex + 1,
        end: endIndex,
        total: length,
      });
    };
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
