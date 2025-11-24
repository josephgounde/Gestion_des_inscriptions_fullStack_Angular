
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// DTOs for profile completion and agent creation
export interface AdministratorProfileDTO {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  // ...other fields
}

export interface AgentCreationDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  // ...other fields
}

interface ApplicationFilter {
  status?: string;
  program?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  size?: number;
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
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  // Complete super admin profile
  completeSuperAdminProfile(profile: AdministratorProfileDTO): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/profile/complete`,
      profile,
      { headers: this.getHeaders() }
    );
  }

  // Create a new agent (by super admin)
  createAgent(agent: AgentCreationDTO): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/profile/agent`,
      agent,
      { headers: this.getHeaders() }
    );
  }

  // Get all applications with filters
  getAllApplications(filter?: ApplicationFilter): Observable<any> {
    let params = new HttpParams();
    if (filter) {
      if (filter.status) params = params.set('status', filter.status);
      if (filter.program) params = params.set('program', filter.program);
      if (filter.dateFrom) params = params.set('dateFrom', filter.dateFrom);
      if (filter.dateTo) params = params.set('dateTo', filter.dateTo);
      if (filter.search) params = params.set('search', filter.search);
      if (filter.page) params = params.set('page', filter.page.toString());
      if (filter.size) params = params.set('size', filter.size.toString());
    }
    return this.http.get<any>(`${this.apiUrl}/applications`, { 
      headers: this.getHeaders(), 
      params 
    });
  }

  // Get application details
  getApplicationDetails(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/applications/${id}`, { headers: this.getHeaders() });
  }

  // Approve application
  approveApplication(id: string, comment?: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/applications/${id}/approve`, 
      { comment }, 
      { headers: this.getHeaders() }
    );
  }

  // Reject application
  rejectApplication(id: string, reason: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/applications/${id}/reject`, 
      { reason }, 
      { headers: this.getHeaders() }
    );
  }

  // Assign application to agent
  assignApplication(id: string, agentId: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/applications/${id}/assign`, 
      { agentId }, 
      { headers: this.getHeaders() }
    );
  }

  // Get statistics
  getStatistics(): Observable<Statistics> {
    return this.http.get<Statistics>(`${this.apiUrl}/statistics`, { headers: this.getHeaders() });
  }

  // Get analytics data
  getAnalytics(period: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/analytics?period=${period}`, { headers: this.getHeaders() });
  }

  // Export applications
  exportApplications(format: 'excel' | 'csv', filter?: ApplicationFilter): Observable<Blob> {
    let params = new HttpParams();
    params = params.set('format', format);
    if (filter) {
      if (filter.status) params = params.set('status', filter.status);
      if (filter.dateFrom) params = params.set('dateFrom', filter.dateFrom);
      if (filter.dateTo) params = params.set('dateTo', filter.dateTo);
    }
    return this.http.get(`${this.apiUrl}/applications/export`, { 
      headers: this.getHeaders(),
      params,
      responseType: 'blob'
    });
  }

  // Send notification
  sendNotification(applicationId: string, message: string, type: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/notifications`, 
      { applicationId, message, type }, 
      { headers: this.getHeaders() }
    );
  }

  // Get blocked applications (>48h)
  getBlockedApplications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/applications/blocked`, { headers: this.getHeaders() });
  }

  // Validate document
  validateDocument(documentId: string, status: boolean, comment?: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/documents/${documentId}/validate`,
      { status, comment },
      { headers: this.getHeaders() }
    );
  }

  // Add a comment to an application
  addComment(applicationId: string, text: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/applications/${applicationId}/comments`, { text }, { headers: this.getHeaders() });
  }
}