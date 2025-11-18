import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { response } from 'express';

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
  private host = '192.168.100.28';
  private port = 3000;

  private apiUrl = `http://${this.host}:${this.port}`;

  // Método login
  login(credentials: { correo: string, contrasena: string }) {
    // La función promete recibir un access_token, desde el backend
    return this.http.post<{ access_token: string }>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((response) => {
        localStorage.setItem('token', response.access_token); // Guarda el token en el localStorage
      })
    );
  }

  // Método signUp
  signUp(bodyCrear: bodyCreateUserWithCode) {
    return this.http.post<{ access_token : string }>(`${this.apiUrl}/auth/create`, bodyCrear).pipe(
      tap((response) => {
        localStorage.setItem('token', response.access_token); // Guarda el token en el localStorage
      })
    );
  }

  // Método enviar correo
  sendMail(to: string, name: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/send-mail`, {to, name});
  }
}
