import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-restore-passw',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './restore-passw.html',
  styleUrl: './restore-passw.css'
})
export class RestorePassw {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private authService = inject(Auth);

  goBackAuth() {
    this.router.navigate(['']);
  }


  formVerifyEmail = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  get email() {
    return this.formVerifyEmail.get('email')!;
  }

  sendVerificationCode() {
    if (this.formVerifyEmail.invalid) return;

    const email = this.formVerifyEmail.value.email!;

    this.authService.sendMailToRecoveryPassw(email).subscribe({
      next: (res) => {
        console.log(res.message);
        this.router.navigate(['/verifyMailPassw'], {
          queryParams: { email }
        });
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
  }
}
