import { computed, Injectable, Signal, signal } from '@angular/core';
import { groupMultasByVeiculo, MultaDto, MultaFilter, MultaResumoDto } from '../models/multa.types';
import { PageMeta } from '@core/http';

const MOCK_MULTAS: MultaDto[] = [
  {
    id: '1', placa: 'SYD8E48', renavam: '9BGEN48H0RG235761', chassi: '1372758647', estado: 'MG',
    numeroMulta: '0000002382', situacao: 'IMPOSTO',
    dataInfracao: '10/10/2025', horaInfracao: '16:20',
    orgaoAutuador: 'PREF DE MG CONFINS', codigoInfracao: '5002',
    descricaoInfracao: 'MULTA POR NAO IDENTIFICACAO DO CONDUTOR INFRATOR IMPOSTA A PESSOA JURIDICA',
    localInfracao: 'CONFINS - RODOVIA LMG 800 PISTA INTERNA DEFRONTE KM2 AEROPORTO',
    valor: 'R$ 260,32',
  },
  {
    id: '2', placa: 'TCV5A31', renavam: '9BHCU51AASP687666', chassi: '1421952995', estado: 'MG',
    numeroMulta: '0001261885', situacao: 'IMPOSTO',
    dataInfracao: '03/10/2025', horaInfracao: '16:20',
    orgaoAutuador: 'DER MG', codigoInfracao: '5002',
    descricaoInfracao: 'MULTA POR NAO IDENTIFICACAO DO CONDUTOR INFRATOR IMPOSTA A PESSOA JURIDICA',
    localInfracao: 'NOVA LIMA - MG030 KM 17.65 NOVA LIMA - BORDO DIREITO - FX1 - D',
    valor: 'R$ 260,32',
  },
  {
    id: '3', placa: 'SYU7E51', renavam: '9BWBJ6BF4R4070784', chassi: '1389456150', estado: 'MG',
    numeroMulta: '0001276276', situacao: 'IMPOSTO',
    dataInfracao: '07/11/2025', horaInfracao: '16:20',
    orgaoAutuador: 'DER MG', codigoInfracao: '5002',
    descricaoInfracao: 'MULTA POR NAO IDENTIFICACAO DO CONDUTOR INFRATOR IMPOSTA A PESSOA JURIDICA',
    localInfracao: 'BOM SUCESSO - MG335 KM 73.00 BOM SUCESSO - BORDO DIREITO - FX1',
    valor: 'R$ 260,32',
  },
  {
    id: '4', placa: 'SHJ9A63', renavam: '98867512MPKM02689', chassi: '1343603991', estado: 'MG',
    numeroMulta: '0001279029', situacao: 'IMPOSTO',
    dataInfracao: '14/11/2025', horaInfracao: '16:20',
    orgaoAutuador: 'DER MG', codigoInfracao: '5002',
    descricaoInfracao: 'MULTA POR NAO IDENTIFICACAO DO CONDUTOR INFRATOR IMPOSTA A PESSOA JURIDICA',
    localInfracao: 'PIRANGA - MGC482 KM 205.5 PIRANGA - BORDO ESQUERDO - FX1 - CRE',
    valor: 'R$ 390,46',
  },
  {
    id: '5', placa: 'TCV5A31', renavam: '9BHCU51AASP687666', chassi: '1421952995', estado: 'MG',
    numeroMulta: '0001279612', situacao: 'IMPOSTO',
    dataInfracao: '14/11/2025', horaInfracao: '16:20',
    orgaoAutuador: 'DER MG', codigoInfracao: '5002',
    descricaoInfracao: 'MULTA POR NAO IDENTIFICACAO DO CONDUTOR INFRATOR IMPOSTA A PESSOA JURIDICA',
    localInfracao: 'NOVA LIMA - MG030 KM 17.60 NOVA LIMA - BORDO DIREITO - FX1 - C',
    valor: 'R$ 260,32',
  },
  {
    id: '6', placa: 'SIS7D14', renavam: '9BWBH6BF7P4044818', chassi: '1360102024', estado: 'MG',
    numeroMulta: '1AA0095833', situacao: 'IMPOSTO',
    dataInfracao: '01/11/2025', horaInfracao: '08:15',
    orgaoAutuador: 'DER SP', codigoInfracao: '5002',
    descricaoInfracao: 'MULTA POR NAO IDENTIFICACAO DO CONDUTOR INFRATOR IMPOSTA A PESSOA JURIDICA',
    localInfracao: 'ITAPEVI - SP 280 KM 032 METROS 200',
    valor: 'R$ 260,32',
  },
  {
    id: '7', placa: 'PZB2H04', renavam: '9BWBJ6BF0R4036695', chassi: '1366975038', estado: 'MG',
    numeroMulta: '1AA0342763', situacao: 'IMPOSTO',
    dataInfracao: '05/11/2025', horaInfracao: '08:19',
    orgaoAutuador: 'DER SP', codigoInfracao: '5002',
    descricaoInfracao: 'MULTA POR NAO IDENTIFICACAO DO CONDUTOR INFRATOR IMPOSTA A PESSOA JURIDICA',
    localInfracao: 'RIBEIRAO PRETO - SP 333 KM 054 METROS 000',
    valor: 'R$ 260,32',
  },
];

@Injectable()
export class MultasService {
  private readonly _filter = signal<MultaFilter>({ page: 1, limit: 20 });

  readonly isLoading = signal(false);

  readonly multas = computed(() => {
    const filter = this._filter();
    let data = [...MOCK_MULTAS];

    if (filter.tipo === 'IMPOSTAS') {
      data = data.filter((m) => m.situacao === 'IMPOSTO');
    } else if (filter.tipo === 'NOTIFICADAS') {
      data = data.filter((m) => m.situacao === 'NOTIFICADO');
    }

    if (filter.search) {
      const q = filter.search.toLowerCase();
      data = data.filter(
        (m) =>
          m.placa.toLowerCase().includes(q) ||
          m.chassi.includes(q) ||
          m.renavam.includes(q) ||
          m.numeroMulta.includes(q),
      );
    }

    if (filter.estado?.length) {
      data = data.filter((m) => filter.estado.includes(m.estado));
    }

    return data;
  });

  // resumo por veículo — usado nas telas de resumo (Consultas › Multas 1.10.x e Veículos › Multas 2.6)
  private readonly filteredForResumo = computed(() => {
    const filter = this._filter();
    let data = [...MOCK_MULTAS];

    if (filter.search) {
      const q = filter.search.toLowerCase();
      data = data.filter(
        (m) =>
          m.placa.toLowerCase().includes(q) ||
          m.chassi.includes(q) ||
          m.renavam.includes(q) ||
          m.numeroMulta.includes(q),
      );
    }

    if (filter.estado?.length) {
      data = data.filter((m) => filter.estado.includes(m.estado));
    }

    return data;
  });

  readonly resumoPorVeiculo: Signal<MultaResumoDto[]> = computed(() =>
    groupMultasByVeiculo(this.filteredForResumo()),
  );

  readonly pagination = computed<PageMeta>(() => ({
    totalItems: this.multas().length,
    currentPage: this._filter().page ?? 1,
    itemsPerPage: this._filter().limit ?? 20,
    totalPages: Math.ceil(this.multas().length / (this._filter().limit ?? 20)),
    filter: {},
    links: { first: '', previous: '', current: '', next: '', last: '' },
  }));

  readonly resumoPagination = computed<PageMeta>(() => ({
    totalItems: this.resumoPorVeiculo().length,
    currentPage: this._filter().page ?? 1,
    itemsPerPage: this._filter().limit ?? 20,
    totalPages: Math.ceil(this.resumoPorVeiculo().length / (this._filter().limit ?? 20)),
    filter: {},
    links: { first: '', previous: '', current: '', next: '', last: '' },
  }));

  setFilter(filter: MultaFilter) {
    this._filter.update((curr) => ({ ...filter, page: curr.page, limit: curr.limit }));
  }

  setPage(page: number, limit: number) {
    this._filter.update((curr) => ({ ...curr, page, limit }));
  }

  setTipo(tipo: MultaFilter['tipo']) {
    this._filter.update((curr) => ({ ...curr, tipo }));
  }
}
