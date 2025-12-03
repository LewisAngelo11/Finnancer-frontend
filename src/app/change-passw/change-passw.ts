import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-change-passw',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './change-passw.html',
  styleUrl: './change-passw.css'
})
export class ChangePassw {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private authService = inject(Auth);
  private router = inject(Router);

  showPassword = false;
  showConfirmPassword = false;

  resetPasswordForm = this.fb.group(
    {
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: this.passwordsMatchValidator }
  );

  passwordsMatchValidator(form: any) {
    const newPass = form.get('newPassword')?.value;
    const confirmPass = form.get('confirmPassword')?.value;

    if (newPass !== confirmPass) {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      form.get('confirmPassword')?.setErrors(null);
    }
  }

  onSubmit() {
    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    const { newPassword } = this.resetPasswordForm.value;

    const correo = this.route.snapshot.queryParamMap.get('email');

    if (!correo) {
      alert('No se encontró el correo para restablecer la contraseña.');
      return;
    }

    this.authService.resetPassword(correo, newPassword!)
    .subscribe({
      next: () => {
        this.router.navigate(['']);
      },
      error: (err) => {
        console.error(err);
      }
    });

  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
