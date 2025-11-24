// src/app/pages/admin/analytics/analytics.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../services/admin.service';

interface ChartData {
  label: string;
  value: number;
  color: string;
}

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-neo-light via-gray-100 to-neo-light">
      <!-- Header -->
      <header class="bg-white shadow-neo-sm">
        <div class="container mx-auto px-6 py-4">
            <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-800">Analytique & Statistiques</h1>
              <p class="text-sm text-gray-600">Vue d'ensemble des performances</p>
            </div>
            <div class="flex items-center space-x-3">
              <a routerLink="/admin/dashboard" class="px-4 py-2 rounded-xl bg-neo-light shadow-neo hover:shadow-neo-inset transition-all text-gray-700 font-medium">
                Go Back
              </a>
              <select 
                [(ngModel)]="selectedPeriod"
                (change)="loadAnalytics()"
                class="px-4 py-2 rounded-xl bg-neo-light shadow-neo focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="quarter">Ce trimestre</option>
                <option value="year">Cette année</option>
              </select>
              <button class="px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 text-white font-medium shadow-neo hover:shadow-lg transition-all">
                Exporter PDF
              </button>
            </div>
          </div>
        </div>
      </header>

      <div class="container mx-auto px-6 py-8">
        <!-- KPIs -->
        <div class="grid md:grid-cols-4 gap-6 mb-8">
          <div class="bg-neo-light rounded-3xl shadow-neo p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1">Total Inscriptions</p>
                <p class="text-3xl font-bold text-gray-800">{{ kpis.totalApplications }}</p>
                <p class="text-xs text-green-600 mt-1">↑ {{ kpis.applicationsGrowth }}% vs période précédente</p>
              </div>
              <div class="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-700 shadow-neo-sm flex items-center justify-center">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-neo-light rounded-3xl shadow-neo p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1">Taux d'Approbation</p>
                <p class="text-3xl font-bold text-green-600">{{ kpis.approvalRate }}%</p>
                <p class="text-xs text-gray-600 mt-1">{{ kpis.approvedCount }} approuvées</p>
              </div>
              <div class="w-16 h-16 rounded-2xl bg-gradient-to-r from-green-500 to-green-700 shadow-neo-sm flex items-center justify-center">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-neo-light rounded-3xl shadow-neo p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1">Temps Moyen</p>
                <p class="text-3xl font-bold text-purple-600">{{ kpis.avgProcessingTime }}j</p>
                <p class="text-xs text-gray-600 mt-1">Traitement d'un dossier</p>
              </div>
              <div class="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-700 shadow-neo-sm flex items-center justify-center">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-neo-light rounded-3xl shadow-neo p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1">Taux de Rejet</p>
                <p class="text-3xl font-bold text-red-600">{{ kpis.rejectionRate }}%</p>
                <p class="text-xs text-gray-600 mt-1">{{ kpis.rejectedCount }} rejetées</p>
              </div>
              <div class="w-16 h-16 rounded-2xl bg-gradient-to-r from-red-500 to-red-700 shadow-neo-sm flex items-center justify-center">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts -->
        <div class="grid md:grid-cols-2 gap-6 mb-8">
          <!-- Applications by Status -->
          <div class="bg-neo-light rounded-3xl shadow-neo p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-6">Répartition par Statut</h3>
            <div class="space-y-4">
              @for (item of statusChart; track item.label) {
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-gray-700">{{ item.label }}</span>
                    <span class="text-sm font-bold text-gray-800">{{ item.value }}</span>
                  </div>
                  <div class="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                    <div 
                      [style.width.%]="(item.value / kpis.totalApplications) * 100"
                      [style.background]="item.color"
                      class="h-full transition-all duration-500"
                    ></div>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Applications by Program -->
          <div class="bg-neo-light rounded-3xl shadow-neo p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-6">Inscriptions par Programme</h3>
            <div class="space-y-4">
              @for (item of programChart; track item.label) {
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-gray-700">{{ item.label }}</span>
                    <span class="text-sm font-bold text-gray-800">{{ item.value }}</span>
                  </div>
                  <div class="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                    <div 
                      [style.width.%]="(item.value / getTotalPrograms()) * 100"
                      [style.background]="item.color"
                      class="h-full transition-all duration-500"
                    ></div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Timeline Chart -->
        <div class="bg-neo-light rounded-3xl shadow-neo p-6 mb-8">
          <h3 class="text-xl font-bold text-gray-800 mb-6">Évolution des Inscriptions</h3>
          <div class="h-64 flex items-end justify-between space-x-2">
            @for (bar of timelineData; track bar.label) {
              <div class="flex-1 flex flex-col items-center">
                <div 
                  class="w-full bg-gradient-to-t from-primary-500 to-primary-700 rounded-t-xl transition-all duration-500 hover:from-primary-600 hover:to-primary-800 cursor-pointer relative group"
                  [style.height.%]="(bar.value / getMaxValue(timelineData)) * 100"
                >
                  <span class="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity">
                    {{ bar.value }}
                  </span>
                </div>
                <span class="text-xs text-gray-600 mt-2">{{ bar.label }}</span>
              </div>
            }
          </div>
        </div>

        <!-- Completion Rate by Step -->
        <div class="bg-neo-light rounded-3xl shadow-neo p-6 mb-8">
          <h3 class="text-xl font-bold text-gray-800 mb-6">Taux de Complétion par Étape</h3>
          <div class="space-y-4">
            @for (step of completionByStep; track step.step) {
              <div>
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center space-x-2">
                    <span class="text-2xl">{{ step.icon }}</span>
                    <span class="text-sm font-medium text-gray-700">{{ step.step }}</span>
                  </div>
                  <span class="text-sm font-bold" [class]="getCompletionClass(step.rate)">{{ step.rate }}%</span>
                </div>
                <div class="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                  <div 
                    [style.width.%]="step.rate"
                    [class]="getCompletionBarClass(step.rate)"
                    class="h-full transition-all duration-500"
                  ></div>
                </div>
                <p class="text-xs text-gray-600 mt-1">{{ step.abandonRate }}% d'abandon à cette étape</p>
              </div>
            }
          </div>
        </div>

        <!-- Top Performers -->
        <div class="grid md:grid-cols-2 gap-6">
          <!-- Top Programs -->
          <div class="bg-neo-light rounded-3xl shadow-neo p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4">Programmes les Plus Demandés</h3>
            <div class="space-y-3">
              @for (program of topPrograms; track program.name) {
                <div class="flex items-center justify-between p-3 bg-white rounded-xl shadow-neo-sm">
                  <div class="flex items-center space-x-3">
                    <span class="text-2xl">{{ program.icon }}</span>
                    <div>
                      <p class="font-medium text-gray-800">{{ program.name }}</p>
                      <p class="text-xs text-gray-600">{{ program.applications }} candidatures</p>
                    </div>
                  </div>
                  <span class="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-medium">
                    #{{ program.rank }}
                  </span>
                </div>
              }
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="bg-neo-light rounded-3xl shadow-neo p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4">Activité Récente</h3>
            <div class="space-y-3">
              @for (activity of recentActivities; track activity.id) {
                <div class="flex items-start space-x-3 p-3 bg-white rounded-xl shadow-neo-sm">
                  <div [class]="getActivityIcon(activity.type)" class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span class="text-xl">{{ activity.icon }}</span>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-800">{{ activity.title }}</p>
                    <p class="text-xs text-gray-600">{{ activity.description }}</p>
                    <span class="text-xs text-gray-500">{{ activity.time }}</span>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AnalyticsComponent implements OnInit {
  selectedPeriod = 'month';

  kpis = {
    totalApplications: 0,
    approvalRate: 0,
    approvedCount: 0,
    rejectionRate: 0,
    rejectedCount: 0,
    avgProcessingTime: 0,
    applicationsGrowth: 0
  };
  statusChart: ChartData[] = [];

  programChart: ChartData[] = [];

  timelineData: Array<{ label: string; value: number }> = [];

  completionByStep: Array<{ step: string; icon: string; rate: number; abandonRate: number }> = [];

  topPrograms: Array<{ rank: number; name: string; icon: string; applications: number }> = [];

  recentActivities: Array<any> = [];

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadAnalytics();
  }

  loadAnalytics() {
    console.log('Loading analytics for period:', this.selectedPeriod);
    this.adminService.getAnalytics(this.selectedPeriod).subscribe({
      next: (res: any) => {
        // Try to map fields from API response to the component model; keep defaults if missing
        if (!res) return;
        this.kpis.totalApplications = res.totalApplications ?? res.total ?? this.kpis.totalApplications;
        this.kpis.approvalRate = res.approvalRate ?? res.approvalRate ?? this.kpis.approvalRate;
        this.kpis.approvedCount = res.approvedCount ?? res.approved ?? this.kpis.approvedCount;
        this.kpis.rejectionRate = res.rejectionRate ?? this.kpis.rejectionRate;
        this.kpis.rejectedCount = res.rejectedCount ?? this.kpis.rejectedCount;
        this.kpis.avgProcessingTime = res.avgProcessingTime ?? this.kpis.avgProcessingTime;
        this.kpis.applicationsGrowth = res.applicationsGrowth ?? this.kpis.applicationsGrowth;

        if (Array.isArray(res.statusChart)) this.statusChart = res.statusChart;
        if (Array.isArray(res.programChart)) this.programChart = res.programChart;
        if (Array.isArray(res.timelineData)) this.timelineData = res.timelineData;
        if (Array.isArray(res.completionByStep)) this.completionByStep = res.completionByStep;
        if (Array.isArray(res.topPrograms)) this.topPrograms = res.topPrograms;
        if (Array.isArray(res.recentActivities)) this.recentActivities = res.recentActivities;
      },
      error: (err) => {
        console.error('Failed to load analytics', err);
      }
    });
  }

  getTotalPrograms(): number {
    return this.programChart.reduce((sum, item) => sum + item.value, 0);
  }

  getMaxValue(data: any[]): number {
    return Math.max(...data.map(d => d.value));
  }

  getCompletionClass(rate: number): string {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 75) return 'text-yellow-600';
    return 'text-red-600';
  }

  getCompletionBarClass(rate: number): string {
    if (rate >= 90) return 'bg-gradient-to-r from-green-500 to-green-700';
    if (rate >= 75) return 'bg-gradient-to-r from-yellow-500 to-yellow-700';
    return 'bg-gradient-to-r from-red-500 to-red-700';
  }

  getActivityIcon(type: string): string {
    const classes: any = {
      'approval': 'bg-green-100',
      'submission': 'bg-blue-100',
      'document': 'bg-purple-100',
      'rejection': 'bg-red-100'
    };
    return classes[type] || 'bg-gray-100';
  }

  // logout handled on main admin dashboard
}
