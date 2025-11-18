import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

type Filtros = 'todos' | 'clientes' | 'proveedores';

interface Personas {
  id: number,
  nombre: string,
  tipo: string,
  deuda: number,
  ultimaTransaccion: Date,
  estatus: string,
}

@Component({
  selector: 'app-persons',
  imports: [],
  templateUrl: './persons.html',
  styleUrl: './persons.css'
})
export class Persons {
  private router = inject(Router);
  selectFilter = signal<Filtros>('todos');

  personas: Personas[] = [];

  goBackToDash() {
    this.router.navigate(['/dashboard']);
  }

  // Funión que cambia el filtro seleccionado
  selectorFilter(filter: Filtros) {
    this.selectFilter.set(filter);
  }
}
