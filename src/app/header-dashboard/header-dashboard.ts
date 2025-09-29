import { Component, signal, inject} from '@angular/core';
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-header-dashboard',
  imports: [RouterLink],
  templateUrl: './header-dashboard.html',
  styleUrl: './header-dashboard.css'
})
export class HeaderDashboard {
  isShow = signal(false); // Signal para manejar la animaciones del menu del header
  
  private router = inject(Router);

  // Función que cambia de valor del signal isShow() utilizado para mostrar o no el menu en móviles
  toggle() {
    this.isShow.update((isShow) => !isShow);
  }

  goToAccount() {
    this.router.navigate(['/account']);
  }

  enterAnimation = signal('slide-in-down');
}
