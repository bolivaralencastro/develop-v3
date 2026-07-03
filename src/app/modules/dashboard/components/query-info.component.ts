import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'app-query-info',
  imports: [DecimalPipe, MatProgressSpinner, TranslocoModule],
  template: `
    <div class="bg-card flex flex-auto flex-col sm:flex-row gap-6 rounded-2xl p-6 shadow">
      <div class="flex flex-col">
        <div class="truncate text-lg font-medium leading-6 tracking-tight text-hint">{{ 'dashboard.vehicles-total' | transloco }}</div>
        <div class="font-bold leading-none tracking-tight text-5xl mt-2">{{ totalItems() | number }}</div>
      </div>
      @if (loading()) {
        <mat-spinner class="mx-auto"></mat-spinner>
      } @else {
        <div class="flex flex-row flex-wrap sm:self-end sm:ml-auto gap-4 sm:gap-6 gap-x-8">
          <div class="flex flex-col">
            <div class="text-hint text-sm leading-none">ID</div>
            <div class="mt-2 text-3xl font-medium leading-none">
              {{ customId() }}
            </div>
          </div>
          <div class="flex flex-col">
            <div class="text-hint text-sm leading-none">Data</div>
            <div class="mt-2 text-3xl font-medium leading-none">
              {{ queryDate() }}
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueryInfoComponent {
  protected readonly totalItems = input<number>();
  protected readonly customId = input<string>();
  protected readonly queryDate = input<string>();
  protected readonly loading = input<boolean>();
}
