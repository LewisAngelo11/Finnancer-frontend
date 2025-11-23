import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BodyCreateSubcategory {
  idCategoria: number,
  icono: number,
  nombre: string,
  mostrarPanel: boolean,
}

@Injectable({
  providedIn: 'root'
})
export class SubcategoriaService {
  private http = inject(HttpClient);
  private host = 'localhost';
  private port = 3000;

  private apiUrl = `http://${this.host}:${this.port}`;

  createSubcategory(body: BodyCreateSubcategory): Observable<any> {
    return this.http.post(`${this.apiUrl}/subcategorias/create`, body);
  }

  getAllSubcategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/subcategorias/all`);
  }
}
