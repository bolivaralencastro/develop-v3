import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Navigation } from 'app/core/navigation/navigation.types';
import { Observable, ReplaySubject, take, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private _httpClient = inject(HttpClient);
  private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for navigation
   */
  get navigation$(): Observable<Navigation> {
    return this._navigation.asObservable();
  }

  hideNavigationItem(id: string) {
    this.navigation$.pipe(take(1)).subscribe({
      next: (navigation) => {
        const items = navigation.futuristic;
        for (let i = 0; i < items.length; i++) {
          if (items[i].id === id) {
            items.splice(i, 1);
          }
        }

        navigation.futuristic = items;
        this._navigation.next(navigation);
      },
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get all navigation data
   */
  get(): Observable<Navigation> {
    return this._httpClient.get<Navigation>('api/common/navigation').pipe(
      take(1),
      tap((navigation) => {
        this._navigation.next(navigation);
      }),
    );
  }
}
