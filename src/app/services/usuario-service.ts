import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';

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
  id_perfil: number;
  nombre: string;
  icono: string;
  fecha_creacion: Date;
  estatus: string;
  pin: string;
  super_usuario: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private http = inject(HttpClient);
  private host = 'localhost';
  private port = 3000;
  private perfiles$?: Observable<Perfil[]>; // Cache local en memoria para evitar peticiones repetitivas

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

  //Método que obtiene todos los perfiles relacionados al usuario
  getAllProfiles(): Observable<Perfil[]> {
    if (!this.perfiles$) {
      this.perfiles$ = this.http
        .get<Perfil[]>(`${this.apiUrl}/perfiles/all`)
        .pipe(shareReplay(1)); // cachea la última respuesta
    }
    return this.perfiles$;
  }

  // Método que obtiene únicamente los perfiles activos relacionados al usuario
  getAllActiveProfiles(): Observable<Perfil[]>{
    return this.http.get<Perfil[]>(`${this.apiUrl}/perfiles/all-active`);
  }

  // Método que obtiene un perfil con el id
  getOneProfile(): Observable<Perfil>{
    return this.http.get<Perfil>(`${this.apiUrl}/perfiles/one`);
  }
}
