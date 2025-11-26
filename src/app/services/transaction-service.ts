import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BodyCreateTransaction {
  idCategoria: number;
  idSubcategoria: number | null;
  idPersona: number | null;
  nota: string | null;
  montoTotal: number;
  plazos: number;
  fechaTransaccion: string | null;
}

export interface BodyUpdateTransaction {
  idTransaccion: number;
  nota: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private http = inject(HttpClient);
  private host = 'localhost';
  private port = 3000;

  private apiUrl = `http://${this.host}:${this.port}`;

  createNewTransaction(body: BodyCreateTransaction): Observable<any> {
    return this.http.post(`${this.apiUrl}/transacciones/create`, body);
  }

  getAllTransactions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/transacciones/all`)
  }

  getOneTransaction(idTransaccion: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/transacciones/${idTransaccion}`);
  }

  getAllIncomesAmount(): Observable<any> {
    return this.http.get(`${this.apiUrl}/transacciones/amount/incomes`);
  }

  getAllEspensesAmount(): Observable<any> {
    return this.http.get(`${this.apiUrl}/transacciones/amount/espenses`);
  }

  getLastTransactiona(): Observable<any> {
    return this.http.get(`${this.apiUrl}/transacciones/last-transactions`);
  }

  updateTransaction(body: BodyUpdateTransaction): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/transacciones/update`, body);
  }

  cancelTransaction(body: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/transacciones/cancel`, body);
  }
}
