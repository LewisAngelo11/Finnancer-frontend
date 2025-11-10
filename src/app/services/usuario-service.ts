import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaz que es para actualizar los datos del usuario sin el correo
export interface BodyUpdateUser {
  nombre: string,
  apellidoP: string,
  apellidoM: string,
}

export interface BodyCreateUserFinance {
  presupuesto: number,
  ingresos: number,
  egresos: number,
  ahorroMensual: number,
  diaCorte: number,
}

export interface BodyUpdatePassw {
  contrasena: string;
  nueva_contrasena: string;
}

export interface BodyCreateProfile {
  nombre: string;
  icono: number;
  pin: string;
}

export interface Perfil {
  id: number;
  nombre: string;
  icono: string;
  fechaCreacion: Date;
  estatus: string;
  pin: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private http = inject(HttpClient);
  private host = 'localhost';
  private port = 3000;

  private apiUrl = `http://${this.host}:${this.port}`;

  // Método que crea los parametros de finanzas del usuario
  createFinanceParams(bodyCreateUserFinance: BodyCreateUserFinance): Observable<any> {
    return this.http.patch(`${this.apiUrl}/usuarios/finance`, bodyCreateUserFinance );
  }

  // Método que solicita la info de el usuario
  getInfoUser() {
    return this.http.get(`${this.apiUrl}/usuarios/me`);
  }

  // Método que actualiza los datos financieros del usuario ya autenticado
  updateFinanceParamas(bodyCreateUserFinance: BodyCreateUserFinance): Observable<any> {
    return this.http.patch(`${this.apiUrl}/usuarios/update`, bodyCreateUserFinance);
  }

  // Método que actualiza los datos personales del usuario
  updateInfo(bodyUpdateUser: BodyUpdateUser): Observable<any> {
    return this.http.patch(`${this.apiUrl}/usuarios/info`, bodyUpdateUser);
  }

  // Método que actualiza la contraseña del usuario
  updatePassw(bodyUpdatePassw: BodyUpdatePassw): Observable<any> {
    return this.http.patch(`${this.apiUrl}/usuarios/security`, bodyUpdatePassw);
  }

  // Método que crea un nuevo perfil de un usuario
  createProfile(bodyCreateProfile: BodyCreateProfile): Observable<any> {
    return this.http.post(`${this.apiUrl}/perfiles/create`, bodyCreateProfile);
  }

  getAllProfiles(): Observable<Perfil[]>{
    return this.http.get<Perfil[]>(`${this.apiUrl}/perfiles/all`);
  }
}
