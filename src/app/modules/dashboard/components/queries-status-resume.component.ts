import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DashboardQueryGroup } from '../models';
import { DecimalPipe } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'app-queries-status-resume',
  imports: [DecimalPipe, MatProgressSpinner, TranslocoModule],
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
        <div class="grid grid-cols-4 mt-4 w-full gap-4">
          @for (group of data()?.groups; track group.label) {
            <div class="col-span-1 status flex-col items-center justify-center rounded-2xl px-4 py-4 text-hint"
                 [class.empty]="group.total === 0">
              <div class="font-semibold leading-none tracking-tight text-lg">
                {{ group.total || 0 | number }}
              </div>
              <div class="mt-1 text-md font-medium whitespace-nowrap">{{ group.label }}</div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      --theme-color: black;
      --status-bg-color: transparent;
      --status-text-color: black;

      .status {
        display: flex;
        flex: 1 0 auto;
        border: 2px solid var(--status-bg-color);

        &.empty {
          border-color: oklch(98.5% 0.002 247.839);
          color: oklch(87.2% 0.01 258.338) !important;
        }
      }

      &.theme-yellow {
        --theme-color: oklch(85.2% 0.199 91.936);
        --status-bg-color: oklch(90.5% 0.182 98.111);
      }

      &.theme-green {
        --theme-color: oklch(79.2% 0.209 151.711);
        --status-bg-color: oklch(92.5% 0.084 155.995);
      }

      &.theme-blue {
        --theme-color: oklch(70.7% 0.165 254.624);
        --status-bg-color: oklch(88.2% 0.059 254.128);
      }

      &.theme-red {
        --theme-color: oklch(0.658 0.201 23.62);
        --status-bg-color: oklch(80.8% 0.114 19.571);
      }

      .main-value {
        color: var(--theme-color);
      }

      .bar-bg {
        background-color: var(--theme-color);
      }
    }
  `,
  host: {
    '[class]': 'themeClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueriesStatusResumeComponent {
  protected readonly title = input<string>();
  protected readonly loading = input<boolean>();
  protected readonly theme = input<'yellow' | 'red' | 'green' | 'blue'>('yellow');
  protected readonly themeClass = computed(() => `theme-${this.theme()}`);
  protected readonly data = input<DashboardQueryGroup | undefined>();
}
