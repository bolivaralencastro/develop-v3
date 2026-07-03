import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { KEYCLOAK_EVENT_SIGNAL, KeycloakEventType } from 'keycloak-angular';
import { UserService } from '@core/user/user.service';
import { NavigationService } from '@core/navigation/navigation.service';
import Keycloak from 'keycloak-js';

@Component({
  selector: 'app-root',
  styles: `
    :host {
      display: flex;
      flex: 1 1 auto;
      width: 100%;
      height: 100%;
    }
  `,
  template: `<router-outlet></router-outlet>`,
  imports: [RouterOutlet],
})
export class AppComponent {
  private readonly keycloakSignal = inject(KEYCLOAK_EVENT_SIGNAL);
  /**
   * Constructor
   */
  constructor(
    private keycloak: Keycloak,
    private userService: UserService,
    private navigationService: NavigationService,
  ) {
    this.updateRoleBasedNavigation();

    effect(() => {
      const keycloakEvent = this.keycloakSignal();
      if (keycloakEvent.type === KeycloakEventType.TokenExpired) {
        this.keycloak.updateToken(20).then();
      }
    });
  }

  private updateRoleBasedNavigation() {
    const isAdmin = this.userService.isAdmin();
    if (isAdmin) {
      return;
    }
    this.navigationService.hideNavigationItem('admin');
  }
}
