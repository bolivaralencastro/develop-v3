import { Component, input } from '@angular/core';
import { VehicleDto } from '../models/vehicles.types';
import { NgTemplateOutlet } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'app-vehicle-features',
  imports: [NgTemplateOutlet, TranslocoModule],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-32 xl:grid-cols-3">
      <ng-container
        [ngTemplateOutlet]="infoItem"
        [ngTemplateOutletContext]="{ title: 'vehicles.vehicle-features.numberPlate', value: vehicle()?.numberPlate }"
      ></ng-container>

      <ng-container
        [ngTemplateOutlet]="infoItem"
        [ngTemplateOutletContext]="{ title: 'vehicles.vehicle-features.renavam', value: vehicle()?.renavam }"
      ></ng-container>

      <ng-container
        [ngTemplateOutlet]="infoItem"
        [ngTemplateOutletContext]="{ title: 'vehicles.vehicle-features.chassi', value: vehicle()?.chassi }"
      ></ng-container>

      <ng-container
        [ngTemplateOutlet]="infoItem"
        [ngTemplateOutletContext]="{ title: 'vehicles.vehicle-features.manufactureYear', value: vehicle()?.manufactureYear }"
      ></ng-container>

      <ng-container
        [ngTemplateOutlet]="infoItem"
        [ngTemplateOutletContext]="{ title: 'vehicles.vehicle-features.modelYear', value: vehicle()?.modelYear }"
      ></ng-container>

      <ng-container
        [ngTemplateOutlet]="infoItem"
        [ngTemplateOutletContext]="{ title: 'vehicles.vehicle-features.color', value: vehicle()?.color }"
      ></ng-container>

      <ng-container
        [ngTemplateOutlet]="infoItem"
        [ngTemplateOutletContext]="{ title: 'vehicles.vehicle-features.city', value: vehicle()?.city }"
      ></ng-container>

      <ng-container [ngTemplateOutlet]="infoItem" [ngTemplateOutletContext]="{ title: 'vehicles.vehicle-features.uf', value: vehicle()?.state }"></ng-container>

      <ng-container
        [ngTemplateOutlet]="infoItem"
        [ngTemplateOutletContext]="{ title: 'vehicles.vehicle-features.fuelType', value: vehicle()?.fuelType }"
      ></ng-container>
    </div>

    <ng-template #infoItem let-title="title" let-value="value">
      <div class="flex justify-between gap-2 hover:bg-hover px-4 py-2 rounded-md">
        <div class="text-hint font-medium select-none">{{ title | transloco }}</div>
        <div class="font-semibold" [class.text-disabled]="!value">{{ value || '--' }}</div>
      </div>
    </ng-template>
  `,
  styles: ``,
})
export class VehicleFeaturesComponent {
  protected readonly vehicle = input<VehicleDto>();
}
