// src/app/services/application.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Application Service
 * Handles enrollment form submission and application management
 */
@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Submit enrollment application with documents
   * POST /api/applications/submit
   * Requires: ROLE_CANDIDATE
   * 
   * This creates an application from the current user's profile
   * and uploads the provided documents
   */
  submitApplication(
    documents: { name: string; type: string; file: File }[]
  ): Observable<any> {
    const formData = new FormData();

    // Add documents to FormData
    if (documents && documents.length > 0) {
      documents.forEach((doc, index) => {
        // Add the file
        formData.append('files', doc.file);
        
        // Add document metadata
        formData.append('documentNames', doc.name);
        formData.append('documentTypes', doc.type);
      });
    }

    console.log('Submitting application with', documents.length, 'documents');

    // Send multipart/form-data request
    return this.http.post(
      `${this.apiUrl}/applications/submit`,
      formData
      // Note: Don't set Content-Type header - browser will set it automatically with boundary
    );
  }

  /**
   * Get applications by status for current user
   * GET /api/applications/status/{status}
   * Requires: ROLE_CANDIDATE
   */
  getApplicationsByStatus(status: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/applications/status/${status}`
    );
  }

  /**
   * Initiate recourse for rejected application
   * PUT /api/applications/recourse/{applicationId}
   * Requires: ROLE_CANDIDATE
   */
  initiateRecourse(applicationId: number, recourseType: string): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/applications/recourse/${applicationId}`,
      null,
      { params: { type: recourseType } }
    );
  }
}