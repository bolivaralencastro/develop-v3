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
  // Situação do Veículo
  descricaoSituacao?: string;
  // Recall
  situacaoRecall?: string;
  campanhaRecall?: string;
  componente?: string;
  descricaoRecall?: string;
  // GNV
  possuiGnv?: string;
  numeroLaudo?: string;
  dataLaudo?: string;
  validadeLaudo?: string;
  situacaoGnv?: string;
  empresaInstaladora?: string;
  // Gravame
  possuiGravame?: string;
  credor?: string;
  agenteFinanceiro?: string;
  numeroContrato?: string;
  dataInclusao?: string;
  dataVencimentoGravame?: string;
  // Proprietário
  nomeProprietario?: string;
  cpfCnpj?: string;
  dataTransferencia?: string;
  situacaoTransferencia?: string;
  // CRLV
  ultimoExercicio?: string;
  situacaoCrlv?: string;
  dataEmissao?: string;
  // IPVA
  exercicioIpva?: string;
  valorIpva?: string;
  situacaoIpva?: string;
  dataVencimentoIpva?: string;
  valorPago?: string;
  // Licenciamento
  exercicioLicenciamento?: string;
  valorTaxa?: string;
  situacaoLicenciamento?: string;
  dataVencimentoLicenciamento?: string;
};

export const DETALHE_COLUMNS: Record<ConsultaDetalheType, string[]> = {
  SITUACAO_VEICULO: ['placa', 'renavam', 'chassi', 'estado', 'descricaoSituacao'],
  RECALL: ['placa', 'renavam', 'chassi', 'estado', 'situacaoRecall', 'campanhaRecall', 'componente', 'descricaoRecall'],
  GNV: ['placa', 'renavam', 'chassi', 'estado', 'possuiGnv', 'numeroLaudo', 'dataLaudo', 'validadeLaudo', 'situacaoGnv', 'empresaInstaladora'],
  GRAVAME: ['placa', 'renavam', 'chassi', 'estado', 'possuiGravame', 'credor', 'agenteFinanceiro', 'numeroContrato', 'dataInclusao', 'dataVencimentoGravame'],
  PROPRIETARIO: ['placa', 'renavam', 'chassi', 'estado', 'nomeProprietario', 'cpfCnpj', 'dataTransferencia', 'situacaoTransferencia'],
  CRLV: ['placa', 'renavam', 'chassi', 'estado', 'ultimoExercicio', 'situacaoCrlv', 'dataEmissao'],
  IPVA: ['placa', 'renavam', 'chassi', 'estado', 'exercicioIpva', 'valorIpva', 'situacaoIpva', 'dataVencimentoIpva', 'valorPago'],
  LICENCIAMENTO: ['placa', 'renavam', 'chassi', 'estado', 'exercicioLicenciamento', 'valorTaxa', 'situacaoLicenciamento', 'dataVencimentoLicenciamento'],
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
