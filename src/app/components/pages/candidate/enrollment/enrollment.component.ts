// src/app/pages/candidate/enrollment/enrollment-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CandidateService, UserProfileDTO } from '../../../../services/candidate.service';
import { ApplicationService } from '../../../../services/application.service';
import { AuthService } from '../../../../services/auth.service';

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
  file: File;  // ✅ ADDED: Store actual File object for upload
}

@Component({
  selector: 'app-enrollment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-neo-light via-gray-100 to-neo-light">
      <!-- Mobile Header with Back Button -->
      <header class="sticky top-0 z-20 bg-white shadow-neo-sm lg:hidden">
        <div class="px-4 py-3 flex items-center justify-between">
          <button routerLink="/candidate/dashboard" class="p-2 rounded-lg hover:bg-gray-100 transition-all">
            <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 class="text-lg font-bold text-gray-800">Inscription</h1>
          <div class="w-10"></div>
        </div>
      </header>

      <div class="py-4 sm:py-6 lg:py-8">
        <div class="container mx-auto px-4 max-w-6xl">
          <!-- Desktop Header with Back Button -->
          <div class="hidden lg:flex items-center justify-between mb-6">
            <button routerLink="/candidate/dashboard" class="px-4 py-2 rounded-xl bg-neo-light shadow-neo hover:shadow-neo-inset transition-all flex items-center space-x-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
              <span class="font-medium text-gray-700">Retour au Dashboard</span>
            </button>
            <div class="text-right">
              <h1 class="text-2xl lg:text-4xl font-bold text-gray-800">Formulaire d'Inscription</h1>
              <p class="text-sm lg:text-base text-gray-600">Complétez les 5 étapes pour finaliser votre inscription</p>
            </div>
          </div>

          <!-- Mobile Title -->
          <div class="text-center mb-6 lg:hidden">
            <h2 class="text-xl font-bold text-gray-800 mb-1">Formulaire d'Inscription</h2>
            <p class="text-sm text-gray-600">Complétez les 5 étapes</p>
          </div>

          <!-- Progress Stepper - Responsive -->
          <div class="mb-6 sm:mb-8">
            <!-- Desktop Stepper -->
            <div class="hidden sm:flex items-center justify-between relative">
              @for (step of steps; track step.id; let i = $index) {
                <div class="flex-1 relative z-10">
                  <div class="flex flex-col items-center">
                    <button
                      (click)="goToStep(step.id)"
                      [disabled]="!canNavigateToStep(step.id)"
                      class="w-12 h-12 sm:w-14 sm:h-14 rounded-full transition-all duration-300 flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-neo"
                      [class.bg-gradient-to-r]="currentStep === step.id || step.completed"
                      [class.from-primary-500]="currentStep === step.id || step.completed"
                      [class.to-primary-700]="currentStep === step.id || step.completed"
                      [class.bg-gray-300]="currentStep !== step.id && !step.completed"
                    >
                      @if (step.completed) {
                        <svg class="w-5 h-5 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                        </svg>
                      } @else {
                        {{ step.id }}
                      }
                    </button>
                    <span class="mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-center max-w-[80px] sm:max-w-[120px]" 
                      [class.text-primary-600]="currentStep === step.id" 
                      [class.text-gray-600]="currentStep !== step.id">
                      {{ step.title }}
                    </span>
                  </div>
                  @if (i < steps.length - 1) {
                    <div class="absolute top-6 sm:top-7 left-1/2 w-full h-1 -z-10"
                      [class.bg-primary-500]="step.completed"
                      [class.bg-gray-300]="!step.completed">
                    </div>
                  }
                </div>
              }
            </div>

            <!-- Mobile Stepper - Dots -->
            <div class="sm:hidden flex items-center justify-center space-x-2 mb-4">
              @for (step of steps; track step.id) {
                <button
                  (click)="goToStep(step.id)"
                  [disabled]="!canNavigateToStep(step.id)"
                  class="h-3 rounded-full transition-all"
                  [class.bg-primary-500]="currentStep === step.id || step.completed"
                  [class.w-8]="currentStep === step.id"
                  [class.w-3]="currentStep !== step.id"
                  [class.bg-gray-300]="currentStep !== step.id && !step.completed"
                >
                </button>
              }
            </div>

            <!-- Current Step Title (Mobile) -->
            <div class="sm:hidden text-center mb-4">
              <p class="text-sm font-semibold text-primary-600">
                Étape {{ currentStep }}: {{ steps[currentStep - 1].title }}
              </p>
            </div>
            
            <!-- Progress Bar -->
            <div class="mt-4 sm:mt-6 bg-gray-200 h-2 rounded-full overflow-hidden">
              <div class="bg-gradient-to-r from-primary-500 to-primary-700 h-full transition-all duration-500"
                [style.width.%]="getProgressPercentage()">
              </div>
            </div>
            <p class="text-center mt-2 text-xs sm:text-sm text-gray-600">{{ getProgressPercentage() }}% complété</p>
          </div>

          <!-- Form Container -->
          <div class="bg-neo-light rounded-2xl sm:rounded-3xl shadow-neo p-4 sm:p-6 lg:p-8">
            
            <!-- Step 1: Personal Information -->
            @if (currentStep === 1) {
              <div class="space-y-4 sm:space-y-6 animate-fade-in">
                <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                  <span class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-primary-500 to-primary-700 flex items-center justify-center mr-2 sm:mr-3">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </span>
                  Informations Personnelles
                </h2>
                <form [formGroup]="personalInfoForm" class="space-y-4 sm:space-y-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center justify-between">
                        <span>Nom *</span>
                        @if (isPreFilled('personal', 'lastName')) {
                          <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center">
                            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                            </svg>
                            Pré-rempli
                          </span>
                        }
                      </label>
                      <input 
                        type="text" 
                        formControlName="lastName"
                        [class.bg-green-50]="isPreFilled('personal', 'lastName')"
                        [class.border-green-300]="isPreFilled('personal', 'lastName')"
                        class="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                        placeholder="Nom de famille"
                      />
                      @if (personalInfoForm.get('lastName')?.invalid && personalInfoForm.get('lastName')?.touched) {
                        <p class="text-red-500 text-xs sm:text-sm mt-1">Nom requis (lettres uniquement)</p>
                      }
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center justify-between">
                        <span>Prénom *</span>
                        @if (isPreFilled('personal', 'firstName')) {
                          <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center">
                            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                            </svg>
                            Pré-rempli
                          </span>
                        }
                      </label>
                      <input 
                        type="text" 
                        formControlName="firstName"
                        [class.bg-green-50]="isPreFilled('personal', 'firstName')"
                        [class.border-green-300]="isPreFilled('personal', 'firstName')"
                        class="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                        placeholder="Prénom"
                      />
                      @if (personalInfoForm.get('firstName')?.invalid && personalInfoForm.get('firstName')?.touched) {
                        <p class="text-red-500 text-xs sm:text-sm mt-1">Prénom requis (lettres uniquement)</p>
                      }
                    </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Genre *</label>
                      <div class="grid grid-cols-3 gap-2 sm:gap-3">
                        @for (gender of genders; track gender.value) {
                          <label class="relative cursor-pointer">
                            <input 
                              type="radio" 
                              formControlName="gender" 
                              [value]="gender.value"
                              class="peer sr-only"
                            />
                            <div class="p-3 sm:p-4 rounded-xl bg-neo-light shadow-neo-inset peer-checked:shadow-neo peer-checked:bg-primary-50 transition-all text-center">
                              <span class="text-xl sm:text-2xl block mb-1">{{ gender.icon }}</span>
                              <span class="text-xs font-medium text-gray-700">{{ gender.label }}</span>
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
                        class="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      />
                      @if (personalInfoForm.get('birthDate')?.invalid && personalInfoForm.get('birthDate')?.touched) {
                        <p class="text-red-500 text-xs sm:text-sm mt-1">Vous devez avoir au moins 16 ans</p>
                      }
                    </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Nationalité *</label>
                      <select 
                        formControlName="nationality"
                        class="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
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
                        class="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      >
                        <option value="">Sélectionner...</option>
                        <option value="CNI">Carte Nationale d'Identité</option>
                        <option value="PASSPORT">Passeport</option>
                        <option value="PERMIT">Permis de résidence</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Numéro de la pièce *</label>
                    <input 
                      type="text" 
                      formControlName="idNumber"
                      class="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      placeholder="Ex: A123456789"
                    />
                  </div>
                </form>
              </div>
            }

            <!-- Step 2: Documents -->
            @if (currentStep === 2) {
              <div class="space-y-4 sm:space-y-6 animate-fade-in">
                <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                  <span class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-primary-500 to-primary-700 flex items-center justify-center mr-2 sm:mr-3">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                    </svg>
                  </span>
                  Documents Officiels
                </h2>
                
                <div class="space-y-4 sm:space-y-6">
                  <!-- Diplomas -->
                  <div class="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white shadow-neo-sm">
                    <h3 class="text-sm sm:text-base font-semibold text-gray-800 mb-3 sm:mb-4">📄 Diplômes (PDF max 5Mo)</h3>
                    <div class="space-y-4">
                      <div>
                        <label class="block text-xs sm:text-sm text-gray-600 mb-2">Baccalauréat *</label>
                        <div class="border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center hover:border-primary-500 transition-all cursor-pointer"
                          (click)="bacFileInput.click()">
                          <input #bacFileInput type="file" class="hidden" accept=".pdf" (change)="onFileSelect($event, 'bac')">
                          @if (documents.bac) {
                            <div class="flex items-center justify-between bg-primary-50 p-3 rounded-lg">
                              <span class="text-xs sm:text-sm text-gray-700 truncate">{{ documents.bac.name }}</span>
                              <button (click)="removeFile('bac'); $event.stopPropagation()" class="text-red-500 hover:text-red-700 ml-2">
                                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                              </button>
                            </div>
                          } @else {
                            <svg class="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                            </svg>
                            <p class="text-xs sm:text-sm text-gray-600">Cliquez pour télécharger</p>
                          }
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- ID Card -->
                  <div class="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white shadow-neo-sm">
                    <h3 class="text-sm sm:text-base font-semibold text-gray-800 mb-3 sm:mb-4">🖼️ Pièce d'identité (JPG/PNG)</h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label class="block text-xs sm:text-sm text-gray-600 mb-2">Recto *</label>
                        <div class="border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center hover:border-primary-500 transition-all cursor-pointer"
                          (click)="idRectoInput.click()">
                          <input #idRectoInput type="file" class="hidden" accept="image/*" (change)="onFileSelect($event, 'idRecto')">
                          @if (documents.idRecto?.preview) {
                            <img [src]="documents.idRecto.preview" class="w-full h-24 sm:h-32 object-cover rounded-lg mb-2">
                            <button (click)="removeFile('idRecto'); $event.stopPropagation()" class="text-red-500 text-xs sm:text-sm">Supprimer</button>
                          } @else {
                            <svg class="w-8 h-8 sm:w-10 sm:h-10 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                            <p class="text-xs text-gray-600">Recto</p>
                          }
                        </div>
                      </div>
                      <div>
                        <label class="block text-xs sm:text-sm text-gray-600 mb-2">Verso *</label>
                        <div class="border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center hover:border-primary-500 transition-all cursor-pointer"
                          (click)="idVersoInput.click()">
                          <input #idVersoInput type="file" class="hidden" accept="image/*" (change)="onFileSelect($event, 'idVerso')">
                          @if (documents.idVerso?.preview) {
                            <img [src]="documents.idVerso.preview" class="w-full h-24 sm:h-32 object-cover rounded-lg mb-2">
                            <button (click)="removeFile('idVerso'); $event.stopPropagation()" class="text-red-500 text-xs sm:text-sm">Supprimer</button>
                          } @else {
                            <svg class="w-8 h-8 sm:w-10 sm:h-10 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                            <p class="text-xs text-gray-600">Verso</p>
                          }
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Birth Certificate -->
                  <div class="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white shadow-neo-sm">
                    <h3 class="text-sm sm:text-base font-semibold text-gray-800 mb-3 sm:mb-4">🏛️ Acte de naissance (PDF)</h3>
                    <div class="border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center hover:border-primary-500 transition-all cursor-pointer"
                      (click)="birthCertInput.click()">
                      <input #birthCertInput type="file" class="hidden" accept=".pdf" (change)="onFileSelect($event, 'birthCert')">
                      @if (documents.birthCert) {
                        <div class="flex items-center justify-between bg-primary-50 p-3 rounded-lg">
                          <span class="text-xs sm:text-sm text-gray-700 truncate">{{ documents.birthCert.name }}</span>
                          <button (click)="removeFile('birthCert'); $event.stopPropagation()" class="text-red-500 hover:text-red-700 ml-2">
                            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                          </button>
                        </div>
                      } @else {
                        <svg class="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                        </svg>
                        <p class="text-xs sm:text-sm text-gray-600">Cliquez pour télécharger</p>
                      }
                    </div>
                  </div>

                  <!-- Photo -->
                  <div class="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white shadow-neo-sm">
                    <h3 class="text-sm sm:text-base font-semibold text-gray-800 mb-3 sm:mb-4">📸 Photo d'identité (3.5x4.5cm)</h3>
                    <div class="border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center hover:border-primary-500 transition-all cursor-pointer"
                      (click)="photoInput.click()">
                      <input #photoInput type="file" class="hidden" accept="image/*" (change)="onFileSelect($event, 'photo')">
                      @if (documents.photo?.preview) {
                        <img [src]="documents.photo.preview" class="w-24 h-32 sm:w-32 sm:h-40 object-cover rounded-lg mx-auto mb-2">
                        <button (click)="removeFile('photo'); $event.stopPropagation()" class="text-red-500 text-xs sm:text-sm">Supprimer</button>
                      } @else {
                        <svg class="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        <p class="text-xs sm:text-sm text-gray-600">Cliquez pour télécharger</p>
                      }
                    </div>
                  </div>
                </div>
              </div>
            }

            <!-- Step 3: Academic Background -->
            @if (currentStep === 3) {
              <div class="space-y-4 sm:space-y-6 animate-fade-in">
                <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                  <span class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-primary-500 to-primary-700 flex items-center justify-center mr-2 sm:mr-3">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                    </svg>
                  </span>
                  Parcours Académique
                </h2>
                <form [formGroup]="academicForm" class="space-y-4 sm:space-y-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Dernier établissement fréquenté *</label>
                    <input 
                      type="text" 
                      formControlName="lastSchool"
                      class="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      placeholder="Nom de l'établissement"
                    />
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Spécialisation *</label>
                      <select 
                        formControlName="specialization"
                        class="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
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
                        class="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      >
                        <option value="">Sélectionner...</option>
                        <option value="BAC">Baccalauréat</option>
                        <option value="LICENSE">Licence</option>
                        <option value="MASTER">Master</option>
                        <option value="DOCTORAT">Doctorat</option>
                      </select>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Date de début *</label>
                      <input 
                        type="date" 
                        formControlName="startDate"
                        class="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Date de fin *</label>
                      <input 
                        type="date" 
                        formControlName="endDate"
                        class="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Programme souhaité *</label>
                    <select 
                      formControlName="desiredProgram"
                      class="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    >
                      <option value="">Sélectionner...</option>
                      <option value="INFORMATIQUE">Informatique</option>
                      <option value="GESTION">Gestion</option>
                      <option value="MARKETING">Marketing</option>
                      <option value="FINANCE">Finance</option>
                      <option value="RH">Ressources Humaines</option>
                    </select>
                  </div>
                </form>
              </div>
            }

            <!-- Step 4: Contact Information -->
            @if (currentStep === 4) {
              <div class="space-y-4 sm:space-y-6 animate-fade-in">
                <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                  <span class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-primary-500 to-primary-700 flex items-center justify-center mr-2 sm:mr-3">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </span>
                  Coordonnées
                </h2>
                <form [formGroup]="contactForm" class="space-y-4 sm:space-y-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center justify-between">
                        <span>Email *</span>
                        @if (isPreFilled('contact', 'email')) {
                          <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center">
                            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                            </svg>
                            Pré-rempli
                          </span>
                        }
                      </label>
                      <input 
                        type="email" 
                        formControlName="email"
                        [class.bg-green-50]="isPreFilled('contact', 'email')"
                        [class.border-green-300]="isPreFilled('contact', 'email')"
                        class="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                        placeholder="votre@email.com"
                      />
                      @if (contactForm.get('email')?.invalid && contactForm.get('email')?.touched) {
                        <p class="text-red-500 text-xs sm:text-sm mt-1">Email valide requis</p>
                      }
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center justify-between">
                        <span>Confirmer l'email *</span>
                        @if (isPreFilled('contact', 'emailConfirm')) {
                          <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center">
                            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                            </svg>
                            Pré-rempli
                          </span>
                        }
                      </label>
                      <input 
                        type="email" 
                        formControlName="emailConfirm"
                        [class.bg-green-50]="isPreFilled('contact', 'emailConfirm')"
                        [class.border-green-300]="isPreFilled('contact', 'emailConfirm')"
                        class="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                        placeholder="votre@email.com"
                      />
                      @if (contactForm.errors?.['emailMismatch'] && contactForm.get('emailConfirm')?.touched) {
                        <p class="text-red-500 text-xs sm:text-sm mt-1">Les emails ne correspondent pas</p>
                      }
                    </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center justify-between">
                        <span>Téléphone *</span>
                        @if (isPreFilled('contact', 'phone')) {
                          <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center">
                            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                            </svg>
                            Pré-rempli
                          </span>
                        }
                      </label>
                      <input 
                        type="tel" 
                        formControlName="phone"
                        [class.bg-green-50]="isPreFilled('contact', 'phone')"
                        [class.border-green-300]="isPreFilled('contact', 'phone')"
                        class="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                        placeholder="+237 6XX XX XX XX"
                      />
                      @if (contactForm.get('phone')?.invalid && contactForm.get('phone')?.touched) {
                        <p class="text-red-500 text-xs sm:text-sm mt-1">Numéro invalide (10-15 chiffres)</p>
                      }
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Téléphone alternatif</label>
                      <input 
                        type="tel" 
                        formControlName="alternatePhone"
                        class="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                        placeholder="Optionnel"
                      />
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Adresse complète *</label>
                    <input 
                      type="text" 
                      formControlName="address"
                      class="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      placeholder="Rue, quartier..."
                    />
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Ville *</label>
                      <input 
                        type="text" 
                        formControlName="city"
                        class="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                        placeholder="Ville"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Région *</label>
                      <input 
                        type="text" 
                        formControlName="region"
                        class="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                        placeholder="Région"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Code postal</label>
                      <input 
                        type="text" 
                        formControlName="postalCode"
                        class="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-xl bg-neo-light shadow-neo-inset focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                        placeholder="Optionnel"
                      />
                    </div>
                  </div>

                  <div class="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-amber-50 border border-amber-200">
                    <h3 class="text-sm sm:text-base font-semibold text-amber-900 mb-3 sm:mb-4">Contact d'urgence</h3>
                    <div class="space-y-4">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label class="block text-xs sm:text-sm font-medium text-amber-900 mb-2">Nom complet *</label>
                          <input 
                            type="text" 
                            formControlName="emergencyName"
                            class="w-full px-3 py-2 text-sm rounded-lg bg-white border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="Nom et prénom"
                          />
                        </div>
                        <div>
                          <label class="block text-xs sm:text-sm font-medium text-amber-900 mb-2">Relation *</label>
                          <select 
                            formControlName="emergencyRelation"
                            class="w-full px-3 py-2 text-sm rounded-lg bg-white border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          >
                            <option value="">Sélectionner...</option>
                            <option value="PARENT">Parent</option>
                            <option value="SIBLING">Frère/Sœur</option>
                            <option value="SPOUSE">Conjoint(e)</option>
                            <option value="FRIEND">Ami(e)</option>
                            <option value="OTHER">Autre</option>
                          </select>
                        </div>
                      </div>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label class="block text-xs sm:text-sm font-medium text-amber-900 mb-2">Téléphone *</label>
                          <input 
                            type="tel" 
                            formControlName="emergencyPhone"
                            class="w-full px-3 py-2 text-sm rounded-lg bg-white border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="+237 6XX XX XX XX"
                          />
                        </div>
                        <div>
                          <label class="block text-xs sm:text-sm font-medium text-amber-900 mb-2">Email</label>
                          <input 
                            type="email" 
                            formControlName="emergencyEmail"
                            class="w-full px-3 py-2 text-sm rounded-lg bg-white border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="Optionnel"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            }

            <!-- Step 5: Review & Submit -->
            @if (currentStep === 5) {
              <div class="space-y-4 sm:space-y-6 animate-fade-in">
                <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                  <span class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-primary-500 to-primary-700 flex items-center justify-center mr-2 sm:mr-3">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </span>
                  Récapitulatif
                </h2>

                <!-- Summary Sections -->
                <div class="space-y-4">
                  <!-- Personal Info Summary -->
                  <div class="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white shadow-neo-sm">
                    <div class="flex items-center justify-between mb-3 sm:mb-4">
                      <h3 class="text-sm sm:text-base font-semibold text-gray-800">Informations Personnelles</h3>
                      <button (click)="goToStep(1)" class="text-primary-500 hover:text-primary-700 text-xs sm:text-sm font-medium">
                        Modifier
                      </button>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                      <div>
                        <span class="text-gray-600">Nom:</span>
                        <span class="ml-2 font-medium text-gray-900">{{ personalInfoForm.value.lastName }}</span>
                      </div>
                      <div>
                        <span class="text-gray-600">Prénom:</span>
                        <span class="ml-2 font-medium text-gray-900">{{ personalInfoForm.value.firstName }}</span>
                      </div>
                      <div>
                        <span class="text-gray-600">Genre:</span>
                        <span class="ml-2 font-medium text-gray-900">{{ getGenderLabel(personalInfoForm.value.gender) }}</span>
                      </div>
                      <div>
                        <span class="text-gray-600">Date de naissance:</span>
                        <span class="ml-2 font-medium text-gray-900">{{ personalInfoForm.value.birthDate | date:'dd/MM/yyyy' }}</span>
                      </div>
                      <div>
                        <span class="text-gray-600">Nationalité:</span>
                        <span class="ml-2 font-medium text-gray-900">{{ personalInfoForm.value.nationality }}</span>
                      </div>
                      <div>
                        <span class="text-gray-600">Pièce d'identité:</span>
                        <span class="ml-2 font-medium text-gray-900">{{ personalInfoForm.value.idType }} - {{ personalInfoForm.value.idNumber }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Documents Summary -->
                  <div class="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white shadow-neo-sm">
                    <div class="flex items-center justify-between mb-3 sm:mb-4">
                      <h3 class="text-sm sm:text-base font-semibold text-gray-800">Documents</h3>
                      <button (click)="goToStep(2)" class="text-primary-500 hover:text-primary-700 text-xs sm:text-sm font-medium">
                        Modifier
                      </button>
                    </div>
                    <div class="space-y-2 text-xs sm:text-sm">
                      <div class="flex items-center">
                        @if (documents.bac) {
                          <svg class="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                          </svg>
                        } @else {
                          <svg class="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                        }
                        <span>Baccalauréat</span>
                      </div>
                      <div class="flex items-center">
                        @if (documents.idRecto && documents.idVerso) {
                          <svg class="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                          </svg>
                        } @else {
                          <svg class="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                        }
                        <span>Pièce d'identité (Recto/Verso)</span>
                      </div>
                      <div class="flex items-center">
                        @if (documents.birthCert) {
                          <svg class="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                          </svg>
                        } @else {
                          <svg class="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                        }
                        <span>Acte de naissance</span>
                      </div>
                      <div class="flex items-center">
                        @if (documents.photo) {
                          <svg class="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                          </svg>
                        } @else {
                          <svg class="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                        }
                        <span>Photo d'identité</span>
                      </div>
                    </div>
                  </div>

                  <!-- Academic Summary -->
                  <div class="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white shadow-neo-sm">
                    <div class="flex items-center justify-between mb-3 sm:mb-4">
                      <h3 class="text-sm sm:text-base font-semibold text-gray-800">Parcours Académique</h3>
                      <button (click)="goToStep(3)" class="text-primary-500 hover:text-primary-700 text-xs sm:text-sm font-medium">
                        Modifier
                      </button>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                      <div>
                        <span class="text-gray-600">Établissement:</span>
                        <span class="ml-2 font-medium text-gray-900">{{ academicForm.value.lastSchool }}</span>
                      </div>
                      <div>
                        <span class="text-gray-600">Spécialisation:</span>
                        <span class="ml-2 font-medium text-gray-900">{{ academicForm.value.specialization }}</span>
                      </div>
                      <div>
                        <span class="text-gray-600">Niveau:</span>
                        <span class="ml-2 font-medium text-gray-900">{{ academicForm.value.level }}</span>
                      </div>
                      <div>
                        <span class="text-gray-600">Programme souhaité:</span>
                        <span class="ml-2 font-medium text-gray-900">{{ academicForm.value.desiredProgram }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Contact Summary -->
                  <div class="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white shadow-neo-sm">
                    <div class="flex items-center justify-between mb-3 sm:mb-4">
                      <h3 class="text-sm sm:text-base font-semibold text-gray-800">Coordonnées</h3>
                      <button (click)="goToStep(4)" class="text-primary-500 hover:text-primary-700 text-xs sm:text-sm font-medium">
                        Modifier
                      </button>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                      <div>
                        <span class="text-gray-600">Email:</span>
                        <span class="ml-2 font-medium text-gray-900">{{ contactForm.value.email }}</span>
                      </div>
                      <div>
                        <span class="text-gray-600">Téléphone:</span>
                        <span class="ml-2 font-medium text-gray-900">{{ contactForm.value.phone }}</span>
                      </div>
                      <div class="sm:col-span-2">
                        <span class="text-gray-600">Adresse:</span>
                        <span class="ml-2 font-medium text-gray-900">{{ contactForm.value.address }}, {{ contactForm.value.city }}, {{ contactForm.value.region }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Terms and Conditions -->
                <div class="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-blue-50 border border-blue-200">
                  <label class="flex items-start cursor-pointer">
                    <input 
                      type="checkbox" 
                      [(ngModel)]="acceptedTerms"
                      class="mt-1 w-5 h-5 rounded shadow-neo-inset checked:bg-primary-500"
                    />
                    <span class="ml-3 text-xs sm:text-sm text-blue-900">
                      J'ai lu et j'accepte les <a href="#" class="underline font-medium">termes et conditions</a> ainsi que la 
                      <a href="#" class="underline font-medium">politique de confidentialité</a>. Je certifie que toutes les informations 
                      fournies sont exactes et complètes.
                    </span>
                  </label>
                </div>
              </div>
            }

            <!-- Navigation Buttons -->
            <div class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-0 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
              <button 
                (click)="previousStep()"
                [disabled]="currentStep === 1"
                class="w-full sm:w-auto px-4 sm:px-6 py-3 rounded-xl text-sm sm:text-base bg-neo-light shadow-neo hover:shadow-neo-inset transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
                <span>Précédent</span>
              </button>

              <div class="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <button 
                  (click)="saveProgress()"
                  class="w-full sm:w-auto px-4 sm:px-6 py-3 rounded-xl text-sm sm:text-base bg-neo-light shadow-neo hover:shadow-neo-inset transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
                  </svg>
                  <span>Sauvegarder</span>
                </button>

                @if (currentStep < 5) {
                  <button 
                    (click)="nextStep()"
                    [disabled]="!canProceedToNextStep()"
                    class="w-full sm:w-auto px-4 sm:px-6 py-3 rounded-xl text-sm sm:text-base bg-gradient-to-r from-primary-500 to-primary-700 text-white font-semibold shadow-neo hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <span>Suivant</span>
                    <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </button>
                } @else {
                  <button 
                    (click)="submitApplication()"
                    [disabled]="!acceptedTerms || submitting"
                    class="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-xl text-sm sm:text-base bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold shadow-neo hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    @if (submitting) {
                      <svg class="animate-spin h-4 h-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Soumission...</span>
                    } @else {
                      <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <p class="text-xs sm:text-sm text-green-600 flex items-center justify-center">
                  <svg class="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  Sauvegarde automatique effectuée
                </p>
              </div>
            }
          </div>
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
  userProfile?: UserProfileDTO; // For pre-filling form with registration data

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private candidateService: CandidateService,
    private applicationService: ApplicationService,
    private authService: AuthService  // ✅ ADDED
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
    // Load user profile for pre-filling
    this.loadUserProfile();
    
    // Note: We don't restore saved progress here anymore
    // Instead, we'll do it AFTER pre-filling in preFillForms()
  }

  /**
   * Load current user profile from backend for pre-filling
   */
  loadUserProfile() {
    this.candidateService.getCurrentUserProfile().subscribe({
      next: (profile) => {
        console.log('User profile loaded:', profile);
        this.userProfile = profile;
        this.preFillForms(profile);
      },
      error: (err) => {
        console.error('Failed to load user profile', err);
        // Continue without pre-filling - user can still fill form manually
      }
    });
  }

  /**
   * Pre-fill form fields with user profile data from registration
   */
  preFillForms(profile: UserProfileDTO) {
    console.log('Starting pre-fill with profile:', profile);
    
    // ===== STEP 1: Personal Information =====
    const personalData: any = {};
    
    if (profile.lastName) {
      personalData.lastName = profile.lastName;
    }
    if (profile.firstName) {
      personalData.firstName = profile.firstName;
    }
    if (profile.gender) {
      // Map gender to form values (M, F, NB)
      personalData.gender = profile.gender.toUpperCase();
    }
    if (profile.dateOfBirth) {  // ✅ Changed from birthDate to dateOfBirth
      // Convert ISO date to YYYY-MM-DD for input[type="date"]
      const dateStr = profile.dateOfBirth.includes('T') 
        ? profile.dateOfBirth.split('T')[0] 
        : profile.dateOfBirth;
      personalData.birthDate = dateStr;  // Form field is still birthDate
    }
    if (profile.nationality) {
      personalData.nationality = profile.nationality;
    }
    
    // Only patch if we have data to fill
    if (Object.keys(personalData).length > 0) {
      this.personalInfoForm.patchValue(personalData);
      console.log('Pre-filled personal info:', personalData);
    }

    // ===== STEP 4: Contact Information =====
    const contactData: any = {};
    
    if (profile.email) {
      contactData.email = profile.email;
      contactData.emailConfirm = profile.email; // Pre-fill confirmation too
    }
    if (profile.phoneNumber) {  // ✅ Changed from phone to phoneNumber
      contactData.phone = profile.phoneNumber;  // ✅ Fixed: use phoneNumber
    }
    if (profile.address) {
      contactData.address = profile.address;
    }
    // Note: city, region, postalCode not currently in backend UserResponseDTO
    // They can be added to backend if needed
    
    // Only patch if we have data to fill
    if (Object.keys(contactData).length > 0) {
      this.contactForm.patchValue(contactData);
      console.log('Pre-filled contact info:', contactData);
    }
    
    console.log('Pre-fill complete!');
    
    // NOW restore saved progress if it exists and has meaningful data
    // Saved progress will override pre-filled values
    const saved = localStorage.getItem('enrollmentProgress');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        
        // Check if saved data actually has content (not just empty forms)
        const hasPersonalData = data.personalInfo && Object.values(data.personalInfo).some((v: any) => v !== '' && v !== null);
        const hasAcademicData = data.academic && Object.values(data.academic).some((v: any) => v !== '' && v !== null);
        const hasContactData = data.contact && Object.values(data.contact).some((v: any) => v !== '' && v !== null);
        
        if (hasPersonalData || hasAcademicData || hasContactData) {
          // Has real saved data - restore it
          console.log('Restoring saved progress:', data);
          this.personalInfoForm.patchValue(data.personalInfo);
          this.academicForm.patchValue(data.academic);
          this.contactForm.patchValue(data.contact);
          this.currentStep = data.currentStep || 1;
          this.steps = data.steps || this.steps;
        } else {
          // Saved data is empty - clear it and use pre-filled data
          console.log('Saved progress is empty - clearing it');
          localStorage.removeItem('enrollmentProgress');
        }
      } catch (e) {
        console.error('Error parsing saved progress:', e);
        localStorage.removeItem('enrollmentProgress');
      }
    }
  }

  /**
   * Check if a form field is pre-filled from user profile
   */
  isPreFilled(formName: 'personal' | 'contact', fieldName: string): boolean {
    if (!this.userProfile) return false;
    
    const form = formName === 'personal' ? this.personalInfoForm : this.contactForm;
    const value = form.get(fieldName)?.value;
    
    return value !== null && value !== '' && value !== undefined;
  }

  ageValidator(control: any) {
    const birthDate = new Date(control.value);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 16 ? null : { underage: true };
  }

  emailMatchValidator(formGroup: FormGroup) {
    const email = formGroup.get('email')?.value;
    const emailConfirm = formGroup.get('emailConfirm')?.value;
    return email === emailConfirm ? null : { emailMismatch: true };
  }

  getProgressPercentage(): number {
    const completed = this.steps.filter(s => s.completed).length;
    return Math.round((completed / this.steps.length) * 100);
  }

  canNavigateToStep(stepId: number): boolean {
    if (stepId <= this.currentStep) return true;
    for (let i = 0; i < stepId - 1; i++) {
      if (!this.steps[i].completed) return false;
    }
    return true;
  }

  goToStep(stepId: number) {
    if (this.canNavigateToStep(stepId)) {
      this.currentStep = stepId;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  canProceedToNextStep(): boolean {
    switch (this.currentStep) {
      case 1:
        return this.personalInfoForm.valid;
      case 2:
        return !!(this.documents.bac && this.documents.idRecto && this.documents.idVerso && this.documents.birthCert && this.documents.photo);
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
      console.log('📎 File selected:', {
        name: file.name,
        type: file.type,
        size: file.size
      });

      // ✅ Validate file type FIRST
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',  // Some browsers report JPEG as jpg
        'image/png'
      ];
      
      const fileTypeLower = file.type.toLowerCase();
      const isValidType = allowedTypes.includes(fileTypeLower);
      
      if (!isValidType) {
        console.error('❌ Invalid file type:', file.type);
        alert(
          `Type de fichier non accepté: ${file.type}\n\n` +
          `Types acceptés:\n` +
          `• PDF (.pdf)\n` +
          `• JPEG (.jpg, .jpeg)\n` +
          `• PNG (.png)\n\n` +
          `Veuillez convertir votre fichier ou sélectionner un autre format.`
        );
        event.target.value = ''; // Clear the input
        return;
      }
      
      console.log('✅ File type valid:', file.type);

      // Check file size
      const maxSize = file.type.includes('pdf') ? 5 * 1024 * 1024 : 2 * 1024 * 1024;
      if (file.size > maxSize) {
        const maxSizeMB = maxSize / (1024 * 1024);
        alert(`Fichier trop volumineux (${(file.size / (1024 * 1024)).toFixed(2)} MB).\n\nTaille maximale: ${maxSizeMB} MB`);
        event.target.value = '';
        return;
      }

      const uploadedFile: UploadedFile = {
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
        file: file
      };

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          uploadedFile.preview = e.target.result;
          this.documents[fileType] = uploadedFile;
          console.log(`✅ ${fileType} uploaded successfully`);
        };
        reader.readAsDataURL(file);
      } else {
        this.documents[fileType] = uploadedFile;
        console.log(`✅ ${fileType} uploaded successfully`);
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
    localStorage.setItem('enrollmentProgress', JSON.stringify(formData));
    this.autoSaved = true;
    setTimeout(() => this.autoSaved = false, 3000);
  }

  submitApplication() {
    if (!this.acceptedTerms) {
      alert('Veuillez accepter les termes et conditions');
      return;
    }

    // Validate all forms
    if (!this.personalInfoForm.valid || !this.academicForm.valid || !this.contactForm.valid) {
      alert('Veuillez remplir tous les champs requis');
      return;
    }

    // Check if all required documents are uploaded
    if (!this.documents.bac || !this.documents.idRecto || !this.documents.idVerso || 
        !this.documents.birthCert || !this.documents.photo) {
      alert('Veuillez télécharger tous les documents requis');
      return;
    }

    this.submitting = true;

    // Prepare documents array for backend
    const documentsToUpload = [
      { name: 'Relevé de notes BAC', type: 'BAC', file: this.documents.bac.file },
      { name: 'Carte d\'identité (Recto)', type: 'ID_RECTO', file: this.documents.idRecto.file },
      { name: 'Carte d\'identité (Verso)', type: 'ID_VERSO', file: this.documents.idVerso.file },
      { name: 'Acte de naissance', type: 'BIRTH_CERTIFICATE', file: this.documents.birthCert.file },
      { name: 'Photo d\'identité', type: 'PHOTO', file: this.documents.photo.file }
    ];

    console.log('Submitting application with documents:', documentsToUpload.length);

    // Call backend API
    this.applicationService.submitApplication(documentsToUpload).subscribe({
      next: (response) => {
        console.log('Application submitted successfully:', response);
        this.submitting = false;
        
        // Clear saved progress
        localStorage.removeItem('enrollmentProgress');
        
        // Show success message
        alert('Inscription soumise avec succès! Votre candidature est en cours de traitement. Vous recevrez un email de confirmation.');
        
        // Redirect to dashboard
        this.router.navigate(['/candidate/dashboard']);
      },
      error: (err) => {
        console.error('Error submitting application:', err);
        this.submitting = false;
        
        // Show error message
        if (err.status === 401) {
          alert('Session expirée. Veuillez vous reconnecter.');
          this.router.navigate(['/login']);
        } else if (err.status === 400) {
          alert('Erreur dans les données soumises. Veuillez vérifier vos informations.');
        } else {
          alert('Erreur lors de la soumission. Veuillez réessayer.');
        }
      }
    });
  }
}