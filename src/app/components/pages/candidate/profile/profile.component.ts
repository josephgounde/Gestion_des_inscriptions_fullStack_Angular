// src/app/pages/candidate/profile/profile.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-neo-light via-gray-100 to-neo-light">
      <!-- Header -->
      <header class="bg-white shadow-neo-sm">
        <div class="container mx-auto px-6 py-4">
            <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-800">Mon Profil</h1>
              <p class="text-sm text-gray-600">Gérez vos informations personnelles</p>
            </div>
            <div class="flex items-center space-x-3">
              <a routerLink="/candidate/dashboard" class="px-4 py-2 rounded-xl bg-neo-light shadow-neo hover:shadow-neo-inset transition-all text-gray-700 font-medium">
                Go Back
              </a>
            </div>
          </div>
        </div>
      </header>

      <div class="container mx-auto px-6 py-8">
        <div class="grid lg:grid-cols-3 gap-6">
          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Profile Card -->
            <div class="bg-neo-light rounded-3xl shadow-neo p-6 text-center">
              <div class="relative inline-block mb-4">
                <div class="w-32 h-32 rounded-full bg-gradient-to-r from-primary-500 to-primary-700 flex items-center justify-center shadow-neo mx-auto">
                  @if (profilePhoto) {
                    <img [src]="profilePhoto" class="w-full h-full rounded-full object-cover">
                  } @else {
                    <span class="text-white text-4xl font-bold">{{ getInitials() }}</span>
                  }
                </div>
                <button 
                  (click)="photoInput.click()"
                  class="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary-500 text-white shadow-neo hover:shadow-lg transition-all flex items-center justify-center"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </button>
                <input #photoInput type="file" class="hidden" accept="image/*" (change)="onPhotoSelect($event)">
              </div>
              <h3 class="text-xl font-bold text-gray-800">{{ candidateName }}</h3>
              <p class="text-sm text-gray-600 mt-1">{{ candidateEmail }}</p>
              <div class="mt-4 pt-4 border-t border-gray-200">
                <div class="flex justify-around text-center">
                  <div>
                    <p class="text-2xl font-bold text-primary-600">1</p>
                    <p class="text-xs text-gray-600">Dossier</p>
                  </div>
                  <div>
                    <p class="text-2xl font-bold text-green-600">5</p>
                    <p class="text-xs text-gray-600">Documents</p>
                  </div>
                  <div>
                    <p class="text-2xl font-bold text-purple-600">89%</p>
                    <p class="text-xs text-gray-600">Complétude</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Links -->
            <div class="bg-neo-light rounded-3xl shadow-neo p-6">
              <h3 class="text-lg font-bold text-gray-800 mb-4">Liens Rapides</h3>
              <div class="space-y-2">
                <a routerLink="/candidate/enrollment" class="flex items-center space-x-3 p-3 rounded-xl hover:bg-white transition-all">
                  <svg class="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  <span class="text-sm font-medium text-gray-700">Mon inscription</span>
                </a>
                <a href="#" class="flex items-center space-x-3 p-3 rounded-xl hover:bg-white transition-all">
                  <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                  </svg>
                  <span class="text-sm font-medium text-gray-700">Mes documents</span>
                </a>
                <a href="#" class="flex items-center space-x-3 p-3 rounded-xl hover:bg-white transition-all">
                  <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
                  </svg>
                  <span class="text-sm font-medium text-gray-700">Messages</span>
                </a>
              </div>
            </div>
          </div>

          <!-- Main Content -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Tabs -->
            <div class="bg-neo-light rounded-3xl shadow-neo p-2">
              <div class="flex space-x-2">
                @for (tab of tabs; track tab.id) {
                  <button
                    (click)="activeTab = tab.id"
                    [class.shadow-neo-inset]="activeTab === tab.id"
                    [class.bg-primary-500]="activeTab === tab.id"
                    [class.text-white]="activeTab === tab.id"
                    class="flex-1 py-3 px-4 rounded-xl font-medium transition-all"
                  >
                    {{ tab.label }}
                  </button>
                }
              </div>
            </div>

            <!-- Personal Information -->
            @if (activeTab === 'personal') {
              <div class="bg-neo-light rounded-3xl shadow-neo p-8">
                <h2 class="text-2xl font-bold text-gray-800 mb-6">Informations Personnelles</h2>
                <form [formGroup]="personalForm" class="space-y-6">
                  <div class="grid md:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                      <input 
                        type="text" 
                        formControlName="lastName"
                        class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                      <input 
                        type="text" 
                        formControlName="firstName"
                        class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div class="grid md:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Date de naissance *</label>
                      <input 
                        type="date" 
                        formControlName="birthDate"
                        class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Sexe *</label>
                      <select 
                        formControlName="gender"
                        class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="M">Masculin</option>
                        <option value="F">Féminin</option>
                        <option value="NB">Non-binaire</option>
                      </select>
                    </div>
                  </div>

                  <div class="grid md:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Nationalité *</label>
                      <select 
                        formControlName="nationality"
                        class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="Cameroun">Cameroun</option>
                        <option value="France">France</option>
                        <option value="Sénégal">Sénégal</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Lieu de naissance *</label>
                      <input 
                        type="text" 
                        formControlName="birthPlace"
                        class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    class="px-8 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 text-white font-semibold shadow-neo hover:shadow-lg transition-all"
                  >
                    Enregistrer les modifications
                  </button>
                </form>
              </div>
            }

            <!-- Contact Information -->
            @if (activeTab === 'contact') {
              <div class="bg-neo-light rounded-3xl shadow-neo p-8">
                <h2 class="text-2xl font-bold text-gray-800 mb-6">Coordonnées</h2>
                <form [formGroup]="contactForm" class="space-y-6">
                  <div class="grid md:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input 
                        type="email" 
                        formControlName="email"
                        class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                      <input 
                        type="tel" 
                        formControlName="phone"
                        class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Adresse complète *</label>
                    <input 
                      type="text" 
                      formControlName="address"
                      class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div class="grid md:grid-cols-3 gap-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Ville *</label>
                      <input 
                        type="text" 
                        formControlName="city"
                        class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Région *</label>
                      <input 
                        type="text" 
                        formControlName="region"
                        class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Code postal</label>
                      <input 
                        type="text" 
                        formControlName="postalCode"
                        class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    class="px-8 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 text-white font-semibold shadow-neo hover:shadow-lg transition-all"
                  >
                    Enregistrer les modifications
                  </button>
                </form>
              </div>
            }

            <!-- Security Settings -->
            @if (activeTab === 'security') {
              <div class="bg-neo-light rounded-3xl shadow-neo p-8">
                <h2 class="text-2xl font-bold text-gray-800 mb-6">Sécurité du Compte</h2>
                
                <div class="space-y-6">
                  <!-- Change Password -->
                  <div class="p-6 bg-white rounded-2xl shadow-neo-sm">
                    <h3 class="text-lg font-bold text-gray-800 mb-4">Changer le mot de passe</h3>
                    <form [formGroup]="securityForm" class="space-y-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Mot de passe actuel</label>
                        <input 
                          type="password" 
                          formControlName="currentPassword"
                          class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Nouveau mot de passe</label>
                        <input 
                          type="password" 
                          formControlName="newPassword"
                          class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Confirmer le nouveau mot de passe</label>
                        <input 
                          type="password" 
                          formControlName="confirmPassword"
                          class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <button 
                        type="submit"
                        class="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 text-white font-semibold shadow-neo hover:shadow-lg transition-all"
                      >
                        Mettre à jour le mot de passe
                      </button>
                    </form>
                  </div>

                  <!-- Two Factor Authentication -->
                  <div class="p-6 bg-white rounded-2xl shadow-neo-sm">
                    <div class="flex items-center justify-between">
                      <div>
                        <h3 class="text-lg font-bold text-gray-800">Authentification à deux facteurs</h3>
                        <p class="text-sm text-gray-600 mt-1">Protégez votre compte avec une couche de sécurité supplémentaire</p>
                      </div>
                      <button class="px-6 py-3 rounded-xl bg-neo-light shadow-neo hover:shadow-neo-inset transition-all text-gray-700 font-medium">
                        Activer
                      </button>
                    </div>
                  </div>

                  <!-- Login History -->
                  <div class="p-6 bg-white rounded-2xl shadow-neo-sm">
                    <h3 class="text-lg font-bold text-gray-800 mb-4">Historique de connexion</h3>
                    <div class="space-y-3">
                      @for (login of loginHistory; track login.id) {
                        <div class="flex items-center justify-between p-3 bg-neo-light rounded-xl">
                          <div class="flex items-center space-x-3">
                            <div class="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                              </svg>
                            </div>
                            <div>
                              <p class="text-sm font-medium text-gray-800">{{ login.device }}</p>
                              <p class="text-xs text-gray-600">{{ login.location }} • {{ login.time }}</p>
                            </div>
                          </div>
                          @if (login.current) {
                            <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Actuel</span>
                          }
                        </div>
                      }
                    </div>
                  </div>
                </div>
              </div>
            }

            <!-- Preferences -->
            @if (activeTab === 'preferences') {
              <div class="bg-neo-light rounded-3xl shadow-neo p-8">
                <h2 class="text-2xl font-bold text-gray-800 mb-6">Préférences</h2>
                
                <div class="space-y-6">
                  <!-- Notifications -->
                  <div class="p-6 bg-white rounded-2xl shadow-neo-sm">
                    <h3 class="text-lg font-bold text-gray-800 mb-4">Notifications</h3>
                    <div class="space-y-3">
                      <div class="flex items-center justify-between">
                        <div>
                          <p class="font-medium text-gray-800">Notifications par email</p>
                          <p class="text-sm text-gray-600">Recevoir les mises à jour par email</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked class="sr-only peer">
                          <div class="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                      <div class="flex items-center justify-between">
                        <div>
                          <p class="font-medium text-gray-800">Notifications SMS</p>
                          <p class="text-sm text-gray-600">Recevoir les alertes par SMS</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked class="sr-only peer">
                          <div class="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                      <div class="flex items-center justify-between">
                        <div>
                          <p class="font-medium text-gray-800">Notifications push</p>
                          <p class="text-sm text-gray-600">Notifications dans l'application</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked class="sr-only peer">
                          <div class="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <!-- Language & Region -->
                  <div class="p-6 bg-white rounded-2xl shadow-neo-sm">
                    <h3 class="text-lg font-bold text-gray-800 mb-4">Langue et Région</h3>
                    <div class="grid md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Langue</label>
                        <select class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500">
                          <option>Français</option>
                          <option>English</option>
                          <option>Español</option>
                        </select>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Fuseau horaire</label>
                        <select class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500">
                          <option>GMT+1 (Afrique Centrale)</option>
                          <option>GMT+0 (UTC)</option>
                          <option>GMT+2 (Afrique de l'Est)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <!-- Privacy -->
                  <div class="p-6 bg-white rounded-2xl shadow-neo-sm">
                    <h3 class="text-lg font-bold text-gray-800 mb-4">Confidentialité</h3>
                    <div class="space-y-3">
                      <div class="flex items-center justify-between">
                        <div>
                          <p class="font-medium text-gray-800">Profil public</p>
                          <p class="text-sm text-gray-600">Permettre aux autres de voir votre profil</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" class="sr-only peer">
                          <div class="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <!-- Danger Zone -->
                  <div class="p-6 bg-red-50 border-2 border-red-200 rounded-2xl">
                    <h3 class="text-lg font-bold text-red-800 mb-4">Zone dangereuse</h3>
                    <div class="space-y-3">
                      <div class="flex items-center justify-between">
                        <div>
                          <p class="font-medium text-red-800">Supprimer mon compte</p>
                          <p class="text-sm text-red-700">Cette action est irréversible</p>
                        </div>
                        <button class="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-all">
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  activeTab = 'personal';
  candidateName = '';
  candidateEmail = '';
  profilePhoto: string | null = null;

  tabs = [
    { id: 'personal', label: 'Personnel' },
    { id: 'contact', label: 'Contact' },
    { id: 'security', label: 'Sécurité' },
    { id: 'preferences', label: 'Préférences' }
  ];

  loginHistory = [
    { id: 1, device: 'Windows - Chrome', location: 'Douala, Cameroun', time: 'Il y a 5 min', current: true },
    { id: 2, device: 'Android - Chrome Mobile', location: 'Yaoundé, Cameroun', time: 'Il y a 2 jours', current: false },
    { id: 3, device: 'Windows - Firefox', location: 'Douala, Cameroun', time: 'Il y a 5 jours', current: false }
  ];

  personalForm: FormGroup;
  contactForm: FormGroup;
  securityForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.personalForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: ['', Validators.required],
      gender: ['M', Validators.required],
      nationality: ['', Validators.required],
      birthPlace: ['', Validators.required]
    });

    this.contactForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      region: ['', Validators.required],
      postalCode: ['']
    });

    this.securityForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Load user profile data
    const user = this.authService.getCurrentUser();
    if (user) {
      this.candidateName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
      this.candidateEmail = user.email || '';
      this.personalForm.patchValue({
        firstName: user.firstName || '',
        lastName: user.lastName || ''
      });
      this.contactForm.patchValue({
        email: user.email || ''
      });
    }
  }

  getInitials(): string {
    return this.candidateName.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  onPhotoSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilePhoto = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // logout handled by admin dashboard
}
