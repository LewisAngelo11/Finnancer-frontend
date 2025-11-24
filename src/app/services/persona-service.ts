import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BodyCreatePerson {
  nombre: string,
  tipoPersona: string,
}

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  private http = inject(HttpClient);
  private host = 'localhost';
  private port = 3000;

  private apiUrl = `http://${this.host}:${this.port}`;

  createPerson(body: BodyCreatePerson): Observable<any> {
    return this.http.post(`${this.apiUrl}/personas/create`, body);
  }

  getAllPersons(): Observable<any> {
    return this.http.get(`${this.apiUrl}/personas/all`);
  }

  getAllDebt(body: any): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/personas/debt`, body);
  }
}
