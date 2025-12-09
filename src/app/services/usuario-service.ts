import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../environments/environment';

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
  pin: string | null;
}

export interface BodyUpdateProfile {
  idPerfil: number;
  nombre: string;
  icono: number;
  pin: string | null;
  estatus: string;
}

export interface Usuario {
  id_usuario: number,
  nombre: string,
  apellido_paterno: string,
  apellido_materno: string,
  correo: string,
  fecha_creacion: string | Date,
  foto_perfil: null,
  estatus: string,
  presupuesto: number,
  ingreso_minimo: number,
  egreso_maximo: number,
  ahorro_mensual: number,
  dia_corte: number
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
  private perfiles$?: Observable<Perfil[]>; // Cache local en memoria para evitar peticiones repetitivas

  // Método que crea los parametros de finanzas del usuario
  createFinanceParams(bodyCreateUserFinance: BodyCreateUserFinance): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/usuarios/finance`, bodyCreateUserFinance );
  }

  // Método que solicita la info de el usuario
  getInfoUser(): Observable<Usuario> {
    return this.http.get<Usuario>(`${environment.apiUrl}/usuarios/me`);
  }

  // Método que actualiza los datos financieros del usuario ya autenticado
  updateFinanceParamas(bodyCreateUserFinance: BodyCreateUserFinance): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/usuarios/update`, bodyCreateUserFinance);
  }

  // Método que actualiza los datos personales del usuario
  updateInfo(bodyUpdateUser: BodyUpdateUser): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/usuarios/info`, bodyUpdateUser);
  }

  // Método que actualiza la contraseña del usuario
  updatePassw(bodyUpdatePassw: BodyUpdatePassw): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/usuarios/security`, bodyUpdatePassw);
  }

  // ------- Endpoints para los perfiles relacionados a un usuario -----------

  // Método que crea un nuevo perfil de un usuario
  createProfile(bodyCreateProfile: BodyCreateProfile): Observable<any> {
    return this.http.post(`${environment.apiUrl}/perfiles/create`, bodyCreateProfile);
  }

  //Método que obtiene todos los perfiles relacionados al usuario
  getAllProfiles(): Observable<Perfil[]> {
    if (!this.perfiles$) {
      this.perfiles$ = this.http
        .get<Perfil[]>(`${environment.apiUrl}/perfiles/all`)
        .pipe(shareReplay(1)); // cachea la última respuesta
    }
    return this.perfiles$;
  }

  // Método que obtiene únicamente los perfiles activos relacionados al usuario
  getAllActiveProfiles(): Observable<Perfil[]>{
    return this.http.get<Perfil[]>(`${environment.apiUrl}/perfiles/all-active`);
  }

  // Método que obtiene un perfil con el id
  getOneProfile(): Observable<Perfil>{
    return this.http.get<Perfil>(`${environment.apiUrl}/perfiles/one`);
  }

  // Método que valida el pin de un perfil
  validatePinProfile(credetnials: {idPerfil: number, pin: string}) {
    return this.http.post(`${environment.apiUrl}/perfiles/validatePIN`, credetnials);
  }

  // Método que actializa los datos de un perfil
  updateProfile(bodyUpdateProfile: BodyUpdateProfile):Observable<any> {
    return this.http.patch(`${environment.apiUrl}/perfiles/update`, bodyUpdateProfile);
  }
}
