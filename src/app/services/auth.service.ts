// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  token?: string;
}

interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Load user from localStorage (browser only)
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUserSubject.next(JSON.parse(storedUser));
      }
    }
  }

  login(credentials: LoginRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        if (response.token) {
          const user: User = {
            id: response.id,
            email: response.email,
            firstName: response.firstName,
            lastName: response.lastName,
            roles: response.roles || [],
            token: response.token
          };
          if (typeof window !== 'undefined') {
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('token', response.token);
          }
          this.currentUserSubject.next(user);
        }
      })
    );
  }

  register(data: RegisterRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users`, data);
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
    }
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return !!(user?.roles?.includes('ROLE_SUPER_ADMIN') || user?.roles?.includes('ROLE_ADMIN'));
  }

  isCandidate(): boolean {
    const user = this.getCurrentUser();
    return !!user?.roles?.includes('ROLE_CANDIDATE');
  }

  isAgent(): boolean {
    const user = this.getCurrentUser();
    return !!user?.roles?.includes('ROLE_AGENT');
  }
}