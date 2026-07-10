import { Component, computed, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import {
  MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatNoDataRow, MatRow, MatRowDef, MatTable,
} from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { TableColumnDef } from 'app/layout/common/table-column-management/table-column-management.component';
import { ConsultaDetalheDto, ConsultaDetalheType } from '../models/consulta.types';

const STATUS_COLUMN: TableColumnDef = { key: 'status', label: 'Status' };
const BASE_COLUMNS: TableColumnDef[] = [
  { key: 'placa', label: 'Placa' }, { key: 'renavam', label: 'Renavam' },
  { key: 'chassi', label: 'Chassi' }, { key: 'estado', label: 'Estado' },
];

// Ordem das colunas espelha 1:1 as abas da planilha "MENU CONSULTAS 2 - REVISADO 09.07.26":
// Placa, Renavam, Chassi, Estado, Status, ...dados, com a coluna de situação por último.
export const DETALHE_COLUMN_DEFS: Record<ConsultaDetalheType, TableColumnDef[]> = {
  SITUACAO_VEICULO: [
    ...BASE_COLUMNS,
    STATUS_COLUMN,
    { key: 'descricaoSituacao', label: 'Situação Veículo' },
  ],
  RECALL: [
    ...BASE_COLUMNS,
    STATUS_COLUMN,
    { key: 'recall', label: 'Recall' }, { key: 'descricaoRecall', label: 'Descrição' },
    { key: 'dataRegistroRecall', label: 'Data Registro' }, { key: 'dataLimiteRecall', label: 'Data Limite' },
    { key: 'situacaoRecall', label: 'Situação Recall' },
  ],
  GNV: [
    ...BASE_COLUMNS,
    STATUS_COLUMN,
    { key: 'ultimoLaudoGnv', label: 'Último Laudo CSV' }, { key: 'prazoRegularizacaoGnv', label: 'Prazo para Regularização' },
    { key: 'situacaoGnv', label: 'Situação CSV' },
  ],
  GRAVAME: [
    ...BASE_COLUMNS,
    STATUS_COLUMN,
    { key: 'gravame', label: 'Gravame' },
  ],
  PROPRIETARIO: [
    ...BASE_COLUMNS,
    STATUS_COLUMN,
    { key: 'nomeProprietario', label: 'Proprietário' }, { key: 'cpfCnpj', label: 'CPF / CNPJ' },
  ],
  CRLV: [
    ...BASE_COLUMNS,
    STATUS_COLUMN,
    { key: 'ultimoLicenciamento', label: 'Último Licenciamento' },
  ],
  IPVA: [
    ...BASE_COLUMNS,
    STATUS_COLUMN,
    { key: 'valorIpva', label: 'IPVA' },
  ],
  LICENCIAMENTO: [
    ...BASE_COLUMNS,
    STATUS_COLUMN,
    { key: 'taxaLicenciamento', label: 'Licenciamento' },
  ],
};

const STATUS_COLORS: Record<string, string> = {
  // Situação Recall / GNV
  'VÁLIDO': 'bg-green-100 text-green-700',
  'VENCIDO': 'bg-red-100 text-red-700',
  'ATE 4 MESES': 'bg-amber-100 text-amber-700',
  'MAIS DE 4 MESES': 'bg-amber-100 text-amber-700',
  'N/A': 'bg-gray-100 text-gray-400',
  'N/C': 'bg-gray-100 text-gray-400',
};

const STATUS_TOOLTIP: Record<string, string> = {
  'VÁLIDO': 'Dentro da validade',
  'VENCIDO': 'Vencido — regularização necessária',
  'ATE 4 MESES': 'Vence em até 4 meses — atenção',
  'MAIS DE 4 MESES': 'Vence em mais de 4 meses',
  'N/A': 'Não aplicável',
  'N/C': 'Não consta',
};

function badgeClass(value: string | undefined): string {
  return STATUS_COLORS[value ?? ''] ?? 'bg-gray-100 text-gray-500';
}

function badgeTooltip(value: string | undefined): string {
  return STATUS_TOOLTIP[value ?? ''] ?? '';
}

const VEHICLE_STATUS_TOOLTIP: Record<string, string> = {
  LIBERADO: 'Liberado — veículo sem restrições ativas',
  ALERTA: 'Alerta — veículo requer atenção',
  BLOQUEADO: 'Bloqueado — veículo com restrições ou impedimentos',
};

function statusTooltip(value: string | undefined): string {
  return VEHICLE_STATUS_TOOLTIP[value ?? ''] ?? 'Informação faltando no sistema';
}

@Component({
  selector: 'app-consulta-detalhe-table',
  imports: [
    MatTable, MatColumnDef, MatHeaderCellDef, MatCell, MatHeaderCell, MatCellDef,
    MatIcon, MatHeaderRow, MatRowDef, MatHeaderRowDef, MatRow, MatNoDataRow,
    NgClass, MatTooltip,
  ],
  template: `
    <div class="grow flex">
      @let dataSet = items() ?? [];
      <mat-table [dataSource]="dataSet" class="grow">

        <!-- placa -->
        <ng-container matColumnDef="placa">
          <mat-header-cell *matHeaderCellDef class="flex-none w-28">Placa</mat-header-cell>
          <mat-cell *matCellDef="let r" class="flex-none w-28 font-mono font-semibold">{{ r.placa }}</mat-cell>
        </ng-container>

        <!-- renavam -->
        <ng-container matColumnDef="renavam">
          <mat-header-cell *matHeaderCellDef class="flex-none w-36">Renavam</mat-header-cell>
          <mat-cell *matCellDef="let r" class="flex-none w-36 font-mono text-sm">{{ r.renavam }}</mat-cell>
        </ng-container>

        <!-- chassi -->
        <ng-container matColumnDef="chassi">
          <mat-header-cell *matHeaderCellDef class="flex-none w-48">Chassi</mat-header-cell>
          <mat-cell *matCellDef="let r" class="flex-none w-48 font-mono text-sm">{{ r.chassi }}</mat-cell>
        </ng-container>

        <!-- estado -->
        <ng-container matColumnDef="estado">
          <mat-header-cell *matHeaderCellDef class="flex-none w-20">Estado</mat-header-cell>
          <mat-cell *matCellDef="let r" class="flex-none w-20">{{ r.estado }}</mat-cell>
        </ng-container>

        <!-- status -->
        <ng-container matColumnDef="status">
          <mat-header-cell *matHeaderCellDef class="flex-none w-24 justify-center">Status</mat-header-cell>
          <mat-cell *matCellDef="let r" class="flex-none w-24 justify-center">
            <span
              class="inline-flex items-center justify-center w-8 h-8 rounded-full cursor-default"
              [ngClass]="{
                'bg-green-100 text-green-700': r.status === 'LIBERADO',
                'bg-amber-100 text-amber-700': r.status === 'ALERTA',
                'bg-red-100 text-red-700': r.status === 'BLOQUEADO',
                'bg-yellow-300': !r.status
              }"
              [matTooltip]="statusTooltip(r.status)"
              matTooltipPosition="above"
            >
              @switch (r.status) {
                @case ('LIBERADO') {
                  <mat-icon class="icon-size-5" svgIcon="lucide:check-circle"></mat-icon>
                }
                @case ('ALERTA') {
                  <mat-icon class="icon-size-5" svgIcon="lucide:triangle-alert"></mat-icon>
                }
                @case ('BLOQUEADO') {
                  <mat-icon class="icon-size-5" svgIcon="lucide:x-circle"></mat-icon>
                }
              }
            </span>
          </mat-cell>
        </ng-container>

        <!-- descricaoSituacao (Situação do Veículo) -->
        <ng-container matColumnDef="descricaoSituacao">
          <mat-header-cell *matHeaderCellDef class="min-w-80">Situação Veículo</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-80 text-xs text-gray-700 line-clamp-2">{{ r.descricaoSituacao ?? '—' }}</mat-cell>
        </ng-container>

        <!-- recall -->
        <ng-container matColumnDef="recall">
          <mat-header-cell *matHeaderCellDef class="min-w-64">Recall</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-64 text-xs text-gray-700 line-clamp-2">{{ r.recall ?? '—' }}</mat-cell>
        </ng-container>

        <!-- descricaoRecall -->
        <ng-container matColumnDef="descricaoRecall">
          <mat-header-cell *matHeaderCellDef class="min-w-80">Descrição</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-80 text-xs text-gray-600 line-clamp-2">{{ r.descricaoRecall ?? '—' }}</mat-cell>
        </ng-container>

        <!-- dataRegistroRecall -->
        <ng-container matColumnDef="dataRegistroRecall">
          <mat-header-cell *matHeaderCellDef class="min-w-32">Data Registro</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-32 text-sm">{{ r.dataRegistroRecall ?? '—' }}</mat-cell>
        </ng-container>

        <!-- dataLimiteRecall -->
        <ng-container matColumnDef="dataLimiteRecall">
          <mat-header-cell *matHeaderCellDef class="min-w-32">Data Limite</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-32 text-sm">{{ r.dataLimiteRecall ?? '—' }}</mat-cell>
        </ng-container>

        <!-- situacaoRecall -->
        <ng-container matColumnDef="situacaoRecall">
          <mat-header-cell *matHeaderCellDef class="flex-none w-40 justify-center">Situação Recall</mat-header-cell>
          <mat-cell *matCellDef="let r" class="flex-none w-40 justify-center">
            <span class="text-xs font-semibold px-2 py-0.5 rounded-full cursor-default"
              [ngClass]="badgeClass(r.situacaoRecall)"
              [matTooltip]="badgeTooltip(r.situacaoRecall)"
              matTooltipPosition="above"
            >{{ r.situacaoRecall }}</span>
          </mat-cell>
        </ng-container>

        <!-- ultimoLaudoGnv -->
        <ng-container matColumnDef="ultimoLaudoGnv">
          <mat-header-cell *matHeaderCellDef class="min-w-32">Último Laudo CSV</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-32 text-sm">{{ r.ultimoLaudoGnv ?? '—' }}</mat-cell>
        </ng-container>

        <!-- prazoRegularizacaoGnv -->
        <ng-container matColumnDef="prazoRegularizacaoGnv">
          <mat-header-cell *matHeaderCellDef class="min-w-36">Prazo para Regularização</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-36 text-sm">{{ r.prazoRegularizacaoGnv ?? '—' }}</mat-cell>
        </ng-container>

        <!-- situacaoGnv -->
        <ng-container matColumnDef="situacaoGnv">
          <mat-header-cell *matHeaderCellDef class="flex-none w-40 justify-center">Situação CSV</mat-header-cell>
          <mat-cell *matCellDef="let r" class="flex-none w-40 justify-center">
            <span class="text-xs font-semibold px-2 py-0.5 rounded-full cursor-default"
              [ngClass]="badgeClass(r.situacaoGnv)"
              [matTooltip]="badgeTooltip(r.situacaoGnv)"
              matTooltipPosition="above"
            >{{ r.situacaoGnv }}</span>
          </mat-cell>
        </ng-container>

        <!-- gravame -->
        <ng-container matColumnDef="gravame">
          <mat-header-cell *matHeaderCellDef class="min-w-80">Gravame</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-80 text-xs text-gray-600 line-clamp-2">{{ r.gravame ?? '—' }}</mat-cell>
        </ng-container>

        <!-- nomeProprietario -->
        <ng-container matColumnDef="nomeProprietario">
          <mat-header-cell *matHeaderCellDef class="min-w-64">Proprietário</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-64 text-sm font-medium">{{ r.nomeProprietario ?? '—' }}</mat-cell>
        </ng-container>

        <!-- cpfCnpj -->
        <ng-container matColumnDef="cpfCnpj">
          <mat-header-cell *matHeaderCellDef class="min-w-44">CPF / CNPJ</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-44 font-mono text-sm">{{ r.cpfCnpj ?? '—' }}</mat-cell>
        </ng-container>

        <!-- ultimoLicenciamento -->
        <ng-container matColumnDef="ultimoLicenciamento">
          <mat-header-cell *matHeaderCellDef class="min-w-36 justify-center">Último Licenciamento</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-36 justify-center font-semibold">{{ r.ultimoLicenciamento ?? '—' }}</mat-cell>
        </ng-container>

        <!-- valorIpva -->
        <ng-container matColumnDef="valorIpva">
          <mat-header-cell *matHeaderCellDef class="min-w-32 justify-end">IPVA</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-32 justify-end font-mono font-semibold">{{ r.valorIpva ?? '—' }}</mat-cell>
        </ng-container>

        <!-- taxaLicenciamento -->
        <ng-container matColumnDef="taxaLicenciamento">
          <mat-header-cell *matHeaderCellDef class="min-w-32 justify-end">Licenciamento</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-32 justify-end font-mono font-semibold">{{ r.taxaLicenciamento ?? '—' }}</mat-cell>
        </ng-container>

        <div *matNoDataRow class="no-data-row">
          <mat-icon class="text-gray-300 w-16 h-16" svgIcon="heroicons_outline:clipboard-document-check"></mat-icon>
          <span class="text-xl font-medium text-gray-400">Nenhum resultado encontrado</span>
        </div>

        <mat-header-row *matHeaderRowDef="displayedColumns(); sticky: true"></mat-header-row>
        <mat-row *matRowDef="let row; columns: displayedColumns()"></mat-row>
      </mat-table>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      overflow-y: scroll;
      height: 0;
      max-width: 100%;
    }
    .no-data-row {
      @apply flex flex-col justify-center items-center text-xl gap-2;
      height: calc(100% - var(--mat-header-row-height));
    }
  `,
})
export class ConsultaDetalheTableComponent {
  consulType = input.required<ConsultaDetalheType>();
  items = input<ConsultaDetalheDto[]>([]);
  visibleColumns = input<string[] | null>(null);

  protected readonly displayedColumns = computed(() => {
    const override = this.visibleColumns();
    return override ?? DETALHE_COLUMN_DEFS[this.consulType()]?.map((c) => c.key) ?? [];
  });

  protected readonly badgeClass = badgeClass;
  protected readonly badgeTooltip = badgeTooltip;
  protected readonly statusTooltip = statusTooltip;
}
