// src/app/pages/auth/login/login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-neo-light via-gray-100 to-neo-light flex items-center justify-center p-6">
      <div class="w-full max-w-md">
        <!-- Logo -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-primary-700 shadow-neo mb-4">
            <span class="text-white font-bold text-2xl">E</span>
          </div>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Bienvenue</h1>
          <p class="text-gray-600">Connectez-vous à votre compte</p>
        </div>

        <!-- Login Card -->
        <div class="bg-neo-light rounded-3xl shadow-neo p-8 space-y-6">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <!-- Username -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nom d'utilisateur</label>
              <input 
                type="text" 
                formControlName="username"
                class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                placeholder="Votre nom d'utilisateur"
              />
              @if (loginForm.get('username')?.invalid && loginForm.get('username')?.touched) {
                <p class="text-red-500 text-sm mt-1">Nom d'utilisateur requis</p>
              }
            </div>

            <!-- Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
              <input 
                [type]="showPassword ? 'text' : 'password'"
                formControlName="password"
                class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                placeholder="••••••••"
              />
              <button 
                type="button"
                (click)="showPassword = !showPassword"
                class="text-sm text-primary-500 mt-1 hover:text-primary-700"
              >
                {{ showPassword ? 'Masquer' : 'Afficher' }}
              </button>
              @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
                <p class="text-red-500 text-sm mt-1">Mot de passe requis</p>
              }
            </div>

            <!-- Error Message -->
            @if (errorMessage) {
              <div class="p-4 bg-red-50 rounded-xl shadow-neo-inset">
                <p class="text-sm text-red-800">{{ errorMessage }}</p>
              </div>
            }

            <!-- Remember & Forgot -->
            <div class="flex items-center justify-between">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  formControlName="rememberMe"
                  class="w-5 h-5 rounded shadow-neo-inset checked:bg-primary-500"
                />
                <span class="text-sm text-gray-700">Se souvenir</span>
              </label>
              <a href="#" class="text-sm text-primary-500 hover:text-primary-700">Mot de passe oublié?</a>
            </div>

            <!-- Submit Button -->
            <button 
              type="submit"
              [disabled]="loginForm.invalid || loading"
              class="w-full py-4 rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 text-white font-semibold shadow-neo hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? 'Connexion...' : 'Se connecter' }}
            </button>
          </form>

          <!-- Divider -->
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-neo-light text-gray-500">Ou continuer avec</span>
            </div>
          </div>

          <!-- Social Login -->
          <div class="grid grid-cols-2 gap-4">
            <button class="py-3 px-4 rounded-xl bg-neo-light shadow-neo hover:shadow-neo-inset transition-all duration-300 flex items-center justify-center space-x-2">
              <svg class="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span class="text-sm font-medium text-gray-700">Google</span>
            </button>
            <button class="py-3 px-4 rounded-xl bg-neo-light shadow-neo hover:shadow-neo-inset transition-all duration-300 flex items-center justify-center space-x-2">
              <svg class="w-5 h-5" fill="#00A4EF" viewBox="0 0 24 24">
                <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z"/>
              </svg>
              <span class="text-sm font-medium text-gray-700">Microsoft</span>
            </button>
          </div>

          <!-- Register Link -->
          <div class="text-center text-sm text-gray-600">
            Pas encore de compte? 
            <a routerLink="/auth/register" class="text-primary-500 hover:text-primary-700 font-medium">S'inscrire</a>
          </div>
        </div>

        <!-- Back to Home -->
        <div class="text-center mt-6">
          <a routerLink="/" class="text-sm text-gray-600 hover:text-gray-800">← Retour à l'accueil</a>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  loading = false;
  errorMessage = '';
  returnUrl = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });

    // Get return URL from route parameters or default to home
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const credentials = {
        username: this.loginForm.get('username')?.value,
        password: this.loginForm.get('password')?.value
      };

      console.log('Attempting login...'); // Debug log

      this.authService.login(credentials).subscribe({
        next: (response) => {
          console.log('Login successful:', response); // Debug log
          this.loading = false;

          // Route based on user role
          this.routeUserBasedOnRole();
        },
        error: (error) => {
          console.error('Login error:', error); // Debug log
          this.loading = false;

          // Display user-friendly error message
          if (error.status === 401) {
            this.errorMessage = 'Invalid username or password. Please try again.';
          } else if (error.status === 403) {
            this.errorMessage = 'Your account has been suspended. Contact support.';
          } else if (error.status === 0) {
            this.errorMessage = 'Cannot connect to server. Please check your connection.';
          } else {
            this.errorMessage = error.error?.message || 'Login failed. Please try again.';
          }
        }
      });
    }
  }

  private routeUserBasedOnRole() {
    // If there's a return URL, go there (unless it's for a different role)
    if (this.returnUrl) {
      if (this.authService.isSuperAdmin() && this.returnUrl.includes('/admin')) {
        this.router.navigateByUrl(this.returnUrl);
        return;
      }
      if (this.authService.isAgent() && this.returnUrl.includes('/agent')) {
        this.router.navigateByUrl(this.returnUrl);
        return;
      }
    }

    // Route to appropriate dashboard based on role
    if (this.authService.isSuperAdmin()) {
      console.log('Routing to admin dashboard');
      this.router.navigate(['/admin/dashboard']);
    } else if (this.authService.isAgent()) {
      console.log('Routing to agent dashboard');
      this.router.navigate(['/agent/dashboard']);
    } else if (this.authService.isCandidate()) {
      console.log('Routing to candidate dashboard');
      this.router.navigate(['/candidate/dashboard']);
    } else {
      // Fallback
      console.log('Unknown role, routing to home');
      this.router.navigate(['/']);
    }
  }
}