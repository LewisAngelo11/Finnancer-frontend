import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegistrationState } from '../services/registration-state';
import { Auth } from '../services/auth';
import { Router } from '@angular/router';


@Component({
  selector: 'app-verify-mail',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './verify-mail.html',
  styleUrl: './verify-mail.css'
})
export class VerifyMail {
  formVerificacion: FormGroup;

  private auth = inject(Auth);
  private router = inject(Router);

  private registrationState = inject(RegistrationState);

  constructor(private fb: FormBuilder) {
    this.formVerificacion = this.fb.group({
      codigo: [''],
    });
  }

  // Método que registra al usuario a la BD
  onSubmit() {
    let registerBody = {
      ...this.registrationState.getRegistrationData(), codigo: this.formVerificacion.value.codigo
    }

    this.auth.signUp(registerBody).subscribe({
      next: () => {
        this.router.navigate(['/onboarding']);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  reenviarCodigo() {
    console.log('Reenviando código...');
  }
}
