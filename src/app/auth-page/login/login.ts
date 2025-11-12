import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private router = inject(Router);
  
  mensajeError = '';
  showPassword = false;

  // Crear el formulario de login
  form = this.fb.group({
    mail: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.min(8)]]
  });

  get mail() {
    return this.form.get('mail');
  }

  get password() {
    return this.form.get('password');
  }

  onSumbit() {
    const correo = this.mail?.value || '';
    const contrasena = this.password?.value || '';

    this.auth.login({correo, contrasena}).subscribe({
      next: (res) => {
        //this.router.navigate(['/dashboard']);
        this.router.navigate(['/profilesSelector']);
      },
      error: (err) => {
        this.mensajeError = err.error.message;
      }
    });
  }

  // Función para mostrar la contraseña en el input
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  resetErrorMessage() {
    this.mensajeError = '';
  }
}
