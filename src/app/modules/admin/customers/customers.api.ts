import { inject, Injectable } from '@angular/core';
import { Customer } from './customers.types';
import { BaseFilter, DevelopHttpClient, PageDto } from '@core/http';

@Injectable({ providedIn: 'root' })
export class CustomersApi {
  private readonly http = inject(DevelopHttpClient);
  private readonly API = '/clients';

  list(filter: BaseFilter<Customer>) {
    return this.http.get<PageDto<Customer>>(this.API, filter);
  }

  create(customer: Partial<Customer>) {
    return this.http.post<Customer>(this.API, customer);
  }

  update(customerId: string, customer: Partial<Customer>) {
    return this.http.put<Customer>(`${this.API}/${customerId}`, customer);
  }

  delete(customerId: string) {
    return this.http.delete(`${this.API}/${customerId}`);
  }
}
