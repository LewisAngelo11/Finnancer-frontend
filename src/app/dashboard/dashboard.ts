import { Component, inject, signal } from '@angular/core';
import { HeaderDashboard } from '../header-dashboard/header-dashboard';
import { ChartConfiguration, ChartData, ChartEvent } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-dashboard',
  imports: [HeaderDashboard, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

// Al usar isPlatformBrowser, se evita que se pinte el <canvas> en el servidor,
// previniendo el error "NotYetImplemented" que anteriormente tuve con el <canvas>
  private platformId = inject(PLATFORM_ID);
  isBrowser = isPlatformBrowser(this.platformId);

  categorias = [
    {id: 1, nombre: 'Ingresos de Ventas', total: 5499},
    {id: 2, nombre: 'Servicios Básicos', total: 2599},
    {id: 3, nombre: 'Otros Ingresos', total: 3769},
    {id: 4, nombre: 'Otros Egresos', total: 1229},
  ]

  presupuesto: number = 200500;
  ingresosMensuales: number = 10000;
  ingresosMinimos: number = 4000;
  egresosMensuales: number = 4000;
  egresosMinimos: number = 3000;
  gastosTotales: number = 44000;

  isPositive = signal(true);
  signo: string = '';

  calcularIngresos(ingresosMen:number, ingresosMin:number) {
    return ingresosMen - ingresosMin;
  }

  calcularEgresos(egresosMen: number, egresosMin: number) {
    return egresosMen - egresosMin;
  }

  verificarPositivo() {
    let result = this.calcularIngresos(this.ingresosMensuales, this.ingresosMinimos)

    if (result > 0) {
      this.isPositive.set(true);
      this.signo = '+';
    }
  }

  // Datos del pie chart
  pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Ingresos de Ventas', 'Servicios Básicos', 'Otros Ingresos', 'Otros Egresos'],
    datasets: [
      {
        data: [5499, 2599, 3769, 1229],
        backgroundColor: ['#000000', '#46E24D', '#00C40A', '#00C40A'],
        borderRadius: 10
      },
    ],
  };

  pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' }
    },
  };

  // Grafico de barras a lo largo del tiempo
  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    scales: {
      x: {
        grid: { display: false }, // elimina líneas verticales
        ticks: {
          color: '#2929292'
        },
      },
      y: {
        min: 0,
        grid: { display: false }, // elimina líneas horizontales
        ticks: {
          color: '#2929292'
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: { enabled: true }, // mantener tooltips
    },
  };
  barChartType = 'bar' as const;

  barChartData: ChartData<'bar'> = {
    labels: ['ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP'],
    datasets: [
      { data: [3500, 4000, 4500, 8000, 12000, 20000],
        backgroundColor: ['#46e24eb4', '#46E24D', '#00AA09', '#028008', '#004403','#002B02'],
        borderRadius: { topLeft: 10, topRight: 10, bottomLeft: 10, bottomRight: 10 }
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

