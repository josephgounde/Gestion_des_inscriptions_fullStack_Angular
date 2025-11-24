// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface AdminProfile {
  id: string;
  userName: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  roles?: string[];
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
  private currentUserSubject = new BehaviorSubject<AdminProfile | null>(null);
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
          // Handle both 'role' (single) and 'roles' (array) from backend
          const userRole = response.role || (response.roles && response.roles[0]) || '';
          const userRoles = response.roles || (response.role ? [response.role] : []);
          
          const user: AdminProfile = {
            id: response.id,
            userName: response.username || response.userName || credentials.username,
            email: response.email,
            firstName: response.firstName,
            lastName: response.lastName,
            role: userRole,
            roles: userRoles,
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

  getCurrentUser(): AdminProfile | null {
    return this.currentUserSubject.value;
  }

  // Update user profile after completion
  updateCurrentUser(updates: Partial<AdminProfile>): void {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
      this.currentUserSubject.next(updatedUser);
    }
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

  // Check if user has SUPER_ADMIN role
  isSuperAdmin(): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    // Check both role (single) and roles (array)
    const hasRoleInSingle = user.role === 'SUPER_ADMIN' || user.role === 'ROLE_SUPER_ADMIN';
    const hasRoleInArray = user.roles?.some(r => 
      r === 'SUPER_ADMIN' || r === 'ROLE_SUPER_ADMIN'
    ) || false;
    
    return hasRoleInSingle || hasRoleInArray;
  }

  // Check if user is any type of admin
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    const adminRoles = ['SUPER_ADMIN', 'ROLE_SUPER_ADMIN', 'ADMIN', 'ROLE_ADMIN', 'AGENT', 'ROLE_AGENT'];
    
    const hasRoleInSingle = adminRoles.includes(user.role);
    const hasRoleInArray = user.roles?.some(r => adminRoles.includes(r)) || false;
    
    return hasRoleInSingle || hasRoleInArray;
  }

  // Check if user is an agent
  isAgent(): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    const hasRoleInSingle = user.role === 'AGENT' || user.role === 'ROLE_AGENT';
    const hasRoleInArray = user.roles?.some(r => 
      r === 'AGENT' || r === 'ROLE_AGENT'
    ) || false;
    
    return hasRoleInSingle || hasRoleInArray;
  }

  // Check if user is a candidate
  isCandidate(): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    const hasRoleInSingle = user.role === 'CANDIDATE' || user.role === 'ROLE_CANDIDATE';
    const hasRoleInArray = user.roles?.some(r => 
      r === 'CANDIDATE' || r === 'ROLE_CANDIDATE'
    ) || false;
    
    return hasRoleInSingle || hasRoleInArray;
  }

  // Get user's primary role (without ROLE_ prefix)
  getUserRole(): string {
    const user = this.getCurrentUser();
    if (!user) return '';
    
    const role = user.role || (user.roles && user.roles[0]) || '';
    return role.replace('ROLE_', '');
  }
}