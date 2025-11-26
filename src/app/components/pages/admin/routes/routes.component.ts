// src/app/pages/admin/routes/routes.component.ts
import { Routes } from '@angular/router';
import { SuperAdminGuard } from '../../../../guards/role.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('../dashboard/dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [SuperAdminGuard] // Only SUPER_ADMIN can access
  },
  {
    path: 'applications',
    loadComponent: () => import('../applications/application-list.component').then(m => m.ApplicationsListComponent),
    canActivate: [SuperAdminGuard] // Only SUPER_ADMIN can access
  },
  {
    path: 'applications/:id',
    loadComponent: () => import('../applications/application-detail.component').then(m => m.ApplicationDetailComponent),
    canActivate: [SuperAdminGuard] // Only SUPER_ADMIN can access
  },
  {
    path: 'analytics',
    loadComponent: () => import('../analytics/analytics.component').then(m => m.AnalyticsComponent),
    canActivate: [SuperAdminGuard] // Only SUPER_ADMIN can access
  },
  {
    path: 'settings',
    loadComponent: () => import('../settings/settings.component').then(m => m.SettingsComponent),
    canActivate: [SuperAdminGuard] // Only SUPER_ADMIN can access
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];