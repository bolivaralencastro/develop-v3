import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-customer-status-tag',
  template: `
    <span
      class="border p-1 rounded-full bg-default flex gap-1 items-center text-xxs leading-none cursor-default font-medium"
    >
      <div class="rounded-full w-2 h-2" [style.background-color]="color()"></div>
      {{ label() }}
    </span>
  `,
})
export class CustomerStatusTagComponent {
  protected readonly active = input.required<boolean>();
  protected readonly color = computed(() => (this.active() ? '#10B981' : '#EF4444'));
  protected readonly label = computed(() => (this.active() ? 'ATIVO' : 'INATIVO'));
}
