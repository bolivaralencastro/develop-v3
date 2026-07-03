import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TenantService {
  private readonly STORAGE_KEY = 'tenant-id';

  getTenantId(): string {
    return localStorage.getItem(this.STORAGE_KEY);
  }

  setTenantId(tenantId: string) {
    localStorage.setItem(this.STORAGE_KEY, tenantId);
  }

  clear() {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
