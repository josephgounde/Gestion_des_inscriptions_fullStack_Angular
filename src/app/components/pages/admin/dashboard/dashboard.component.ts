// src/app/pages/admin/dashboard/admin-dashboard.component.ts
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
}

interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  underReview: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="flex h-screen bg-gray-100">
      <!-- Sidebar -->
      <aside class="w-64 bg-gradient-to-b from-slate-700 to-slate-800 text-white flex flex-col">
        <!-- Logo -->
        <div class="p-6 flex items-center justify-between border-b border-slate-600">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <span class="text-white font-bold text-lg">E</span>
            </div>
            <span class="font-bold text-lg">EnrollPro</span>
          </div>
        </div>

        <!-- User Profile -->
        <div class="p-6 flex flex-col items-center border-b border-slate-600">
          <div class="relative mb-3">
            <div class="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center">
              <span class="text-white text-xl font-bold">AD</span>
            </div>
            <div class="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-700"></div>
          </div>
          <h3 class="font-semibold text-white">Administrateur</h3>
          <p class="text-xs text-slate-400">admin&#64;enrollpro.com</p>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 p-4 space-y-1">
          <a href="#" class="flex items-center space-x-3 px-4 py-3 rounded-xl bg-slate-600/50 text-white">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            <span class="text-sm font-medium">Dashboard</span>
          </a>
          <a routerLink="/admin/applications" class="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-600/30 transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <span class="text-sm font-medium">Applications</span>
            <span class="ml-auto px-2 py-1 bg-red-500 text-white text-xs rounded-full">{{ stats.pending }}</span>
          </a>
          <a routerLink="/admin/analytics" class="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-600/30 transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            <span class="text-sm font-medium">Analytics</span>
          </a>
          <a routerLink="/admin/settings" class="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-600/30 transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span class="text-sm font-medium">Settings</span>
          </a>
        </nav>

        <!-- Quick Actions -->
        <div class="p-6">
          <div class="space-y-3">
            <button class="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 transition-all flex items-center justify-center space-x-2 shadow-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            <span class="font-medium">New Application</span>
          </button>
            <button (click)="logout()" class="w-full py-3 px-4 rounded-2xl bg-red-50 text-red-700 hover:bg-red-100 transition-all flex items-center justify-center space-x-2 border border-red-100">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7"/>
              </svg>
              <span class="font-medium">Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-auto">
        <!-- Header -->
        <header class="bg-white border-b border-gray-200 px-8 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <h1 class="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <span class="px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">PRO</span>
            </div>
            <div class="flex items-center space-x-4">
              <div class="relative">
                <input 
                  type="text" 
                  [(ngModel)]="searchTerm"
                  (input)="filterApplications()"
                  placeholder="Search applications..."
                  class="pl-10 pr-4 py-2 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
                />
                <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <button class="relative p-2 hover:bg-gray-100 rounded-lg transition-all">
                <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                </svg>
                <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button class="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">
                Export Data
              </button>
            </div>
          </div>
        </header>

        <div class="p-8">
          <!-- Stats Cards -->
          <div class="grid grid-cols-4 gap-6 mb-8">
            <div class="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600 mb-1">Total Applications</p>
                  <p class="text-3xl font-bold text-gray-900">{{ stats.total }}</p>
                  <div class="flex items-center mt-2">
                    <span class="text-green-600 text-sm font-medium">↑ 12.5%</span>
                    <span class="text-gray-500 text-xs ml-2">vs last month</span>
                  </div>
                </div>
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600 mb-1">Pending Review</p>
                  <p class="text-3xl font-bold text-yellow-600">{{ stats.pending }}</p>
                  <div class="flex items-center mt-2">
                    <span class="text-yellow-600 text-sm font-medium">{{ stats.pending }} waiting</span>
                  </div>
                </div>
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center">
                  <svg class="w-7 h-7 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600 mb-1">Approved</p>
                  <p class="text-3xl font-bold text-green-600">{{ stats.approved }}</p>
                  <div class="flex items-center mt-2">
                    <span class="text-green-600 text-sm font-medium">{{ getApprovalRate() }}% rate</span>
                  </div>
                </div>
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                  <svg class="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600 mb-1">Rejected</p>
                  <p class="text-3xl font-bold text-red-600">{{ stats.rejected }}</p>
                  <div class="flex items-center mt-2">
                    <span class="text-red-600 text-sm font-medium">{{ getRejectionRate() }}% rate</span>
                  </div>
                </div>
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                  <svg class="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Main Content Grid -->
          <div class="grid grid-cols-3 gap-6">
            <!-- Applications List -->
            <div class="col-span-2 bg-white rounded-3xl p-6 shadow-sm">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-bold text-gray-900">Recent Applications</h3>
                <div class="flex items-center space-x-2">
                  <select 
                    [(ngModel)]="statusFilter"
                    (change)="filterApplications()"
                    class="px-4 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="ALL">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                  <button class="p-2 hover:bg-gray-100 rounded-lg">
                    <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div class="space-y-3">
                @for (app of filteredApplications.slice(0, 6); track app.id) {
                  <div class="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer group">
                    <div class="flex items-center space-x-4 flex-1">
                      <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-sm">
                        <span class="text-white font-bold">{{ app.avatar }}</span>
                      </div>
                      <div class="flex-1">
                        <h4 class="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{{ app.candidateName }}</h4>
                        <div class="flex items-center space-x-3 mt-1">
                          <span class="text-sm text-gray-500">{{ app.program }}</span>
                          <span class="text-gray-300">•</span>
                          <span class="text-sm text-gray-500">{{ app.submittedDate | date:'MMM d' }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-4">
                      <div class="text-right">
                        <div class="flex items-center space-x-2 mb-1">
                          <div class="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              class="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
                              [style.width.%]="app.completionRate"
                            ></div>
                          </div>
                          <span class="text-xs font-medium text-gray-600">{{ app.completionRate }}%</span>
                        </div>
                        <span [class]="getStatusBadgeClass(app.status)" class="text-xs px-3 py-1 rounded-full font-medium">
                          {{ getStatusLabel(app.status) }}
                        </span>
                      </div>
                      <button 
                        [routerLink]="['/admin/applications', app.id]"
                        class="p-2 rounded-lg bg-primary-50 hover:bg-primary-100 text-primary-600 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                }
              </div>

              <div class="mt-6 pt-4 border-t border-gray-200">
                <a routerLink="/admin/applications" class="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center justify-center space-x-2">
                  <span>View all applications</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                  </svg>
                </a>
              </div>
            </div>

            <!-- Quick Stats & Actions -->
            <div class="space-y-6">
              <!-- Quick Actions -->
              <div class="bg-white rounded-3xl p-6 shadow-sm">
                <h3 class="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div class="space-y-3">
                  <button class="w-full p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 transition-all flex items-center space-x-3 group">
                    <div class="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <span class="font-medium text-emerald-700">Bulk Approve</span>
                  </button>
                  <button class="w-full p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"/>
                      </svg>
                    </div>
                    <span class="font-medium text-blue-700">Send Notification</span>
                  </button>
                  <button class="w-full p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-all flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                    </div>
                    <span class="font-medium text-purple-700">Generate Report</span>
                  </button>
                </div>
              </div>

              <!-- Alerts -->
              <div class="bg-white rounded-3xl p-6 shadow-sm">
                <h3 class="text-lg font-bold text-gray-900 mb-4">🚨 Alerts</h3>
                <div class="space-y-3">
                  <div class="p-4 rounded-xl bg-red-50 border-l-4 border-red-500">
                    <p class="text-sm font-semibold text-red-800">15 files blocked</p>
                    <p class="text-xs text-red-600 mt-1">More than 48h</p>
                  </div>
                  <div class="p-4 rounded-xl bg-yellow-50 border-l-4 border-yellow-500">
                    <p class="text-sm font-semibold text-yellow-800">8 documents pending</p>
                    <p class="text-xs text-yellow-600 mt-1">High priority</p>
                  </div>
                  <div class="p-4 rounded-xl bg-blue-50 border-l-4 border-blue-500">
                    <p class="text-sm font-semibold text-blue-800">23 new messages</p>
                    <p class="text-xs text-blue-600 mt-1">Unread</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  Math = Math;
  
  searchTerm = '';
  statusFilter = 'ALL';

  stats: Stats = {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    underReview: 0
  };

  applications: Application[] = [];
  filteredApplications: Application[] = [];
  constructor(private adminService: AdminService, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.loadApplications();
    this.loadStatistics();
  }

  loadApplications() {
    this.adminService.getAllApplications().subscribe({
      next: (res: any) => {
        // API may return a paginated payload with `content` or a plain array
        const apps = res?.content ? res.content : (Array.isArray(res) ? res : res?.applications ?? []);
        // Map/normalize dates if necessary
        this.applications = apps.map((a: any) => ({
          id: a.id,
          candidateName: a.candidateName || (a.candidate?.firstName && a.candidate?.lastName ? `${a.candidate.firstName} ${a.candidate.lastName}` : ''),
          email: a.email || a.candidate?.email || '',
          program: a.program || a.desiredProgram || '',
          status: a.status || 'PENDING',
          submittedDate: a.submittedDate ? new Date(a.submittedDate) : (a.createdAt ? new Date(a.createdAt) : new Date()),
          completionRate: a.completionRate ?? a.progress ?? 0,
          priority: a.priority ?? 'MEDIUM',
          avatar: (a.candidate?.firstName ? a.candidate.firstName[0] : 'U') + (a.candidate?.lastName ? a.candidate.lastName[0] : '')
        } as Application));
        this.filteredApplications = [...this.applications];
      },
      error: (err) => {
        console.error('Failed to load applications', err);
        this.applications = [];
        this.filteredApplications = [];
      }
    });
  }

  loadStatistics() {
    this.adminService.getStatistics().subscribe({
      next: (s: any) => {
        this.stats = {
          total: s.total ?? s.totalApplications ?? 0,
          pending: s.pending ?? s.pendingReview ?? 0,
          approved: s.approved ?? s.approvedCount ?? 0,
          rejected: s.rejected ?? s.rejectedCount ?? 0,
          underReview: s.underReview ?? s.underReviewCount ?? 0
        };
      },
      error: (err) => {
        console.error('Failed to load statistics', err);
      }
    });
  }

  filterApplications() {
    let filtered = [...this.applications];

    if (this.statusFilter !== 'ALL') {
      filtered = filtered.filter(app => app.status === this.statusFilter);
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(app => 
        app.candidateName.toLowerCase().includes(term) ||
        app.email.toLowerCase().includes(term) ||
        app.program.toLowerCase().includes(term) ||
        app.id.toLowerCase().includes(term)
      );
    }

    this.filteredApplications = filtered;
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

  getApprovalRate(): number {
    return Math.round((this.stats.approved / this.stats.total) * 100);
  }

  getRejectionRate(): number {
    return Math.round((this.stats.rejected / this.stats.total) * 100);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}