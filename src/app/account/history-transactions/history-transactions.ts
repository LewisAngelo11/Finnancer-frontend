import { Component } from '@angular/core';

@Component({
  selector: 'app-history-transactions',
  imports: [],
  templateUrl: './history-transactions.html',
  styleUrl: './history-transactions.css'
})
export class HistoryTransactions {
  currentProfile = 'Administrador';

  transactionsHistory = [
    {id: 1, icono: 1, nombre: 'Ingresos de Ventas', monto: 2230, fecha: '15/09/2025'},
    {id: 2, icono: 2, nombre: 'Servicios Básicos', monto: 1200, fecha: '15/09/2025'},
    {id: 3, icono: 4, nombre: 'Otros Egresos', monto: 690, fecha: '13/09/2025'},
    {id: 4, icono: 1, nombre: 'Ingresos de Ventas', monto: 4200, fecha: '13/09/2025'},
    {id: 5, icono: 1, nombre: 'Ingresos de Ventas', monto: 5000, fecha: '12/09/2025'},
  ]
}
