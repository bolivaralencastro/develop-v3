import { Injectable } from '@angular/core';
import { UserService } from '@core/user/user.service';
import { TenantService } from '@core/auth/services/tenant.service';
import Keycloak, { KeycloakProfile } from 'keycloak-js';
import { environment } from '@environment';
import { resolveAppUrl } from '../pages-url';

@Injectable({ providedIn: 'root' })
export class InitService {
  constructor(
    private keycloak: Keycloak,
    private userService: UserService,
    private tenantService: TenantService,
  ) {}

  async init(): Promise<void> {
    if ((environment as any).mockAuth) {
      this.userService.user = { name: 'Usuário Demo', email: 'demo@develop.com.br', id: 'mock-user-1' };
      this.userService.setRoles(['super-admin', 'user']);
      this.tenantService.setTenantId('mock-tenant');
      return;
    }

    await this.keycloak.init({ onLoad: 'check-sso', silentCheckSsoRedirectUri: resolveAppUrl('/assets/silent-check-sso.html') });
    if (!this.keycloak.authenticated) {
      await this.keycloak.login({ redirectUri: resolveAppUrl('/') });
      return;
    }

    const profile = await this.keycloak.loadUserProfile();
    this.setUserRoles();
    this.setUserInfo(profile);
    this.setTenantInfo(profile);
  }

  private setUserInfo(profile: KeycloakProfile) {
    const userName = profile.username;
    const firstName = profile.firstName;
    const lastName = profile.lastName;
    const userId = profile.id;
    this.userService.user = { name: `${firstName} ${lastName}`, email: userName, id: userId };
  }

  private setUserRoles() {
    const roles = this.getKeycloakRoles();
    this.userService.setRoles(roles);
  }

  private setTenantInfo(profile: KeycloakProfile) {
    const tenantId = profile.attributes['tenant_id'] as string;
    this.tenantService.setTenantId(tenantId);
  }

  private getKeycloakRoles() {
    let roles: string[] = [];
    const keycloakResourceAccess = this.keycloak.resourceAccess;
    const realmAccess = this.keycloak.realmAccess;

    if (keycloakResourceAccess) {
      Object.keys(keycloakResourceAccess).forEach((key) => {
        const resourceAccess = keycloakResourceAccess[key];
        const clientRoles = resourceAccess.roles ?? [];
        roles = roles.concat(clientRoles);
      });
    }

    if (realmAccess) {
      const realmRoles = realmAccess.roles ?? [];
      roles.push(...realmRoles);
    }

    return roles;
  }
}
