import { Injectable, signal } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DashboardData } from '../models/client-dashboard.types';

const MOCK_DATA: DashboardData = {
  kpis: [
    { id: 'queries', label: 'Consultas no período', value: '2.482', subLabel: 'Últimos 30 dias' },
    { id: 'vehicles', label: 'Veículos analisados', value: '18.904', subLabel: 'Últimos 30 dias' },
    { id: 'unblocked', label: 'Liberados', value: '15.502', subLabel: 'Últimos 30 dias' },
    { id: 'blocked', label: 'Bloqueados', value: '3.402', subLabel: 'Últimos 30 dias' },
    { id: 'processing', label: 'Em processamento', value: '12', subLabel: 'Agora' },
    { id: 'errors', label: 'Taxa de erro', value: '0,6%', subLabel: 'Últimos 30 dias' },
  ],
  queriesChartSeries: [
    { name: 'Consultas', data: [220, 260, 240, 320, 380, 360, 410] },
    { name: 'Veículos', data: [1240, 980, 1320, 1460, 1620, 1540, 1710] },
  ],
  queriesChartCategories: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
  statusChartSeries: [78, 18, 4],
  blocksChartSeries: [48, 31, 24, 18, 12],
  blocksChartCategories: ['PRF', 'Judicial', 'Roubo/Furto', 'Gravame', 'Recall'],
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
