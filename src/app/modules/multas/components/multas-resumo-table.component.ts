import { Component, computed, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import {
  MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatNoDataRow, MatRow, MatRowDef, MatTable,
} from '@angular/material/table';
import { TableColumnDef } from 'app/layout/common/table-column-management/table-column-management.component';
import { MultaResumoDto } from '../models/multa.types';

const BASE_COLUMNS: TableColumnDef[] = [
  { key: 'placa', label: 'Placa' }, { key: 'renavam', label: 'Renavam' },
  { key: 'chassi', label: 'Chassi' }, { key: 'estado', label: 'Estado' },
];

// 1.10.1 Multas Impostas / 1.10.2 Multas Notificadas — resumo (Quantidade, Valor Total)
export const RESUMO_IMPOSTAS_COLUMNS: TableColumnDef[] = [
  ...BASE_COLUMNS,
  { key: 'quantidadeImpostas', label: 'Quantidade' },
  { key: 'valorImpostas', label: 'Valor Total (R$)' },
];

export const RESUMO_NOTIFICADAS_COLUMNS: TableColumnDef[] = [
  ...BASE_COLUMNS,
  { key: 'quantidadeNotificadas', label: 'Quantidade' },
  { key: 'valorNotificadas', label: 'Valor Total (R$)' },
];

// 1.10.3 Todas as Multas — resumo
export const RESUMO_TODAS_COLUMNS: TableColumnDef[] = [
  ...BASE_COLUMNS,
  { key: 'quantidadeTotal', label: 'Quantidade' },
  { key: 'valorTotal', label: 'Valor Total Multas' },
  { key: 'valorImpostas', label: 'Total Multas Impostas (R$)' },
  { key: 'valorNotificadas', label: 'Total Multas Notificadas (R$)' },
];

// Veículos › Multas (2.6)
export const RESUMO_VEICULOS_COLUMNS: TableColumnDef[] = [
  ...BASE_COLUMNS,
  { key: 'quantidadeImpostas', label: 'Qtd. Multas Impostas' },
  { key: 'valorImpostas', label: 'Total Multas Impostas (R$)' },
  { key: 'quantidadeNotificadas', label: 'Qtd. Multas Notificadas' },
  { key: 'valorNotificadas', label: 'Total Multas Notificadas (R$)' },
  { key: 'quantidadeTotal', label: 'Qtd. Total de Multas' },
  { key: 'valorTotal', label: 'Total Multas (R$)' },
];

@Component({
  selector: 'app-multas-resumo-table',
  imports: [
    MatTable, MatColumnDef, MatHeaderCellDef, MatCell, MatHeaderCell, MatCellDef,
    MatIcon, MatHeaderRow, MatRowDef, MatHeaderRowDef, MatRow, MatNoDataRow,
  ],
  template: `
    <div class="grow flex">
      @let dataSet = items() ?? [];
      <mat-table [dataSource]="dataSet" class="grow">

        <ng-container matColumnDef="placa">
          <mat-header-cell *matHeaderCellDef class="min-w-28">Placa</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-28 font-mono font-semibold">{{ r.placa }}</mat-cell>
        </ng-container>

        <ng-container matColumnDef="renavam">
          <mat-header-cell *matHeaderCellDef class="min-w-36">Renavam</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-36 font-mono text-sm">{{ r.renavam }}</mat-cell>
        </ng-container>

        <ng-container matColumnDef="chassi">
          <mat-header-cell *matHeaderCellDef class="min-w-44">Chassi</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-44 font-mono text-sm">{{ r.chassi }}</mat-cell>
        </ng-container>

        <ng-container matColumnDef="estado">
          <mat-header-cell *matHeaderCellDef class="min-w-20">Estado</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-20">{{ r.estado }}</mat-cell>
        </ng-container>

        <ng-container matColumnDef="quantidadeImpostas">
          <mat-header-cell *matHeaderCellDef class="min-w-32 justify-end">Qtd. Impostas</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-32 justify-end font-mono">{{ r.quantidadeImpostas }}</mat-cell>
        </ng-container>

        <ng-container matColumnDef="valorImpostas">
          <mat-header-cell *matHeaderCellDef class="min-w-36 justify-end">Total Impostas (R$)</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-36 justify-end font-mono font-semibold text-red-600">{{ r.valorImpostas }}</mat-cell>
        </ng-container>

        <ng-container matColumnDef="quantidadeNotificadas">
          <mat-header-cell *matHeaderCellDef class="min-w-32 justify-end">Qtd. Notificadas</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-32 justify-end font-mono">{{ r.quantidadeNotificadas }}</mat-cell>
        </ng-container>

        <ng-container matColumnDef="valorNotificadas">
          <mat-header-cell *matHeaderCellDef class="min-w-36 justify-end">Total Notificadas (R$)</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-36 justify-end font-mono font-semibold text-amber-600">{{ r.valorNotificadas }}</mat-cell>
        </ng-container>

        <ng-container matColumnDef="quantidadeTotal">
          <mat-header-cell *matHeaderCellDef class="min-w-28 justify-end">Quantidade</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-28 justify-end font-mono font-semibold">{{ r.quantidadeTotal }}</mat-cell>
        </ng-container>

        <ng-container matColumnDef="valorTotal">
          <mat-header-cell *matHeaderCellDef class="min-w-36 justify-end">Valor Total (R$)</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-36 justify-end font-mono font-semibold">{{ r.valorTotal }}</mat-cell>
        </ng-container>

        <div *matNoDataRow class="no-data-row">
          <mat-icon class="text-gray-300 w-16 h-16" svgIcon="heroicons_outline:document-text"></mat-icon>
          <span class="text-xl font-medium text-gray-400">Nenhuma multa encontrada</span>
        </div>

        <mat-header-row *matHeaderRowDef="displayedColumns(); sticky: true"></mat-header-row>
        <mat-row *matRowDef="let row; columns: displayedColumns()"></mat-row>
      </mat-table>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      overflow-y: scroll;
      height: 0;
      max-width: 100%;
    }
    .no-data-row {
      @apply flex flex-col justify-center items-center text-xl gap-2;
      height: calc(100% - var(--mat-header-row-height));
    }
  `,
})
export class MultasResumoTableComponent {
  items = input<MultaResumoDto[]>([]);
  visibleColumns = input<string[]>([]);

  protected readonly displayedColumns = computed(() => this.visibleColumns() ?? []);
}
