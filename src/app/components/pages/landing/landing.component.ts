// src/app/pages/landing/landing.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-neo-light via-gray-100 to-neo-light overflow-hidden">
      <!-- Navigation -->
      <nav class="container mx-auto px-6 py-8 flex justify-between items-center">
        <div class="flex items-center space-x-2">
          <div class="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-primary-700 shadow-neo flex items-center justify-center">
            <span class="text-white font-bold text-xl">D</span>
          </div>
          <span class="text-2xl font-bold text-gray-800">DynamicEnroll</span>
        </div>
        <div class="flex space-x-4">
          <a routerLink="/auth/login" class="px-6 py-3 rounded-2xl bg-neo-light shadow-neo hover:shadow-neo-inset transition-all duration-300 text-gray-700 font-medium">
            Connexion
          </a>
          <a routerLink="/auth/register" class="px-6 py-3 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-700 text-white font-medium shadow-neo hover:shadow-lg transition-all duration-300">
            S'inscrire
          </a>
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="container mx-auto px-6 py-20">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div class="space-y-8 animate-fade-in">
            <h1 class="text-5xl md:text-6xl font-bold text-gray-800 leading-tight">
              Simplifiez vos
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700">
                inscriptions
              </span>
            </h1>
            <p class="text-xl text-gray-600 leading-relaxed">
              Une plateforme moderne pour gérer vos inscriptions académiques en toute simplicité. 
              Processus automatisé, sécurisé et intuitif.
            </p>
            <div class="flex space-x-4">
        <button (click)="startInscription()" class="px-8 py-4 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-700 text-white font-semibold shadow-neo hover:shadow-lg transition-all duration-300 transform hover:scale-105">
          Commencer l'inscription
        </button>
              <button class="px-8 py-4 rounded-2xl bg-neo-light shadow-neo hover:shadow-neo-inset transition-all duration-300 text-gray-700 font-semibold">
                En savoir plus
              </button>
            </div>
          </div>
          
          <div class="relative animate-slide-up">
            <div class="relative z-10 w-full h-96 rounded-3xl bg-neo-light shadow-neo p-8 flex items-center justify-center">
              <div class="w-48 h-48 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 shadow-neo flex items-center justify-center">
                <svg class="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
            </div>
            <!-- Floating elements -->
            <div class="absolute -top-4 -right-4 w-32 h-32 rounded-full bg-primary-100 animate-pulse-slow"></div>
            <div class="absolute -bottom-4 -left-4 w-24 h-24 rounded-full bg-primary-200 animate-pulse-slow" style="animation-delay: 1s;"></div>
          </div>
        </div>
      </section>

      <!-- Features -->
      <section class="container mx-auto px-6 py-20">
        <h2 class="text-4xl font-bold text-center text-gray-800 mb-16">Fonctionnalités clés</h2>
        <div class="grid md:grid-cols-3 gap-8">
          @for (feature of features; track feature.title) {
            <div class="p-8 rounded-3xl bg-neo-light shadow-neo hover:shadow-neo-inset transition-all duration-300 transform hover:scale-105">
              <div class="w-16 h-16 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-700 shadow-neo-sm flex items-center justify-center mb-6">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="feature.icon"/>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-800 mb-3">{{ feature.title }}</h3>
              <p class="text-gray-600">{{ feature.description }}</p>
            </div>
          }
        </div>
      </section>

      <!-- Stats -->
      <section class="container mx-auto px-6 py-20">
        <div class="grid md:grid-cols-4 gap-8">
          @for (stat of stats; track stat.label) {
            <div class="text-center p-8 rounded-3xl bg-neo-light shadow-neo">
              <div class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700 mb-2">
                {{ stat.value }}
              </div>
              <div class="text-gray-600 font-medium">{{ stat.label }}</div>
            </div>
          }
        </div>
      </section>

      <!-- Footer -->
      <footer class="bg-gray-800 text-white py-12 mt-20">
        <div class="container mx-auto px-6">
          <div class="grid md:grid-cols-4 gap-8">
            <div>
              <h4 class="text-lg font-bold mb-4">DynamicEnroll</h4>
              <p class="text-gray-400">Plateforme d'inscription en ligne sécurisée et moderne</p>
            </div>
            <div>
              <h4 class="text-lg font-bold mb-4">Liens rapides</h4>
              <ul class="space-y-2 text-gray-400">
                <li><a href="#" class="hover:text-white transition-colors">Accueil</a></li>
                <li><a href="#" class="hover:text-white transition-colors">À propos</a></li>
                <li><a href="#" class="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 class="text-lg font-bold mb-4">Support</h4>
              <ul class="space-y-2 text-gray-400">
                <li><a href="#" class="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" class="hover:text-white transition-colors">Guide</a></li>
                <li><a href="#" class="hover:text-white transition-colors">Aide</a></li>
              </ul>
            </div>
            <div>
              <h4 class="text-lg font-bold mb-4">Contact</h4>
              <ul class="space-y-2 text-gray-400">
                <li>📧 contact&#64;dynamicenroll.com</li>
                <li>📱 +237 XXX XXX XXX</li>
              </ul>
            </div>
          </div>
          <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 DynamicEnroll. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  `
})
export class LandingComponent {
  constructor(private authService: AuthService, private router: Router) {}

  startInscription() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/candidate/enrollment']);
    } else {
      this.router.navigate(['/auth/register']);
    }
  }

  features = [
    {
      title: 'Inscription en 5 étapes',
      description: 'Processus guidé et intuitif avec sauvegarde automatique',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
    },
    {
      title: 'Validation automatique',
      description: 'Vérification instantanée de vos documents',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    {
      title: 'Suivi en temps réel',
      description: 'Notifications et alertes à chaque étape',
      icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
    },
  ];

  stats = [
    { value: '5000+', label: 'Inscriptions' },
    { value: '98%', label: 'Satisfaction' },
    { value: '24/7', label: 'Support' },
    { value: '100%', label: 'Sécurisé' },
  ];
}
