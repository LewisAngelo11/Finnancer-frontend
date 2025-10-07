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
}
