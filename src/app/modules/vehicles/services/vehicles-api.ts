import { Injectable } from '@angular/core';
import { BaseFilter, DevelopHttpClient, PageDto } from '@core/http';
import { VehicleDto, VehiclesFilter } from '../models/vehicles.types';
import { environment } from '@environment';
import { of } from 'rxjs';

const MOCK_VEHICLES: VehicleDto[] = [
  {
    id: '1', numberPlate: 'TCW2B26', renavam: '1408440137', chassi: '988675ADDSKV17591', state: 'MG',
    status: 'LIBERADO', alerta: false,
    situacaoVeiculo: 'IMPEDIMENTO PROPRIEDADE LOCADORA',
    gravame: 'VEÍCULO NUNCA CONSTOU NA BASE DO SISTEMA NACIONAL DE GRAVAMES',
    owner: 'UNIDAS LOCADORA S.A', ultimoCrlv: '2026', situacaoRecall: 'N/C', ipva: 'R$ -', multas: 'NADA CONSTA',
    brandModel: 'VW/GOL', modelYear: 2022, manufactureYear: 2022, color: 'Branco', fuelType: 'Flex', city: 'Belo Horizonte', nextSearchDate: '2026-01-01',
  },
  {
    id: '2', numberPlate: 'TCW7F19', renavam: '1409138825', chassi: '9886111LGSK637125', state: 'MG',
    status: 'LIBERADO', alerta: false,
    situacaoVeiculo: 'IMPEDIMENTO PROPRIEDADE LOCADORA',
    gravame: 'VEÍCULO NUNCA CONSTOU NA BASE DO SISTEMA NACIONAL DE GRAVAMES',
    owner: 'UNIDAS LOCADORA S.A', ultimoCrlv: '2026', situacaoRecall: 'N/C', ipva: 'R$ -', multas: 'NADA CONSTA',
    brandModel: 'HYUNDAI/HB20', modelYear: 2023, manufactureYear: 2023, color: 'Prata', fuelType: 'Flex', city: 'Belo Horizonte', nextSearchDate: '2026-01-01',
  },
  {
    id: '3', numberPlate: 'TCW2B28', renavam: '1408440153', chassi: '988675ADDSKV18067', state: 'MG',
    status: 'LIBERADO', alerta: false,
    situacaoVeiculo: 'IMPEDIMENTO PROPRIEDADE LOCADORA',
    gravame: 'VEÍCULO NUNCA CONSTOU NA BASE DO SISTEMA NACIONAL DE GRAVAMES',
    owner: 'UNIDAS LOCADORA S.A', ultimoCrlv: '2026', situacaoRecall: 'N/C', ipva: 'R$ -', multas: 'CONSTA',
    brandModel: 'FIAT/CRONOS', modelYear: 2022, manufactureYear: 2022, color: 'Vermelho', fuelType: 'Flex', city: 'Belo Horizonte', nextSearchDate: '2026-01-01',
  },
  {
    id: '4', numberPlate: 'SET3I95', renavam: '1358691549', chassi: '95PDEM61DRB024102', state: 'PR',
    status: 'LIBERADO', alerta: false,
    situacaoVeiculo: 'VIGENTE (EM CIRCULAÇÃO)',
    gravame: 'VEÍCULO NUNCA CONSTOU NA BASE DO SISTEMA NACIONAL DE GRAVAMES',
    owner: 'UNIDAS LOCADORA S.A.', ultimoCrlv: '2026', situacaoRecall: 'N/C', ipva: 'R$ -', multas: 'NADA CONSTA',
    brandModel: 'RENAULT/KWID', modelYear: 2023, manufactureYear: 2023, color: 'Cinza', fuelType: 'Flex', city: 'Curitiba', nextSearchDate: '2026-01-01',
  },
  {
    id: '5', numberPlate: 'UEK4G37', renavam: '1462415803', chassi: 'LGWEFUA5XSH957057', state: 'SP',
    status: 'LIBERADO', alerta: false,
    situacaoVeiculo: 'VIGENTE (EM CIRCULAÇÃO)',
    gravame: 'VEÍCULO NUNCA CONSTOU NA BASE DO SISTEMA NACIONAL DE GRAVAMES',
    owner: 'UNIDAS LOCADORA S A', ultimoCrlv: '2026', situacaoRecall: 'N/C', ipva: 'R$ -', multas: 'NADA CONSTA',
    brandModel: 'CHERY/TIGGO', modelYear: 2023, manufactureYear: 2023, color: 'Azul', fuelType: 'Flex', city: 'São Paulo', nextSearchDate: '2026-01-01',
  },
];

@Injectable({
  providedIn: 'root',
})
export class VehiclesApi {
  private readonly API = '/vehicles';

  constructor(private readonly http: DevelopHttpClient) {}

  list(filter: BaseFilter<VehicleDto>) {
    if ((environment as any).mockAuth) {
      const data = MOCK_VEHICLES;
      return of({
        data,
        meta: {
          totalItems: data.length,
          currentPage: filter.page ?? 1,
          itemsPerPage: filter.limit ?? 20,
          totalPages: 1,
          filter: {},
          links: { first: '', previous: '', current: '', next: '', last: '' },
        },
      } as PageDto<VehicleDto>);
    }
    return this.http.get<PageDto<VehicleDto>>(this.API, this.buildParams(filter));
  }

  getDetails(id: string) {
    if ((environment as any).mockAuth) {
      return of(MOCK_VEHICLES.find((v) => v.id === id) ?? MOCK_VEHICLES[0]);
    }
    return this.http.get<VehicleDto>(`${this.API}/${id}`);
  }

  private buildParams(filter: VehiclesFilter) {
    const params: Record<string, any> = {
      page: filter.page,
      limit: filter.limit,
    };

    if (filter.search) {
      params['search'] = filter.search;
    }

    if (filter.state?.length) {
      params['filter.state'] = `$in:${filter.state}`;
    }
    return params;
  }
}
