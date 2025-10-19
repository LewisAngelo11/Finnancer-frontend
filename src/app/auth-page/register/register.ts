import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth, bodyCreateUser } from '../../services/auth';
import { Router } from '@angular/router';
import { RegistrationState } from '../../services/registration-state';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private router = inject(Router);
  private registrationState = inject(RegistrationState);

  mensajeError = '';

  // Crear el formulario de crear una cuenta.
  formSignUp = this.fb.group({
    name: ['', [Validators.required]],
    lastNameP: ['', [Validators.required]],
    lastNameM: ['', [Validators.required]],
    mail: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.min(8)]]
  });

  get name() {
    return this.formSignUp.get('name');
  }

  get lasNameP() {
    return this.formSignUp.get('lastNameP');
  }

  get lastNameM() {
    return this.formSignUp.get('lastNameM');
  }

  get mail() {
    return this.formSignUp.get('mail');
  }

  get password() {
    return this.formSignUp.get('password');
  }

  // Este metodo envía el mail de verificacion y guarda los datos del nuevo usuario temporalmente
  onSumbit () {
    const nuevoUsuario: bodyCreateUser = {
      nombre: this.name?.value || '',
      apellidoP: this.lasNameP?.value || '',
      apellidoM: this.lastNameM?.value || '',
      correo: this.mail?.value || '',
      contrasena: this.password?.value || ''
    }

    // Guarda los datos en memoria para recuperarlos posteriormente
    this.registrationState.setRegistrationData(nuevoUsuario);

    const nombreCompleto = `${nuevoUsuario.nombre} ${nuevoUsuario.apellidoP} ${nuevoUsuario.apellidoM}`;

    this.auth.sendMail(nuevoUsuario.correo, nombreCompleto).subscribe({
      next: () => {
        this.router.navigate(['/verifyMail']);
      },
      error: (err) => {
        this.mensajeError = err.error.message;
      }
    });
  }

  resetErrorMessage() {
    this.mensajeError = '';
  }
}
