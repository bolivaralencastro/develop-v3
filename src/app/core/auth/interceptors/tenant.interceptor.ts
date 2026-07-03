import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '@environment';
import { inject } from '@angular/core';
import { TenantService } from '@core/auth/services/tenant.service';

export const tenantInterceptor: HttpInterceptorFn = (req, next) => {
  const tenantService = inject(TenantService);

  if (!req.url.startsWith(environment.api)) {
    return next(req);
  }

  const tenantId = tenantService.getTenantId();
  if (!tenantId) {
    return next(req);
  }

  const tenantReq = req.clone({ setHeaders: { 'x-tenant-id': tenantId } });
  return next(tenantReq);
};
