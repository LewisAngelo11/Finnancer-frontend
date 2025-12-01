import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TransactionService } from '../services/transaction-service';

export interface CategoriaBalance {
  id_categoria: number | null;
  nombre: string;
  tipo: string;
  monto_total: number;
  subcategorias: SubcategoriaBalance[];
}

interface SubcategoriaBalance {
  id_subcategoria: number | null;
  nombre: string;
  monto: number;
  id_categoria: number | null;
}

@Component({
  selector: 'app-balance',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './balance.html',
  styleUrl: './balance.css'
})
export class Balance implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private transactionService = inject(TransactionService);

  categoriasBalance: CategoriaBalance[] = [];
  categoriasIngresos: CategoriaBalance[] = [];
  categoriasEgresos: CategoriaBalance[] = [];
  totalIngresos: number = 0;
  totalEgresos: number = 0;
  resultadoNeto: number = 0;
  
  ngOnInit(): void {
    const mesActual = new Date().getMonth() + 1;
    const anioActual = new Date().getFullYear();

    this.transactionService.generateBalance(mesActual, anioActual).subscribe({
      next: (data: any) => {
        this.categoriasBalance = data.categoriasBalance;
        this.totalIngresos = data.ingresosTotales;
        this.totalEgresos = data.egresosTotales;
        this.resultadoNeto = data.resultadoNeto;
        // Filtrar las categorías de ingresos
        this.categoriasIngresos = this.categoriasBalance.filter(c => c.tipo === 'ingreso');
        // Filtrar las categorías de egresos
        this.categoriasEgresos = this.categoriasBalance.filter(c => c.tipo === 'egreso');
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  mesActual = '';

  anios: number[] = [];

  // Generar años para los balances
  constructor() {
    const anioActual = new Date().getFullYear();
    for (let i = anioActual; i >= 2020; i--) {
      this.anios.push(i);
    }
  }

  meses = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' },
  ];

  // Formulario para los periodos de los balances
  formBalance = this.fb.group({
    mes: new FormControl(null, { nonNullable: true }),
    anio: new FormControl(null, { nonNullable: true }),
  });

  consultarBalance() {
    const mes = Number(this.formBalance.get('mes')?.value);
    const anio = Number(this.formBalance.get('anio')?.value);

    if (!mes || !anio) return;

    this.transactionService.generateBalance(mes, anio).subscribe({
      next: (data: any) => {
        this.categoriasBalance = data.categoriasBalance;

        this.totalIngresos = data.ingresosTotales;
        this.totalEgresos = data.egresosTotales;
        this.resultadoNeto = data.resultadoNeto;
        // Filtrar las categorías de ingresos
        this.categoriasIngresos = this.categoriasBalance.filter(c => c.tipo === 'ingreso');
        // Filtrar las categorías de egresos
        this.categoriasEgresos = this.categoriasBalance.filter(c => c.tipo === 'egreso');
      },
    });
  }
}
