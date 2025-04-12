import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RegisterService } from './register.service';
import { User } from './register.model';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
    standalone: true,
    imports: [
        ReactiveFormsModule,
        RouterLink,
        CommonModule
    ]
})
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    errorMessage: string = '';
    successMessage: string = '';
    isLoading: boolean = false;

    constructor(
        private fb: FormBuilder,
        private registerService: RegisterService,
        private router: Router
    ) {
        this.registerForm = this.fb.group({
            firstName: ['', [Validators.required, Validators.minLength(2)]],
            lastName: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', Validators.required],
            dateOfBirth: ['', Validators.required],
            gender: ['', Validators.required],
            phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
            emergencyContact: this.fb.group({
                name: ['', Validators.required],
                relationship: ['', Validators.required],
                phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
            }),
            medicalHistory: [''],
            currentMedications: ['']
        }, { validators: this.passwordMatchValidator });
    }

    ngOnInit(): void {}

    passwordMatchValidator(form: FormGroup) {
        const password = form.get('password')?.value;
        const confirmPassword = form.get('confirmPassword')?.value;
        return password === confirmPassword ? null : { mismatch: true };
    }

    onSubmit(): void {
        console.log('Form submitted', this.registerForm.value);
        console.log('Form valid?', this.registerForm.valid);
        console.log('Form errors:', this.registerForm.errors);
        
        if (!this.registerForm.valid) {
            console.log('Form validation errors:');
            Object.keys(this.registerForm.controls).forEach(key => {
                const control = this.registerForm.get(key);
                if (control?.errors) {
                    console.log(`${key} errors:`, control.errors);
                }
                if (key === 'emergencyContact') {
                    const emergencyGroup = control as FormGroup;
                    Object.keys(emergencyGroup.controls).forEach(emergencyKey => {
                        const emergencyControl = emergencyGroup.get(emergencyKey);
                        if (emergencyControl?.errors) {
                            console.log(`emergencyContact.${emergencyKey} errors:`, emergencyControl.errors);
                        }
                    });
                }
            });
        }
        
        if (this.registerForm.valid) {
            this.isLoading = true;
            const formData = this.registerForm.value;
            const userData: User = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                dateOfBirth: new Date(formData.dateOfBirth),
                gender: formData.gender,
                phoneNumber: formData.phoneNumber,
                emergencyContact: formData.emergencyContact,
                medicalHistory: formData.medicalHistory,
                currentMedications: formData.currentMedications
            };
            
            console.log('Sending user data:', userData);
            
            this.registerService.createUser(userData).subscribe({
                next: (response) => {
                    console.log('Registration successful:', response);
                    this.successMessage = 'Registration successful!';
                    this.errorMessage = '';
                    this.isLoading = false;
                    setTimeout(() => {
                        this.router.navigate(['/login']);
                    }, 2000);
                },
                error: (error) => {
                    console.error('Registration error:', error);
                    this.errorMessage = error.message || 'Registration failed. Please try again.';
                    this.successMessage = '';
                    this.isLoading = false;
                }
            });
        } else {
            // Mark all fields as touched to trigger validation messages
            Object.keys(this.registerForm.controls).forEach(key => {
                const control = this.registerForm.get(key);
                control?.markAsTouched();
            });
            
            // If there's a nested form group (emergencyContact)
            const emergencyContact = this.registerForm.get('emergencyContact');
            if (emergencyContact) {
                Object.keys(emergencyContact.value).forEach(key => {
                    const control = emergencyContact.get(key);
                    control?.markAsTouched();
                });
            }
        }
    }

    get formControls() {
        return this.registerForm.controls;
    }
}
