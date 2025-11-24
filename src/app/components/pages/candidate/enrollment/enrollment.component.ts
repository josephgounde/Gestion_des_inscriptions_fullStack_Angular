// src/app/pages/candidate/enrollment/enrollment-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Step {
  id: number;
  title: string;
  icon: string;
  completed: boolean;
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  url: string;
  preview?: string;
}

@Component({
  selector: 'app-enrollment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-neo-light via-gray-100 to-neo-light py-8">
      <div class="container mx-auto px-4 max-w-6xl">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-gray-800 mb-2">Formulaire d'Inscription</h1>
          <p class="text-gray-600">Complétez les 5 étapes pour finaliser votre inscription</p>
        </div>

        <!-- Progress Stepper -->
        <div class="mb-8">
          <div class="flex items-center justify-between relative">
            @for (step of steps; track step.id; let i = $index) {
              <div class="flex-1 relative z-10">
                <div class="flex flex-col items-center">
                  <button
                    (click)="goToStep(step.id)"
                    [disabled]="!canNavigateToStep(step.id)"
                    class="w-14 h-14 rounded-full transition-all duration-300 flex items-center justify-center text-white font-bold text-lg shadow-neo"
                    [class.bg-gradient-to-r]="currentStep === step.id || step.completed"
                    [class.from-primary-500]="currentStep === step.id || step.completed"
                    [class.to-primary-700]="currentStep === step.id || step.completed"
                    [class.bg-gray-300]="currentStep !== step.id && !step.completed"
                  >
                    @if (step.completed) {
                      <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                      </svg>
                    } @else {
                      {{ step.id }}
                    }
                  </button>
                  <span class="mt-3 text-sm font-medium text-center max-w-[120px]" 
                    [class.text-primary-600]="currentStep === step.id" 
                    [class.text-gray-600]="currentStep !== step.id">
                    {{ step.title }}
                  </span>
                </div>
                @if (i < steps.length - 1) {
                  <div class="absolute top-7 left-1/2 w-full h-1 -z-10"
                    [class.bg-primary-500]="step.completed"
                    [class.bg-gray-300]="!step.completed">
                  </div>
                }
              </div>
            }
          </div>
          
          <!-- Progress Bar -->
          <div class="mt-6 bg-gray-200 h-2 rounded-full overflow-hidden">
            <div class="bg-gradient-to-r from-primary-500 to-primary-700 h-full transition-all duration-500"
              [style.width.%]="getProgressPercentage()">
            </div>
          </div>
          <p class="text-center mt-2 text-sm text-gray-600">{{ getProgressPercentage() }}% complété</p>
        </div>

        <!-- Form Container -->
        <div class="bg-neo-light rounded-3xl shadow-neo p-8">
          
          <!-- Step 1: Personal Information -->
          @if (currentStep === 1) {
            <div class="space-y-6 animate-fade-in">
              <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span class="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-primary-700 flex items-center justify-center mr-3">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </span>
                Informations Personnelles
              </h2>
              <form [formGroup]="personalInfoForm" class="space-y-6">
                <div class="grid md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                    <input 
                      type="text" 
                      formControlName="lastName"
                      class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      placeholder="Votre nom"
                    />
                    @if (personalInfoForm.get('lastName')?.invalid && personalInfoForm.get('lastName')?.touched) {
                      <p class="text-red-500 text-sm mt-1">Nom requis (lettres uniquement)</p>
                    }
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                    <input 
                      type="text" 
                      formControlName="firstName"
                      class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      placeholder="Votre prénom"
                    />
                  </div>
                </div>

                <div class="grid md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Sexe *</label>
                    <div class="flex gap-4">
                      @for (gender of genders; track gender.value) {
                        <label class="flex-1 cursor-pointer">
                          <input 
                            type="radio" 
                            formControlName="gender" 
                            [value]="gender.value"
                            class="hidden peer"
                          />
                          <div class="px-4 py-3 rounded-xl bg-neo-light shadow-neo peer-checked:shadow-neo-inset peer-checked:bg-primary-50 border-2 border-transparent peer-checked:border-primary-500 transition-all text-center">
                            <span class="text-2xl">{{ gender.icon }}</span>
                            <p class="text-sm font-medium mt-1">{{ gender.label }}</p>
                          </div>
                        </label>
                      }
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Date de naissance *</label>
                    <input 
                      type="date" 
                      formControlName="birthDate"
                      class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    />
                    @if (personalInfoForm.get('birthDate')?.errors?.['underAge']) {
                      <p class="text-red-500 text-sm mt-1">Vous devez avoir au moins 16 ans</p>
                    }
                  </div>
                </div>

                <div class="grid md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Nationalité *</label>
                    <select 
                      formControlName="nationality"
                      class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    >
                      <option value="">Sélectionner...</option>
                      @for (country of countries; track country) {
                        <option [value]="country">{{ country }}</option>
                      }
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Type de pièce d'identité *</label>
                    <select 
                      formControlName="idType"
                      class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    >
                      <option value="">Sélectionner...</option>
                      <option value="CNI">Carte Nationale d'Identité</option>
                      <option value="PASSPORT">Passeport</option>
                      <option value="BIRTH_CERT">Acte de naissance</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Numéro de pièce *</label>
                  <input 
                    type="text" 
                    formControlName="idNumber"
                    class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    placeholder="Numéro de votre pièce d'identité"
                  />
                </div>
              </form>
            </div>
          }

          <!-- Step 2: Documents Upload -->
          @if (currentStep === 2) {
            <div class="space-y-6 animate-fade-in">
              <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span class="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-primary-700 flex items-center justify-center mr-3">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                  </svg>
                </span>
                Documents Officiels
              </h2>
              
              <div class="space-y-6">
                <!-- Diplomas -->
                <div class="p-6 rounded-2xl bg-white shadow-neo-sm">
                  <h3 class="font-semibold text-gray-800 mb-4">📄 Diplômes (PDF max 5Mo)</h3>
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm text-gray-600 mb-2">Baccalauréat *</label>
                      <div class="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary-500 transition-all cursor-pointer"
                        (click)="bacFileInput.click()">
                        <input #bacFileInput type="file" class="hidden" accept=".pdf" (change)="onFileSelect($event, 'bac')">
                        @if (documents.bac) {
                          <div class="flex items-center justify-between bg-primary-50 p-3 rounded-lg">
                            <span class="text-sm text-gray-700">{{ documents.bac.name }}</span>
                            <button (click)="removeFile('bac'); $event.stopPropagation()" class="text-red-500 hover:text-red-700">
                              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                              </svg>
                            </button>
                          </div>
                        } @else {
                          <svg class="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                          </svg>
                          <p class="text-sm text-gray-600">Cliquez pour télécharger</p>
                        }
                      </div>
                    </div>
                  </div>
                </div>

                <!-- ID Card -->
                <div class="p-6 rounded-2xl bg-white shadow-neo-sm">
                  <h3 class="font-semibold text-gray-800 mb-4">🖼️ Pièce d'identité (JPG/PNG)</h3>
                  <div class="grid md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm text-gray-600 mb-2">Recto *</label>
                      <div class="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-primary-500 transition-all cursor-pointer"
                        (click)="idRectoInput.click()">
                        <input #idRectoInput type="file" class="hidden" accept="image/*" (change)="onFileSelect($event, 'idRecto')">
                        @if (documents.idRecto?.preview) {
                          <img [src]="documents.idRecto.preview" class="w-full h-32 object-cover rounded-lg mb-2">
                          <button (click)="removeFile('idRecto'); $event.stopPropagation()" class="text-red-500 text-sm">Supprimer</button>
                        } @else {
                          <svg class="w-10 h-10 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                          </svg>
                          <p class="text-xs text-gray-600">Recto</p>
                        }
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm text-gray-600 mb-2">Verso *</label>
                      <div class="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-primary-500 transition-all cursor-pointer"
                        (click)="idVersoInput.click()">
                        <input #idVersoInput type="file" class="hidden" accept="image/*" (change)="onFileSelect($event, 'idVerso')">
                        @if (documents.idVerso?.preview) {
                          <img [src]="documents.idVerso.preview" class="w-full h-32 object-cover rounded-lg mb-2">
                          <button (click)="removeFile('idVerso'); $event.stopPropagation()" class="text-red-500 text-sm">Supprimer</button>
                        } @else {
                          <svg class="w-10 h-10 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                          </svg>
                          <p class="text-xs text-gray-600">Verso</p>
                        }
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Birth Certificate -->
                <div class="p-6 rounded-2xl bg-white shadow-neo-sm">
                  <h3 class="font-semibold text-gray-800 mb-4">🏛️ Acte de naissance (PDF)</h3>
                  <div class="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary-500 transition-all cursor-pointer"
                    (click)="birthCertInput.click()">
                    <input #birthCertInput type="file" class="hidden" accept=".pdf" (change)="onFileSelect($event, 'birthCert')">
                    @if (documents.birthCert) {
                      <div class="flex items-center justify-between bg-primary-50 p-3 rounded-lg">
                        <span class="text-sm text-gray-700">{{ documents.birthCert.name }}</span>
                        <button (click)="removeFile('birthCert'); $event.stopPropagation()" class="text-red-500 hover:text-red-700">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                        </button>
                      </div>
                    } @else {
                      <svg class="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                      </svg>
                      <p class="text-sm text-gray-600">Cliquez pour télécharger</p>
                    }
                  </div>
                </div>

                <!-- Photo -->
                <div class="p-6 rounded-2xl bg-white shadow-neo-sm">
                  <h3 class="font-semibold text-gray-800 mb-4">📸 Photo d'identité (3.5x4.5cm)</h3>
                  <div class="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary-500 transition-all cursor-pointer"
                    (click)="photoInput.click()">
                    <input #photoInput type="file" class="hidden" accept="image/*" (change)="onFileSelect($event, 'photo')">
                    @if (documents.photo?.preview) {
                      <img [src]="documents.photo.preview" class="w-32 h-40 object-cover rounded-lg mx-auto mb-2">
                      <button (click)="removeFile('photo'); $event.stopPropagation()" class="text-red-500 text-sm">Supprimer</button>
                    } @else {
                      <svg class="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                      <p class="text-sm text-gray-600">Cliquez pour télécharger</p>
                    }
                  </div>
                </div>
              </div>
            </div>
          }

          <!-- Step 3: Academic Background -->
          @if (currentStep === 3) {
            <div class="space-y-6 animate-fade-in">
              <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span class="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-primary-700 flex items-center justify-center mr-3">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                  </svg>
                </span>
                Parcours Académique
              </h2>
              <form [formGroup]="academicForm" class="space-y-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Dernier établissement fréquenté *</label>
                  <input 
                    type="text" 
                    formControlName="lastSchool"
                    class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    placeholder="Nom de l'établissement"
                  />
                </div>

                <div class="grid md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Spécialisation *</label>
                    <select 
                      formControlName="specialization"
                      class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    >
                      <option value="">Sélectionner...</option>
                      <option value="SCIENCES">Sciences</option>
                      <option value="LETTRES">Lettres</option>
                      <option value="ECONOMIE">Économie</option>
                      <option value="TECHNIQUE">Technique</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Niveau d'études *</label>
                    <select 
                      formControlName="level"
                      class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    >
                      <option value="">Sélectionner...</option>
                      <option value="BAC">Baccalauréat</option>
                      <option value="LICENSE">Licence</option>
                      <option value="MASTER">Master</option>
                      <option value="DOCTORAT">Doctorat</option>
                    </select>
                  </div>
                </div>

                <div class="grid md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Date de début *</label>
                    <input 
                      type="date" 
                      formControlName="startDate"
                      class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Date de fin *</label>
                    <input 
                      type="date" 
                      formControlName="endDate"
                      class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Programme souhaité *</label>
                  <select 
                    formControlName="desiredProgram"
                    class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  >
                    <option value="">Sélectionner...</option>
                    <option value="INFORMATIQUE">Informatique</option>
                    <option value="GESTION">Gestion</option>
                    <option value="MEDECINE">Médecine</option>
                    <option value="DROIT">Droit</option>
                    <option value="INGENIERIE">Ingénierie</option>
                  </select>
                </div>
              </form>
            </div>
          }

          <!-- Step 4: Contact Information -->
          @if (currentStep === 4) {
            <div class="space-y-6 animate-fade-in">
              <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span class="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-primary-700 flex items-center justify-center mr-3">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </span>
                Coordonnées
              </h2>
              <form [formGroup]="contactForm" class="space-y-6">
                <div class="grid md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input 
                      type="email" 
                      formControlName="email"
                      class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      placeholder="votre@email.com"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Confirmer Email *</label>
                    <input 
                      type="email" 
                      formControlName="emailConfirm"
                      class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      placeholder="Confirmer votre email"
                    />
                    @if (contactForm.errors?.['emailMismatch'] && contactForm.get('emailConfirm')?.touched) {
                      <p class="text-red-500 text-sm mt-1">Les emails ne correspondent pas</p>
                    }
                  </div>
                </div>

                <div class="grid md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                    <input 
                      type="tel" 
                      formControlName="phone"
                      class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      placeholder="+237 XXX XXX XXX"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Téléphone alternatif</label>
                    <input 
                      type="tel" 
                      formControlName="alternatePhone"
                      class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      placeholder="+237 XXX XXX XXX"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Adresse complète *</label>
                  <input 
                    type="text" 
                    formControlName="address"
                    class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    placeholder="Rue, Quartier"
                  />
                </div>

                <div class="grid md:grid-cols-3 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Ville *</label>
                    <input 
                      type="text" 
                      formControlName="city"
                      class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      placeholder="Ville"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Région *</label>
                    <input 
                      type="text" 
                      formControlName="region"
                      class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      placeholder="Région"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Code postal</label>
                    <input 
                      type="text" 
                      formControlName="postalCode"
                      class="w-full px-4 py-3 rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      placeholder="Code postal"
                    />
                  </div>
                </div>

                <!-- Emergency Contact -->
                <div class="mt-8 p-6 rounded-2xl bg-red-50 border-2 border-red-200">
                  <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
                    🚨 Personne à contacter en cas d'urgence
                  </h3>
                  <div class="grid md:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Nom complet *</label>
                      <input 
                        type="text" 
                        formControlName="emergencyName"
                        class="w-full px-4 py-3 rounded-xl bg-white shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                        placeholder="Nom de la personne"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Relation *</label>
                      <select 
                        formControlName="emergencyRelation"
                        class="w-full px-4 py-3 rounded-xl bg-white shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      >
                        <option value="">Sélectionner...</option>
                        <option value="PARENT">Parent</option>
                        <option value="CONJOINT">Conjoint(e)</option>
                        <option value="FRERE_SOEUR">Frère/Sœur</option>
                        <option value="AMI">Ami(e)</option>
                        <option value="TUTEUR">Tuteur</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                      <input 
                        type="tel" 
                        formControlName="emergencyPhone"
                        class="w-full px-4 py-3 rounded-xl bg-white shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                        placeholder="+237 XXX XXX XXX"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input 
                        type="email" 
                        formControlName="emergencyEmail"
                        class="w-full px-4 py-3 rounded-xl bg-white shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          }

          <!-- Step 5: Review and Submit -->
          @if (currentStep === 5) {
            <div class="space-y-6 animate-fade-in">
              <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span class="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-primary-700 flex items-center justify-center mr-3">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </span>
                Récapitulatif et Confirmation
              </h2>

              <div class="space-y-4">
                <!-- Personal Info Summary -->
                <div class="p-6 rounded-2xl bg-white shadow-neo-sm">
                  <div class="flex justify-between items-center mb-4">
                    <h3 class="font-semibold text-gray-800">Informations Personnelles</h3>
                    <button (click)="goToStep(1)" class="text-primary-500 text-sm hover:text-primary-700">Modifier</button>
                  </div>
                  <div class="grid md:grid-cols-2 gap-4 text-sm">
                    <div><span class="text-gray-600">Nom:</span> <span class="font-medium">{{ personalInfoForm.get('lastName')?.value }}</span></div>
                    <div><span class="text-gray-600">Prénom:</span> <span class="font-medium">{{ personalInfoForm.get('firstName')?.value }}</span></div>
                    <div><span class="text-gray-600">Sexe:</span> <span class="font-medium">{{ getGenderLabel(personalInfoForm.get('gender')?.value) }}</span></div>
                    <div><span class="text-gray-600">Date de naissance:</span> <span class="font-medium">{{ personalInfoForm.get('birthDate')?.value }}</span></div>
                    <div><span class="text-gray-600">Nationalité:</span> <span class="font-medium">{{ personalInfoForm.get('nationality')?.value }}</span></div>
                    <div><span class="text-gray-600">Pièce d'identité:</span> <span class="font-medium">{{ personalInfoForm.get('idType')?.value }}</span></div>
                  </div>
                </div>

                <!-- Documents Summary -->
                <div class="p-6 rounded-2xl bg-white shadow-neo-sm">
                  <div class="flex justify-between items-center mb-4">
                    <h3 class="font-semibold text-gray-800">Documents</h3>
                    <button (click)="goToStep(2)" class="text-primary-500 text-sm hover:text-primary-700">Modifier</button>
                  </div>
                  <div class="space-y-2 text-sm">
                    <div class="flex items-center justify-between">
                      <span class="text-gray-600">Baccalauréat:</span>
                      <span class="flex items-center">
                        @if (documents.bac) {
                          <svg class="w-5 h-5 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                          </svg>
                          <span class="text-green-600 font-medium">Téléchargé</span>
                        } @else {
                          <span class="text-red-600">Non téléchargé</span>
                        }
                      </span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-gray-600">Pièce d'identité:</span>
                      <span class="flex items-center">
                        @if (documents.idRecto && documents.idVerso) {
                          <svg class="w-5 h-5 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                          </svg>
                          <span class="text-green-600 font-medium">Téléchargé</span>
                        } @else {
                          <span class="text-red-600">Incomplet</span>
                        }
                      </span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-gray-600">Acte de naissance:</span>
                      <span class="flex items-center">
                        @if (documents.birthCert) {
                          <svg class="w-5 h-5 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                          </svg>
                          <span class="text-green-600 font-medium">Téléchargé</span>
                        } @else {
                          <span class="text-red-600">Non téléchargé</span>
                        }
                      </span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-gray-600">Photo d'identité:</span>
                      <span class="flex items-center">
                        @if (documents.photo) {
                          <svg class="w-5 h-5 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                          </svg>
                          <span class="text-green-600 font-medium">Téléchargé</span>
                        } @else {
                          <span class="text-red-600">Non téléchargé</span>
                        }
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Academic Summary -->
                <div class="p-6 rounded-2xl bg-white shadow-neo-sm">
                  <div class="flex justify-between items-center mb-4">
                    <h3 class="font-semibold text-gray-800">Parcours Académique</h3>
                    <button (click)="goToStep(3)" class="text-primary-500 text-sm hover:text-primary-700">Modifier</button>
                  </div>
                  <div class="grid md:grid-cols-2 gap-4 text-sm">
                    <div><span class="text-gray-600">Établissement:</span> <span class="font-medium">{{ academicForm.get('lastSchool')?.value }}</span></div>
                    <div><span class="text-gray-600">Spécialisation:</span> <span class="font-medium">{{ academicForm.get('specialization')?.value }}</span></div>
                    <div><span class="text-gray-600">Niveau:</span> <span class="font-medium">{{ academicForm.get('level')?.value }}</span></div>
                    <div><span class="text-gray-600">Programme souhaité:</span> <span class="font-medium">{{ academicForm.get('desiredProgram')?.value }}</span></div>
                  </div>
                </div>

                <!-- Contact Summary -->
                <div class="p-6 rounded-2xl bg-white shadow-neo-sm">
                  <div class="flex justify-between items-center mb-4">
                    <h3 class="font-semibold text-gray-800">Coordonnées</h3>
                    <button (click)="goToStep(4)" class="text-primary-500 text-sm hover:text-primary-700">Modifier</button>
                  </div>
                  <div class="grid md:grid-cols-2 gap-4 text-sm">
                    <div><span class="text-gray-600">Email:</span> <span class="font-medium">{{ contactForm.get('email')?.value }}</span></div>
                    <div><span class="text-gray-600">Téléphone:</span> <span class="font-medium">{{ contactForm.get('phone')?.value }}</span></div>
                    <div class="md:col-span-2"><span class="text-gray-600">Adresse:</span> <span class="font-medium">{{ contactForm.get('address')?.value }}, {{ contactForm.get('city')?.value }}</span></div>
                    <div class="md:col-span-2"><span class="text-gray-600">Contact d'urgence:</span> <span class="font-medium">{{ contactForm.get('emergencyName')?.value }} ({{ contactForm.get('emergencyPhone')?.value }})</span></div>
                  </div>
                </div>

                <!-- Terms and Conditions -->
                <div class="p-6 rounded-2xl bg-primary-50 border-2 border-primary-200">
                  <label class="flex items-start space-x-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      [(ngModel)]="acceptedTerms"
                      class="mt-1 w-5 h-5 rounded shadow-neo-inset checked:bg-primary-500"
                    />
                    <div>
                      <p class="font-medium text-gray-800">J'accepte les termes et conditions *</p>
                      <p class="text-sm text-gray-600 mt-1">
                        Je certifie que toutes les informations fournies sont exactes et complètes. 
                        Je comprends que toute fausse déclaration peut entraîner le rejet de ma candidature.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          }

          <!-- Navigation Buttons -->
          <div class="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button 
              (click)="previousStep()"
              [disabled]="currentStep === 1"
              class="px-6 py-3 rounded-xl bg-neo-light shadow-neo hover:shadow-neo-inset transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
              <span>Précédent</span>
            </button>

            <div class="flex items-center space-x-4">
              <button 
                (click)="saveProgress()"
                class="px-6 py-3 rounded-xl bg-neo-light shadow-neo hover:shadow-neo-inset transition-all duration-300 flex items-center space-x-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
                </svg>
                <span>Sauvegarder</span>
              </button>

              @if (currentStep < 5) {
                <button 
                  (click)="nextStep()"
                  [disabled]="!canProceedToNextStep()"
                  class="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 text-white font-semibold shadow-neo hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <span>Suivant</span>
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              } @else {
                <button 
                  (click)="submitApplication()"
                  [disabled]="!acceptedTerms || submitting"
                  class="px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold shadow-neo hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  @if (submitting) {
                    <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Soumission...</span>
                  } @else {
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span>Soumettre l'inscription</span>
                  }
                </button>
              }
            </div>
          </div>

          <!-- Auto-save indicator -->
          @if (autoSaved) {
            <div class="mt-4 text-center">
              <p class="text-sm text-green-600 flex items-center justify-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                Sauvegarde automatique effectuée
              </p>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class EnrollmentFormComponent implements OnInit {
  currentStep = 1;
  acceptedTerms = false;
  submitting = false;
  autoSaved = false;

  steps: Step[] = [
    { id: 1, title: 'Informations Personnelles', icon: 'user', completed: false },
    { id: 2, title: 'Documents', icon: 'upload', completed: false },
    { id: 3, title: 'Parcours Académique', icon: 'book', completed: false },
    { id: 4, title: 'Coordonnées', icon: 'mail', completed: false },
    { id: 5, title: 'Récapitulatif', icon: 'check', completed: false },
  ];

  genders = [
    { value: 'M', label: 'Masculin', icon: '♂️' },
    { value: 'F', label: 'Féminin', icon: '♀️' },
    { value: 'NB', label: 'Non-binaire', icon: '⚧️' }
  ];

  countries = [
    'Cameroun', 'France', 'Sénégal', 'Côte d\'Ivoire', 'Mali', 
    'Burkina Faso', 'Niger', 'Tchad', 'Gabon', 'Congo'
  ];

  documents: any = {
    bac: null,
    idRecto: null,
    idVerso: null,
    birthCert: null,
    photo: null
  };

  personalInfoForm: FormGroup;
  academicForm: FormGroup;
  contactForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.personalInfoForm = this.fb.group({
      lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/)]],
      firstName: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/)]],
      gender: ['', Validators.required],
      birthDate: ['', [Validators.required, this.ageValidator]],
      nationality: ['', Validators.required],
      idType: ['', Validators.required],
      idNumber: ['', Validators.required]
    });

    this.academicForm = this.fb.group({
      lastSchool: ['', Validators.required],
      specialization: ['', Validators.required],
      level: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      desiredProgram: ['', Validators.required]
    });

    this.contactForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      emailConfirm: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{10,15}$/)]],
      alternatePhone: [''],
      address: ['', Validators.required],
      city: ['', Validators.required],
      region: ['', Validators.required],
      postalCode: [''],
      emergencyName: ['', Validators.required],
      emergencyRelation: ['', Validators.required],
      emergencyPhone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{10,15}$/)]],
      emergencyEmail: ['', Validators.email]
    }, { validators: this.emailMatchValidator });
  }

  ngOnInit() {
    // Auto-save every 30 seconds
    setInterval(() => {
      this.saveProgress();
    }, 30000);
  }

  ageValidator(control: any) {
    if (!control.value) return null;
    const birthDate = new Date(control.value);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 16 ? null : { underAge: true };
  }

  emailMatchValidator(group: FormGroup) {
    const email = group.get('email')?.value;
    const emailConfirm = group.get('emailConfirm')?.value;
    return email === emailConfirm ? null : { emailMismatch: true };
  }

  getStepClass(step: Step): string {
    const base = 'w-14 h-14 rounded-full transition-all duration-300 flex items-center justify-center font-bold text-lg shadow-neo';
    if (step.completed) return `${base} bg-gradient-to-r from-green-500 to-green-700 text-white`;
    if (this.currentStep === step.id) return `${base} bg-gradient-to-r from-primary-500 to-primary-700 text-white scale-110`;
    return `${base} bg-gray-300 text-gray-600`;
  }

  canNavigateToStep(stepId: number): boolean {
    return stepId <= this.currentStep || this.steps[stepId - 2]?.completed;
  }

  goToStep(stepId: number) {
    if (this.canNavigateToStep(stepId)) {
      this.currentStep = stepId;
    }
  }

  getProgressPercentage(): number {
    const completedSteps = this.steps.filter(s => s.completed).length;
    return Math.round((completedSteps / this.steps.length) * 100);
  }

  canProceedToNextStep(): boolean {
    switch (this.currentStep) {
      case 1:
        return this.personalInfoForm.valid;
      case 2:
        return !!(this.documents.bac && this.documents.idRecto && 
                  this.documents.idVerso && this.documents.birthCert && this.documents.photo);
      case 3:
        return this.academicForm.valid;
      case 4:
        return this.contactForm.valid;
      default:
        return true;
    }
  }

  nextStep() {
    if (this.canProceedToNextStep()) {
      this.steps[this.currentStep - 1].completed = true;
      this.currentStep++;
      this.saveProgress();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  onFileSelect(event: any, fileType: string) {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (5MB max for PDFs, 2MB for images)
      const maxSize = file.type.includes('pdf') ? 5 * 1024 * 1024 : 2 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('Fichier trop volumineux');
        return;
      }

      const uploadedFile: UploadedFile = {
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file)
      };

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          uploadedFile.preview = e.target.result;
          this.documents[fileType] = uploadedFile;
        };
        reader.readAsDataURL(file);
      } else {
        this.documents[fileType] = uploadedFile;
      }
    }
  }

  removeFile(fileType: string) {
    this.documents[fileType] = null;
  }

  getGenderLabel(value: string): string {
    const gender = this.genders.find(g => g.value === value);
    return gender ? gender.label : value;
  }

  saveProgress() {
    const formData = {
      personalInfo: this.personalInfoForm.value,
      academic: this.academicForm.value,
      contact: this.contactForm.value,
      currentStep: this.currentStep,
      steps: this.steps
    };
    // Save to localStorage or send to API
    localStorage.setItem('enrollmentProgress', JSON.stringify(formData));
    this.autoSaved = true;
    setTimeout(() => this.autoSaved = false, 3000);
  }

  submitApplication() {
    if (!this.acceptedTerms) {
      alert('Veuillez accepter les termes et conditions');
      return;
    }

    this.submitting = true;
    
    // Simulate API call
    setTimeout(() => {
      this.submitting = false;
      localStorage.removeItem('enrollmentProgress');
      alert('Inscription soumise avec succès! Vous recevrez un email de confirmation.');
      this.router.navigate(['/candidate/dashboard']);
    }, 2000);
  }
}
