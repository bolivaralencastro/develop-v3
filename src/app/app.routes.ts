import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { LayoutComponent } from 'app/layout/layout.component';

export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'client-dashboard' },
  { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'client-dashboard' },

  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: LayoutComponent,
    resolve: {
      initialData: initialDataResolver,
    },
    children: [
      {
        path: 'client-dashboard',
        loadChildren: () => import('./modules/client-dashboard/client-dashboard.routes'),
      },
      {
        path: 'consultas',
        loadChildren: () => import('./modules/consultas/consultas.routes'),
      },
      {
        path: 'veiculos',
        loadChildren: () => import('./modules/vehicles/vehicles.routes'),
      },
      {
        path: 'multas',
        loadChildren: () => import('./modules/multas/multas.routes'),
      },
      {
        path: 'atpv',
        loadChildren: () => import('./modules/atpv/atpv.routes'),
      },
      // Legacy routes kept for backward compatibility
      {
        path: 'pre-sales',
        loadChildren: () => import('./modules/pre-sales/pre-sales.routes'),
      },
      {
        path: 'vehicles',
        redirectTo: 'veiculos',
      },
      { path: 'admin', loadChildren: () => import('./modules/admin/admin.routes') },
    ],
  },
];
