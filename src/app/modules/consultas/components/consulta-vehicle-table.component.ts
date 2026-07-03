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
import { TableColumnDef } from 'app/layout/common/table-column-management/table-column-management.component';
import { ConsultaVehicleDto } from '../models/consulta.types';
import { ConsultaStatusTagComponent } from './consulta-status-tag.component';
import { NgClass } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';

export const CONSULTA_VEHICLE_TABLE_COLUMNS: TableColumnDef[] = [
  { key: 'status', label: 'Status' },
  { key: 'alerta', label: 'Alerta' },
  { key: 'placa', label: 'Placa' },
  { key: 'renavam', label: 'Renavam' },
  { key: 'chassi', label: 'Chassi' },
  { key: 'estado', label: 'Estado' },
  { key: 'situacaoVeiculo', label: 'Veículo' },
  { key: 'gravame', label: 'Gravame' },
  { key: 'proprietario', label: 'Proprietário' },
  { key: 'licenciamento', label: 'Licenciamento' },
  { key: 'recall', label: 'Recall' },
  { key: 'ipva', label: 'IPVA' },
  { key: 'multas', label: 'Multas' },
];

@Component({
  selector: 'app-consulta-vehicle-table',
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
    ConsultaStatusTagComponent,
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
        @let dataSet = vehicles() ?? [];
        <mat-table [dataSource]="dataSet" class="grow">

          <!-- Status Column -->
          <ng-container matColumnDef="status">
            <mat-header-cell *matHeaderCellDef class="min-w-20 justify-center">Status</mat-header-cell>
            <mat-cell *matCellDef="let row" class="min-w-20 justify-center">
              <app-consulta-status-tag [status]="row.status" />
            </mat-cell>
          </ng-container>

          <!-- Alerta Column -->
          <ng-container matColumnDef="alerta">
            <mat-header-cell *matHeaderCellDef class="min-w-20 justify-center">Alerta</mat-header-cell>
            <mat-cell *matCellDef="let row" class="min-w-20 justify-center">
              @if (row.alerta) {
                <span
                  class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-700 cursor-default"
                  matTooltip="Alerta — veículo requer atenção"
                  matTooltipPosition="above"
                ><mat-icon class="icon-size-5" svgIcon="lucide:triangle-alert"></mat-icon></span>
              } @else {
                <span class="text-gray-300">—</span>
              }
            </mat-cell>
          </ng-container>

          <!-- Placa Column -->
          <ng-container matColumnDef="placa">
            <mat-header-cell *matHeaderCellDef class="min-w-28">Placa</mat-header-cell>
            <mat-cell *matCellDef="let row" class="min-w-28 font-mono font-semibold">{{ row.placa }}</mat-cell>
          </ng-container>

          <!-- Renavam Column -->
          <ng-container matColumnDef="renavam">
            <mat-header-cell *matHeaderCellDef class="min-w-36">Renavam</mat-header-cell>
            <mat-cell *matCellDef="let row" class="min-w-36 font-mono text-sm">{{ row.renavam }}</mat-cell>
          </ng-container>

          <!-- Chassi Column -->
          <ng-container matColumnDef="chassi">
            <mat-header-cell *matHeaderCellDef class="min-w-44">Chassi</mat-header-cell>
            <mat-cell *matCellDef="let row" class="min-w-44 font-mono text-sm">{{ row.chassi }}</mat-cell>
          </ng-container>

          <!-- Estado Column -->
          <ng-container matColumnDef="estado">
            <mat-header-cell *matHeaderCellDef class="min-w-20">Estado</mat-header-cell>
            <mat-cell *matCellDef="let row" class="min-w-20">{{ row.estado }}</mat-cell>
          </ng-container>

          <!-- Situação Veículo Column -->
          <ng-container matColumnDef="situacaoVeiculo">
            <mat-header-cell *matHeaderCellDef class="min-w-72">Veículo</mat-header-cell>
            <mat-cell *matCellDef="let row" class="min-w-72 text-xs text-gray-600 line-clamp-2">{{ row.situacaoVeiculo }}</mat-cell>
          </ng-container>

          <!-- Gravame Column -->
          <ng-container matColumnDef="gravame">
            <mat-header-cell *matHeaderCellDef class="min-w-56">Gravame</mat-header-cell>
            <mat-cell *matCellDef="let row" class="min-w-56 text-xs text-gray-600 line-clamp-2">{{ row.gravame }}</mat-cell>
          </ng-container>

          <!-- Proprietário Column -->
          <ng-container matColumnDef="proprietario">
            <mat-header-cell *matHeaderCellDef class="min-w-52">Proprietário</mat-header-cell>
            <mat-cell *matCellDef="let row" class="min-w-52 text-sm">{{ row.proprietario }}</mat-cell>
          </ng-container>

          <!-- Licenciamento Column -->
          <ng-container matColumnDef="licenciamento">
            <mat-header-cell *matHeaderCellDef class="min-w-32 justify-center">Licenciamento</mat-header-cell>
            <mat-cell *matCellDef="let row" class="min-w-32 justify-center text-sm">{{ row.licenciamento }}</mat-cell>
          </ng-container>

          <!-- Recall Column -->
          <ng-container matColumnDef="recall">
            <mat-header-cell *matHeaderCellDef class="min-w-24 justify-center">Recall</mat-header-cell>
            <mat-cell *matCellDef="let row" class="min-w-24 justify-center text-sm">{{ row.recall }}</mat-cell>
          </ng-container>

          <!-- IPVA Column -->
          <ng-container matColumnDef="ipva">
            <mat-header-cell *matHeaderCellDef class="min-w-28 justify-end">IPVA</mat-header-cell>
            <mat-cell *matCellDef="let row" class="min-w-28 justify-end text-sm font-mono">{{ row.ipva }}</mat-cell>
          </ng-container>

          <!-- Multas Column -->
          <ng-container matColumnDef="multas">
            <mat-header-cell *matHeaderCellDef class="min-w-32 justify-center">Multas</mat-header-cell>
            <mat-cell *matCellDef="let row" class="min-w-32 justify-center">
              <span
                class="text-xs font-semibold px-2 py-0.5 rounded-full cursor-default"
                [ngClass]="{
                  'bg-red-100 text-red-700': row.multas === 'CONSTA',
                  'bg-gray-100 text-gray-500': row.multas !== 'CONSTA'
                }"
                [matTooltip]="row.multas === 'CONSTA' ? 'Existem multas registradas para este veículo' : 'Nenhuma multa registrada'"
                matTooltipPosition="above"
              >{{ row.multas }}</span>
            </mat-cell>
          </ng-container>

          <div *matNoDataRow class="no-data-row">
            <mat-icon class="text-gray-300 w-16 h-16" svgIcon="heroicons_outline:clipboard-document-check"></mat-icon>
            <span class="text-xl font-medium text-gray-400">Nenhum veículo encontrado</span>
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
export class ConsultaVehicleTableComponent {
  visibleColumns = input<string[]>(CONSULTA_VEHICLE_TABLE_COLUMNS.map((c) => c.key));
  vehicles = input<ConsultaVehicleDto[]>([]);
  rowClick = output<ConsultaVehicleDto>();

  protected readonly displayedColumns = computed(() => this.visibleColumns() ?? []);
}
