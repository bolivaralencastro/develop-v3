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
import { VehicleDto } from '../models/vehicles.types';
import { MatTooltip } from '@angular/material/tooltip';

export const VEHICLES_TABLE_COLUMNS: TableColumnDef[] = [
  { key: 'status', label: 'Status' },
  { key: 'alerta', label: 'Alerta' },
  { key: 'numberPlate', label: 'Placa' },
  { key: 'renavam', label: 'Renavam' },
  { key: 'chassi', label: 'Chassi' },
  { key: 'state', label: 'Estado' },
  { key: 'situacaoVeiculo', label: 'Veículo' },
  { key: 'gravame', label: 'Gravame' },
  { key: 'owner', label: 'Proprietário' },
  { key: 'ultimoCrlv', label: 'Último CRLV' },
  { key: 'situacaoRecall', label: 'Situação Recall' },
  { key: 'ipva', label: 'IPVA' },
  { key: 'multas', label: 'Multas' },
];

@Component({
  selector: 'app-vehicles-list',
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
        @let dataSet = vehicles() ?? [];
        <mat-table [dataSource]="dataSet" class="grow">

          <!-- Status Column -->
          <ng-container matColumnDef="status">
            <mat-header-cell *matHeaderCellDef class="min-w-20 justify-center">Status</mat-header-cell>
            <mat-cell *matCellDef="let row" class="min-w-20 justify-center">
              <span
                class="inline-flex items-center justify-center w-8 h-8 rounded-full cursor-default"
                [ngClass]="{
                  'bg-green-100 text-green-700': row.status === 'LIBERADO',
                  'bg-red-100 text-red-700': row.status === 'BLOQUEADO',
                  'bg-gray-100 text-gray-400': !row.status
                }"
                [matTooltip]="row.status === 'LIBERADO' ? 'Liberado — veículo sem restrições ativas' : row.status === 'BLOQUEADO' ? 'Bloqueado — veículo com restrições ou impedimentos' : ''"
                matTooltipPosition="above"
              >
                @if (row.status === 'LIBERADO') {
                  <mat-icon class="icon-size-5" svgIcon="lucide:check-circle"></mat-icon>
                } @else if (row.status === 'BLOQUEADO') {
                  <mat-icon class="icon-size-5" svgIcon="lucide:x-circle"></mat-icon>
                } @else {
                  <span>—</span>
                }
              </span>
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
          <ng-container matColumnDef="numberPlate">
            <mat-header-cell *matHeaderCellDef class="min-w-28">Placa</mat-header-cell>
            <mat-cell *matCellDef="let row" class="min-w-28 font-mono font-semibold">{{ row.numberPlate }}</mat-cell>
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
          <ng-container matColumnDef="state">
            <mat-header-cell *matHeaderCellDef class="min-w-20">Estado</mat-header-cell>
            <mat-cell *matCellDef="let row" class="min-w-20">{{ row.state }}</mat-cell>
          </ng-container>

          <!-- Situação Veículo Column -->
          <ng-container matColumnDef="situacaoVeiculo">
            <mat-header-cell *matHeaderCellDef class="min-w-64">Veículo</mat-header-cell>
            <mat-cell *matCellDef="let row" class="min-w-64 text-xs text-gray-600 line-clamp-2">{{ row.situacaoVeiculo ?? '—' }}</mat-cell>
          </ng-container>

          <!-- Gravame Column -->
          <ng-container matColumnDef="gravame">
            <mat-header-cell *matHeaderCellDef class="min-w-52">Gravame</mat-header-cell>
            <mat-cell *matCellDef="let row" class="min-w-52 text-xs text-gray-600 line-clamp-2">{{ row.gravame ?? '—' }}</mat-cell>
          </ng-container>

          <!-- Proprietário Column -->
          <ng-container matColumnDef="owner">
            <mat-header-cell *matHeaderCellDef class="min-w-52">Proprietário</mat-header-cell>
            <mat-cell *matCellDef="let row" class="min-w-52 text-sm">{{ row.owner }}</mat-cell>
          </ng-container>

          <!-- Último CRLV Column -->
          <ng-container matColumnDef="ultimoCrlv">
            <mat-header-cell *matHeaderCellDef class="min-w-32 justify-center">Último CRLV</mat-header-cell>
            <mat-cell *matCellDef="let row" class="min-w-32 justify-center text-sm">{{ row.ultimoCrlv ?? '—' }}</mat-cell>
          </ng-container>

          <!-- Situação Recall Column -->
          <ng-container matColumnDef="situacaoRecall">
            <mat-header-cell *matHeaderCellDef class="min-w-32 justify-center">Situação Recall</mat-header-cell>
            <mat-cell *matCellDef="let row" class="min-w-32 justify-center text-sm">{{ row.situacaoRecall ?? 'N/C' }}</mat-cell>
          </ng-container>

          <!-- IPVA Column -->
          <ng-container matColumnDef="ipva">
            <mat-header-cell *matHeaderCellDef class="min-w-28 justify-end">IPVA</mat-header-cell>
            <mat-cell *matCellDef="let row" class="min-w-28 justify-end font-mono text-sm">{{ row.ipva ?? 'R$ -' }}</mat-cell>
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
              >{{ row.multas ?? 'NADA CONSTA' }}</span>
            </mat-cell>
          </ng-container>

          <div *matNoDataRow class="no-data-row">
            <mat-icon class="text-gray-300 w-16 h-16" svgIcon="mat_outline:directions_car"></mat-icon>
            <span class="text-xl font-medium text-gray-400">Nenhum veículo encontrado</span>
          </div>

          <mat-header-row *matHeaderRowDef="displayedColumns(); sticky: true"></mat-header-row>
          <mat-row *matRowDef="let row; columns: displayedColumns()" class="cursor-pointer" (click)="vehicleClick.emit(row.id)"></mat-row>
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
export class VehiclesListComponent {
  visibleColumns = input<string[]>(VEHICLES_TABLE_COLUMNS.map((c) => c.key));
  vehicles = input<VehicleDto[]>();
  isLoading = input<boolean>();
  readonly vehicleClick = output<string>();

  protected readonly displayedColumns = computed(() => this.visibleColumns() ?? []);

  onRowClick(vehicle: VehicleDto) {
    this.vehicleClick.emit(vehicle.id);
  }
}
