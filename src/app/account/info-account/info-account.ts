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
  apellidoCuenta = input<string>();
  correo = input<string>();
  fechaRegistro = input<string>();
}
