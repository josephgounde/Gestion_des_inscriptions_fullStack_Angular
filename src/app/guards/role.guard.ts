// src/app/guards/role.guard.ts
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      // Not logged in, redirect to login
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    // Check if route requires specific roles
    const requiredRoles = route.data['roles'] as Array<string>;
    
    if (requiredRoles && requiredRoles.length > 0) {
      // Check if user has one of the required roles
      const hasRequiredRole = this.hasAnyRole(currentUser, requiredRoles);
      
      if (!hasRequiredRole) {
        // User doesn't have required role, redirect to appropriate dashboard
        this.redirectToAppropriateDashboard(currentUser);
        return false;
      }
    }

    return true;
  }

  private hasAnyRole(user: any, roles: string[]): boolean {
    if (!user.roles && !user.role) return false;

    // Check in roles array
    if (user.roles && Array.isArray(user.roles)) {
      const userRoles = user.roles.map((r: string) => r.replace('ROLE_', '').toUpperCase());
      const normalizedRequiredRoles = roles.map(r => r.replace('ROLE_', '').toUpperCase());
      return userRoles.some((role: string) => normalizedRequiredRoles.includes(role));
    }

    // Check single role
    if (user.role) {
      const userRole = user.role.replace('ROLE_', '').toUpperCase();
      const normalizedRequiredRoles = roles.map(r => r.replace('ROLE_', '').toUpperCase());
      return normalizedRequiredRoles.includes(userRole);
    }

    return false;
  }

  private redirectToAppropriateDashboard(user: any): void {
    if (this.authService.isSuperAdmin()) {
      this.router.navigate(['/admin/dashboard']);
    } else if (this.authService.isAgent()) {
      this.router.navigate(['/agent/dashboard']);
    } else if (this.authService.isCandidate()) {
      this.router.navigate(['/candidate/dashboard']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
}

// Specific guards for easier use
@Injectable({
  providedIn: 'root'
})
export class SuperAdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isSuperAdmin()) {
      return true;
    }
    
    // Redirect agents to their dashboard
    if (this.authService.isAgent()) {
      this.router.navigate(['/agent/dashboard']);
    } else {
      this.router.navigate(['/auth/login']);
    }
    return false;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AgentGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    // Allow both super admins and agents
    if (this.authService.isAgent() || this.authService.isSuperAdmin()) {
      return true;
    }
    
    this.router.navigate(['/auth/login']);
    return false;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AdminOrAgentGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isSuperAdmin() || this.authService.isAgent()) {
      return true;
    }
    
    this.router.navigate(['/auth/login']);
    return false;
  }
}