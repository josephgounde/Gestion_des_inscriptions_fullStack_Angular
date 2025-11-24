// src/app/pages/admin/applications/applications-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../services/admin.service';

@Component({
  selector: 'app-applications-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-neo-light via-gray-100 to-neo-light p-6">
      <!-- Header -->
      <header class="bg-white shadow-neo-sm mb-6">
        <div class="container mx-auto px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-800">Toutes les Candidatures</h1>
              <p class="text-sm text-gray-600">Liste complète des candidatures reçues</p>
            </div>
            <a routerLink="/admin/dashboard" class="px-4 py-2 rounded-xl bg-neo-light shadow-neo hover:shadow-neo-inset transition-all text-gray-700 font-medium">
              Go Back
            </a>
          </div>
        </div>
      </header>

      <div class="container mx-auto">
        
        <!-- Filters -->
        <div class="bg-neo-light rounded-3xl shadow-neo p-6 mb-6">
          <div class="grid md:grid-cols-4 gap-4">
            <input 
              type="text" 
              [(ngModel)]="searchTerm"
              placeholder="Rechercher..."
              class="px-4 py-3 rounded-xl bg-white shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <select 
              [(ngModel)]="statusFilter"
              class="px-4 py-3 rounded-xl bg-white shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Tous les statuts</option>
              <option value="PENDING">En attente</option>
              <option value="APPROVED">Approuvées</option>
              <option value="REJECTED">Rejetées</option>
            </select>
            <select class="px-4 py-3 rounded-xl bg-white shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="">Tous les programmes</option>
              <option value="INFORMATIQUE">Informatique</option>
              <option value="GESTION">Gestion</option>
              <option value="MEDECINE">Médecine</option>
            </select>
            <button class="px-4 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 text-white font-medium shadow-neo hover:shadow-lg transition-all">
              Filtrer
            </button>
          </div>
        </div>

        <!-- Applications Grid -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (app of applications; track app.id) {
            <a [routerLink]="['/admin/applications', app.id]" class="block">
              <div class="bg-neo-light rounded-3xl shadow-neo p-6 hover:shadow-neo-inset transition-all">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex items-center space-x-3">
                    <div class="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-primary-700 flex items-center justify-center">
                      <span class="text-white font-bold">{{ app.initials }}</span>
                    </div>
                    <div>
                      <h3 class="font-bold text-gray-800">{{ app.name }}</h3>
                      <p class="text-sm text-gray-600">{{ app.program }}</p>
                    </div>
                  </div>
                  <span [class]="getStatusBadge(app.status)" class="px-3 py-1 rounded-full text-xs font-medium">
                    {{ app.status }}
                  </span>
                </div>
                <div class="space-y-2 text-sm text-gray-600">
                  <p>📧 {{ app.email }}</p>
                  <p>📅 {{ app.date | date:'dd/MM/yyyy' }}</p>
                  <div class="flex items-center justify-between pt-2">
                    <span>Complétude</span>
                    <span class="font-medium">{{ app.completion }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 h-2 rounded-full">
                    <div class="bg-gradient-to-r from-primary-500 to-primary-700 h-full rounded-full" [style.width.%]="app.completion"></div>
                  </div>
                </div>
              </div>
            </a>
          }
        </div>
      </div>
    </div>
  `
})
export class ApplicationsListComponent implements OnInit {
  searchTerm = '';
  statusFilter = '';
  applications: any[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadApplications();
  }

  loadApplications() {
    this.adminService.getAllApplications().subscribe({
      next: (res: any) => {
        const apps = res?.content ? res.content : (Array.isArray(res) ? res : res?.applications ?? []);
        this.applications = apps.map((a: any) => ({
          id: a.id,
          name: a.candidate?.firstName && a.candidate?.lastName ? `${a.candidate.firstName} ${a.candidate.lastName}` : (a.candidateName || a.name || ''),
          initials: (a.candidate?.firstName ? a.candidate.firstName[0] : (a.name ? a.name[0] : 'U')) + (a.candidate?.lastName ? a.candidate.lastName[0] : (a.name && a.name.split(' ')[1] ? a.name.split(' ')[1][0] : '')),
          email: a.candidate?.email || a.email || '',
          program: a.program || a.desiredProgram || '',
          status: a.status || 'PENDING',
          date: a.submittedDate ? new Date(a.submittedDate) : (a.createdAt ? new Date(a.createdAt) : new Date()),
          completion: a.completionRate ?? a.progress ?? 0
        }));
      },
      error: (err) => {
        console.error('Failed to load applications', err);
        this.applications = [];
      }
    });
  }

  getStatusBadge(status: string): string {
    const badges: any = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'APPROVED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  }

  // logout handled on main admin dashboard
}
