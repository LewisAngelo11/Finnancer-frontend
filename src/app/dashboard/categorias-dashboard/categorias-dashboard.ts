import { Component } from '@angular/core';

@Component({
  selector: 'app-categorias-dashboard',
  imports: [],
  templateUrl: './categorias-dashboard.html',
  styleUrl: './categorias-dashboard.css'
})
export class CategoriasDashboard {
    // Datos de prueba
  categorias = [
    {id: 1, icono: 1 ,nombre: 'Ingresos de Ventas', total: 5499},
    {id: 2, icono: 2 ,nombre: 'Servicios Básicos', total: 2599},
    {id: 3, icono: 3 ,nombre: 'Otros Ingresos', total: 3769},
    {id: 4, icono: 4 ,nombre: 'Otros Egresos', total: 1229},
  ];

}
