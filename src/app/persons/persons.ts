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
  animateModal = signal(false);
  selectedFilterPersons = signal<Filtros>('todos');

  personas: Personas[] = [];
  totalClientes = 0;
  totalProveedores = 0;
  personasFiltradas: Personas[] = [];

  formNewPersona = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    tipo: ['', Validators.required]
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

  openModal() {
    this.modalOpen.set(true);
    setTimeout(() => this.animateModal.set(true), 10);
  }

  selectorFilterCategories(filtro: Filtros) {
    this.selectedFilterPersons.set(filtro);
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

  closeModal() {
    this.animateModal.set(false);
    // Espera a que la animación termine antes de ocultarlo en el DOM
    setTimeout(() => this.modalOpen.set(false), 100);
  }

  createPersona() {
    if (this.formNewPersona.invalid) {
      this.formNewPersona.markAllAsTouched();
      return;
    }

    const body: BodyCreatePerson = {
      nombre: this.formNewPersona.value.nombre ?? '',
      tipoPersona: this.formNewPersona.value.tipo ?? ''
    };

    console.log(body);

    this.personaService.createPerson(body).subscribe({
      next: (res) => {
        const newPersona = res.persona;
        console.log(newPersona);
        this.closeModal();
        this.personasFiltradas.push(newPersona);
        this.countClients();
        this.countProviders();
      },
      error: (err) => {
        console.log(err);
      },
    });
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
