import { Component, computed, input, OnInit, Signal } from '@angular/core';
import { ApexAxisChartSeries, ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { Router } from '@angular/router';
import { DashboardQueriesByWeekGraphData, WeeklyOverviewData } from '../models';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

const GRAPH_OPTIONS: ApexOptions = {
  chart: {
    fontFamily: 'inherit',
    foreColor: 'inherit',
    height: '100%',
    type: 'line',
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  colors: ['#1d1d1f', '#1d1d1f'],
  dataLabels: {
    enabled: true,
    enabledOnSeries: [0],
    background: {
      borderWidth: 0,
    },
  },
  grid: {
    borderColor: 'var(--fuse-border)',
  },
  legend: {
    show: false,
  },
  plotOptions: {
    bar: {
      columnWidth: '50%',
    },
  },
  states: {
    hover: {
      filter: {
        type: 'darken',
        value: 0.75,
      },
    },
  },
  stroke: {
    width: [3, 0],
  },
  tooltip: {
    followCursor: true,
    theme: 'dark',
  },
  xaxis: {
    axisBorder: {
      show: false,
    },
    axisTicks: {
      color: 'var(--fuse-border)',
    },
    labels: {
      style: {
        colors: 'var(--fuse-text-secondary)',
      },
    },
    tooltip: {
      enabled: false,
    },
  },
  yaxis: {
    labels: {
      offsetX: -16,
      style: {
        colors: 'var(--fuse-text-secondary)',
      },
    },
  },
};

@Component({
  selector: 'app-plates-by-state-graph',
  imports: [NgApexchartsModule, TranslocoModule],
  template: `
    <div class="bg-card flex flex-auto flex-col overflow-hidden rounded-2xl p-6 shadow sm:col-span-2 md:col-span-4">
      <div class="flex flex-col items-start justify-between sm:flex-row">
        <div
          class="truncate text-lg font-medium leading-6 tracking-tight">{{ 'dashboard-weekly-chart.title' | transloco }}
        </div>
      </div>
      <div class="mt-8 grid w-full grid-flow-row grid-cols-1 gap-6 sm:mt-4" [class.lg:grid-cols-2]="!hideDailyChart()">
        @if(!hideDailyChart()) {
          @let chartData = queriesByWeekChart();
          <div class="flex flex-auto flex-col">
            <div class="text-secondary font-medium">{{ 'dashboard-weekly-chart.chart-label' | transloco }}</div>
            <div class="flex flex-auto flex-col">
              <apx-chart
                class="h-80 w-full flex-auto"
                [chart]="chartData.chart"
                [colors]="chartData.colors"
                [dataLabels]="chartData.dataLabels"
                [grid]="chartData.grid"
                [labels]="chartData.labels"
                [legend]="chartData.legend"
                [plotOptions]="chartData.plotOptions"
                [series]="chartData.series"
                [states]="chartData.states"
                [stroke]="chartData.stroke"
                [tooltip]="chartData.tooltip"
                [xaxis]="chartData.xaxis"
                [yaxis]="chartData.yaxis"
              ></apx-chart>
            </div>
          </div>
        }
        <!-- Overview -->
        <div class="flex flex-col">
          <div class="text-secondary font-medium">{{ 'dashboard-weekly-chart.overview-label' | transloco }}</div>
          @let overview = overviewData();
          <div class="mt-6 grid flex-auto grid-cols-4 gap-4">
            <!-- Benefício ICMS -->
            <div
              class="col-span-2 flex flex-col items-center justify-center rounded-2xl bg-primary-50 px-1 py-8 text-primary-800 dark:bg-white dark:bg-opacity-5 dark:text-primary-400"
            >
              <div class="text-5xl font-semibold leading-none tracking-tight sm:text-7xl">
                {{ overview?.icms || 0 }}
              </div>
              <div
                class="mt-1 text-sm font-medium sm:text-lg">{{ 'dashboard-weekly-chart.block-type.icms' | transloco }}
              </div>
            </div>
            <!-- Venda ativa -->
            <div
              class="text-secondary col-span-2 flex flex-col items-center justify-center rounded-2xl bg-gray-100 px-1 py-8 dark:bg-white dark:bg-opacity-5 sm:col-span-1"
            >
              <div class="text-5xl font-semibold leading-none tracking-tight">
                {{ overview?.active_sale || 0 }}
              </div>
              <div
                class="mt-1 text-center text-sm font-medium">{{ 'dashboard-weekly-chart.block-type.active-sale' | transloco }}
              </div>
            </div>
            <!-- Res. financiamento -->
            <div
              class="text-secondary col-span-2 flex flex-col items-center justify-center rounded-2xl bg-gray-100 px-1 py-8 dark:bg-white dark:bg-opacity-5 sm:col-span-1"
            >
              <div class="text-5xl font-semibold leading-none tracking-tight">
                {{ overview?.finance_reserve || 0 }}
              </div>
              <div
                class="mt-1 text-center text-sm font-medium">{{ 'dashboard-weekly-chart.block-type.finance-reserve' | transloco }}
              </div>
            </div>
            <!-- Dano media monta -->
            <div
              class="text-secondary col-span-2 flex flex-col items-center justify-center rounded-2xl bg-gray-100 px-1 py-8 dark:bg-white dark:bg-opacity-5 sm:col-span-1"
            >
              <div class="text-5xl font-semibold leading-none tracking-tight">
                {{ overview?.manufacturer_medium_damage || 0 }}
              </div>
              <div
                class="mt-1 text-center text-sm font-medium">{{ 'dashboard-weekly-chart.block-type.manufacturer-medium-damage' | transloco }}
              </div>
            </div>
            <!-- CSV inválido -->
            <div
              class="text-secondary col-span-2 flex flex-col items-center justify-center rounded-2xl bg-gray-100 px-1 py-8 dark:bg-white dark:bg-opacity-5 sm:col-span-1"
            >
              <div class="text-5xl font-semibold leading-none tracking-tight">
                {{ overview?.invalid_csv || 0 }}
              </div>
              <div
                class="mt-1 text-center text-sm font-medium">{{ 'dashboard-weekly-chart.block-type.invalid-csv' | transloco }}
              </div>
            </div>
            <!-- Indisp. admin. / acidente / grande monta -->
            <div
              class="col-span-2 flex flex-col items-center justify-center rounded-2xl bg-primary-50 px-1 py-8 text-primary-800 dark:bg-white dark:bg-opacity-5 dark:text-primary-500"
            >
              <div class="text-5xl font-semibold leading-none tracking-tight sm:text-7xl">
                {{ overview?.administrative_unavailability_accident || 0 }}
              </div>
              <div
                class="mt-1 text-sm font-medium sm:text-lg text-center">{{ 'dashboard-weekly-chart.block-type.administrative-unavailability-accident' | transloco }}
              </div>
            </div>
            <!-- Ocorrência ou queixa de furto / roubo -->
            <div
              class="col-span-2 flex flex-col items-center justify-center rounded-2xl bg-primary-50 px-1 py-8 text-primary-800 dark:bg-white dark:bg-opacity-5 dark:text-primary-400"
            >
              <div class="text-5xl font-semibold leading-none tracking-tight sm:text-7xl">
                {{ overview?.theft_occurrence || 0 }}
              </div>
              <div
                class="mt-1 text-sm font-medium sm:text-lg text-center">{{ 'dashboard-weekly-chart.block-type.theft-occurrence' | transloco }}
              </div>
            </div>
            <!-- Fora de circulação -->
            <div
              class="text-secondary col-span-2 flex flex-col items-center justify-center rounded-2xl bg-gray-100 px-1 py-8 dark:bg-white dark:bg-opacity-5 sm:col-span-1"
            >
              <div class="text-5xl font-semibold leading-none tracking-tight">
                {{ overview?.out_of_circulation || 0 }}
              </div>
              <div
                class="mt-1 text-center text-sm font-medium">{{ 'dashboard-weekly-chart.block-type.out-of-circulation' | transloco }}
              </div>
            </div>
            <!-- Benefício fiscal -->
            <div
              class="text-secondary col-span-2 flex flex-col items-center justify-center rounded-2xl bg-gray-100 px-1 py-8 dark:bg-white dark:bg-opacity-5 sm:col-span-1"
            >
              <div class="text-5xl font-semibold leading-none tracking-tight">
                {{ overview?.fiscal_benefit || 0 }}
              </div>
              <div
                class="mt-1 text-center text-sm font-medium">{{ 'dashboard-weekly-chart.block-type.fiscal-benefit' | transloco }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`,
  styles: ``,
})
export class PlatesByStateGraphComponent implements OnInit {
  protected readonly queriesByWeekChart: Signal<ApexOptions>;
  protected readonly overviewData: Signal<WeeklyOverviewData>;
  readonly chartData = input<DashboardQueriesByWeekGraphData>();
  readonly hideDailyChart = input<boolean>(false);

  /**
   * Constructor
   */
  constructor(
    private _router: Router,
    private _transloco: TranslocoService,
  ) {
    this.queriesByWeekChart = this.buildChartDataSignal();
    this.overviewData = this.buildOverviewSignal();
  }

  ngOnInit() {
    this.registerApexChartsEvents();
  }

  private buildChartDataSignal(): Signal<ApexOptions> {
    const labels = this._transloco.translate('dashboard-weekly-chart.week-days-label').split('-');
    const chartSeriesLabel = this._transloco.translate('dashboard-weekly-chart.queries-by-day');
    return computed(() => {
      const data = this.chartData();
      const series = this.buildChartSeries(data, chartSeriesLabel);
      return { ...GRAPH_OPTIONS, labels, series };
    });
  }

  private buildOverviewSignal(): Signal<WeeklyOverviewData> {
    return computed(() => {
      const chartData = this.chartData();
      return chartData?.blocked;
    });
  }

  private buildChartSeries(data: DashboardQueriesByWeekGraphData, seriesLabel: string): ApexAxisChartSeries {
    return [{ type: 'column', name: seriesLabel, data: data?.queries_this_week || [] }];
  }

  private registerApexChartsEvents() {
    window['Apex'] = {
      chart: {
        events: {
          mounted: (chart: any, options?: any): void => {
            this._fixSvgFill(chart.el);
          },
          updated: (chart: any, options?: any): void => {
            this._fixSvgFill(chart.el);
          },
        },
      },
    };
  }

  private _fixSvgFill(element: Element): void {
    // Current URL
    const currentURL = this._router.url;

    // 1. Find all elements with 'fill' attribute within the element
    // 2. Filter out the ones that doesn't have cross-reference so we only left with the ones that use the 'url(#id)' syntax
    // 3. Insert the 'currentURL' at the front of the 'fill' attribute value
    Array.from(element.querySelectorAll('*[fill]'))
      .filter((el) => el.getAttribute('fill').indexOf('url(') !== -1)
      .forEach((el) => {
        const attrVal = el.getAttribute('fill');
        el.setAttribute('fill', `url(${currentURL}${attrVal.slice(attrVal.indexOf('#'))}`);
      });
  }
}
