import { computed, Injectable, ResourceRef, signal, Signal } from '@angular/core';
import { PresaleImportHistoryStatusCount, PreSaleImportHistoryVehicleResponseDto, PreSaleImportHistoryVehiclesFilter } from '../models/pre-sales.types';
import { rxResource } from '@angular/core/rxjs-interop';
import { PreSalesApi } from './pre-sales-api';
import { PageDto, PageMeta } from '@core/http';

@Injectable()
export class PreSalesDetailService {
  readonly isLoadingHistory: Signal<boolean>;
  readonly isLoadingVehicles: Signal<boolean>;
  readonly stats: Signal<PresaleImportHistoryStatusCount>;
  readonly vehicles: Signal<PreSaleImportHistoryVehicleResponseDto[]>;
  readonly vehiclesPagination: Signal<PageMeta>;
  private readonly currentHistoryId = signal('');
  private readonly statsResource: ResourceRef<PresaleImportHistoryStatusCount>;
  private readonly vehiclesResource: ResourceRef<PageDto<PreSaleImportHistoryVehicleResponseDto>>;
  readonly vehiclesFilter = signal<PreSaleImportHistoryVehiclesFilter>({ page: 1, limit: 20 });

  constructor(private readonly preSalesApi: PreSalesApi) {
    this.statsResource = this.createStatsResource();
    this.vehiclesResource = this.createVehiclesResource();
    this.isLoadingHistory = computed(() => this.statsResource.isLoading());
    this.isLoadingVehicles = computed(() => this.vehiclesResource.isLoading());
    this.stats = computed(() => this.statsResource.value());
    this.vehicles = computed(() => this.vehiclesResource.value()?.data);
    this.vehiclesPagination = computed(() => this.vehiclesResource.value()?.meta);
  }

  loadHistory(id: string) {
    this.currentHistoryId.set(id);
  }

  setVehiclesPagination(page: number, limit: number) {
    this.vehiclesFilter.update((value) => ({ ...value, page, limit }));
  }

  setVehiclesSort(sort: string, direction: string) {
    if (!direction) {
      this.vehiclesFilter.update((value) => ({ ...value, sort: null, order: null }));
      return;
    }

    this.vehiclesFilter.update((value) => ({ ...value, sort, order: direction.toUpperCase() }));
  }

  setVehiclesFilter(filter: PreSaleImportHistoryVehiclesFilter) {
    this.vehiclesFilter.update((currentValue) => ({ ...filter, page: currentValue.page, limit: currentValue.limit }));
  }

  private createStatsResource() {
    return rxResource({
      request: () => ({ id: this.currentHistoryId() }),
      loader: ({ request }) => this.preSalesApi.getHistoryStatus(request.id),
    });
  }

  private createVehiclesResource() {
    return rxResource({
      request: () => ({ id: this.currentHistoryId(), filter: this.vehiclesFilter() }),
      loader: ({ request }) => this.preSalesApi.getPreSalesVehicles(request.id, request.filter),
    });
  }
}
