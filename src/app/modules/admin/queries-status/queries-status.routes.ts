import { PreSalesQueriesStatusListComponent } from './containers/pre-sales-queries-status-list.component';
import { Routes } from '@angular/router';
import { VehicleQueriesStatusListComponent } from './containers/vehicle-queries-status-list.component';

export default [
  {
    path: '',
    component: PreSalesQueriesStatusListComponent,
  },
  {
    path: ':queryId',
    component: VehicleQueriesStatusListComponent,
  }
] as Routes;
