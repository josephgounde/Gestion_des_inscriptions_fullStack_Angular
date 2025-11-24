// src/app/services/notification.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  date: Date;
  read: boolean;
  actionUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/notifications`;
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();
  
  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadNotifications();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Load notifications from API
  loadNotifications(): void {
    this.http.get<Notification[]>(`${this.apiUrl}`, { headers: this.getHeaders() })
      .subscribe({
        next: (notifications) => {
          this.notificationsSubject.next(notifications);
          this.updateUnreadCount(notifications);
        },
        error: (error) => {
          console.error('Error loading notifications:', error);
        }
      });
  }

  // Get all notifications
  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}`, { headers: this.getHeaders() });
  }

  // Mark notification as read
  markAsRead(notificationId: string): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/${notificationId}/read`,
      {},
      { headers: this.getHeaders() }
    );
  }

  // Mark all notifications as read
  markAllAsRead(): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/read-all`,
      {},
      { headers: this.getHeaders() }
    );
  }

  // Delete notification
  deleteNotification(notificationId: string): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}/${notificationId}`,
      { headers: this.getHeaders() }
    );
  }

  // Get unread count
  getUnreadCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/unread-count`, { headers: this.getHeaders() });
  }

  // Update unread count locally
  private updateUnreadCount(notifications: Notification[]): void {
    const unreadCount = notifications.filter(n => !n.read).length;
    this.unreadCountSubject.next(unreadCount);
  }

  // Show toast notification (client-side)
  showToast(type: 'info' | 'success' | 'warning' | 'error', message: string, duration: number = 3000): void {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 p-4 rounded-xl shadow-neo animate-fade-in max-w-md ${this.getToastClass(type)}`;
    toast.innerHTML = `
      <div class="flex items-start space-x-3">
        ${this.getToastIcon(type)}
        <div class="flex-1">
          <p class="text-sm font-medium">${message}</p>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" class="text-gray-500 hover:text-gray-700">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    `;

    document.body.appendChild(toast);

    // Auto remove after duration
    setTimeout(() => {
      toast.classList.add('opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  private getToastClass(type: string): string {
    const classes: any = {
      'info': 'bg-blue-50 border-l-4 border-blue-500',
      'success': 'bg-green-50 border-l-4 border-green-500',
      'warning': 'bg-yellow-50 border-l-4 border-yellow-500',
      'error': 'bg-red-50 border-l-4 border-red-500'
    };
    return classes[type] || classes['info'];
  }

  private getToastIcon(type: string): string {
    const icons: any = {
      'info': '<svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
      'success': '<svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
      'warning': '<svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>',
      'error': '<svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
    };
    return icons[type] || icons['info'];
  }
}