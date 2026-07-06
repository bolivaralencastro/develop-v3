import { Component, inject, OnInit, signal, Signal, ViewChild } from '@angular/core';
import { VehiclesService } from '../services/vehicles.service';
import { PageMeta } from '@core/http';
import { VehicleDto, VehiclesFilter, VehicleStatusFilter } from '../models/vehicles.types';
import { NgClass } from '@angular/common';
import { VEHICLES_TABLE_COLUMNS, VehiclesListComponent } from '../components/vehicles-list.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { VehiclesListFilterComponent } from '../components/vehicles-list-filter.component';
import { PageTitleComponent } from 'app/layout/common/page-title/page-title.component';
import { VehicleDetailPanelComponent } from '../components/vehicle-detail-panel.component';
import { FuseDrawerComponent } from '@fuse/components/drawer';
import { ActivatedRoute } from '@angular/router';
import { MultasService } from '../../multas/services/multas.service';
import { MultaResumoDto } from '../../multas/models/multa.types';
import { MultasResumoTableComponent, RESUMO_VEICULOS_COLUMNS } from '../../multas/components/multas-resumo-table.component';

const STATUS_FILTER_LABELS: Record<VehicleStatusFilter, string> = {
  LIBERADOS: 'Veículos › Liberados',
  LIBERADOS_ALERTA: 'Veículos › Liberados com Alertas',
  BLOQUEADOS: 'Veículos › Bloqueados',
  BLOQUEADOS_ALERTA: 'Veículos › Bloqueados com Alertas',
  TODOS: 'Veículos › Todos',
  MULTAS: 'Veículos › Multas',
};

@Component({
  selector: 'app-vehicles',
  imports: [
    VehiclesListComponent,
    VehiclesListFilterComponent,
    MatPaginator,
    NgClass,
    PageTitleComponent,
    VehicleDetailPanelComponent,
    FuseDrawerComponent,
    MultasResumoTableComponent,
  ],
  providers: [VehiclesService, MultasService],
  template: `
    <page-title [title]="pageTitle"></page-title>

    <div class="mx-4 mb-4 flex flex-col bg-card rounded-lg shadow overflow-hidden grow">
      @if (isMultasResumo) {
        <app-multas-resumo-table
          [items]="multasResumo()"
          [visibleColumns]="resumoVisibleColumns"
        />
      } @else {
        <app-vehicles-list-filter
          [columns]="columnDefs"
          (filterChange)="onFilterChange($event)"
          (visibleColumnsChange)="visibleColumns.set($event)"
        ></app-vehicles-list-filter>

        <app-vehicles-list
          [vehicles]="vehicles()"
          [visibleColumns]="visibleColumns()"
          (vehicleClick)="openVehiclePanel($event)"
        ></app-vehicles-list>
      }

      @let pageMeta = pagination();
      <mat-paginator
        class="border-t"
        [ngClass]="{ 'pointer-events-none': isLoading() }"
        [length]="pageMeta?.totalItems"
        [pageIndex]="pageMeta?.currentPage - 1"
        [pageSize]="pageMeta?.itemsPerPage"
        [pageSizeOptions]="[10, 20, 50, 100]"
        [showFirstLastButtons]="true"
        [disabled]="!pageMeta?.totalItems"
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
})
export class VehiclesComponent implements OnInit {
  @ViewChild('detailDrawer') private detailDrawer!: FuseDrawerComponent;

  private readonly route = inject(ActivatedRoute);

  protected pageTitle = 'Veículos';
  protected readonly columnDefs = VEHICLES_TABLE_COLUMNS;
  protected readonly visibleColumns = signal<string[]>(VEHICLES_TABLE_COLUMNS.map((c) => c.key));

  protected readonly isLoading: Signal<boolean>;
  protected readonly vehicles: Signal<VehicleDto[]>;
  protected pagination: Signal<PageMeta>;
  protected readonly selectedVehicleId = signal<string | null>(null);

  protected isMultasResumo = false;
  protected readonly resumoColumnDefs = RESUMO_VEICULOS_COLUMNS;
  protected readonly resumoVisibleColumns = RESUMO_VEICULOS_COLUMNS.map((c) => c.key);
  protected readonly multasResumo: Signal<MultaResumoDto[]>;

  constructor(
    private readonly vehiclesService: VehiclesService,
    private readonly multasService: MultasService,
  ) {
    this.vehicles = vehiclesService.vehicles;
    this.isLoading = vehiclesService.isLoading;
    this.pagination = vehiclesService.pagination;
    this.multasResumo = multasService.resumoPorVeiculo;
  }

  ngOnInit() {
    const statusFilter = this.route.snapshot.data['statusFilter'] as VehicleStatusFilter | undefined;
    if (statusFilter) {
      this.pageTitle = STATUS_FILTER_LABELS[statusFilter] ?? 'Veículos';
      this.isMultasResumo = statusFilter === 'MULTAS';
      if (this.isMultasResumo) {
        this.pagination = this.multasService.resumoPagination;
      } else {
        this.vehiclesService.setStatusFilter(statusFilter);
      }
    }
  }

  onPageChange(event: PageEvent) {
    this.vehiclesService.setPage(event.pageIndex + 1, event.pageSize);
  }

  onFilterChange(filter: VehiclesFilter) {
    this.vehiclesService.setFilter(filter);
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
}
