import { Component, inject, input, effect } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BodyCreateUserFinance } from '../../services/usuario-service';
import { UsuarioService } from '../../services/usuario-service';

@Component({
  selector: 'app-finance-account',
  imports: [ReactiveFormsModule],
  templateUrl: './finance-account.html',
  styleUrl: './finance-account.css'
})
export class FinanceAccount {
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  mensajePeticion: string = '';

  // Inputs para valores iniciales
  presupuesto = input<number>();
  ingresosMensuales = input<number>();
  egresosMensuales = input<number>();
  ahorroMensual = input<number>();
  diaCorte = input<number>();

  formFinance = this.fb.group({
    presupuesto: [0],
    ingresosMensuales: [0],
    egresosMensuales: [0],
    ahorroMensual: [0],
    diaCorte: [1],
  });

  constructor() {
    // Utilizo un effect para actualizar el formulario cuando los inputs cambien
    effect(() => {
      this.formFinance.patchValue({
        presupuesto: this.presupuesto() ?? 0,
        ingresosMensuales: this.ingresosMensuales() ?? 0,
        egresosMensuales: this.egresosMensuales() ?? 0,
        ahorroMensual: this.ahorroMensual() ?? 0,
        diaCorte: this.diaCorte() ?? 1
      }, { emitEvent: false }); // emitEvent: false previene bucles si algo reacciona a los cambios
    });
  }

  get budget() {
    return this.formFinance.get('presupuesto');
  }

  get incomes() {
    return this.formFinance.get('ingresosMensuales');
  }

  get spendings() {
    return this.formFinance.get('egresosMensuales');
  }

  get monthlySavings() {
    return this.formFinance.get('ahorroMensual');
  }

  get cuttingDay() {
    return this.formFinance.get('diaCorte');
  }

  onSumbit() {
    const paramsFinance: BodyCreateUserFinance = {
      presupuesto: this.budget?.value || 0,
      ingresos: this.incomes?.value || 0,
      egresos: this.spendings?.value || 0,
      ahorroMensual: this.monthlySavings?.value || 0,
      diaCorte: this.cuttingDay?.value || 0,
    }

    this.usuarioService.updateFinanceParamas(paramsFinance).subscribe({
      next: (res) => {
        this.mensajePeticion = res.mensaje;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  resetMessage() {
    this.mensajePeticion = '';
  }
}
