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

  icons: Record<number, string> = {
    1: 'bx bx-money',
    2: 'bx bx-bulb',
    3: 'bx bx-trending-up',
    4: 'bx bx-trending-down',
    5: 'bx bx-water',
    6: 'bx bx-money',
    8: 'bx bx-receipt',
    9: 'bx bx-dollar',
    10: 'bx bx-building',
    11: 'bx bx-coin',
    12: 'bx bx-line-chart',
    13: 'bx bx-bookmark',
    14: 'bx-bar-chart-alt-2',
    15: 'bx bx-credit-card',
  };
}
