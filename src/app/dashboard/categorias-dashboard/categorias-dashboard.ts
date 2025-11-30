import { Component, inject, OnInit } from '@angular/core';
import { CategoriaService } from '../../services/categoria-service';
import { TransactionService} from '../../services/transaction-service';
import { map } from 'rxjs';

export interface CategoriaMostrar {
  id_categoria: number;
  icono: number;
  nombre: string;
  tipo: string;
  monto_total: number;
  mostrar_panel: boolean;
}

@Component({
  selector: 'app-categorias-dashboard',
  imports: [],
  templateUrl: './categorias-dashboard.html',
  styleUrl: './categorias-dashboard.css'
})
export class CategoriasDashboard implements OnInit {
  private categoriaService = inject(CategoriaService);
  private transactionService = inject(TransactionService);

  categorias: CategoriaMostrar[] = [];

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
    // Obtner solo las categorías para mostrar en el panel o dashboard
    this.categoriaService.getAllCategories()
      .pipe(
        map(categorias => categorias.filter(cat => cat.mostrar_panel === true))
      )
      .subscribe({
        next: categoriasFiltradas => {
          this.categorias = categoriasFiltradas;

          // Obtener todo el total del mes de cada categoría mostrada en el panel
          this.categorias.map(cat => {
            this.transactionService.getTotalAndSumCategory(cat.id_categoria).subscribe({
              next: (data) => {
                let total = data.total;
                cat.monto_total = Number(total);
              },
            });
          });
        },
    });
  }
}
