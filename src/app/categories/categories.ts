import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-categories',
  imports: [FormsModule],
  templateUrl: './categories.html',
  styleUrl: './categories.css'
})
export class Categories {
  private router = inject(Router);
  tipoOperacion: string = '';
  modalOpen = signal(false);
  animateModal = signal(false);

  // Datos de prueba
  categorias = [
    {id: 1, icono: 1 ,nombre: 'Ingresos de Ventas', tipo: 'Ingreso', subcategoria: false, mostrar: true},
    {id: 2, icono: 2 ,nombre: 'Servicios Básicos', tipo: 'Egreso', subcategoria: false, mostrar: true},
    {id: 3, icono: 3 ,nombre: 'Otros Ingresos', tipo: 'Ingreso', subcategoria: false, mostrar: true},
    {id: 4, icono: 4 ,nombre: 'Otros Egresos', tipo: 'Egreso', subcategoria: false, mostrar: true},
  ];

  goBackToDash() {
    this.router.navigate(['/dashboard']);
  }

  openModal() {
    this.modalOpen.set(true);
    setTimeout(() => this.animateModal.set(true), 10); // Hace una pausa para que se monte el modal
  }

  closeModal() {
    this.animateModal.set(false);
    // Espera a que termine la animación antes de ocultarlo
    setTimeout(() => this.modalOpen.set(false), 100);
  }
}
