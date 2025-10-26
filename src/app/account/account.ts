import { Component, inject, OnInit, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
  lastNamePAccount: string = '';
  lastNameMAccount: string = '';
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
  private platformId = inject(PLATFORM_ID);

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
    // Valida si ya se renderizó en el navegador para pedir los datos al back
    if(isPlatformBrowser(this.platformId)){
      this.getInfoUser();
    }
  }

  // Método que obtiene los datos del usuario
  getInfoUser() {
    this.usuarioService.getInfoUser().subscribe({
      next: (res) => {
        this.userData = res;

        // Extraer los datos del back a variales para mostrarlas en la UI con input signals
        this.nameAccount = this.userData.nombre;
        this.lastNamePAccount = this.userData.apellido_paterno;
        this.lastNameMAccount = this.userData.apellido_materno;
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

  // Esta función actualiza los datos del usuario que actualizó en la bd y los muestra en la interfaz
  changeInfo(datos: any) {
    this.nameAccount = datos.nombre;
    this.lastNamePAccount = datos.apellidoP;
    this.lastNameMAccount = datos.apellidoM;
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
