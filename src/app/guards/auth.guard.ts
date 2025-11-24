// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isAuthenticated()) {
      return true;
    }
    
    // Redirect to login page
    return this.router.createUrlTree(['/auth/login']);
  }
}

// src/app/guards/admin.guard.ts
@Injectable({
  providedIn: 'root'
})
export class AdminGuard {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isAuthenticated() && this.authService.isAdmin()) {
      return true;
    }
    
    // Redirect to unauthorized page or login
    alert('Accès réservé aux administrateurs');
    return this.router.createUrlTree(['/']);
  }
}

// src/app/guards/candidate.guard.ts
@Injectable({
  providedIn: 'root'
})
export class CandidateGuard {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isAuthenticated() && this.authService.isCandidate()) {
      return true;
    }
    
    alert('Accès réservé aux candidats');
    return this.router.createUrlTree(['/']);
  }
}