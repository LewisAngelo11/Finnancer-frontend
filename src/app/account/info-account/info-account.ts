import { Component, inject, input, signal, effect, output, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { UsuarioService } from '../../services/usuario-service';
import { BodyUpdateUser } from '../../services/usuario-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-info-account',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './info-account.html',
  styleUrl: './info-account.css'
})
export class InfoAccount implements OnInit {
  modalOpen = signal(false);
  animateModal = signal(false);
  isSuperUser = signal(false); // Este signal lu utilizo para limitar a los perfiles que son de tipo 'Usuario' y no 'Administrador'

  nombreCuenta = input<string>();
  apellidoPCuenta = input<string>();
  apellidoMCuenta = input<string>();
  correo = input<string>();
  fechaRegistro = input<string>();
  datosActualizados = output<any>();

  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);

  mensajeRequest: string = '';

  formInfo = this.fb.group({
    nombre: [''],
    apellidoP: [''],
    apellidoM: [''],
  });

  ngOnInit(): void {
    const perfil = localStorage.getItem('perfilActual'); // Obtener el tipo de perfil actual
    let tipoPerfil;
    if (perfil) {
      tipoPerfil = JSON.parse(perfil);
    }

    if(tipoPerfil.super_usuario) {
      this.isSuperUser.set(true);
    }
  }

  constructor() {
    // Utilizo un effect para actualizar el formulario cuando los inputs cambien
    effect(() => {
      this.formInfo.patchValue({
        nombre: this.nombreCuenta() ?? '',
        apellidoP: this.apellidoPCuenta() ?? '',
        apellidoM: this.apellidoMCuenta() ?? '',
      }, { emitEvent: false }); // emitEvent: false previene bucles si algo reacciona a los cambios
    });
  }

  get name() {
    return this.formInfo.get('nombre');
  }

  get lastNameP() {
    return this.formInfo.get('apellidoP');
  }

  get lastNameM() {
    return this.formInfo.get('apellidoM');
  }

  onSumbit() {
    let bodyUpdateUser: BodyUpdateUser = {
      nombre: this.name?.value || '',
      apellidoP: this.lastNameP?.value || '',
      apellidoM: this.lastNameM?.value || '',
    }

    this.usuarioService.updateInfo(bodyUpdateUser).subscribe({
      next: (res) => {
        this.mensajeRequest = res.mensaje; // Falta implementar el mensaje de confirmación en la Ui
        this.closeModal();
        // Emite el evento que se actualizaron los datos para actualizar los datos nuevos en la UI con output y input signals
        this.datosActualizados.emit(res.datos);
      },
      error: (err) => {
        this.mensajeRequest = err.mensaje; // Falta implementar el mensaje de confirmación en la Ui
      }
    });
  }

  openModal() {
    this.modalOpen.set(true);
    setTimeout(() => this.animateModal.set(true), 10);
  }

  closeModal() {
    this.animateModal.set(false);
    // Espera a que la animación termine antes de ocultarlo en el DOM
    setTimeout(() => this.modalOpen.set(false), 100);
  }

  // Método para cerrar sesión y eliminar el token JWT
  logOut() {
    localStorage.removeItem('perfilActual');
    localStorage.removeItem('token');
    this.router.navigate(['']); // Redirigir al login,
  }
}
