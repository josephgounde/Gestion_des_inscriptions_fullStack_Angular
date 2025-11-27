// src/app/pages/candidate/notifications/notifications.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CandidateService, NotificationResponseDTO } from '../../../../services/candidate.service';

@Component({
  selector: 'app-candidate-notifications',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="flex flex-col lg:flex-row h-screen bg-gradient-to-br from-neo-light via-gray-100 to-neo-light">
      <!-- Mobile Header -->
      <header class="lg:hidden bg-white shadow-neo-sm sticky top-0 z-20">
        <div class="px-4 py-3 flex items-center justify-between">
          <button routerLink="/candidate/dashboard" class="p-2 rounded-lg hover:bg-gray-100">
            <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 class="text-lg font-bold text-gray-800">Notifications</h1>
          <button (click)="markAllAsRead()" class="text-sm text-primary-600 font-medium">
            Tout lire
          </button>
        </div>
      </header>

      <!-- Mobile Sidebar Toggle -->
      <button 
        (click)="toggleMobileSidebar()"
        class="lg:hidden fixed bottom-6 right-6 z-30 w-14 h-14 bg-gradient-to-r from-primary-500 to-primary-700 text-white rounded-full shadow-lg flex items-center justify-center"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>

      <!-- Sidebar Overlay (Mobile) -->
      @if (isMobileSidebarOpen) {
        <div class="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" (click)="closeMobileSidebar()"></div>
      }

      <!-- Sidebar -->
      <aside [class.translate-x-0]="isMobileSidebarOpen" 
             class="fixed lg:relative inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-slate-700 to-slate-800 text-white flex flex-col transform -translate-x-full lg:translate-x-0 transition-transform duration-300">
        <div class="p-6 flex items-center justify-between border-b border-slate-600">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <span class="text-white font-bold text-lg">E</span>
            </div>
            <span class="font-bold text-lg">EnrollPro</span>
          </div>
          <button (click)="closeMobileSidebar()" class="lg:hidden p-1 hover:bg-slate-600 rounded">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
          <a routerLink="/candidate/dashboard" class="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-600/30 transition-all" (click)="closeMobileSidebar()">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            <span class="text-sm font-medium">Dashboard</span>
          </a>
          <a routerLink="/candidate/enrollment" class="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-600/30 transition-all" (click)="closeMobileSidebar()">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <span class="text-sm font-medium">Mon Inscription</span>
          </a>
          <a routerLink="/candidate/documents" class="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-600/30 transition-all" (click)="closeMobileSidebar()">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
            <span class="text-sm font-medium">Documents</span>
          </a>
          <a routerLink="/candidate/notifications" class="flex items-center space-x-3 px-4 py-3 rounded-xl bg-slate-600/50 text-white" (click)="closeMobileSidebar()">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            <span class="text-sm font-medium">Notifications</span>
            @if (getUnreadCount() > 0) {
              <span class="ml-auto px-2 py-1 bg-red-500 text-white text-xs rounded-full">{{ getUnreadCount() }}</span>
            }
          </a>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-auto">
        <div class="p-4 sm:p-6 lg:p-8">
          <!-- Desktop Header -->
          <div class="hidden lg:flex items-center justify-between mb-6">
            <div>
              <h1 class="text-2xl lg:text-3xl font-bold text-gray-800">Notifications</h1>
              <p class="text-sm text-gray-600 mt-1">Restez informé de l'état de votre inscription</p>
            </div>
            <button 
              (click)="markAllAsRead()"
              class="px-4 py-2 bg-neo-light shadow-neo hover:shadow-neo-inset rounded-xl text-sm font-medium text-gray-700 transition-all flex items-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              <span>Tout marquer comme lu</span>
            </button>
          </div>

          <!-- Loading State -->
          @if (loading) {
            <div class="flex items-center justify-center py-12">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          }

          <!-- Error State -->
          @if (error && !loading) {
            <div class="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
              <svg class="w-12 h-12 mx-auto text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p class="text-red-700 mb-4">{{ error }}</p>
              <button (click)="loadNotifications()" class="px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all">
                Réessayer
              </button>
            </div>
          }

          <!-- Content -->
          @if (!loading && !error) {
            <!-- Stats Cards -->
            <div class="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
              <div class="bg-neo-light rounded-2xl shadow-neo p-4 sm:p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-xs sm:text-sm text-gray-600">Total</p>
                    <p class="text-xl sm:text-2xl font-bold text-gray-800">{{ notifications.length }}</p>
                  </div>
                  <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div class="bg-neo-light rounded-2xl shadow-neo p-4 sm:p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-xs sm:text-sm text-gray-600">Non lues</p>
                    <p class="text-xl sm:text-2xl font-bold text-red-600">{{ getUnreadCount() }}</p>
                  </div>
                  <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-red-100 flex items-center justify-center">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div class="bg-neo-light rounded-2xl shadow-neo p-4 sm:p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-xs sm:text-sm text-gray-600">Lues</p>
                    <p class="text-xl sm:text-2xl font-bold text-green-600">{{ getReadCount() }}</p>
                  </div>
                  <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Filter Tabs -->
            <div class="mb-6">
              <div class="flex flex-wrap gap-2">
                <button 
                  (click)="filterNotifications('ALL')"
                  [class.bg-primary-500]="currentFilter === 'ALL'"
                  [class.text-white]="currentFilter === 'ALL'"
                  [class.bg-white]="currentFilter !== 'ALL'"
                  [class.text-gray-700]="currentFilter !== 'ALL'"
                  class="px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-neo-sm hover:shadow-neo"
                >
                  Toutes ({{ notifications.length }})
                </button>
                <button 
                  (click)="filterNotifications('UNREAD')"
                  [class.bg-red-500]="currentFilter === 'UNREAD'"
                  [class.text-white]="currentFilter === 'UNREAD'"
                  [class.bg-white]="currentFilter !== 'UNREAD'"
                  [class.text-gray-700]="currentFilter !== 'UNREAD'"
                  class="px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-neo-sm hover:shadow-neo"
                >
                  Non lues ({{ getUnreadCount() }})
                </button>
                <button 
                  (click)="filterNotifications('EMAIL')"
                  [class.bg-blue-500]="currentFilter === 'EMAIL'"
                  [class.text-white]="currentFilter === 'EMAIL'"
                  [class.bg-white]="currentFilter !== 'EMAIL'"
                  [class.text-gray-700]="currentFilter !== 'EMAIL'"
                  class="px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-neo-sm hover:shadow-neo"
                >
                  Email
                </button>
                <button 
                  (click)="filterNotifications('SMS')"
                  [class.bg-green-500]="currentFilter === 'SMS'"
                  [class.text-white]="currentFilter === 'SMS'"
                  [class.bg-white]="currentFilter !== 'SMS'"
                  [class.text-gray-700]="currentFilter !== 'SMS'"
                  class="px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-neo-sm hover:shadow-neo"
                >
                  SMS
                </button>
                <button 
                  (click)="filterNotifications('IN_APP')"
                  [class.bg-purple-500]="currentFilter === 'IN_APP'"
                  [class.text-white]="currentFilter === 'IN_APP'"
                  [class.bg-white]="currentFilter !== 'IN_APP'"
                  [class.text-gray-700]="currentFilter !== 'IN_APP'"
                  class="px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-neo-sm hover:shadow-neo"
                >
                  App
                </button>
              </div>
            </div>

            <!-- Notifications List -->
            <div class="space-y-3 sm:space-y-4">
              @for (notification of getFilteredNotifications(); track notification.notificationId) {
                <div 
                  [class]="getNotificationClass(notification)"
                  class="rounded-2xl shadow-neo p-4 sm:p-6 cursor-pointer hover:shadow-neo-lg transition-all border-l-4"
                  (click)="markAsRead(notification)"
                >
                  <div class="flex items-start justify-between gap-4">
                    <div class="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
                      <div [class]="getIconClass(notification.type)" class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span class="text-xl sm:text-2xl">{{ getNotificationTypeIcon(notification.type) }}</span>
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-start justify-between gap-2">
                          <p [class.font-bold]="!notification.isRead" [class.font-medium]="notification.isRead" class="text-sm sm:text-base text-gray-800">
                            {{ notification.message }}
                          </p>
                          @if (!notification.isRead) {
                            <span class="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-2"></span>
                          }
                        </div>
                        <div class="flex flex-wrap items-center gap-2 sm:gap-4 mt-3">
                          <span class="text-xs text-gray-500 flex items-center">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            {{ getTimeAgo(notification.timestamp) }}
                          </span>
                          <span class="text-xs px-2 py-1 rounded-lg bg-gray-100 text-gray-700">
                            {{ getNotificationTypeLabel(notification.type) }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button 
                      (click)="deleteNotification(notification); $event.stopPropagation()"
                      class="p-2 hover:bg-gray-100 rounded-lg transition-all flex-shrink-0"
                    >
                      <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                </div>
              } @empty {
                <div class="text-center py-12">
                  <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                  </svg>
                  <p class="text-gray-600 mb-2">Aucune notification</p>
                  <p class="text-sm text-gray-500">Vous êtes à jour!</p>
                </div>
              }
            </div>
          }
        </div>
      </main>
    </div>
  `
})
export class CandidateNotificationsComponent implements OnInit {
  isMobileSidebarOpen = false;
  currentFilter: 'ALL' | 'UNREAD' | 'EMAIL' | 'SMS' | 'IN_APP' = 'ALL';
  notifications: NotificationResponseDTO[] = [];
  loading = false;
  error: string | null = null;

  constructor(private candidateService: CandidateService) {}

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    this.loading = true;
    this.error = null;
    
    this.candidateService.getMyNotifications().subscribe({
      next: (notifications) => {
        this.notifications = notifications;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load notifications', err);
        this.error = 'Impossible de charger les notifications. Veuillez réessayer.';
        this.loading = false;
      }
    });
  }

  toggleMobileSidebar() {
    this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
  }

  closeMobileSidebar() {
    this.isMobileSidebarOpen = false;
  }

  filterNotifications(filter: 'ALL' | 'UNREAD' | 'EMAIL' | 'SMS' | 'IN_APP') {
    this.currentFilter = filter;
  }

  getFilteredNotifications(): NotificationResponseDTO[] {
    if (this.currentFilter === 'ALL') {
      return this.notifications;
    }
    if (this.currentFilter === 'UNREAD') {
      return this.notifications.filter(n => !n.isRead);
    }
    return this.notifications.filter(n => n.type === this.currentFilter);
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  getReadCount(): number {
    return this.notifications.filter(n => n.isRead).length;
  }

  getNotificationClass(notification: NotificationResponseDTO): string {
    const baseClass = notification.isRead ? 'bg-white' : 'bg-neo-light';
    const borderColors = {
      'EMAIL': 'border-blue-500',
      'SMS': 'border-green-500',
      'IN_APP': 'border-purple-500'
    };
    return `${baseClass} ${borderColors[notification.type as keyof typeof borderColors] || 'border-gray-500'}`;
  }

  getIconClass(type: string): string {
    const classes = {
      'EMAIL': 'bg-blue-100 text-blue-600',
      'SMS': 'bg-green-100 text-green-600',
      'IN_APP': 'bg-purple-100 text-purple-600'
    };
    return classes[type as keyof typeof classes] || 'bg-gray-100 text-gray-600';
  }

  getNotificationTypeIcon(type: string): string {
    return this.candidateService.getNotificationTypeIcon(type);
  }

  getNotificationTypeLabel(type: string): string {
    switch (type) {
      case 'EMAIL': return 'Email';
      case 'SMS': return 'SMS';
      case 'IN_APP': return 'Application';
      default: return type;
    }
  }

  getTimeAgo(timestamp: string): string {
    const date = new Date(timestamp);
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'À l\'instant';
    if (seconds < 3600) return `Il y a ${Math.floor(seconds / 60)} min`;
    if (seconds < 86400) return `Il y a ${Math.floor(seconds / 3600)} h`;
    if (seconds < 604800) return `Il y a ${Math.floor(seconds / 86400)} j`;
    
    return date.toLocaleDateString('fr-FR');
  }

  markAsRead(notification: NotificationResponseDTO) {
    if (notification.isRead) return;

    // Note: This requires backend endpoint PUT /api/candidate/notifications/{id}/read
    // For now, just mark locally
    notification.isRead = true;
    
    // TODO: Uncomment when backend endpoint is ready
    /*
    this.candidateService.markNotificationAsRead(notification.notificationId).subscribe({
      next: () => {
        notification.isRead = true;
      },
      error: (err) => {
        console.error('Failed to mark notification as read', err);
        notification.isRead = false; // Revert on error
      }
    });
    */
  }

  markAllAsRead() {
    // Mark all as read locally
    this.notifications.forEach(n => n.isRead = true);
    
    // TODO: Uncomment when backend endpoint is ready
    /*
    this.candidateService.markAllNotificationsAsRead().subscribe({
      next: () => {
        this.notifications.forEach(n => n.isRead = true);
      },
      error: (err) => {
        console.error('Failed to mark all notifications as read', err);
        alert('Impossible de marquer toutes les notifications comme lues.');
      }
    });
    */
  }

  deleteNotification(notification: NotificationResponseDTO) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette notification?')) {
      return;
    }

    // Delete locally
    const index = this.notifications.indexOf(notification);
    if (index > -1) {
      this.notifications.splice(index, 1);
    }

    // TODO: Uncomment when backend endpoint is ready
    /*
    this.candidateService.deleteNotification(notification.notificationId).subscribe({
      next: () => {
        const index = this.notifications.indexOf(notification);
        if (index > -1) {
          this.notifications.splice(index, 1);
        }
      },
      error: (err) => {
        console.error('Failed to delete notification', err);
        alert('Impossible de supprimer la notification.');
        // Reload to restore
        this.loadNotifications();
      }
    });
    */
  }
}