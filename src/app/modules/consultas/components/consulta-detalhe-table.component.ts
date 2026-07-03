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

export const DETALHE_COLUMN_DEFS: Record<ConsultaDetalheType, TableColumnDef[]> = {
  SITUACAO_VEICULO: [
    { key: 'placa', label: 'Placa' }, { key: 'renavam', label: 'Renavam' },
    { key: 'chassi', label: 'Chassi' }, { key: 'estado', label: 'Estado' },
    { key: 'descricaoSituacao', label: 'Situação no Detran' },
  ],
  RECALL: [
    { key: 'placa', label: 'Placa' }, { key: 'renavam', label: 'Renavam' },
    { key: 'chassi', label: 'Chassi' }, { key: 'estado', label: 'Estado' },
    { key: 'situacaoRecall', label: 'Situação Recall' }, { key: 'campanhaRecall', label: 'Campanha' },
    { key: 'componente', label: 'Componente' }, { key: 'descricaoRecall', label: 'Descrição do Recall' },
  ],
  GNV: [
    { key: 'placa', label: 'Placa' }, { key: 'renavam', label: 'Renavam' },
    { key: 'chassi', label: 'Chassi' }, { key: 'estado', label: 'Estado' },
    { key: 'possuiGnv', label: 'GNV' }, { key: 'numeroLaudo', label: 'N° Laudo' },
    { key: 'dataLaudo', label: 'Data do Laudo' }, { key: 'validadeLaudo', label: 'Validade' },
    { key: 'situacaoGnv', label: 'Situação GNV' }, { key: 'empresaInstaladora', label: 'Empresa Instaladora' },
  ],
  GRAVAME: [
    { key: 'placa', label: 'Placa' }, { key: 'renavam', label: 'Renavam' },
    { key: 'chassi', label: 'Chassi' }, { key: 'estado', label: 'Estado' },
    { key: 'possuiGravame', label: 'Gravame' }, { key: 'credor', label: 'Credor' },
    { key: 'agenteFinanceiro', label: 'Agente Financeiro' }, { key: 'numeroContrato', label: 'N° Contrato' },
    { key: 'dataInclusao', label: 'Data Inclusão' }, { key: 'dataVencimentoGravame', label: 'Vencimento' },
  ],
  PROPRIETARIO: [
    { key: 'placa', label: 'Placa' }, { key: 'renavam', label: 'Renavam' },
    { key: 'chassi', label: 'Chassi' }, { key: 'estado', label: 'Estado' },
    { key: 'nomeProprietario', label: 'Nome do Proprietário' }, { key: 'cpfCnpj', label: 'CPF / CNPJ' },
    { key: 'dataTransferencia', label: 'Data Transferência' }, { key: 'situacaoTransferencia', label: 'Situação' },
  ],
  CRLV: [
    { key: 'placa', label: 'Placa' }, { key: 'renavam', label: 'Renavam' },
    { key: 'chassi', label: 'Chassi' }, { key: 'estado', label: 'Estado' },
    { key: 'ultimoExercicio', label: 'Último Exercício' }, { key: 'situacaoCrlv', label: 'Situação CRLV' },
    { key: 'dataEmissao', label: 'Data de Emissão' },
  ],
  IPVA: [
    { key: 'placa', label: 'Placa' }, { key: 'renavam', label: 'Renavam' },
    { key: 'chassi', label: 'Chassi' }, { key: 'estado', label: 'Estado' },
    { key: 'exercicioIpva', label: 'Exercício' }, { key: 'valorIpva', label: 'Valor Total' },
    { key: 'situacaoIpva', label: 'Situação IPVA' }, { key: 'dataVencimentoIpva', label: 'Vencimento' },
    { key: 'valorPago', label: 'Valor Pago' },
  ],
  LICENCIAMENTO: [
    { key: 'placa', label: 'Placa' }, { key: 'renavam', label: 'Renavam' },
    { key: 'chassi', label: 'Chassi' }, { key: 'estado', label: 'Estado' },
    { key: 'exercicioLicenciamento', label: 'Exercício' }, { key: 'valorTaxa', label: 'Taxa' },
    { key: 'situacaoLicenciamento', label: 'Situação' }, { key: 'dataVencimentoLicenciamento', label: 'Vencimento' },
  ],
};

const STATUS_COLORS: Record<string, string> = {
  // Recall
  'COM RECALL': 'bg-red-100 text-red-700',
  'SEM RECALL': 'bg-green-100 text-green-700',
  // GNV (possui)
  'SIM': 'bg-blue-100 text-blue-700',
  'NÃO': 'bg-gray-100 text-gray-500',
  // GNV (situação)
  'VÁLIDO': 'bg-green-100 text-green-700',
  'VENCIDO': 'bg-red-100 text-red-700',
  'N/A': 'bg-gray-100 text-gray-400',
  // Gravame
  'COM GRAVAME': 'bg-amber-100 text-amber-700',
  'SEM GRAVAME': 'bg-green-100 text-green-700',
  // Proprietário
  'REGULAR': 'bg-green-100 text-green-700',
  'PENDENTE': 'bg-amber-100 text-amber-700',
  'IRREGULAR': 'bg-red-100 text-red-700',
  // CRLV
  'EMITIDO': 'bg-green-100 text-green-700',
  // IPVA / Licenciamento
  'QUITADO': 'bg-green-100 text-green-700',
  'PARCELADO': 'bg-blue-100 text-blue-700',
  'ISENTO': 'bg-gray-100 text-gray-500',
};

const STATUS_TOOLTIP: Record<string, string> = {
  'COM RECALL': 'Recall ativo — veículo deve ser levado à concessionária',
  'SEM RECALL': 'Sem recall pendente',
  'SIM': 'Veículo equipado com GNV',
  'NÃO': 'Veículo não equipado com GNV',
  'VÁLIDO': 'Laudo GNV dentro da validade',
  'VENCIDO': 'Laudo GNV vencido — renovação obrigatória',
  'N/A': 'Não aplicável',
  'COM GRAVAME': 'Veículo possui restrição financeira (gravame)',
  'SEM GRAVAME': 'Nenhum gravame registrado',
  'REGULAR': 'Situação regular junto ao Detran',
  'PENDENTE': 'Pendente — regularização necessária',
  'IRREGULAR': 'Irregularidade detectada',
  'EMITIDO': 'Documento emitido',
  'QUITADO': 'Débito quitado',
  'PARCELADO': 'Pagamento parcelado em andamento',
  'ISENTO': 'Isento de pagamento',
};

function badgeClass(value: string | undefined): string {
  return STATUS_COLORS[value ?? ''] ?? 'bg-gray-100 text-gray-500';
}

function badgeTooltip(value: string | undefined): string {
  return STATUS_TOOLTIP[value ?? ''] ?? '';
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
          <mat-header-cell *matHeaderCellDef class="min-w-28">Placa</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-28 font-mono font-semibold">{{ r.placa }}</mat-cell>
        </ng-container>

        <!-- renavam -->
        <ng-container matColumnDef="renavam">
          <mat-header-cell *matHeaderCellDef class="min-w-36">Renavam</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-36 font-mono text-sm">{{ r.renavam }}</mat-cell>
        </ng-container>

        <!-- chassi -->
        <ng-container matColumnDef="chassi">
          <mat-header-cell *matHeaderCellDef class="min-w-44">Chassi</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-44 font-mono text-sm">{{ r.chassi }}</mat-cell>
        </ng-container>

        <!-- estado -->
        <ng-container matColumnDef="estado">
          <mat-header-cell *matHeaderCellDef class="min-w-20">Estado</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-20">{{ r.estado }}</mat-cell>
        </ng-container>

        <!-- descricaoSituacao (Situação do Veículo) -->
        <ng-container matColumnDef="descricaoSituacao">
          <mat-header-cell *matHeaderCellDef class="min-w-80">Situação no Detran</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-80 text-xs text-gray-700 line-clamp-2">{{ r.descricaoSituacao ?? '—' }}</mat-cell>
        </ng-container>

        <!-- situacaoRecall -->
        <ng-container matColumnDef="situacaoRecall">
          <mat-header-cell *matHeaderCellDef class="min-w-36 justify-center">Situação Recall</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-36 justify-center">
            <span class="text-xs font-semibold px-2 py-0.5 rounded-full cursor-default"
              [ngClass]="badgeClass(r.situacaoRecall)"
              [matTooltip]="badgeTooltip(r.situacaoRecall)"
              matTooltipPosition="above"
            >{{ r.situacaoRecall }}</span>
          </mat-cell>
        </ng-container>

        <!-- campanhaRecall -->
        <ng-container matColumnDef="campanhaRecall">
          <mat-header-cell *matHeaderCellDef class="min-w-44">Campanha</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-44 font-mono text-sm">{{ r.campanhaRecall ?? '—' }}</mat-cell>
        </ng-container>

        <!-- componente -->
        <ng-container matColumnDef="componente">
          <mat-header-cell *matHeaderCellDef class="min-w-40">Componente</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-40 text-sm">{{ r.componente ?? '—' }}</mat-cell>
        </ng-container>

        <!-- descricaoRecall -->
        <ng-container matColumnDef="descricaoRecall">
          <mat-header-cell *matHeaderCellDef class="min-w-80">Descrição do Recall</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-80 text-xs text-gray-600 line-clamp-2">{{ r.descricaoRecall ?? '—' }}</mat-cell>
        </ng-container>

        <!-- possuiGnv -->
        <ng-container matColumnDef="possuiGnv">
          <mat-header-cell *matHeaderCellDef class="min-w-24 justify-center">GNV</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-24 justify-center">
            <span class="text-xs font-semibold px-2 py-0.5 rounded-full cursor-default"
              [ngClass]="badgeClass(r.possuiGnv)"
              [matTooltip]="badgeTooltip(r.possuiGnv)"
              matTooltipPosition="above"
            >{{ r.possuiGnv }}</span>
          </mat-cell>
        </ng-container>

        <!-- numeroLaudo -->
        <ng-container matColumnDef="numeroLaudo">
          <mat-header-cell *matHeaderCellDef class="min-w-40">N° Laudo</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-40 font-mono text-sm">{{ r.numeroLaudo ?? '—' }}</mat-cell>
        </ng-container>

        <!-- dataLaudo -->
        <ng-container matColumnDef="dataLaudo">
          <mat-header-cell *matHeaderCellDef class="min-w-32">Data do Laudo</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-32 text-sm">{{ r.dataLaudo ?? '—' }}</mat-cell>
        </ng-container>

        <!-- validadeLaudo -->
        <ng-container matColumnDef="validadeLaudo">
          <mat-header-cell *matHeaderCellDef class="min-w-32">Validade</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-32 text-sm">{{ r.validadeLaudo ?? '—' }}</mat-cell>
        </ng-container>

        <!-- situacaoGnv -->
        <ng-container matColumnDef="situacaoGnv">
          <mat-header-cell *matHeaderCellDef class="min-w-28 justify-center">Situação GNV</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-28 justify-center">
            <span class="text-xs font-semibold px-2 py-0.5 rounded-full cursor-default"
              [ngClass]="badgeClass(r.situacaoGnv)"
              [matTooltip]="badgeTooltip(r.situacaoGnv)"
              matTooltipPosition="above"
            >{{ r.situacaoGnv }}</span>
          </mat-cell>
        </ng-container>

        <!-- empresaInstaladora -->
        <ng-container matColumnDef="empresaInstaladora">
          <mat-header-cell *matHeaderCellDef class="min-w-52">Empresa Instaladora</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-52 text-sm">{{ r.empresaInstaladora ?? '—' }}</mat-cell>
        </ng-container>

        <!-- possuiGravame -->
        <ng-container matColumnDef="possuiGravame">
          <mat-header-cell *matHeaderCellDef class="min-w-36 justify-center">Gravame</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-36 justify-center">
            <span class="text-xs font-semibold px-2 py-0.5 rounded-full cursor-default"
              [ngClass]="badgeClass(r.possuiGravame)"
              [matTooltip]="badgeTooltip(r.possuiGravame)"
              matTooltipPosition="above"
            >{{ r.possuiGravame }}</span>
          </mat-cell>
        </ng-container>

        <!-- credor -->
        <ng-container matColumnDef="credor">
          <mat-header-cell *matHeaderCellDef class="min-w-52">Credor</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-52 text-sm">{{ r.credor ?? '—' }}</mat-cell>
        </ng-container>

        <!-- agenteFinanceiro -->
        <ng-container matColumnDef="agenteFinanceiro">
          <mat-header-cell *matHeaderCellDef class="min-w-44">Agente Financeiro</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-44 text-sm">{{ r.agenteFinanceiro ?? '—' }}</mat-cell>
        </ng-container>

        <!-- numeroContrato -->
        <ng-container matColumnDef="numeroContrato">
          <mat-header-cell *matHeaderCellDef class="min-w-40">N° Contrato</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-40 font-mono text-sm">{{ r.numeroContrato ?? '—' }}</mat-cell>
        </ng-container>

        <!-- dataInclusao -->
        <ng-container matColumnDef="dataInclusao">
          <mat-header-cell *matHeaderCellDef class="min-w-32">Data Inclusão</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-32 text-sm">{{ r.dataInclusao ?? '—' }}</mat-cell>
        </ng-container>

        <!-- dataVencimentoGravame -->
        <ng-container matColumnDef="dataVencimentoGravame">
          <mat-header-cell *matHeaderCellDef class="min-w-32">Vencimento</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-32 text-sm">{{ r.dataVencimentoGravame ?? '—' }}</mat-cell>
        </ng-container>

        <!-- nomeProprietario -->
        <ng-container matColumnDef="nomeProprietario">
          <mat-header-cell *matHeaderCellDef class="min-w-64">Nome do Proprietário</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-64 text-sm font-medium">{{ r.nomeProprietario ?? '—' }}</mat-cell>
        </ng-container>

        <!-- cpfCnpj -->
        <ng-container matColumnDef="cpfCnpj">
          <mat-header-cell *matHeaderCellDef class="min-w-44">CPF / CNPJ</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-44 font-mono text-sm">{{ r.cpfCnpj ?? '—' }}</mat-cell>
        </ng-container>

        <!-- dataTransferencia -->
        <ng-container matColumnDef="dataTransferencia">
          <mat-header-cell *matHeaderCellDef class="min-w-36">Data Transferência</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-36 text-sm">{{ r.dataTransferencia ?? '—' }}</mat-cell>
        </ng-container>

        <!-- situacaoTransferencia -->
        <ng-container matColumnDef="situacaoTransferencia">
          <mat-header-cell *matHeaderCellDef class="min-w-36 justify-center">Situação</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-36 justify-center">
            <span class="text-xs font-semibold px-2 py-0.5 rounded-full cursor-default"
              [ngClass]="badgeClass(r.situacaoTransferencia)"
              [matTooltip]="badgeTooltip(r.situacaoTransferencia)"
              matTooltipPosition="above"
            >{{ r.situacaoTransferencia }}</span>
          </mat-cell>
        </ng-container>

        <!-- ultimoExercicio -->
        <ng-container matColumnDef="ultimoExercicio">
          <mat-header-cell *matHeaderCellDef class="min-w-32 justify-center">Último Exercício</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-32 justify-center font-semibold">{{ r.ultimoExercicio ?? '—' }}</mat-cell>
        </ng-container>

        <!-- situacaoCrlv -->
        <ng-container matColumnDef="situacaoCrlv">
          <mat-header-cell *matHeaderCellDef class="min-w-32 justify-center">Situação CRLV</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-32 justify-center">
            <span class="text-xs font-semibold px-2 py-0.5 rounded-full cursor-default"
              [ngClass]="badgeClass(r.situacaoCrlv)"
              [matTooltip]="badgeTooltip(r.situacaoCrlv)"
              matTooltipPosition="above"
            >{{ r.situacaoCrlv }}</span>
          </mat-cell>
        </ng-container>

        <!-- dataEmissao -->
        <ng-container matColumnDef="dataEmissao">
          <mat-header-cell *matHeaderCellDef class="min-w-32">Data de Emissão</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-32 text-sm">{{ r.dataEmissao ?? '—' }}</mat-cell>
        </ng-container>

        <!-- exercicioIpva -->
        <ng-container matColumnDef="exercicioIpva">
          <mat-header-cell *matHeaderCellDef class="min-w-28 justify-center">Exercício</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-28 justify-center font-semibold">{{ r.exercicioIpva ?? '—' }}</mat-cell>
        </ng-container>

        <!-- valorIpva -->
        <ng-container matColumnDef="valorIpva">
          <mat-header-cell *matHeaderCellDef class="min-w-32 justify-end">Valor Total</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-32 justify-end font-mono font-semibold">{{ r.valorIpva ?? '—' }}</mat-cell>
        </ng-container>

        <!-- situacaoIpva -->
        <ng-container matColumnDef="situacaoIpva">
          <mat-header-cell *matHeaderCellDef class="min-w-32 justify-center">Situação IPVA</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-32 justify-center">
            <span class="text-xs font-semibold px-2 py-0.5 rounded-full cursor-default"
              [ngClass]="badgeClass(r.situacaoIpva)"
              [matTooltip]="badgeTooltip(r.situacaoIpva)"
              matTooltipPosition="above"
            >{{ r.situacaoIpva }}</span>
          </mat-cell>
        </ng-container>

        <!-- dataVencimentoIpva -->
        <ng-container matColumnDef="dataVencimentoIpva">
          <mat-header-cell *matHeaderCellDef class="min-w-36">Vencimento</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-36 text-sm">{{ r.dataVencimentoIpva ?? '—' }}</mat-cell>
        </ng-container>

        <!-- valorPago -->
        <ng-container matColumnDef="valorPago">
          <mat-header-cell *matHeaderCellDef class="min-w-32 justify-end">Valor Pago</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-32 justify-end font-mono text-sm text-green-700">{{ r.valorPago ?? '—' }}</mat-cell>
        </ng-container>

        <!-- exercicioLicenciamento -->
        <ng-container matColumnDef="exercicioLicenciamento">
          <mat-header-cell *matHeaderCellDef class="min-w-28 justify-center">Exercício</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-28 justify-center font-semibold">{{ r.exercicioLicenciamento ?? '—' }}</mat-cell>
        </ng-container>

        <!-- valorTaxa -->
        <ng-container matColumnDef="valorTaxa">
          <mat-header-cell *matHeaderCellDef class="min-w-32 justify-end">Taxa</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-32 justify-end font-mono font-semibold">{{ r.valorTaxa ?? '—' }}</mat-cell>
        </ng-container>

        <!-- situacaoLicenciamento -->
        <ng-container matColumnDef="situacaoLicenciamento">
          <mat-header-cell *matHeaderCellDef class="min-w-36 justify-center">Situação</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-36 justify-center">
            <span class="text-xs font-semibold px-2 py-0.5 rounded-full cursor-default"
              [ngClass]="badgeClass(r.situacaoLicenciamento)"
              [matTooltip]="badgeTooltip(r.situacaoLicenciamento)"
              matTooltipPosition="above"
            >{{ r.situacaoLicenciamento }}</span>
          </mat-cell>
        </ng-container>

        <!-- dataVencimentoLicenciamento -->
        <ng-container matColumnDef="dataVencimentoLicenciamento">
          <mat-header-cell *matHeaderCellDef class="min-w-36">Vencimento</mat-header-cell>
          <mat-cell *matCellDef="let r" class="min-w-36 text-sm">{{ r.dataVencimentoLicenciamento ?? '—' }}</mat-cell>
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
    if (override) return override;
    return DETALHE_COLUMN_DEFS[this.consulType()]?.map((c) => c.key) ?? [];
  });

  protected readonly badgeClass = badgeClass;
  protected readonly badgeTooltip = badgeTooltip;
}
