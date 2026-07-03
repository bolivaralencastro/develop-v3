import { Component, computed, input } from '@angular/core';
import { DashboardQueryGroup } from '../models';
import { DecimalPipe } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { VEHICLE_SITUATION } from '../../pre-sales/models/pre-sales.types';

@Component({
  selector: 'app-dashboard-group-card',
  template: `
    <div class="bg-card flex flex-auto flex-col rounded-2xl p-6 shadow">
      <div class="flex items-end mb-4 gap-2">
        <div class="grow">
          <div class="truncate text-xl font-medium leading-6 tracking-tight text-hint grow mb-1">{{ title() }}</div>
          @if (!loading()) {
            <div class="bar-bg rounded-full h-1"></div>
          }
        </div>
        <span class="text-3xl font-bold leading-none tracking-tight main-value">{{ data()?.total | number }}</span>
      </div>
      <div class="flex flex-col items-center">
        @if (loading()) {
          <mat-spinner></mat-spinner>
        }
        <div class="grid grid-cols-4 mt-2 justify-between w-full divide-x">
          @for (group of data()?.groups; track group.label) {
            @let activeLink = isLink(group.label);
            <div class="px-2">
              <a class="flex flex-col text-hint justify-center text-center rounded-md p-2" [class.hover]="activeLink"
                 [routerLink]="getRouterLink(group.label)"
                 [queryParams]="{ state: group.label, situation: situation()  }">
                <span class="truncate text-md">{{ group.label }}</span>
                <span class="text-lg font-medium">{{ group.total | number }}</span>
              </a>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      --theme-color: black;

      &.theme-yellow {
        --theme-color: oklch(85.2% 0.199 91.936);
      }

      &.theme-green {
        --theme-color: oklch(79.2% 0.209 151.711);
      }

      &.theme-blue {
        --theme-color: oklch(70.7% 0.165 254.624);
      }

      &.theme-red {
        --theme-color: oklch(0.658 0.201 23.62);
      }

      .main-value {
        color: var(--theme-color);
      }

      .bar-bg {
        background-color: var(--theme-color);
      }

      .hover:hover {
        @apply bg-gray-100;
      }
    }
  `,
  host: {
    '[class]': 'themeClass()',
  },
  imports: [DecimalPipe, MatProgressSpinner, RouterLink],
})
export class DashboardGroupCardComponent {
  protected readonly title = input<string>();
  protected readonly loading = input<boolean>();
  protected readonly theme = input<'yellow' | 'red' | 'green' | 'blue'>();
  protected readonly themeClass = computed(() => `theme-${this.theme()}`);
  protected readonly data = input<DashboardQueryGroup | undefined>();
  protected readonly situation = input<VEHICLE_SITUATION>();
  protected readonly disableLinks = input<boolean>();

  getRouterLink(label: string) {
    return this.isLink(label) ? ['../'] : null;
  }

  isLink(label: string) {
    if (this.disableLinks()) {
      return false;
    }

    return label !== 'Outros';
  }
}
