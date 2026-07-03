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

export interface DashboardData {
  kpis: KpiItem[];
  queriesChartSeries: { name: string; data: number[] }[];
  queriesChartCategories: string[];
  statusChartSeries: number[];
  blocksChartSeries: number[];
  blocksChartCategories: string[];
  unblockedByRegion: RegionRow[];
  blockedByRegion: RegionRow[];
}
