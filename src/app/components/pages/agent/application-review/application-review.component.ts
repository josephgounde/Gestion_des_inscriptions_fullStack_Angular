// src/app/components/pages/agent/application-review/application-review.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../../services/admin.service';
import { AuthService } from '../../../../services/auth.service';

interface Document {
  id: string;
  name: string;
  fileType: string;
  filePath: string;
  validationStatus: 'PENDING' | 'VALIDATED' | 'REJECTED';
  uploadedDate: Date;
  fileSize?: number;
}

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
  documents?: Document[];
  academicInfo?: any;
  contactInfo?: any;
  status: string;
  program?: string;
  submittedDate?: Date;
  completionRate?: number;
  assignedDate?: Date;
  comments?: any[];
}

@Component({
  selector: 'app-application-review',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-neo-light via-gray-100 to-neo-light">
      <!-- Header -->
      <header class="bg-white shadow-neo-sm sticky top-0 z-10">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <button (click)="goBack()" class="p-2 rounded-xl bg-neo-light shadow-neo hover:shadow-neo-inset transition-all">
                <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              <div>
                <h1 class="text-xl sm:text-2xl font-bold text-gray-800">Application Review</h1>
                <p class="text-sm text-gray-600">Review assigned application</p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span class="px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-full">
                AGENT
              </span>
            </div>
          </div>
        </div>
      </header>

      @if (loading) {
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div class="text-center">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            <p class="mt-4 text-gray-600">Loading application...</p>
          </div>
        </div>
      } @else if (application) {
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="grid lg:grid-cols-3 gap-6">
            <!-- Main Content -->
            <div class="lg:col-span-2 space-y-6">
              <!-- Candidate Info -->
              <div class="bg-neo-light rounded-3xl shadow-neo p-6">
                <h2 class="text-lg font-bold text-gray-800 mb-4">Candidate Information</h2>
                <div class="flex items-start space-x-6">
                  <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-700 flex items-center justify-center shadow-neo flex-shrink-0">
                    @if (application.candidate?.photo) {
                      <img [src]="application.candidate?.photo" class="w-full h-full rounded-2xl object-cover" alt="Candidate">
                    } @else {
                      <span class="text-white text-2xl sm:text-3xl font-bold">
                        {{ getInitials() }}
                      </span>
                    }
                  </div>
                  <div class="flex-1">
                    <h3 class="text-xl sm:text-2xl font-bold text-gray-800">
                      {{ application.candidate?.firstName }} {{ application.candidate?.lastName }}
                    </h3>
                    <div class="mt-3 space-y-2">
                      <p class="text-sm sm:text-base text-gray-600 flex items-center">
                        <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                        {{ application.candidate?.email }}
                      </p>
                      <p class="text-sm sm:text-base text-gray-600 flex items-center">
                        <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                        </svg>
                        {{ application.candidate?.phone }}
                      </p>
                      @if (application.program) {
                        <p class="text-sm sm:text-base text-gray-600 flex items-center">
                          <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                          </svg>
                          {{ application.program }}
                        </p>
                      }
                    </div>
                  </div>
                </div>
              </div>

              <!-- Documents Section -->
              <div class="bg-neo-light rounded-3xl shadow-neo p-6">
                <h2 class="text-lg font-bold text-gray-800 mb-4">Documents for Validation</h2>
                @if (application.documents && application.documents.length > 0) {
                  <div class="space-y-3">
                    @for (doc of application.documents; track doc.id) {
                      <div class="bg-white rounded-2xl p-4 shadow-neo-inset">
                        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div class="flex items-center space-x-4 flex-1">
                            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
                              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                              </svg>
                            </div>
                            <div class="flex-1 min-w-0">
                              <h4 class="font-semibold text-gray-900 truncate">{{ doc.name }}</h4>
                              <p class="text-sm text-gray-600">{{ doc.fileType }} • {{ doc.uploadedDate | date:'short' }}</p>
                            </div>
                          </div>
                          <div class="flex items-center space-x-2 w-full sm:w-auto">
                            <span [class]="getDocumentStatusClass(doc.validationStatus)" class="px-3 py-1 rounded-full text-xs font-medium">
                              {{ doc.validationStatus }}
                            </span>
                            @if (doc.validationStatus === 'PENDING') {
                              <button 
                                (click)="validateDocument(doc.id, true)"
                                class="px-3 py-1 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-all text-sm font-medium"
                              >
                                ✓ Approve
                              </button>
                              <button 
                                (click)="validateDocument(doc.id, false)"
                                class="px-3 py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-all text-sm font-medium"
                              >
                                ✗ Reject
                              </button>
                            }
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                } @else {
                  <div class="text-center py-8 text-gray-500">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                    </svg>
                    <p class="mt-2">No documents uploaded yet</p>
                  </div>
                }
              </div>

              <!-- Comments Section -->
              <div class="bg-neo-light rounded-3xl shadow-neo p-6">
                <h2 class="text-lg font-bold text-gray-800 mb-4">Review Comments</h2>
                <form [formGroup]="commentForm" (ngSubmit)="addComment()" class="space-y-4">
                  <div>
                    <textarea 
                      formControlName="comment"
                      rows="4"
                      class="w-full px-4 py-3 rounded-xl bg-white shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      placeholder="Add your review comments here..."
                    ></textarea>
                  </div>
                  <button 
                    type="submit"
                    [disabled]="commentForm.invalid || isSubmittingComment"
                    class="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 text-white font-semibold shadow-neo hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {{ isSubmittingComment ? 'Adding...' : 'Add Comment' }}
                  </button>
                </form>

                <!-- Existing Comments -->
                @if (application.comments && application.comments.length > 0) {
                  <div class="mt-6 space-y-3">
                    @for (comment of application.comments; track comment.id) {
                      <div class="bg-white rounded-xl p-4 shadow-neo-inset">
                        <div class="flex items-start space-x-3">
                          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center flex-shrink-0">
                            <span class="text-white text-xs font-bold">{{ comment.author?.substring(0, 2).toUpperCase() }}</span>
                          </div>
                          <div class="flex-1">
                            <div class="flex items-center justify-between">
                              <p class="font-semibold text-gray-900">{{ comment.author }}</p>
                              <span class="text-xs text-gray-500">{{ comment.date | date:'short' }}</span>
                            </div>
                            <p class="text-sm text-gray-700 mt-1">{{ comment.text }}</p>
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                }
              </div>
            </div>

            <!-- Sidebar -->
            <div class="space-y-6">
              <!-- Application Status -->
              <div class="bg-neo-light rounded-3xl shadow-neo p-6">
                <h3 class="text-lg font-bold text-gray-800 mb-4">Application Status</h3>
                <div class="space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Current Status</span>
                    <span [class]="getStatusBadgeClass(application.status)" class="px-3 py-1 rounded-full text-xs font-medium">
                      {{ application.status }}
                    </span>
                  </div>
                  @if (application.completionRate !== undefined) {
                    <div>
                      <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-600">Completion</span>
                        <span class="text-sm font-semibold text-gray-900">{{ application.completionRate }}%</span>
                      </div>
                      <div class="w-full bg-gray-200 h-2 rounded-full">
                        <div 
                          class="bg-gradient-to-r from-primary-500 to-primary-700 h-full rounded-full transition-all"
                          [style.width.%]="application.completionRate"
                        ></div>
                      </div>
                    </div>
                  }
                  @if (application.submittedDate) {
                    <div class="flex justify-between items-center">
                      <span class="text-sm text-gray-600">Submitted</span>
                      <span class="text-sm text-gray-900">{{ application.submittedDate | date:'MMM d, yyyy' }}</span>
                    </div>
                  }
                  @if (application.assignedDate) {
                    <div class="flex justify-between items-center">
                      <span class="text-sm text-gray-600">Assigned</span>
                      <span class="text-sm text-gray-900">{{ application.assignedDate | date:'MMM d, yyyy' }}</span>
                    </div>
                  }
                </div>
              </div>

              <!-- Quick Actions -->
              <div class="bg-neo-light rounded-3xl shadow-neo p-6">
                <h3 class="text-lg font-bold text-gray-800 mb-4">Review Actions</h3>
                <div class="space-y-3">
                  <button 
                    (click)="openApproveModal()"
                    [disabled]="application.status === 'APPROVED'"
                    class="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold shadow-neo hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ✓ Approve Application
                  </button>
                  <button 
                    (click)="openRejectModal()"
                    [disabled]="application.status === 'REJECTED'"
                    class="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow-neo hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ✗ Reject Application
                  </button>
                </div>
              </div>

              <!-- Document Summary -->
              <div class="bg-neo-light rounded-3xl shadow-neo p-6">
                <h3 class="text-lg font-bold text-gray-800 mb-4">Document Summary</h3>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Total Documents</span>
                    <span class="font-semibold">{{ application.documents?.length || 0 }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Validated</span>
                    <span class="font-semibold text-green-600">{{ getDocumentCount('VALIDATED') }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Pending</span>
                    <span class="font-semibold text-yellow-600">{{ getDocumentCount('PENDING') }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Rejected</span>
                    <span class="font-semibold text-red-600">{{ getDocumentCount('REJECTED') }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      } @else {
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div class="text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <p class="mt-4 text-gray-600">Application not found or you don't have access to this application.</p>
            <button (click)="goBack()" class="mt-4 px-6 py-3 rounded-xl bg-primary-500 text-white font-medium hover:shadow-lg transition-all">
              Go Back
            </button>
          </div>
        </div>
      }
    </div>
  `
})
export class ApplicationReviewComponent implements OnInit {
  applicationId: string = '';
  application: ApplicationDetail | null = null;
  loading = true;
  commentForm: FormGroup;
  isSubmittingComment = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.commentForm = this.fb.group({
      comment: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit() {
    // Check if user is an agent
    if (!this.authService.isAgent() && !this.authService.isSuperAdmin()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.applicationId = this.route.snapshot.params['id'];
    this.loadApplication();
  }

  loadApplication() {
    this.loading = true;
    this.adminService.getApplicationDetails(this.applicationId).subscribe({
      next: (response) => {
        this.application = response;
        this.loading = false;
        console.log('Application loaded:', this.application);
      },
      error: (error) => {
        console.error('Failed to load application:', error);
        this.loading = false;
      }
    });
  }

  getInitials(): string {
    if (!this.application?.candidate) return 'NA';
    const first = this.application.candidate.firstName?.[0] || '';
    const last = this.application.candidate.lastName?.[0] || '';
    return (first + last).toUpperCase();
  }

  getStatusBadgeClass(status: string): string {
    const classes: any = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'UNDER_REVIEW': 'bg-blue-100 text-blue-800',
      'APPROVED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  getDocumentStatusClass(status: string): string {
    const classes: any = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'VALIDATED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  getDocumentCount(status: string): number {
    if (!this.application?.documents) return 0;
    return this.application.documents.filter(doc => doc.validationStatus === status).length;
  }

  validateDocument(documentId: string, isApproved: boolean) {
    const comment = isApproved ? 'Document approved by agent' : 'Document rejected by agent';
    
    this.adminService.validateDocument(documentId, isApproved, comment).subscribe({
      next: () => {
        // Reload application to get updated document statuses
        this.loadApplication();
        console.log(`Document ${isApproved ? 'approved' : 'rejected'}`);
      },
      error: (error) => {
        console.error('Failed to validate document:', error);
        alert('Failed to validate document. Please try again.');
      }
    });
  }

  addComment() {
    if (this.commentForm.valid && !this.isSubmittingComment) {
      this.isSubmittingComment = true;
      const commentText = this.commentForm.value.comment;

      this.adminService.addComment(this.applicationId, commentText).subscribe({
        next: () => {
          this.isSubmittingComment = false;
          this.commentForm.reset();
          this.loadApplication(); // Reload to show new comment
        },
        error: (error) => {
          console.error('Failed to add comment:', error);
          this.isSubmittingComment = false;
          alert('Failed to add comment. Please try again.');
        }
      });
    }
  }

  openApproveModal() {
    const comment = prompt('Add approval comment (optional):');
    if (comment !== null) { // null means cancelled
      this.approveApplication(comment || undefined);
    }
  }

  openRejectModal() {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      this.rejectApplication(reason);
    } else if (reason !== null) {
      alert('Rejection reason is required');
    }
  }

  approveApplication(comment?: string) {
    this.adminService.approveApplication(this.applicationId, comment).subscribe({
      next: () => {
        alert('Application approved successfully!');
        this.loadApplication(); // Reload to show updated status
      },
      error: (error) => {
        console.error('Failed to approve application:', error);
        alert('Failed to approve application. Please try again.');
      }
    });
  }

  rejectApplication(reason: string) {
    this.adminService.rejectApplication(this.applicationId, reason).subscribe({
      next: () => {
        alert('Application rejected.');
        this.loadApplication(); // Reload to show updated status
      },
      error: (error) => {
        console.error('Failed to reject application:', error);
        alert('Failed to reject application. Please try again.');
      }
    });
  }

  goBack() {
    this.router.navigate(['/agent/dashboard']);
  }
}