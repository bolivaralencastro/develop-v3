import { Component, computed, input } from '@angular/core';
import { PRE_SALE_STATUS } from '../models/pre-sales.types';
import { TranslocoModule } from '@ngneat/transloco';
import { UpperCasePipe } from '@angular/common';

const STATUS_TAG_TRANSLATIONS = new Map<PRE_SALE_STATUS, string>([
  [PRE_SALE_STATUS.PENDING, 'pre-sales.status-tag.pending'],
  [PRE_SALE_STATUS.STARTED, 'pre-sales.status-tag.processing'],
  [PRE_SALE_STATUS.COMPLETED, 'pre-sales.status-tag.completed'],
  [PRE_SALE_STATUS.ERROR, 'pre-sales.status-tag.error'],
]);

const STATUS_TAG_COLORS = new Map<PRE_SALE_STATUS, string>([
  [PRE_SALE_STATUS.PENDING, '#FACC15'],
  [PRE_SALE_STATUS.STARTED, '#3B82F6'],
  [PRE_SALE_STATUS.COMPLETED, '#10B981'],
  [PRE_SALE_STATUS.ERROR, '#EF4444'],
]);

@Component({
  selector: 'app-pre-sales-status-tag',
  imports: [TranslocoModule, UpperCasePipe],
  template: `
    <span
      class="border p-1 rounded-full bg-default flex gap-1 items-center text-xxs leading-none cursor-default font-medium"
    >
      <div class="rounded-full w-2 h-2" [style.background-color]="statusColor()"></div>
      {{ label() | transloco | uppercase }}
    </span>
  `,
})
export class PreSalesStatusTagComponent {
  protected readonly status = input.required<PRE_SALE_STATUS>();
  protected readonly label = computed(() => STATUS_TAG_TRANSLATIONS.get(this.status()));
  protected readonly statusColor = computed(() => STATUS_TAG_COLORS.get(this.status()));
}
