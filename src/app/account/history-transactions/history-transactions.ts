import { Component, input, inject, OnInit } from '@angular/core';
import { TransactionService, Transaccion } from '../../services/transaction-service';
import { CommonModule } from '@angular/common';

interface TransactiosHistory {
  id_transaccion: number;
  categoria: string;
  icono: number;
  fecha_transaccion: string | Date;
}

@Component({
  selector: 'app-history-transactions',
  imports: [CommonModule],
  templateUrl: './history-transactions.html',
  styleUrl: './history-transactions.css'
})
export class HistoryTransactions implements OnInit{
  perfilActual = input<string>();
  private transactionService = inject(TransactionService);

  transactionsHistory: Transaccion[] = [];

  icons: Record<number, string> = {
    1: 'bx bx-money',
    2: 'bx bx-bulb',
    3: 'bx bx-trending-up',
    4: 'bx bx-trending-down',
    5: 'bx bx-water',
    6: 'bx bx-money',
    7: 'bx bx-receipt',
    8: 'bx bx-dollar',
    9: 'bx bx-building',
    10: 'bx bx-coin',
    11: 'bx bx-line-chart',
    12: 'bx bx-bookmark',
    13: 'bx-bar-chart-alt-2',
    14: 'bx bx-credit-card',
  };

  ngOnInit(): void {
    this.getTransactionsFromProfile();
  }

  getTransactionsFromProfile() {
    this.transactionService.getAllTransactionsFromProfile().subscribe({
      next: (data: Transaccion[]) => {
        this.transactionsHistory = data;

        console.log(this.transactionsHistory);
      }
    })
  }
}
