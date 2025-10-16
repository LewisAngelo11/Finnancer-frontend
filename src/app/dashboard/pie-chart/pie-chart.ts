import { Component, inject } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-pie-chart',
  imports: [BaseChartDirective],
  templateUrl: './pie-chart.html',
  styleUrl: './pie-chart.css'
})
export class PieChart {
  // Al usar isPlatformBrowser, se evita que se pinte el <canvas> en el servidor,
  // previniendo el error "NotYetImplemented" que anteriormente tuve con el <canvas>
  private platformId = inject(PLATFORM_ID);
  isBrowser = isPlatformBrowser(this.platformId);

  // Datos del pie chart
  pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Ingresos de Ventas', 'Servicios Básicos', 'Otros Ingresos', 'Otros Egresos'],
    datasets: [
      {
        data: [5499, 2599, 3769, 1229],
        backgroundColor: ['#000000', '#46E24D', '#00C40A', '#00C40A'],
        borderRadius: 5
      },
    ],
  };
  
  // Mostrarlos en pantallas chicas y grandes
  pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false, // Esto rompe la proporción cuadrada
    plugins: {
      legend: { position: 'left' }
    },
  };

  // Mostrarlos unicamente en pantallas medianas
  pieChartOptions2: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false, // Esto rompe la proporción cuadrada
    plugins: {
      legend: { position: 'top' }
    },
  };
}
