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

export interface DashboardData {
  kpis: KpiItem[];
  vehicleStatusSeries: number[];
  blocksChartSeries: number[];
  blocksChartCategories: string[];
  alertsChartSeries: number[];
  alertsChartCategories: string[];
  evolutionByPeriod: Record<EvolutionPeriod, EvolutionSeries>;
  unblockedByRegion: RegionRow[];
  blockedByRegion: RegionRow[];
}
