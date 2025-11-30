import { Component, inject, OnInit } from '@angular/core';
import { UltimasTransacciones } from '../../transactions/transactions';
import { TransactionService } from '../../services/transaction-service';

@Component({
  selector: 'app-last-transactions',
  imports: [],
  templateUrl: './last-transactions.html',
  styleUrl: './last-transactions.css'
})
export class LastTransactions implements OnInit {

  ultimasTransacciones: UltimasTransacciones[] = [];

  private transactionService = inject(TransactionService);

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

  ngOnInit(): void {
    // Obtener las últimas 10 transacciones hechas por el usuario
    this.transactionService.getLastTransactiona().subscribe({
      next: (data) => {
        this.ultimasTransacciones = data;
      }
    });
  }
}
