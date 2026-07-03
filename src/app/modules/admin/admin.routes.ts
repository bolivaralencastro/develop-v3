import { Routes } from '@angular/router';

export default [
  {
    path: 'customers',
    loadChildren: () => import('./customers/customers.routes'),
  },
  {
    path: 'queries-status',
    loadChildren: () => import('./queries-status/queries-status.routes'),
  },
  { path: '', redirectTo: 'customers', pathMatch: 'full' },
] as Routes;
