import { Component, inject } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-bar-chart',
  imports: [BaseChartDirective],
  templateUrl: './bar-chart.html',
  styleUrl: './bar-chart.css'
})
export class BarChart {
  // Al usar isPlatformBrowser, se evita que se pinte el <canvas> en el servidor,
  // previniendo el error "NotYetImplemented" que anteriormente tuve con el <canvas>
  private platformId = inject(PLATFORM_ID);
  isBrowser = isPlatformBrowser(this.platformId);

  gastosTotales: number = 44000;

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
    labels: ['ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP'],
    datasets: [
      { data: [5000, 6000, 8000, 10000, 15000, 20000],
        backgroundColor: ['#46e24eb4', '#46E24D', '#00AA09', '#028008', '#004403','#002B02'],
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
}
