// src/app/pages/candidate/documents/documents.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CandidateService, DocumentResponseDTO } from '../../../../services/candidate.service';

@Component({
  selector: 'app-candidate-documents',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="flex flex-col lg:flex-row h-screen bg-gradient-to-br from-neo-light via-gray-100 to-neo-light">
      <!-- Mobile Header -->
      <header class="lg:hidden bg-white shadow-neo-sm sticky top-0 z-20">
        <div class="px-4 py-3 flex items-center justify-between">
          <button routerLink="/candidate/dashboard" class="p-2 rounded-lg hover:bg-gray-100">
            <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 class="text-lg font-bold text-gray-800">Mes Documents</h1>
          <div class="w-10"></div>
        </div>
      </header>

      <!-- Mobile Sidebar Toggle -->
      <button 
        (click)="toggleMobileSidebar()"
        class="lg:hidden fixed bottom-6 right-6 z-30 w-14 h-14 bg-gradient-to-r from-primary-500 to-primary-700 text-white rounded-full shadow-lg flex items-center justify-center"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>

      <!-- Sidebar Overlay (Mobile) -->
      @if (isMobileSidebarOpen) {
        <div class="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" (click)="closeMobileSidebar()"></div>
      }

      <!-- Sidebar -->
      <aside [class.translate-x-0]="isMobileSidebarOpen" 
             class="fixed lg:relative inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-slate-700 to-slate-800 text-white flex flex-col transform -translate-x-full lg:translate-x-0 transition-transform duration-300">
        <div class="p-6 flex items-center justify-between border-b border-slate-600">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <span class="text-white font-bold text-lg">E</span>
            </div>
            <span class="font-bold text-lg">EnrollPro</span>
          </div>
          <button (click)="closeMobileSidebar()" class="lg:hidden p-1 hover:bg-slate-600 rounded">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
          <a routerLink="/candidate/dashboard" class="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-600/30 transition-all" (click)="closeMobileSidebar()">
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
          <a routerLink="/candidate/documents" class="flex items-center space-x-3 px-4 py-3 rounded-xl bg-slate-600/50 text-white" (click)="closeMobileSidebar()">
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
          </a>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-auto">
        <div class="p-4 sm:p-6 lg:p-8">
          <!-- Desktop Header -->
          <div class="hidden lg:flex items-center justify-between mb-6">
            <div>
              <h1 class="text-2xl lg:text-3xl font-bold text-gray-800">Mes Documents</h1>
              <p class="text-sm text-gray-600 mt-1">Gérez et consultez tous vos documents d'inscription</p>
            </div>
            <button routerLink="/candidate/enrollment" class="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-700 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center space-x-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              <span class="hidden sm:inline">Ajouter un document</span>
            </button>
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
              <button (click)="loadDocuments()" class="px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all">
                Réessayer
              </button>
            </div>
          }

          <!-- Content -->
          @if (!loading && !error) {
            <!-- Stats Cards -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
              <div class="bg-neo-light rounded-2xl shadow-neo p-4 sm:p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-xs sm:text-sm text-gray-600">Total</p>
                    <p class="text-xl sm:text-2xl font-bold text-gray-800">{{ getTotalDocuments() }}</p>
                  </div>
                  <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div class="bg-neo-light rounded-2xl shadow-neo p-4 sm:p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-xs sm:text-sm text-gray-600">Validés</p>
                    <p class="text-xl sm:text-2xl font-bold text-green-600">{{ getValidatedCount() }}</p>
                  </div>
                  <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div class="bg-neo-light rounded-2xl shadow-neo p-4 sm:p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-xs sm:text-sm text-gray-600">En attente</p>
                    <p class="text-xl sm:text-2xl font-bold text-yellow-600">{{ getPendingCount() }}</p>
                  </div>
                  <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div class="bg-neo-light rounded-2xl shadow-neo p-4 sm:p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-xs sm:text-sm text-gray-600">Rejetés</p>
                    <p class="text-xl sm:text-2xl font-bold text-red-600">{{ getRejectedCount() }}</p>
                  </div>
                  <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-red-100 flex items-center justify-center">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Filter Tabs -->
            <div class="mb-6">
              <div class="flex flex-wrap gap-2">
                <button 
                  (click)="filterDocuments('ALL')"
                  [class.bg-primary-500]="currentFilter === 'ALL'"
                  [class.text-white]="currentFilter === 'ALL'"
                  [class.bg-white]="currentFilter !== 'ALL'"
                  [class.text-gray-700]="currentFilter !== 'ALL'"
                  class="px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-neo-sm hover:shadow-neo"
                >
                  Tous ({{ documents.length }})
                </button>
                <button 
                  (click)="filterDocuments('VALIDATED')"
                  [class.bg-green-500]="currentFilter === 'VALIDATED'"
                  [class.text-white]="currentFilter === 'VALIDATED'"
                  [class.bg-white]="currentFilter !== 'VALIDATED'"
                  [class.text-gray-700]="currentFilter !== 'VALIDATED'"
                  class="px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-neo-sm hover:shadow-neo"
                >
                  Validés ({{ getValidatedCount() }})
                </button>
                <button 
                  (click)="filterDocuments('PENDING')"
                  [class.bg-yellow-500]="currentFilter === 'PENDING'"
                  [class.text-white]="currentFilter === 'PENDING'"
                  [class.bg-white]="currentFilter !== 'PENDING'"
                  [class.text-gray-700]="currentFilter !== 'PENDING'"
                  class="px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-neo-sm hover:shadow-neo"
                >
                  En attente ({{ getPendingCount() }})
                </button>
                <button 
                  (click)="filterDocuments('REJECTED')"
                  [class.bg-red-500]="currentFilter === 'REJECTED'"
                  [class.text-white]="currentFilter === 'REJECTED'"
                  [class.bg-white]="currentFilter !== 'REJECTED'"
                  [class.text-gray-700]="currentFilter !== 'REJECTED'"
                  class="px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-neo-sm hover:shadow-neo"
                >
                  Rejetés ({{ getRejectedCount() }})
                </button>
              </div>
            </div>

            <!-- Documents List -->
            <div class="space-y-3 sm:space-y-4">
              @for (doc of getFilteredDocuments(); track doc.id) {
                <div class="bg-neo-light rounded-2xl shadow-neo p-4 sm:p-6 hover:shadow-neo-lg transition-all">
                  <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div class="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
                      <div [class]="getDocumentIconClass(doc.fileType)" class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span class="text-xl sm:text-2xl">{{ getDocumentIcon(doc.fileType) }}</span>
                      </div>
                      <div class="flex-1 min-w-0">
                        <h3 class="text-sm sm:text-base font-semibold text-gray-800 truncate">{{ doc.name }}</h3>
                        <p class="text-xs sm:text-sm text-gray-600">Type: {{ doc.fileType }}</p>
                        <div class="flex flex-wrap items-center gap-2 mt-2">
                          <span [class]="getStatusBadgeClass(doc.validationStatus)" class="px-2 py-1 rounded-lg text-xs font-medium">
                            {{ getStatusLabel(doc.validationStatus) }}
                          </span>
                        </div>
                        @if (doc.ocrNotes) {
                          <div class="mt-2 p-2 bg-blue-50 rounded-lg">
                            <p class="text-xs text-blue-700">
                              <strong>Notes OCR:</strong> {{ doc.ocrNotes }}
                            </p>
                          </div>
                        }
                      </div>
                    </div>
                    <div class="flex items-center space-x-2 w-full sm:w-auto">
                      @if (doc.validationStatus === 'REJECTED') {
                        <button 
                          (click)="replaceDocument(doc)"
                          class="flex-1 sm:flex-initial px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-all flex items-center justify-center space-x-1"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                          </svg>
                          <span>Remplacer</span>
                        </button>
                      }
                    </div>
                  </div>
                </div>
              } @empty {
                <div class="text-center py-12">
                  <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  <p class="text-gray-600 mb-4">Aucun document dans cette catégorie</p>
                  <button routerLink="/candidate/enrollment" class="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-700 text-white rounded-xl font-medium hover:shadow-lg transition-all">
                    Télécharger des documents
                  </button>
                </div>
              }
            </div>
          }
        </div>
      </main>
    </div>
  `
})
export class CandidateDocumentsComponent implements OnInit {
  isMobileSidebarOpen = false;
  currentFilter: 'ALL' | 'VALIDATED' | 'PENDING' | 'REJECTED' = 'ALL';
  documents: DocumentResponseDTO[] = [];
  loading = false;
  error: string | null = null;

  constructor(private candidateService: CandidateService) {}

  ngOnInit() {
    this.loadDocuments();
  }

  loadDocuments() {
    this.loading = true;
    this.error = null;
    
    this.candidateService.getMyDocuments().subscribe({
      next: (docs) => {
        this.documents = docs;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load documents', err);
        this.error = 'Impossible de charger les documents. Veuillez réessayer.';
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

  filterDocuments(filter: 'ALL' | 'VALIDATED' | 'PENDING' | 'REJECTED') {
    this.currentFilter = filter;
  }

  getFilteredDocuments(): DocumentResponseDTO[] {
    if (this.currentFilter === 'ALL') {
      return this.documents;
    }
    return this.documents.filter(doc => doc.validationStatus === this.currentFilter);
  }

  getTotalDocuments(): number {
    return this.documents.length;
  }

  getValidatedCount(): number {
    return this.documents.filter(doc => doc.validationStatus === 'VALIDATED').length;
  }

  getPendingCount(): number {
    return this.documents.filter(doc => doc.validationStatus === 'PENDING').length;
  }

  getRejectedCount(): number {
    return this.documents.filter(doc => doc.validationStatus === 'REJECTED').length;
  }

  getDocumentIcon(fileType: string): string {
    switch (fileType.toLowerCase()) {
      case 'pdf': return '📄';
      case 'jpg':
      case 'jpeg':
      case 'png': return '🖼️';
      default: return '📋';
    }
  }

  getDocumentIconClass(fileType: string): string {
    switch (fileType.toLowerCase()) {
      case 'pdf': return 'bg-red-100';
      case 'jpg':
      case 'jpeg':
      case 'png': return 'bg-blue-100';
      default: return 'bg-gray-100';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'VALIDATED': return 'bg-green-100 text-green-700';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'REJECTED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  getStatusLabel(status: string): string {
    return this.candidateService.getValidationStatusLabel(status);
  }

  replaceDocument(doc: DocumentResponseDTO) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = doc.fileType === 'pdf' ? '.pdf' : 'image/*';
    
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          alert('Le fichier est trop volumineux. Taille maximale: 5MB');
          return;
        }

        // Note: This requires the backend endpoint POST /api/documents/{id}/replace
        // If not implemented yet, redirect to enrollment
        alert('Fonctionnalité de remplacement en cours d\'implémentation.\nVeuillez utiliser le formulaire d\'inscription pour le moment.');
        
        // TODO: Uncomment when backend endpoint is ready
        /*
        this.candidateService.replaceDocument(doc.id, file).subscribe({
          next: (updatedDoc) => {
            const index = this.documents.findIndex(d => d.id === doc.id);
            if (index !== -1) {
              this.documents[index] = updatedDoc;
            }
            alert('Document remplacé avec succès');
          },
          error: (err) => {
            console.error('Failed to replace document', err);
            alert('Impossible de remplacer le document. Veuillez réessayer.');
          }
        });
        */
      }
    };
    
    input.click();
  }
}