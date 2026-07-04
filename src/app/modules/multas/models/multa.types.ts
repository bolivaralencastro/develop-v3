export type MultaSituacao = 'IMPOSTO' | 'NOTIFICADO' | 'PAGO' | 'RECURSO';

export type MultaDto = {
  id: string;
  placa: string;
  renavam: string;
  chassi: string;
  estado: string;
  lote?: string;
  origemConsulta?: string;
  categoriaConsulta?: string;
  numeroMulta: string;
  situacao: MultaSituacao;
  dataInfracao: string;
  horaInfracao: string;
  orgaoAutuador: string;
  codigoInfracao: string;
  descricaoInfracao: string;
  localInfracao: string;
  valor: string;
};

export type MultaFilter = {
  tipo?: 'IMPOSTAS' | 'NOTIFICADAS' | 'TODAS';
  search?: string;
  estado?: string[];
  page?: number;
  limit?: number;
};
