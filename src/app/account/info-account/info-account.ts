import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-info-account',
  imports: [FormsModule],
  templateUrl: './info-account.html',
  styleUrl: './info-account.css'
})
export class InfoAccount {
  nombreCuenta = input<string>();
  correo = input<string>();
  perfilesActivos = input<number>();
  fechaRegistro = input<string>();
  presupuesto = input<number>();
  ingresosMinimo = input<number>();
  egresosMaximos = input<number>();
}
