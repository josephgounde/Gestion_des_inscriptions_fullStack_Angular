import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth.service'; // Assuming path

// =========================================================================
// DTO Definitions defined here to avoid external import
// =========================================================================

/**
 * Matches the structure of your Spring Boot AcademicHistoryRequestDTO.java
 */
interface AcademicHistoryRequestDTO {
  lastInstitution: string;
  specialization: string;
  formationPeriodStart: string; // ISO date string
  formationPeriodEnd: string;   // ISO date string
}

/**
 * Matches the structure of your Spring Boot UserRequestDTO.java
 * The 'academicHistory' property is the nested DTO.
 */
interface UserRequestDTO {
  firstName: string;
  lastName: string;
  password: string;
  username: string;
  gender: string;
  dateOfBirth: string; // ISO date string
  nationality: string;
  email: string;
  phoneNumber: string;
  address: string;
  emergencyContact: string; // Combined field
  Role: string; // Defaulting to 'CANDIDATE'
  academicHistory: AcademicHistoryRequestDTO;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html', 
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  showPassword = false;
  loading = false;
  errorMessage: string | null = null;
  
  // Data for form select fields
  genderOptions = ['MALE', 'FEMALE', 'NON_BINARY']; 

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService // Inject AuthService
  ) {}

  ngOnInit(): void {
    // FORM INITIALIZATION: Creating nested structure and all required fields
    this.registerForm = this.fb.group({
      // Core User Info (UserRequestDTO fields)
      firstName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      
      // Personal Details
      gender: ['', Validators.required],
      // dateOfBirth expects an ISO string, so we use type 'date' in HTML
      dateOfBirth: ['', [Validators.required, this.minimumAgeValidator(16)]], 
      nationality: ['', Validators.required],
      
      // Contact Info
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s-]{7,20}$/)]],
      address: ['', Validators.required],
      // We combine contact person info into one string for the DTO
      contactPersonName: [''], 
      contactPersonPhone: [''],
      
      // ACADEMIC HISTORY (NESTED FORMGROUP)
      academicHistory: this.fb.group({
        lastInstitution: ['', Validators.required],
        specialization: ['', Validators.required],
        // Dates are passed as strings to match AcademicHistoryRequestDTO
        formationPeriodStart: ['', Validators.required], 
        formationPeriodEnd: ['', Validators.required],
      }),
      
      // Legal/Terms
      acceptTerms: [false, Validators.requiredTrue]
      
    }, { validators: this.passwordMatchValidator });
  }

  // Custom validator for minimum age >= 16 years
  minimumAgeValidator(minAge: number) {
    return (control: { value: string | number | Date; }) => {
      const birthDate = new Date(control.value);
      const today = new Date();
      // Logic for calculating age difference
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();

      if (age > minAge || (age === minAge && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)))) {
        return null; // Valid
      }
      return { minAge: true }; // Invalid
    };
  }

  // Custom validator for password matching
  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onShowPasswordChange(event: Event): void {
    // 1. Check if the target exists
    if (event.target) {
      // 2. Explicitly cast the target to HTMLInputElement and assign 'checked'
      this.showPassword = (event.target as HTMLInputElement).checked;
    }
  }

  onSubmit(): void {
    this.errorMessage = null;
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.errorMessage = 'Please correct all form errors.';
      return;
    }

    this.loading = true;
    const formValue = this.registerForm.value;

    // CONSTRUCT PAYLOAD TO EXACTLY MATCH UserRequestDTO.java
    const userRequest: UserRequestDTO = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      password: formValue.password,
      username: formValue.username,
      gender: formValue.gender,
      // Date is sent as a string (ISO format) as expected by the DTO
      dateOfBirth: formValue.dateOfBirth, 
      nationality: formValue.nationality,
      email: formValue.email,
      phoneNumber: formValue.phoneNumber,
      address: formValue.address,
      // Combine emergency contact details as expected by the DTO
      emergencyContact: `${formValue.contactPersonName} (${formValue.contactPersonPhone})`,
      
      // Assign the default role for self-registration
      Role: 'CANDIDATE', 
      
      // NESTED ACADEMIC HISTORY
      academicHistory: {
        lastInstitution: formValue.academicHistory.lastInstitution,
        specialization: formValue.academicHistory.specialization,
        formationPeriodStart: formValue.academicHistory.formationPeriodStart,
        formationPeriodEnd: formValue.academicHistory.formationPeriodEnd,
      }
    };

    this.authService.register(userRequest).subscribe({
      next: (response) => {
        this.loading = false;
        // Registration successful. Log the user in or redirect to login.
        alert('Registration successful! Please log in.');
        this.router.navigate(['auth/login']);
        window.scrollTo(0, 0); 
      },
      error: (error) => {
        this.loading = false;
        console.error('Registration failed:', error);
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}

// NOTE: You must also define the UserRequestDTO interface in a separate file 
// (e.g., src/app/models/user-request.dto.ts) for proper TypeScript type checking.