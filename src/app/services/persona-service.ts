import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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
    return this.http.post(`${environment.apiUrl}/personas/create`, body);
  }

  getAllPersons(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/personas/all`);
  }

  getAllDebt(body: any): Observable<number> {
    return this.http.post<number>(`${environment.apiUrl}/personas/debt`, body);
  }

  getAllClients(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/personas/clients`);
  }

  getAllProviders(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/personas/providers`);
  }

  updatePerson(body: any): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/personas/status`, body);
  }

  changeStatus(body: any): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/personas/status`, body);
  }
}
