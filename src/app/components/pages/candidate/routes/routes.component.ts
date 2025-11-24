// src/app/pages/candidate/candidate.routes.ts
import { Routes } from '@angular/router';
import { CandidateGuard } from '../../../../guards/auth.guard';

export const CANDIDATE_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('../dashboard/dashboard.component').then(m => m.CandidateDashboardComponent),
    canActivate: [CandidateGuard]
  },
  {
    path: 'enrollment',
    loadComponent: () => import('../enrollment/enrollment.component').then(m => m.EnrollmentFormComponent),
    canActivate: [CandidateGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('../profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [CandidateGuard]
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];
