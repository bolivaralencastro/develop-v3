import { computed, Injectable, signal } from '@angular/core';
import { PageMeta } from '@core/http';
import { ConsultaDetalheDto, ConsultaDetalheFilter, ConsultaDetalheType } from '../models/consulta.types';

const BASE = [
  { id: '1', placa: 'TCW2B26', renavam: '1408440137', chassi: '988675ADDSKV17591', estado: 'MG' },
  { id: '2', placa: 'TCW7F19', renavam: '1409138825', chassi: '9886111LGSK637125', estado: 'MG' },
  { id: '3', placa: 'TCW2B28', renavam: '1408440153', chassi: '988675ADDSKV18067', estado: 'MG' },
  { id: '4', placa: 'SET3I95', renavam: '1358691549', chassi: '95PDEM61DRB024102', estado: 'PR' },
  { id: '5', placa: 'UEK4G37', renavam: '1462415803', chassi: 'LGWEFUA5XSH957057', estado: 'SP' },
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
    { ...BASE[0], situacaoRecall: 'SEM RECALL', campanhaRecall: '—', componente: '—', descricaoRecall: '—' },
    { ...BASE[1], situacaoRecall: 'COM RECALL', campanhaRecall: 'REC-HB20-2024-001', componente: 'Sistema de Freios', descricaoRecall: 'Risco de falha nos freios dianteiros em frenagens de emergência' },
    { ...BASE[2], situacaoRecall: 'SEM RECALL', campanhaRecall: '—', componente: '—', descricaoRecall: '—' },
    { ...BASE[3], situacaoRecall: 'SEM RECALL', campanhaRecall: '—', componente: '—', descricaoRecall: '—' },
    { ...BASE[4], situacaoRecall: 'COM RECALL', campanhaRecall: 'REC-CHE-2023-007', componente: 'Airbag', descricaoRecall: 'Possível ativação inadvertida do airbag do passageiro dianteiro' },
  ],
  GNV: [
    { ...BASE[0], possuiGnv: 'NÃO', numeroLaudo: '—', dataLaudo: '—', validadeLaudo: '—', situacaoGnv: 'N/A', empresaInstaladora: '—' },
    { ...BASE[1], possuiGnv: 'NÃO', numeroLaudo: '—', dataLaudo: '—', validadeLaudo: '—', situacaoGnv: 'N/A', empresaInstaladora: '—' },
    { ...BASE[2], possuiGnv: 'SIM', numeroLaudo: 'LAU-2024-00123', dataLaudo: '15/03/2024', validadeLaudo: '15/03/2026', situacaoGnv: 'VÁLIDO', empresaInstaladora: 'AutoGás MG LTDA' },
    { ...BASE[3], possuiGnv: 'SIM', numeroLaudo: 'LAU-2023-00456', dataLaudo: '22/08/2023', validadeLaudo: '22/08/2025', situacaoGnv: 'VENCIDO', empresaInstaladora: 'ProGás PR ME' },
    { ...BASE[4], possuiGnv: 'NÃO', numeroLaudo: '—', dataLaudo: '—', validadeLaudo: '—', situacaoGnv: 'N/A', empresaInstaladora: '—' },
  ],
  GRAVAME: [
    { ...BASE[0], possuiGravame: 'SEM GRAVAME', credor: '—', agenteFinanceiro: '—', numeroContrato: '—', dataInclusao: '—', dataVencimentoGravame: '—' },
    { ...BASE[1], possuiGravame: 'SEM GRAVAME', credor: '—', agenteFinanceiro: '—', numeroContrato: '—', dataInclusao: '—', dataVencimentoGravame: '—' },
    { ...BASE[2], possuiGravame: 'COM GRAVAME', credor: 'Unidas Locadora S.A.', agenteFinanceiro: 'Banco Santander', numeroContrato: '00-0123456-7', dataInclusao: '10/01/2022', dataVencimentoGravame: '10/01/2027' },
    { ...BASE[3], possuiGravame: 'SEM GRAVAME', credor: '—', agenteFinanceiro: '—', numeroContrato: '—', dataInclusao: '—', dataVencimentoGravame: '—' },
    { ...BASE[4], possuiGravame: 'COM GRAVAME', credor: 'Unidas Locadora S.A.', agenteFinanceiro: 'Banco Itaú', numeroContrato: '00-0987654-3', dataInclusao: '05/06/2023', dataVencimentoGravame: '05/06/2028' },
  ],
  PROPRIETARIO: [
    { ...BASE[0], nomeProprietario: 'UNIDAS LOCADORA S.A.', cpfCnpj: '02.725.842/0001-92', dataTransferencia: '12/01/2022', situacaoTransferencia: 'REGULAR' },
    { ...BASE[1], nomeProprietario: 'UNIDAS LOCADORA S.A.', cpfCnpj: '02.725.842/0001-92', dataTransferencia: '28/03/2023', situacaoTransferencia: 'REGULAR' },
    { ...BASE[2], nomeProprietario: 'UNIDAS LOCADORA S.A.', cpfCnpj: '02.725.842/0001-92', dataTransferencia: '05/11/2022', situacaoTransferencia: 'REGULAR' },
    { ...BASE[3], nomeProprietario: 'UNIDAS LOCADORA S.A.', cpfCnpj: '02.725.842/0001-92', dataTransferencia: '17/07/2023', situacaoTransferencia: 'REGULAR' },
    { ...BASE[4], nomeProprietario: 'UNIDAS LOCADORA S.A.', cpfCnpj: '02.725.842/0001-92', dataTransferencia: '20/09/2023', situacaoTransferencia: 'PENDENTE' },
  ],
  CRLV: [
    { ...BASE[0], ultimoExercicio: '2026', situacaoCrlv: 'EMITIDO', dataEmissao: '15/01/2026' },
    { ...BASE[1], ultimoExercicio: '2026', situacaoCrlv: 'EMITIDO', dataEmissao: '22/01/2026' },
    { ...BASE[2], ultimoExercicio: '2025', situacaoCrlv: 'PENDENTE', dataEmissao: '—' },
    { ...BASE[3], ultimoExercicio: '2026', situacaoCrlv: 'EMITIDO', dataEmissao: '08/02/2026' },
    { ...BASE[4], ultimoExercicio: '2026', situacaoCrlv: 'EMITIDO', dataEmissao: '30/01/2026' },
  ],
  IPVA: [
    { ...BASE[0], exercicioIpva: '2026', valorIpva: 'R$ 1.840,00', situacaoIpva: 'QUITADO', dataVencimentoIpva: '—', valorPago: 'R$ 1.840,00' },
    { ...BASE[1], exercicioIpva: '2026', valorIpva: 'R$ 2.120,00', situacaoIpva: 'QUITADO', dataVencimentoIpva: '—', valorPago: 'R$ 2.120,00' },
    { ...BASE[2], exercicioIpva: '2026', valorIpva: 'R$ 1.650,00', situacaoIpva: 'PENDENTE', dataVencimentoIpva: '31/03/2026', valorPago: 'R$ 0,00' },
    { ...BASE[3], exercicioIpva: '2026', valorIpva: 'R$ 890,00', situacaoIpva: 'QUITADO', dataVencimentoIpva: '—', valorPago: 'R$ 890,00' },
    { ...BASE[4], exercicioIpva: '2026', valorIpva: 'R$ 2.450,00', situacaoIpva: 'PARCELADO', dataVencimentoIpva: '30/04/2026', valorPago: 'R$ 1.225,00' },
  ],
  LICENCIAMENTO: [
    { ...BASE[0], exercicioLicenciamento: '2026', valorTaxa: 'R$ 237,50', situacaoLicenciamento: 'QUITADO', dataVencimentoLicenciamento: '—' },
    { ...BASE[1], exercicioLicenciamento: '2026', valorTaxa: 'R$ 237,50', situacaoLicenciamento: 'QUITADO', dataVencimentoLicenciamento: '—' },
    { ...BASE[2], exercicioLicenciamento: '2026', valorTaxa: 'R$ 237,50', situacaoLicenciamento: 'PENDENTE', dataVencimentoLicenciamento: '30/04/2026' },
    { ...BASE[3], exercicioLicenciamento: '2026', valorTaxa: 'R$ 210,00', situacaoLicenciamento: 'QUITADO', dataVencimentoLicenciamento: '—' },
    { ...BASE[4], exercicioLicenciamento: '2026', valorTaxa: 'R$ 280,00', situacaoLicenciamento: 'PENDENTE', dataVencimentoLicenciamento: '30/04/2026' },
  ],
};

// maps each type to the DTO field used for "situação" filtering
const SITUACAO_FIELD: Partial<Record<ConsultaDetalheType, keyof ConsultaDetalheDto>> = {
  RECALL: 'situacaoRecall',
  GNV: 'situacaoGnv',
  GRAVAME: 'possuiGravame',
  PROPRIETARIO: 'situacaoTransferencia',
  CRLV: 'situacaoCrlv',
  IPVA: 'situacaoIpva',
  LICENCIAMENTO: 'situacaoLicenciamento',
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
