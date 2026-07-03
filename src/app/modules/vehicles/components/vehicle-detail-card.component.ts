import { Component, input } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-vehicle-detail-card',
  imports: [MatProgressSpinner],
  template: ` <div class="bg-card flex flex-auto flex-col rounded-2xl p-6 shadow">
    <div class="text-4xl font-bold leading-none tracking-tight my-2">
      @if (loading()) {
        <mat-spinner diameter="40"></mat-spinner>
      } @else {
        {{ value() }}
      }
    </div>
    <div class="flex items-start justify-between">
      <div class="truncate text-lg font-medium leading-6 tracking-tight text-hint">{{ title() }}</div>
    </div>
  </div>`,
})
export class VehicleDetailCardComponent {
  protected readonly title = input<string>();
  protected readonly loading = input<boolean>();
  protected readonly value = input<string>();
}
