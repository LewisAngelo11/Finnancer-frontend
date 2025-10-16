import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private http = inject(HttpClient);
  private host = 'localhost';
  private port = 3000;

  private apiUrl = `http://${this.host}:${this.port}/auth`;

  // Método login
  login(correo: string, contrasena: string):Observable<any> {
    return this.http.post<any>(this.apiUrl, {correo, contrasena});
  }
}
