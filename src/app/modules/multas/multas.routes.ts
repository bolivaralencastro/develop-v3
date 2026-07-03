import { Routes } from '@angular/router';
import { MultasListComponent } from './containers/multas-list.component';

export default [
  { path: '', redirectTo: 'impostas', pathMatch: 'full' },
  { path: 'impostas', component: MultasListComponent, data: { tipo: 'IMPOSTAS' } },
  { path: 'notificadas', component: MultasListComponent, data: { tipo: 'NOTIFICADAS' } },
  { path: 'todas', component: MultasListComponent, data: { tipo: 'TODAS' } },
] as Routes;
