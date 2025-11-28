// src/app/pages/admin/dashboard/admin-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../../services/admin.service';
import { AuthService, AdminProfile } from '../../../../services/auth.service';
import { HttpClient } from '@angular/common/http';

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
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  template: `
    <div class="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      <!-- Mobile Header -->
      <div class="lg:hidden bg-gradient-to-r from-slate-700 to-slate-800 p-4 flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <span class="text-white font-bold text-lg">E</span>
          </div>
          <span class="font-bold text-lg text-white">EnrollPro</span>
        </div>
        <button (click)="toggleMobileMenu()" class="text-white p-2">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>

      <!-- Mobile Overlay -->
      <div 
        *ngIf="isMobileMenuOpen" 
        (click)="closeMobileMenu()"
        class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
      ></div>

      <!-- Sidebar -->
      <aside 
        [class.translate-x-0]="isMobileMenuOpen"
        [class.-translate-x-full]="!isMobileMenuOpen"
        class="fixed lg:static top-0 left-0 h-full z-50 lg:z-auto w-80 lg:w-64 bg-gradient-to-b from-slate-700 to-slate-800 text-white flex flex-col lg:h-screen overflow-y-auto transition-transform duration-300 ease-in-out lg:translate-x-0"
      >
        <!-- Close button for mobile -->
        <div class="lg:hidden flex items-center justify-between p-6 border-b border-slate-600">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <span class="text-white font-bold text-lg">E</span>
            </div>
            <span class="font-bold text-lg">EnrollPro</span>
          </div>
          <button (click)="toggleMobileMenu()" class="text-white p-2 hover:bg-slate-600 rounded-lg">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Logo (desktop only) -->
        <div class="hidden lg:flex p-6 items-center justify-between border-b border-slate-600">
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
            <div class="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center cursor-pointer" (click)="openProfileModal()">
              <span class="text-white text-xl font-bold">{{ getAdminInitials() }}</span>
            </div>
            <div class="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-700"></div>
            <!-- Profile incomplete indicator -->
            <div *ngIf="!isProfileComplete()" class="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full border-2 border-slate-700 flex items-center justify-center">
              <span class="text-slate-900 text-xs font-bold">!</span>
            </div>
          </div>
          <h3 class="font-semibold text-white">{{ adminProfile?.firstName || 'Admin' }} {{ adminProfile?.lastName || '' }}</h3>
          <p class="text-xs text-slate-400">{{ adminProfile?.email }}</p>
          <button *ngIf="!isProfileComplete()" (click)="openProfileModal()" class="mt-2 text-xs text-yellow-400 hover:text-yellow-300 underline">
            Complete Profile
          </button>
        </div>

        <!-- Navigation -->
        <nav class="p-4 space-y-1 flex-shrink-0">
          <a href="#" (click)="closeMobileMenu()" class="flex items-center space-x-3 px-4 py-3 rounded-xl bg-slate-600/50 text-white">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            <span class="text-sm font-medium">Dashboard</span>
          </a>
          <a routerLink="/admin/applications" (click)="closeMobileMenu()" class="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-600/30 transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <span class="text-sm font-medium">Applications</span>
            <span class="ml-auto px-2 py-1 bg-red-500 text-white text-xs rounded-full">{{ stats.pending }}</span>
          </a>
          <a routerLink="/admin/analytics" (click)="closeMobileMenu()" class="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-600/30 transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            <span class="text-sm font-medium">Analytics</span>
          </a>
          <a *ngIf="isSuperAdmin()" (click)="openAgentModal(); closeMobileMenu()" class="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-600/30 transition-all cursor-pointer">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
            </svg>
            <span class="text-sm font-medium">Create Agent</span>
          </a>
          <a routerLink="/admin/settings" (click)="closeMobileMenu()" class="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-600/30 transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span class="text-sm font-medium">Settings</span>
          </a>
        </nav>

        <!-- Spacer (pushes logout to bottom on desktop, but allows scroll on mobile) -->
        <div class="hidden lg:block flex-1"></div>

        <!-- Quick Actions -->
        <div class="p-6 flex-shrink-0 mt-auto">
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
        <!-- Profile Completion Alert -->
        <div *ngIf="!isProfileComplete()" class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-yellow-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
              <p class="text-sm text-yellow-800">
                <span class="font-semibold">Profile Incomplete!</span> Please complete your profile to access all features.
              </p>
            </div>
            <button (click)="openProfileModal()" class="px-4 py-2 bg-yellow-400 text-yellow-900 rounded-lg text-sm font-medium hover:bg-yellow-500 transition-all">
              Complete Now
            </button>
          </div>
        </div>

        <!-- Header -->
        <header class="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div class="flex items-center space-x-2 sm:space-x-4">
              <h1 class="text-xl sm:text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <span *ngIf="isSuperAdmin()" class="px-2 sm:px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">SUPER ADMIN</span>
              <span *ngIf="!isSuperAdmin()" class="px-2 sm:px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-full">AGENT</span>
            </div>
            <div class="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <div class="relative flex-1 sm:flex-none">
                <input 
                  type="text" 
                  [(ngModel)]="searchTerm"
                  (input)="filterApplications()"
                  placeholder="Search..."
                  class="pl-10 pr-4 py-2 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 w-full sm:w-64 text-sm"
                />
                <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <button *ngIf="isSuperAdmin()" (click)="openAgentModal()" class="flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all text-sm">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                </svg>
                Create Agent
              </button>
            </div>
          </div>
        </header>

        <div class="p-4 sm:p-6 lg:p-8">
          <!-- Stats Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <div class="bg-white rounded-3xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-xs sm:text-sm text-gray-600 mb-1">Total Applications</p>
                  <p class="text-2xl sm:text-3xl font-bold text-gray-900">{{ stats.total }}</p>
                  <div class="flex items-center mt-2">
                    <span class="text-green-600 text-xs sm:text-sm font-medium">↑ 12.5%</span>
                    <span class="text-gray-500 text-xs ml-2">vs last month</span>
                  </div>
                </div>
                <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-3xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-xs sm:text-sm text-gray-600 mb-1">Pending Review</p>
                  <p class="text-2xl sm:text-3xl font-bold text-yellow-600">{{ stats.pending }}</p>
                  <div class="flex items-center mt-2">
                    <span class="text-yellow-600 text-xs sm:text-sm font-medium">{{ stats.pending }} waiting</span>
                  </div>
                </div>
                <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 sm:w-7 sm:h-7 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-3xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-xs sm:text-sm text-gray-600 mb-1">Approved</p>
                  <p class="text-2xl sm:text-3xl font-bold text-green-600">{{ stats.approved }}</p>
                  <div class="flex items-center mt-2">
                    <span class="text-green-600 text-xs sm:text-sm font-medium">{{ getApprovalRate() }}% rate</span>
                  </div>
                </div>
                <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 sm:w-7 sm:h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-3xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-xs sm:text-sm text-gray-600 mb-1">Rejected</p>
                  <p class="text-2xl sm:text-3xl font-bold text-red-600">{{ stats.rejected }}</p>
                  <div class="flex items-center mt-2">
                    <span class="text-red-600 text-xs sm:text-sm font-medium">{{ getRejectionRate() }}% rate</span>
                  </div>
                </div>
                <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 sm:w-7 sm:h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Main Content Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Applications List -->
            <div class="lg:col-span-2 bg-white rounded-3xl p-4 sm:p-6 shadow-sm">
              <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                <h3 class="text-lg sm:text-xl font-bold text-gray-900">Recent Applications</h3>
                <div class="flex items-center space-x-2 w-full sm:w-auto">
                  <select 
                    [(ngModel)]="statusFilter"
                    (change)="filterApplications()"
                    class="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-gray-100 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                  <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer group gap-3">
                    <div class="flex items-center space-x-3 sm:space-x-4 flex-1 w-full">
                      <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-sm flex-shrink-0">
                        <span class="text-white font-bold text-sm sm:text-base">{{ app.avatar }}</span>
                      </div>
                      <div class="flex-1 min-w-0">
                        <h4 class="font-semibold text-sm sm:text-base text-gray-900 group-hover:text-primary-600 transition-colors truncate">{{ app.candidateName }}</h4>
                        <div class="flex items-center space-x-2 sm:space-x-3 mt-1">
                          <span class="text-xs sm:text-sm text-gray-500 truncate">{{ app.program }}</span>
                          <span class="text-gray-300 hidden sm:inline">•</span>
                          <span class="text-xs sm:text-sm text-gray-500">{{ app.submittedDate | date:'MMM d' }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto justify-between sm:justify-end">
                      <div class="text-left sm:text-right flex-1 sm:flex-none">
                        <div class="flex items-center space-x-2 mb-1">
                          <div class="w-20 sm:w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              class="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
                              [style.width.%]="app.completionRate"
                            ></div>
                          </div>
                          <span class="text-xs font-medium text-gray-600">{{ app.completionRate }}%</span>
                        </div>
                        <span [class]="getStatusBadgeClass(app.status)" class="inline-block text-xs px-2 sm:px-3 py-1 rounded-full font-medium">
                          {{ getStatusLabel(app.status) }}
                        </span>
                      </div>
                      <button 
                        [routerLink]="['/admin/applications', app.id]"
                        class="p-2 rounded-lg bg-primary-50 hover:bg-primary-100 text-primary-600 sm:opacity-0 sm:group-hover:opacity-100 transition-all flex-shrink-0"
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
            <div class="space-y-4 sm:space-y-6">
              <!-- Quick Actions -->
              <div class="bg-white rounded-3xl p-4 sm:p-6 shadow-sm">
                <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div class="space-y-3">
                  <button class="w-full p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 transition-all flex items-center space-x-3 group">
                    <div class="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center flex-shrink-0">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <span class="font-medium text-sm sm:text-base text-emerald-700">Bulk Approve</span>
                  </button>
                  <button class="w-full p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"/>
                      </svg>
                    </div>
                    <span class="font-medium text-sm sm:text-base text-blue-700">Send Notification</span>
                  </button>
                  <button class="w-full p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-all flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center flex-shrink-0">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                    </div>
                    <span class="font-medium text-sm sm:text-base text-purple-700">Generate Report</span>
                  </button>
                </div>
              </div>

              <!-- Alerts -->
              <div class="bg-white rounded-3xl p-4 sm:p-6 shadow-sm">
                <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-4">🚨 Alerts</h3>
                <div class="space-y-3">
                  <div class="p-3 sm:p-4 rounded-xl bg-red-50 border-l-4 border-red-500">
                    <p class="text-xs sm:text-sm font-semibold text-red-800">15 files blocked</p>
                    <p class="text-xs text-red-600 mt-1">More than 48h</p>
                  </div>
                  <div class="p-3 sm:p-4 rounded-xl bg-yellow-50 border-l-4 border-yellow-500">
                    <p class="text-xs sm:text-sm font-semibold text-yellow-800">8 documents pending</p>
                    <p class="text-xs text-yellow-600 mt-1">High priority</p>
                  </div>
                  <div class="p-3 sm:p-4 rounded-xl bg-blue-50 border-l-4 border-blue-500">
                    <p class="text-xs sm:text-sm font-semibold text-blue-800">23 new messages</p>
                    <p class="text-xs text-blue-600 mt-1">Unread</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Profile Completion Modal -->
      <div *ngIf="showProfileModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div class="bg-neo-light rounded-3xl shadow-neo max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-bold text-gray-800">Complete Your Profile</h2>
                <p class="text-sm text-gray-600 mt-2">Please provide your information to complete your profile.</p>
              </div>
              <button (click)="closeProfileModal()" class="p-2 hover:bg-gray-100 rounded-lg transition-all">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
          
          <form [formGroup]="profileForm" (ngSubmit)="submitProfile()" class="p-6 space-y-6">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                <input 
                  type="text" 
                  formControlName="firstName"
                  class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  placeholder="Enter your first name"
                />
                <div *ngIf="profileForm.get('firstName')?.invalid && profileForm.get('firstName')?.touched" class="text-red-500 text-sm mt-1">
                  First name is required
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                <input 
                  type="text" 
                  formControlName="lastName"
                  class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  placeholder="Enter your last name"
                />
                <div *ngIf="profileForm.get('lastName')?.invalid && profileForm.get('lastName')?.touched" class="text-red-500 text-sm mt-1">
                  Last name is required
                </div>
              </div>

              <div class="bg-blue-50 rounded-xl p-4 shadow-neo-inset">
                <p class="text-xs text-blue-800">
                  <strong>Username:</strong> {{ adminProfile?.userName }}<br>
                  <strong>Email:</strong> {{ adminProfile?.email }}
                </p>
              </div>
            </div>

            <div *ngIf="profileError" class="p-4 bg-red-50 rounded-xl shadow-neo-inset">
              <p class="text-sm text-red-800">{{ profileError }}</p>
            </div>

            <div *ngIf="profileSuccess" class="p-4 bg-green-50 rounded-xl shadow-neo-inset">
              <p class="text-sm text-green-800">Profile updated successfully!</p>
            </div>

            <div class="flex gap-3">
              <button 
                type="button"
                (click)="closeProfileModal()"
                class="flex-1 px-6 py-3 rounded-xl bg-neo-light shadow-neo hover:shadow-neo-inset text-gray-700 font-medium transition-all duration-300"
              >
                Cancel
              </button>
              <button 
                type="submit"
                [disabled]="profileForm.invalid || isSubmittingProfile"
                class="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 text-white font-semibold shadow-neo hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isSubmittingProfile ? 'Saving...' : 'Save Profile' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Create Agent Modal -->
      <div *ngIf="showAgentModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div class="bg-neo-light rounded-3xl shadow-neo max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-bold text-gray-800">Create New Agent</h2>
                <p class="text-sm text-gray-600 mt-2">Create a new agent account with AGENT role.</p>
              </div>
              <button (click)="closeAgentModal()" class="p-2 hover:bg-gray-100 rounded-lg transition-all">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
          
          <form [formGroup]="agentForm" (ngSubmit)="submitAgent()" class="p-6 space-y-6">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Username *</label>
                <input 
                  type="text" 
                  formControlName="username"
                  class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  placeholder="Enter username"
                />
                <div *ngIf="agentForm.get('username')?.invalid && agentForm.get('username')?.touched" class="text-red-500 text-sm mt-1">
                  Username is required
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input 
                  type="email" 
                  formControlName="email"
                  class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  placeholder="agent@example.com"
                />
                <div *ngIf="agentForm.get('email')?.invalid && agentForm.get('email')?.touched" class="text-red-500 text-sm mt-1">
                  Valid email is required
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                <input 
                  type="text" 
                  formControlName="firstName"
                  class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  placeholder="Enter first name"
                />
                <div *ngIf="agentForm.get('firstName')?.invalid && agentForm.get('firstName')?.touched" class="text-red-500 text-sm mt-1">
                  First name is required
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                <input 
                  type="text" 
                  formControlName="lastName"
                  class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  placeholder="Enter last name"
                />
                <div *ngIf="agentForm.get('lastName')?.invalid && agentForm.get('lastName')?.touched" class="text-red-500 text-sm mt-1">
                  Last name is required
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                <div class="relative">
                  <input 
                    [type]="showAgentPassword ? 'text' : 'password'"
                    formControlName="password"
                    class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    placeholder="Enter password"
                  />
                  <button 
                    type="button"
                    (click)="showAgentPassword = !showAgentPassword"
                    class="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-primary-500 hover:text-primary-700"
                  >
                    {{ showAgentPassword ? 'Hide' : 'Show' }}
                  </button>
                </div>
                <div *ngIf="agentForm.get('password')?.invalid && agentForm.get('password')?.touched" class="text-red-500 text-sm mt-1">
                  Password must be at least 6 characters
                </div>
              </div>

              <div class="bg-emerald-50 rounded-xl p-4 shadow-neo-inset">
                <p class="text-xs text-emerald-800">
                  <strong>Role:</strong> AGENT (automatically assigned)
                </p>
              </div>
            </div>

            <div *ngIf="agentError" class="p-4 bg-red-50 rounded-xl shadow-neo-inset">
              <p class="text-sm text-red-800">{{ agentError }}</p>
            </div>

            <div *ngIf="agentSuccess" class="p-4 bg-green-50 rounded-xl shadow-neo-inset">
              <p class="text-sm text-green-800">Agent created successfully!</p>
            </div>

            <div class="flex gap-3">
              <button 
                type="button"
                (click)="closeAgentModal()"
                class="flex-1 px-6 py-3 rounded-xl bg-neo-light shadow-neo hover:shadow-neo-inset text-gray-700 font-medium transition-all duration-300"
              >
                Cancel
              </button>
              <button 
                type="submit"
                [disabled]="agentForm.invalid || isSubmittingAgent"
                class="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold shadow-neo hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isSubmittingAgent ? 'Creating...' : 'Create Agent' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  Math = Math;
  
  searchTerm = '';
  statusFilter = 'ALL';
  isMobileMenuOpen = false;
  showProfileModal = false;
  showAgentModal = false;
  showAgentPassword = false;
  isSubmittingProfile = false;
  isSubmittingAgent = false;
  profileError = '';
  profileSuccess = false;
  agentError = '';
  agentSuccess = false;

  adminProfile: AdminProfile | null = null;
  profileForm: FormGroup;
  agentForm: FormGroup;

  stats: Stats = {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    underReview: 0
  };

  applications: Application[] = [];
  filteredApplications: Application[] = [];
  
  constructor(
    private adminService: AdminService, 
    private authService: AuthService, 
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });

    this.agentForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.loadAdminProfile();
    this.loadApplications();
    this.loadStatistics();
  }

  loadAdminProfile() {
    // Get current user info from auth service or local storage
    const userInfo = this.authService.getCurrentUser(); 
    if (userInfo) {
      this.adminProfile = userInfo;
      
      // Pre-fill profile form if data exists
      if (userInfo.firstName) {
        this.profileForm.patchValue({
          firstName: userInfo.firstName,
          lastName: userInfo.lastName
        });
      }
    }
  }

  isProfileComplete(): boolean {
    return !!(this.adminProfile?.firstName && this.adminProfile?.lastName);
  }

  isSuperAdmin(): boolean {
    return this.authService.isSuperAdmin();
  }

  getAdminInitials(): string {
    if (this.adminProfile?.firstName && this.adminProfile?.lastName) {
      return this.adminProfile.firstName[0].toUpperCase() + this.adminProfile.lastName[0].toUpperCase();
    }
    if (this.adminProfile?.userName) {
      return this.adminProfile.userName.substring(0, 2).toUpperCase();
    }
    return 'AD';
  }

  openProfileModal() {
    this.showProfileModal = true;
    this.profileError = '';
    this.profileSuccess = false;
  }

  closeProfileModal() {
    this.showProfileModal = false;
    this.profileError = '';
    this.profileSuccess = false;
  }

  submitProfile() {
    if (this.profileForm.valid && !this.isSubmittingProfile) {
      this.isSubmittingProfile = true;
      this.profileError = '';
      this.profileSuccess = false;

      const profileData = {
        firstName: this.profileForm.value.firstName,
        lastName: this.profileForm.value.lastName,
        email: this.adminProfile?.email || '',
        userName: this.adminProfile?.userName || ''
      };

      console.log('Completing profile with data:', profileData); // Debug log

      // Use AdminService which has proper headers and base URL
      this.adminService.completeSuperAdminProfile(profileData)
        .subscribe({
          next: (response) => {
            console.log('Profile updated successfully:', response);
            
            // Update local profile
            if (this.adminProfile) {
              this.adminProfile.firstName = response.firstName || profileData.firstName;
              this.adminProfile.lastName = response.lastName || profileData.lastName;
            }
            
            // Update auth service with new profile data
            this.authService.updateCurrentUser({
              firstName: response.firstName || profileData.firstName,
              lastName: response.lastName || profileData.lastName
            });
            
            this.profileSuccess = true;
            this.isSubmittingProfile = false;
            
            // Close modal after 1.5 seconds
            setTimeout(() => {
              this.closeProfileModal();
            }, 1500);
          },
          error: (error) => {
            console.error('Error updating profile:', error);
            console.error('Error details:', {
              status: error.status,
              statusText: error.statusText,
              message: error.error?.message,
              error: error.error
            });
            
            // More specific error messages
            let errorMessage = 'Failed to update profile. ';
            if (error.status === 403) {
              errorMessage = 'You do not have permission to update this profile.';
            } else if (error.status === 401) {
              errorMessage = 'Authentication failed. Please log in again.';
            } else if (error.status === 0) {
              errorMessage = 'Network error. Please check your connection and try again.';
            } else {
              errorMessage += error.error?.message || 'Please try again.';
            }
            
            this.profileError = errorMessage;
            this.isSubmittingProfile = false;
          }
        });
    }
  }

  openAgentModal() {
    if (!this.isSuperAdmin()) {
      alert('Only Super Admins can create agents.');
      return;
    }
    this.showAgentModal = true;
    this.agentError = '';
    this.agentSuccess = false;
    this.agentForm.reset();
  }

  closeAgentModal() {
    this.showAgentModal = false;
    this.agentError = '';
    this.agentSuccess = false;
  }

  submitAgent() {
    if (this.agentForm.valid && !this.isSubmittingAgent) {
      this.isSubmittingAgent = true;
      this.agentError = '';
      this.agentSuccess = false;

      const agentData = {
        username: this.agentForm.value.username,
        email: this.agentForm.value.email,
        firstName: this.agentForm.value.firstName,
        lastName: this.agentForm.value.lastName,
        password: this.agentForm.value.password
      };

      console.log('Creating agent with data:', { ...agentData, password: '***' }); // Debug log (hide password)

      // Use AdminService which has proper headers and base URL
      this.adminService.createAgent(agentData)
        .subscribe({
          next: (response) => {
            console.log('Agent created successfully:', response);
            this.agentSuccess = true;
            this.isSubmittingAgent = false;
            this.agentForm.reset();
            
            // Close modal after 2 seconds
            setTimeout(() => {
              this.closeAgentModal();
            }, 2000);
          },
          error: (error) => {
            console.error('Error creating agent:', error);
            console.error('Error details:', {
              status: error.status,
              statusText: error.statusText,
              message: error.error?.message,
              error: error.error
            });
            
            // More specific error messages
            let errorMessage = 'Failed to create agent. ';
            if (error.status === 400) {
              errorMessage += error.error?.message || 'Username or email may already exist.';
            } else if (error.status === 403) {
              errorMessage = 'You do not have permission to create agents.';
            } else if (error.status === 401) {
              errorMessage = 'Authentication failed. Please log in again.';
            } else if (error.status === 0) {
              errorMessage = 'Network error. Please check your connection and try again.';
            } else {
              errorMessage += error.error?.message || 'Please try again.';
            }
            
            this.agentError = errorMessage;
            this.isSubmittingAgent = false;
          }
        });
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  loadApplications() {
    this.adminService.getAllApplications().subscribe({
      next: (res: any) => {
        const apps = res?.content ? res.content : (Array.isArray(res) ? res : res?.applications ?? []);
        this.applications = apps.map((a: any) => ({
          id: a.applicationId || a.id,
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
    return this.stats.total > 0 ? Math.round((this.stats.approved / this.stats.total) * 100) : 0;
  }

  getRejectionRate(): number {
    return this.stats.total > 0 ? Math.round((this.stats.rejected / this.stats.total) * 100) : 0;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}