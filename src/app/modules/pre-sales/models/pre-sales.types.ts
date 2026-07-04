export enum PRE_SALE_STATUS {
  PENDING = 'PENDING',
  STARTED = 'STARTED',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
}

export enum PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS {
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  STARTED = 'STARTED',
}

export enum VEHICLE_SITUATION {
  ALERT = 'ALERT',
  BLOCKED = 'BLOCKED',
  UNBLOCKED = 'UNBLOCKED',
}

export enum PRE_SALE_QUERY_TYPE {
  PRE_SALES = 'PRE_SALES',
  QUARTERLY = 'QUARTERLY',
  SPECIAL = 'SPECIAL',
}

export enum PRE_SALE_QUERY_CATEGORY {
  FLEET = 'FLEET',
  RAC = 'RAC',
  FREE = 'FREE',
}

export type PreSaleImportHistoryResponseDto = {
  id: string;
  originalFileName: string;
  filePath: string;
  status: PRE_SALE_STATUS;
  totalRecords: number;
  processedRecords: number;
  successCount: number;
  errorCount: number;
  alreadyRegisteredCount: number;
  progress: number;
  name: string;
  queryCategory: PRE_SALE_QUERY_CATEGORY;
  queryType: PRE_SALE_QUERY_TYPE;
  customId: string;
  createdAt: string;
  errors?: PreSaleImportHistoryErrorDto[];
};

export type PreSaleImportHistoryErrorDto = {
  message: string;
  lineNumber: number;
  placa: string;
  chassi: string;
  renavam: string;
  estado: string;
};

export type PreSaleImportHistoryVehicleResponseDto = {
  id: string;
  lineNumber: string;
  status: PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS;
  statusFines: PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS;
  statusGravame: PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS;
  statusRecall: PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS;
  statusOwnerPr: PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS;
  statusBlockPr: PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS;
  errorMessage: string;
  createdAt: string;
  vehicle: {
    chassi: string;
    id: string;
    numberPlate: string;
    renavam: string;
    state?: string;
    estate: string;
  };
};

export type PreSalesFilter = {
  search?: string;
  queryCategory?: PRE_SALE_QUERY_CATEGORY[];
  queryType?: PRE_SALE_QUERY_TYPE[];
  page?: number;
  limit?: number;
  sort?: string;
  order?: string;
};

export type PreSaleImportHistoryVehiclesFilter = {
  search?: string;
  status?: PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS[];
  state?: string[];
  page?: number;
  limit?: number;
  sort?: string;
  order?: string;
  situation?: VEHICLE_SITUATION[];
};

export type PresaleImportHistoryStatusCount = {
  totalGeral: number;
  progress: number;
  porStatus: { status: PRE_SALE_IMPORT_HISTORY_VEHICLE_STATUS; total: number }[];
};
