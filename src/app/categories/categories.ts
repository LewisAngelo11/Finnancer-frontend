import { Component, inject } from '@angular/core';
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
}
