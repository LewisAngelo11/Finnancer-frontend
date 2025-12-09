import { Component, inject, OnInit, signal } from '@angular/core';
import { HeaderDashboard } from '../header-dashboard/header-dashboard';
import { ChartConfiguration, ChartData, ChartEvent } from 'chart.js';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

import { CategoriasDashboard } from './categorias-dashboard/categorias-dashboard';
import { PieChart } from './pie-chart/pie-chart';
import { BarChart } from './bar-chart/bar-chart';
import { LastTransactions } from './last-transactions/last-transactions';
import { MostSpendings } from './most-spendings/most-spendings';
import { UsuarioService } from '../services/usuario-service';
import { TransactionService } from '../services/transaction-service';

interface Gasto {
  id: number,
  nombre: string,
  monto: number
}

@Component({
  selector: 'app-dashboard',
  imports: [HeaderDashboard, CategoriasDashboard,
            PieChart, BarChart,
            LastTransactions, MostSpendings],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

// Al usar isPlatformBrowser, se evita que se pinte el <canvas> en el servidor,
// previniendo el error "NotYetImplemented" que anteriormente tuve con el <canvas>
  private platformId = inject(PLATFORM_ID);
  isBrowser = isPlatformBrowser(this.platformId);

  // Datos de prueba
  categorias = [
    {id: 1, icono: 1 ,nombre: 'Ingresos de Ventas', total: 5499},
    {id: 2, icono: 2 ,nombre: 'Servicios Básicos', total: 2599},
    {id: 3, icono: 3 ,nombre: 'Otros Ingresos', total: 3769},
    {id: 4, icono: 4 ,nombre: 'Otros Egresos', total: 1229},
  ];

  // Datos de prueba
  ultimasTransacciones = [
    {id: 1, icono: 3, nombre: 'Otros Ingresos', monto: 1500},
    {id: 2, icono: 1, nombre: 'Ingresos de Ventas', monto: 2230},
    {id: 3, icono: 1, nombre: 'Ingresos de Ventas', monto: 3499},
    {id: 4, icono: 2, nombre: 'Servicios Básicos', monto: 1199},
    {id: 5, icono: 1, nombre: 'Ingresos de Ventas', monto: 3299}
  ];

  // Datos de prueba
  mayoresGastos: Gasto[] = [
    {id: 1, nombre: 'Servicios Básicos', monto: 859},
    {id: 2, nombre: 'Otros Egresos', monto: 800},
    {id: 3, nombre: 'Servcios Básicos', monto: 835},
    {id: 4, nombre: 'Servicios Básicos', monto: 1500},
    {id: 5, nombre: 'Otros Egresos', monto: 999},
    {id: 6, nombre: 'Otros Egresos', monto: 599},
    {id: 7, nombre: 'Servicios Básicos', monto: 1199},
    {id: 8, nombre: 'Otros Egresos', monto: 633}
  ];

  private mayoresGastosSort: Gasto[] = [];

  // Datos de prueba
  presupuesto: number = 0;
  ingresosMensuales: number = 0;
  ingresosMinimos: number = 0;
  egresosMensuales: number = 0;
  egresosMaximos: number = 0;
  gastosTotales: number = 44000;

  isPositiveI = signal(false);
  isPositiveE = signal(false);
  private router = inject(Router);
  private usuarioSerivce = inject(UsuarioService);
  private transactionService = inject(TransactionService);

  ngOnInit(): void {
    // Obtener los datos financieros del usuario
    this.usuarioSerivce.getInfoUser().subscribe({
      next: (data) => {
        let usuario = data;
        this.presupuesto = usuario.presupuesto;
        this.ingresosMinimos = usuario.ingreso_minimo;
        this.egresosMaximos = usuario.egreso_maximo;
      },
      error: (err) => { console.log(err) }
    });

    // Obtener todos los ingresos del usuario del mes actual
    this.transactionService.getAllIncomesAmountCurrent().subscribe({
      next: (data) => {
        let montoTotal = data._sum.monto_total;
        this.ingresosMensuales = montoTotal;
        this.verificarPositivoIngresos(this.ingresosMensuales, this.ingresosMinimos);
      },
      error: (err) => { console.log(err) },
    });

    // Obtener todos los Egresos del usuario del mes actual
    this.transactionService.getAllExpensesAmountCurrent().subscribe({
      next: (data) => {
        let montoTotal = data._sum.monto_total;
        this.egresosMensuales = montoTotal;
        this.verificarPositivoEgresos(this.egresosMensuales, this.egresosMaximos);
      },
      error: (err) => { console.log(err) },
    });
  }

  goToAccount() {
    this.router.navigate(['account']);
  }

  calcularIngresos(ingresosMen:number, ingresosMin:number) {
    return ingresosMen - ingresosMin;
  }

  calcularEgresos(egresosMen: number, egresosMin: number) {
    return egresosMen - egresosMin;
  }

  verificarPositivoIngresos(ingresosMen: number, ingresosMin: number) {
    let result = this.calcularIngresos(ingresosMen, ingresosMin)

    if (result > 0) {
      this.isPositiveI.set(true);
    }
  }

  verificarPositivoEgresos(egresosMen: number, egresosMin: number) {
    let result = this.calcularEgresos(egresosMen, egresosMin)

    if (result > 0) {
      this.isPositiveE.set(true);
    }
  }

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

  // Función para ordenar los gastos por mayor monto (EN PROCESO...)
  mayoresGastosOrdenados() {
    for (let i = 0; i < this.mayoresGastos.length; i++){
      if (this.mayoresGastos[i].monto > this.mayoresGastos[i + 1].monto) {
        this.mayoresGastosSort.push(this.mayoresGastos[i]);
      } else {
        this.mayoresGastosSort.push(this.mayoresGastos[i + 1]);
      }
    }
    console.log(this.mayoresGastosSort);
  }
}

