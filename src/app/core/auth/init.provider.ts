import { inject, provideAppInitializer } from '@angular/core';
import { InitService } from '@core/auth/services/init.service';

export const provideInitialization = () => {
  return [
    provideAppInitializer(() => {
      const initService = inject(InitService);
      return initService.init();
    }),
  ];
};
