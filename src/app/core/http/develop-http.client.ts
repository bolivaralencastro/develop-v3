import { Injectable } from '@angular/core';
import { AbstractApi } from './abstract-api';
import { environment } from '@environment';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class DevelopHttpClient extends AbstractApi {
  protected readonly API = `${environment.api}`;

  constructor(readonly httpClient: HttpClient) {
    super(httpClient);
  }
}
