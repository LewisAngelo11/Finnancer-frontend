import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';

interface Perfil {
  id: number,
  nombre: string,
  icono: number
}

@Component({
  selector: 'app-profiles-account',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './profiles-account.html',
  styleUrl: './profiles-account.css'
})
export class ProfilesAccount implements OnInit {
  modalOpen = signal(false);
  animateModal = signal(false);
  pinEnabled = signal(false);
  
  private fb = inject(FormBuilder);
  
  formPerfiles = this.fb.group({
    nombre: ['', Validators.required],
    icono: [''],
    habilitarPIN: [false],
    pin: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^\d{6}$/)]],
  });

  ngOnInit(): void {
    const pinCheck = this.formPerfiles.get('habilitarPIN'); // Obtiene el checnbox del DOM
    const pinControl = this.formPerfiles.get('pin'); // Obtiene el input del PIN

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
  }

  // Datos de prueba
  perfilesCreados: Perfil[] = [
    {id: 1, nombre: 'Administrador', icono: 1},
    {id: 2, nombre: 'Secretaria', icono: 2},
    {id: 3, nombre: 'Recepcionista', icono: 2}
  ];

  numeroPerfiles = this.perfilesCreados.length; // Para contar cuantos perfiles tiene el usuario

  openModal() {
    this.modalOpen.set(true);
    setTimeout(() => this.animateModal.set(true), 10);
  }

  closeModal() {
    this.animateModal.set(false);
    // Espera a que la animación termine antes de ocultarlo en el DOM
    setTimeout(() => this.modalOpen.set(false), 100);
  }

  onSumbit() {
  }

  // Función que evita que el usuario escriba letras en el input de PIN
  soloNumeros(event: any) {
    const input = event.target as HTMLInputElement;
    // Reemplaza todo lo que no sea un dígito con vacío
    input.value = input.value.replace(/\D/g, '');
  }
}
