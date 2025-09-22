import { Component } from '@angular/core';
import { HeaderDashboard } from '../header-dashboard/header-dashboard';

@Component({
  selector: 'app-dashboard',
  imports: [HeaderDashboard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  presupuesto: number = 200500;
}
