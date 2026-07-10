import { Component, OnInit, ViewChild, computed, inject, signal } from '@angular/core';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { MatDateRangePicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { KpiCardComponent } from '../components/kpi-card.component';
import { RegionTableComponent } from '../components/region-table.component';
import { ClientDashboardService } from '../services/client-dashboard.service';
import { ComparisonPeriodData, DashboardData, EvolutionPeriod } from '../models/client-dashboard.types';

@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrl: './client-dashboard.component.scss',
  imports: [
    NgApexchartsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule,
    KpiCardComponent,
    RegionTableComponent,
  ],
})
export class ClientDashboardComponent implements OnInit {
  @ViewChild(MatDateRangePicker) private picker?: MatDateRangePicker<Date>;

  private readonly dashboardService = inject(ClientDashboardService);

  protected readonly loading = this.dashboardService.loading;
  protected readonly unblockedByRegion = computed(() => this.dashboardService.data()?.unblockedByRegion ?? []);
  protected readonly blockedByRegion = computed(() => this.dashboardService.data()?.blockedByRegion ?? []);

  protected readonly evolutionPeriod = signal<EvolutionPeriod>('semanal');

  // Comparativo de evolução: modo global do dashboard — KPIs, evolução e motivos
  // passam a comparar os dois períodos escolhidos no cabeçalho
  protected readonly comparisonMode = signal(false);
  protected readonly comparativoOptions = computed(() => this.dashboardService.data()?.comparison.options ?? []);
  private readonly comparativoPeriodoA = signal<string | null>(null);
  private readonly comparativoPeriodoB = signal<string | null>(null);
  protected readonly periodoA = computed(() => this.comparativoPeriodoA() ?? this.comparativoOptions().at(-1) ?? '');
  protected readonly periodoB = computed(() => this.comparativoPeriodoB() ?? this.comparativoOptions().at(-2) ?? '');

  protected readonly kpis = computed(() => {
    const data = this.dashboardService.data();
    if (!data) {
      return [];
    }
    const a = data.comparison.byOption[this.periodoA()];
    const b = data.comparison.byOption[this.periodoB()];
    if (!this.comparisonMode() || !a || !b) {
      return data.kpis;
    }
    return data.kpis.map((kpi) => {
      const valorA = a.kpis[kpi.id];
      const valorB = b.kpis[kpi.id];
      if (valorA === undefined || !valorB) {
        return kpi;
      }
      const delta = ((valorA - valorB) / valorB) * 100;
      const sinal = delta >= 0 ? '+' : '';
      return {
        ...kpi,
        value: valorA.toLocaleString('pt-BR'),
        subLabel: `vs ${this.periodoB()}: ${sinal}${delta.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`,
      };
    });
  });

  protected readonly evolutionChart = computed<ApexOptions>(() => {
    const data = this.dashboardService.data();
    if (!data) {
      return {};
    }

    const base: ApexOptions = {
      chart: { type: 'line', height: 300, toolbar: { show: false }, fontFamily: 'inherit' },
      colors: ['#0f172a', '#94a3b8'],
      dataLabels: { enabled: false },
      grid: { borderColor: 'var(--fuse-border)', padding: { left: 4, right: 4 } },
      legend: { position: 'bottom' },
      stroke: { width: 3, curve: 'smooth' },
      tooltip: { theme: 'dark' },
      yaxis: { labels: { style: { colors: 'var(--fuse-text-secondary)' } } },
    };

    if (this.comparisonMode()) {
      const { categories, byOption } = data.comparison;
      const periodoA = this.periodoA();
      const periodoB = this.periodoB();
      return {
        ...base,
        series: [
          { name: periodoA, data: byOption[periodoA]?.evolution ?? [] },
          { name: periodoB, data: byOption[periodoB]?.evolution ?? [] },
        ],
        xaxis: {
          categories,
          labels: { style: { colors: 'var(--fuse-text-secondary)' } },
        },
      };
    }

    const series = data.evolutionByPeriod[this.evolutionPeriod()];
    return {
      ...base,
      series: [
        { name: 'Período atual', data: series.atual },
        { name: 'Período anterior', data: series.anterior },
      ],
      xaxis: {
        categories: series.categories,
        labels: { style: { colors: 'var(--fuse-text-secondary)' } },
      },
    };
  });

  protected readonly vehicleStatusChart = computed<ApexOptions>(() => {
    const data = this.dashboardService.data();
    if (!data) {
      return {};
    }

    return {
      chart: { type: 'donut', height: 300, width: '100%' },
      colors: ['#64748b', '#16a34a', '#f59e0b', '#ea580c', '#dc2626'],
      dataLabels: { enabled: false },
      labels: ['Outros — erro de importação', 'Liberado', 'Liberado com Alerta', 'Bloqueado com Alerta', 'Bloqueado'],
      legend: { position: 'bottom' },
      plotOptions: { pie: { donut: { size: '70%' } } },
      series: data.vehicleStatusSeries,
      stroke: { width: 0 },
    };
  });

  protected readonly blocksChart = computed<ApexOptions>(() =>
    this.buildMotivosChart('#dc2626', '#fca5a5', 'Bloqueios', (d) => d.blocksChartSeries, (d) => d.blocksChartCategories, (c) => c.blocks));

  protected readonly alertsChart = computed<ApexOptions>(() =>
    this.buildMotivosChart('#f59e0b', '#fcd34d', 'Alertas', (d) => d.alertsChartSeries, (d) => d.alertsChartCategories, (c) => c.alerts));

  private buildMotivosChart(
    cor: string,
    corComparacao: string,
    nomeSerie: string,
    serieAtual: (d: DashboardData) => number[],
    categorias: (d: DashboardData) => string[],
    serieComparacao: (c: ComparisonPeriodData) => number[],
  ): ApexOptions {
    const data = this.dashboardService.data();
    if (!data) {
      return {};
    }

    const a = data.comparison.byOption[this.periodoA()];
    const b = data.comparison.byOption[this.periodoB()];
    const comparando = this.comparisonMode() && a && b;

    return {
      chart: { type: 'bar', height: 300, width: '100%', toolbar: { show: false }, fontFamily: 'inherit' },
      colors: comparando ? [cor, corComparacao] : [cor],
      dataLabels: { enabled: false },
      grid: { borderColor: 'var(--fuse-border)', padding: { left: 0, right: 0 } },
      legend: { position: 'bottom' },
      plotOptions: { bar: { horizontal: true, barHeight: comparando ? '70%' : '55%', borderRadius: 4 } },
      series: comparando
        ? [
            { name: this.periodoA(), data: serieComparacao(a) },
            { name: this.periodoB(), data: serieComparacao(b) },
          ]
        : [{ name: nomeSerie, data: serieAtual(data) }],
      tooltip: { theme: 'dark' },
      xaxis: {
        categories: categorias(data),
        labels: { style: { colors: 'var(--fuse-text-secondary)' } },
      },
      yaxis: { labels: { style: { colors: 'var(--fuse-text-secondary)', fontSize: '11px' } } },
    };
  }

  protected onEvolutionPeriodChange(period: EvolutionPeriod) {
    this.evolutionPeriod.set(period);
  }

  protected onComparisonModeChange(mode: string) {
    this.comparisonMode.set(mode === 'comparativo');
  }

  protected onComparativoPeriodoAChange(periodo: string) {
    this.comparativoPeriodoA.set(periodo);
  }

  protected onComparativoPeriodoBChange(periodo: string) {
    this.comparativoPeriodoB.set(periodo);
  }

  protected readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  protected preset: '30' | '7' | 'today' | 'custom' = '30';

  protected readonly skeletonKpis = [0, 1, 2, 3, 4];
  protected readonly skeletonRows = [0, 1, 2, 3];

  constructor() {
    this.applyPreset('30');
  }

  ngOnInit(): void {
    this.dashboardService.load();
  }

  protected onPresetChange(value: '30' | '7' | 'today' | 'custom') {
    this.preset = value;
    if (value === 'custom') {
      this.openCustomPicker();
      return;
    }
    this.applyPreset(value);
  }

  protected onCustomDateChange() {
    if (this.preset !== 'custom') {
      this.preset = 'custom';
    }
  }

  private openCustomPicker() {
    queueMicrotask(() => this.picker?.open());
  }

  private applyPreset(value: '30' | '7' | 'today') {
    const today = this.startOfDay(new Date());
    if (value === 'today') {
      this.range.setValue({ start: today, end: today });
      return;
    }
    const days = value === '7' ? 7 : 30;
    const start = this.addDays(today, -(days - 1));
    this.range.setValue({ start, end: today });
  }

  private addDays(date: Date, days: number) {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
  }

  private startOfDay(date: Date) {
    const next = new Date(date);
    next.setHours(0, 0, 0, 0);
    return next;
  }
}
