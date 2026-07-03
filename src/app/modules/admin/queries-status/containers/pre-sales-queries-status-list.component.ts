import { ChangeDetectionStrategy, Component, Signal, signal } from '@angular/core';
import { PreSalesQueriesStatusListService } from '../services/pre-sales-queries-status-list.service';
import { PreSaleImportHistoryResponseDto, PreSalesFilter } from '../../../pre-sales/models/pre-sales.types';
import { PageMeta } from '@core/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { NgClass } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { PRE_SALE_QUERIES_STATUS_TABLE_COLUMNS, PreSaleQueriesStatusTableComponent } from '../components/pre-sale-queries-status-table.component';
import { PreSalesFilterComponent } from '../../../pre-sales/components/pre-sales-filter.component';
import { Sort } from '@angular/material/sort';
import { PageTitleComponent } from 'app/layout/common/page-title/page-title.component';

@Component({
  selector: 'app-pre-sales-queries-status-list',
  imports: [
    MatPaginator,
    NgClass,
    ReactiveFormsModule,
    TranslocoModule,
    PreSaleQueriesStatusTableComponent,
    PreSalesFilterComponent,
    PageTitleComponent,
  ],
  providers: [PreSalesQueriesStatusListService],
  template: `
    <page-title title="Status das Consultas"></page-title>

    <div class="mx-4 mb-4 flex flex-col bg-card rounded-lg shadow overflow-hidden grow">
      <app-pre-sales-filter
        class="w-full"
        storageKey="pre-sale-queries-status-table-columns"
        [columns]="columnDefs"
        (filterChange)="onFilterChange($event)"
        (visibleColumnsChange)="visibleColumns.set($event)"
      ></app-pre-sales-filter>

      <app-pre-sale-queries-status-table
        [queries]="queries()"
        [isLoading]="isLoading()"
        [visibleColumns]="visibleColumns()"
        (sortChange)="onSortChange($event)"
      ></app-pre-sale-queries-status-table>

      @let pageMeta = pagination();
      <mat-paginator
        class="border-t"
        [ngClass]="{ 'pointer-events-none': isLoading() }"
        [length]="pageMeta?.totalItems"
        [pageIndex]="pageMeta?.currentPage - 1"
        [pageSize]="pageMeta?.itemsPerPage"
        [pageSizeOptions]="[10, 20, 50, 100]"
        [showFirstLastButtons]="true"
        [disabled]="!queries()?.length"
        (page)="onPageChange($event)"
      ></mat-paginator>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      flex: 1;
    }
  `,
})
export class PreSalesQueriesStatusListComponent {
  protected readonly columnDefs = PRE_SALE_QUERIES_STATUS_TABLE_COLUMNS;
  protected readonly visibleColumns = signal<string[]>(PRE_SALE_QUERIES_STATUS_TABLE_COLUMNS.map((c) => c.key));

  protected readonly isLoading: Signal<boolean>;
  protected readonly queries: Signal<PreSaleImportHistoryResponseDto[]>;
  protected readonly pagination: Signal<PageMeta>;

  constructor(private readonly preSalesQueriesStatusListService: PreSalesQueriesStatusListService) {
    this.isLoading = this.preSalesQueriesStatusListService.isLoading;
    this.queries = this.preSalesQueriesStatusListService.queries;
    this.pagination = this.preSalesQueriesStatusListService.pagination;
  }

  onPageChange(event: PageEvent) {
    this.preSalesQueriesStatusListService.setPage(event.pageIndex + 1, event.pageSize);
  }

  onSortChange(event: Sort) {
    this.preSalesQueriesStatusListService.setSort(event.active, event.direction);
  }

  protected onFilterChange(filter: PreSalesFilter) {
    this.preSalesQueriesStatusListService.setFilter(filter);
  }
}
