import { CommonModule } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { TableColumnDef } from 'app/layout/common/table-column-management/table-column-management.component';
import { PreSaleImportHistoryResponseDto } from '../models/pre-sales.types';
import { QueryCategoryPipe } from '../pipes/query-category.pipe';
import { QueryTypePipe } from '../pipes/query-type.pipe';
import { PreSalesStatusTagComponent } from './pre-sales-status-tag.component';

export const PRE_SALES_TABLE_COLUMNS: TableColumnDef[] = [
  { key: 'status', label: 'pre-sales.table.status' },
  { key: 'customId', label: 'pre-sales.table.customId' },
  { key: 'createdAt', label: 'pre-sales.table.createdDate' },
  { key: 'queryType', label: 'pre-sales.table.type' },
  { key: 'queryCategory', label: 'pre-sales.table.category' },
  { key: 'name', label: 'pre-sales.table.name' },
  { key: 'totalRecords', label: 'pre-sales.table.totalRecords' },
  { key: 'enabledVehicles', label: 'Liberados' },
  { key: 'blockedVehicles', label: 'Bloqueados' },
  { key: 'menu', label: 'Menu' },
];

@Component({
  selector: 'app-pre-sales-list',
  imports: [
    MatCell,
    TranslocoModule,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatButtonModule,
    MatCellDef,
    MatHeaderCellDef,
    MatIcon,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    RouterLink,
    MatProgressSpinnerModule,
    CommonModule,
    PreSalesStatusTagComponent,
    MatTooltip,
    MatNoDataRow,
    MatSort,
    MatSortHeader,
    QueryCategoryPipe,
    QueryTypePipe,
  ],
  template: `
    @if (!displayedColumns()?.length) {
      <div class="table-columns-empty">
        <mat-icon>settings</mat-icon>
        <span class="text-sm text-secondary">Selecione as colunas no ícone de engrenagem</span>
      </div>
    } @else {
      <div class="grow flex">
        @let dataSet = batches() ?? [];

        <mat-table [dataSource]="dataSet" matSort (matSortChange)="onSortChange($event)" class="grow">
          <!-- Status Column -->
          <ng-container matColumnDef="status">
            <mat-header-cell *matHeaderCellDef mat-sort-header class="min-w-44">{{ 'pre-sales.table.status' | transloco }}
            </mat-header-cell>
            <mat-cell *matCellDef="let element" class="min-w-44">
              <app-pre-sales-status-tag [status]="element.status"></app-pre-sales-status-tag>
            </mat-cell>
          </ng-container>

          <!-- Custom ID Column -->
          <ng-container matColumnDef="customId">
            <mat-header-cell *matHeaderCellDef mat-sort-header class="min-w-32">{{ 'pre-sales.table.customId' | transloco }}
            </mat-header-cell>
            <mat-cell *matCellDef="let element" class="min-w-32"> {{ element.customId }}</mat-cell>
          </ng-container>

          <!-- Created Date Column -->
          <ng-container matColumnDef="createdAt">
            <mat-header-cell *matHeaderCellDef mat-sort-header class="min-w-48">{{ 'pre-sales.table.createdDate' | transloco }}
            </mat-header-cell>
            <mat-cell *matCellDef="let element" class="min-w-48"> {{ element.createdAt | date:'short' }}
            </mat-cell>
          </ng-container>

          <!-- Query Type Column -->
          <ng-container matColumnDef="queryType">
            <mat-header-cell *matHeaderCellDef mat-sort-header class="shrink-0 min-w-24">{{ 'pre-sales.table.type' | transloco }}
            </mat-header-cell>
            <mat-cell *matCellDef="let element"
                      class="shrink-0 min-w-24"> {{ element.queryType | queryType | transloco }}
            </mat-cell>
          </ng-container>

          <!-- Query Category Column -->
          <ng-container matColumnDef="queryCategory">
            <mat-header-cell *matHeaderCellDef mat-sort-header class="shrink-0 min-w-24">{{ 'pre-sales.table.category' | transloco }}
            </mat-header-cell>
            <mat-cell *matCellDef="let element"
                      class="shrink-0 min-w-24"> {{ element.queryCategory | queryCategory | transloco }}
            </mat-cell>
          </ng-container>

          <!-- Name Column -->
          <ng-container matColumnDef="name">
            <mat-header-cell *matHeaderCellDef mat-sort-header class="shrink-0 min-w-80">{{ 'pre-sales.table.name' | transloco }}
            </mat-header-cell>
            <mat-cell *matCellDef="let element" class="shrink-0 min-w-80">{{ element.name }}</mat-cell>
          </ng-container>

          <!-- Total records Column -->
          <ng-container matColumnDef="totalRecords">
            <mat-header-cell *matHeaderCellDef mat-sort-header
                            class="min-w-32 justify-center">{{ 'pre-sales.table.totalRecords' | transloco }}
            </mat-header-cell>
            <mat-cell *matCellDef="let element"
                      class="min-w-32 justify-center">{{ element.totalRecords | number }}
            </mat-cell>
          </ng-container>

          <!-- Enabled Vehicles Column -->
          <ng-container matColumnDef="enabledVehicles">
            <mat-header-cell *matHeaderCellDef mat-sort-header class="min-w-28 justify-center">Liberados</mat-header-cell>
            <mat-cell *matCellDef="let element" class="min-w-28 justify-center">0</mat-cell>
          </ng-container>

          <!-- Blocked Vehicles Column -->
          <ng-container matColumnDef="blockedVehicles">
            <mat-header-cell *matHeaderCellDef mat-sort-header class="min-w-28 justify-center">Bloqueados</mat-header-cell>
            <mat-cell *matCellDef="let element" class="min-w-28 justify-center">0</mat-cell>
          </ng-container>

          <!-- Menu Column -->
          <ng-container matColumnDef="menu">
            <mat-header-cell *matHeaderCellDef class="min-w-32"></mat-header-cell>
            <mat-cell *matCellDef="let element" class="min-w-32 justify-end">
              <div class="flex gap-1" (click)="$event.stopPropagation()">
                <a mat-icon-button [disabled]="!element.reportUrl" target="_blank" [matTooltip]="'Baixar relatório'"
                  [href]="element.reportUrl">
                  <mat-icon>file_download</mat-icon>
                </a>
                <button mat-icon-button [matTooltip]="'Ver Dashboard'" (click)="dashboardClick.emit(element.id)">
                  <mat-icon>stacked_bar_chart</mat-icon>
                </button>
              </div>
            </mat-cell>
          </ng-container>

          <div *matNoDataRow class="no-data-row">
            <mat-icon class="text-gray-300 w-16 h-16" [svgIcon]="'heroicons_outline:clipboard-document-check'"></mat-icon>
            <span class="text-xl font-medium text-gray-400">{{ 'pre-sales.list.no-batches' | transloco }}</span>
          </div>

          <mat-header-row *matHeaderRowDef="displayedColumns(); sticky: true"></mat-header-row>
          <mat-row *matRowDef="let row; columns: displayedColumns()" class="cursor-pointer" [routerLink]="[row.id]"></mat-row>
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
export class PreSalesTableComponent {
  protected readonly visibleColumns = input<string[]>(PRE_SALES_TABLE_COLUMNS.map((c) => c.key));
  protected readonly batches = input<PreSaleImportHistoryResponseDto[]>();
  protected readonly isLoading = input<boolean>();

  protected sortChange = output<Sort>();
  protected dashboardClick = output<string>();

  protected readonly displayedColumns = computed(() => this.visibleColumns() ?? []);

  onSortChange(event: Sort): void {
    this.sortChange.emit(event);
  }
}
