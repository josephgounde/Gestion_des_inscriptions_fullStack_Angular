// src/app/app.routes.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/pages/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'auth',
    loadChildren: () => import('./components/pages/auth/routes/routes.component').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'candidate',
    loadChildren: () => import('./components/pages/candidate/routes/routes.component').then(m => m.CANDIDATE_ROUTES)
  },
  {
    path: 'admin',
    loadChildren: () => import('./components/pages/admin/routes/routes.component').then(m => m.ADMIN_ROUTES)
    // SuperAdminGuard is applied inside ADMIN_ROUTES to each route
  },
  {
    path: 'agent',
    loadChildren: () => import('./components/pages/agent/routes/routes.component').then(m => m.AGENT_ROUTES)
    // AgentGuard is applied inside AGENT_ROUTES to each route
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // to force the scroll position back to the top (0,0) on navigation
    scrollPositionRestoration: 'enabled', 
    anchorScrolling: 'enabled', // For scrolling to anchors/fragments
    onSameUrlNavigation: 'reload', // Optional: for consistent behavior
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }