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
  evolutionComparativo: {
    options: ['Fevereiro/2026', 'Março/2026', 'Abril/2026', 'Maio/2026', 'Junho/2026', 'Julho/2026'],
    categories: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
    seriesByOption: {
      'Fevereiro/2026': [1180, 1290, 1350, 1428],
      'Março/2026': [1240, 1310, 1465, 1520],
      'Abril/2026': [1305, 1420, 1490, 1605],
      'Maio/2026': [1380, 1455, 1570, 1660],
      'Junho/2026': [1410, 1530, 1615, 1745],
      'Julho/2026': [1480, 1590, 1680, 1820],
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
