import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-restore-passw',
  imports: [],
  templateUrl: './restore-passw.html',
  styleUrl: './restore-passw.css'
})
export class RestorePassw {
  private router = inject(Router);

  goBackAuth() {
    this.router.navigate(['']);
  }
}
