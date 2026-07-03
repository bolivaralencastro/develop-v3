import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { PreSalesApi } from './pre-sales-api';
import { NewPreSalesImportDialogViewMode } from '../containers/new-pre-sales-import-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PRE_SALE_QUERY_CATEGORY, PRE_SALE_QUERY_TYPE, PreSaleImportHistoryResponseDto } from '../models/pre-sales.types';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@ngneat/transloco';

const DEFAULT_ERROR_MESSAGE = 'default-upload-error-message';

@Injectable()
export class PreSalesImportDialogService {
  readonly viewMode = signal<NewPreSalesImportDialogViewMode>('form');
  readonly title = computed(() => (this.viewMode() === 'form' ? 'pre-sales.upload-dialog.title' : 'pre-sales.upload-dialog.upload-success-title'));
  readonly uploading = signal(false);
  readonly lastCreatedImport = signal<PreSaleImportHistoryResponseDto | undefined>(undefined);
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly batchApi: PreSalesApi,
    private readonly snackbar: MatSnackBar,
    private readonly transloco: TranslocoService,
  ) {}

  uploadFile(file: File, category: PRE_SALE_QUERY_CATEGORY, type: PRE_SALE_QUERY_TYPE) {
    this.createFileUpload(file, category, type);
  }

  reset() {
    this.viewMode.set('form');
    this.lastCreatedImport.set(undefined);
  }

  private createFileUpload(file: File, category: PRE_SALE_QUERY_CATEGORY, type: PRE_SALE_QUERY_TYPE) {
    this.lastCreatedImport.set(undefined);
    this.uploading.set(true);
    this.batchApi
      .create(file, category, type)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => this.handleResult(result),
        error: (error) => this.handleError(error),
      });
  }

  private handleResult(result: PreSaleImportHistoryResponseDto) {
    this.lastCreatedImport.set(result);
    this.viewMode.set('result');
    this.uploading.set(false);
  }

  private handleError(error: any) {
    this.uploading.set(false);
    const message = error?.error?.message || DEFAULT_ERROR_MESSAGE;
    this.snackbar.open(this.transloco.translate(message), this.transloco.translate('close'), {
      duration: 10000,
      panelClass: 'error-snackbar',
    });
  }
}
