import { Component, computed, input } from '@angular/core';
import { MatAnchor } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatDialogClose } from '@angular/material/dialog';
import { TranslocoModule } from '@ngneat/transloco';
import { PreSaleImportHistoryResponseDto } from '../models/pre-sales.types';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-pre-sales-upload-result',
  imports: [MatAnchor, RouterLink, MatDialogClose, TranslocoModule, MatIcon],
  template: ` <div class="flex flex-col w-full gap-4">
    <div class="flex gap-2 justify-between items-center">
      <p class="max-w-prose text-lg grow">{{ 'pre-sales.upload-result.success-label' | transloco }}</p>
      <a mat-button mat-dialog-close [routerLink]="itemLink()" color="primary">{{ 'pre-sales.upload-result.go-to-batch' | transloco }}</a>
    </div>
    <div>
      <div class="flex gap-1 mb-2">
        <mat-icon [svgIcon]="'heroicons_outline:document-text'"></mat-icon>
        <span>{{ 'pre-sales.upload-result.file-details' | transloco }}</span>
      </div>
      <div class="flex gap-1 justify-between border-b py-2">
        <span>{{ 'pre-sales.upload-result.total-vehicles' | transloco }}</span>
        <span class="text-lg font-medium">{{ preSales()?.totalRecords }}</span>
      </div>
      <div class="flex gap-1 justify-between py-2">
        <span>{{ 'pre-sales.upload-result.total-errors' | transloco }}</span>
        <span class="text-lg font-medium">{{ preSales()?.errorCount }}</span>
      </div>
    </div>
    <!--Error list-->
    @if (preSales()?.errorCount) {
      <div>
        <div class="flex gap-1 mb-4">
          <mat-icon [svgIcon]="'heroicons_outline:exclamation-triangle'"></mat-icon>
          <span>{{ 'pre-sales.upload-result.errors' | transloco }}</span>
        </div>
        <!--Error item-->
        @for (error of preSales()?.errors; track error; let last = $last) {
          <div class="flex flex-col gap-1 mb-3" [class.border-b]="!last">
            <p class="flex  justify-between gap-2 grow">
              <span class="font-medium">{{ error.message }}</span>
              <span class="text-sm bg-primary-50 text-on-primary-50 rounded px-2"
                >{{ 'pre-sales.upload-result.line' | transloco }}&nbsp;#{{ error.lineNumber }}</span
              >
            </p>
            <p class="text-sm flex gap-1 justify-between text-hint">
              <span> {{ 'plate' | transloco }}&nbsp;-&nbsp;{{ error.placa }} </span>
              <span> {{ 'chassis' | transloco }}&nbsp;-&nbsp;{{ error.chassi }} </span>
              <span> {{ 'renavam' | transloco }}&nbsp;-&nbsp;{{ error.renavam }} </span>
              <span> {{ 'state' | transloco }}&nbsp;-&nbsp;{{ error.estado }} </span>
            </p>
          </div>
        }
      </div>
    }
  </div>`,
})
export class PreSalesUploadResultComponent {
  preSales = input<PreSaleImportHistoryResponseDto>();
  itemLink = computed(() => {
    const itemId = this.preSales()?.id;
    return `/pre-sales/${itemId}`;
  });
}
