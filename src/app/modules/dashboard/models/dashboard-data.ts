export type DashboardPlateResume = {
  total: number;
  byState: { state: string; total: number }[];
};

export type BlockType =
  | 'icms'
  | 'out_of_circulation'
  | 'invalid_csv'
  | 'active_sale'
  | 'finance_reserve'
  | 'manufacturer_medium_damage'
  | 'administrative_unavailability_accident'
  | 'theft_occurrence'
  | 'fiscal_benefit';

export type DashboardQueriesByWeekGraphData = {
  blocked: WeeklyOverviewData;
  queries_this_week: number[];
};

export type DashboardData = {
  consultedPlates: DashboardPlateResume;
  unblockedPlates: DashboardPlateResume;
  blockedPlates: DashboardPlateResume;
  finedPlates: DashboardPlateResume;
  weekly_queries: DashboardQueriesByWeekGraphData;
};

export type WeeklyOverviewData = Record<BlockType, number>;

export type DashboardQueryGroup = {
  total: number;
  groups: { label: string; total: number }[];
};

export type DashboardDataDTO = {
  totalItems: number;
  queryId: string;
  queryDate: string;
  errorCount: number;
  queries: DashboardQueryGroup;
  unblocked: DashboardQueryGroup;
  fined: DashboardQueryGroup;
  alerts: DashboardQueryGroup;
  blocks: DashboardQueryGroup;
  blockedByState?: DashboardQueryGroup;
};
