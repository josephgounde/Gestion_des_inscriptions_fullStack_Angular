// src/app/pages/admin/settings/settings.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-neo-light via-gray-100 to-neo-light p-6">
      <!-- Header -->
      <header class="bg-white shadow-neo-sm mb-6">
        <div class="container mx-auto px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-800">Paramètres</h1>
              <p class="text-sm text-gray-600">Gérez les paramètres de l'application</p>
            </div>
            <a routerLink="/admin/dashboard" class="px-4 py-2 rounded-xl bg-neo-light shadow-neo hover:shadow-neo-inset transition-all text-gray-700 font-medium">
              Go Back
            </a>
          </div>
        </div>
      </header>

      <div class="container mx-auto max-w-4xl">

        <!-- Tabs -->
        <div class="bg-neo-light rounded-3xl shadow-neo p-2 mb-6">
          <div class="flex space-x-2">
            <ng-container *ngFor="let tab of tabs; trackBy: trackTabById">
              <button
                (click)="activeTab = tab.id"
                [class.shadow-neo-inset]="activeTab === tab.id"
                [class.bg-primary-500]="activeTab === tab.id"
                [class.text-white]="activeTab === tab.id"
                class="flex-1 py-3 px-4 rounded-xl font-medium transition-all"
              >
                {{ tab.label }}
              </button>
            </ng-container>
          </div>
        </div>

        <!-- General Settings -->
        <ng-container *ngIf="activeTab === 'general'">
          <div class="bg-neo-light rounded-3xl shadow-neo p-8 space-y-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">Paramètres Généraux</h2>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nom de l'établissement</label>
              <input 
                type="text" 
                value="DynamicEnroll University"
                class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email de contact</label>
              <input 
                type="email" 
                value="contact@enrollpro.com"
                class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
              <input 
                type="tel" 
                value="+237 XXX XXX XXX"
                class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
              <textarea 
                rows="3"
                class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500"
              >123 Rue Principale, Douala, Cameroun</textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Fuseau horaire</label>
              <select class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>GMT+1 (Afrique Centrale)</option>
                <option>GMT+0 (UTC)</option>
                <option>GMT+2 (Afrique de l'Est)</option>
              </select>
            </div>

            <button class="px-8 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 text-white font-semibold shadow-neo hover:shadow-lg transition-all">
              Sauvegarder les modifications
            </button>
          </div>
  </ng-container>

        <!-- Enrollment Settings -->
        <ng-container *ngIf="activeTab === 'enrollment'">
          <div class="bg-neo-light rounded-3xl shadow-neo p-8 space-y-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">Paramètres d'Inscription</h2>
            
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-white rounded-xl shadow-neo-sm">
                <div>
                  <p class="font-medium text-gray-800">Inscription ouverte</p>
                  <p class="text-sm text-gray-600">Permettre aux nouveaux candidats de s'inscrire</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked class="sr-only peer">
                  <div class="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div class="flex items-center justify-between p-4 bg-white rounded-xl shadow-neo-sm">
                <div>
                  <p class="font-medium text-gray-800">Validation automatique</p>
                  <p class="text-sm text-gray-600">Valider automatiquement les documents conformes</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" class="sr-only peer">
                  <div class="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div class="flex items-center justify-between p-4 bg-white rounded-xl shadow-neo-sm">
                <div>
                  <p class="font-medium text-gray-800">Notifications email</p>
                  <p class="text-sm text-gray-600">Envoyer des emails aux candidats</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked class="sr-only peer">
                  <div class="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div class="flex items-center justify-between p-4 bg-white rounded-xl shadow-neo-sm">
                <div>
                  <p class="font-medium text-gray-800">Notifications SMS</p>
                  <p class="text-sm text-gray-600">Envoyer des SMS aux candidats</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked class="sr-only peer">
                  <div class="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>

            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Date limite d'inscription</label>
                <input 
                  type="date" 
                  value="2025-12-31"
                  class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nombre max de candidats</label>
                <input 
                  type="number" 
                  value="5000"
                  class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Taille max des fichiers (Mo)</label>
              <input 
                type="number" 
                value="5"
                class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <button class="px-8 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 text-white font-semibold shadow-neo hover:shadow-lg transition-all">
              Sauvegarder les modifications
            </button>
          </div>
  </ng-container>

        <!-- Email Templates -->
        <ng-container *ngIf="activeTab === 'emails'">
          <div class="bg-neo-light rounded-3xl shadow-neo p-8 space-y-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">Templates d'Emails</h2>
            
            <div class="space-y-4">
              <div class="p-4 bg-white rounded-xl shadow-neo-sm">
                <div class="flex items-center justify-between mb-3">
                  <div>
                    <p class="font-medium text-gray-800">Email de bienvenue</p>
                    <p class="text-sm text-gray-600">Envoyé lors de l'inscription</p>
                  </div>
                  <button class="px-4 py-2 rounded-lg bg-primary-50 hover:bg-primary-100 text-primary-600 transition-all text-sm font-medium">
                    Modifier
                  </button>
                </div>
                <div class="p-3 bg-gray-50 rounded-lg">
                  <p class="text-sm text-gray-700">Objet: Bienvenue sur DynamicEnroll!</p>
                  <p class="text-xs text-gray-600 mt-1">Bonjour {{ '{' }}nom{{ '}' }}, nous sommes ravis de vous accueillir...</p>
                </div>
              </div>

              <div class="p-4 bg-white rounded-xl shadow-neo-sm">
                <div class="flex items-center justify-between mb-3">
                  <div>
                    <p class="font-medium text-gray-800">Confirmation de soumission</p>
                    <p class="text-sm text-gray-600">Envoyé après soumission du dossier</p>
                  </div>
                  <button class="px-4 py-2 rounded-lg bg-primary-50 hover:bg-primary-100 text-primary-600 transition-all text-sm font-medium">
                    Modifier
                  </button>
                </div>
                <div class="p-3 bg-gray-50 rounded-lg">
                  <p class="text-sm text-gray-700">Objet: Votre dossier a été reçu</p>
                  <p class="text-xs text-gray-600 mt-1">Votre candidature {{ '{' }}Id{{ '}' }} a été soumise avec succès...</p>
                </div>
              </div>

              <div class="p-4 bg-white rounded-xl shadow-neo-sm">
                <div class="flex items-center justify-between mb-3">
                  <div>
                    <p class="font-medium text-gray-800">Approbation</p>
                    <p class="text-sm text-gray-600">Envoyé lors de l'approbation</p>
                  </div>
                  <button class="px-4 py-2 rounded-lg bg-primary-50 hover:bg-primary-100 text-primary-600 transition-all text-sm font-medium">
                    Modifier
                  </button>
                </div>
                <div class="p-3 bg-gray-50 rounded-lg">
                  <p class="text-sm text-gray-700">Objet: Félicitations! Votre candidature est approuvée</p>
                  <p class="text-xs text-gray-600 mt-1">Nous avons le plaisir de vous informer...</p>
                </div>
              </div>

              <div class="p-4 bg-white rounded-xl shadow-neo-sm">
                <div class="flex items-center justify-between mb-3">
                  <div>
                    <p class="font-medium text-gray-800">Rejet</p>
                    <p class="text-sm text-gray-600">Envoyé lors du rejet</p>
                  </div>
                  <button class="px-4 py-2 rounded-lg bg-primary-50 hover:bg-primary-100 text-primary-600 transition-all text-sm font-medium">
                    Modifier
                  </button>
                </div>
                <div class="p-3 bg-gray-50 rounded-lg">
                  <p class="text-sm text-gray-700">Objet: Mise à jour de votre candidature</p>
                  <p class="text-xs text-gray-600 mt-1">Après examen de votre dossier...</p>
                </div>
              </div>
            </div>
          </div>
  </ng-container>

        <!-- Security Settings -->
        <ng-container *ngIf="activeTab === 'security'">
          <div class="bg-neo-light rounded-3xl shadow-neo p-8 space-y-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">Sécurité</h2>
            
            <div class="p-6 bg-yellow-50 border-2 border-yellow-200 rounded-2xl mb-6">
              <div class="flex items-start space-x-3">
                <svg class="w-6 h-6 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                <div>
                  <p class="font-medium text-yellow-900">Zone sensible</p>
                  <p class="text-sm text-yellow-800 mt-1">Les modifications de sécurité peuvent affecter l'accès à la plateforme</p>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Changer le mot de passe</label>
              <div class="space-y-3">
                <input 
                  type="password" 
                  placeholder="Mot de passe actuel"
                  class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <input 
                  type="password" 
                  placeholder="Nouveau mot de passe"
                  class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <input 
                  type="password" 
                  placeholder="Confirmer le nouveau mot de passe"
                  class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <button class="mt-3 px-6 py-2 rounded-xl bg-neo-light shadow-neo hover:shadow-neo-inset transition-all text-gray-700 font-medium">
                Mettre à jour le mot de passe
              </button>
            </div>

            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-white rounded-xl shadow-neo-sm">
                <div>
                  <p class="font-medium text-gray-800">Authentification à deux facteurs</p>
                  <p class="text-sm text-gray-600">Ajouter une couche de sécurité supplémentaire</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" class="sr-only peer">
                  <div class="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div class="flex items-center justify-between p-4 bg-white rounded-xl shadow-neo-sm">
                <div>
                  <p class="font-medium text-gray-800">Journal d'audit</p>
                  <p class="text-sm text-gray-600">Enregistrer toutes les actions administratives</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked class="sr-only peer">
                  <div class="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Sessions actives</label>
              <div class="space-y-3">
                <div class="flex items-center justify-between p-4 bg-white rounded-xl shadow-neo-sm">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <div>
                      <p class="font-medium text-gray-800">Windows - Chrome</p>
                      <p class="text-sm text-gray-600">Douala, Cameroun • Actuelle</p>
                    </div>
                  </div>
                  <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Actif</span>
                </div>
              </div>
            </div>
          </div>
  </ng-container>
      </div>
    </div>
  `
})
export class SettingsComponent {
  activeTab = 'general';

  tabs = [
    { id: 'general', label: 'Général' },
    { id: 'enrollment', label: 'Inscriptions' },
    { id: 'emails', label: 'Emails' },
    { id: 'security', label: 'Sécurité' }
  ];

  trackTabById(index: number, tab: any) {
    return tab.id;
  }

  // No logout here; main dashboard handles logout
}