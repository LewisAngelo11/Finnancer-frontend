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

export interface TransaccionesCuotas {
  id_cuota: number,
  id_transaccion: number,
  monto: number,
  fecha_vencimiento: string | null,
  fecha_pago: string | null,
  estatus: string,
  pagado: number,
}

export interface BodyUpdateTransaction {
  idTransaccion: number;
  nota: string | null;
}

export interface BodyUpdateTransaccionCuota {
  idCuota: number,
  fechaVencimiento: string | null,
}

export interface BodyAbonarCuota {
  idCuota: number,
  idTransaccion: number,
  pago: number,
}

export interface CategoriaTransaccion {
  icono: number;
  nombre: string;
  mostrar_panel: boolean;
}

export interface TransaccionDashboard {
  id_transaccion: number;
  tipo: string;
  fecha_transaccion: string;
  nota: string | null;
  monto_total: string;
  plazos: number | null;
  estatus: string;
  id_categoria: number | null;
  id_usuario: number | null;
  id_perfil: number | null;
  id_subcategoria: number | null;
  id_persona: number | null;
  categoria: CategoriaTransaccion;
}

export interface TotalAndTransactionsResponse {
  total: string;
  transacciones: TransaccionDashboard[];
}

export interface Transaccion {
  id_transaccion: number;
  tipo: string;
  fecha_transaccion: string;
  nota: string;
  monto_total: string;
  plazos: number;
  estatus: string;
  id_categoria: number;
  id_usuario: number;
  id_perfil: number;
  id_subcategoria: number | null;
  id_persona: number | null;
  categoria: {
    icono: number;
    nombre: string;
  };
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

  getExpensesTransaction():Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/transacciones/expenses`);
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

  changeStatusTransaction(body: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/transacciones/complete`, body);
  }

  paymentTransactionFee(body: BodyAbonarCuota): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/transacciones-cuotas/payment`, body)
  }

  getAllFeesOfTransaction(idTransaccion: number): Observable<TransaccionesCuotas[]> {
    return this.http.get<TransaccionesCuotas[]>(`${this.apiUrl}/transacciones-cuotas/${idTransaccion}`);
  }

  updateExpirationDate(body: BodyUpdateTransaccionCuota): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/transacciones-cuotas/updateExpiration`, body);
  }

  getAllTransactionsFromProfile(): Observable<Transaccion[]> {
    return this.http.get<Transaccion[]>(`${this.apiUrl}/transacciones/all-profile`);
  }

  getTotalAndSumCategory(idCategoria: number) {
    return this.http.get<TotalAndTransactionsResponse>(
      `${this.apiUrl}/transacciones/total-cat/${idCategoria}`
    );
  }
}
