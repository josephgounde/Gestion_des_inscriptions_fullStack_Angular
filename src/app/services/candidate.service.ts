// src/app/pages/candidate/dashboard/candidate-dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


// NOTE: Since I cannot create a separate file, I will define the necessary types here for clarity.
// In a real project, put these interfaces in a shared file (e.g., candidate-dashboard.types.ts).

// --- DTO Interfaces based on Backend ---

export interface NotificationResponseDTO {
  id: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'; // Use backend enum names
  title: string;
  message: string;
  createdAt: string; // ISO Date String
  read: boolean;
}

export interface DocumentResponseDTO {
  id: string;
  name: string;
  fileType: string;
  validationStatus: 'PENDING' | 'VALIDATED' | 'REJECTED';
}

export interface ApplicationStepStatus {
  step: string;
  status: 'completed' | 'current' | 'pending';
  date?: string; // ISO Date String
  message?: string;
}

// Main DTO for the dashboard
export interface DashboardData {
  username: string;
  applicantName: string;
  currentStep: number;
  totalSteps: number;
  documentsStatus: DocumentResponseDTO[];
  applicationStatuses: ApplicationStepStatus[]; // Array of application progress steps
  recentNotifications: NotificationResponseDTO[];
}


@Injectable({
  providedIn: 'root'
})
export class CandidateDashboardService {
  private apiUrl = '/api/applications'; // Adjust the base path if needed

  constructor(private http: HttpClient) { }

  /**
   * Fetches the complete dashboard data for the currently authenticated candidate.
   */
  getDashboardData(): Observable<DashboardData> {
    // Assumes the backend endpoint is protected and uses the current user's security context.
    return this.http.get<DashboardData>(`${this.apiUrl}/status`);
  }

  // A method to mark a notification as read (optional, but good practice)
  markNotificationAsRead(notificationId: string): Observable<void> {
    return this.http.post<void>(`/api/notifications/${notificationId}/read`, {});
  }
}