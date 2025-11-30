import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CategoriaService } from '../../services/categoria-service';
import { TransactionService} from '../../services/transaction-service';
import { CategoriaMostrar } from '../categorias-dashboard/categorias-dashboard';
import { map } from 'rxjs';


@Component({
  selector: 'app-pie-chart',
  imports: [BaseChartDirective],
  templateUrl: './pie-chart.html',
  styleUrl: './pie-chart.css'
})
export class PieChart implements OnInit{
  private platformId = inject(PLATFORM_ID);
  private categoriaService = inject(CategoriaService);
  private transactionService = inject(TransactionService);
  isBrowser = isPlatformBrowser(this.platformId);

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  coloresPieChart: string[] = [];
  labels: string[] = [];
  data: number[] = [];
  categorias: CategoriaMostrar[] = [];
  
  private coloresBase = [
    '#000000',
    '#46E24D',
    '#00C40A',
    '#00C40A',
    '#1E90FF',
    '#FFD700',
    '#FF6347',
    '#20B2AA',
    '#9370DB',
    '#FF69B4',
  ];

  // Inicializar el pie chart con datos vacíos
  pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        borderRadius: 5
      },
    ],
  };
  
  pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'left' }
    },
  };

  pieChartOptions2: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' }
    },
  };

  ngOnInit(): void {
    this.cargarDatosPieChart();
  }

  // Método que carga todos los datos necesarios para pieChart
  cargarDatosPieChart(): void {
    this.categoriaService.getAllCategories()
      .pipe(
        map(categorias => categorias.filter(cat => cat.mostrar_panel === true))
      )
      .subscribe({
        next: categoriasFiltradas => {
          this.categorias = categoriasFiltradas;
  
          // Contador para saber cuándo terminaron todas las peticiones
          let peticionesCompletadas = 0;
          const totalPeticiones = this.categorias.length;

          // Obtener el total del mes de cada categoría
          this.categorias.forEach(cat => {
            this.transactionService.getTotalAndSumCategory(cat.id_categoria).subscribe({
              next: (data) => {
                cat.monto_total = Number(data.total);
                peticionesCompletadas++;

                // Cuando todas las peticiones terminen, actualizar el chart
                if (peticionesCompletadas === totalPeticiones) {
                  this.actualizarPieChart();
                }
              },
              error: (err) => {
                console.error('Error al obtener total de categoría:', err);
                peticionesCompletadas++;
                
                // Actualiza la gráfica aunque haya error
                if (peticionesCompletadas === totalPeticiones) {
                  this.actualizarPieChart();
                }
              },
            });
          });
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  // Función que actualiza el pieChart
  actualizarPieChart() {
    // Limpiar arrays
    this.labels = [];
    this.data = [];
    this.coloresPieChart = [];

    // Llenar arrays con los datos de las categorías
    this.categorias.forEach((cat, index) => {
      this.labels.push(cat.nombre);
      this.data.push(cat.monto_total || 0);
    });

    // Asignar colores usando la función generarColores
    this.coloresPieChart = this.generarColores(this.categorias.length);

    this.pieChartData.labels = this.labels; // Actualiza labels
    this.pieChartData.datasets[0].data = this.data; // Actualiza datos
    this.pieChartData.datasets[0].backgroundColor = this.coloresPieChart; // Actualiza los colores dinámicos

    // Forzar la actualización del chart
    if (this.chart) {
      this.chart.update();
    }
  }

  // Función que genera dinámicamente los colores del piechart
  private generarColores(cantidad: number): string[] {
    const colores: string[] = [];

    for (let i = 0; i < cantidad; i++) {
      const color = this.coloresBase[i % this.coloresBase.length];
      colores.push(color);
    }

    return colores;
  }
}