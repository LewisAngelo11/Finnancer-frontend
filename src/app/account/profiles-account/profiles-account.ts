import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { BodyCreateProfile, UsuarioService } from '../../services/usuario-service';
import { Perfil } from '../../services/usuario-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profiles-account',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './profiles-account.html',
  styleUrl: './profiles-account.css'
})
export class ProfilesAccount implements OnInit {
  modalOpen = signal(false);
  modalUpdateOpen = signal(false);
  animateModal = signal(false);
  pinEnabled = signal(false);
  statusEnabled = signal(false);
  
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);

  perfiles: Perfil[] = [];
  numeroPerfiles = 0;
  tipoPerfil = '';

  // Iconos predeterminados que el usuario puede seleccionar para el icono de un perfil
  icons: Record<number ,string> = {
    1: 'bx  bx-star',
    2: 'bx  bx-user',
    3: 'bx bx-dollar',
    4: 'bx bx-cart o bx bx-store',
    5: 'bx bx-package o bx bx-archive',
    6: 'bx bx-shield o bx bx-lock',
    7: 'bx bx-wrench o bx bx-cog',
    8: 'bx bx-file o bx bx-folder',
    9: 'bx bx-phone o bx bx-headphone',
    10: 'bx bx-chat o bx bx-conversation'
  }
  
  // Form que crea un nuevo perfil
  formPerfiles = this.fb.group({
    nombrePerfil: ['', Validators.required],
    iconos: ['2'],
    habilitarPIN: [false],
    pin: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^\d{6}$/)]],
  });
  
  get nombrePerfil() {
    return this.formPerfiles.get('nombrePerfil');
  }

  get getIconoPerfil() {
    return this.formPerfiles.get('iconos');
  }

  get pinProfile() {
    return this.formPerfiles.get('pin');
  }

  // Form que modifica un perfil
  formPerfilesUpdate = this.fb.group({
    nombrePerfil: ['', Validators.required],
    iconos: ['2'],
    habilitarPIN: [false],
    pin: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^\d{6}$/)]],
    estatus: ['']
  });

  get nombrePerfilUpdate() {
    return this.formPerfilesUpdate.get('nombrePerfil');
  }

  get getIconoPerfilUpdate() {
    return this.formPerfilesUpdate.get('iconos');
  }

  get pinProfileUpdate() {
    return this.formPerfilesUpdate.get('pin');
  }

  get estatusProfileUpdate() {
    return this.formPerfilesUpdate.get('estatus');
  }

  ngOnInit(): void {
    const pinCheck = this.formPerfiles.get('habilitarPIN'); // Obtiene el checnbox del DOM
    const pinControl = this.formPerfiles.get('pin'); // Obtiene el input del PIN
    
    const pinCheckUpdate = this.formPerfilesUpdate.get('habilitarPIN');
    const pinControlUpdate = this.formPerfilesUpdate.get('pin');

    // Subsciribirse a el valueChanges del control del checkbox
    pinCheck?.valueChanges.subscribe((checked) => {
      if (checked) {
        pinControl?.enable(); // Activa el input pin
        this.pinEnabled.set(true);
      } else {
        pinControl?.disable(); // Desactiva el input pin
        pinControl?.reset(); // Resetea el valor del input pin
        this.pinEnabled.set(false);
      }
    });

    // Lo mismo que el bloque de código de arriba pero en el formulario de actualizar un perfil
    pinCheckUpdate?.valueChanges.subscribe((checked) => {
      if (checked) {
        pinControlUpdate?.enable();
        this.pinEnabled.set(true);
      } else {
        pinControlUpdate?.disable();
        pinControlUpdate?.reset();
        this.pinEnabled.set(false);
      }
    });

    // Obtener todos los perfiles del usuario
    this.usuarioService.getAllProfiles().subscribe({
      next: (res) => {
        this.perfiles = res;
        this.numeroPerfiles = this.perfiles.length; // Para contar cuantos perfiles tiene el usuario
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  openModal() {
    this.modalOpen.set(true);
    setTimeout(() => this.animateModal.set(true), 10);
  }

  // Función que abre el modal de actualizar los datos del perfil
  openModalUpdate(perfil: Perfil) {
    this.modalUpdateOpen.set(true);
    setTimeout(() => this.animateModal.set(true), 10);

    this.formPerfilesUpdate.patchValue({
      nombrePerfil: perfil.nombre,
      iconos: perfil.icono,
      pin: perfil.pin,
      estatus: perfil.estatus,
      habilitarPIN: !!perfil.pin
    });
    // Habilitar el input de estatus si el perfil no es el Administrador
    this.statusEnabled.set(true);
    this.estatusProfileUpdate?.enable();

    // Si el perfil es super usuario (Administrador) deshabilita el input de estatus
    if(perfil.super_usuario) {
      this.statusEnabled.set(false);
      this.estatusProfileUpdate?.disable();
    }

    if (perfil.pin) {
      this.pinEnabled.set(true);
    }
  }

  closeModal() {
    this.animateModal.set(false);
    // Espera a que la animación termine antes de ocultarlo en el DOM
    setTimeout(() => this.modalOpen.set(false), 100);
  }

  closeModalUpdate() {
    this.animateModal.set(false);
    // Espera a que la animación termine antes de ocultarlo en el DOM
    setTimeout(() => this.modalUpdateOpen.set(false), 100);
  }

  onSumbit() {
    const body: BodyCreateProfile = {
      nombre: this.nombrePerfil?.value || '',
      icono: Number(this.getIconoPerfil?.value) || 2,
      pin: this.pinProfile?.value || '',
    };

    this.usuarioService.createProfile(body).subscribe({
      next: (res) => {
        const newPerfil = res;
        this.perfiles.push(newPerfil);
        this.numeroPerfiles = this.perfiles.length;
        console.log(res);
        this.closeModal();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  modifyProfile() {
    
  }

  // Función que evita que el usuario escriba letras en el input de PIN
  soloNumeros(event: any) {
    const input = event.target as HTMLInputElement;
    // Reemplaza todo lo que no sea un dígito con vacío
    input.value = input.value.replace(/\D/g, '');
  }

  goToSelectProfile() {
    // Remueve el perfil actual del localstorage
    localStorage.removeItem('perfilActual');
    this.router.navigate(['/profilesSelector']);
  }
}
