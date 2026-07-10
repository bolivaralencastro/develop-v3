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

export type EvolutionPeriod = 'semanal' | 'mensal' | 'trimestral' | 'comparativo';

export interface EvolutionSeries {
  categories: string[];
  atual: number[];
  anterior: number[];
}

// Comparativo de evolução: dois períodos escolhidos pelo usuário, sobrepostos no mesmo gráfico
export interface EvolutionComparativo {
  options: string[];
  categories: string[];
  seriesByOption: Record<string, number[]>;
}

export interface DashboardData {
  kpis: KpiItem[];
  vehicleStatusSeries: number[];
  blocksChartSeries: number[];
  blocksChartCategories: string[];
  alertsChartSeries: number[];
  alertsChartCategories: string[];
  evolutionByPeriod: Record<Exclude<EvolutionPeriod, 'comparativo'>, EvolutionSeries>;
  evolutionComparativo: EvolutionComparativo;
  unblockedByRegion: RegionRow[];
  blockedByRegion: RegionRow[];
}
