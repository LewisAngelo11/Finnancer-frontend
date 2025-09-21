import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-header-dashboard',
  imports: [],
  templateUrl: './header-dashboard.html',
  styleUrl: './header-dashboard.css'
})
export class HeaderDashboard {
  isShow = signal(false); // Signal para manejar la animaciones del menu del header

  // Función que cambia de valor del signal isShow() utilizado para mostrar o no el menu en móviles
  toggle() {
    this.isShow.update((isShow) => !isShow);
  }

  enterAnimation = signal('slide-in-down');
}
