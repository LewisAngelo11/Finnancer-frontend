import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Subcategoria {
  id_subcategoria: number;
  nombre: string;
  tipo: string;
  estatus: string;
  flujo: string;
  id_categoria: number;
  mostrar_panel: boolean;
  id_usuario: number;
  icono: number;
}

export interface BodyCreateSubcategory {
  idCategoria: number,
  icono: number,
  nombre: string,
  mostrarPanel: boolean,
}

export interface BodyUpdateSubcategory {
  idSubcategoria: number,
  nombre: string,
  mostrarPanel: boolean,
  icono: number,
}

@Injectable({
  providedIn: 'root'
})
export class SubcategoriaService {
  private http = inject(HttpClient);

  createSubcategory(body: BodyCreateSubcategory): Observable<any> {
    return this.http.post(`${environment.apiUrl}/subcategorias/create`, body);
  }

  getAllSubcategories(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/subcategorias/all`);
  }

  getAllSubcategoriesFromCategory(idCategoria: number): Observable<Subcategoria[]> {
    return this.http.get<Subcategoria[]>(`${environment.apiUrl}/subcategorias/${idCategoria}`);
  }

  updateSubcategory(body: BodyUpdateSubcategory): Observable<any> {
    return this.http.patch<any>(`${environment.apiUrl}/subcategorias/update`, body);
  }

  changeStatusSubcategory(body: any): Observable<any> {
    return this.http.patch<any>(`${environment.apiUrl}/subcategorias/change-status`, body);
  }
}
