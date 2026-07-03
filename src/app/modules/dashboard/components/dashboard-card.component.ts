import { Component, input } from '@angular/core';
import { DashboardPlateResume } from '../models';
import { DecimalPipe } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-dashboard-card',
  template: ` <div class="bg-card flex flex-auto flex-col rounded-2xl p-6 shadow">
    <div class="flex items-start justify-between">
      <div class="truncate text-lg font-medium leading-6 tracking-tight text-hint">{{ title() }}</div>
    </div>
    <div class="flex flex-col items-center">
      <div class="text-7xl font-bold leading-none tracking-tight my-6 sm:text-8xl">
        @if (loading()) {
          <mat-spinner></mat-spinner>
        } @else {
          {{ data()?.total }}
        }
      </div>
      <div class="grid grid-cols-3 mt-2 justify-between w-full divide-x">
        @for (stateResume of data()?.byState; track stateResume.state) {
          <div class="flex flex-col text-hint justify-center text-center">
            <span class="truncate text-md">{{ stateResume.state }}</span>
            <span class="text-lg font-medium">{{ stateResume.total | number }}</span>
          </div>
        }
      </div>
    </div>
  </div>`,
  imports: [DecimalPipe, MatProgressSpinner],
})
export class DashboardCardComponent {
  protected readonly title = input<string>();
  protected readonly loading = input<boolean>();
  protected readonly data = input<DashboardPlateResume | undefined>();
}
