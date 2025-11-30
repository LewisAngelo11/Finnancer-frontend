import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TransactionService } from '../../services/transaction-service';

@Component({
  selector: 'app-bar-chart',
  imports: [BaseChartDirective],
  templateUrl: './bar-chart.html',
  styleUrl: './bar-chart.css'
})
export class BarChart implements OnInit {
  // Al usar isPlatformBrowser, se evita que se pinte el <canvas> en el servidor,
  // previniendo el error "NotYetImplemented" que anteriormente tuve con el <canvas>
  private platformId = inject(PLATFORM_ID);
  private transactionService = inject(TransactionService);
  isBrowser = isPlatformBrowser(this.platformId);

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  gastosTotales: number = 0;

  // Grafico de barras a lo largo del tiempo
  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false, // Esto permite que ocupe todo el ancho
    scales: {
      x: {
        grid: {
          drawTicks: false,
          display: false, // Elimina líneas verticales
        },
        ticks: {
          color: '#2929292',
          font: {
            size: 14 // Tamaño de fuente de los ticks del eje X
          },
        },
        border: {
          display: false // Elimina la línea principal del eje X
        }
      },
      y: {
        min: 0,
        grid: { display: false }, // elimina líneas horizontales
        ticks: {
          color: '#2929292',
          font: {
            size: 14, // Tamaño de fuente de los ticks del eje Y
          }
        },
        border: {
          display: false // Elimina la línea principal del eje Y
        }
      },
    },
    plugins: {
      legend: {
        display: false,
      }
    },
  };
  barChartType = 'bar' as const;
  
  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [],
        backgroundColor: [],
        borderRadius: 50,
        maxBarThickness: 75, // La barra puede reducirse si el contenedor es más pequeño
        borderSkipped: false // Evita que se “recorte” la esquina inferior
      }
    ],
  };
  
  chartHovered({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
    console.log(event, active);
  }


  ngOnInit(): void {
    this.transactionService.getExpensesTransaction().subscribe({
      next: (data) => {
        console.log(data);
        this.generarGraficaEgresos(data);
      },
    });
  }

  generarGraficaEgresos(transacciones: any[]) {
    const meses = Array(12).fill(0);
    let coloresBarChart = [];

    transacciones.forEach(t => {
      const fecha = new Date(t.fecha_transaccion);
      const mes = fecha.getMonth();
      meses[mes] += Number(t.monto_total);
    });

    meses.forEach(m => {
      this.gastosTotales += m;
    })

    coloresBarChart = this.generarColores(12);

    // Asignar los datos al barChart
    this.barChartData.labels = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
    this.barChartData.datasets[0].data = meses;
    this.barChartData.datasets[0].backgroundColor = coloresBarChart;

    // Forzar la actualización del chart
    if (this.chart) {
      this.chart.update();
    }
  }

  // Función que genera dinámicamente los colores del piechart
  private generarColores(cantidad: number): string[] {
    const colores: string[] = [];

    for (let i = 0; i < cantidad; i++) {
      const color = this.colorBases[i % this.colorBases.length];
      colores.push(color);
    }

    return colores;
  }

  colorBases = [
    '#46e24eb4', '#46E24D', '#00AA09', '#028008', '#004403', '#002B02'
  ];
}
