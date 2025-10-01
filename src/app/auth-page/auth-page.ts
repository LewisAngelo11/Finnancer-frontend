import { Component } from '@angular/core';
import { Login } from './login/login';
import { Register } from './register/register';

@Component({
  selector: 'app-auth-page',
  imports: [Login, Register],
  templateUrl: './auth-page.html',
  styleUrl: './auth-page.css'
})
export class AuthPage {
  buttonSelected = 'login';

  changeModal(modal: string) {
    switch(modal) {
      case 'login':
        this.buttonSelected = 'login';
        break;
      case 'register':
        this.buttonSelected = 'register';
        break;
    }
  }
}
