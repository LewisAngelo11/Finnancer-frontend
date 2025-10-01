import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-restore-passw',
  imports: [RouterLink],
  templateUrl: './restore-passw.html',
  styleUrl: './restore-passw.css'
})
export class RestorePassw {
  private router = inject(Router);

  goBackAuth() {
    this.router.navigate(['']);
  }
}
