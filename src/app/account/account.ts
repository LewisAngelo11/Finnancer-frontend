import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { InfoAccount } from './info-account/info-account';
import { ProfilesAccount } from './profiles-account/profiles-account';
import { HistoryTransactions } from './history-transactions/history-transactions';
import { FinanceAccount } from './finance-account/finance-account';
import { SecurityAccount } from './security-account/security-account';

@Component({
  selector: 'app-account',
  imports: [InfoAccount, ProfilesAccount, HistoryTransactions, FinanceAccount, SecurityAccount],
  templateUrl: './account.html',
  styleUrl: './account.css'
})
export class Account {
  nameAccount: string = 'Luis Angel';
  lastNameAccount: string = 'Soto Galvez';
  mailAccount: string = 'luis123@mail.com';
  registerDate: string = 'Septiembre de 2025';
  budget: number = 200500;
  minimumIncomes: number = 4000;
  maximumSpendings: number = 3000;

  buttonSelected = signal(1);
  private router = inject(Router);

  perfiles = [
    {id: 1, name: 'Administrador'},
    {id: 2, name: 'Recepcionista'},
    {id: 3, name: 'Secretaria'}
  ];

  currentProfile = 'Administrador';

  activeProfiles = this.perfiles.length;

  goBackToDash() {
    this.router.navigate(['/dashboard']);
  }

  buttonSelect(id: number) {
    this.buttonSelected.set(id);
  }
}
