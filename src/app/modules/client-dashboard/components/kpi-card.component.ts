import { Component, input } from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  template: `
    <div class="bg-card rounded-lg border border-gray-200 p-4 shadow">
      <div class="text-xs font-semibold text-hint">{{ label() }}</div>
      <div class="mt-2 text-2xl font-bold">{{ value() }}</div>
      <div class="mt-1 text-xs text-secondary">{{ subLabel() }}</div>
    </div>
  `,
})
export class KpiCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly subLabel = input.required<string>();
}
