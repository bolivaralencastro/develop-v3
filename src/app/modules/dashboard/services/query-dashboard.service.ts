import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { QueryDashboardComponent } from '../containers/query-dashboard.component';

const DIALOG_CONFIG = {
  width: 'min(92vw, 1200px)',
  maxWidth: '1200px',
  maxHeight: '90vh',
  panelClass: 'query-dashboard-panel',
  autoFocus: 'dialog',
} as const;

@Injectable({
  providedIn: 'root',
})
export class QueryDashboardService {
  private readonly dialog = inject(MatDialog);

  openFromList(ids: string[], index: number) {
    this.dialog.open(QueryDashboardComponent, {
      ...DIALOG_CONFIG,
      data: { importHistoryId: ids[index], ids, index },
    });
  }

  openFromDetail(importHistoryId: string) {
    this.dialog.open(QueryDashboardComponent, {
      ...DIALOG_CONFIG,
      data: { importHistoryId },
    });
  }
}
