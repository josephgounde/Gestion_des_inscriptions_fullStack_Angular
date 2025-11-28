import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface AdministratorProfileDTO {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface AgentCreationDTO {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

interface Statistics {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  underReview: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ============= APPLICATION MANAGEMENT =============
  
  getAllApplications(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/applications/all`).pipe(
      catchError(err => {
        console.error('❌ Error loading applications:', err);
        return throwError(() => err);
      })
    );
  }

  getApplicationDetails(id: string): Observable<any> {
    return this.getAllApplications().pipe(
      map((apps: any[]) => {
        console.log('🔍 Looking for application ID:', id);
        console.log('📋 Available applications:', apps);
        
        const app = apps.find(a => 
          String(a.applicationId) === String(id) || 
          String(a.id) === String(id)
        );
        
        if (!app) {
          console.error('❌ Application not found');
          throw new Error(`Application ${id} not found`);
        }
        
        console.log('✅ Found application:', app);
        return app;
      })
    );
  }

  getStatistics(): Observable<Statistics> {
    return this.getAllApplications().pipe(
      map((applications: any[]) => {
        if (!Array.isArray(applications)) {
          applications = [];
        }
        
        return {
          total: applications.length,
          pending: applications.filter(a => 
            a.status === 'PRE_VALIDATION' || 
            a.status === 'PENDING'
          ).length,
          approved: applications.filter(a => a.status === 'APPROVED').length,
          rejected: applications.filter(a => a.status === 'REJECTED').length,
          underReview: applications.filter(a => 
            a.status === 'MANUAL_REVIEW' || 
            a.status === 'UNDER_REVIEW'
          ).length
        };
      })
    );
  }

  // ============= DOCUMENT VALIDATION =============
  
  validateDocument(documentId: string | number): Observable<any> {
    const url = `${this.apiUrl}/documents/validate/${documentId}`;
    console.log('🔄 Validating document at:', url);
    
    // ✅ NO HEADERS - Let interceptor handle authentication
    return this.http.post<any>(url, {}).pipe(
      catchError(err => {
        console.error('❌ Validation failed:', err);
        if (err.status === 401) {
          console.error('🔒 Authentication failed - check token');
        }
        return throwError(() => err);
      })
    );
  }

  rejectDocument(documentId: string | number, reason?: string): Observable<any> {
    const url = `${this.apiUrl}/documents/reject/${documentId}`;
    console.log('🔄 Rejecting document at:', url);
    
    return this.http.post<any>(url, { reason: reason || 'Document rejected' }).pipe(
      catchError(err => {
        console.error('❌ Rejection failed:', err);
        return throwError(() => err);
      })
    );
  }

  // ============= APPLICATION REVIEW =============
  
  approveApplication(id: string, comment?: string): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/applications/review/${id}`, 
      { decision: 'APPROVE', comment }
    );
  }

  rejectApplication(id: string, reason: string): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/applications/review/${id}`, 
      { decision: 'REJECT', reason }
    );
  }

  // ============= AGENT ASSIGNMENT =============
  
  assignApplication(applicationId: string, agentId: string): Observable<any> {
    const url = `${this.apiUrl}/applications/${applicationId}/assign`;
    console.log('👤 Assigning application at:', url);
    
    return this.http.post<any>(url, { agentId }).pipe(
      catchError(err => {
        console.error('❌ Assignment failed:', err);
        return throwError(() => err);
      })
    );
  }

  // Get list of available agents
  getAgents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/agents`).pipe(
      catchError(err => {
        console.error('❌ Error loading agents:', err);
        // Return empty array as fallback
        return [];
      })
    );
  }

  // ============= ADMIN PROFILE =============
  
  completeSuperAdminProfile(profile: AdministratorProfileDTO): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/admin/profile/complete`,
      profile
    );
  }

  createAgent(agent: AgentCreationDTO): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/admin/profile/agent`,
      agent
    );
  }

  // ============= ANALYTICS =============
  
  getAnalytics(period: string): Observable<any> {
    return this.getAllApplications().pipe(
      map((applications: any[]) => {
        return {
          period,
          totalApplications: applications.length,
          byStatus: {
            pending: applications.filter(a => a.status === 'PRE_VALIDATION').length,
            approved: applications.filter(a => a.status === 'APPROVED').length,
            rejected: applications.filter(a => a.status === 'REJECTED').length
          }
        };
      })
    );
  }

  getBlockedApplications(): Observable<any[]> {
    return this.getAllApplications().pipe(
      map((applications: any[]) => {
        const now = new Date();
        const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
        
        return applications.filter(app => {
          const submissionDate = app.submissionDate ? new Date(app.submissionDate) : null;
          return submissionDate && submissionDate < fortyEightHoursAgo && 
                 app.status === 'PRE_VALIDATION';
        });
      })
    );
  }

  // ============= COMMENTS =============
  
  addComment(applicationId: string, text: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/applications/${applicationId}/comments`, 
      { text }
    );
  }

  // ============= EXPORT =============
  
  exportApplications(format: 'excel' | 'csv'): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/applications/export?format=${format}`, { 
      responseType: 'blob'
    });
  }

  sendNotification(applicationId: string, message: string, type: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/notifications`, 
      { applicationId, message, type }
    );
  }
}