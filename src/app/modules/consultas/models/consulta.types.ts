export type ConsultaVehicleStatus = 'LIBERADO' | 'BLOQUEADO';

export type ConsultaVehicleDto = {
  id: string;
  placa: string;
  renavam: string;
  chassi: string;
  estado: string;
  status: ConsultaVehicleStatus;
  alerta: boolean;
  situacaoVeiculo: string;
  gravame: string;
  proprietario: string;
  licenciamento: string;
  recall: string;
  ipva: string;
  multas: string;
};

export type ConsultaQueryType = 'PRE_VENDA' | 'TRIMESTRAL' | 'ESPECIAL';

export type ConsultaFilter = {
  queryType?: ConsultaQueryType;
  search?: string;
  estado?: string[];
  status?: ConsultaVehicleStatus[];
  page?: number;
  limit?: number;
};

// ── Detalhe pages ─────────────────────────────────────────────────────────────

export type ConsultaDetalheFilter = {
  search?: string;
  estado?: string[];
  situacao?: string[];
};

export type ConsultaDetalheType =
  | 'SITUACAO_VEICULO'
  | 'RECALL'
  | 'GNV'
  | 'GRAVAME'
  | 'PROPRIETARIO'
  | 'CRLV'
  | 'IPVA'
  | 'LICENCIAMENTO';

export type ConsultaDetalheDto = {
  id: string;
  placa: string;
  renavam: string;
  chassi: string;
  estado: string;
  // STATUS — coluna presente em todas as telas de consulta (planilha MENU CONSULTAS)
  status: ConsultaVehicleStatus;
  // Situação do Veículo
  descricaoSituacao?: string;
  // Recall
  recall?: string;
  descricaoRecall?: string;
  dataRegistroRecall?: string;
  dataLimiteRecall?: string;
  situacaoRecall?: string;
  // GNV
  ultimoLaudoGnv?: string;
  prazoRegularizacaoGnv?: string;
  situacaoGnv?: string;
  // Gravame
  gravame?: string;
  // Proprietário
  nomeProprietario?: string;
  cpfCnpj?: string;
  // CRLV
  ultimoLicenciamento?: string;
  // IPVA
  valorIpva?: string;
  // Licenciamento
  taxaLicenciamento?: string;
};

export const DETALHE_COLUMNS: Record<ConsultaDetalheType, string[]> = {
  SITUACAO_VEICULO: ['placa', 'renavam', 'chassi', 'estado', 'status', 'descricaoSituacao'],
  RECALL: ['placa', 'renavam', 'chassi', 'estado', 'status', 'recall', 'descricaoRecall', 'dataRegistroRecall', 'dataLimiteRecall', 'situacaoRecall'],
  GNV: ['placa', 'renavam', 'chassi', 'estado', 'status', 'ultimoLaudoGnv', 'prazoRegularizacaoGnv', 'situacaoGnv'],
  GRAVAME: ['placa', 'renavam', 'chassi', 'estado', 'status', 'gravame'],
  PROPRIETARIO: ['placa', 'renavam', 'chassi', 'estado', 'status', 'nomeProprietario', 'cpfCnpj'],
  CRLV: ['placa', 'renavam', 'chassi', 'estado', 'status', 'ultimoLicenciamento'],
  IPVA: ['placa', 'renavam', 'chassi', 'estado', 'status', 'valorIpva'],
  LICENCIAMENTO: ['placa', 'renavam', 'chassi', 'estado', 'status', 'taxaLicenciamento'],
};

export const DETALHE_TITLES: Record<ConsultaDetalheType, string> = {
  SITUACAO_VEICULO: 'Consultas › Situação do Veículo',
  RECALL: 'Consultas › Recall',
  GNV: 'Consultas › GNV',
  GRAVAME: 'Consultas › Gravame',
  PROPRIETARIO: 'Consultas › Proprietário',
  CRLV: 'Consultas › CRLV',
  IPVA: 'Consultas › IPVA',
  LICENCIAMENTO: 'Consultas › Licenciamento',
};
