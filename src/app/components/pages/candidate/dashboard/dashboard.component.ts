// src/app/pages/candidate/dashboard/candidate-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CandidateService, DashboardData } from '../../../../services/candidate.service';

@Component({
  selector: 'app-candidate-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="flex flex-col lg:flex-row h-screen bg-gradient-to-br from-neo-light via-gray-100 to-neo-light">
      <!-- Mobile Header -->
      <header class="lg:hidden bg-white shadow-neo-sm sticky top-0 z-20">
        <div class="px-4 py-3 flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <button (click)="toggleMobileSidebar()" class="p-2 rounded-lg hover:bg-gray-100">
              <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <span class="text-white font-bold text-sm">E</span>
              </div>
              <span class="font-bold text-lg text-gray-800">EnrollPro</span>
            </div>
          </div>
          <button routerLink="/candidate/notifications" class="relative p-2 hover:bg-gray-100 rounded-lg">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            @if (unreadNotifications > 0) {
              <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            }
          </button>
        </div>
      </header>

      <!-- Sidebar Overlay (Mobile) -->
      @if (isMobileSidebarOpen) {
        <div class="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" (click)="closeMobileSidebar()"></div>
      }

      <!-- Sidebar -->
      <aside [class.translate-x-0]="isMobileSidebarOpen" 
             class="fixed lg:relative inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-slate-700 to-slate-800 text-white flex flex-col transform -translate-x-full lg:translate-x-0 transition-transform duration-300">
        <!-- Desktop Logo -->
        <div class="hidden lg:flex p-6 items-center justify-between border-b border-slate-600">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <span class="text-white font-bold text-lg">E</span>
            </div>
            <span class="font-bold text-lg">EnrollPro</span>
          </div>
        </div>

        <!-- Mobile Close Button -->
        <div class="lg:hidden flex justify-end p-4">
          <button (click)="closeMobileSidebar()" class="p-2 hover:bg-slate-600 rounded-lg">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- User Profile -->
        <div class="p-6 flex flex-col items-center border-b border-slate-600">
          <div class="relative mb-3">
            <div class="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
              <span class="text-white text-xl font-bold">{{ getInitials() }}</span>
            </div>
            <div class="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-700"></div>
          </div>
          <h3 class="font-semibold text-white">{{ candidateName }}</h3>
          <p class="text-xs text-slate-400">Candidat</p>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
          <a routerLink="/candidate/dashboard" class="flex items-center space-x-3 px-4 py-3 rounded-xl bg-slate-600/50 text-white" (click)="closeMobileSidebar()">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            <span class="text-sm font-medium">Dashboard</span>
          </a>
          <a routerLink="/candidate/enrollment" class="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-600/30 transition-all" (click)="closeMobileSidebar()">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <span class="text-sm font-medium">Mon Inscription</span>
          </a>
          <a routerLink="/candidate/documents" class="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-600/30 transition-all" (click)="closeMobileSidebar()">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
            <span class="text-sm font-medium">Documents</span>
          </a>
          <a routerLink="/candidate/notifications" class="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-600/30 transition-all" (click)="closeMobileSidebar()">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            <span class="text-sm font-medium">Notifications</span>
            @if (unreadNotifications > 0) {
              <span class="ml-auto px-2 py-1 bg-red-500 text-white text-xs rounded-full">{{ unreadNotifications }}</span>
            }
          </a>
        </nav>

        <!-- Action Buttons -->
        <div class="p-4 space-y-2">
          <a routerLink="/candidate/enrollment" class="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 transition-all flex items-center justify-center space-x-2 shadow-lg" (click)="closeMobileSidebar()">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            <span class="font-medium">Continuer l'inscription</span>
          </a>
          <button (click)="logout()" class="w-full py-3 px-4 rounded-2xl bg-red-50 text-red-700 hover:bg-red-100 transition-all flex items-center justify-center space-x-2 border border-red-100">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            <span class="font-medium">Déconnexion</span>
          </button>
        </div>
      </aside>

      <!-- Main Content - SCROLLABLE -->
      <main class="flex-1 overflow-y-auto">
        <div class="p-4 sm:p-6 lg:p-8">
          <!-- Desktop Header -->
          <div class="hidden lg:block mb-6">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-2xl lg:text-3xl font-bold text-gray-800">{{ getCurrentTime() }}</h1>
                <p class="text-sm text-gray-600 mt-1">Bienvenue, {{ candidateName }}</p>
              </div>
              <button routerLink="/candidate/notifications" class="relative p-3 hover:bg-gray-100 rounded-xl transition-all">
                <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                </svg>
                @if (unreadNotifications > 0) {
                  <span class="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">{{ unreadNotifications }}</span>
                }
              </button>
            </div>
          </div>

          <!-- Loading State -->
          @if (loading) {
            <div class="flex items-center justify-center py-12">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          }

          <!-- Error State -->
          @if (error && !loading) {
            <div class="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
              <svg class="w-12 h-12 mx-auto text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p class="text-red-700 mb-4">{{ error }}</p>
              <button (click)="loadDashboard()" class="px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all">
                Réessayer
              </button>
            </div>
          }

          <!-- Content -->
          @if (!loading && !error && dashboardData) {
            
            <!-- New User - No Application -->
            @if (!dashboardData.hasApplication) {
              <div class="max-w-4xl mx-auto">
                <!-- Welcome Card -->
                <div class="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl shadow-neo p-8 mb-6">
                  <div class="text-center">
                    <div class="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                    </div>
                    
                    <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                      Bienvenue, {{ candidateName }}! 👋
                    </h1>
                    
                    <p class="text-gray-600 mb-6 max-w-2xl mx-auto">
                      Vous êtes maintenant connecté à votre espace candidat. Pour commencer votre candidature, 
                      cliquez sur le bouton ci-dessous pour accéder au formulaire d'inscription.
                    </p>
                    
                    <button 
                      routerLink="/candidate/enrollment"
                      class="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all inline-flex items-center"
                    >
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                      Commencer mon inscription
                    </button>
                  </div>
                </div>
                
                <!-- Process Steps -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div class="bg-white rounded-xl shadow-neo p-6">
                    <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                    </div>
                    <h3 class="font-semibold text-gray-800 mb-2">1. Informations</h3>
                    <p class="text-sm text-gray-600">Remplissez vos informations personnelles et académiques</p>
                  </div>
                  
                  <div class="bg-white rounded-xl shadow-neo p-6">
                    <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                      <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                      </svg>
                    </div>
                    <h3 class="font-semibold text-gray-800 mb-2">2. Documents</h3>
                    <p class="text-sm text-gray-600">Téléchargez vos pièces justificatives requises</p>
                  </div>
                  
                  <div class="bg-white rounded-xl shadow-neo p-6">
                    <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                      <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <h3 class="font-semibold text-gray-800 mb-2">3. Validation</h3>
                    <p class="text-sm text-gray-600">Soumettez et suivez votre candidature</p>
                  </div>
                </div>
                
                <!-- Help Section -->
                <div class="bg-blue-50 border border-blue-100 rounded-xl p-6">
                  <div class="flex items-start space-x-4">
                    <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 class="font-semibold text-gray-800 mb-2">Informations importantes</h3>
                      <p class="text-sm text-gray-600 mb-2">
                        Le processus d'inscription prend environ 15-20 minutes. Assurez-vous d'avoir les documents suivants :
                      </p>
                      <ul class="text-sm text-gray-600 list-disc list-inside space-y-1">
                        <li>Copie de votre pièce d'identité (recto-verso)</li>
                        <li>Certificat de naissance</li>
                        <li>Relevé de notes (BAC ou équivalent)</li>
                        <li>Photo d'identité récente</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            }
            
            <!-- Existing User - Has Application -->
            @if (dashboardData.hasApplication && dashboardData.application) {
            <!-- Stats Cards -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
              <div class="bg-neo-light rounded-2xl shadow-neo p-4 sm:p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-xs sm:text-sm text-gray-600">Statut</p>
                    <p class="text-sm sm:text-base font-bold text-primary-600">{{ getStatusLabel(dashboardData.application.status) }}</p>
                  </div>
                  <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div class="bg-neo-light rounded-2xl shadow-neo p-4 sm:p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-xs sm:text-sm text-gray-600">Progression</p>
                    <p class="text-xl sm:text-2xl font-bold text-gray-800">{{ dashboardData.application.completionRate }}%</p>
                  </div>
                  <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div class="bg-neo-light rounded-2xl shadow-neo p-4 sm:p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-xs sm:text-sm text-gray-600">Documents</p>
                    <p class="text-xl sm:text-2xl font-bold text-gray-800">{{ dashboardData.application.documentsStatus.length }}</p>
                  </div>
                  <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div class="bg-neo-light rounded-2xl shadow-neo p-4 sm:p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-xs sm:text-sm text-gray-600">Notifications</p>
                    <p class="text-xl sm:text-2xl font-bold text-gray-800">{{ unreadNotifications }}</p>
                  </div>
                  <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Two Column Layout -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <!-- Application Status -->
              <div class="bg-neo-light rounded-2xl sm:rounded-3xl shadow-neo p-4 sm:p-6">
                <div class="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 class="text-lg sm:text-xl font-bold text-gray-800">Statut de la candidature</h2>
                  <span [class]="getStatusBadgeClass(dashboardData.application.status)" class="px-3 py-1 rounded-full text-xs font-medium">
                    {{ getStatusLabel(dashboardData.application.status) }}
                  </span>
                </div>
                
                <div class="space-y-3 sm:space-y-4">
                  <div class="flex items-start space-x-3">
                    <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="text-sm font-medium text-gray-800">Dossier soumis</p>
                      <p class="text-xs text-gray-500">{{ dashboardData.application.submissionDate | date:'dd/MM/yyyy HH:mm' }}</p>
                    </div>
                  </div>

                  <div class="flex items-start space-x-3">
                    <div [class]="dashboardData.application.completionRate >= 50 ? 'bg-green-100' : 'bg-gray-100'" class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg class="w-4 h-4" [class.text-green-600]="dashboardData.application.completionRate >= 50" [class.text-gray-400]="dashboardData.application.completionRate < 50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="text-sm font-medium text-gray-800">En cours de validation</p>
                      <p class="text-xs text-gray-500">Votre dossier est en cours d'examen</p>
                    </div>
                  </div>

                  <div class="flex items-start space-x-3">
                    <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="text-sm font-medium text-gray-800">Décision finale</p>
                      <p class="text-xs text-gray-500">En attente</p>
                    </div>
                  </div>
                </div>

                <div class="mt-4 pt-4 border-t border-gray-200">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-600">Progression globale</span>
                    <span class="font-semibold text-gray-800">{{ dashboardData.application.completionRate }}%</span>
                  </div>
                  <div class="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-gradient-to-r from-primary-500 to-primary-700 h-2 rounded-full transition-all" [style.width.%]="dashboardData.application.completionRate"></div>
                  </div>
                </div>
              </div>

              <!-- Documents Status -->
              <div class="bg-neo-light rounded-2xl sm:rounded-3xl shadow-neo p-4 sm:p-6">
                <div class="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 class="text-lg sm:text-xl font-bold text-gray-800">Documents</h2>
                  <a routerLink="/candidate/documents" class="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    Voir tout →
                  </a>
                </div>
                
                <div class="space-y-2 sm:space-y-3">
                  @for (doc of dashboardData.application.documentsStatus.slice(0, 5); track doc.id) {
                    <div class="flex items-center justify-between p-3 bg-white rounded-xl hover:shadow-md transition-all">
                      <div class="flex items-center space-x-3">
                        <div class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                          <span class="text-lg">{{ getDocumentIcon(doc.fileType) }}</span>
                        </div>
                        <div>
                          <p class="text-sm font-medium text-gray-800 truncate max-w-[150px] sm:max-w-none">{{ doc.name }}</p>
                          <p class="text-xs text-gray-500">{{ doc.fileType }}</p>
                        </div>
                      </div>
                      <span [class]="getDocumentStatusClass(doc.validationStatus)" class="px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap">
                        {{ getDocumentStatusLabel(doc.validationStatus) }}
                      </span>
                    </div>
                  } @empty {
                    <div class="text-center py-8">
                      <svg class="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                      <p class="text-sm text-gray-600">Aucun document téléchargé</p>
                    </div>
                  }
                </div>

                @if (dashboardData.application.documentsStatus.length > 0) {
                  <div class="mt-4 pt-4 border-t border-gray-200">
                    <a routerLink="/candidate/enrollment" class="w-full py-2 px-4 bg-primary-50 text-primary-600 rounded-xl text-sm font-medium hover:bg-primary-100 transition-all flex items-center justify-center space-x-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                      </svg>
                      <span>Ajouter un document</span>
                    </a>
                  </div>
                }
              </div>
            </div>

            <!-- Recent Notifications -->
            <div class="mt-4 sm:mt-6 bg-neo-light rounded-2xl sm:rounded-3xl shadow-neo p-4 sm:p-6">
              <div class="flex items-center justify-between mb-4 sm:mb-6">
                <h2 class="text-lg sm:text-xl font-bold text-gray-800">Notifications récentes</h2>
                <a routerLink="/candidate/notifications" class="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Voir tout →
                </a>
              </div>
              
              <div class="space-y-2 sm:space-y-3">
                @for (notif of dashboardData.application.recentNotifications.slice(0, 3); track notif.notificationId) {
                  <div [class.bg-primary-50]="!notif.isRead" [class.bg-white]="notif.isRead" class="p-3 sm:p-4 rounded-xl hover:shadow-md transition-all border-l-4" [class.border-primary-500]="!notif.isRead" [class.border-gray-200]="notif.isRead">
                    <div class="flex items-start justify-between gap-3">
                      <div class="flex items-start space-x-3 flex-1">
                        <div class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <span class="text-lg">{{ getNotificationIcon(notif.type) }}</span>
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="text-sm font-medium text-gray-800">{{ notif.message }}</p>
                          <p class="text-xs text-gray-500 mt-1">{{ getTimeAgo(notif.timestamp) }}</p>
                        </div>
                      </div>
                      @if (!notif.isRead) {
                        <span class="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-2"></span>
                      }
                    </div>
                  </div>
                } @empty {
                  <div class="text-center py-8">
                    <svg class="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                    </svg>
                    <p class="text-sm text-gray-600">Aucune notification</p>
                  </div>
                }
              </div>
            </div>
            } <!-- End of hasApplication condition -->
          }
        </div>
      </main>
    </div>
  `
})
export class CandidateDashboardComponent implements OnInit {
  isMobileSidebarOpen = false;
  candidateName = 'Utilisateur';
  unreadNotifications = 0;
  dashboardData?: DashboardData;
  loading = false;
  error: string | null = null;

  constructor(
    private candidateService: CandidateService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.loading = true;
    this.error = null;
    
    this.candidateService.getDashboardData().subscribe({
      next: (data) => {
        this.dashboardData = data;
        
        // Handle cases with or without application
        if (data.hasApplication && data.application) {
          // User has an application - show their name and notifications
          this.candidateName = data.application.applicantName;
          this.unreadNotifications = data.application.recentNotifications?.filter(n => !n.isRead).length || 0;
        } else {
          // New user without application - use a default name
          this.candidateName = 'Candidat';
          this.unreadNotifications = 0;
        }
        
        this.loading = false;
        console.log('Dashboard loaded successfully:', data);
      },
      error: (err) => {
        console.error('Failed to load dashboard', err);
        this.error = 'Impossible de charger le tableau de bord. Veuillez réessayer.';
        this.loading = false;
      }
    });
  }

  toggleMobileSidebar() {
    this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
  }

  closeMobileSidebar() {
    this.isMobileSidebarOpen = false;
  }

  getCurrentTime(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  }

  getInitials(): string {
    if (!this.candidateName) return 'U';
    const names = this.candidateName.split(' ');
    return names.length > 1 
      ? names[0][0] + names[1][0]
      : names[0][0];
  }

  getStatusLabel(status: string): string {
    return this.candidateService.getStatusLabel(status);
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'PRE_VALIDATION': return 'bg-blue-100 text-blue-700';
      case 'MANUAL_REVIEW': return 'bg-yellow-100 text-yellow-700';
      case 'REJECTED': return 'bg-red-100 text-red-700';
      case 'PENDING_RECOURSE': return 'bg-orange-100 text-orange-700';
      case 'APPROVED': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  getDocumentIcon(fileType: string): string {
    switch (fileType?.toLowerCase()) {
      case 'pdf': return '📄';
      case 'jpg':
      case 'jpeg':
      case 'png': return '🖼️';
      default: return '📋';
    }
  }

  getDocumentStatusClass(status: string): string {
    switch (status) {
      case 'VALIDATED': return 'bg-green-100 text-green-700';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'REJECTED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  getDocumentStatusLabel(status: string): string {
    return this.candidateService.getValidationStatusLabel(status);
  }

  getNotificationIcon(type: string): string {
    return this.candidateService.getNotificationTypeIcon(type);
  }

  getTimeAgo(timestamp: string): string {
    const date = new Date(timestamp);
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'À l\'instant';
    if (seconds < 3600) return `Il y a ${Math.floor(seconds / 60)} min`;
    if (seconds < 86400) return `Il y a ${Math.floor(seconds / 3600)} h`;
    if (seconds < 604800) return `Il y a ${Math.floor(seconds / 86400)} j`;
    
    return date.toLocaleDateString('fr-FR');
  }

  logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter?')) {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }
  }
}