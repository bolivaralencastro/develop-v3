export interface RegionRow {
  state: string;
  volume: string;
  fines: string;
  alerts: string;
}

export interface KpiItem {
  id: string;
  label: string;
  value: string;
  subLabel: string;
}

export type EvolutionPeriod = 'semanal' | 'mensal' | 'trimestral';

export interface EvolutionSeries {
  categories: string[];
  atual: number[];
  anterior: number[];
}

// Comparativo de evolução: modo global do dashboard que sobrepõe dois períodos
// escolhidos pelo usuário nos KPIs, evolução e motivos (o donut permanece no período atual)
export interface ComparisonPeriodData {
  kpis: Record<string, number>;
  evolution: number[];
  blocks: number[];
  alerts: number[];
}

export interface DashboardComparison {
  options: string[];
  categories: string[];
  byOption: Record<string, ComparisonPeriodData>;
}

export interface DashboardData {
  kpis: KpiItem[];
  vehicleStatusSeries: number[];
  blocksChartSeries: number[];
  blocksChartCategories: string[];
  alertsChartSeries: number[];
  alertsChartCategories: string[];
  evolutionByPeriod: Record<EvolutionPeriod, EvolutionSeries>;
  comparison: DashboardComparison;
  unblockedByRegion: RegionRow[];
  blockedByRegion: RegionRow[];
}
