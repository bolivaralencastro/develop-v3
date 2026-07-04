import { inject, Injectable } from '@angular/core';
import { DevelopHttpClient, PageDto } from '@core/http';
import {
  PRE_SALE_QUERY_CATEGORY,
  PRE_SALE_QUERY_TYPE,
  PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS,
  PreSaleImportHistoryResponseDto,
  PresaleImportHistoryStatusCount,
  PreSaleImportHistoryVehicleResponseDto,
  PreSaleImportHistoryVehiclesFilter,
  PreSalesFilter,
} from '../models/pre-sales.types';
import { environment } from '@environment';
import { delay, Observable, of } from 'rxjs';
import { PageMeta } from '@core/http';

const MOCK_BATCHES: PreSaleImportHistoryResponseDto[] = [
  {
    id: 'mock-pre-sales-001',
    originalFileName: 'modelo-pre-vendas.xlsx',
    filePath: 'memory://modelo-pre-vendas.xlsx',
    status: 'COMPLETED',
    totalRecords: 81,
    processedRecords: 81,
    successCount: 74,
    errorCount: 2,
    alreadyRegisteredCount: 5,
    progress: 100,
    name: 'PF0179_CONSULTA_02-07-26',
    queryCategory: PRE_SALE_QUERY_CATEGORY.FLEET,
    queryType: PRE_SALE_QUERY_TYPE.PRE_SALES,
    customId: 'PF0179',
    createdAt: '2026-07-02T17:38:08.284Z',
    reportUrl: 'https://reports.example/mock-pre-sales-001.xlsx',
  } as PreSaleImportHistoryResponseDto,
  {
    id: 'mock-pre-sales-002',
    originalFileName: 'modelo-pre-vendas.xlsx',
    filePath: 'memory://modelo-pre-vendas.xlsx',
    status: 'COMPLETED',
    totalRecords: 86,
    processedRecords: 86,
    successCount: 80,
    errorCount: 1,
    alreadyRegisteredCount: 5,
    progress: 100,
    name: 'PR0178_CONSULTA_02-07-26',
    queryCategory: PRE_SALE_QUERY_CATEGORY.RAC,
    queryType: PRE_SALE_QUERY_TYPE.PRE_SALES,
    customId: 'PR0178',
    createdAt: '2026-07-02T16:58:10.584Z',
    reportUrl: 'https://reports.example/mock-pre-sales-002.xlsx',
  } as PreSaleImportHistoryResponseDto,
  {
    id: 'mock-quarterly-001',
    originalFileName: 'modelo-trimestral.xlsx',
    filePath: 'memory://modelo-trimestral.xlsx',
    status: 'COMPLETED',
    totalRecords: 2609,
    processedRecords: 2609,
    successCount: 2491,
    errorCount: 16,
    alreadyRegisteredCount: 102,
    progress: 100,
    name: 'TF0172_CONSULTA_26-06-26',
    queryCategory: PRE_SALE_QUERY_CATEGORY.FLEET,
    queryType: PRE_SALE_QUERY_TYPE.QUARTERLY,
    customId: 'TF0172',
    createdAt: '2026-06-26T16:59:16.049Z',
    reportUrl: 'https://reports.example/mock-quarterly-001.xlsx',
  } as PreSaleImportHistoryResponseDto,
  {
    id: 'mock-quarterly-002',
    originalFileName: 'modelo-trimestral.xlsx',
    filePath: 'memory://modelo-trimestral.xlsx',
    status: 'COMPLETED',
    totalRecords: 158,
    processedRecords: 158,
    successCount: 150,
    errorCount: 3,
    alreadyRegisteredCount: 5,
    progress: 100,
    name: 'TR0175_CONSULTA_30-06-26',
    queryCategory: PRE_SALE_QUERY_CATEGORY.RAC,
    queryType: PRE_SALE_QUERY_TYPE.QUARTERLY,
    customId: 'TR0175',
    createdAt: '2026-06-30T13:11:58.355Z',
    reportUrl: 'https://reports.example/mock-quarterly-002.xlsx',
  } as PreSaleImportHistoryResponseDto,
  {
    id: 'mock-special-001',
    originalFileName: 'modelo-especial.xlsx',
    filePath: 'memory://modelo-especial.xlsx',
    status: 'COMPLETED',
    totalRecords: 412,
    processedRecords: 412,
    successCount: 389,
    errorCount: 7,
    alreadyRegisteredCount: 16,
    progress: 100,
    name: 'EF0180_CONSULTA_03-07-26',
    queryCategory: PRE_SALE_QUERY_CATEGORY.FREE,
    queryType: PRE_SALE_QUERY_TYPE.SPECIAL,
    customId: 'EF0180',
    createdAt: '2026-07-03T11:18:20.000Z',
    reportUrl: 'https://reports.example/mock-special-001.xlsx',
  } as PreSaleImportHistoryResponseDto,
  {
    id: 'mock-special-002',
    originalFileName: 'modelo-especial.xlsx',
    filePath: 'memory://modelo-especial.xlsx',
    status: 'COMPLETED',
    totalRecords: 94,
    processedRecords: 94,
    successCount: 88,
    errorCount: 1,
    alreadyRegisteredCount: 5,
    progress: 100,
    name: 'EF0176_CONSULTA_01-07-26',
    queryCategory: PRE_SALE_QUERY_CATEGORY.FLEET,
    queryType: PRE_SALE_QUERY_TYPE.SPECIAL,
    customId: 'EF0176',
    createdAt: '2026-07-01T09:11:00.000Z',
    reportUrl: 'https://reports.example/mock-special-002.xlsx',
  } as PreSaleImportHistoryResponseDto,
];

const MOCK_BATCH_VEHICLES: Record<string, PreSaleImportHistoryVehicleResponseDto[]> = {
  'mock-pre-sales-001': buildVehicles('mock-pre-sales-001', 'PF0179', 'MG'),
  'mock-pre-sales-002': buildVehicles('mock-pre-sales-002', 'PR0178', 'SP'),
  'mock-quarterly-001': buildVehicles('mock-quarterly-001', 'TF0172', 'PR'),
  'mock-quarterly-002': buildVehicles('mock-quarterly-002', 'TR0175', 'MG'),
  'mock-special-001': buildVehicles('mock-special-001', 'EF0180', 'RJ'),
  'mock-special-002': buildVehicles('mock-special-002', 'EF0176', 'SP'),
};

function buildVehicles(prefix: string, platePrefix: string, baseState: string): PreSaleImportHistoryVehicleResponseDto[] {
  return [
    createVehicle(prefix, 1, `${platePrefix}A1`, baseState, PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS.SUCCESS, PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS.SUCCESS, PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS.SUCCESS, PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS.SUCCESS, PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS.SUCCESS, PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS.SUCCESS, ''),
    createVehicle(prefix, 2, `${platePrefix}B2`, 'MG', PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS.SUCCESS, PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS.SUCCESS, PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS.SUCCESS, PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS.SUCCESS, PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS.SUCCESS, PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS.ERROR, 'Multa pendente de processamento'),
    createVehicle(prefix, 3, `${platePrefix}C3`, 'SP', PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS.ERROR, PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS.SUCCESS, PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS.SUCCESS, PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS.ERROR, PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS.SUCCESS, PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS.SUCCESS, 'Falha ao consultar proprietário'),
    createVehicle(prefix, 4, `${platePrefix}D4`, 'PR', PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS.PROCESSING, PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS.PROCESSING, PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS.PROCESSING, PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS.PROCESSING, PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS.PROCESSING, PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS.PROCESSING, ''),
    createVehicle(prefix, 5, `${platePrefix}E5`, 'RJ', PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS.SUCCESS, PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS.SUCCESS, PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS.ERROR, PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS.SUCCESS, PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS.SUCCESS, PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS.SUCCESS, 'Gravame identificado'),
    createVehicle(prefix, 6, `${platePrefix}F6`, 'RS', PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS.SUCCESS, PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS.SUCCESS, PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS.SUCCESS, PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS.SUCCESS, PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS.ERROR, PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS.SUCCESS, 'Recall em aberto'),
  ];
}

function createVehicle(
  prefix: string,
  line: number,
  plate: string,
  state: string,
  status: PreSaleImportHistoryVehicleResponseDto['status'],
  statusFines: PreSaleImportHistoryVehicleResponseDto['statusFines'],
  statusGravame: PreSaleImportHistoryVehicleResponseDto['statusGravame'],
  statusRecall: PreSaleImportHistoryVehicleResponseDto['statusRecall'],
  statusOwnerPr: PreSaleImportHistoryVehicleResponseDto['statusOwnerPr'],
  statusBlockPr: PreSaleImportHistoryVehicleResponseDto['statusBlockPr'],
  errorMessage: string,
): PreSaleImportHistoryVehicleResponseDto {
  return {
    id: `${prefix}-vehicle-${line}`,
    lineNumber: String(line),
    status,
    statusFines,
    statusGravame,
    statusRecall,
    statusOwnerPr,
    statusBlockPr,
    errorMessage,
    createdAt: '2026-07-03T12:00:00.000Z',
    vehicle: {
      id: `${prefix}-car-${line}`,
      numberPlate: plate,
      renavam: `RENAVAM${prefix.slice(-3)}${line}`.padEnd(11, '0'),
      chassi: `9BWZZZ377VT${String(line).padStart(6, '0')}`,
      state,
      estate: state,
    },
  };
}

function buildMeta(totalItems: number, currentPage: number, itemsPerPage: number): PageMeta {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  return {
    totalItems,
    currentPage,
    itemsPerPage,
    totalPages,
    filter: {},
    links: { first: '', previous: '', current: '', next: '', last: '' },
  };
}

function paginate<T>(items: T[], page = 1, limit = 20): PageDto<T> {
  const start = (page - 1) * limit;
  const end = start + limit;
  return {
    data: items.slice(start, end),
    meta: buildMeta(items.length, page, limit),
  };
}

@Injectable({ providedIn: 'root' })
export class PreSalesApi {
  private readonly http = inject(DevelopHttpClient);
  private readonly API = '/pre-sales';

  create(file: File, category: PRE_SALE_QUERY_CATEGORY, type: PRE_SALE_QUERY_TYPE) {
    if ((environment as any).mockAuth) {
      const item = {
        ...MOCK_BATCHES[0],
        id: `mock-${Date.now()}`,
        queryCategory: category,
        queryType: type,
        originalFileName: file.name,
        name: `${category.slice(0, 1)}${type.slice(0, 1)}_CONSULTA_MOCK`,
      } as PreSaleImportHistoryResponseDto;
      return of(item).pipe(delay(250));
    }

    const payload = new FormData();
    payload.set('file', file);
    payload.set('queryCategory', category);
    payload.set('queryType', type);
    return this.http.postFormData<PreSaleImportHistoryResponseDto>(`${this.API}/import`, payload);
  }

  list(filter: PreSalesFilter) {
    if ((environment as any).mockAuth) {
      return this.listMock(filter);
    }

    return this.http.get<PageDto<PreSaleImportHistoryResponseDto>>(this.API, this.buildPreSalesFilter(filter));
  }

  getHistory(id: string) {
    if ((environment as any).mockAuth) {
      return of(MOCK_BATCHES.find((item) => item.id === id) ?? MOCK_BATCHES[0]).pipe(delay(200));
    }

    return this.http.get<PreSaleImportHistoryResponseDto>(`${this.API}/${id}`);
  }

  getHistoryStatus(id: string) {
    if ((environment as any).mockAuth) {
      return of(this.buildMockStatus(id)).pipe(delay(200));
    }

    return this.http.get<PresaleImportHistoryStatusCount>(`${this.API}/${id}/status-count`);
  }

  getPreSalesVehicles(id: string, filter: PreSaleImportHistoryVehiclesFilter) {
    if ((environment as any).mockAuth) {
      return this.listMockVehicles(id, filter);
    }

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

  private listMock(filter: PreSalesFilter): Observable<PageDto<PreSaleImportHistoryResponseDto>> {
    let data = [...MOCK_BATCHES];

    if (filter.search) {
      const q = filter.search.toLowerCase();
      data = data.filter((item) =>
        item.customId.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.originalFileName.toLowerCase().includes(q),
      );
    }

    if (filter.queryType?.length) {
      data = data.filter((item) => filter.queryType.includes(item.queryType));
    }

    if (filter.queryCategory?.length) {
      data = data.filter((item) => filter.queryCategory.includes(item.queryCategory));
    }

    data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return of(paginate(data, filter.page, filter.limit)).pipe(delay(200));
  }

  private buildMockStatus(id: string): PresaleImportHistoryStatusCount {
    const vehicles = MOCK_BATCH_VEHICLES[id] ?? [];
    return {
      totalGeral: vehicles.length,
      progress: 100,
      porStatus: [
        { status: PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS.SUCCESS, total: vehicles.filter((item) => item.status === PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS.SUCCESS).length },
        { status: PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS.PROCESSING, total: vehicles.filter((item) => item.status === PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS.PROCESSING).length },
        { status: PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS.ERROR, total: vehicles.filter((item) => item.status === PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS.ERROR).length },
      ],
    };
  }

  private listMockVehicles(id: string, filter: PreSaleImportHistoryVehiclesFilter): Observable<PageDto<PreSaleImportHistoryVehicleResponseDto>> {
    let data = [...(MOCK_BATCH_VEHICLES[id] ?? [])];

    if (filter.search) {
      const q = filter.search.toLowerCase();
      data = data.filter((item) =>
        item.vehicle.numberPlate.toLowerCase().includes(q) ||
        item.vehicle.chassi.toLowerCase().includes(q) ||
        item.vehicle.renavam.toLowerCase().includes(q),
      );
    }

    if (filter.status?.length) {
      data = data.filter((item) => filter.status.includes(item.status));
    }

    if (filter.state?.length) {
      data = data.filter((item) => filter.state.includes(item.vehicle.state ?? item.vehicle.estate));
    }

    if (filter.sort) {
      const direction = filter.order === 'DESC' ? -1 : 1;
      data.sort((a, b) => {
        const valueA = this.vehicleSortValue(a, filter.sort);
        const valueB = this.vehicleSortValue(b, filter.sort);
        return String(valueA).localeCompare(String(valueB)) * direction;
      });
    }

    return of(paginate(data, filter.page, filter.limit)).pipe(delay(200));
  }

  private vehicleSortValue(item: PreSaleImportHistoryVehicleResponseDto, sort: string) {
    switch (sort) {
      case 'placa':
        return item.vehicle.numberPlate;
      case 'renavam':
        return item.vehicle.renavam;
      case 'chassi':
        return item.vehicle.chassi;
      case 'state':
        return item.vehicle.state ?? item.vehicle.estate;
      default:
        return (item as any)[sort] ?? '';
    }
  }
}
