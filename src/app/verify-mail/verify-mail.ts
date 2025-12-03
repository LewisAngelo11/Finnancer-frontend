import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  mensajeError = '';

  private registrationState = inject(RegistrationState);

  constructor(private fb: FormBuilder) {
    this.formVerificacion = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    });
  }

  // Método que registra al usuario a la BD
  onSubmit() {
    let registerBody = {
      ...this.registrationState.getRegistrationData(), codigoVerificacion: this.formVerificacion.value.codigo
    }

    this.auth.signUp(registerBody).subscribe({
      next: () => {
        this.mensajeError = '';
        this.router.navigate(['/onboarding']);
      },
      error: (err) => {
        console.log(err);
        this.mensajeError = err.error.message;
      }
    });
  }

  reenviarCodigo() {
    console.log('Reenviando código...');
  }
}
