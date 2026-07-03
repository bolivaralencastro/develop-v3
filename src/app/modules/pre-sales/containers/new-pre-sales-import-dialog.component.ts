import { Component, computed, OnDestroy, Signal, viewChild } from '@angular/core';
import { PreSalesImportDialogService } from '../services/pre-sales-import-dialog.service';
import { PreSalesFileUploadFormComponent } from '../components/pre-sales-file-upload-form.component';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatAnchor, MatButton } from '@angular/material/button';
import { PreSalesUploadResultComponent } from '../components/pre-sales-upload-result.component';
import { TranslocoModule } from '@ngneat/transloco';
import { PRE_SALE_QUERY_CATEGORY, PRE_SALE_QUERY_TYPE, PreSaleImportHistoryResponseDto } from '../models/pre-sales.types';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';

export type NewPreSalesImportDialogViewMode = 'form' | 'result';

@Component({
  selector: 'app-new-batch-dialog',
  providers: [PreSalesImportDialogService],
  imports: [
    PreSalesFileUploadFormComponent,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    PreSalesUploadResultComponent,
    TranslocoModule,
    MatAnchor,
    MatProgressSpinner,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
  ],
  template: `
    <h2 mat-dialog-title class="text-xl font-medium mb-4">{{ title() | transloco }}</h2>
    <mat-dialog-content>
      <app-pre-sales-file-upload-form #fileUpload [class.hidden]="displayResult()" [uploading]=""></app-pre-sales-file-upload-form>
      <form [formGroup]="newQueryForm" class="mt-6 flex gap-6" [class.hidden]="displayResult()">
        <mat-form-field class="w-full">
          <mat-label>Tipo</mat-label>
          <mat-select [formControlName]="'queryType'">
            <mat-option [value]="PRE_SALE_QUERY_TYPE.PRE_SALES">Pré-venda</mat-option>
            <mat-option [value]="PRE_SALE_QUERY_TYPE.QUARTERLY">Trimestral</mat-option>
            <mat-option [value]="PRE_SALE_QUERY_TYPE.SPECIAL">Especial</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field class="w-full">
          <mat-label>Categoria</mat-label>
          <mat-select [formControlName]="'queryCategory'">
            <mat-option [value]="PRE_SALE_QUERY_CATEGORY.FLEET">Fleet</mat-option>
            <mat-option [value]="PRE_SALE_QUERY_CATEGORY.RAC">RAC</mat-option>
            <mat-option [value]="PRE_SALE_QUERY_CATEGORY.FREE">Livre</mat-option>
          </mat-select>
        </mat-form-field>
      </form>

      <app-pre-sales-upload-result [class.hidden]="displayForm()" [preSales]="lastCreatedImport()"></app-pre-sales-upload-result>
    </mat-dialog-content>
    <mat-dialog-actions>
      @if (displayForm()) {
        <a mat-button [href]="preSalesModelAssetPath" download="modelo-pre-vendas.xlsx">{{ 'pre-sales.upload-dialog.download-sample' | transloco }}</a>
      }
      <button class="ml-auto" mat-button mat-dialog-close>{{ 'cancel' | transloco }}</button>
      @if (displayForm()) {
        <button mat-button color="primary" [disabled]="uploadButtonDisabled() || newQueryForm.invalid" (click)="createPreSale(fileUpload.selectedFile())">
          <div class="flex gap-2 items-center">
            @if (uploading()) {
              <mat-spinner diameter="20"></mat-spinner>
            }
            <span>
              {{ 'pre-sales.upload-dialog.send' | transloco }}
            </span>
          </div>
        </button>
      } @else {
        <button mat-button color="primary" (click)="reset()">{{ 'pre-sales.upload-dialog.new-query' | transloco }}</button>
      }
    </mat-dialog-actions>
  `,
})
export class NewPreSalesImportDialogComponent implements OnDestroy {
  protected readonly viewMode: Signal<NewPreSalesImportDialogViewMode>;
  protected readonly title: Signal<string>;
  protected uploading: Signal<boolean>;
  protected readonly lastCreatedImport: Signal<PreSaleImportHistoryResponseDto>;
  protected readonly displayForm = computed(() => this.viewMode() === 'form');
  protected readonly displayResult = computed(() => this.viewMode() === 'result');
  private readonly fileUpload = viewChild(PreSalesFileUploadFormComponent);
  protected readonly uploadButtonDisabled = computed(() => !this.fileUpload()?.selectedFile() || this.uploading());
  protected readonly preSalesModelAssetPath = 'assets/spreadsheets/modelo-pre-vendas.xlsx';

  protected readonly newQueryForm = new FormGroup({
    queryType: new FormControl<PRE_SALE_QUERY_TYPE>(null, [Validators.required]),
    queryCategory: new FormControl<PRE_SALE_QUERY_CATEGORY>(null, [Validators.required]),
  });

  constructor(private readonly preSalesImportDialogService: PreSalesImportDialogService) {
    this.viewMode = this.preSalesImportDialogService.viewMode;
    this.title = this.preSalesImportDialogService.title;
    this.lastCreatedImport = this.preSalesImportDialogService.lastCreatedImport;
    this.uploading = this.preSalesImportDialogService.uploading;
  }

  protected createPreSale(file: File) {
    const { queryType, queryCategory } = this.newQueryForm.value;
    this.preSalesImportDialogService.uploadFile(file, queryCategory, queryType);
  }

  reset() {
    this.fileUpload().removeCurrentFile();
    this.newQueryForm.reset();
    this.preSalesImportDialogService.reset();
  }

  ngOnDestroy() {
    this.reset();
  }

  protected readonly PRE_SALE_QUERY_CATEGORY = PRE_SALE_QUERY_CATEGORY;
  protected readonly PRE_SALE_QUERY_TYPE = PRE_SALE_QUERY_TYPE;
}
