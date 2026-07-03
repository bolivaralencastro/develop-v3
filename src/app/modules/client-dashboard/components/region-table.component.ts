import { Component, input, computed } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RegionRow } from '../models/client-dashboard.types';

@Component({
  selector: 'app-region-table',
  imports: [MatIconModule],
  template: `
    <div class="bg-card region-card rounded-lg border border-gray-200 shadow">
      <div class="region-card__header">
        <h3 class="region-card__title">
          <mat-icon>{{ icon() }}</mat-icon>
          <span>{{ title() }}</span>
        </h3>
      </div>
      <table class="region-table">
        <thead>
          <tr>
            <th>UF</th>
            <th class="text-right">Veículos</th>
            <th class="text-right">Multas</th>
            <th class="text-right">Alertas</th>
          </tr>
        </thead>
        <tbody>
          @for (row of rows(); track row.state) {
            <tr>
              <td>{{ row.state }}</td>
              <td class="text-right">{{ row.volume }}</td>
              <td class="text-right">{{ row.fines }}</td>
              <td class="text-right">{{ row.alerts }}</td>
            </tr>
          }
          <tr class="region-table__total">
            <td>TOTAL</td>
            <td class="text-right">{{ total().volume }}</td>
            <td class="text-right">{{ total().fines }}</td>
            <td class="text-right">{{ total().alerts }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: `
    .region-card {
      overflow: hidden;
    }

    .region-card__header {
      padding: 16px 24px 12px;
      border-bottom: 1px solid #e2e8f0;
    }

    .region-card__title {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #0f172a;
      margin: 0;
    }

    .region-card__title mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .region-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }

    .region-table th {
      text-align: left;
      padding: 10px 24px;
      border-bottom: 2px solid #e2e8f0;
      color: #64748b;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .region-table td {
      padding: 10px 24px;
      border-bottom: 1px solid #f1f5f9;
    }

    .region-table__total {
      font-weight: 800;
      background: #f8fafc;
    }
  `,
})
export class RegionTableComponent {
  readonly title = input.required<string>();
  readonly icon = input.required<string>();
  readonly rows = input.required<RegionRow[]>();

  protected readonly total = computed(() => ({
    volume: this.sumField('volume'),
    fines: this.sumField('fines'),
    alerts: this.sumField('alerts'),
  }));

  private sumField(field: keyof Omit<RegionRow, 'state'>): string {
    const sum = this.rows().reduce((acc, row) => acc + this.parseLocaleNumber(row[field]), 0);
    return sum.toLocaleString('pt-BR');
  }

  private parseLocaleNumber(value: string): number {
    return parseInt(value.replace(/\./g, ''), 10) || 0;
  }
}
