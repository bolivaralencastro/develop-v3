import { computed, Injectable, signal } from '@angular/core';
import { PageMeta } from '@core/http';
import { ConsultaDetalheDto, ConsultaDetalheFilter, ConsultaDetalheType } from '../models/consulta.types';

const BASE = [
  { id: '1', placa: 'TCW2B26', renavam: '1408440137', chassi: '988675ADDSKV17591', estado: 'MG', status: 'LIBERADO' as const },
  { id: '2', placa: 'TCW7F19', renavam: '1409138825', chassi: '9886111LGSK637125', estado: 'MG', status: 'LIBERADO' as const },
  { id: '3', placa: 'TCW2B28', renavam: '1408440153', chassi: '988675ADDSKV18067', estado: 'MG', status: 'BLOQUEADO' as const },
  { id: '4', placa: 'SET3I95', renavam: '1358691549', chassi: '95PDEM61DRB024102', estado: 'PR', status: 'LIBERADO' as const },
  { id: '5', placa: 'UEK4G37', renavam: '1462415803', chassi: 'LGWEFUA5XSH957057', estado: 'SP', status: 'LIBERADO' as const },
];

const MOCK: Record<ConsultaDetalheType, ConsultaDetalheDto[]> = {
  SITUACAO_VEICULO: [
    { ...BASE[0], descricaoSituacao: 'IMPEDIMENTO PROPRIEDADE LOCADORA' },
    { ...BASE[1], descricaoSituacao: 'IMPEDIMENTO PROPRIEDADE LOCADORA' },
    { ...BASE[2], descricaoSituacao: 'BENEFÍCIO DE ICMS — IMPEDIMENTO ADMINISTRATIVO' },
    { ...BASE[3], descricaoSituacao: 'VIGENTE (EM CIRCULAÇÃO)' },
    { ...BASE[4], descricaoSituacao: 'VIGENTE (EM CIRCULAÇÃO)' },
  ],
  RECALL: [
    { ...BASE[0], recall: '—', descricaoRecall: '—', dataRegistroRecall: '—', dataLimiteRecall: '—', situacaoRecall: 'N/C' },
    { ...BASE[1], recall: 'REC-HB20-2024-001 RECALL SISTEMA DE FREIOS', descricaoRecall: 'Risco de falha nos freios dianteiros em frenagens de emergência', dataRegistroRecall: '10/03/2024', dataLimiteRecall: '10/03/2025', situacaoRecall: 'VENCIDO' },
    { ...BASE[2], recall: '—', descricaoRecall: '—', dataRegistroRecall: '—', dataLimiteRecall: '—', situacaoRecall: 'N/C' },
    { ...BASE[3], recall: '—', descricaoRecall: '—', dataRegistroRecall: '—', dataLimiteRecall: '—', situacaoRecall: 'N/C' },
    { ...BASE[4], recall: 'REC-CHE-2023-007 RECALL AIRBAG', descricaoRecall: 'Possível ativação inadvertida do airbag do passageiro dianteiro', dataRegistroRecall: '13/12/2023', dataLimiteRecall: '13/12/2024', situacaoRecall: 'VENCIDO' },
  ],
  GNV: [
    { ...BASE[0], ultimoLaudoGnv: '—', prazoRegularizacaoGnv: '—', situacaoGnv: 'N/A' },
    { ...BASE[1], ultimoLaudoGnv: '—', prazoRegularizacaoGnv: '—', situacaoGnv: 'N/A' },
    { ...BASE[2], ultimoLaudoGnv: '15/03/2024', prazoRegularizacaoGnv: '15/03/2026', situacaoGnv: 'VÁLIDO' },
    { ...BASE[3], ultimoLaudoGnv: '22/08/2023', prazoRegularizacaoGnv: '22/08/2025', situacaoGnv: 'VENCIDO' },
    { ...BASE[4], ultimoLaudoGnv: '—', prazoRegularizacaoGnv: '—', situacaoGnv: 'N/A' },
  ],
  GRAVAME: [
    { ...BASE[0], gravame: 'VEÍCULO NUNCA CONSTOU NA BASE DO SISTEMA NACIONAL DE GRAVAMES' },
    { ...BASE[1], gravame: 'VEÍCULO NUNCA CONSTOU NA BASE DO SISTEMA NACIONAL DE GRAVAMES' },
    { ...BASE[2], gravame: 'VEÍCULO COM ALIENAÇÃO FIDUCIÁRIA PENDENTE EMISSÃO DE DOCUMENTO' },
    { ...BASE[3], gravame: 'VEÍCULO NUNCA CONSTOU NA BASE DO SISTEMA NACIONAL DE GRAVAMES' },
    { ...BASE[4], gravame: 'VEÍCULO COM ALIENAÇÃO FIDUCIÁRIA PENDENTE EMISSÃO DE DOCUMENTO' },
  ],
  PROPRIETARIO: [
    { ...BASE[0], nomeProprietario: 'UNIDAS LOCADORA S.A.', cpfCnpj: '02.725.842/0001-92' },
    { ...BASE[1], nomeProprietario: 'UNIDAS LOCADORA S.A.', cpfCnpj: '02.725.842/0001-92' },
    { ...BASE[2], nomeProprietario: 'UNIDAS LOCADORA S.A.', cpfCnpj: '02.725.842/0001-92' },
    { ...BASE[3], nomeProprietario: 'UNIDAS LOCADORA S.A.', cpfCnpj: '02.725.842/0001-92' },
    { ...BASE[4], nomeProprietario: 'UNIDAS LOCADORA S.A.', cpfCnpj: '02.725.842/0001-92' },
  ],
  CRLV: [
    { ...BASE[0], ultimoLicenciamento: '2026' },
    { ...BASE[1], ultimoLicenciamento: '2026' },
    { ...BASE[2], ultimoLicenciamento: '2025' },
    { ...BASE[3], ultimoLicenciamento: '2026' },
    { ...BASE[4], ultimoLicenciamento: '2026' },
  ],
  IPVA: [
    { ...BASE[0], valorIpva: 'R$ -' },
    { ...BASE[1], valorIpva: 'R$ -' },
    { ...BASE[2], valorIpva: 'R$ 1.650,00' },
    { ...BASE[3], valorIpva: 'R$ -' },
    { ...BASE[4], valorIpva: 'R$ 2.450,00' },
  ],
  LICENCIAMENTO: [
    { ...BASE[0], taxaLicenciamento: 'R$ -' },
    { ...BASE[1], taxaLicenciamento: 'R$ -' },
    { ...BASE[2], taxaLicenciamento: 'R$ 237,50' },
    { ...BASE[3], taxaLicenciamento: 'R$ -' },
    { ...BASE[4], taxaLicenciamento: 'R$ 280,00' },
  ],
};

// maps each type to the DTO field used for "situação" filtering
const SITUACAO_FIELD: Partial<Record<ConsultaDetalheType, keyof ConsultaDetalheDto>> = {
  SITUACAO_VEICULO: 'status',
  RECALL: 'situacaoRecall',
  GNV: 'situacaoGnv',
  GRAVAME: 'status',
  PROPRIETARIO: 'status',
  CRLV: 'status',
  IPVA: 'status',
  LICENCIAMENTO: 'status',
};

@Injectable()
export class ConsultaDetalheService {
  private readonly _type = signal<ConsultaDetalheType | null>(null);
  private readonly _filter = signal<ConsultaDetalheFilter>({});
  private readonly _page = signal(1);
  private readonly _limit = signal(20);

  readonly isLoading = signal(false);

  readonly items = computed<ConsultaDetalheDto[]>(() => {
    const type = this._type();
    if (!type) return [];

    const { search, estado, situacao } = this._filter();
    let data = MOCK[type] ?? [];

    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        (v) =>
          v.placa.toLowerCase().includes(q) ||
          v.renavam.includes(q) ||
          v.chassi.toLowerCase().includes(q),
      );
    }

    if (estado?.length) {
      data = data.filter((v) => estado.includes(v.estado));
    }

    if (situacao?.length) {
      const field = SITUACAO_FIELD[type];
      if (field) {
        data = data.filter((v) => situacao.includes(v[field] as string));
      }
    }

    return data;
  });

  readonly pagination = computed<PageMeta>(() => ({
    totalItems: this.items().length,
    currentPage: this._page(),
    itemsPerPage: this._limit(),
    totalPages: Math.max(1, Math.ceil(this.items().length / this._limit())),
    filter: {},
    links: { first: '', previous: '', current: '', next: '', last: '' },
  }));

  setType(type: ConsultaDetalheType) {
    this._type.set(type);
    this._page.set(1);
  }

  setFilter(filter: ConsultaDetalheFilter) {
    this._filter.set(filter);
    this._page.set(1);
  }

  setPage(page: number, limit: number) {
    this._page.set(page);
    this._limit.set(limit);
  }
}
