import { DecimalPipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
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
import { MatTooltip } from '@angular/material/tooltip';
import { TranslocoModule } from '@ngneat/transloco';
import { TableColumnDef } from 'app/layout/common/table-column-management/table-column-management.component';
import { PreSaleImportHistoryVehicleResponseDto } from '../models/pre-sales.types';
import { VehicleHistoryStatusTagComponent } from './vehicle-history-status-tag.component';

export const VEHICLE_HISTORY_TABLE_COLUMNS: TableColumnDef[] = [
  { key: 'status', label: 'pre-sales.vehicle-history.status' },
  { key: 'lineNumber', label: 'pre-sales.vehicle-history.lineNumber' },
  { key: 'placa', label: 'pre-sales.vehicle-history.placa' },
  { key: 'renavam', label: 'pre-sales.vehicle-history.renavam' },
  { key: 'chassi', label: 'pre-sales.vehicle-history.chassi' },
  { key: 'state', label: 'pre-sales.vehicle-history.state' },
  { key: 'vehicle', label: 'pre-sales.vehicle-history.vehicle' },
  { key: 'gravameStatus', label: 'pre-sales.vehicle-history.gravame-status' },
  { key: 'ownerPrStatus', label: 'pre-sales.vehicle-history.owner' },
  { key: 'licensing', label: 'pre-sales.vehicle-history.licensing' },
  { key: 'recallStatus', label: 'pre-sales.vehicle-history.recall-status' },
  { key: 'ipva', label: 'pre-sales.vehicle-history.ipva' },
  { key: 'fineStatus', label: 'pre-sales.vehicle-history.fines-status' },
];

@Component({
  selector: 'app-vehicle-history-table',
  imports: [
    DecimalPipe,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatRow,
    MatRowDef,
    MatTable,
    MatHeaderCellDef,
    TranslocoModule,
    VehicleHistoryStatusTagComponent,
    MatTooltip,
    MatSortHeader,
    MatSort,
    MatNoDataRow,
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
        <mat-table [dataSource]="dataSet" matSort (matSortChange)="onSortChange($event)" class="grow">

          <!-- status Column -->
          <ng-container matColumnDef="status">
            <mat-header-cell *matHeaderCellDef mat-sort-header
                             class="min-w-24">{{ 'pre-sales.vehicle-history.status' | transloco }}
            </mat-header-cell>
            <mat-cell *matCellDef="let element" class="min-w-24">
              <app-vehicle-history-status-tag [status]="element.status" [matTooltip]="element.errorMessage" />
            </mat-cell>
          </ng-container>

          <!-- lineNumber Column -->
          <ng-container matColumnDef="lineNumber">
            <mat-header-cell
              *matHeaderCellDef
              class="min-w-14 justify-center">{{ 'pre-sales.vehicle-history.lineNumber' | transloco }}
            </mat-header-cell>
            <mat-cell *matCellDef="let element" class="min-w-14 justify-center">{{ element.lineNumber | number }}
            </mat-cell>
          </ng-container>

          <!-- placa Column -->
          <ng-container matColumnDef="placa">
            <mat-header-cell *matHeaderCellDef mat-sort-header class="min-w-30">{{ 'pre-sales.vehicle-history.placa' | transloco }}
            </mat-header-cell>
            <mat-cell
              *matCellDef="let element"
              class="min-w-30">{{ element.vehicle?.numberPlate || 'pre-sales.vehicle-history.import-error' | transloco }}
            </mat-cell>
          </ng-container>

          <!-- renavam Column -->
          <ng-container matColumnDef="renavam">
            <mat-header-cell *matHeaderCellDef mat-sort-header class="min-w-30">{{ 'pre-sales.vehicle-history.renavam' | transloco }}
            </mat-header-cell>
            <mat-cell *matCellDef="let element" class="min-w-30">{{ element.vehicle?.renavam }}</mat-cell>
          </ng-container>

          <!-- chassi Column -->
          <ng-container matColumnDef="chassi">
            <mat-header-cell *matHeaderCellDef mat-sort-header class="min-w-44">{{ 'pre-sales.vehicle-history.chassi' | transloco }}
            </mat-header-cell>
            <mat-cell *matCellDef="let element" class="min-w-44">{{ element.vehicle?.chassi }}</mat-cell>
          </ng-container>

          <!-- state Column -->
          <ng-container matColumnDef="state">
            <mat-header-cell
              *matHeaderCellDef mat-sort-header
              class="min-w-30">{{ 'pre-sales.vehicle-history.state' | transloco }}
            </mat-header-cell>
            <mat-cell *matCellDef="let element" class="min-w-30">{{ element.vehicle?.state }}
            </mat-cell>
          </ng-container>

          <!-- vehicle Column -->
          <ng-container matColumnDef="vehicle">
            <mat-header-cell
              *matHeaderCellDef mat-sort-header
              class="min-w-30">{{ 'pre-sales.vehicle-history.vehicle' | transloco }}
            </mat-header-cell>
            <mat-cell *matCellDef="let element" class="min-w-30">
              <app-vehicle-history-status-tag [status]="element.statusFines" />
            </mat-cell>
          </ng-container>

          <!-- gravame status Column -->
          <ng-container matColumnDef="gravameStatus">
            <mat-header-cell *matHeaderCellDef mat-sort-header
                             class="min-w-30">{{ 'pre-sales.vehicle-history.gravame-status' | transloco }}
            </mat-header-cell>
            <mat-cell *matCellDef="let element" class="min-w-30">
              <app-vehicle-history-status-tag [status]="element.statusGravame" />
            </mat-cell>
          </ng-container>

          <!-- owner pr status Column -->
          <ng-container matColumnDef="ownerPrStatus">
            <mat-header-cell *matHeaderCellDef mat-sort-header
                             class="min-w-30">{{ 'pre-sales.vehicle-history.owner' | transloco }}
            </mat-header-cell>
            <mat-cell *matCellDef="let element" class="min-w-30">
              <app-vehicle-history-status-tag [status]="element.statusOwnerPr" />
            </mat-cell>
          </ng-container>

          <!-- licensing Column -->
          <ng-container matColumnDef="licensing">
            <mat-header-cell *matHeaderCellDef mat-sort-header
                             class="min-w-30">{{ 'pre-sales.vehicle-history.licensing' | transloco }}
            </mat-header-cell>
            <mat-cell *matCellDef="let element" class="min-w-30">
              <app-vehicle-history-status-tag [status]="element.statusFines" />
            </mat-cell>
          </ng-container>

          <!-- recall status Column -->
          <ng-container matColumnDef="recallStatus">
            <mat-header-cell *matHeaderCellDef mat-sort-header
                             class="min-w-30">{{ 'pre-sales.vehicle-history.recall-status' | transloco }}
            </mat-header-cell>
            <mat-cell *matCellDef="let element" class="min-w-30">
              <app-vehicle-history-status-tag [status]="element.statusRecall" />
            </mat-cell>
          </ng-container>

          <!-- ipva Column -->
          <ng-container matColumnDef="ipva">
            <mat-header-cell *matHeaderCellDef mat-sort-header
                             class="min-w-30">{{ 'pre-sales.vehicle-history.ipva' | transloco }}
            </mat-header-cell>
            <mat-cell *matCellDef="let element" class="min-w-30">
              <app-vehicle-history-status-tag [status]="element.statusFines" />
            </mat-cell>
          </ng-container>

          <!-- fines status Column -->
          <ng-container matColumnDef="fineStatus">
            <mat-header-cell *matHeaderCellDef mat-sort-header
                             class="min-w-30">{{ 'pre-sales.vehicle-history.fines-status' | transloco }}
            </mat-header-cell>
            <mat-cell *matCellDef="let element" class="min-w-30">
              <app-vehicle-history-status-tag [status]="element.statusFines" />
            </mat-cell>
          </ng-container>

          <div *matNoDataRow class="no-data-row">
            <mat-icon class="text-gray-300 w-16 h-16" [svgIcon]="'mat_outline:directions_car'"></mat-icon>
            <span class="text-xl font-medium text-gray-400">{{ 'pre-sales.vehicle-history.no-vehicles' | transloco }}</span>
          </div>

          <mat-header-row *matHeaderRowDef="displayedColumns(); sticky: true"></mat-header-row>
          <mat-row *matRowDef="let row; columns: displayedColumns()" class="cursor-pointer" (click)="onRowClick(row)"></mat-row>
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
export class VehicleHistoryTableComponent {
  protected readonly visibleColumns = input<string[]>(VEHICLE_HISTORY_TABLE_COLUMNS.map((c) => c.key));
  protected readonly vehicles = input<PreSaleImportHistoryVehicleResponseDto[]>();
  protected readonly isLoading = input<boolean>();
  protected readonly sortChange = output<Sort>();
  readonly vehicleClick = output<string>();

  protected readonly displayedColumns = computed(() => this.visibleColumns() ?? []);

  onSortChange(event: Sort) {
    this.sortChange.emit(event);
  }

  onRowClick(row: PreSaleImportHistoryVehicleResponseDto) {
    this.vehicleClick.emit(row?.vehicle?.id);
  }
}
