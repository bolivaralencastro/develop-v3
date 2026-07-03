import { Routes } from '@angular/router';
import { AtpvPlaceholderComponent } from './atpv-placeholder.component';

export default [
  { path: '', redirectTo: 'preenchimento', pathMatch: 'full' },
  { path: 'preenchimento', component: AtpvPlaceholderComponent, data: { title: 'ATPV › Preenchimento' } },
  { path: 'comunicacao', component: AtpvPlaceholderComponent, data: { title: 'ATPV › Comunicação' } },
] as Routes;
