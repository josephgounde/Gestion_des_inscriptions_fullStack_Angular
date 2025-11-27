// src/app/services/candidate.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// ===== ENUMS (matching backend) =====

export type ApplicationStatus = 
  | 'PRE_VALIDATION' 
  | 'MANUAL_REVIEW' 
  | 'REJECTED' 
  | 'PENDING_RECOURSE' 
  | 'APPROVED';

export type ValidationStatus = 'PENDING' | 'VALIDATED' | 'REJECTED';

export type NotificationType = 'EMAIL' | 'SMS' | 'IN_APP';

export type NotificationStatus = 'SENT' | 'FAILED' | 'READ' | 'UNREAD';

// ===== DTOs (matching backend structure) =====

/**
 * Document Response DTO
 * Based on: DocumentResponseDTO.java
 */
export interface DocumentResponseDTO {
  id: number;
  name: string;
  fileType: string;
  validationStatus: string; // 'PENDING' | 'VALIDATED' | 'REJECTED'
  ocrNotes?: string;
}

/**
 * Notification Response DTO
 * Based on: NotificationResponseDTO.java
 */
export interface NotificationResponseDTO {
  notificationId: number;
  message: string;
  type: string; // 'EMAIL' | 'SMS' | 'IN_APP'
  timestamp: string; // ISO date string (LocalDateTime from backend)
  isRead: boolean; // mapped from status == READ
}

/**
 * Application Status Response DTO
 * Based on: ApplicationStatusResponseDto.java from ApplicationController
 */
export interface ApplicationStatusResponseDTO {
  applicationId: number;
  status: string; // ApplicationStatus as string
  completionRate: number;
  submissionDate: string; // ISO date string (LocalDateTime)
  assignedAdminId?: number;
  assignedAdminUsername?: string;
  username: string;
  applicantName: string;
  documentsStatus: DocumentResponseDTO[];
  recentNotifications: NotificationResponseDTO[];
}

/**
 * Dashboard Data combining application status info
 */
export interface DashboardData {
  application?: ApplicationStatusResponseDTO; // Optional - null if no application yet
  currentStep: number;
  totalSteps: number;
  hasApplication: boolean; // Flag to indicate if user has an application
}

/**
 * User Profile DTO
 * Based on: UserResponseDTO.java from UserController GET /api/users/me
 * Used for pre-filling enrollment form with registration data
 */
export interface UserProfileDTO {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;     // ✅ Changed from 'phone' to match backend
  gender?: string;
  dateOfBirth?: string;    // ✅ Changed from 'birthDate' to match backend (ISO date string)
  address?: string;
  nationality?: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  private apiUrl = environment.apiUrl || 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // ========== APPLICATION ENDPOINTS ==========

  /**
   * Submit a new application with documents
   * POST /api/applications/submit
   * Requires: ROLE_CANDIDATE
   */
  submitApplication(
    documentNames: string[],
    documentTypes: string[],
    files: File[]
  ): Observable<ApplicationStatusResponseDTO> {
    const formData = new FormData();
    
    // Append arrays
    documentNames.forEach(name => formData.append('documentNames', name));
    documentTypes.forEach(type => formData.append('documentTypes', type));
    files.forEach(file => formData.append('files', file));

    return this.http.post<ApplicationStatusResponseDTO>(
      `${this.apiUrl}/applications/submit`,
      formData
    );
  }

  /**
   * Get applications by status for current user
   * GET /api/applications/status/{status}
   * Requires: ROLE_CANDIDATE
   */
  getApplicationsByStatus(status: ApplicationStatus): Observable<ApplicationStatusResponseDTO[]> {
    return this.http.get<ApplicationStatusResponseDTO[]>(
      `${this.apiUrl}/applications/status/${status}`
    );
  }

  /**
   * Get the current user's dashboard data
   * This returns dashboard data regardless of application status
   * If no application exists, returns a default state with hasApplication: false
   * GET /api/applications/status/PRE_VALIDATION or other statuses
   */
  getDashboardData(): Observable<DashboardData> {
    return new Observable(observer => {
      // First try to get PRE_VALIDATION applications
      this.getApplicationsByStatus('PRE_VALIDATION').subscribe({
        next: (preValidationApps) => {
          if (preValidationApps.length > 0) {
            // Has application - return with data
            observer.next({
              application: preValidationApps[0],
              currentStep: this.getStepFromStatus(preValidationApps[0].status),
              totalSteps: 5,
              hasApplication: true
            });
            observer.complete();
          } else {
            // No PRE_VALIDATION, try other statuses
            this.getApplicationsByStatus('MANUAL_REVIEW').subscribe({
              next: (manualReviewApps) => {
                if (manualReviewApps.length > 0) {
                  // Has application in review
                  observer.next({
                    application: manualReviewApps[0],
                    currentStep: this.getStepFromStatus(manualReviewApps[0].status),
                    totalSteps: 5,
                    hasApplication: true
                  });
                  observer.complete();
                } else {
                  // No application found - this is OK for new users!
                  // Return default dashboard data
                  observer.next({
                    application: undefined,
                    currentStep: 0,
                    totalSteps: 5,
                    hasApplication: false
                  });
                  observer.complete();
                }
              },
              error: (err) => {
                // Error getting MANUAL_REVIEW - assume no application
                console.warn('Could not fetch applications, assuming new user:', err);
                observer.next({
                  application: undefined,
                  currentStep: 0,
                  totalSteps: 5,
                  hasApplication: false
                });
                observer.complete();
              }
            });
          }
        },
        error: (err) => {
          // Error getting PRE_VALIDATION - assume no application
          console.warn('Could not fetch applications, assuming new user:', err);
          observer.next({
            application: undefined,
            currentStep: 0,
            totalSteps: 5,
            hasApplication: false
          });
          observer.complete();
        }
      });
    });
  }

  /**
   * Initiate recourse process for a rejected application
   * PUT /api/applications/recourse/{applicationId}
   * Requires: ROLE_CANDIDATE
   */
  handleRecourse(applicationId: number, recourseType: string): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/applications/recourse/${applicationId}`,
      null,
      { params: { type: recourseType } }
    );
  }

  // ========== DOCUMENT ENDPOINTS ==========

  /**
   * Upload a document for an application
   * POST /api/documents/upload/{applicationId}
   * Requires: ROLE_CANDIDATE
   */
  uploadDocument(
    applicationId: number,
    documentType: string,
    file: File
  ): Observable<DocumentResponseDTO> {
    const formData = new FormData();
    formData.append('documentType', documentType);
    formData.append('file', file);

    return this.http.post<DocumentResponseDTO>(
      `${this.apiUrl}/documents/upload/${applicationId}`,
      formData
    );
  }

  /**
   * Get all documents for a specific application
   * GET /api/documents/application/{applicationId}
   * Requires: ROLE_AGENT or ROLE_SUPER_ADMIN
   * Note: For candidates, documents are included in ApplicationStatusResponseDTO
   */
  getDocumentsByApplication(applicationId: number): Observable<DocumentResponseDTO[]> {
    return this.http.get<DocumentResponseDTO[]>(
      `${this.apiUrl}/documents/application/${applicationId}`
    );
  }

  /**
   * Get documents for the current candidate's application
   * This extracts documents from the application status response
   * Returns empty array if user has no application yet
   */
  getMyDocuments(): Observable<DocumentResponseDTO[]> {
    return new Observable(observer => {
      this.getDashboardData().subscribe({
        next: (data) => {
          if (data.hasApplication && data.application) {
            observer.next(data.application.documentsStatus || []);
          } else {
            // User has no application yet - return empty array
            observer.next([]);
          }
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  // ========== NOTIFICATION ENDPOINTS ==========

  /**
   * Get recent notifications for current user
   * These are included in the ApplicationStatusResponseDTO
   * Returns empty array if user has no application yet
   */
  getMyNotifications(): Observable<NotificationResponseDTO[]> {
    return new Observable(observer => {
      this.getDashboardData().subscribe({
        next: (data) => {
          if (data.hasApplication && data.application) {
            observer.next(data.application.recentNotifications || []);
          } else {
            // User has no application yet - return empty array
            observer.next([]);
          }
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  /**
   * Mark notification as read (if you implement this endpoint)
   * This would need to be added to your backend
   */
  markNotificationAsRead(notificationId: number): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/notifications/${notificationId}/read`,
      {}
    );
  }

  /**
   * Get unread notification count
   */
  getUnreadNotificationCount(): Observable<number> {
    return new Observable(observer => {
      this.getMyNotifications().subscribe({
        next: (notifications) => {
          const unreadCount = notifications.filter(n => !n.isRead).length;
          observer.next(unreadCount);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  // ========== USER PROFILE ENDPOINT ==========

  /**
   * Get current user profile for pre-filling enrollment form
   * GET /api/users/me
   * Requires: ROLE_CANDIDATE
   * 
   * This is used to pre-fill the enrollment form with data
   * already provided during registration, improving UX.
   */
  getCurrentUserProfile(): Observable<UserProfileDTO> {
    return this.http.get<UserProfileDTO>(`${this.apiUrl}/users/me`);
  }

  // ========== HELPER METHODS ==========

  /**
   * Map application status to step number
   */
  private getStepFromStatus(status: string): number {
    switch (status) {
      case 'PRE_VALIDATION': return 1;
      case 'MANUAL_REVIEW': return 2;
      case 'REJECTED': return 3;
      case 'PENDING_RECOURSE': return 3;
      case 'APPROVED': return 5;
      default: return 1;
    }
  }

  /**
   * Get status label in French
   */
  getStatusLabel(status: string): string {
    switch (status) {
      case 'PRE_VALIDATION': return 'Pré-validation';
      case 'MANUAL_REVIEW': return 'Examen manuel';
      case 'REJECTED': return 'Rejeté';
      case 'PENDING_RECOURSE': return 'Recours en cours';
      case 'APPROVED': return 'Approuvé';
      default: return status;
    }
  }

  /**
   * Get validation status label in French
   */
  getValidationStatusLabel(status: string): string {
    switch (status) {
      case 'PENDING': return 'En attente';
      case 'VALIDATED': return 'Validé';
      case 'REJECTED': return 'Rejeté';
      default: return status;
    }
  }

  /**
   * Get notification type icon
   */
  getNotificationTypeIcon(type: string): string {
    switch (type) {
      case 'EMAIL': return '📧';
      case 'SMS': return '📱';
      case 'IN_APP': return '🔔';
      default: return '📬';
    }
  }
}