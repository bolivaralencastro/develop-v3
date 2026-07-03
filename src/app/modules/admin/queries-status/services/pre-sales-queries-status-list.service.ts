import { computed, Injectable, ResourceRef, signal, Signal } from '@angular/core';
import { PreSalesQueriesStatusApi } from './pre-sales-queries-status-api';
import { PageDto, PageMeta } from '@core/http';
import { PreSaleImportHistoryResponseDto, PreSalesFilter } from '../../../pre-sales/models/pre-sales.types';
import { rxResource } from '@angular/core/rxjs-interop';

@Injectable()
export class PreSalesQueriesStatusListService {
  private readonly filter = signal<PreSalesFilter>({ page: 1, limit: 20 });
  // TODO: Ajustar o modelo dessa API
  private readonly queriesStatusResource: ResourceRef<PageDto<PreSaleImportHistoryResponseDto>>;
  readonly isLoading: Signal<boolean>;
  readonly queries: Signal<PreSaleImportHistoryResponseDto[]>;
  readonly pagination: Signal<PageMeta>;

  constructor(private readonly preSalesQueriesStatusApi: PreSalesQueriesStatusApi) {
    this.queriesStatusResource = this.createQueriesStatusResource();
    this.isLoading = computed(() => this.queriesStatusResource.isLoading());
    this.queries = computed(() => this.queriesStatusResource.value()?.data);
    this.pagination = computed(() => this.queriesStatusResource.value()?.meta);
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

  setPage(page: number, limit: number) {
    this.filter.update((value) => ({ ...value, page, limit }));
  }

  private createQueriesStatusResource() {
    return rxResource({
      request: () => ({ filter: this.filter() }),
      loader: ({ request }) => this.preSalesQueriesStatusApi.list(request.filter),
    });
  }
}
