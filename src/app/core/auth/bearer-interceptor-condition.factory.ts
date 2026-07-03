import { createInterceptorCondition, IncludeBearerTokenCondition } from 'keycloak-angular';
import { environment } from '@environment';

export function apiConditionFactory() {
  const escapedUrl = environment.api.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  return createInterceptorCondition<IncludeBearerTokenCondition>({
    urlPattern: new RegExp(`^${escapedUrl}(/.*)?$`, 'i'),
    bearerPrefix: 'Bearer',
  });
}
