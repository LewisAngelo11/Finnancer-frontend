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
    const mail = this.mail?.value || '';
    const password = this.password?.value || '';

    this.auth.login(mail, password).subscribe({
      next: (res) => {
        console.log(res);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.log(err);
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
