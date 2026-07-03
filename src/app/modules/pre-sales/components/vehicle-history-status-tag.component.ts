import { Component, computed, input } from '@angular/core';
import { PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS } from '../models/pre-sales.types';
import { TranslocoModule } from '@ngneat/transloco';

export const STATUS_TAG_COLORS = new Map<PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS, string>([
  [PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS.PROCESSING, '#FACC15'],
  [PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS.SUCCESS, '#10B981'],
  [PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS.STARTED, '#3B82F6'],
  [PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS.ERROR, '#EF4444'],
]);

@Component({
  selector: 'app-vehicle-history-status-tag',
  imports: [TranslocoModule],
  template: `
    <span class="border p-2 rounded-full bg-default flex gap-2 items-center text-sm cursor-default font-medium">
      <div class="rounded-full w-3 h-3" [style.background-color]="statusColor()"></div>
    </span>
  `,
})
export class VehicleHistoryStatusTagComponent {
  protected readonly status = input.required<PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS>();
  protected readonly statusColor = computed(() => STATUS_TAG_COLORS.get(this.status()));
}
