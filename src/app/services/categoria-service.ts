import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface BodyCreateCategory {
  icono: number,
  nombre: string,
  tipo: string,
  flujo: string,
  mostrarPanel: boolean,
}

export interface BodyUpdateCategory {
  idCategoria: number,
  nombre: string,
  mostrarPanel: boolean,
  icono: number,
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
    return this.http.post(`${environment.apiUrl}/categorias/new`, body);
  }

  getAllCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/categorias/all`);
  }

  updateCategory(body: BodyUpdateCategory): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/categorias/update`, body);
  }

  changeEstatus(body: any): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/categorias/status`, body);
  }
}
