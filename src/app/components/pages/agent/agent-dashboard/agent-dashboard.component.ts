// src/app/pages/agent/agent-dashboard/agent-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../services/admin.service';
import { AuthService } from '../../../../services/auth.service';

interface Application {
  id: string;
  candidateName: string;
  email: string;
  program: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  submittedDate: Date;
  completionRate: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  avatar: string;
  assignedDate?: Date;
}

@Component({
  selector: 'app-agent-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-neo-light via-gray-100 to-neo-light">
      <!-- Header -->
      <header class="bg-white shadow-neo-sm mb-6">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 class="text-2xl sm:text-3xl font-bold text-gray-800">Agent Dashboard</h1>
              <p class="text-sm text-gray-600 mt-1">Review and validate assigned applications</p>
            </div>
            <div class="flex items-center space-x-3">
              <span class="px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-full">
                AGENT
              </span>
              <button (click)="logout()" class="px-4 py-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 transition-all flex items-center space-x-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7"/>
                </svg>
                <span class="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          <div class="bg-neo-light rounded-3xl shadow-neo p-6 hover:shadow-neo-inset transition-all">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1">Assigned to Me</p>
                <p class="text-3xl font-bold text-primary-600">{{ myApplications.length }}</p>
              </div>
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-neo-light rounded-3xl shadow-neo p-6 hover:shadow-neo-inset transition-all">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1">Under Review</p>
                <p class="text-3xl font-bold text-yellow-600">{{ getStatusCount('UNDER_REVIEW') }}</p>
              </div>
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center">
                <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-neo-light rounded-3xl shadow-neo p-6 hover:shadow-neo-inset transition-all">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1">Approved</p>
                <p class="text-3xl font-bold text-green-600">{{ getStatusCount('APPROVED') }}</p>
              </div>
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-neo-light rounded-3xl shadow-neo p-6 hover:shadow-neo-inset transition-all">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1">Rejected</p>
                <p class="text-3xl font-bold text-red-600">{{ getStatusCount('REJECTED') }}</p>
              </div>
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Search & Filters -->
        <div class="bg-neo-light rounded-3xl shadow-neo p-6 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input 
              type="text" 
              [(ngModel)]="searchTerm"
              (input)="filterApplications()"
              placeholder="Search by name, email, or ID..."
              class="px-4 py-3 rounded-xl bg-white shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            />
            <select 
              [(ngModel)]="statusFilter"
              (change)="filterApplications()"
              class="px-4 py-3 rounded-xl bg-white shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <select 
              [(ngModel)]="priorityFilter"
              (change)="filterApplications()"
              class="px-4 py-3 rounded-xl bg-white shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            >
              <option value="">All Priorities</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>
          </div>
        </div>

        <!-- Applications List -->
        <div class="bg-neo-light rounded-3xl shadow-neo p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-gray-800">My Assigned Applications</h2>
            <span class="text-sm text-gray-600">{{ filteredApplications.length }} application(s)</span>
          </div>

          @if (loading) {
            <div class="text-center py-12">
              <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              <p class="mt-4 text-gray-600">Loading applications...</p>
            </div>
          } @else if (filteredApplications.length === 0) {
            <div class="text-center py-12">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
              </svg>
              <p class="mt-4 text-gray-600">No applications assigned yet</p>
            </div>
          } @else {
            <div class="space-y-4">
              @for (app of filteredApplications; track app.id) {
                <div class="bg-white rounded-2xl p-4 shadow-neo-inset hover:shadow-neo transition-all cursor-pointer group" [routerLink]="['/agent/applications', app.id]">
                  <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div class="flex items-center space-x-4 flex-1">
                      <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-neo flex-shrink-0">
                        <span class="text-white font-bold">{{ app.avatar }}</span>
                      </div>
                      <div class="flex-1 min-w-0">
                        <h3 class="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                          {{ app.candidateName }}
                        </h3>
                        <div class="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-600">
                          <span class="flex items-center">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                            </svg>
                            {{ app.email }}
                          </span>
                          <span class="text-gray-300">•</span>
                          <span>{{ app.program }}</span>
                          <span class="text-gray-300">•</span>
                          <span>{{ app.submittedDate | date:'MMM d, yyyy' }}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div class="flex items-center space-x-4 w-full sm:w-auto">
                      <div class="flex-1 sm:flex-none">
                        <div class="flex items-center space-x-2 mb-2">
                          <div class="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              class="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
                              [style.width.%]="app.completionRate"
                            ></div>
                          </div>
                          <span class="text-xs font-medium text-gray-600">{{ app.completionRate }}%</span>
                        </div>
                        <div class="flex items-center space-x-2">
                          <span [class]="getStatusBadgeClass(app.status)" class="text-xs px-3 py-1 rounded-full font-medium">
                            {{ getStatusLabel(app.status) }}
                          </span>
                          <span [class]="getPriorityBadgeClass(app.priority)" class="text-xs px-2 py-1 rounded-full font-medium">
                            {{ app.priority }}
                          </span>
                        </div>
                      </div>
                      
                      <button 
                        class="p-2 rounded-lg bg-primary-50 hover:bg-primary-100 text-primary-600 transition-all"
                        [routerLink]="['/agent/applications', app.id]"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              }
            </div>
          }
        </div>

        <!-- Quick Actions (Agent-specific) -->
        <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-neo-light rounded-3xl shadow-neo p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-4">📊 Quick Stats</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Average Completion</span>
                <span class="font-semibold text-gray-900">{{ getAverageCompletion() }}%</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Pending Reviews</span>
                <span class="font-semibold text-yellow-600">{{ getStatusCount('PENDING') }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">High Priority</span>
                <span class="font-semibold text-red-600">{{ getPriorityCount('HIGH') }}</span>
              </div>
            </div>
          </div>

          <div class="bg-neo-light rounded-3xl shadow-neo p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-4">⚡ Quick Actions</h3>
            <div class="space-y-2">
              <button class="w-full text-left px-4 py-2 rounded-xl bg-white shadow-neo-inset hover:shadow-neo transition-all text-sm font-medium text-gray-700">
                View Pending Applications
              </button>
              <button class="w-full text-left px-4 py-2 rounded-xl bg-white shadow-neo-inset hover:shadow-neo transition-all text-sm font-medium text-gray-700">
                High Priority Items
              </button>
              <button class="w-full text-left px-4 py-2 rounded-xl bg-white shadow-neo-inset hover:shadow-neo transition-all text-sm font-medium text-gray-700">
                Export My Reviews
              </button>
            </div>
          </div>

          <div class="bg-neo-light rounded-3xl shadow-neo p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-4">ℹ️ Information</h3>
            <div class="space-y-3 text-sm text-gray-600">
              <p><strong>Role:</strong> Agent</p>
              <p><strong>Access Level:</strong> Assigned Applications Only</p>
              <p><strong>Last Login:</strong> {{ getCurrentDate() | date:'medium' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AgentDashboardComponent implements OnInit {
  myApplications: Application[] = [];
  filteredApplications: Application[] = [];
  searchTerm = '';
  statusFilter = '';
  priorityFilter = '';
  loading = true;

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Check if user is an agent
    if (!this.authService.isAgent()) {
      this.router.navigate(['/admin/dashboard']);
      return;
    }
    
    this.loadMyApplications();
  }

  loadMyApplications() {
    this.loading = true;
    // Get only applications assigned to this agent
    this.adminService.getAllApplications().subscribe({
      next: (res: any) => {
        const apps = res?.content ? res.content : (Array.isArray(res) ? res : res?.applications ?? []);
        
        // Filter to show only assigned applications
        // Assuming backend returns only assigned applications for agents
        this.myApplications = apps.map((a: any) => ({
          id: a.id,
          candidateName: a.candidateName || (a.candidate?.firstName && a.candidate?.lastName ? `${a.candidate.firstName} ${a.candidate.lastName}` : ''),
          email: a.email || a.candidate?.email || '',
          program: a.program || a.desiredProgram || '',
          status: a.status || 'PENDING',
          submittedDate: a.submittedDate ? new Date(a.submittedDate) : (a.createdAt ? new Date(a.createdAt) : new Date()),
          completionRate: a.completionRate ?? a.progress ?? 0,
          priority: a.priority ?? 'MEDIUM',
          avatar: (a.candidate?.firstName ? a.candidate.firstName[0] : 'U') + (a.candidate?.lastName ? a.candidate.lastName[0] : ''),
          assignedDate: a.assignedDate ? new Date(a.assignedDate) : undefined
        } as Application));
        
        this.filteredApplications = [...this.myApplications];
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load applications', err);
        this.myApplications = [];
        this.filteredApplications = [];
        this.loading = false;
      }
    });
  }

  filterApplications() {
    let filtered = [...this.myApplications];

    if (this.statusFilter) {
      filtered = filtered.filter(app => app.status === this.statusFilter);
    }

    if (this.priorityFilter) {
      filtered = filtered.filter(app => app.priority === this.priorityFilter);
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(app => 
        app.candidateName.toLowerCase().includes(term) ||
        app.email.toLowerCase().includes(term) ||
        app.id.toLowerCase().includes(term) ||
        app.program.toLowerCase().includes(term)
      );
    }

    this.filteredApplications = filtered;
  }

  getStatusCount(status: string): number {
    return this.myApplications.filter(app => app.status === status).length;
  }

  getPriorityCount(priority: string): number {
    return this.myApplications.filter(app => app.priority === priority).length;
  }

  getAverageCompletion(): number {
    if (this.myApplications.length === 0) return 0;
    const total = this.myApplications.reduce((sum, app) => sum + app.completionRate, 0);
    return Math.round(total / this.myApplications.length);
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

  getStatusLabel(status: string): string {
    const labels: any = {
      'PENDING': 'Pending',
      'UNDER_REVIEW': 'In Review',
      'APPROVED': 'Approved',
      'REJECTED': 'Rejected'
    };
    return labels[status] || status;
  }

  getPriorityBadgeClass(priority: string): string {
    const classes: any = {
      'HIGH': 'bg-red-100 text-red-700',
      'MEDIUM': 'bg-orange-100 text-orange-700',
      'LOW': 'bg-gray-100 text-gray-700'
    };
    return classes[priority] || 'bg-gray-100 text-gray-700';
  }

  getCurrentDate(): Date {
    return new Date();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
