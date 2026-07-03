import { Component, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { DashboardPlateResume } from '../models';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-states-resume',
  imports: [DecimalPipe, TranslocoModule, MatProgressSpinner],
  template: `
    <div class="bg-card flex flex-auto flex-col sm:flex-row gap-6 rounded-2xl p-6 shadow">
      <div class="flex flex-col">
        <div class="truncate text-lg font-medium leading-6 tracking-tight text-hint">{{ 'dashboard.consulted-plates' | transloco }}</div>
        <div class="font-bold leading-none tracking-tight text-7xl sm:text-8xl mt-2">{{ data()?.total | number }}</div>
      </div>
      @if (loading()) {
        <mat-spinner class="mx-auto"></mat-spinner>
      } @else {
        <div class="flex flex-row flex-wrap sm:self-end sm:ml-auto gap-4 sm:gap-6 gap-x-8">
          @for (stateResume of data()?.byState; track stateResume.state) {
            <div class="flex flex-col">
              <div class="text-hint text-sm leading-none">{{ stateResume.state }}</div>
              <div class="mt-2 text-3xl font-medium leading-none">
                {{ stateResume.total | number }}
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class StatesResumeComponent {
  protected readonly data = input<DashboardPlateResume | undefined>();
  protected readonly loading = input<boolean>();
}
