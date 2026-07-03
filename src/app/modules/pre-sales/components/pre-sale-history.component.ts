import { DecimalPipe, PercentPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslocoModule } from '@ngneat/transloco';
import { PresaleImportHistoryStatusCount } from '../models/pre-sales.types';
import { ImportHistoryVehicleStatusPipe } from '../pipes/import-history-vehicle-status.pipe';

@Component({
  selector: 'app-pre-sale-history',
  imports: [MatIcon, MatIconButton, MatTooltip, TranslocoModule],
  providers: [DecimalPipe, PercentPipe, ImportHistoryVehicleStatusPipe],
  template: `
    <div class="grow flex justify-center items-center gap-2">
      @for (item of statItems(); track item.labelKey; let last = $last) {
        <div class="flex items-center gap-1">
          <span class="text-sm font-semibold">{{ item.value }}</span>
          <span class="text-sm">{{ item.labelKey | transloco }}</span>
        </div>
        @if (!last) {
          <span>|</span>
        }
      }
    </div>
    <button mat-icon-button matTooltip="Ver Dashboard" (click)="onOpenDashboard()">
      <mat-icon>stacked_bar_chart</mat-icon>
    </button>
  `,
  styles: `
    :host {
      @apply w-full flex items-center gap-2;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreSaleHistoryComponent {
  stats = input.required<PresaleImportHistoryStatusCount>();
  openDashboard = output<void>();

  private readonly percentPipe = inject(PercentPipe);
  private readonly decimalPipe = inject(DecimalPipe);
  private readonly vehicleStatusPipe = inject(ImportHistoryVehicleStatusPipe);

  protected readonly statItems = computed(() => {
    const s = this.stats();
    return [
      {
        value: this.percentPipe.transform(s?.progress / 100 || 0),
        labelKey: 'pre-sales.details.progress',
      },
      {
        value: this.decimalPipe.transform(s?.totalGeral || 0),
        labelKey: 'pre-sales.details.vehicles',
      },
      {
        value: 0,
        labelKey: 'Sucesso',
      },
      ...(s?.porStatus ?? []).map((stat) => ({
        value: this.decimalPipe.transform(stat.total || 0),
        labelKey: this.vehicleStatusPipe.transform(stat.status),
      })),
    ];
  });

  onOpenDashboard() {
    this.openDashboard.emit();
  }
}
