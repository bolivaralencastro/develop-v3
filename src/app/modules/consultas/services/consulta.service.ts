import { computed, Injectable, signal } from '@angular/core';
import { ConsultaFilter, ConsultaVehicleDto } from '../models/consulta.types';
import { PageMeta } from '@core/http';

// Dados reais da planilha "1.1.1 CONSULTA TOTAL" (MENU CONSULTAS - REVISADO 07.07) enviada pelo CEO.
const MOCK_VEHICLES: ConsultaVehicleDto[] = [
  {
    id: '1', placa: 'TWY0D34', renavam: '1449982627', chassi: '9BD341AGWTYA58119', estado: 'MG',
    status: 'BLOQUEADO', alerta: true,
    situacaoVeiculo: 'BENEFICIO DE ICMS IMPEDIMENTO ADM.DANO GRANDE MONTA',
    gravame: 'VEÍCULO NUNCA CONSTOU NA BASE DO SISTEMA NACIONAL DE GRAVAMES',
    proprietario: 'UNIDAS LOCADORA S.A.', licenciamento: '2025', recall: 'N/C', ipva: 'R$ -', multas: 'NADA CONSTA',
  },
  {
    id: '2', placa: 'TEN9B43', renavam: '1442003828', chassi: '9BD341ACWSYA46409', estado: 'MG',
    status: 'BLOQUEADO', alerta: true,
    situacaoVeiculo: 'BENEFICIO DE ICMS IMPEDIMENTO ADM.DANO GRANDE MONTA',
    gravame: 'VEÍCULO NUNCA CONSTOU NA BASE DO SISTEMA NACIONAL DE GRAVAMES',
    proprietario: 'UNIDAS LOCADORA S.A.', licenciamento: '2025', recall: 'N/C', ipva: 'R$ -', multas: 'NADA CONSTA',
  },
  {
    id: '3', placa: 'TXH7H01', renavam: '1461824785', chassi: '9BGEN48H0TG145081', estado: 'MG',
    status: 'BLOQUEADO', alerta: true,
    situacaoVeiculo: 'BENEFICIO DE ICMS IMPEDIMENTO ADM.DANO MEDIA MONTA',
    gravame: 'VEÍCULO NUNCA CONSTOU NA BASE DO SISTEMA NACIONAL DE GRAVAMES',
    proprietario: 'UNIDAS LOCADORA S.A.', licenciamento: '2025', recall: 'N/C', ipva: 'R$ -', multas: 'NADA CONSTA',
  },
  {
    id: '4', placa: 'TEN7D39', renavam: '1441881759', chassi: '9BHCP41EBTP745958', estado: 'MG',
    status: 'BLOQUEADO', alerta: true,
    situacaoVeiculo: 'BENEFICIO DE ICMS IMPEDIMENTO ADM.DANO MEDIA MONTA',
    gravame: 'VEÍCULO NUNCA CONSTOU NA BASE DO SISTEMA NACIONAL DE GRAVAMES',
    proprietario: 'UNIDAS LOCADORA S.A.', licenciamento: '2025', recall: 'N/C', ipva: 'R$ -', multas: 'CONSTA',
  },
  {
    id: '5', placa: 'STF4B83', renavam: '1377128170', chassi: '9BWAG5R19RT036067', estado: 'SP',
    status: 'BLOQUEADO', alerta: true,
    situacaoVeiculo: 'BLOQUEIO POR INDISPONIBILIDADE ADMINISTRATIVA',
    gravame: 'VEÍCULO NUNCA CONSTOU NA BASE DO SISTEMA NACIONAL DE GRAVAMES',
    proprietario: 'UNIDAS LOCACOES E SERVICOS SA', licenciamento: '2025', recall: 'N/C', ipva: 'R$ -', multas: 'CONSTA',
  },
  {
    id: '6', placa: 'TEU5C01', renavam: '1446025184', chassi: '9886111LHTK674832', estado: 'MG',
    status: 'BLOQUEADO', alerta: false,
    situacaoVeiculo: 'BENEFICIO DE ICMS',
    gravame: 'VEÍCULO NUNCA CONSTOU NA BASE DO SISTEMA NACIONAL DE GRAVAMES',
    proprietario: 'UNIDAS LOCADORA S A', licenciamento: '2026', recall: 'N/C', ipva: 'R$ -', multas: 'NADA CONSTA',
  },
  {
    id: '7', placa: 'TWZ2I50', renavam: '1450664536', chassi: '9BD341ATWTYA60740', estado: 'MG',
    status: 'BLOQUEADO', alerta: false,
    situacaoVeiculo: 'BENEFICIO DE ICMS',
    gravame: 'VEÍCULO NUNCA CONSTOU NA BASE DO SISTEMA NACIONAL DE GRAVAMES',
    proprietario: 'UNIDAS LOCACOES E SERVICOS S/A', licenciamento: '2026', recall: 'N/C', ipva: 'R$ -', multas: 'NADA CONSTA',
  },
  {
    id: '8', placa: 'RHJ7A52', renavam: '1274610610', chassi: '9BGKD48U0MB247411', estado: 'PR',
    status: 'BLOQUEADO', alerta: false,
    situacaoVeiculo: 'BAIXADO',
    gravame: 'VEÍCULO NUNCA CONSTOU NA BASE DO SISTEMA NACIONAL DE GRAVAMES',
    proprietario: 'OURO VERDE LOCACAO E SERVICO S.A.', licenciamento: '-', recall: 'N/C', ipva: 'R$ -', multas: 'NADA CONSTA',
  },
  {
    id: '9', placa: 'TAP0E75', renavam: '1413687935', chassi: '9BWAH5BZ6ST629713', estado: 'PR',
    status: 'BLOQUEADO', alerta: false,
    situacaoVeiculo: 'BAIXADO',
    gravame: 'VEÍCULO NUNCA CONSTOU NA BASE DO SISTEMA NACIONAL DE GRAVAMES',
    proprietario: 'OURO VERDE LOCACAO E SERVICO S.A.', licenciamento: '-', recall: 'N/C', ipva: 'R$ -', multas: 'NADA CONSTA',
  },
  {
    id: '10', placa: 'TCE6I85', renavam: '1401570892', chassi: '9BGEA48A0SG130296', estado: 'MG',
    status: 'LIBERADO', alerta: true,
    situacaoVeiculo: 'VEÍCULO COM IMPEDIMENTO PROPRIEDADE LOCADORA',
    gravame: 'VEÍCULO NUNCA CONSTOU NA BASE DO SISTEMA NACIONAL DE GRAVAMES',
    proprietario: 'UNIDAS LOCADORA S.A.', licenciamento: '2026', recall: 'N/C', ipva: 'R$ -', multas: 'CONSTA',
  },
  {
    id: '11', placa: 'PVR5I69', renavam: '1390119928', chassi: '9BGEA48A0SG121269', estado: 'MG',
    status: 'LIBERADO', alerta: true,
    situacaoVeiculo: 'VEÍCULO COM IMPEDIMENTO PROPRIEDADE LOCADORA',
    gravame: 'VEÍCULO NUNCA CONSTOU NA BASE DO SISTEMA NACIONAL DE GRAVAMES',
    proprietario: 'UNIDAS LOCADORA S.A.', licenciamento: '2025', recall: 'N/C', ipva: 'R$ -', multas: 'CONSTA',
  },
  {
    id: '12', placa: 'RHZ5I04', renavam: '1300031910', chassi: '9BGEB69A0PG125085', estado: 'PR',
    status: 'LIBERADO', alerta: false,
    situacaoVeiculo: 'VIGENTE (EM CIRCULAÇÃO)',
    gravame: 'VEÍCULO NUNCA CONSTOU NA BASE DO SISTEMA NACIONAL DE GRAVAMES',
    proprietario: 'OURO VERDE LOCACAO E SERVICO S.A.', licenciamento: '2026', recall: 'N/C', ipva: 'R$ -', multas: 'NADA CONSTA',
  },
  {
    id: '13', placa: 'SDQ5H25', renavam: '1303505913', chassi: '9BWAG45U5PT024828', estado: 'PR',
    status: 'LIBERADO', alerta: true,
    situacaoVeiculo: 'VIGENTE (EM CIRCULAÇÃO)',
    gravame: 'VEÍCULO NUNCA CONSTOU NA BASE DO SISTEMA NACIONAL DE GRAVAMES',
    proprietario: 'OURO VERDE LOCACAO E SERVICO S.A.', licenciamento: '2025', recall: 'N/C', ipva: 'R$ -', multas: 'CONSTA',
  },
  {
    id: '14', placa: 'SDQ8G10', renavam: '1303933338', chassi: '9BWAG45U4PT034511', estado: 'PR',
    status: 'LIBERADO', alerta: false,
    situacaoVeiculo: 'VIGENTE (EM CIRCULAÇÃO)',
    gravame: 'VEÍCULO NUNCA CONSTOU NA BASE DO SISTEMA NACIONAL DE GRAVAMES',
    proprietario: 'OURO VERDE LOCACAO E SERVICO S.A.', licenciamento: '2026', recall: 'N/C', ipva: 'R$ -', multas: 'NADA CONSTA',
  },
];

@Injectable()
export class ConsultaService {
  private readonly _filter = signal<ConsultaFilter>({ page: 1, limit: 20 });

  readonly isLoading = signal(false);

  readonly vehicles = computed(() => {
    const filter = this._filter();
    let data = [...MOCK_VEHICLES];
    if (filter.search) {
      const q = filter.search.toLowerCase();
      data = data.filter(
        (v) => v.placa.toLowerCase().includes(q) || v.chassi.includes(q) || v.renavam.includes(q),
      );
    }
    if (filter.estado?.length) {
      data = data.filter((v) => filter.estado.includes(v.estado));
    }
    if (filter.status?.length) {
      data = data.filter((v) => filter.status.includes(v.status));
    }
    return data;
  });

  readonly pagination = computed<PageMeta>(() => ({
    totalItems: this.vehicles().length,
    currentPage: this._filter().page ?? 1,
    itemsPerPage: this._filter().limit ?? 20,
    totalPages: Math.ceil(this.vehicles().length / (this._filter().limit ?? 20)),
    filter: {},
    links: { first: '', previous: '', current: '', next: '', last: '' },
  }));

  setFilter(filter: ConsultaFilter) {
    this._filter.update((curr) => ({ ...filter, page: curr.page, limit: curr.limit }));
  }

  setPage(page: number, limit: number) {
    this._filter.update((curr) => ({ ...curr, page, limit }));
  }
}
