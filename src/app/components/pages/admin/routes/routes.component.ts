// src/app/pages/admin/admin.routes.ts
import { Routes } from '@angular/router';
import { AdminGuard } from '../../../../guards/auth.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('../dashboard/dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [AdminGuard]
  },
  {
    path: 'applications',
    loadComponent: () => import('../applications/application-list.component').then(m => m.ApplicationsListComponent),
    canActivate: [AdminGuard]
  },
  {
    path: 'applications/:id',
    loadComponent: () => import('../applications/application-detail.component').then(m => m.ApplicationDetailComponent),
    canActivate: [AdminGuard]
  },
  {
    path: 'analytics',
    loadComponent: () => import('../analytics/analytics.component').then(m => m.AnalyticsComponent),
    canActivate: [AdminGuard]
  },
  {
    path: 'settings',
    loadComponent: () => import('../settings/settings.component').then(m => m.SettingsComponent),
    canActivate: [AdminGuard]
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];
