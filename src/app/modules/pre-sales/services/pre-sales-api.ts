import { inject, Injectable } from '@angular/core';
import { DevelopHttpClient, PageDto } from '@core/http';
import {
  PRE_SALE_QUERY_CATEGORY,
  PRE_SALE_QUERY_TYPE,
  PreSaleImportHistoryResponseDto,
  PresaleImportHistoryStatusCount,
  PreSaleImportHistoryVehicleResponseDto,
  PreSaleImportHistoryVehiclesFilter,
  PreSalesFilter,
} from '../models/pre-sales.types';

@Injectable({ providedIn: 'root' })
export class PreSalesApi {
  private readonly http = inject(DevelopHttpClient);
  private readonly API = '/pre-sales';

  create(file: File, category: PRE_SALE_QUERY_CATEGORY, type: PRE_SALE_QUERY_TYPE) {
    const payload = new FormData();
    payload.set('file', file);
    payload.set('queryCategory', category);
    payload.set('queryType', type);
    return this.http.postFormData<PreSaleImportHistoryResponseDto>(`${this.API}/import`, payload);
  }

  list(filter: PreSalesFilter) {
    return this.http.get<PageDto<PreSaleImportHistoryResponseDto>>(this.API, this.buildPreSalesFilter(filter));
  }

  getHistory(id: string) {
    return this.http.get<PreSaleImportHistoryResponseDto>(`${this.API}/${id}`);
  }

  getHistoryStatus(id: string) {
    return this.http.get<PresaleImportHistoryStatusCount>(`${this.API}/${id}/status-count`);
  }

  getPreSalesVehicles(id: string, filter: PreSaleImportHistoryVehiclesFilter) {
    return this.http.get<PageDto<PreSaleImportHistoryVehicleResponseDto>>(`${this.API}/${id}/vehicles`, this.buildVehiclesFilter(filter));
  }

  private buildPreSalesFilter(filter: PreSalesFilter) {
    const params: Record<string, any> = {
      page: filter.page,
      limit: filter.limit,
    };

    if (filter.search) {
      params['search'] = filter.search;
    }

    if (filter.queryCategory?.length) {
      params['filter.queryCategory'] = `$in:${filter.queryCategory}`;
    }

    if (filter.queryType?.length) {
      params['filter.queryType'] = `$in:${filter.queryType}`;
    }

    if (filter.sort) {
      params['sortBy'] = `${filter.sort}:${filter.order}`;
    }

    return params;
  }

  private buildVehiclesFilter(filter: PreSaleImportHistoryVehiclesFilter) {
    const params: Record<string, any> = {
      page: filter.page,
      limit: filter.limit,
    };

    if (filter.search) {
      params['search'] = filter.search;
    }

    if (filter.status?.length) {
      params['filter.status'] = `$in:${filter.status}`;
    }

    if (filter.state?.length) {
      params['filter.vehicle.state'] = `$in:${filter.state}`;
    }

    if (filter.situation?.length) {
      params['filter.vehicle.situation'] = `$in:${filter.situation}`;
    }

    if (filter.sort) {
      params['sortBy'] = `${filter.sort}:${filter.order}`;
    }

    return params;
  }
}
