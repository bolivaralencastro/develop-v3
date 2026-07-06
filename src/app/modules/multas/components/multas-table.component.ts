import { Component, computed, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { NgClass } from '@angular/common';
import { TableColumnDef } from 'app/layout/common/table-column-management/table-column-management.component';
import { MultaDto } from '../models/multa.types';
import { MatTooltip } from '@angular/material/tooltip';

export const MULTAS_TABLE_COLUMNS: TableColumnDef[] = [
  { key: 'placa', label: 'Placa' },
  { key: 'renavam', label: 'Renavam' },
  { key: 'chassi', label: 'Chassi' },
  { key: 'estado', label: 'Estado' },
  { key: 'numeroMulta', label: 'N° Multa' },
  { key: 'situacao', label: 'Situação' },
  { key: 'dataInfracao', label: 'Data da Infração' },
  { key: 'horaInfracao', label: 'Hora' },
  { key: 'orgaoAutuador', label: 'Órgão Autuador' },
  { key: 'codigoInfracao', label: 'Código' },
  { key: 'descricaoInfracao', label: 'Descrição da Infração' },
  { key: 'localInfracao', label: 'Local' },
  { key: 'valor', label: 'Valor' },
];

@Component({
  selector: 'app-multas-table',
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatCell,
    MatHeaderCell,
    MatCellDef,
    MatIcon,
    MatHeaderRow,
    MatRowDef,
    MatHeaderRowDef,
    MatRow,
    MatNoDataRow,
    NgClass,
    MatTooltip,
  ],
  template: `
    @if (!displayedColumns()?.length) {
      <div class="table-columns-empty">
        <mat-icon>settings</mat-icon>
        <span class="text-sm text-secondary">Selecione as colunas no ícone de engrenagem</span>
      </div>
    } @else {
      <div class="grow flex">
        @let dataSet = multas() ?? [];
        <mat-table [dataSource]="dataSet" class="grow">

          <!-- Placa -->
          <ng-container matColumnDef="placa">
            <mat-header-cell *matHeaderCellDef class="min-w-28">Placa</mat-header-cell>
            <mat-cell *matCellDef="let row" class="min-w-28 font-mono font-semibold">{{ row.placa }}</mat-cell>
          </ng-container>

          <!-- Renavam -->
          <ng-container matColumnDef="renavam">
            <mat-header-cell *matHeaderCellDef class="min-w-36">Renavam</mat-header-cell>
            <mat-cell *matCellDef="let row" class="min-w-36 font-mono text-sm">{{ row.renavam }}</mat-cell>
          </ng-container>

          <!-- Chassi -->
          <ng-container matColumnDef="chassi">
            <mat-header-cell *matHeaderCellDef class="min-w-28">Chassi</mat-header-cell>
            <mat-cell *matCellDef="let row" class="min-w-28 font-mono text-sm">{{ row.chassi }}</mat-cell>
          </ng-container>

          <!-- Estado -->
          <ng-container matColumnDef="estado">
            <mat-header-cell *matHeaderCellDef class="min-w-20">Estado</mat-header-cell>
            <mat-cell *matCellDef="let row" class="min-w-20">{{ row.estado }}</mat-cell>
          </ng-container>

          <!-- N° Multa -->
          <ng-container matColumnDef="numeroMulta">
            <mat-header-cell *matHeaderCellDef class="min-w-36">N° Multa</mat-header-cell>
            <mat-cell *matCellDef="let row" class="min-w-36 font-mono text-sm">{{ row.numeroMulta }}</mat-cell>
          </ng-container>

          <!-- Situação -->
          <ng-container matColumnDef="situacao">
            <mat-header-cell *matHeaderCellDef class="min-w-32 justify-center">Situação</mat-header-cell>
            <mat-cell *matCellDef="let row" class="min-w-32 justify-center">
              <span
                class="text-xs font-semibold px-2 py-0.5 rounded-full cursor-default"
                [ngClass]="{
                  'bg-amber-100 text-amber-700': row.situacao === 'IMPOSTO',
                  'bg-blue-100 text-blue-700': row.situacao === 'NOTIFICADO',
                  'bg-green-100 text-green-700': row.situacao === 'PAGO',
                  'bg-purple-100 text-purple-700': row.situacao === 'RECURSO'
                }"
                [matTooltip]="situacaoTooltip[row.situacao]"
                matTooltipPosition="above"
              >{{ row.situacao }}</span>
            </mat-cell>
          </ng-container>

          <!-- Data da Infração -->
          <ng-container matColumnDef="dataInfracao">
            <mat-header-cell *matHeaderCellDef class="min-w-36">Data da Infração</mat-header-cell>
            <mat-cell *matCellDef="let row" class="min-w-36 text-sm">{{ row.dataInfracao }}</mat-cell>
          </ng-container>

          <!-- Hora da Infração -->
          <ng-container matColumnDef="horaInfracao">
            <mat-header-cell *matHeaderCellDef class="min-w-24">Hora</mat-header-cell>
            <mat-cell *matCellDef="let row" class="min-w-24 font-mono text-sm">{{ row.horaInfracao }}</mat-cell>
          </ng-container>

          <!-- Órgão Autuador -->
          <ng-container matColumnDef="orgaoAutuador">
            <mat-header-cell *matHeaderCellDef class="min-w-44">Órgão Autuador</mat-header-cell>
            <mat-cell *matCellDef="let row" class="min-w-44 text-sm">{{ row.orgaoAutuador }}</mat-cell>
          </ng-container>

          <!-- Código da Infração -->
          <ng-container matColumnDef="codigoInfracao">
            <mat-header-cell *matHeaderCellDef class="min-w-24 justify-center">Código</mat-header-cell>
            <mat-cell *matCellDef="let row" class="min-w-24 justify-center font-mono text-sm">{{ row.codigoInfracao }}</mat-cell>
          </ng-container>

          <!-- Descrição da Infração -->
          <ng-container matColumnDef="descricaoInfracao">
            <mat-header-cell *matHeaderCellDef class="min-w-80">Descrição da Infração</mat-header-cell>
            <mat-cell *matCellDef="let row" class="min-w-80 text-xs text-gray-600 line-clamp-2">{{ row.descricaoInfracao }}</mat-cell>
          </ng-container>

          <!-- Local da Infração -->
          <ng-container matColumnDef="localInfracao">
            <mat-header-cell *matHeaderCellDef class="min-w-72">Local</mat-header-cell>
            <mat-cell *matCellDef="let row" class="min-w-72 text-xs text-gray-600 line-clamp-2">{{ row.localInfracao }}</mat-cell>
          </ng-container>

          <!-- Valor -->
          <ng-container matColumnDef="valor">
            <mat-header-cell *matHeaderCellDef class="min-w-28 justify-end">Valor</mat-header-cell>
            <mat-cell *matCellDef="let row" class="min-w-28 justify-end font-semibold text-red-600">{{ row.valor }}</mat-cell>
          </ng-container>

          <div *matNoDataRow class="no-data-row">
            <mat-icon class="text-gray-300 w-16 h-16" svgIcon="heroicons_outline:document-text"></mat-icon>
            <span class="text-xl font-medium text-gray-400">Nenhuma multa encontrada</span>
          </div>

          <mat-header-row *matHeaderRowDef="displayedColumns(); sticky: true"></mat-header-row>
          <mat-row *matRowDef="let row; columns: displayedColumns()" class="cursor-pointer" (click)="rowClick.emit(row)"></mat-row>
        </mat-table>
      </div>
    }
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

    .table-columns-empty {
      @apply grow flex flex-col items-center justify-center gap-2 text-center;
      background: rgba(243, 244, 246, 0.85);
    }

    .no-data-row {
      @apply flex flex-col justify-center items-center text-xl gap-2;
      height: calc(100% - var(--mat-header-row-height));
    }
  `,
})
export class MultasTableComponent {
  visibleColumns = input<string[]>(MULTAS_TABLE_COLUMNS.map((c) => c.key));
  multas = input<MultaDto[]>([]);
  rowClick = output<MultaDto>();

  protected readonly displayedColumns = computed(() => this.visibleColumns() ?? []);

  protected readonly situacaoTooltip: Record<string, string> = {
    IMPOSTO: 'Imposta — aguardando pagamento ou recurso',
    NOTIFICADO: 'Notificado — prazo para defesa ou pagamento em aberto',
    PAGO: 'Pago — multa quitada',
    RECURSO: 'Recurso em andamento',
  };
}
