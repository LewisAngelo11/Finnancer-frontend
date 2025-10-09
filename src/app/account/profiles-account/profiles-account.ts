import { Component, input } from '@angular/core';

interface Perfil {
  id: number,
  nombre: string,
  icono: number
}

@Component({
  selector: 'app-profiles-account',
  imports: [],
  templateUrl: './profiles-account.html',
  styleUrl: './profiles-account.css'
})
export class ProfilesAccount {
  // Datos de prueba
  perfilesCreados: Perfil[] = [
    {id: 1, nombre: 'Administrador', icono: 1},
    {id: 2, nombre: 'Secretaria', icono: 2},
    {id: 3, nombre: 'Recepcionista', icono: 2}
  ];

  numeroPerfiles = this.perfilesCreados.length; // Para contar cuantos perfiles tiene el usuario

  
}
