import { Location, NgClass } from '@angular/common';
import { Component, DestroyRef, effect, inject, input, Signal, signal, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { PageMeta } from '@core/http';
import { FuseDrawerComponent } from '@fuse/components/drawer';
import { TranslocoModule } from '@ngneat/transloco';
import { PageTitleComponent } from 'app/layout/common/page-title/page-title.component';
import { VehicleDetailPanelComponent } from 'app/modules/vehicles/components/vehicle-detail-panel.component';
import { QueryDashboardService } from '../../dashboard/services/query-dashboard.service';
import { PreSaleHistoryComponent } from '../components/pre-sale-history.component';
import { PreSalesVehiclesFilterComponent } from '../components/pre-sales-vehicles-filter.component';
import { VEHICLE_HISTORY_TABLE_COLUMNS, VehicleHistoryTableComponent } from '../components/vehicle-history-table.component';
import {
  PresaleImportHistoryStatusCount,
  PreSaleImportHistoryVehicleResponseDto,
  PreSaleImportHistoryVehiclesFilter,
} from '../models/pre-sales.types';
import { PreSalesDetailService } from '../services/pre-sales-detail.service';

@Component({
  selector: 'app-batch-detail',
  providers: [PreSalesDetailService],
  imports: [
    TranslocoModule,
    VehicleHistoryTableComponent,
    FormsModule,
    PreSalesVehiclesFilterComponent,
    MatPaginator,
    NgClass,
    PageTitleComponent,
    PreSaleHistoryComponent,
    FuseDrawerComponent,
    VehicleDetailPanelComponent,
  ],
  template: `
    <page-title [title]="'pre-sales.details.vehicles' | transloco" [hasBackButton]="true" (goBack)="onGoBack()">
      <app-pre-sale-history [stats]="stats()" (openDashboard)="openDashboard()"/>
    </page-title>

    <div class="mx-4 mb-4 flex flex-col bg-card rounded-lg shadow overflow-hidden grow">
      <app-pre-sales-vehicles-filter
        class="ml-auto w-full"
        [columns]="columnDefs"
        (filterChange)="onFilterChange($event)"
        (visibleColumnsChange)="visibleColumns.set($event)"
        [currentFilter]="currentFilter()" />

      <app-vehicle-history-table
        [vehicles]="vehicles()"
        [isLoading]="isLoadingVehicles()"
        [visibleColumns]="visibleColumns()"
        (sortChange)="onVehiclesSortChange($event)"
        (vehicleClick)="openVehiclePanel($event)"
      ></app-vehicle-history-table>
      @let pageMeta = vehiclesPagination();
      <mat-paginator
        class="border-t"
        [ngClass]="{ 'pointer-events-none': isLoadingVehicles() }"
        [length]="pageMeta?.totalItems"
        [pageIndex]="pageMeta?.currentPage - 1"
        [pageSize]="pageMeta?.itemsPerPage"
        [pageSizeOptions]="[10, 20, 50, 100]"
        [showFirstLastButtons]="true"
        [disabled]="!vehicles()?.length"
        (page)="onVehiclesPageChange($event)"
      ></mat-paginator>
    </div>

    <fuse-drawer
      #detailDrawer
      class="detail-drawer"
      [fixed]="true"
      [mode]="'over'"
      [position]="'right'"
      [transparentOverlay]="true"
      (openedChanged)="onDrawerOpenedChanged($event)"
    >
      <app-vehicle-detail-panel
        [vehicleId]="selectedVehicleId()"
        (closePanel)="detailDrawer.close()"
      />
    </fuse-drawer>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      flex: 1;
    }

    .detail-drawer {
      width: 420px;
      min-width: 420px;
      box-shadow: -8px 0 24px 0 rgba(0, 0, 0, 0.15);
    }
  `,
})
export class PreSalesDetailComponent {
  @ViewChild('detailDrawer') private detailDrawer!: FuseDrawerComponent;

  protected readonly columnDefs = VEHICLE_HISTORY_TABLE_COLUMNS;
  protected readonly visibleColumns = signal<string[]>(VEHICLE_HISTORY_TABLE_COLUMNS.map((c) => c.key));

  protected readonly stats: Signal<PresaleImportHistoryStatusCount>;
  protected readonly vehicles: Signal<PreSaleImportHistoryVehicleResponseDto[]>;
  protected readonly isLoadingHistory: Signal<boolean>;
  protected readonly isLoadingVehicles: Signal<boolean>;
  protected readonly vehiclesPagination: Signal<PageMeta>;
  protected readonly selectedVehicleId = signal<string | null>(null);
  protected readonly currentImportHistoryId = signal<string | null>(null);
  private readonly destroyRef = inject(DestroyRef);
  readonly stateFilter = input<string | undefined>(undefined, { alias: 'state' });
  readonly situationFilter = input<string | undefined>(undefined, { alias: 'situation' });
  readonly currentFilter: Signal<PreSaleImportHistoryVehiclesFilter>;

  private readonly location = inject(Location);
  private readonly queryDashboardService = inject(QueryDashboardService);

  constructor(
    private readonly detailService: PreSalesDetailService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
  ) {
    this.stats = detailService.stats;
    this.vehicles = detailService.vehicles;
    this.isLoadingHistory = detailService.isLoadingHistory;
    this.isLoadingVehicles = detailService.isLoadingVehicles;
    this.vehiclesPagination = detailService.vehiclesPagination;
    this.currentFilter = detailService.vehiclesFilter;
    this.registerRouteChangeListener();
    this.registerFilterValuesChanges();
  }

  openVehiclePanel(vehicleId: string): void {
    this.selectedVehicleId.set(vehicleId);
    this.detailDrawer.open();
  }

  onDrawerOpenedChanged(opened: boolean): void {
    if (!opened) {
      this.selectedVehicleId.set(null);
    }
  }

  onVehiclesPageChange(event: PageEvent) {
    this.detailService.setVehiclesPagination(event.pageIndex + 1, event.pageSize);
  }

  onVehiclesSortChange(event: Sort) {
    this.detailService.setVehiclesSort(event.active, event.direction);
  }

  onFilterChange(filter: PreSaleImportHistoryVehiclesFilter) {
    this.detailService.setVehiclesFilter(filter);
  }

  onGoBack() {
    this.location.back();
  }

  openDashboard() {
    const id = this.currentImportHistoryId();

    if (!id) {
      return;
    }

    this.queryDashboardService.openFromDetail(id);
  }

  private registerFilterValuesChanges() {
    effect(() => {
      const stateFilter = this.stateFilter();
      const situationFilter = this.situationFilter();
      const filters = new Map<string, string[]>();
      if (stateFilter) {
        filters.set('state', [stateFilter]);
      }

      if (situationFilter) {
        filters.set('situation', [situationFilter]);
      }

      if (!filters.size) {
        return;
      }

      const filter = Object.fromEntries(filters);
      this.onFilterChange(filter);
    });
  }

  private registerRouteChangeListener() {
    this.activatedRoute.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (params) => this.handleParamChange(params),
    });
  }

  private handleParamChange(params: ParamMap) {
    const id = params.get('id');

    if (!id) {
      return;
    }

    this.currentImportHistoryId.set(id);
    this.detailService.loadHistory(id);
  }
}
