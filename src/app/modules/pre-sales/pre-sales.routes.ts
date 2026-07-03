import { Routes } from '@angular/router';
import { PreSalesListComponent } from './containers/pre-sales-list.component';
import { PreSalesDetailComponent } from './containers/pre-sales-detail.component';

export default [
  {
    path: '',
    component: PreSalesListComponent,
  },
  {
    path: ':id',
    component: PreSalesDetailComponent,
  },
] as Routes;
