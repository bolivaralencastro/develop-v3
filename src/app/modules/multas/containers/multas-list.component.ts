import { Component, inject, OnInit, signal, Signal } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { NgClass } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PageMeta } from '@core/http';
import { PageTitleComponent } from 'app/layout/common/page-title/page-title.component';
import { MULTAS_TABLE_COLUMNS, MultasTableComponent } from '../components/multas-table.component';
import {
  MultasResumoTableComponent,
  RESUMO_IMPOSTAS_COLUMNS,
  RESUMO_NOTIFICADAS_COLUMNS,
  RESUMO_TODAS_COLUMNS,
} from '../components/multas-resumo-table.component';
import { MultasFilterComponent } from '../components/multas-filter.component';
import { MultaDto, MultaFilter, MultaResumoDto } from '../models/multa.types';
import { MultasService } from '../services/multas.service';
import { TableColumnDef } from 'app/layout/common/table-column-management/table-column-management.component';

const TIPO_LABELS: Record<string, string> = {
  IMPOSTAS: 'Impostas',
  NOTIFICADAS: 'Notificadas',
  TODAS: 'Todas as Multas',
};

// resumo por veículo (planilha 1.10.x) para as telas de Consultas › Multas
const RESUMO_COLUMNS: Record<string, TableColumnDef[]> = {
  IMPOSTAS: RESUMO_IMPOSTAS_COLUMNS,
  NOTIFICADAS: RESUMO_NOTIFICADAS_COLUMNS,
  TODAS: RESUMO_TODAS_COLUMNS,
};

@Component({
  selector: 'app-multas-list',
  imports: [MultasTableComponent, MultasResumoTableComponent, MultasFilterComponent, MatPaginator, NgClass, PageTitleComponent],
  providers: [MultasService],
  template: `
    <page-title [title]="pageTitle"></page-title>

    <div class="mx-4 mb-4 flex flex-col bg-card rounded-lg shadow overflow-hidden grow">
      <app-multas-filter
        class="w-full"
        [columns]="columnDefs"
        [storageKey]="'multas-' + tipo + (isSummary ? '-resumo' : '') + '-columns'"
        (filterChange)="onFilterChange($event)"
        (visibleColumnsChange)="visibleColumns.set($event)"
      />

      @if (isSummary) {
        <app-multas-resumo-table
          [items]="resumo()"
          [visibleColumns]="visibleColumns()"
        />
      } @else {
        <app-multas-table
          [multas]="multas()"
          [visibleColumns]="visibleColumns()"
        />
      }

      @let pageMeta = pagination();
      <mat-paginator
        class="border-t"
        [ngClass]="{ 'pointer-events-none': isLoading() }"
        [length]="pageMeta?.totalItems"
        [pageIndex]="(pageMeta?.currentPage ?? 1) - 1"
        [pageSize]="pageMeta?.itemsPerPage"
        [pageSizeOptions]="[10, 20, 50, 100]"
        [showFirstLastButtons]="true"
        [disabled]="!pageMeta?.totalItems"
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
  protected isSummary = false;

  protected columnDefs: TableColumnDef[] = MULTAS_TABLE_COLUMNS;
  protected readonly visibleColumns = signal<string[]>(MULTAS_TABLE_COLUMNS.map((c) => c.key));
  protected readonly isLoading: Signal<boolean>;
  protected readonly multas: Signal<MultaDto[]>;
  protected readonly resumo: Signal<MultaResumoDto[]>;
  protected pagination: Signal<PageMeta>;

  constructor() {
    this.isLoading = this.multasService.isLoading;
    this.multas = this.multasService.multas;
    this.resumo = this.multasService.resumoPorVeiculo;
  }

  ngOnInit() {
    this.tipo = this.route.snapshot.data['tipo'] ?? 'TODAS';
    this.isSummary = !!this.route.snapshot.data['summary'];
    const titlePrefix = this.route.snapshot.data['titlePrefix'] ?? 'Multas';
    this.pageTitle = `${titlePrefix} › ${TIPO_LABELS[this.tipo] ?? 'Todas as Multas'}`;

    this.columnDefs = this.isSummary ? RESUMO_COLUMNS[this.tipo] ?? RESUMO_COLUMNS['TODAS'] : MULTAS_TABLE_COLUMNS;
    this.visibleColumns.set(this.columnDefs.map((c) => c.key));
    this.pagination = this.isSummary ? this.multasService.resumoPagination : this.multasService.pagination;

    this.multasService.setTipo(this.tipo);
  }

  onFilterChange(filter: MultaFilter) {
    this.multasService.setFilter({ ...filter, tipo: this.tipo });
  }

  onPageChange(event: PageEvent) {
    this.multasService.setPage(event.pageIndex + 1, event.pageSize);
  }
}
