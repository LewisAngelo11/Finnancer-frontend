import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BodyCreateCategory {
  icono: number,
  nombre: string,
  tipo: string,
  flujo: string,
  mostrarPanel: boolean,
}

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private http = inject(HttpClient);
  private host = 'localhost';
  private port = 3000;

  private apiUrl = `http://${this.host}:${this.port}`;

  createCategory(body: BodyCreateCategory): Observable<any> {
    return this.http.post(`${this.apiUrl}/categorias/new`, body);
  }

  getAllCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/categorias/all`);
  }
}
