import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewPreSalesImportDialogComponent } from '../../modules/pre-sales/containers/new-pre-sales-import-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class HeaderBatchDialogService {
  constructor(private readonly dialog: MatDialog) {}

  open() {
    this.dialog.open(NewPreSalesImportDialogComponent, {
      width: '80%',
      maxWidth: 680,
      autoFocus: 'dialog',
    });
  }
}
