import { computed, Injectable, ResourceRef, signal, Signal } from '@angular/core';
import { PageDto, PageMeta } from '@core/http';
import { PreSaleImportHistoryVehicleResponseDto, PreSaleImportHistoryVehiclesFilter } from '../../../pre-sales/models/pre-sales.types';
import { rxResource } from '@angular/core/rxjs-interop';
import { PreSalesQueriesStatusApi } from './pre-sales-queries-status-api';

@Injectable()
export class VehicleQueriesStatusListService {
  readonly isLoading: Signal<boolean>;
  readonly pagination: Signal<PageMeta>;
  readonly vehiclesQueries: Signal<PreSaleImportHistoryVehicleResponseDto[]>;

  private readonly filter = signal<PreSaleImportHistoryVehiclesFilter>({ page: 1, limit: 20 });
  private readonly queryId = signal('');
  private readonly vehicleQueriesStatusResource: ResourceRef<PageDto<PreSaleImportHistoryVehicleResponseDto>>;

  constructor(private readonly preSalesQueriesStatusApi: PreSalesQueriesStatusApi) {
    this.vehicleQueriesStatusResource = this.createVehicleQueriesResource();
    this.isLoading = computed(() => this.vehicleQueriesStatusResource.isLoading());
    this.vehiclesQueries = computed(() => this.vehicleQueriesStatusResource.value()?.data);
    this.pagination = computed(() => this.vehicleQueriesStatusResource.value()?.meta);
  }

  loadQueryVehicles(queryId: string) {
    this.queryId.set(queryId);
  }

  setPage(page: number, limit: number) {
    this.filter.update((value) => ({ ...value, page, limit }));
  }

  setSort(sort: string, direction: string) {
    if (!direction) {
      this.filter.update((value) => ({ ...value, sort: null, order: null }));
      return;
    }

    this.filter.update((value) => ({ ...value, sort, order: direction.toUpperCase() }));
  }

  setFilter(filter: PreSaleImportHistoryVehiclesFilter) {
    this.filter.update((currentValue) => ({ ...filter, page: currentValue.page, limit: currentValue.limit }));
  }

  private createVehicleQueriesResource() {
    return rxResource({
      request: () => ({ queryId: this.queryId(), filter: this.filter() }),
      loader: ({ request }) => this.preSalesQueriesStatusApi.getPreSalesVehicles(request.queryId, request.filter),
    });
  }
}
