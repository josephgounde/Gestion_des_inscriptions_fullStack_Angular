// src/app/services/enrollment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface EnrollmentData {
  personalInfo: any;
  documents: any;
  academicInfo: any;
  contactInfo: any;
}

interface Application {
  id: string;
  candidateId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  completionRate: number;
}

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private apiUrl = `${environment.apiUrl}/enrollments`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Submit enrollment application
  submitEnrollment(data: EnrollmentData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, data, { headers: this.getHeaders() });
  }

  // Upload document
  uploadDocument(file: File, documentType: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', documentType);
    
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>(`${this.apiUrl}/documents`, formData, { headers });
  }

  // Get candidate's applications
  getMyApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/my-applications`, { headers: this.getHeaders() });
  }

  // Get application by ID
  getApplicationById(id: string): Observable<Application> {
    return this.http.get<Application>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Update application
  updateApplication(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data, { headers: this.getHeaders() });
  }

  // Save progress (draft)
  saveDraft(data: EnrollmentData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/draft`, data, { headers: this.getHeaders() });
  }

  // Get application status
  getApplicationStatus(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/status`, { headers: this.getHeaders() });
  }

  // Validate document
  validateDocument(documentId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/documents/${documentId}/validate`, {}, { headers: this.getHeaders() });
  }
}