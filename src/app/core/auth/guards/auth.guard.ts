import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn } from '@angular/router';
import Keycloak from 'keycloak-js';
import { UserService } from '@core/user/user.service';
import { environment } from '@environment';
import { resolveAppUrl } from '../pages-url';

export const AuthGuard: CanActivateFn | CanActivateChildFn = async (route, state) => {
  if ((environment as any).mockAuth) {
    return true;
  }

  const keycloak = inject(Keycloak);
  const userService = inject(UserService);

  try {
    const authenticated = keycloak.authenticated;
    const roles = userService.roles();

    // Force the user to log in if currently unauthenticated.
    if (!authenticated) {
      await keycloak.login({
        redirectUri: resolveAppUrl(state.url),
      });
    }

    // Get the roles required from the route.
    const requiredRoles = route.data.roles;

    // Allow the user to proceed if no additional roles are required to access the route.
    if (!Array.isArray(requiredRoles) || requiredRoles.length === 0) {
      return true;
    }

    // Allow the user to proceed if all the required roles are present.
    return requiredRoles.every((role) => roles.includes(role));
  } catch (error) {
    throw new Error('An error happened during access validation. Details:' + error);
  }
};
