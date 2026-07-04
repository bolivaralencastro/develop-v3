import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { QueryDashboardDataService } from '../services';
import { QueryDashboardContentComponent } from './query-dashboard-content/query-dashboard-content.component';

type QueryDashboardData = {
  importHistoryId: string;
  ids?: string[];
  index?: number;
};

@Component({
  selector: 'app-query-dashboard',
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatIcon,
    QueryDashboardContentComponent,
    DatePipe,
    TranslocoModule,
  ],
  template: `
    <div class="query-dashboard-shell">
      <button
        mat-icon-button
        class="query-dashboard-nav query-dashboard-nav--left"
        [disabled]="!canPrev()"
        [class.is-hidden]="!hasNavigation()"
        (click)="goPrev()"
        aria-label="Resumo anterior"
      >
        <mat-icon>chevron_left</mat-icon>
      </button>
      <button
        mat-icon-button
        class="query-dashboard-nav query-dashboard-nav--right"
        [disabled]="!canNext()"
        [class.is-hidden]="!hasNavigation()"
        (click)="goNext()"
        aria-label="Próximo resumo"
      >
        <mat-icon>chevron_right</mat-icon>
      </button>

      <div class="query-dashboard-header">
        <div class="flex flex-col">
          <span class="batch-info">
            Lote: {{ dashboardData()?.queryId || '--' }} &bull;
            {{ dashboardData()?.queryDate ? (dashboardData()?.queryDate | date: 'shortDate') : '--' }}
          </span>
          <h2 class="dialog-title">Resumo da consulta</h2>
        </div>
        <button mat-icon-button mat-dialog-close aria-label="Fechar">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-dialog-content class="query-dashboard-content">
        <app-query-dashboard-content [importHistoryId]="currentImportHistoryId"></app-query-dashboard-content>
      </mat-dialog-content>

      <mat-dialog-actions class="query-dashboard-footer" align="end">
        <button mat-stroked-button class="query-dashboard-secondary-action" (click)="openAlertVehicles()">
          Visualizar veículos com alertas
        </button>
        <button mat-flat-button class="query-dashboard-primary-action" (click)="openBlockedVehicles()">
          Tratar bloqueios pendentes
        </button>
      </mat-dialog-actions>
    </div>
  `,
  providers: [QueryDashboardDataService],
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      max-height: 100%;
    }

    .query-dashboard-shell {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      background: #f8fafc;
      border-radius: 20px;
      overflow: hidden;
    }

    mat-dialog-content {
      flex: 1 1 auto;
      overflow: auto;
      max-height: calc(90vh - 180px);
      padding: 0 !important;
    }

    .query-dashboard-footer {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      padding: 16px 24px !important;
      border-top: 1px solid #e2e8f0;
      background: #f8fafc;
    }

    .query-dashboard-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #e2e8f0;
      padding: 20px 24px;
      background: #f8fafc;
    }

    .query-dashboard-primary-action {
      background-color: #0f172a !important;
      color: #ffffff !important;
      border-radius: 10px;
      font-weight: 700;
    }

    .query-dashboard-secondary-action {
      border-color: #0f172a !important;
      color: #0f172a !important;
      border-radius: 10px;
      font-weight: 700;
    }

    .batch-info {
      font-size: 11px;
      font-weight: 800;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .dialog-title {
      font-size: 20px;
      font-weight: 800;
      color: #0f172a;
      margin-top: 4px;
    }

    .query-dashboard-nav {
      position: fixed;
      top: 50%;
      transform: translateY(-50%);
      z-index: 20;
      background: white !important;
      border: 1px solid #e2e8f0 !important;
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12);
    }

    .query-dashboard-nav--left {
      left: calc((100vw - min(92vw, 1200px)) / 2 - 56px);
    }

    .query-dashboard-nav--right {
      right: calc((100vw - min(92vw, 1200px)) / 2 - 56px);
    }

    .query-dashboard-nav.is-hidden {
      display: none !important;
    }
  `,
})
export class QueryDashboardComponent {
  protected readonly data = inject<QueryDashboardData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<QueryDashboardComponent>);
  private readonly dashboardService = inject(QueryDashboardDataService);
  private readonly router = inject(Router);
  protected readonly dashboardData = this.dashboardService.dashboardData;
  protected readonly ids = this.data.ids ?? [this.data.importHistoryId];
  protected currentIndex = this.data.index ?? 0;
  protected currentImportHistoryId = this.ids[this.currentIndex] ?? this.data.importHistoryId;

  constructor() {
    this.dashboardService.loadDataForImportHistory(this.currentImportHistoryId);
  }

  protected hasNavigation() {
    return this.ids.length > 1;
  }

  protected canPrev() {
    return this.currentIndex > 0;
  }

  protected canNext() {
    return this.currentIndex < this.ids.length - 1;
  }

  protected goPrev() {
    if (!this.canPrev()) {
      return;
    }

    this.currentIndex -= 1;
    this.updateCurrentId();
  }

  protected goNext() {
    if (!this.canNext()) {
      return;
    }

    this.currentIndex += 1;
    this.updateCurrentId();
  }

  protected openAlertVehicles() {
    this.router.navigate(['/veiculos/liberados-alerta']);
    this.dialogRef.close();
  }

  protected openBlockedVehicles() {
    this.router.navigate(['/veiculos/bloqueados']);
    this.dialogRef.close();
  }

  private updateCurrentId() {
    this.currentImportHistoryId = this.ids[this.currentIndex] ?? this.currentImportHistoryId;
    this.dashboardService.loadDataForImportHistory(this.currentImportHistoryId);
  }
}
