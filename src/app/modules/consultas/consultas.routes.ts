import { Routes } from '@angular/router';
import { ConsultaDetalheComponent } from './containers/consulta-detalhe.component';
import { PreSalesListComponent } from '../pre-sales/containers/pre-sales-list.component';
import { PreSalesDetailComponent } from '../pre-sales/containers/pre-sales-detail.component';
import { MultasListComponent } from '../multas/containers/multas-list.component';

export default [
  { path: '', redirectTo: 'total/pre-venda', pathMatch: 'full' },
  {
    path: 'total',
    children: [
      { path: '', redirectTo: 'pre-venda', pathMatch: 'full' },
      {
        path: 'pre-venda',
        children: [
          {
            path: '',
            component: PreSalesListComponent,
            data: {
              title: 'Consultas › Total › Pré-venda',
              storageKey: 'consultas-total-pre-venda-columns',
              lockedQueryType: 'PRE_SALES',
            },
          },
          { path: ':id', component: PreSalesDetailComponent, data: { title: 'Consultas › Total › Pré-venda' } },
        ],
      },
      {
        path: 'trimestral',
        children: [
          {
            path: '',
            component: PreSalesListComponent,
            data: {
              title: 'Consultas › Total › Trimestral',
              storageKey: 'consultas-total-trimestral-columns',
              lockedQueryType: 'QUARTERLY',
            },
          },
          { path: ':id', component: PreSalesDetailComponent, data: { title: 'Consultas › Total › Trimestral' } },
        ],
      },
      {
        path: 'especial',
        children: [
          {
            path: '',
            component: PreSalesListComponent,
            data: {
              title: 'Consultas › Total › Especial',
              storageKey: 'consultas-total-especial-columns',
              lockedQueryType: 'SPECIAL',
            },
          },
          { path: ':id', component: PreSalesDetailComponent, data: { title: 'Consultas › Total › Especial' } },
        ],
      },
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
      { path: 'impostas', component: MultasListComponent, data: { tipo: 'IMPOSTAS', titlePrefix: 'Consultas › Multas' } },
      { path: 'notificadas', component: MultasListComponent, data: { tipo: 'NOTIFICADAS', titlePrefix: 'Consultas › Multas' } },
      { path: 'todas', component: MultasListComponent, data: { tipo: 'TODAS', titlePrefix: 'Consultas › Multas' } },
    ],
  },
] as Routes;
