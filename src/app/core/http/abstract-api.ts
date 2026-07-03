import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

export abstract class AbstractApi {
  protected abstract API: string;

  private readonly headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
  });

  protected constructor(protected http: HttpClient) {}

  get<T>(endpoint: string, params?: Record<string, unknown>) {
    const options = this.createHttpOptions(params);
    return this.http.get<T>(`${this.API}${endpoint}`, options);
  }

  post<T>(endpoint: string, body: any, params?: Record<string, unknown>) {
    const options = this.createHttpOptions(params);
    return this.http.post<T>(`${this.API}${endpoint}`, body, options);
  }

  public postFormData<T>(endpoint: string, data: FormData, options: Record<string, unknown> = {}) {
    return this.http.post<T>(`${this.API}${endpoint}`, data, options);
  }

  patch<T>(endpoint: string, body: any, params?: Record<string, unknown>) {
    const options = this.createHttpOptions(params);
    return this.http.patch<T>(`${this.API}${endpoint}`, body, options);
  }

  put<T>(endpoint: string, body: any, params?: Record<string, unknown>) {
    const options = this.createHttpOptions(params);
    return this.http.put<T>(`${this.API}${endpoint}`, body, options);
  }

  delete<T>(endpoint: string, params?: Record<string, unknown>) {
    const options = this.createHttpOptions(params);
    return this.http.delete<unknown>(`${this.API}${endpoint}`, options);
  }

  private createHttpOptions(params: Record<string, unknown>): Record<string, unknown> {
    const options: Record<string, unknown> = { headers: this.headers };
    if (params) {
      options.params = this.serializeParams(params);
    }

    return options;
  }

  private serializeParams(params: Record<string, any>): HttpParams {
    const paramsCopy = structuredClone(params);
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        delete paramsCopy[key];
      }
    });

    return new HttpParams({ fromObject: paramsCopy });
  }
}
