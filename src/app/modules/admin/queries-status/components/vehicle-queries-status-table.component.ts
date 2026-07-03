import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
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
import { VehicleHistoryStatusTagComponent } from '../../../pre-sales/components/vehicle-history-status-tag.component';
import { PreSaleImportHistoryVehicleResponseDto } from '../../../pre-sales/models/pre-sales.types';

@Component({
  selector: 'app-vehicle-queries-status-table',
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
    <div class="grow">
      @let dataSet = vehicles();
      <mat-table [dataSource]="dataSet" matSort (matSortChange)="onSortChange($event)">

        <!-- status Column -->
        <ng-container matColumnDef="status">
          <mat-header-cell *matHeaderCellDef mat-sort-header
                           class="min-w-24 max-w-24">{{ 'pre-sales.vehicle-history.status' | transloco }}
          </mat-header-cell>
          <mat-cell *matCellDef="let element" class="min-w-24 max-w-24">
            <app-vehicle-history-status-tag [status]="element.status" [matTooltip]="element.errorMessage" />
          </mat-cell>
        </ng-container>

        <!-- lineNumber Column -->
        <ng-container matColumnDef="lineNumber">
          <mat-header-cell
            *matHeaderCellDef
            class="min-w-14 max-w-14 justify-center">{{ 'pre-sales.vehicle-history.lineNumber' | transloco }}
          </mat-header-cell>
          <mat-cell *matCellDef="let element" class="min-w-14 max-w-14 justify-center">{{ element.lineNumber | number }}
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
            class="min-w-30 max-w-30">{{ 'pre-sales.vehicle-history.state' | transloco }}
          </mat-header-cell>
          <mat-cell *matCellDef="let element" class="min-w-30 max-w-30">{{ element.vehicle?.state }}
          </mat-cell>
        </ng-container>

        <!-- vehicle Column -->
        <ng-container matColumnDef="vehicle">
          <mat-header-cell
            *matHeaderCellDef mat-sort-header
            class="min-w-30 max-w-30">{{ 'pre-sales.vehicle-history.vehicle' | transloco }}
          </mat-header-cell>
          <mat-cell *matCellDef="let element" class="min-w-30 max-w-30">
            <app-vehicle-history-status-tag [status]="element.statusFines" />
          </mat-cell>
        </ng-container>

        <!-- gravame status Column -->
        <ng-container matColumnDef="gravameStatus">
          <mat-header-cell *matHeaderCellDef mat-sort-header
                           class="min-w-30 max-w-30">{{ 'pre-sales.vehicle-history.gravame-status' | transloco }}
          </mat-header-cell>
          <mat-cell *matCellDef="let element" class="min-w-30 max-w-30">
            <app-vehicle-history-status-tag [status]="element.statusGravame" />
          </mat-cell>
        </ng-container>

        <!-- owner pr status Column -->
        <ng-container matColumnDef="ownerPrStatus">
          <mat-header-cell *matHeaderCellDef mat-sort-header
                           class="min-w-30 max-w-30">{{ 'pre-sales.vehicle-history.owner' | transloco }}
          </mat-header-cell>
          <mat-cell *matCellDef="let element" class="min-w-30 max-w-30">
            <app-vehicle-history-status-tag [status]="element.statusOwnerPr" />
          </mat-cell>
        </ng-container>

        <!-- licensing Column -->
        <ng-container matColumnDef="licensing">
          <mat-header-cell *matHeaderCellDef mat-sort-header
                           class="min-w-30 max-w-30">{{ 'pre-sales.vehicle-history.licensing' | transloco }}
          </mat-header-cell>
          <mat-cell *matCellDef="let element" class="min-w-30 max-w-30">
            <app-vehicle-history-status-tag [status]="element.statusFines" />
          </mat-cell>
        </ng-container>

        <!-- recall status Column -->
        <ng-container matColumnDef="recallStatus">
          <mat-header-cell *matHeaderCellDef mat-sort-header
                           class="min-w-30 max-w-30">{{ 'pre-sales.vehicle-history.recall-status' | transloco }}
          </mat-header-cell>
          <mat-cell *matCellDef="let element" class="min-w-30 max-w-30">
            <app-vehicle-history-status-tag [status]="element.statusRecall" />
          </mat-cell>
        </ng-container>

        <!-- ipva Column -->
        <ng-container matColumnDef="ipva">
          <mat-header-cell *matHeaderCellDef mat-sort-header
                           class="min-w-30 max-w-30">{{ 'pre-sales.vehicle-history.ipva' | transloco }}
          </mat-header-cell>
          <mat-cell *matCellDef="let element" class="min-w-30 max-w-30">
            <app-vehicle-history-status-tag [status]="element.statusFines" />
          </mat-cell>
        </ng-container>

        <!-- fines status Column -->
        <ng-container matColumnDef="fineStatus">
          <mat-header-cell *matHeaderCellDef mat-sort-header
                           class="min-w-30 max-w-30">{{ 'pre-sales.vehicle-history.fines-status' | transloco }}
          </mat-header-cell>
          <mat-cell *matCellDef="let element" class="min-w-30 max-w-30">
            <app-vehicle-history-status-tag [status]="element.statusFines" />
          </mat-cell>
        </ng-container>

        <div *matNoDataRow class="flex flex-col justify-center items-center text-xl mt-5 gap-2">
          <mat-icon class="text-gray-300 w-16 h-16" [svgIcon]="'mat_outline:directions_car'"></mat-icon>
          <span class="text-xl font-medium text-gray-400">{{ 'pre-sales.vehicle-history.no-vehicles' | transloco }}</span>
        </div>

        <mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></mat-header-row>
        <mat-row *matRowDef="let row; columns: displayedColumns" class="cursor-pointer" (click)="onRowClick(row)"></mat-row>
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

    .mat-column-status {
      max-width: 130px;
    }

    .mat-column-placa,
    .mat-column-renavam {
      max-width: 160px;
    }

    .mat-column-lineNumber {
      max-width: 80px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleQueriesStatusTableComponent {
  protected displayedColumns: string[] = [
    'status',
    'lineNumber',
    'placa',
    'renavam',
    'chassi',
    'state',
    'vehicle',
    'gravameStatus',
    'ownerPrStatus',
    'licensing',
    'recallStatus',
    'ipva',
    'fineStatus',
  ];
  protected readonly vehicles = input<PreSaleImportHistoryVehicleResponseDto[]>();
  protected readonly isLoading = input<boolean>();
  protected readonly sortChange = output<Sort>();
  readonly vehicleClick = output<string>();

  onSortChange(event: Sort) {
    this.sortChange.emit(event);
  }

  onRowClick(row: PreSaleImportHistoryVehicleResponseDto) {
    this.vehicleClick.emit(row?.vehicle?.id);
  }
}
