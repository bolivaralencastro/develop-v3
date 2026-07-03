import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, input, Signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { DashboardDataDTO, DashboardQueryGroup } from '../../models';
import { QueryDashboardDataService } from '../../services';

type RegionGroups = DashboardQueryGroup | undefined;
type StateRow = {
  state: string;
  total: number;
  fines: number;
  alerts: number;
};

const BRAZIL_STATES = ['PR', 'MG', 'SP', 'Outros'] as const;

@Component({
  selector: 'app-query-dashboard-content',
  imports: [DecimalPipe, MatIcon],
  templateUrl: './query-dashboard-content.component.html',
  styleUrl: './query-dashboard-content.component.scss',
})
export class QueryDashboardContentComponent {
  protected readonly dashboardData: Signal<DashboardDataDTO>;
  protected readonly isLoading: Signal<boolean>;
  protected readonly importHistoryId = input<string | undefined>();

  private readonly dashboardService = inject(QueryDashboardDataService);

  protected readonly unblockedRegions = computed(() => this.dashboardData()?.unblocked);
  protected readonly blockedRegions = computed<RegionGroups>(() => this.dashboardData()?.blockedByState ?? this.dashboardData()?.blocks);
  protected readonly finedRegions = computed(() => this.dashboardData()?.fined);
  protected readonly alertRegions = computed(() => this.dashboardData()?.alerts);

  protected readonly unblockedStateRows = computed(() =>
    this.buildStateRows(this.unblockedRegions(), this.finedRegions(), this.alertRegions()),
  );
  protected readonly blockedStateRows = computed(() =>
    this.buildStateRows(this.blockedRegions(), this.finedRegions(), this.alertRegions()),
  );
  protected readonly unblockedTotals = computed(() => this.sumRows(this.unblockedStateRows()));
  protected readonly blockedTotals = computed(() => this.sumRows(this.blockedStateRows()));

  constructor() {
    this.dashboardData = this.dashboardService.dashboardData;
    this.isLoading = this.dashboardService.isLoading;
  }

  protected blockedTotal() {
    return this.sumGroupTotal(this.dashboardData()?.blocks);
  }

  protected alertsTotal() {
    return this.sumGroupTotal(this.dashboardData()?.alerts);
  }

  protected percentLabel(value?: number) {
    const total = this.dashboardData()?.totalItems ?? 0;

    if (!total || value === undefined || value === null) {
      return '--';
    }

    const percent = (value / total) * 100;
    return `${percent.toFixed(1)}% do lote`;
  }

  protected blockGroups() {
    return this.dashboardData()?.blocks?.groups ?? [];
  }

  protected alertGroups() {
    return this.dashboardData()?.alerts?.groups ?? [];
  }

  protected formatIndex(index: number) {
    return String(index + 1).padStart(2, '0');
  }

  private buildStateRows(
    statesGroup?: DashboardQueryGroup,
    finesGroup?: DashboardQueryGroup,
    alertsGroup?: DashboardQueryGroup,
  ): StateRow[] {
    const totals = this.buildStateTotals(statesGroup);
    const fines = this.buildStateTotals(finesGroup);
    const alerts = this.buildStateTotals(alertsGroup);

    return this.states.map((state) => {
      const key = this.normalizeKey(state);
      return {
        state,
        total: totals.get(key) ?? 0,
        fines: fines.get(key) ?? 0,
        alerts: alerts.get(key) ?? 0,
      };
    });
  }

  private buildStateTotals(statesGroup?: DashboardQueryGroup) {
    const entries = (statesGroup?.groups ?? []).map((item) => ({
      key: this.normalizeKey(item.label),
      total: item.total ?? 0,
    }));

    const map = new Map<string, number>();
    const includedStates = new Set(['PR', 'MG', 'SP']);
    let othersTotal = 0;

    for (const entry of entries) {
      if (includedStates.has(entry.key)) {
        map.set(entry.key, entry.total);
      } else {
        othersTotal += entry.total;
      }
    }

    map.set('OUTROS', othersTotal);
    return map;
  }

  private get states() {
    return BRAZIL_STATES as unknown as string[];
  }

  private sumRows(rows: StateRow[]) {
    return rows.reduce(
      (acc, row) => ({
        total: acc.total + row.total,
        fines: acc.fines + row.fines,
        alerts: acc.alerts + row.alerts,
      }),
      { total: 0, fines: 0, alerts: 0 },
    );
  }

  private normalizeKey(label: string) {
    return label.trim().toUpperCase();
  }

  private sumGroupTotal(group?: DashboardQueryGroup) {
    if (!group) {
      return 0;
    }

    const items = group.groups ?? [];

    if (!items.length) {
      return group.total ?? 0;
    }

    return items.reduce((acc, item) => acc + (item.total ?? 0), 0);
  }
}
