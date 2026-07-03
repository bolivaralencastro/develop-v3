import { computed, Injectable, ResourceRef, Signal, signal } from '@angular/core';
import { PreSalesApi } from './pre-sales-api';
import { PreSaleImportHistoryResponseDto, PreSalesFilter } from '../models/pre-sales.types';
import { rxResource } from '@angular/core/rxjs-interop';
import { PageDto, PageMeta } from '@core/http';

@Injectable()
export class PreSalesListService {
  private readonly filter = signal<PreSalesFilter>({ page: 1, limit: 20 });
  private readonly batchesResource: ResourceRef<PageDto<PreSaleImportHistoryResponseDto>>;
  readonly isLoading: Signal<boolean>;
  readonly batches: Signal<PreSaleImportHistoryResponseDto[]>;
  readonly pagination: Signal<PageMeta>;

  constructor(private readonly preSalesApi: PreSalesApi) {
    this.batchesResource = this.createBatchesResource();
    this.isLoading = computed(() => this.batchesResource.isLoading());
    this.batches = computed(() => this.batchesResource.value()?.data);
    this.pagination = computed(() => this.batchesResource.value()?.meta);
  }

  setPage(page: number, limit: number) {
    this.filter.update((value) => ({ ...value, page, limit }));
  }

  setFilter(filter: PreSalesFilter) {
    this.filter.update((currentFilter) => ({ ...filter, page: currentFilter.page, limit: currentFilter.limit }));
  }

  setSort(sort: string, direction: string) {
    if (!direction) {
      this.filter.update((value) => ({ ...value, sort: null, order: null }));
      return;
    }

    this.filter.update((value) => ({ ...value, sort, order: direction.toUpperCase() }));
  }

  private createBatchesResource() {
    return rxResource({
      request: () => ({ filter: this.filter() }),
      loader: ({ request }) => this.preSalesApi.list(request.filter),
    });
  }
}
