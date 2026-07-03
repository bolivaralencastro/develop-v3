import { computed, Injectable, ResourceRef, signal, Signal } from '@angular/core';
import { VehiclesApi } from './vehicles-api';
import { VehicleDto } from '../models/vehicles.types';
import { rxResource } from '@angular/core/rxjs-interop';

@Injectable()
export class VehiclesDetailService {
  readonly isLoading: Signal<boolean>;
  readonly vehicle: Signal<VehicleDto>;
  private readonly vehicleResource: ResourceRef<VehicleDto>;
  private readonly currentVehicleId = signal('');

  constructor(private readonly vehiclesApi: VehiclesApi) {
    this.vehicleResource = this.createVehicleResource();
    this.isLoading = computed(() => this.vehicleResource.isLoading());
    this.vehicle = computed(() => this.vehicleResource.value());
  }

  loadDetails(id: string) {
    this.currentVehicleId.set(id);
  }

  private createVehicleResource() {
    return rxResource({
      request: () => ({ id: this.currentVehicleId() }),
      loader: ({ request }) => this.vehiclesApi.getDetails(request.id),
    });
  }
}
