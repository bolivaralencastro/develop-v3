import { Component, inject, OnInit, signal, Signal } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { NgClass } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PageMeta } from '@core/http';
import { PageTitleComponent } from 'app/layout/common/page-title/page-title.component';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import {
  CONSULTA_VEHICLE_TABLE_COLUMNS,
  ConsultaVehicleTableComponent,
} from '../components/consulta-vehicle-table.component';
import { ConsultaFilterComponent } from '../components/consulta-filter.component';
import { ConsultaFilter, ConsultaVehicleDto } from '../models/consulta.types';
import { ConsultaService } from '../services/consulta.service';
import { HeaderBatchDialogService } from '@core/services/header-batch-dialog.service';

@Component({
  selector: 'app-consulta-total',
  imports: [
    ConsultaVehicleTableComponent,
    ConsultaFilterComponent,
    MatPaginator,
    NgClass,
    PageTitleComponent,
    MatIcon,
    MatButton,
  ],
  providers: [ConsultaService],
  template: `
    <page-title [title]="pageTitle">
      <button mat-flat-button class="ml-auto" style="background-color: #792181; color: #fff" (click)="openBatchDialog()">
        <mat-icon svgIcon="heroicons_outline:plus"></mat-icon>
        Nova Consulta
      </button>
    </page-title>

    <div class="mx-4 mb-4 flex flex-col bg-card rounded-lg shadow overflow-hidden grow">
      <app-consulta-filter
        class="w-full"
        [columns]="columnDefs"
        [storageKey]="storageKey"
        (filterChange)="onFilterChange($event)"
        (visibleColumnsChange)="visibleColumns.set($event)"
      />

      <app-consulta-vehicle-table
        [vehicles]="vehicles()"
        [visibleColumns]="visibleColumns()"
      />

      @let pageMeta = pagination();
      <mat-paginator
        class="border-t"
        [ngClass]="{ 'pointer-events-none': isLoading() }"
        [length]="pageMeta?.totalItems"
        [pageIndex]="(pageMeta?.currentPage ?? 1) - 1"
        [pageSize]="pageMeta?.itemsPerPage"
        [pageSizeOptions]="[10, 20, 50, 100]"
        [showFirstLastButtons]="true"
        [disabled]="!vehicles()?.length"
        (page)="onPageChange($event)"
      />
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
export class ConsultaTotalComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly headerBatchDialogService = inject(HeaderBatchDialogService);

  protected pageTitle = 'Consultas › Total';
  protected storageKey = 'consulta-total-columns';

  protected readonly columnDefs = CONSULTA_VEHICLE_TABLE_COLUMNS;
  protected readonly visibleColumns = signal<string[]>(CONSULTA_VEHICLE_TABLE_COLUMNS.map((c) => c.key));
  protected readonly isLoading: Signal<boolean>;
  protected readonly vehicles: Signal<ConsultaVehicleDto[]>;
  protected readonly pagination: Signal<PageMeta>;

  constructor(private readonly consultaService: ConsultaService) {
    this.isLoading = consultaService.isLoading;
    this.vehicles = consultaService.vehicles;
    this.pagination = consultaService.pagination;
  }

  ngOnInit() {
    this.pageTitle = this.route.snapshot.data['title'] ?? 'Consultas › Total';
    this.storageKey = this.route.snapshot.data['storageKey'] ?? 'consulta-total-columns';
  }

  onFilterChange(filter: ConsultaFilter) {
    this.consultaService.setFilter(filter);
  }

  onPageChange(event: PageEvent) {
    this.consultaService.setPage(event.pageIndex + 1, event.pageSize);
  }

  openBatchDialog() {
    this.headerBatchDialogService.open();
  }
}
