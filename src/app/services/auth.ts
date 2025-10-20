import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface bodyCreateUser {
  nombre: string,
  apellidoP: string
  apellidoM: string,
  correo: string,
  contrasena: string
};

export interface bodyCreateUserWithCode {
  nombre: string,
  apellidoP: string
  apellidoM: string,
  correo: string,
  contrasena: string,
  codigo: number
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private http = inject(HttpClient);
  private host = '192.168.100.88';
  private port = 3000;

  private apiUrl = `http://${this.host}:${this.port}`;

  // Método login
  login(correo: string, contrasena: string):Observable<any> {
    return this.http.post(`${this.apiUrl}/auth`, {correo, contrasena});
  }

  // Método signUp
  signUp(bodyCrear: bodyCreateUserWithCode): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/create`, bodyCrear);
  }

  // Método enviar correo
  sendMail(to: string, name: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/send-mail`, {to, name});
  }
}
