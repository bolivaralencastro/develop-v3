import { Routes } from '@angular/router';
import { VehiclesComponent } from './containers/vehicles.component';
import { VehicleDetailsComponent } from './containers/vehicle-details.component';

export default [
  { path: '', redirectTo: 'liberados', pathMatch: 'full' },
  {
    path: 'liberados',
    component: VehiclesComponent,
    data: { statusFilter: 'LIBERADOS' },
  },
  {
    path: 'liberados-alerta',
    component: VehiclesComponent,
    data: { statusFilter: 'LIBERADOS_ALERTA' },
  },
  {
    path: 'bloqueados',
    component: VehiclesComponent,
    data: { statusFilter: 'BLOQUEADOS' },
  },
  {
    path: 'bloqueados-alerta',
    component: VehiclesComponent,
    data: { statusFilter: 'BLOQUEADOS_ALERTA' },
  },
  {
    path: 'todos',
    component: VehiclesComponent,
    data: { statusFilter: 'TODOS' },
  },
  {
    path: 'multas',
    component: VehiclesComponent,
    data: { statusFilter: 'MULTAS' },
  },
  {
    path: ':id',
    component: VehicleDetailsComponent,
  },
] as Routes;
