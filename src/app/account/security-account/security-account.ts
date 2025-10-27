import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, Validators } from '@angular/forms';
import { BodyUpdatePassw } from '../../services/usuario-service';
import { UsuarioService } from '../../services/usuario-service';

@Component({
  selector: 'app-security-account',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './security-account.html',
  styleUrl: './security-account.css'
})
export class SecurityAccount {
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);

  mensajeValidacion: string = '';
  isEqualsPassw = signal(true);
  isGodRequest = signal(false);
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  formSecurity = this.fb.group({
    contrasenaActual: ['', [Validators.required, Validators.minLength(8)]],
    nuevaContrasena: ['', [Validators.required, Validators.minLength(8)]],
    confirmarContrasena: ['', [Validators.required, Validators.minLength(8)]],
  })

  get currentPassw() {
    return this.formSecurity.get('contrasenaActual');
  }

  get newPassw () {
    return this.formSecurity.get('nuevaContrasena')
  }

  get confirmPassw() {
    return this.formSecurity.get('confirmarContrasena');
  }

  onSumbit() {
    if (this.newPassw?.value !== this.confirmPassw?.value){
      this.mensajeValidacion = 'Las contraseñas deben de coincidir';
      this.isEqualsPassw.set(false);
      return
    }

    let bodyUpdatePassw: BodyUpdatePassw = {
      contrasena: this.currentPassw?.value || '',
      nueva_contrasena: this.newPassw?.value || '',
    }

    this.usuarioService.updatePassw(bodyUpdatePassw).subscribe({
      next: (res) => {
        this.mensajeValidacion = res.mensaje;
        this.isGodRequest.set(true);

        this.currentPassw?.reset();
        this.newPassw?.reset();
        this.confirmPassw?.reset();
      },
      error: (err) => {
        this.mensajeValidacion = err.error.message;
        this.isGodRequest.set(false);
        console.log(err);
      }
    });
  }

  // Resetar mensajes
  resetMessage() {
    this.mensajeValidacion = '';
    this.isEqualsPassw.set(true);
    this.isGodRequest.set(false);
  }

  // Función para mostrar la contraseña actual en el input
  toggleCurrentPassword(): void {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  // Función para mostrar la contraseña nueva en el input
  toggleNewPassword(): void {
    this.showNewPassword = !this.showNewPassword;
  }

  // Función para mostrar la contraseña nueva confirmada en el input
  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
