import { inject, Injectable } from '@angular/core';
import { DevelopHttpClient, PageDto } from '@core/http';
import {
  PreSaleImportHistoryResponseDto,
  PreSaleImportHistoryVehicleResponseDto,
  PreSaleImportHistoryVehiclesFilter,
  PreSalesFilter,
} from '../../../pre-sales/models/pre-sales.types';

@Injectable({ providedIn: 'root' })
export class PreSalesQueriesStatusApi {
  private readonly http = inject(DevelopHttpClient);
  private readonly API = '/pre-sales';

  list(filter: PreSalesFilter) {
    return this.http.get<PageDto<PreSaleImportHistoryResponseDto>>(this.API, this.buildPreSalesFilter(filter));
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

    if (filter.sort) {
      params['sortBy'] = `${filter.sort}:${filter.order}`;
    }

    return params;
  }
}
