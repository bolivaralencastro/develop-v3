import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DashboardQueryGroup } from '../models';
import { DecimalPipe } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslocoModule } from '@ngneat/transloco';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-queries-resume',
  imports: [DecimalPipe, MatProgressSpinner, TranslocoModule, RouterLink],
  template: `
    <div class="bg-card flex flex-auto flex-col sm:flex-row gap-6 rounded-2xl p-6 shadow">
      <div class="flex flex-col">
        <div class="truncate text-lg font-medium leading-6 tracking-tight text-hint">{{ 'dashboard.queries-total' | transloco }}</div>
        <div class="font-bold leading-none tracking-tight text-5xl mt-2">{{ data()?.total | number }}</div>
      </div>
      @if (loading()) {
        <mat-spinner class="mx-auto"></mat-spinner>
      } @else {
        <div class="flex flex-row flex-wrap sm:self-end sm:ml-auto gap-2">
          <div class="flex flex-col text-warn p-2">
            <div class="text-sm leading-none">Erros</div>
            <div class="mt-2 text-3xl font-medium leading-none">
              {{ errorCount() | number }}
            </div>
          </div>
          @for (group of data()?.groups; track group.label) {
            @let activeLink = isLink(group.label);
            <a class="flex flex-col rounded-md p-2" [class.hover]="activeLink" [routerLink]="getRouterLink(group.label)" [queryParams]="{ state: group.label }">
              <div class="text-hint text-sm leading-none">{{ group.label }}</div>
              <div class="mt-2 text-3xl font-medium leading-none">
                {{ group.total | number }}
              </div>
            </a>
          }
        </div>
      }
    </div>
  `,
  styles: `
    .hover:hover {
      @apply bg-gray-100;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueriesResumeComponent {
  protected readonly errorCount = input<number>();
  protected readonly data = input<DashboardQueryGroup>();
  protected readonly loading = input<boolean>();

  getRouterLink(label: string) {
    return this.isLink(label) ? ['../'] : null;
  }

  isLink(label: string) {
    return label !== 'Outros';
  }
}
