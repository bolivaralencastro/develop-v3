import { Injectable, signal } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DashboardData } from '../models/client-dashboard.types';

const MOCK_DATA: DashboardData = {
  kpis: [
    { id: 'consultados', label: 'Veículos Consultados', value: '18.904', subLabel: 'Últimos 30 dias' },
    { id: 'liberados', label: 'Veículos Liberados', value: '14.210', subLabel: 'Últimos 30 dias' },
    { id: 'liberados-alerta', label: 'Liberados com Alerta', value: '1.292', subLabel: 'Últimos 30 dias' },
    { id: 'bloqueados', label: 'Veículos Bloqueados', value: '2.780', subLabel: 'Últimos 30 dias' },
    { id: 'bloqueados-alerta', label: 'Bloqueados com Alerta', value: '622', subLabel: 'Últimos 30 dias' },
  ],
  // Ordem: Outros (erro de importação), Liberado, Liberado com Alerta, Bloqueado com Alerta, Bloqueado
  vehicleStatusSeries: [380, 14210, 1292, 622, 2780],
  blocksChartSeries: [48, 31, 24, 18, 12],
  blocksChartCategories: ['PRF', 'Judicial', 'Roubo/Furto', 'Gravame', 'Recall'],
  alertsChartSeries: [36, 29, 22, 15, 9],
  alertsChartCategories: ['Recall', 'GNV', 'Licenciamento', 'CRLV', 'Gravame'],
  evolutionByPeriod: {
    semanal: {
      categories: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
      atual: [220, 260, 240, 320, 380, 360, 410],
      anterior: [190, 230, 210, 280, 340, 320, 360],
    },
    mensal: {
      categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
      atual: [5200, 5480, 5100, 5620, 5900, 6100, 6350, 6200, 6480, 6700, 6900, 7100],
      anterior: [4700, 4950, 4800, 5100, 5300, 5600, 5800, 5750, 5900, 6100, 6300, 6500],
    },
    trimestral: {
      categories: ['T1', 'T2', 'T3', 'T4'],
      atual: [15780, 17620, 19030, 20700],
      anterior: [14450, 16000, 17250, 18900],
    },
  },
  // kpis por id (mesma ordem dos cards), blocks/alerts na ordem das categorias dos gráficos de motivos
  comparison: {
    options: ['Fevereiro/2026', 'Março/2026', 'Abril/2026', 'Maio/2026', 'Junho/2026', 'Julho/2026'],
    categories: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
    byOption: {
      'Fevereiro/2026': {
        kpis: { 'consultados': 15200, 'liberados': 11400, 'liberados-alerta': 1010, 'bloqueados': 2290, 'bloqueados-alerta': 500 },
        evolution: [1180, 1290, 1350, 1428],
        blocks: [39, 25, 20, 15, 10],
        alerts: [30, 24, 18, 12, 7],
      },
      'Março/2026': {
        kpis: { 'consultados': 15900, 'liberados': 11950, 'liberados-alerta': 1060, 'bloqueados': 2400, 'bloqueados-alerta': 522 },
        evolution: [1240, 1310, 1465, 1520],
        blocks: [41, 26, 21, 15, 10],
        alerts: [31, 25, 19, 13, 8],
      },
      'Abril/2026': {
        kpis: { 'consultados': 16600, 'liberados': 12480, 'liberados-alerta': 1105, 'bloqueados': 2510, 'bloqueados-alerta': 546 },
        evolution: [1305, 1420, 1490, 1605],
        blocks: [43, 28, 21, 16, 11],
        alerts: [33, 26, 20, 13, 8],
      },
      'Maio/2026': {
        kpis: { 'consultados': 17400, 'liberados': 13100, 'liberados-alerta': 1160, 'bloqueados': 2620, 'bloqueados-alerta': 570 },
        evolution: [1380, 1455, 1570, 1660],
        blocks: [45, 29, 22, 17, 11],
        alerts: [34, 27, 21, 14, 8],
      },
      'Junho/2026': {
        kpis: { 'consultados': 18100, 'liberados': 13620, 'liberados-alerta': 1225, 'bloqueados': 2700, 'bloqueados-alerta': 595 },
        evolution: [1410, 1530, 1615, 1745],
        blocks: [46, 30, 23, 17, 12],
        alerts: [35, 28, 21, 14, 9],
      },
      'Julho/2026': {
        kpis: { 'consultados': 18904, 'liberados': 14210, 'liberados-alerta': 1292, 'bloqueados': 2780, 'bloqueados-alerta': 622 },
        evolution: [1480, 1590, 1680, 1820],
        blocks: [48, 31, 24, 18, 12],
        alerts: [36, 29, 22, 15, 9],
      },
    },
  },
  unblockedByRegion: [
    { state: 'PR', volume: '4.820', fines: '312', alerts: '180' },
    { state: 'SP', volume: '5.210', fines: '428', alerts: '245' },
    { state: 'MG', volume: '3.102', fines: '198', alerts: '132' },
    { state: 'Outros', volume: '2.370', fines: '164', alerts: '98' },
  ],
  blockedByRegion: [
    { state: 'PR', volume: '1.240', fines: '86', alerts: '52' },
    { state: 'SP', volume: '1.020', fines: '72', alerts: '41' },
    { state: 'MG', volume: '680', fines: '48', alerts: '30' },
    { state: 'Outros', volume: '462', fines: '34', alerts: '22' },
  ],
};

@Injectable({ providedIn: 'root' })
export class ClientDashboardService {
  readonly loading = signal(true);
  readonly data = signal<DashboardData | null>(null);

  load(): void {
    this.loading.set(true);
    of(MOCK_DATA)
      .pipe(delay(1000))
      .subscribe((result) => {
        this.data.set(result);
        this.loading.set(false);
      });
  }
}
