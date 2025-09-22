import { Component, signal } from '@angular/core';
import { HeaderDashboard } from '../header-dashboard/header-dashboard';

@Component({
  selector: 'app-dashboard',
  imports: [HeaderDashboard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  presupuesto: number = 200500;
  ingresosMensuales: number = 10000;
  ingresosMinimos: number = 4000;
  egresosMensuales: number = 4000;
  egresosMinimos: number = 3000;

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

}
