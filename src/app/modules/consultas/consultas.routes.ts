import { Routes } from '@angular/router';
import { ConsultaTotalComponent } from './containers/consulta-total.component';
import { ConsultaDetalheComponent } from './containers/consulta-detalhe.component';
import { ConsultaPlaceholderComponent } from './containers/consulta-placeholder.component';

export default [
  { path: '', redirectTo: 'total/pre-venda', pathMatch: 'full' },
  {
    path: 'total',
    children: [
      { path: '', redirectTo: 'pre-venda', pathMatch: 'full' },
      { path: 'pre-venda', component: ConsultaTotalComponent, data: { queryType: 'PRE_VENDA' } },
      { path: 'trimestral', component: ConsultaTotalComponent, data: { queryType: 'TRIMESTRAL' } },
      { path: 'especial', component: ConsultaTotalComponent, data: { queryType: 'ESPECIAL' } },
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
      { path: 'impostas', component: ConsultaPlaceholderComponent, data: { title: 'Consultas › Multas › Impostas' } },
      { path: 'notificadas', component: ConsultaPlaceholderComponent, data: { title: 'Consultas › Multas › Notificadas' } },
      { path: 'todas', component: ConsultaPlaceholderComponent, data: { title: 'Consultas › Multas › Todas' } },
    ],
  },
] as Routes;
