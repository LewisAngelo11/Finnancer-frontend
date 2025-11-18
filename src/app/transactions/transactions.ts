import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule, FormBuilder, Validators } from '@angular/forms';

type Filtros = 'todas' | 'ingresos' | 'egresos' | 'pagadas' | 'pendientes' | 'canceladas';

interface Transacciones {
  id: number,
  categoria: string,
  subcategoria: string,
  perfilResponsable: string,
  monto: number,
  fechaTransaccion: Date,
  estatus: string,
}

interface Categorias {
  id: number,
  nombre: string,
  tipo: string,
  flujo: string,
  estatus: string,
}

interface Subcategorias {
  id: number,
  nombre: string,
  tipo: string,
  flujo: string,
  estatus: string,
}

interface Personas {
  id: number,
  nombre: string,
  tipo: string,
  estatus: string,
}

@Component({
  selector: 'app-transactions',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css'
})
export class Transactions {
  private router = inject(Router);
  private fb = inject(FormBuilder);

  modalOpen = signal(false);
  animateModal = signal(false);

  formNewTransaction = this.fb.group({
    categoria: ['', Validators.required],
    subcategoria: ['', Validators.required],
    nota: [''],
    montoTotal: ['', Validators.required],
    plazos: [1],
    fechaTransaccion: [''],
    persona: ['', Validators.required],
  })

  categorias: Categorias[] = [];
  subcategorias: Subcategorias[] = [];
  transacciones: Transacciones[] = [];
  personas: Personas[] = [];

  selectFilter = signal<Filtros>('todas');

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  // Funión que cambia el filtro seleccionado
  selectorFilter(filter: Filtros) {
    this.selectFilter.set(filter);
  }

  openModal() {
    this.modalOpen.set(true);
    setTimeout(() => this.animateModal.set(true), 100);
  }

  closeModal() {
    this.animateModal.set(false);
    // Espera a que la animación termine antes de ocultarlo en el DOM
    setTimeout(() => this.modalOpen.set(false), 200);
  }

  // Método que crea una nueva transacción
  addNewTransaction() {
    
  }
}
