import { computed, Injectable, ResourceRef, Signal, signal } from '@angular/core';
import { BaseFilter, PageDto, PageMeta } from '@core/http';
import { VehicleDto, VehiclesFilter, VehicleStatusFilter } from '../models/vehicles.types';
import { VehiclesApi } from './vehicles-api';
import { rxResource } from '@angular/core/rxjs-interop';

@Injectable()
export class VehiclesService {
  private readonly filter = signal<VehiclesFilter>({ page: 1, limit: 20 });
  private readonly statusFilter = signal<VehicleStatusFilter | null>(null);
  private readonly vehiclesResource: ResourceRef<PageDto<VehicleDto>>;
  readonly isLoading: Signal<boolean>;
  readonly vehicles: Signal<VehicleDto[]>;
  readonly pagination: Signal<PageMeta>;

  constructor(private readonly vehiclesApi: VehiclesApi) {
    this.vehiclesResource = this.createVehiclesResource();
    this.isLoading = computed(() => this.vehiclesResource.isLoading());
    this.vehicles = computed(() => this.vehiclesResource.value()?.data);
    this.pagination = computed(() => this.vehiclesResource.value()?.meta);
  }

  private createVehiclesResource() {
    return rxResource({
      request: () => ({ filter: this.filter(), statusFilter: this.statusFilter() }),
      loader: ({ request }) => this.vehiclesApi.list(this.buildFilter(request.filter, request.statusFilter)),
    });
  }

  private buildFilter(filter: VehiclesFilter, statusFilter: VehicleStatusFilter | null): BaseFilter<VehicleDto> {
    const combined: any = { ...filter };
    if (statusFilter === 'LIBERADOS') {
      combined.status = ['LIBERADO'];
      combined.alerta = false;
    } else if (statusFilter === 'LIBERADOS_ALERTA') {
      combined.status = ['LIBERADO'];
      combined.alerta = true;
    } else if (statusFilter === 'BLOQUEADOS') {
      combined.status = ['BLOQUEADO'];
      combined.alerta = false;
    } else if (statusFilter === 'BLOQUEADOS_ALERTA') {
      combined.status = ['BLOQUEADO'];
      combined.alerta = true;
    }
    return combined;
  }

  setStatusFilter(statusFilter: VehicleStatusFilter | null) {
    this.statusFilter.set(statusFilter);
  }

  setPage(pageIndex: number, pageSize: number) {
    this.filter.update((currentFilter) => ({ ...currentFilter, page: pageIndex, limit: pageSize }));
  }

  setFilter(filter: VehiclesFilter) {
    this.filter.update((currentFilter) => ({ ...filter, page: currentFilter.page, limit: currentFilter.limit }));
  }
}
