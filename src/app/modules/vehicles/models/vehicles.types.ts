export type VehicleInfoCard = {
  icon: string;
  label: string;
  value: string;
};

export type VehicleTab = {
  label: string;
  disabled?: boolean;
};

export const VEHICLE_TABS: VehicleTab[] = [
  { label: 'CARACTERÍSTICAS' },
  { label: 'HISTÓRICO DE MULTAS', disabled: true },
  { label: 'RESTRIÇÕES JUDICIAIS', disabled: true },
];

export const VEHICLE_INFO_CARDS: VehicleInfoCard[] = [
  { icon: 'description', label: 'Último CRLV', value: 'Exercício 2025' },
  { icon: 'payments', label: 'Multas', value: 'Nenhuma' },
  { icon: 'receipt_long', label: 'IPVA', value: 'Quitado' },
  { icon: 'verified', label: 'Licenciamento', value: 'Regular' },
];

export type VehicleStatus = 'LIBERADO' | 'BLOQUEADO';

export type VehicleDto = {
  id: string;
  renavam: string;
  chassi: string;
  brandModel: string;
  modelYear: number;
  manufactureYear: number;
  color: string;
  fuelType: string;
  numberPlate: string;
  state: string;
  city: string;
  nextSearchDate: string;
  owner: string;
  status?: VehicleStatus;
  alerta?: boolean;
  situacaoVeiculo?: string;
  gravame?: string;
  ultimoCrlv?: string;
  situacaoRecall?: string;
  ipva?: string;
  multas?: string;
};

export type VehiclesFilter = {
  search?: string;
  state?: string[];
  status?: VehicleStatus[];
  page?: number;
  limit?: number;
};

export type VehicleStatusFilter = 'LIBERADOS' | 'LIBERADOS_ALERTA' | 'BLOQUEADOS' | 'BLOQUEADOS_ALERTA' | 'TODOS' | 'MULTAS';
