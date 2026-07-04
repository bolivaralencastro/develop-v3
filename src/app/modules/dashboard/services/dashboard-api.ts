import { inject, Injectable } from '@angular/core';
import { DevelopHttpClient } from '@core/http';
import { delay, Observable, of } from 'rxjs';
import { DashboardDataDTO } from '../models';
import { environment } from '@environment';

const MOCK_DATA = {
  totalItems: 1500,
  queryId: 'EL0061',
  queryDate: '2024-01-13T10:00:00Z',
  errorCount: 5,
  queries: {
    total: 1505,
    groups: [
      { label: 'MG', total: 400 },
      { label: 'SP', total: 600 },
      { label: 'PR', total: 300 },
      { label: 'Outros', total: 200 },
    ],
  },
  unblocked: {
    total: 1200,
    groups: [
      { label: 'MG', total: 350 },
      { label: 'SP', total: 500 },
      { label: 'PR', total: 250 },
      { label: 'Outros', total: 100 },
    ],
  },
  fined: {
    total: 150,
    groups: [
      { label: 'MG', total: 30 },
      { label: 'SP', total: 70 },
      { label: 'PR', total: 30 },
      { label: 'Outros', total: 20 },
    ],
  },
  alerts: {
    total: 1500,
    groups: [
      { label: 'Gravam', total: 10 },
      { label: 'Proprietário', total: 0 },
      { label: 'Último Licenciamento', total: 10 },
      { label: 'Recall', total: 10 },
    ],
  },
  blocks: {
    total: 100,
    groups: [
      { label: 'Bloqueio ADM', total: 10 },
      { label: 'Bloqueio PRF', total: 15 },
      { label: 'Bloqueio Jurídico', total: 20 },
      { label: 'RENAJUD', total: 0 },
      { label: 'Grande Monta', total: 35 },
      { label: 'Média Monta', total: 18 },
      { label: 'Roubo/Furto', total: 0 },
      { label: 'Beneficiário Tributário', total: 20 },
      { label: 'Baixado', total: 15 },
      { label: 'Outros', total: 19 },
    ],
  },
};

@Injectable({ providedIn: 'root' })
export class DashboardApi {
  private readonly http = inject(DevelopHttpClient);
  private readonly API = '/dashboard';

  fetchDashboardData(importHistoryId?: string) {
    const api = importHistoryId ? `${this.API}/${importHistoryId}` : this.API;
    if ((environment as any).mockAuth) {
      return of(this.buildMockDashboard(importHistoryId)).pipe(delay(200));
    }
    return this.http.get<any>(api);
  }

  fetchDashboardDataV2(importHistoryId: string): Observable<DashboardDataDTO> {
    const api = importHistoryId ? `${this.API}/${importHistoryId}` : this.API;
    if ((environment as any).mockAuth) {
      return of(this.buildMockDashboard(importHistoryId)).pipe(delay(200));
    }
    return this.http.get<any>(api);
  }

  private buildMockDashboard(importHistoryId?: string): DashboardDataDTO {
    const suffix = importHistoryId?.split('-').at(-1)?.toUpperCase() ?? '001';
    return {
      ...MOCK_DATA,
      queryId: `MOCK-${suffix}`,
      queryDate: '2026-07-03T10:00:00Z',
      blockedByState: {
        total: 100,
        groups: [
          { label: 'MG', total: 35 },
          { label: 'SP', total: 28 },
          { label: 'PR', total: 21 },
          { label: 'RJ', total: 16 },
        ],
      },
    };
  }
}
