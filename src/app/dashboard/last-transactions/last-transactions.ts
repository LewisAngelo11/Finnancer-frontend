import { Component } from '@angular/core';

@Component({
  selector: 'app-last-transactions',
  imports: [],
  templateUrl: './last-transactions.html',
  styleUrl: './last-transactions.css'
})
export class LastTransactions {
  // Datos de prueba
  ultimasTransacciones = [
    {id: 1, icono: 3, nombre: 'Otros Ingresos', monto: 1500},
    {id: 2, icono: 1, nombre: 'Ingresos de Ventas', monto: 2230},
    {id: 3, icono: 1, nombre: 'Ingresos de Ventas', monto: 3499},
    {id: 4, icono: 2, nombre: 'Servicios Básicos', monto: 1199},
    {id: 5, icono: 1, nombre: 'Ingresos de Ventas', monto: 3299}
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
