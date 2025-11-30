import { Component, inject, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transaction-service';

interface Gastos {
  id_transaccion: number,
  tipo: string,
  fecha_transaccion: string | Date,
  nota: string,
  monto_total: number,
  plazos: number,
  estatus: string,
  categoria: string,
  subcategoria: string,
  persona: string,
  perfil: string
}

@Component({
  selector: 'app-most-spendings',
  imports: [],
  templateUrl: './most-spendings.html',
  styleUrl: './most-spendings.css'
})
export class MostSpendings implements OnInit {
  private transactionService = inject(TransactionService);

  gastos: Gastos[] = [];

  // Estilos para los mayores gastos
  containers: Record<number, string> = {
    1: 'card rounded-full w-[160px] h-[160px] bg-[#46E24D] p-5 absolute top-[260px] left-[480px]',
    2: 'card rounded-full w-[150px] h-[150px] bg-[#00C40A] p-4 absolute top-[290px] left-[270px]',
    3: 'card rounded-full w-[140px] h-[140px] bg-[#00C40A] p-4 absolute top-[60px] left-[470px]',
    4: 'card rounded-full w-[120px] h-[120px] bg-[#028008] p-3 absolute top-[120px] left-[320px] ',//
    5: 'card rounded-full w-[110px] h-[110px] bg-[#028008] p-2 absolute top-[280px] left-[120px]',
    6: 'card rounded-full w-[120px] h-[120px] bg-[#028008] p-2 absolute top-[90px] left-[100px]',
    7: 'card rounded-full w-[100px] h-[100px] bg-[#004403] p-1 absolute top-[180px] left-[210px]', //
    8: 'card rounded-full w-[100px] h-[100px] bg-[#004403] p-1 absolute top-[20px] left-[220px] ',
    9: 'card rounded-full w-[90px] h-[90px] bg-[#004403] p-1 absolute top-[200px] left-[20px] ',
    10: 'card rounded-full w-[90px] h-[90px] bg-[#002B02] p-1 absolute top-[10px] left-[20px]',//
  };

  ngOnInit(): void {
    this.transactionService.getAllTransactions().subscribe({
      next: (data) => {
        this.gastos = data;
        const gastosFiltrados = this.gastos.filter(g => g.tipo === 'egreso');
        this.gastos = gastosFiltrados.sort((a, b) => b.monto_total - a.monto_total);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
