import { Routes } from '@angular/router';
import { ConsultaDetalheComponent } from './containers/consulta-detalhe.component';
import { ConsultaTotalComponent } from './containers/consulta-total.component';
import { PreSalesDetailComponent } from '../pre-sales/containers/pre-sales-detail.component';
import { MultasListComponent } from '../multas/containers/multas-list.component';

export default [
  { path: '', redirectTo: 'total', pathMatch: 'full' },
  {
    path: 'total',
    children: [
      {
        path: '',
        component: ConsultaTotalComponent,
        data: {
          title: 'Consultas › Total',
          storageKey: 'consultas-total-columns',
        },
      },
      { path: ':id', component: PreSalesDetailComponent, data: { title: 'Consultas › Total' } },
    ],
  },
  { path: 'situacao-veiculo', component: ConsultaDetalheComponent, data: { consulType: 'SITUACAO_VEICULO' } },
  { path: 'recall', component: ConsultaDetalheComponent, data: { consulType: 'RECALL' } },
  { path: 'gnv', component: ConsultaDetalheComponent, data: { consulType: 'GNV' } },
  { path: 'gravame', component: ConsultaDetalheComponent, data: { consulType: 'GRAVAME' } },
  { path: 'proprietario', component: ConsultaDetalheComponent, data: { consulType: 'PROPRIETARIO' } },
  { path: 'crlv', component: ConsultaDetalheComponent, data: { consulType: 'CRLV' } },
  { path: 'ipva', component: ConsultaDetalheComponent, data: { consulType: 'IPVA' } },
  { path: 'licenciamento', component: ConsultaDetalheComponent, data: { consulType: 'LICENCIAMENTO' } },
  {
    path: 'multas',
    children: [
      { path: '', redirectTo: 'impostas', pathMatch: 'full' },
      { path: 'impostas', component: MultasListComponent, data: { tipo: 'IMPOSTAS', titlePrefix: 'Consultas › Multas', summary: true } },
      { path: 'notificadas', component: MultasListComponent, data: { tipo: 'NOTIFICADAS', titlePrefix: 'Consultas › Multas', summary: true } },
      { path: 'todas', component: MultasListComponent, data: { tipo: 'TODAS', titlePrefix: 'Consultas › Multas', summary: true } },
    ],
  },
] as Routes;
