import { computed, Injectable, signal } from '@angular/core';
import { User } from 'app/core/user/user.types';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private _user: ReplaySubject<User> = new ReplaySubject<User>(1);
  private _roles = signal<string[]>([]);

  readonly isAdmin = computed(() => {
    const roles = this._roles();
    return this.hasRole(roles, 'super-admin');
  });

  readonly roles = this._roles.asReadonly();

  /**
   * Constructor
   */
  constructor() {
    this.user = {} as any;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Setter & getter for user
   *
   * @param value
   */
  set user(value: User) {
    // Store the value
    this._user.next(value);
  }

  get user$(): Observable<User> {
    return this._user.asObservable();
  }

  setRoles(roles: string[]) {
    this._roles.set(roles);
  }

  private hasRole(roles: string[], role: string): boolean {
    return roles.includes(role);
  }
}
