import { Component, inject, OnInit, signal, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { BodyCreatePerson, PersonaService } from '../services/persona-service';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';

type Filtros = 'todos' | 'clientes' | 'proveedores';

interface Personas {
  id_persona: number,
  nombre: string,
  tipo: string,
  deuda: number,
  ultimaTransaccion: Date,
  estatus: string,
}

@Component({
  selector: 'app-persons',
  imports: [ReactiveFormsModule],
  templateUrl: './persons.html',
  styleUrl: './persons.css'
})
export class Persons implements OnInit {
  private router = inject(Router);
  private personaService = inject(PersonaService);
  private fb = inject(FormBuilder);
  private platformId = inject(PLATFORM_ID);

  selectFilter = signal<Filtros>('todos');
  modalOpen = signal(false);
  modalEditOpen = signal(false);
  animateModal = signal(false);
  personaActiva = signal(false);
  selectedFilterPersons = signal<Filtros>('todos');

  personas: Personas[] = [];
  totalClientes = 0;
  totalProveedores = 0;
  personasFiltradas: Personas[] = [];

  formNewPersona = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    tipo: ['', Validators.required]
  });

  formEditPersona = this.fb.group({
    idPersona: [{value: '', disabled: true}],
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    tipo: [{value: '', disabled: true}],
  });

  ngOnInit(): void {
    let authToken;

    // Solo acceder a localStorage si ya está en el navegador
    if (isPlatformBrowser(this.platformId)) {
      authToken = localStorage.getItem('token');
    }

    if (!authToken) return;

    this.personaService.getAllPersons().subscribe({
      next: (res) => {
        console.log(res);
        this.personas = res;
        this.filtrarPersonas('todos');
        this.countClients();
        this.countProviders();

        // Obtengo la deuda de cada cliente o proveedor
        this.personas.map(p => {
          // Llamo al método de obtener la deuda
          this.personaService.getAllDebt({idPersona: p.id_persona}).subscribe({
            next: (res) => {
              p.deuda = res;
            },
          });
        });
      },
      error: (err) => {
        console.log(err)
      },
    });
  }

  goBackToDash() {
    this.router.navigate(['/dashboard']);
  }

  // Funión que cambia el filtro seleccionado
  selectorFilter(filter: Filtros) {
    this.selectFilter.set(filter);
  }

  filtrarPersonas(tipo: string) {
    switch (tipo) {
      case 'clientes':
        this.personasFiltradas = this.personas.filter(p => p.tipo === 'cliente');
        break;

      case 'proveedores':
        this.personasFiltradas = this.personas.filter(p => p.tipo === 'proveedor');
        break;

      default:
        this.personasFiltradas = [...this.personas];
        break;
    }
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

  // Función que abre el modal para editar una persona
  openEditModal(persona: any) {
    this.modalEditOpen.set(true);

    // Llenar los valores al formulario
    this.formEditPersona.patchValue({
      idPersona: persona.id_persona,
      nombre: persona.nombre,
      tipo: persona.tipo,
    });

    // Verificar el estatus de la persona
    if (persona.estatus === 'activo') {
      this.personaActiva.set(true);
    } else {
      this.personaActiva.set(false);
    }

    setTimeout(() => this.animateModal.set(true), 10);
  }

  // Función que cierra el modal para editar una persona
  closeEditModal() {
    this.animateModal.set(false);

    // Resetear los valores del formulario 
    this.formEditPersona.reset({
      idPersona: '',
      nombre: '',
      tipo: '',
    });
    // Espera a que la animación termine antes de ocultarlo en el DOM
    setTimeout(() => this.modalEditOpen.set(false), 100);
  }

  // Función que crea una nueva persona
  createPersona() {
    if (this.formNewPersona.invalid) {
      this.formNewPersona.markAllAsTouched();
      return;
    }

    const body: BodyCreatePerson = {
      nombre: this.formNewPersona.value.nombre ?? '',
      tipoPersona: this.formNewPersona.value.tipo ?? ''
    };

    this.personaService.createPerson(body).subscribe({
      next: (res) => {
        const newPersona = res.persona;
        this.closeModal();
        this.personas.push(newPersona);
        this.personasFiltradas.push(newPersona);
        this.countClients();
        this.countProviders();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // Función que actualiza una persona
  updatePersona() {
    const persona = this.formEditPersona.getRawValue();
    const idPersona = persona.idPersona;

    const body = {
      idPersona: idPersona,
      nombre: this.formEditPersona.get('nombre')?.value,
      tipoPersona: this.formEditPersona.get('tipo')?.value,
    }

    // Implementar mensajes de respuestas
    this.personaService.updatePerson(body).subscribe({
      next: () => {
        this.closeEditModal();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // Método que cambia el estatus de una persona
  changeEstatus(estatusCambiado: string) {
    const persona = this.formEditPersona.getRawValue();
    const idPersona = persona.idPersona;

    const body = {
      idPersona: idPersona,
      tipoPersona: this.formEditPersona.get('tipo')?.value,
      estatus: estatusCambiado,
    }

    // TODO: Implementar mensajes de respuestas
    this.personaService.changeStatus(body).subscribe({
      next: (res) => {
        console.log(res);
        this.closeEditModal();
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  // Función que cuenta el total de clientes
  countClients() {
    // Filtrar todos los clientes
    return this.totalClientes = this.personas.filter(p => p.tipo === 'cliente').length;
  }

  // Función que cuenta el total de Proveedores
  countProviders() {
    // Filtrar todos os proveedores
    return this.totalProveedores = this.personas.filter(p => p.tipo === 'proveedor').length;
  }
}
