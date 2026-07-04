import { Component, inject, OnInit, Signal, signal } from '@angular/core';
import { PRE_SALES_TABLE_COLUMNS, PreSalesTableComponent } from '../components/pre-sales-table.component';
import { PRE_SALE_QUERY_TYPE, PreSaleImportHistoryResponseDto, PreSalesFilter } from '../models/pre-sales.types';
import { TranslocoModule } from '@ngneat/transloco';
import { NgClass } from '@angular/common';
import { PreSalesListService } from '../services/pre-sales-list.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { PageMeta } from '@core/http';
import { PreSalesFilterComponent } from '../components/pre-sales-filter.component';
import { Sort } from '@angular/material/sort';
import { PageTitleComponent } from 'app/layout/common/page-title/page-title.component';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { HeaderBatchDialogService } from '@core/services/header-batch-dialog.service';
import { QueryDashboardService } from '../../dashboard/services/query-dashboard.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-batches',
  providers: [PreSalesListService],
  imports: [
    PreSalesTableComponent,
    TranslocoModule,
    MatPaginator,
    NgClass,
    PreSalesFilterComponent,
    PageTitleComponent,
    MatIcon,
    MatIconButton,
    MatTooltip,
  ],
  template: `
    <page-title [title]="pageTitle">
      <button mat-icon-button matTooltip="Nova Consulta" class="ml-auto" (click)="openBatchDialog()">
        <mat-icon [svgIcon]="'heroicons_outline:plus'"></mat-icon>
      </button>
    </page-title>

    <div class="mx-4 mb-4 flex flex-col bg-card rounded-lg shadow overflow-hidden grow">
      <app-pre-sales-filter
        class="w-full"
        [storageKey]="storageKey"
        [columns]="columnDefs"
        [lockedQueryType]="lockedQueryType"
        (filterChange)="onFilterChange($event)"
        (visibleColumnsChange)="visibleColumns.set($event)">
      </app-pre-sales-filter>

      <app-pre-sales-list
        [batches]="batches()"
        [isLoading]="isLoading()"
        [visibleColumns]="visibleColumns()"
        (sortChange)="onSortChange($event)"
        (dashboardClick)="onDashboardClick($event)"
      ></app-pre-sales-list>

      @let pageMeta = pagination();
      <mat-paginator
        class="border-t"
        [ngClass]="{ 'pointer-events-none': isLoading() }"
        [length]="pageMeta?.totalItems"
        [pageIndex]="pageMeta?.currentPage - 1"
        [pageSize]="pageMeta?.itemsPerPage"
        [pageSizeOptions]="[10, 20, 50, 100]"
        [showFirstLastButtons]="true"
        [disabled]="!batches()?.length"
        (page)="onPageChange($event)"
      ></mat-paginator>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      flex: 1;
    }
  `,
})
export class PreSalesListComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);

  protected readonly columnDefs = PRE_SALES_TABLE_COLUMNS;
  protected readonly visibleColumns = signal<string[]>(PRE_SALES_TABLE_COLUMNS.map(c => c.key));
  protected pageTitle = 'Consultas';
  protected storageKey = 'pre-sales-table-columns';
  protected lockedQueryType: PRE_SALE_QUERY_TYPE | null = null;

  protected readonly isLoading: Signal<boolean>;
  protected readonly batches: Signal<PreSaleImportHistoryResponseDto[]>;
  protected readonly pagination: Signal<PageMeta>;

  private readonly headerBatchDialogService = inject(HeaderBatchDialogService);
  private readonly preSalesListService = inject(PreSalesListService);
  private readonly queryDashboardService = inject(QueryDashboardService);

  constructor() {
    this.batches = this.preSalesListService.batches;
    this.isLoading = this.preSalesListService.isLoading;
    this.pagination = this.preSalesListService.pagination;
  }

  ngOnInit() {
    this.pageTitle = this.route.snapshot.data['title'] ?? 'Consultas';
    this.storageKey = this.route.snapshot.data['storageKey'] ?? 'pre-sales-table-columns';
    this.lockedQueryType = this.route.snapshot.data['lockedQueryType'] ?? null;

    if (this.lockedQueryType) {
      this.preSalesListService.setFilter({ queryType: [this.lockedQueryType] });
    }
  }

  onPageChange(event: PageEvent) {
    this.preSalesListService.setPage(event.pageIndex + 1, event.pageSize);
  }

  onSortChange(event: Sort) {
    this.preSalesListService.setSort(event.active, event.direction);
  }

  openBatchDialog() {
    this.headerBatchDialogService.open();
  }

  onDashboardClick(batchId: string) {
    const ids = this.batches().map((b) => b.id);
    const index = ids.indexOf(batchId);

    this.queryDashboardService.openFromList(ids, index);
  }

  protected onFilterChange(filter: PreSalesFilter) {
    this.preSalesListService.setFilter({
      ...filter,
      queryType: this.lockedQueryType ? [this.lockedQueryType] : filter.queryType,
    });
  }
}
