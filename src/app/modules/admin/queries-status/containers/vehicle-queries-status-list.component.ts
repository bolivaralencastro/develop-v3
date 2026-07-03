import { ChangeDetectionStrategy, Component, effect, inject, input, Signal, signal, ViewChild } from '@angular/core';
import { VehicleQueriesStatusListService } from '../services/vehicle-queries-status-list.service';
import { PreSaleImportHistoryVehicleResponseDto } from '../../../pre-sales/models/pre-sales.types';
import { PageMeta } from '@core/http';
import { TranslocoModule } from '@ngneat/transloco';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { NgClass, Location } from '@angular/common';
import { FuseDrawerComponent } from '@fuse/components/drawer';
import { VehicleDetailPanelComponent } from 'app/modules/vehicles/components/vehicle-detail-panel.component';
import { VehicleQueriesStatusTableComponent } from '../components/vehicle-queries-status-table.component';
import { Sort } from '@angular/material/sort';
import { PageTitleComponent } from 'app/layout/common/page-title/page-title.component';

@Component({
  selector: 'app-vehicle-queries-status-list',
  imports: [
    TranslocoModule,
    MatPaginator,
    NgClass,
    VehicleQueriesStatusTableComponent,
    PageTitleComponent,
    FuseDrawerComponent,
    VehicleDetailPanelComponent,
  ],
  providers: [VehicleQueriesStatusListService],
  template: `
    <page-title 
      title="Status das Consultas - Veículos"
      [hasBackButton]="true"
      (goBack)="onGoBack()"
    ></page-title>

    <div class="mx-4 mb-4 flex flex-col bg-card rounded-lg shadow overflow-hidden grow">
      <app-vehicle-queries-status-table
        [vehicles]="vehiclesQueries()"
        [isLoading]="isLoading()"
        (sortChange)="onSortChange($event)"
        (vehicleClick)="openVehiclePanel($event)"
      ></app-vehicle-queries-status-table>
      @let pageMeta = pagination();
      <mat-paginator
        class="border-t"
        [ngClass]="{ 'pointer-events-none': isLoading() }"
        [length]="pageMeta?.totalItems"
        [pageIndex]="pageMeta?.currentPage - 1"
        [pageSize]="pageMeta?.itemsPerPage"
        [pageSizeOptions]="[10, 20, 50, 100]"
        [showFirstLastButtons]="true"
        [disabled]="!vehiclesQueries()?.length"
        (page)="onPageChange($event)"
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleQueriesStatusListComponent {
  @ViewChild('detailDrawer') private detailDrawer!: FuseDrawerComponent;

  readonly queryId = input<string>();
  protected readonly vehiclesQueries: Signal<PreSaleImportHistoryVehicleResponseDto[]>;
  protected readonly isLoading: Signal<boolean>;
  protected readonly pagination: Signal<PageMeta>;
  protected readonly selectedVehicleId = signal<string | null>(null);
  private readonly location = inject(Location);

  constructor(private readonly vehiclesQueriesDetailListService: VehicleQueriesStatusListService) {
    effect(() => {
      const queryId = this.queryId();
      this.vehiclesQueriesDetailListService.loadQueryVehicles(queryId);
    });

    this.vehiclesQueries = this.vehiclesQueriesDetailListService.vehiclesQueries;
    this.isLoading = this.vehiclesQueriesDetailListService.isLoading;
    this.pagination = this.vehiclesQueriesDetailListService.pagination;
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

  onPageChange(event: PageEvent) {
    this.vehiclesQueriesDetailListService.setPage(event.pageIndex + 1, event.pageSize);
  }

  onSortChange(event: Sort) {
    this.vehiclesQueriesDetailListService.setSort(event.active, event.direction);
  }

  onGoBack() {
    this.location.back();
  }
}
