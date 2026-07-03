import { Component, inject, OnInit, signal, Signal } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { NgClass } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PageMeta } from '@core/http';
import { PageTitleComponent } from 'app/layout/common/page-title/page-title.component';
import { MULTAS_TABLE_COLUMNS, MultasTableComponent } from '../components/multas-table.component';
import { MultasFilterComponent } from '../components/multas-filter.component';
import { MultaDto, MultaFilter } from '../models/multa.types';
import { MultasService } from '../services/multas.service';

const TIPO_LABELS: Record<string, string> = {
  IMPOSTAS: 'Multas › Impostas',
  NOTIFICADAS: 'Multas › Notificadas',
  TODAS: 'Multas › Todas as Multas',
};

@Component({
  selector: 'app-multas-list',
  imports: [MultasTableComponent, MultasFilterComponent, MatPaginator, NgClass, PageTitleComponent],
  providers: [MultasService],
  template: `
    <page-title [title]="pageTitle"></page-title>

    <div class="mx-4 mb-4 flex flex-col bg-card rounded-lg shadow overflow-hidden grow">
      <app-multas-filter
        class="w-full"
        [columns]="columnDefs"
        [storageKey]="'multas-' + tipo + '-columns'"
        (filterChange)="onFilterChange($event)"
        (visibleColumnsChange)="visibleColumns.set($event)"
      />

      <app-multas-table
        [multas]="multas()"
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
        [disabled]="!multas()?.length"
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
export class MultasListComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly multasService = inject(MultasService);

  protected tipo: MultaFilter['tipo'] = 'TODAS';
  protected pageTitle = 'Multas';

  protected readonly columnDefs = MULTAS_TABLE_COLUMNS;
  protected readonly visibleColumns = signal<string[]>(MULTAS_TABLE_COLUMNS.map((c) => c.key));
  protected readonly isLoading: Signal<boolean>;
  protected readonly multas: Signal<MultaDto[]>;
  protected readonly pagination: Signal<PageMeta>;

  constructor() {
    this.isLoading = this.multasService.isLoading;
    this.multas = this.multasService.multas;
    this.pagination = this.multasService.pagination;
  }

  ngOnInit() {
    this.tipo = this.route.snapshot.data['tipo'] ?? 'TODAS';
    this.pageTitle = TIPO_LABELS[this.tipo] ?? 'Multas';
    this.multasService.setTipo(this.tipo);
  }

  onFilterChange(filter: MultaFilter) {
    this.multasService.setFilter({ ...filter, tipo: this.tipo });
  }

  onPageChange(event: PageEvent) {
    this.multasService.setPage(event.pageIndex + 1, event.pageSize);
  }
}
