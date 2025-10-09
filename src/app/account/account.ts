import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { InfoAccount } from './info-account/info-account';
import { ProfilesAccount } from './profiles-account/profiles-account';
import { HistoryTransactions } from './history-transactions/history-transactions';

@Component({
  selector: 'app-account',
  imports: [InfoAccount, ProfilesAccount, HistoryTransactions],
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
    switch (id) {
      case 1:
        this.buttonSelected.set(1);
        break;
      case 2:
        this.buttonSelected.set(2);
        break;
      case 3:
        this.buttonSelected.set(3);
        break;
      case 4:
        this.buttonSelected.set(4);
        break;
    }
  }
}
