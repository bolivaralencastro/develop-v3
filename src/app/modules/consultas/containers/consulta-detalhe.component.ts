import { Component, inject, OnInit, signal, Signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { PageMeta } from '@core/http';
import { PageTitleComponent } from 'app/layout/common/page-title/page-title.component';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import {
  ConsultaDetalheFilterComponent,
  SituacaoOption,
} from '../components/consulta-detalhe-filter.component';
import {
  ConsultaDetalheTableComponent,
  DETALHE_COLUMN_DEFS,
} from '../components/consulta-detalhe-table.component';
import { ConsultaDetalheService } from '../services/consulta-detalhe.service';
import {
  ConsultaDetalheDto,
  ConsultaDetalheFilter,
  ConsultaDetalheType,
  DETALHE_TITLES,
} from '../models/consulta.types';
import { HeaderBatchDialogService } from '@core/services/header-batch-dialog.service';

// As opções devem casar com os valores reais do campo filtrado (SITUACAO_FIELD no service),
// senão o filtro sempre retorna vazio. Telas cujo campo só tem um valor não exibem filtro.
const SITUACAO_OPTIONS: Partial<Record<ConsultaDetalheType, SituacaoOption[]>> = {
  SITUACAO_VEICULO: [
    { value: 'BLOQUEADO', label: 'Bloqueado' },
    { value: 'LIBERADO', label: 'Liberado' },
  ],
  RECALL: [
    { value: 'VENCIDO', label: 'Vencido' },
    { value: 'ATE 4 MESES', label: 'Até 4 meses' },
    { value: 'MAIS DE 4 MESES', label: 'Mais de 4 meses' },
    { value: 'N/C', label: 'Sem recall' },
  ],
  GNV: [
    { value: 'VENCIDO', label: 'Vencido' },
    { value: 'ATE 4 MESES', label: 'Até 4 meses' },
    { value: 'MAIS DE 4 MESES', label: 'Mais de 4 meses' },
  ],
  GRAVAME: [
    { value: 'ALERTA', label: 'Alerta' },
    { value: 'LIBERADO', label: 'Liberado' },
  ],
  CRLV: [
    { value: 'ALERTA', label: 'Alerta' },
    { value: 'LIBERADO', label: 'Liberado' },
  ],
  LICENCIAMENTO: [
    { value: 'ALERTA', label: 'Alerta' },
    { value: 'LIBERADO', label: 'Liberado' },
  ],
};

const SITUACAO_LABEL: Partial<Record<ConsultaDetalheType, string>> = {
  SITUACAO_VEICULO: 'Status',
  RECALL: 'Situação Recall',
  GNV: 'Situação CSV',
  GRAVAME: 'Status',
  CRLV: 'Status',
  LICENCIAMENTO: 'Status',
};

@Component({
  selector: 'app-consulta-detalhe',
  imports: [
    PageTitleComponent,
    ConsultaDetalheFilterComponent,
    ConsultaDetalheTableComponent,
    MatPaginator,
    NgClass,
    MatIcon,
    MatButton,
  ],
  providers: [ConsultaDetalheService],
  template: `
    <page-title [title]="pageTitle">
      <button mat-flat-button class="ml-auto" style="background-color: #792181; color: #fff" (click)="openBatchDialog()">
        <mat-icon svgIcon="heroicons_outline:plus"></mat-icon>
        Nova Consulta
      </button>
    </page-title>

    <div class="mx-4 mb-4 flex flex-col bg-card rounded-lg shadow overflow-hidden grow">
      <app-consulta-detalhe-filter
        class="w-full"
        [columns]="columnDefs"
        [storageKey]="'consulta-detalhe-' + consulType + '-columns'"
        [situacaoOptions]="situacaoOptions"
        [situacaoLabel]="situacaoLabel"
        (filterChange)="onFilterChange($event)"
        (visibleColumnsChange)="visibleColumns.set($event)"
      />

      <app-consulta-detalhe-table
        [consulType]="consulType"
        [items]="items()"
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
        [disabled]="!items()?.length"
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
export class ConsultaDetalheComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly headerBatchDialogService = inject(HeaderBatchDialogService);

  protected consulType: ConsultaDetalheType = 'SITUACAO_VEICULO';
  protected pageTitle = '';
  protected columnDefs = DETALHE_COLUMN_DEFS['SITUACAO_VEICULO'];
  protected situacaoOptions: SituacaoOption[] = [];
  protected situacaoLabel = 'Situação';
  protected readonly visibleColumns = signal<string[] | null>(null);
  protected readonly isLoading: Signal<boolean>;
  protected readonly items: Signal<ConsultaDetalheDto[]>;
  protected readonly pagination: Signal<PageMeta>;

  constructor(private readonly service: ConsultaDetalheService) {
    this.isLoading = service.isLoading;
    this.items = service.items;
    this.pagination = service.pagination;
  }

  ngOnInit() {
    this.consulType = this.route.snapshot.data['consulType'] as ConsultaDetalheType;
    this.pageTitle = DETALHE_TITLES[this.consulType] ?? 'Consultas';
    this.columnDefs = DETALHE_COLUMN_DEFS[this.consulType];
    this.situacaoOptions = SITUACAO_OPTIONS[this.consulType] ?? [];
    this.situacaoLabel = SITUACAO_LABEL[this.consulType] ?? 'Situação';
    this.service.setType(this.consulType);
  }

  onFilterChange(filter: ConsultaDetalheFilter) {
    this.service.setFilter(filter);
  }

  onPageChange(event: PageEvent) {
    this.service.setPage(event.pageIndex + 1, event.pageSize);
  }

  openBatchDialog() {
    this.headerBatchDialogService.open();
  }
}
