/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [];
export const compactNavigation: FuseNavigationItem[] = [];
export const futuristicNavigation: FuseNavigationItem[] = [
  {
    id: 'client-dashboard',
    title: 'Dashboard',
    type: 'basic',
    icon: 'heroicons_outline:chart-pie',
    link: '/client-dashboard',
  },
  {
    id: 'consultas',
    title: 'Consultas',
    type: 'collapsable',
    icon: 'heroicons_outline:clipboard-document-check',
    children: [
      {
        id: 'consultas-total',
        title: 'Total',
        type: 'collapsable',
        icon: 'heroicons_outline:squares-2x2',
        children: [
          {
            id: 'consultas-total-pre-venda',
            title: 'Pré-venda',
            type: 'basic',
            link: '/consultas/total/pre-venda',
          },
          {
            id: 'consultas-total-trimestral',
            title: 'Trimestral',
            type: 'basic',
            link: '/consultas/total/trimestral',
          },
          {
            id: 'consultas-total-especial',
            title: 'Especial',
            type: 'basic',
            link: '/consultas/total/especial',
          },
        ],
      },
      {
        id: 'consultas-situacao-veiculo',
        title: 'Situação do Veículo',
        type: 'basic',
        link: '/consultas/situacao-veiculo',
      },
      {
        id: 'consultas-recall',
        title: 'Recall',
        type: 'basic',
        link: '/consultas/recall',
      },
      {
        id: 'consultas-gnv',
        title: 'GNV',
        type: 'basic',
        link: '/consultas/gnv',
      },
      {
        id: 'consultas-gravame',
        title: 'Gravame',
        type: 'basic',
        link: '/consultas/gravame',
      },
      {
        id: 'consultas-proprietario',
        title: 'Proprietário',
        type: 'basic',
        link: '/consultas/proprietario',
      },
      {
        id: 'consultas-crlv',
        title: 'CRLV',
        type: 'basic',
        link: '/consultas/crlv',
      },
      {
        id: 'consultas-ipva',
        title: 'IPVA',
        type: 'basic',
        link: '/consultas/ipva',
      },
      {
        id: 'consultas-licenciamento',
        title: 'Licenciamento',
        type: 'basic',
        link: '/consultas/licenciamento',
      },
      {
        id: 'consultas-multas',
        title: 'Multas',
        type: 'collapsable',
        icon: 'heroicons_outline:document-text',
        children: [
          {
            id: 'consultas-multas-impostas',
            title: 'Impostas',
            type: 'basic',
            link: '/consultas/multas/impostas',
          },
          {
            id: 'consultas-multas-notificadas',
            title: 'Notificadas',
            type: 'basic',
            link: '/consultas/multas/notificadas',
          },
          {
            id: 'consultas-multas-todas',
            title: 'Todas as Multas',
            type: 'basic',
            link: '/consultas/multas/todas',
          },
        ],
      },
    ],
  },
  {
    id: 'veiculos',
    title: 'Veículos',
    type: 'collapsable',
    icon: 'mat_outline:directions_car',
    children: [
      {
        id: 'veiculos-liberados',
        title: 'Liberados',
        type: 'basic',
        link: '/veiculos/liberados',
      },
      {
        id: 'veiculos-liberados-alerta',
        title: 'Liberados com Alertas',
        type: 'basic',
        link: '/veiculos/liberados-alerta',
      },
      {
        id: 'veiculos-bloqueados',
        title: 'Bloqueados',
        type: 'basic',
        link: '/veiculos/bloqueados',
      },
      {
        id: 'veiculos-bloqueados-alerta',
        title: 'Bloqueados com Alertas',
        type: 'basic',
        link: '/veiculos/bloqueados-alerta',
      },
      {
        id: 'veiculos-todos',
        title: 'Todos os Veículos',
        type: 'basic',
        link: '/veiculos/todos',
      },
      {
        id: 'veiculos-multas',
        title: 'Multas',
        type: 'basic',
        link: '/veiculos/multas',
      },
    ],
  },
  {
    id: 'multas',
    title: 'Multas',
    type: 'collapsable',
    icon: 'heroicons_outline:document-text',
    children: [
      {
        id: 'multas-impostas',
        title: 'Impostas',
        type: 'basic',
        link: '/multas/impostas',
      },
      {
        id: 'multas-notificadas',
        title: 'Notificadas',
        type: 'basic',
        link: '/multas/notificadas',
      },
      {
        id: 'multas-todas',
        title: 'Todas as Multas',
        type: 'basic',
        link: '/multas/todas',
      },
    ],
  },
  {
    id: 'atpv',
    title: 'ATPV',
    type: 'collapsable',
    icon: 'mat_outline:social_distance',
    children: [
      {
        id: 'atpv-preenchimento',
        title: 'Preenchimento',
        type: 'basic',
        link: '/atpv/preenchimento',
      },
      {
        id: 'atpv-comunicacao',
        title: 'Comunicação',
        type: 'basic',
        link: '/atpv/comunicacao',
      },
    ],
  },
  { id: 'spacer', type: 'spacer' },
  {
    id: 'admin',
    title: 'Admin',
    type: 'group',
    icon: 'heroicons_outline:building-office-2',
    children: [
      {
        id: 'customers',
        title: 'Clientes',
        type: 'basic',
        icon: 'heroicons_outline:building-office-2',
        link: '/admin/customers',
      },
      {
        id: 'queries',
        title: 'Consultas',
        type: 'basic',
        icon: 'mat_outline:manage_search',
        link: '/admin/queries-status',
      },
    ],
  },
];
export const horizontalNavigation: FuseNavigationItem[] = [];
