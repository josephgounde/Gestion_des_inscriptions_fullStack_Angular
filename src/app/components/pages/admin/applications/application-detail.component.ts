// src/app/pages/admin/applications/application-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../services/admin.service';

interface ApplicationDetail {
  id: string;
  candidate?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    photo?: string;
  };
  personalInfo?: any;
  documents?: any[];
  academicInfo?: any;
  contactInfo?: any;
  status: string;
  timeline?: any[];
  comments?: any[];
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-application-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-neo-light via-gray-100 to-neo-light">
      <!-- Header -->
      <header class="bg-white shadow-neo-sm">
        <div class="container mx-auto px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <button (click)="goBack()" class="p-2 rounded-xl bg-neo-light shadow-neo hover:shadow-neo-inset transition-all">
                <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              <div>
                <h1 class="text-2xl font-bold text-gray-800">Détails de la candidature</h1>
                <p class="text-sm text-gray-600">{{ application?.id }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <button 
                (click)="printApplication()"
                class="px-4 py-2 rounded-xl bg-neo-light shadow-neo hover:shadow-neo-inset transition-all text-gray-700 font-medium flex items-center space-x-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                </svg>
                <span>Imprimer</span>
              </button>
                <a routerLink="/admin/dashboard" class="px-4 py-2 rounded-xl bg-primary-500 text-white font-medium hover:shadow-lg transition-all">
                  Go Back
                </a>
            </div>
          </div>
        </div>
      </header>

      <div class="container mx-auto px-6 py-8">
        <div class="grid lg:grid-cols-3 gap-6">
          <!-- Main Content -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Candidate Info Card -->
            @if (application) {
              <div class="bg-neo-light rounded-3xl shadow-neo p-6">
                <div class="flex items-start space-x-6">
                  <div class="w-24 h-24 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-700 flex items-center justify-center shadow-neo">
                    @if (application.candidate?.photo) {
                      <img [src]="application.candidate?.photo" class="w-full h-full rounded-2xl object-cover">
                    } @else {
                      <span class="text-white text-3xl font-bold">
                        {{ getInitials() }}
                      </span>
                    }
                  </div>
                  <div class="flex-1">
                    <h2 class="text-2xl font-bold text-gray-800">
                      {{ application.candidate?.firstName }} {{ application.candidate?.lastName }}
                    </h2>
                    <div class="mt-2 space-y-1">
                      <p class="text-gray-600 flex items-center">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                        {{ application.candidate?.email }}
                      </p>
                      <p class="text-gray-600 flex items-center">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                        </svg>
                        {{ application.candidate?.phone }}
                      </p>
                    </div>
                    <div class="mt-4">
                      <span [class]="getStatusClass(application.status)" class="px-4 py-2 rounded-full text-sm font-medium">
                        {{ getStatusLabel(application.status) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            }

            <!-- Personal Information -->
            <div class="bg-neo-light rounded-3xl shadow-neo p-6">
              <h3 class="text-xl font-bold text-gray-800 mb-4">Informations Personnelles</h3>
              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <label class="text-sm text-gray-600">Date de naissance</label>
                  <p class="font-medium text-gray-800">{{ application?.personalInfo?.birthDate | date:'dd/MM/yyyy' }}</p>
                </div>
                <div>
                  <label class="text-sm text-gray-600">Sexe</label>
                  <p class="font-medium text-gray-800">{{ application?.personalInfo?.gender }}</p>
                </div>
                <div>
                  <label class="text-sm text-gray-600">Nationalité</label>
                  <p class="font-medium text-gray-800">{{ application?.personalInfo?.nationality }}</p>
                </div>
                <div>
                  <label class="text-sm text-gray-600">Type de pièce</label>
                  <p class="font-medium text-gray-800">{{ application?.personalInfo?.idType }}</p>
                </div>
                <div>
                  <label class="text-sm text-gray-600">Numéro de pièce</label>
                  <p class="font-medium text-gray-800">{{ application?.personalInfo?.idNumber }}</p>
                </div>
              </div>
            </div>

            <!-- Documents -->
            <div class="bg-neo-light rounded-3xl shadow-neo p-6">
              <h3 class="text-xl font-bold text-gray-800 mb-4">Documents</h3>
              <div class="space-y-3">
                @for (doc of application?.documents; track doc.id) {
                  <div class="flex items-center justify-between p-4 bg-white rounded-xl shadow-neo-sm">
                    <div class="flex items-center space-x-3">
                      <div class="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center">
                        @if (doc.type.includes('image')) {
                          <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                          </svg>
                        } @else {
                          <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                          </svg>
                        }
                      </div>
                      <div>
                        <p class="font-medium text-gray-800">{{ doc.name }}</p>
                        <p class="text-xs text-gray-600">{{ doc.size | number:'1.0-2' }} Mo</p>
                      </div>
                    </div>
                    <div class="flex items-center space-x-2">
                      @if (doc.validated) {
                        <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Validé</span>
                      } @else {
                        <button 
                          (click)="validateDocument(doc.id)"
                          class="px-3 py-1 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-xs font-medium transition-all"
                        >
                          Valider
                        </button>
                      }
                      <button 
                        (click)="viewDocument(doc.url)"
                        class="p-2 rounded-lg bg-primary-50 hover:bg-primary-100 text-primary-600 transition-all"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Academic Info -->
            <div class="bg-neo-light rounded-3xl shadow-neo p-6">
              <h3 class="text-xl font-bold text-gray-800 mb-4">Parcours Académique</h3>
              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <label class="text-sm text-gray-600">Dernier établissement</label>
                  <p class="font-medium text-gray-800">{{ application?.academicInfo?.lastSchool }}</p>
                </div>
                <div>
                  <label class="text-sm text-gray-600">Spécialisation</label>
                  <p class="font-medium text-gray-800">{{ application?.academicInfo?.specialization }}</p>
                </div>
                <div>
                  <label class="text-sm text-gray-600">Niveau</label>
                  <p class="font-medium text-gray-800">{{ application?.academicInfo?.level }}</p>
                </div>
                <div>
                  <label class="text-sm text-gray-600">Programme souhaité</label>
                  <p class="font-medium text-gray-800">{{ application?.academicInfo?.desiredProgram }}</p>
                </div>
              </div>
            </div>

            <!-- Comments -->
            <div class="bg-neo-light rounded-3xl shadow-neo p-6">
              <h3 class="text-xl font-bold text-gray-800 mb-4">Commentaires et Notes</h3>
              <div class="space-y-3 mb-4">
                @for (comment of application?.comments; track comment.id) {
                  <div class="p-4 bg-white rounded-xl shadow-neo-sm">
                    <div class="flex items-start space-x-3">
                      <div class="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-primary-700 flex items-center justify-center">
                        <span class="text-white font-bold text-sm">{{ comment.author.initials }}</span>
                      </div>
                      <div class="flex-1">
                        <div class="flex items-center justify-between">
                          <p class="font-medium text-gray-800">{{ comment.author.name }}</p>
                          <span class="text-xs text-gray-500">{{ comment.date | date:'dd/MM/yyyy HH:mm' }}</span>
                        </div>
                        <p class="text-gray-600 mt-1">{{ comment.text }}</p>
                      </div>
                    </div>
                  </div>
                }
              </div>
              <div class="flex space-x-2">
                <input 
                  [(ngModel)]="newComment"
                  type="text" 
                  placeholder="Ajouter un commentaire..."
                  class="flex-1 px-4 py-3 rounded-xl bg-white shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button 
                  (click)="addComment()"
                  class="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 text-white font-medium shadow-neo hover:shadow-lg transition-all"
                >
                  Envoyer
                </button>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Actions -->
            <div class="bg-neo-light rounded-3xl shadow-neo p-6">
              <h3 class="text-lg font-bold text-gray-800 mb-4">Actions</h3>
              <div class="space-y-3">
                <button 
                  (click)="approveApplication()"
                  class="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold shadow-neo hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>Approuver</span>
                </button>
                <button 
                  (click)="rejectApplication()"
                  class="w-full py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold shadow-neo hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                  <span>Rejeter</span>
                </button>
                <button 
                  class="w-full py-3 rounded-xl bg-neo-light shadow-neo hover:shadow-neo-inset transition-all text-gray-700 font-medium flex items-center justify-center space-x-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  <span>Envoyer un email</span>
                </button>
              </div>
            </div>

            <!-- Timeline -->
            <div class="bg-neo-light rounded-3xl shadow-neo p-6">
              <h3 class="text-lg font-bold text-gray-800 mb-4">Chronologie</h3>
              <div class="space-y-4">
                @for (event of application?.timeline; track event.id) {
                  <div class="flex space-x-3">
                    <div class="flex flex-col items-center">
                      <div class="w-3 h-3 rounded-full bg-primary-500"></div>
                      @if (!$last) {
                        <div class="w-0.5 h-full bg-gray-300 my-1"></div>
                      }
                    </div>
                    <div class="flex-1 pb-4">
                      <p class="text-sm font-medium text-gray-800">{{ event.title }}</p>
                      <p class="text-xs text-gray-600 mt-1">{{ event.description }}</p>
                      <span class="text-xs text-gray-500">{{ event.date | date:'dd/MM/yyyy HH:mm' }}</span>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Assignment -->
            <div class="bg-neo-light rounded-3xl shadow-neo p-6">
              <h3 class="text-lg font-bold text-gray-800 mb-4">Attribution</h3>
              <select class="w-full px-4 py-3 rounded-xl bg-white shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">Assigner à un agent...</option>
                <option value="agent1">Agent 1</option>
                <option value="agent2">Agent 2</option>
                <option value="agent3">Agent 3</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ApplicationDetailComponent implements OnInit {
  applicationId: string = '';
  application: ApplicationDetail | null = null;
  newComment = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService
  ) {}

  ngOnInit() {
    this.applicationId = this.route.snapshot.params['id'];
    this.loadApplication();
  }

  loadApplication() {
    this.adminService.getApplicationDetails(this.applicationId).subscribe({
      next: (res: any) => {
        // Normalize shape from API to the component's interface
        this.application = {
          id: res.id,
          candidate: res.candidate ?? {
            firstName: res.firstName || '',
            lastName: res.lastName || '',
            email: res.email || '',
            phone: res.phone || ''
          },
          personalInfo: (res.personalInfo ?? res.personal) || {},
          documents: res.documents ?? [],
          academicInfo: res.academicInfo ?? res.education ?? {},
          contactInfo: res.contactInfo ?? {},
          status: res.status ?? 'PENDING',
          timeline: res.timeline ?? [],
          comments: res.comments ?? [],
          createdAt: res.createdAt ? new Date(res.createdAt) : new Date(),
          updatedAt: res.updatedAt ? new Date(res.updatedAt) : new Date()
        } as any;
      },
      error: (err) => {
        console.error('Failed to load application details', err);
        // Keep application null and show fallback in UI
        this.application = null;
      }
    });
  }

  getInitials(): string {
    if (!this.application) return '';
    return `${this.application.candidate?.firstName[0]}${this.application.candidate?.lastName[0]}`;
  }

  getStatusClass(status: string): string {
    const classes: any = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'UNDER_REVIEW': 'bg-blue-100 text-blue-800',
      'APPROVED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800'
    };
    return classes[status] || '';
  }

  getStatusLabel(status: string): string {
    const labels: any = {
      'PENDING': 'En attente',
      'UNDER_REVIEW': 'En révision',
      'APPROVED': 'Approuvée',
      'REJECTED': 'Rejetée'
    };
    return labels[status] || status;
  }

  validateDocument(docId: string) {
    if (!confirm('Valider ce document ?')) return;
    this.adminService.validateDocument(docId, true).subscribe({
      next: () => this.loadApplication(),
      error: (err) => console.error('Failed to validate document', err)
    });
  }

  viewDocument(url: string) {
    window.open(url, '_blank');
  }

  addComment() {
    const text = this.newComment.trim();
    if (!text) return;
    this.adminService.addComment(this.applicationId, text).subscribe({
      next: (c: any) => {
        // reload application comments or append
        if (this.application) {
          this.application.comments = this.application.comments ?? [];
          this.application.comments.push(c);
        }
        this.newComment = '';
      },
      error: (err) => console.error('Failed to add comment', err)
    });
  }

  approveApplication() {
    if (!confirm('Approuver cette candidature?')) return;
    this.adminService.approveApplication(this.applicationId).subscribe({
      next: () => this.loadApplication(),
      error: (err) => console.error('Failed to approve application', err)
    });
  }

  rejectApplication() {
    const reason = prompt('Raison du rejet:');
    if (!reason) return;
    this.adminService.rejectApplication(this.applicationId, reason).subscribe({
      next: () => this.loadApplication(),
      error: (err) => console.error('Failed to reject application', err)
    });
  }

  printApplication() {
    window.print();
  }

  goBack() {
    this.router.navigate(['/admin/dashboard']);
  }

  // logout is provided by main admin dashboard aside
}