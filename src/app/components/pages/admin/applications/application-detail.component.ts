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
  completionRate?: number;
  assignedAdmin?: any;
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
                <p class="text-sm text-gray-600">#{{ application?.id }}</p>
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
                Retour
              </a>
            </div>
          </div>
        </div>
      </header>

      <div class="container mx-auto px-6 py-8">
        @if (!application) {
          <div class="text-center py-12">
            <p class="text-gray-500">Chargement des détails...</p>
          </div>
        } @else {
          <div class="grid lg:grid-cols-3 gap-6">
            <!-- Main Content -->
            <div class="lg:col-span-2 space-y-6">
              <!-- Candidate Info Card -->
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
                    <div class="mt-4 flex items-center space-x-3">
                      <span [class]="getStatusClass(application.status)" class="px-4 py-2 rounded-full text-sm font-medium">
                        {{ getStatusLabel(application.status) }}
                      </span>
                      <span class="text-sm text-gray-600">
                        Complétude: {{ application.completionRate }}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Personal Information -->
              <div class="bg-neo-light rounded-3xl shadow-neo p-6">
                <h3 class="text-xl font-bold text-gray-800 mb-4">Informations Personnelles</h3>
                <div class="grid md:grid-cols-2 gap-4">
                  <div>
                    <label class="text-sm text-gray-600">Date de naissance</label>
                    <p class="font-medium text-gray-800">{{ application.personalInfo?.birthDate || 'Non renseigné' }}</p>
                  </div>
                  <div>
                    <label class="text-sm text-gray-600">Sexe</label>
                    <p class="font-medium text-gray-800">{{ application.personalInfo?.gender || 'Non renseigné' }}</p>
                  </div>
                  <div>
                    <label class="text-sm text-gray-600">Nationalité</label>
                    <p class="font-medium text-gray-800">{{ application.personalInfo?.nationality || 'Non renseigné' }}</p>
                  </div>
                  <div>
                    <label class="text-sm text-gray-600">Type de pièce</label>
                    <p class="font-medium text-gray-800">{{ application.personalInfo?.idType || 'Non renseigné' }}</p>
                  </div>
                  <div>
                    <label class="text-sm text-gray-600">Numéro de pièce</label>
                    <p class="font-medium text-gray-800">{{ application.personalInfo?.idNumber || 'Non renseigné' }}</p>
                  </div>
                </div>
              </div>

              <!-- Documents -->
              <div class="bg-neo-light rounded-3xl shadow-neo p-6">
                <h3 class="text-xl font-bold text-gray-800 mb-4">Documents ({{ application.documents?.length || 0 }})</h3>
                <div class="space-y-3">
                  @for (doc of application.documents; track doc.id) {
                    <div class="flex items-center justify-between p-4 bg-white rounded-xl shadow-neo-sm">
                      <div class="flex items-center space-x-3">
                        <div class="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center">
                          <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                          </svg>
                        </div>
                        <div>
                          <p class="font-medium text-gray-800">{{ doc.name }}</p>
                          <p class="text-xs text-gray-600">{{ doc.type }} • {{ doc.status }}</p>
                        </div>
                      </div>
                      <div class="flex items-center space-x-2">
                        @if (doc.validated) {
                          <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">✓ Validé</span>
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
                          title="Voir le document"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  } @empty {
                    <p class="text-gray-500 text-center py-4">Aucun document</p>
                  }
                </div>
              </div>

              <!-- Academic Info -->
              <div class="bg-neo-light rounded-3xl shadow-neo p-6">
                <h3 class="text-xl font-bold text-gray-800 mb-4">Parcours Académique</h3>
                <div class="grid md:grid-cols-2 gap-4">
                  <div>
                    <label class="text-sm text-gray-600">Dernier établissement</label>
                    <p class="font-medium text-gray-800">{{ application.academicInfo?.lastSchool || 'Non renseigné' }}</p>
                  </div>
                  <div>
                    <label class="text-sm text-gray-600">Spécialisation</label>
                    <p class="font-medium text-gray-800">{{ application.academicInfo?.specialization || 'Non renseigné' }}</p>
                  </div>
                  <div>
                    <label class="text-sm text-gray-600">Niveau</label>
                    <p class="font-medium text-gray-800">{{ application.academicInfo?.level || 'Non renseigné' }}</p>
                  </div>
                  <div>
                    <label class="text-sm text-gray-600">Programme souhaité</label>
                    <p class="font-medium text-gray-800">{{ application.academicInfo?.desiredProgram || 'Non renseigné' }}</p>
                  </div>
                </div>
              </div>

              <!-- Contact Info -->
              <div class="bg-neo-light rounded-3xl shadow-neo p-6">
                <h3 class="text-xl font-bold text-gray-800 mb-4">Coordonnées</h3>
                <div class="grid md:grid-cols-2 gap-4">
                  <div>
                    <label class="text-sm text-gray-600">Adresse</label>
                    <p class="font-medium text-gray-800">{{ application.contactInfo?.address || 'Non renseigné' }}</p>
                  </div>
                  <div>
                    <label class="text-sm text-gray-600">Ville</label>
                    <p class="font-medium text-gray-800">{{ application.contactInfo?.city || 'Non renseigné' }}</p>
                  </div>
                  <div>
                    <label class="text-sm text-gray-600">Contact d'urgence</label>
                    <p class="font-medium text-gray-800">{{ application.contactInfo?.emergencyName || 'Non renseigné' }}</p>
                  </div>
                  <div>
                    <label class="text-sm text-gray-600">Téléphone d'urgence</label>
                    <p class="font-medium text-gray-800">{{ application.contactInfo?.emergencyPhone || 'Non renseigné' }}</p>
                  </div>
                </div>
              </div>

              <!-- Comments -->
              <div class="bg-neo-light rounded-3xl shadow-neo p-6">
                <h3 class="text-xl font-bold text-gray-800 mb-4">Commentaires et Notes</h3>
                <div class="space-y-3 mb-4">
                  @for (comment of application.comments; track comment.id) {
                    <div class="p-4 bg-white rounded-xl shadow-neo-sm">
                      <div class="flex items-start space-x-3">
                        <div class="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-primary-700 flex items-center justify-center">
                          <span class="text-white font-bold text-sm">S</span>
                        </div>
                        <div class="flex-1">
                          <div class="flex items-center justify-between">
                            <p class="font-medium text-gray-800">{{ comment.author }}</p>
                            <span class="text-xs text-gray-500">{{ comment.date | date:'dd/MM/yyyy HH:mm' }}</span>
                          </div>
                          <p class="text-gray-600 mt-1">{{ comment.text }}</p>
                        </div>
                      </div>
                    </div>
                  } @empty {
                    <p class="text-gray-500 text-center py-4">Aucun commentaire</p>
                  }
                </div>
                <div class="flex space-x-2">
                  <input 
                    [(ngModel)]="newComment"
                    type="text" 
                    placeholder="Ajouter un commentaire..."
                    class="flex-1 px-4 py-3 rounded-xl bg-white shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500"
                    (keyup.enter)="addComment()"
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
                </div>
              </div>

              <!-- Timeline -->
              <div class="bg-neo-light rounded-3xl shadow-neo p-6">
                <h3 class="text-lg font-bold text-gray-800 mb-4">Chronologie</h3>
                <div class="space-y-4">
                  @for (event of application.timeline; track event.id; let isLast = $last) {
                    <div class="flex space-x-3">
                      <div class="flex flex-col items-center">
                        <div class="w-3 h-3 rounded-full bg-primary-500"></div>
                        @if (!isLast) {
                          <div class="w-0.5 flex-1 bg-gray-300 my-1"></div>
                        }
                      </div>
                      <div class="flex-1 pb-4">
                        <p class="text-sm font-medium text-gray-800">{{ event.title }}</p>
                        <p class="text-xs text-gray-600 mt-1">{{ event.description }}</p>
                        <span class="text-xs text-gray-500">{{ event.date | date:'dd/MM/yyyy HH:mm' }}</span>
                      </div>
                    </div>
                  } @empty {
                    <p class="text-gray-500 text-center py-4">Aucun événement</p>
                  }
                </div>
              </div>

              <!-- Assignment -->
              <div class="bg-neo-light rounded-3xl shadow-neo p-6">
                <h3 class="text-lg font-bold text-gray-800 mb-4">Attribution</h3>
                @if (application.assignedAdmin) {
                  <div class="mb-3 p-3 bg-blue-50 rounded-xl">
                    <p class="text-sm text-gray-600">Assigné à:</p>
                    <p class="font-medium text-gray-800">{{ application.assignedAdmin.name }}</p>
                  </div>
                }
                <select 
                  [(ngModel)]="selectedAgentId"
                  class="w-full px-4 py-3 rounded-xl bg-white shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 mb-3"
                >
                  <option value="">Sélectionner un agent...</option>
                  @for (agent of availableAgents; track agent.id) {
                    <option [value]="agent.id">{{ agent.firstName }} {{ agent.lastName }}</option>
                  }
                </select>
                <button
                  (click)="assignToAgent()"
                  [disabled]="!selectedAgentId || isAssigning"
                  class="w-full py-2 rounded-xl bg-primary-500 text-white font-medium hover:bg-primary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ isAssigning ? 'Attribution en cours...' : 'Assigner' }}
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class ApplicationDetailComponent implements OnInit {
  applicationId: string = '';
  application: ApplicationDetail | null = null;
  newComment = '';
  availableAgents: any[] = [];
  selectedAgentId: string = '';
  isAssigning = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService
  ) {}

  ngOnInit() {
  // Get application ID from route
  this.applicationId = this.route.snapshot.params['id'];
  
  // ✅ DEBUG LOGGING
  console.log('🔍 Route params:', this.route.snapshot.params);
  console.log('🔍 Application ID from route:', this.applicationId);
  
  // ✅ VALIDATION
  if (!this.applicationId) {
    console.error('❌ No application ID in route!');
    console.log('🔍 Current URL:', window.location.href);
    alert('Erreur: ID de candidature manquant dans l\'URL');
    return;
  }
  
  this.loadApplication();
  this.loadAgents();
}

  loadApplication() {
  console.log('📥 Loading application:', this.applicationId);
  
  this.adminService.getApplicationDetails(this.applicationId).subscribe({
    next: (res: any) => {
      console.log('🔍 Raw backend response:', res);
      
      if (!res) {
        console.error('❌ No data received');
        this.application = null;
        return;
      }

      // Parse applicant name
      const nameParts = (res.applicantName || '').split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Map backend response to frontend structure
      this.application = {
        id: res.applicationId || res.id,
        
        // Candidate info
        candidate: {
          firstName: firstName,
          lastName: lastName,
          email: res.email || res.username || '',  // ✅ Backend now sends email
          phone: res.phoneNumber || '',             // ✅ Backend now sends phoneNumber
          photo: undefined
        },
        
        // Personal info - ✅ USING ACTUAL BACKEND FIELDS
        personalInfo: {
          firstName: firstName,
          lastName: lastName,
          gender: res.gender || '',                 // ✅ From User.gender
          birthDate: res.birthDate || '',           // ✅ From User.dateOfBirth (renamed to birthDate in DTO)
          nationality: res.nationality || '',       // ✅ From User.nationality
          idType: 'Non renseigné',                 // ❌ Not in User entity
          idNumber: 'Non renseigné'                // ❌ Not in User entity
        },
        
        // Documents
        documents: (res.documentsStatus || []).map((doc: any) => ({
          id: doc.id,
          name: doc.name,
          type: doc.fileType,
          status: doc.validationStatus,
          validated: doc.validationStatus === 'VALIDATED',
          uploadedAt: doc.uploadedAt ? new Date(doc.uploadedAt) : new Date(),
          notes: doc.ocrNotes || '',
          url: `http://localhost:8085/api/documents/${doc.id}/download`,
          size: doc.fileSizeMB || 0
        })),
        
        // Academic info - ✅ FROM ACADEMICHISTORY ENTITY
        academicInfo: {
          lastSchool: res.lastInstitution || 'Non renseigné',      // ✅ From AcademicHistory.lastInstitution
          specialization: res.specialization || 'Non renseigné',   // ✅ From AcademicHistory.specialization
          level: 'Non renseigné',                                  // ❌ Not in AcademicHistory
          startDate: res.academicStartDate || '',                  // ✅ From AcademicHistory.startDate
          endDate: res.academicEndDate || '',                      // ✅ From AcademicHistory.endDate
          desiredProgram: 'Non renseigné'                          // ❌ Not in User/AcademicHistory
        },
        
        // Contact info - ✅ USING ACTUAL BACKEND FIELDS
        contactInfo: {
          email: res.email || res.username || '',
          phone: res.phoneNumber || '',
          address: res.address || 'Non renseigné',               // ✅ From User.address
          city: 'Non renseigné',                                 // ❌ Not in User entity
          emergencyName: res.emergencyContact || 'Non renseigné', // ✅ From User.emergencyContact (single field)
          emergencyPhone: 'Non renseigné'                        // ❌ Not in User entity
        },
        
        // Status
        status: res.status || 'PENDING',
        completionRate: res.completionRate || 0,
        
        // Timeline
        timeline: (res.recentNotifications || []).map((notif: any) => ({
          id: notif.id,
          date: notif.createdAt ? new Date(notif.createdAt) : new Date(),
          title: this.getNotificationTitle(notif.type, notif.message),
          description: notif.message || '',
          type: notif.type || 'info'
        })),
        
        // Comments
        comments: (res.recentNotifications || []).map((notif: any) => ({
          id: notif.id,
          author: 'Système',
          date: notif.createdAt ? new Date(notif.createdAt) : new Date(),
          text: notif.message || ''
        })),
        
        // Dates
        createdAt: res.submissionDate ? new Date(res.submissionDate) : new Date(),
        updatedAt: res.submissionDate ? new Date(res.submissionDate) : new Date(),
        
        // Assigned admin
        assignedAdmin: res.assignedAdminId ? {
          id: res.assignedAdminId,
          name: res.assignedAdminUsername
        } : null
      } as any;
      
      console.log('✅ Application loaded:', this.application);
      console.log('📄 Documents:', this.application?.documents);
    },
    error: (err) => {
      console.error('❌ Failed to load application:', err);
      this.application = null;
    }
  });
}

  loadAgents() {
    this.adminService.getAgents().subscribe({
      next: (agents) => {
        this.availableAgents = agents;
        console.log('👥 Agents loaded:', agents);
      },
      error: (err) => {
        console.error('❌ Failed to load agents:', err);
        this.availableAgents = [];
      }
    });
  }

  getInitials(): string {
    if (!this.application?.candidate) return '?';
    const f = this.application.candidate.firstName || '';
    const l = this.application.candidate.lastName || '';
    return `${f[0] || ''}${l[0] || ''}`.toUpperCase();
  }

  getStatusClass(status: string): string {
    const classes: any = {
      'PRE_VALIDATION': 'bg-yellow-100 text-yellow-800',
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'MANUAL_REVIEW': 'bg-blue-100 text-blue-800',
      'UNDER_REVIEW': 'bg-blue-100 text-blue-800',
      'APPROVED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  getStatusLabel(status: string): string {
    const labels: any = {
      'PRE_VALIDATION': 'Pré-validation',
      'PENDING': 'En attente',
      'MANUAL_REVIEW': 'En révision manuelle',
      'UNDER_REVIEW': 'En révision',
      'APPROVED': 'Approuvée',
      'REJECTED': 'Rejetée'
    };
    return labels[status] || status;
  }

  getNotificationTitle(type: string, message: string): string {
    const titles: any = {
      'SUCCESS': 'Confirmation',
      'INFO': 'Information',
      'WARNING': 'Attention',
      'ERROR': 'Erreur'
    };
    return titles[type] || message;
  }

  // ========== DOCUMENT VALIDATION ==========
  
  validateDocument(docId: number) {
    if (!confirm('Êtes-vous sûr de vouloir valider ce document ?')) {
      return;
    }
    
    console.log('🔄 Validating document ID:', docId);
    
    this.adminService.validateDocument(docId).subscribe({
      next: () => {
        console.log('✅ Document validated successfully');
        alert('Document validé avec succès');
        this.loadApplication(); // Reload to show updated status
      },
      error: (err) => {
        console.error('❌ Validation failed:', err);
        if (err.status === 401) {
          alert('Erreur d\'authentification. Veuillez vous reconnecter.');
        } else if (err.status === 403) {
          alert('Vous n\'avez pas les permissions nécessaires.');
        } else {
          alert('Erreur lors de la validation du document');
        }
      }
    });
  }

  viewDocument(url: string) {
    if (!url) {
      alert('URL du document non disponible');
      return;
    }
    window.open(url, '_blank');
  }

  // ========== APPLICATION REVIEW ==========

  approveApplication() {
    if (!confirm('Approuver cette candidature ?')) return;
    
    console.log('✅ Approving application:', this.applicationId);
    
    this.adminService.approveApplication(this.applicationId).subscribe({
      next: () => {
        console.log('✅ Application approved');
        alert('Candidature approuvée avec succès');
        this.loadApplication();
      },
      error: (err) => {
        console.error('❌ Approval failed:', err);
        alert('Erreur lors de l\'approbation');
      }
    });
  }

  rejectApplication() {
    const reason = prompt('Raison du rejet:');
    if (!reason) return;
    
    console.log('❌ Rejecting application:', this.applicationId);
    
    this.adminService.rejectApplication(this.applicationId, reason).subscribe({
      next: () => {
        console.log('✅ Application rejected');
        alert('Candidature rejetée');
        this.loadApplication();
      },
      error: (err) => {
        console.error('❌ Rejection failed:', err);
        alert('Erreur lors du rejet');
      }
    });
  }

  // ========== AGENT ASSIGNMENT ==========

  assignToAgent() {
  // Check if applicationId exists
  if (!this.applicationId) {
    console.error('❌ Cannot assign: applicationId is undefined!');
    alert('Erreur: ID de candidature non défini');
    return;
  }
  
  if (!this.selectedAgentId) {
    alert('Veuillez sélectionner un agent');
    return;
  }
  
  if (!confirm('Assigner cette candidature à l\'agent sélectionné ?')) {
    return;
  }
  
  this.isAssigning = true;
  console.log('👤 Assigning application:', this.applicationId, 'to agent:', this.selectedAgentId);
  
  // CONVERT TO STRING (backend expects Long but URL param is string)
  this.adminService.assignApplication(this.applicationId, this.selectedAgentId).subscribe({
    next: () => {
      console.log('✅ Application assigned');
      alert('Candidature assignée avec succès');
      this.isAssigning = false;
      this.loadApplication();
    },
    error: (err) => {
      console.error('❌ Assignment failed:', err);
      if (err.status === 401) {
        alert('Erreur d\'authentification. Veuillez vous reconnecter.');
      } else if (err.status === 404) {
        alert('Application ou agent non trouvé.');
      } else {
        alert('Erreur lors de l\'assignation');
      }
      this.isAssigning = false;
    }
  });
}

  // ========== COMMENTS ==========

  addComment() {
    const text = this.newComment.trim();
    if (!text) return;
    
    console.log('💬 Adding comment');
    
    this.adminService.addComment(this.applicationId, text).subscribe({
      next: (c: any) => {
        console.log('✅ Comment added');
        if (this.application) {
          this.application.comments = this.application.comments ?? [];
          this.application.comments.push(c);
        }
        this.newComment = '';
      },
      error: (err) => {
        console.error('❌ Comment failed:', err);
        alert('Erreur lors de l\'ajout du commentaire');
      }
    });
  }

  // ========== UI ACTIONS ==========

  printApplication() {
    window.print();
  }

  goBack() {
    this.router.navigate(['/admin/dashboard']);
  }
}