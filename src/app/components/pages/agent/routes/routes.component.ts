// src/app/pages/agent/routes/routes.component.ts
import { Routes } from '@angular/router';
import { AgentGuard } from '../../../../guards/role.guard';

export const AGENT_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('../agent-dashboard/agent-dashboard.component').then(m => m.AgentDashboardComponent),
    canActivate: [AgentGuard] // Only AGENT (or SUPER_ADMIN) can access
  },
  {
    path: 'applications/:id',
    loadComponent: () => import('../application-review/application-review.component').then(m => m.ApplicationReviewComponent),
    canActivate: [AgentGuard] // Only AGENT can access assigned applications
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];