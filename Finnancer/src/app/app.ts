import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthPage } from './auth-page/auth-page';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AuthPage],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Finnancer');
}
