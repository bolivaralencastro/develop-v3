import { computed, Injectable, ResourceRef, signal, Signal } from '@angular/core';
import { DashboardApi } from './dashboard-api';
import { DashboardDataDTO } from '../models';
import { rxResource } from '@angular/core/rxjs-interop';

@Injectable()
export class QueryDashboardDataService {
  readonly dashboardData: Signal<DashboardDataDTO | undefined>;
  readonly isLoading: Signal<boolean>;
  private readonly currentHistoryId = signal('');
  private readonly dashboardDataResource: ResourceRef<DashboardDataDTO>;

  constructor(private readonly dashboardApi: DashboardApi) {
    this.dashboardDataResource = this.createDashboardResource();
    this.dashboardData = computed(() => this.dashboardDataResource.value());
    this.isLoading = computed(() => this.dashboardDataResource.isLoading());
  }

  private createDashboardResource() {
    return rxResource({
      request: () => this.currentHistoryId() || undefined,
      loader: ({ request }) => this.dashboardApi.fetchDashboardDataV2(request),
    });
  }

  loadDataForImportHistory(importHistoryId: string) {
    this.currentHistoryId.set(importHistoryId);
  }
}
