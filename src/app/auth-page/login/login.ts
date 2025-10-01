import { Component, inject } from '@angular/core';
import {RouterLink} from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private router = inject(Router);

  goToDashboard() {
    this.router.navigate(['dashboard']);
  }
}
