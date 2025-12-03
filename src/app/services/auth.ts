import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

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

  // Método login
  login(credentials: { correo: string, contrasena: string }) {
    // La función promete recibir un access_token, desde el backend
    return this.http.post<{ access_token: string }>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap((response) => {
        localStorage.setItem('token', response.access_token); // Guarda el token en el localStorage
      })
    );
  }

  // Método signUp
  signUp(bodyCrear: bodyCreateUserWithCode) {
    return this.http.post<{ access_token : string }>(`${environment.apiUrl}/auth/create`, bodyCrear).pipe(
      tap((response) => {
        localStorage.setItem('token', response.access_token); // Guarda el token en el localStorage
      })
    );
  }

  // Método enviar correo
  sendMail(to: string, name: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/send-mail`, {to, name});
  }

  sendMailToRecoveryPassw(to: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/send-mail/recovery-passw`, { to });
  }

  validateCode(body: { correo: string; codigo: number }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/verify-mail`, body);
  }

  resetPassword(correo: string, newPassword: string) {
    return this.http.post(`${environment.apiUrl}/auth/reset-password`, {
      correo,
      newPassword
    });
  }
}
