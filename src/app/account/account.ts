import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../services/usuario-service';
import { InfoAccount } from './info-account/info-account';
import { ProfilesAccount } from './profiles-account/profiles-account';
import { HistoryTransactions } from './history-transactions/history-transactions';
import { FinanceAccount } from './finance-account/finance-account';
import { SecurityAccount } from './security-account/security-account';

@Component({
  selector: 'app-account',
  imports: [InfoAccount, ProfilesAccount, HistoryTransactions, FinanceAccount, SecurityAccount],
  templateUrl: './account.html',
  styleUrl: './account.css'
})
export class Account implements OnInit {
  userData: any;
  month: string = '';
  year: string = '';

  nameAccount: string = '';
  lastNameAccount: string = '';
  mailAccount: string = '';
  registerDate: string = '';
  
  budget: number = 0;
  minimumIncomes: number = 0;
  maximumSpendings: number = 0;
  monthlySavings: number = 0;
  cuttingDay: number = 0;

  buttonSelected = signal(1);
  private router = inject(Router);
  private usuarioService = inject(UsuarioService);

  perfiles = [
    {id: 1, name: 'Administrador'},
    {id: 2, name: 'Recepcionista'},
    {id: 3, name: 'Secretaria'}
  ];

  currentProfile = 'Administrador';

  activeProfiles = this.perfiles.length;

  goBackToDash() {
    this.router.navigate(['/dashboard']);
  }

  buttonSelect(id: number) {
    this.buttonSelected.set(id);
  }

  ngOnInit(): void {
    this.getInfoUser();
  }

  // Método que obtiene los datos del usuario
  getInfoUser() {
    this.usuarioService.getInfoUser().subscribe({
      next: (res) => {
        this.userData = res;
        console.log(this.userData);

        // Extraer los datos del back a variales para mostrarlas en la UI con input signals
        this.nameAccount = this.userData.nombre;
        this.lastNameAccount = `${this.userData.apellido_paterno} ${this.userData.apellido_materno}`;
        this.mailAccount = this.userData.correo;

        // Convertir la fecha que viene del back a una fecha mas legible para el usuario
        let dateRegister = this.userData.fecha_creacion;
        const converter = this.dateConverter(new Date(dateRegister));
        this.registerDate = `${converter.month} ${converter.year}`;

        // Obtiene los valores financieros del usuario
        this.budget = this.userData.presupuesto;
        this.minimumIncomes = this.userData.ingreso_minimo;
        this.maximumSpendings = this.userData.egreso_maximo;
        this.monthlySavings = this.userData.ahorro_mensual;
        this.cuttingDay = this.userData.dia_corte;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  // Convertidor de fecha mas legible para el usuario
  dateConverter(fecha: any) {
    const mesNombre = fecha.toLocaleString('es-ES', { month: 'long' });
    const anio = fecha.getFullYear();
    return {
      month: mesNombre,
      year: anio,
    };
  }
}
