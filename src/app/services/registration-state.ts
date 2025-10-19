import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegistrationState {

  // Esta variable guarda de manera temporal los datos de crear usuario
  private registrationData: any;

  constructor() {}

  // Método guarda los datos en el form Crear Cuenta en la memoria
  setRegistrationData(data: any) {
    this.registrationData = data;
  }

  // Método para obtener los datos nuevamente guardados en memoria
  getRegistrationData(): any {
    return this.registrationData;
  }

  // Limpia el registro de los datos almacenados en memoria
  clearRegistrationData() {
    this.registrationData = null;
  }
}
