// src/app/pages/candidate/dashboard/candidate-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CandidateDashboardService, DashboardData, NotificationResponseDTO, DocumentResponseDTO, ApplicationStepStatus } from 'J:/java/projet springBoot/Angular_frontends/gestion-inscription-client/src/app/services/candidate.service';
import { AuthService } from '../../../../services/auth.service';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  date: Date;
  read: boolean;
}

interface ApplicationStatus {
  step: string;
  status: 'completed' | 'current' | 'pending';
  date?: Date;
  message?: string;
}

interface Document {
  name: string;
  uploaded: boolean;
  validated?: boolean;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-candidate-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink,
    HttpClientModule // Added to make HttpClient available
  ],
  template: `
    <div class="flex h-screen bg-gray-100">
      <aside class="w-64 bg-gradient-to-b from-slate-700 to-slate-800 text-white flex flex-col">
        <div class="p-6 flex items-center justify-between border-b border-slate-600">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <span class="text-white font-bold text-lg">E</span>
            </div>
            <span class="font-bold text-lg">EnrollPro</span>
          </div>
        </div>

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

        <nav class="flex-1 p-4 space-y-1">
          <a href="#" class="flex items-center space-x-3 px-4 py-3 rounded-xl bg-slate-600/50 text-white">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            <span class="text-sm font-medium">Dashboard</span>
          </a>
          <a routerLink="/candidate/enrollment" class="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-600/30 transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <span class="text-sm font-medium">Mon Inscription</span>
          </a>
          <a href="#" class="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-600/30 transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
            <span class="text-sm font-medium">Documents</span>
          </a>
          <a href="#" class="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-600/30 transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            <span class="text-sm font-medium">Notifications</span>
            @if (unreadNotifications > 0) {
              <span class="ml-auto px-2 py-1 bg-red-500 text-white text-xs rounded-full">{{ unreadNotifications }}</span>
            }
          </a>
          <a routerLink="/candidate/profile" class="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-600/30 transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span class="text-sm font-medium">Paramètres</span>
          </a>
        </nav>

        <div class="p-4">
          <a routerLink="/candidate/enrollment" class="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-200 hover:to-primary-500 transition-all flex items-center justify-center space-x-2 shadow-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            <span class="font-medium">Continuer l'inscription</span>
          </a>
          <button (click)="logout()" class="w-full py-3 px-4 rounded-2xl bg-red-50 text-red-700 hover:bg-red-100 transition-all flex items-center justify-center space-x-2 border border-red-100">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 4v16m8-4H7"/>
              </svg>
              <span class="font-medium">Déconnexion</span>
            </button>
        </div>
        
      </aside>

      <main class="flex-1 overflow-auto">
        <header class="bg-light border-b border-gray-200 px-8 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <h1 class="text-2xl font-bold text-gray-900">{{ getCurrentTime() }}</h1>
              <span class="px-2 py-1 text-xs font-semibold text-white bg-sky-400 rounded">BETA</span>
            </div>
            <div class="flex items-center space-x-4">
              <div class="relative">
                <input 
                  type="text" 
                  placeholder="Rechercher..."
                  class="pl-10 pr-4 py-2 bg-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
                />
                <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <button (click)="showNotifications = !showNotifications" class="relative p-2 hover:bg-gray-100 rounded-lg transition-all">
                <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                </svg>
                @if (unreadNotifications > 0) {
                  <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                }
              </button>
              <button class="px-6 py-2 bg-gradient-to-r from-primary-500 to-primary-700 text-white rounded-xl font-medium hover:shadow-lg transition-all">
                Aide & Support
              </button>
            </div>
          </div>
        </header>

        @if (showNotifications) {
          <div class="absolute right-8 top-20 w-96 bg-white rounded-2xl shadow-neo p-6 z-50 animate-fade-in">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-bold text-gray-800">Notifications</h3>
              <button (click)="showNotifications = false" class="text-gray-500 hover:text-gray-700">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div class="space-y-3 max-h-96 overflow-y-auto">
              @for (notification of notifications; track notification.id) {
                <div [class]="getNotificationClass(notification)" class="p-3 rounded-xl border-l-4 cursor-pointer hover:shadow-md transition-all">
                  <p class="text-sm font-medium" [class.text-gray-800]="!notification.read" [class.text-gray-600]="notification.read">
                    {{ notification.title }}
                  </p>
                  <p class="text-xs mt-1" [class.text-gray-600]="!notification.read" [class.text-gray-500]="notification.read">
                    {{ notification.message }}
                  </p>
                  <p class="text-xs text-gray-400 mt-1">{{ notification.createdAt | date:'dd/MM/yyyy HH:mm' }}</p>
                </div>
              }
            </div>
          </div>
        }

        <div class="p-8">
          <div class="mb-8">
            <div class="bg-neo-light rounded-3xl p-8 shadow-neo">
              <div class="flex items-start justify-between mb-6">
                <div>
                  <h2 class="text-3xl font-bold text-gray-900 mb-2">Suivez votre inscription</h2>
                  <p class="text-gray-600">Complétez votre dossier pour finaliser votre candidature</p>
                </div>
              </div>

              <div class="grid grid-cols-4 gap-4 mb-8">
                <div class="aspect-square rounded-3xl bg-gradient-to-br bg-neo-light shadow-neo-inset p-6 hover:shadow-xl transition-all cursor-pointer relative group">
                  <div class="flex flex-col justify-between h-full">
                    <div class="w-12 h-12 rounded-2xl bg-sky-200 flex items-center justify-center">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <div class="text-white">
                      <h3 class="font-semibold text-lg text-black/60 mb-1">Étape {{ currentStep }}/{{ totalSteps }}</h3>
                      <p class="text-sm text-black/30">En cours</p>
                    </div>
                  </div>
                </div>

                <div class="aspect-square rounded-3xl bg-gradient-to-br bg-neo-light shadow-neo-inset p-6 hover:shadow-xl transition-all cursor-pointer relative group">
                  <div class="flex flex-col justify-between h-full">
                    <div class="w-12 h-12 rounded-2xl bg-sky-200 flex items-center justify-center">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                      </svg>
                    </div>
                    <div class="text-white">
                      <h3 class="font-semibold text-lg text-black/60 mb-1">{{ getCompletionPercentage() }}%</h3>
                      <p class="text-sm text-black/30">Complétude</p>
                    </div>
                  </div>
                </div>

                <div class="aspect-square rounded-3xl bg-gradient-to-br bg-neo-light shadow-neo-inset p-6 hover:shadow-xl transition-all cursor-pointer relative group">
                  <div class="flex flex-col justify-between h-full">
                    <div class="w-12 h-12 rounded-2xl bg-sky-200 flex items-center justify-center">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <div class="text-white">
                      <h3 class="font-semibold text-lg text-black/60 mb-1">{{ getUploadedDocs() }}/{{ requiredDocuments.length }}</h3>
                      <p class="text-sm text-black/30">Documents</p>
                    </div>
                  </div>
                </div>

                <div class="aspect-square rounded-3xl bg-gradient-to-br bg-neo-light shadow-neo-inset p-6 hover:shadow-xl transition-all cursor-pointer relative group overflow-hidden">
                  <div class="absolute inset-0 bg-gradient-to-br from-yellow-500 via-transparent to-transparent opacity-70"></div>
                  <div class="relative z-10 flex flex-col justify-between h-full">
                    <div class="w-12 h-12 rounded-2xl bg-sky-200 flex items-center justify-center backdrop-blur-sm">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <div class="text-white">
                      <h3 class="font-semibold text-lg text-black/60 mb-1">{{ currentStatusMessage }}</h3>
                      <p class="text-sm text-black/30">Statut</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <div class="bg-neo-light rounded-3xl p-8 shadow-sm">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-bold text-gray-900">État de votre dossier</h3>
                <button class="p-2 hover:bg-gray-100 rounded-lg">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                  </svg>
                </button>
              </div>

              <div class="space-y-6">
                @for (status of applicationStatuses; track status.step) {
                  <div class="flex items-start space-x-4">
                    <div class="flex-shrink-0">
                      <div [class]="getStatusIconClass(status.status)" class="w-10 h-10 rounded-full flex items-center justify-center shadow-sm">
                        @if (status.status === 'completed') {
                          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                          </svg>
                        } @else if (status.status === 'current') {
                          <div class="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                        } @else {
                          <div class="w-3 h-3 bg-gray-400 rounded-full"></div>
                        }
                      </div>
                    </div>
                    <div class="flex-1">
                      <h4 class="font-semibold" [class.text-gray-800]="status.status !== 'pending'" [class.text-gray-500]="status.status === 'pending'">
                        {{ status.step }}
                      </h4>
                      @if (status.message) {
                        <p class="text-sm text-gray-600 mt-1">{{ status.message }}</p>
                      }
                      @if (status.date) {
                        <p class="text-xs text-gray-500 mt-1">{{ status.date | date:'dd/MM/yyyy HH:mm' }}</p>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>

            <div class="bg-neo-light rounded-3xl p-8 shadow-sm">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-bold text-gray-900">Documents requis</h3>
                <button class="p-2 hover:bg-gray-100 rounded-lg">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                  </svg>
                </button>
              </div>

              <div class="space-y-3">
                @for (doc of requiredDocuments; track doc.id) {
                  <div class="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer group">
                    <div class="flex items-center space-x-4 flex-1">
                      <div [class]="getDocumentColorClass(doc.name)" class="w-12 h-12 rounded-xl flex items-center justify-center">
                        <span class="text-2xl">{{ getDocumentIcon(doc.name) }}</span>
                      </div>
                      <div class="flex-1">
                        <h4 class="font-medium text-gray-900">{{ doc.name }}</h4>
                        @if (isUploaded(doc)) {
                          <p class="text-sm" [class.text-green-600]="doc.validationStatus === 'VALIDATED'" [class.text-yellow-600]="doc.validationStatus === 'PENDING'">
                            {{ doc.validationStatus === 'VALIDATED' ? '✓ Validé' : (doc.validationStatus === 'REJECTED' ? '❌ Rejeté' : '⏳ En attente de validation') }}
                          </p>
                        } @else {
                          <p class="text-sm text-red-600">❌ Non téléchargé</p>
                        }
                      </div>
                    </div>
                    @if (isUploaded(doc)) {
                      <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    } @else {
                      <button class="px-4 py-2 bg-primary-50 hover:bg-primary-100 text-primary-600 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-all">
                        Upload
                      </button>
                    }
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `
})
export class CandidateDashboardComponent implements OnInit {
  // Data properties initialized to safe defaults
  candidateName: string = '';
  currentStep: number = 0;
  totalSteps: number = 0;
  currentStatusMessage: string = 'Chargement...';

  notifications: NotificationResponseDTO[] = [];
  applicationStatuses: ApplicationStepStatus[] = [];
  requiredDocuments: DocumentResponseDTO[] = [];

  showNotifications = false;
  unreadNotifications = 0;

  // Static list of expected documents (for displaying ALL required documents, even if not uploaded)
  // This is a necessary piece of client-side data if the backend only returns *uploaded* documents.
  // Assuming the required document names are:
  private ALL_REQUIRED_DOCUMENT_NAMES = [
    'Diplôme de Baccalauréat',
    'Pièce d\'identité',
    'Acte de naissance',
    'Photo d\'identité',
    'Certificat de résidence'
  ];


  constructor(private dashboardService: CandidateDashboardService, private authService: AuthService, private router: Router) {} // Inject the service

  ngOnInit() {
    this.dashboardService.getDashboardData().subscribe({
      next: (data: DashboardData) => {
        this.candidateName = data.applicantName;
        this.currentStep = data.currentStep;
        this.totalSteps = data.totalSteps;
        this.notifications = data.recentNotifications;
        this.applicationStatuses = data.applicationStatuses;
        
        this.unreadNotifications = this.notifications.filter(n => !n.read).length;
        
        // Determine the current status message
        const currentStatus = this.applicationStatuses.find(s => s.status === 'current');
        this.currentStatusMessage = currentStatus ? currentStatus.step : 'En révision';

        // Merge fetched documents with required document list for display
        this.requiredDocuments = this.mapDocumentsForDisplay(data.documentsStatus);
      },
      error: (err) => {
        console.error('Failed to load dashboard data', err);
        this.candidateName = 'Erreur de Chargement';
        this.currentStatusMessage = 'Erreur de Connexion';
      }
    });
  }

  /**
   * Helper function to map fetched documents to a list that includes all required documents.
   * This is necessary if the backend only returns *uploaded* documents.
   */
  mapDocumentsForDisplay(uploadedDocs: DocumentResponseDTO[]): DocumentResponseDTO[] {
    const docMap = new Map(uploadedDocs.map(doc => [doc.name, doc]));
    
    // Create a list of all required documents, filling in data from the fetched documents if available.
    return this.ALL_REQUIRED_DOCUMENT_NAMES.map(requiredName => {
      const fetchedDoc = docMap.get(requiredName);
      if (fetchedDoc) {
        return fetchedDoc; // Document uploaded, use fetched status
      } else {
        // Document not uploaded, return a placeholder DTO with default status
        return { 
          id: '', // Empty ID as it doesn't exist yet
          name: requiredName, 
          fileType: '', 
          validationStatus: 'NOT_UPLOADED' as any // Using a temporary status for the frontend logic
        } as DocumentResponseDTO; 
      }
    });
  }


  getInitials(): string {
    return this.candidateName.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  getCurrentTime(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bon matin';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonne soirée';
  }

  getNotificationClass(notification: NotificationResponseDTO): string {
    const baseClass = 'border-l-4';
    // Mapping backend type (uppercase) to Tailwind classes
    const typeClasses: any = {
      'INFO': 'bg-blue-50 border-blue-500',
      'SUCCESS': 'bg-green-50 border-green-500',
      'WARNING': 'bg-yellow-50 border-yellow-500',
      'ERROR': 'bg-red-50 border-red-500'
    };
    return `${baseClass} ${typeClasses[notification.type] || 'bg-gray-50 border-gray-500'}`;
  }

  getStatusIconClass(status: string): string {
    const classes: any = {
      'completed': 'bg-gradient-to-r from-green-500 to-green-700',
      'current': 'bg-gradient-to-r from-primary-500 to-primary-700',
      'pending': 'bg-gray-300'
    };
    return classes[status] || 'bg-gray-300';
  }

  getCompletionPercentage(): number {
    if (this.applicationStatuses.length === 0) return 0;
    const completed = this.applicationStatuses.filter(s => s.status === 'completed').length;
    return Math.round((completed / this.applicationStatuses.length) * 100);
  }

  getUploadedDocs(): number {
    // Counts how many documents have an ID (i.e., were fetched from the API)
    return this.requiredDocuments.filter(d => d.id !== '').length; 
  }

  isUploaded(doc: DocumentResponseDTO): boolean {
    return doc.id !== ''; // Check if the document has a backend ID
  }

  // --- Document Presentation Helpers (Placeholder logic based on document name) ---

  getDocumentIcon(name: string): string {
    switch (name) {
      case 'Diplôme de Baccalauréat': return '📄';
      case 'Pièce d\'identité': return '🆔';
      case 'Acte de naissance': return '📋';
      case 'Photo d\'identité': return '📸';
      case 'Certificat de résidence': return '🏠';
      default: return '❓';
    }
  }

  getDocumentColorClass(name: string): string {
    switch (name) {
      case 'Diplôme de Baccalauréat': return 'bg-emerald-100 text-emerald-700';
      case 'Pièce d\'identité': return 'bg-indigo-100 text-indigo-700';
      case 'Acte de naissance': return 'bg-rose-100 text-rose-700';
      case 'Photo d\'identité': return 'bg-purple-100 text-purple-700';
      case 'Certificat de résidence': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}