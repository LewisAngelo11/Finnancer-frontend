import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from '../services/usuario-service';
import { BodyCreateUserFinance } from '../services/usuario-service';
import { RegistrationState } from '../services/registration-state';

@Component({
  selector: 'app-onboarding',
  imports: [ReactiveFormsModule],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.css'
})
export class Onboarding {
  private router = inject(Router);
  private usuarioService = inject(UsuarioService);
  private fb = inject(FormBuilder);
  private registrationState = inject(RegistrationState);

  financeForm = this.fb.group({
    presupuesto: [],
    ingresos: [],
    egresos: [],
    ahorroMensual: [],
    diaCorte: [1]
  });

  get presupuesto() {
    return this.financeForm.get('presupuesto');
  }

  get ingresos() {
    return this.financeForm.get('ingresos');
  }

  get egresos() {
    return this.financeForm.get('egresos');
  }

  get ahorroMensual() {
    return this.financeForm.get('ahorroMensual');
  }

  get diaCorte() {
    return this.financeForm.get('diaCorte');
  }

  omitFinances() {
    this.router.navigate(['/dashboard']);
  }

  onSumbit() {
    const paramsFinance: BodyCreateUserFinance = {
      presupuesto: this.presupuesto?.value || 0,
      ingresos: this.ingresos?.value || 0,
      egresos: this.egresos?.value || 0,
      ahorroMensual: this.ahorroMensual?.value || 0,
      diaCorte: this.diaCorte?.value || 0,
    }

    let registrationData = this.registrationState.getRegistrationData();

    this.usuarioService.createFinanceParams(registrationData.correo, paramsFinance).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
