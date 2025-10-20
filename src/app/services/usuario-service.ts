import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BodyCreateUserFinance {
  presupuesto: number,
  ingresos: number,
  egresos: number,
  ahorroMensual: number,
  diaCorte: number,
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private http = inject(HttpClient);
  private host = 'localhost';
  private port = 3000;

  private apiUrl = `http://${this.host}:${this.port}`;

  // Método que crea los parametros de finanzas del usuario
  createFinanceParams(correo: string, bodyCreateUserFinance: BodyCreateUserFinance): Observable<any> {
    return this.http.patch(`${this.apiUrl}/usuarios/${correo}`, bodyCreateUserFinance );
  }
}
