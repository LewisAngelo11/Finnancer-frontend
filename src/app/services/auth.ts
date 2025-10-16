import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private host = 'localhost';
  private port = 3000;

  private apiUrl = `http://${this.host}:${this.port}/auth`;

  constructor(private http: HttpClient) {}

  // Método login
  login(correo: string, contrasena: string):Observable<any> {
    return this.http.post<any>(this.apiUrl, {correo, contrasena});
  }
}
