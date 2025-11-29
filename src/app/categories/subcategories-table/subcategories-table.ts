import { Component, inject, OnInit, output, signal, PLATFORM_ID } from '@angular/core';
import { SubcategoriaService } from '../../services/subcategoria-service';
import { Subcategorias } from '../categories';
import { isPlatformBrowser } from '@angular/common';

type FiltrosSubcategorias = 'Todos' | 'Ingreso' | 'Egreso' | 'Activo' | 'Baja';

@Component({
  selector: 'app-subcategories-table',
  imports: [],
  templateUrl: './subcategories-table.html',
  styleUrl: './subcategories-table.css'
})
export class SubcategoriesTable implements OnInit {
  private subcategoriaService = inject(SubcategoriaService);

  subcategorias: Subcategorias[] = [];
  subcategoriasFiltradas: Subcategorias[] = [];
  modalOpen = output<boolean>();
  editarSubcategoria = output<boolean>();

  selectedFilterSubcategories = signal<FiltrosSubcategorias>('Todos');
  private platformId = inject(PLATFORM_ID);

  // Iconos para las categorías y subcategorías
  icons: Record<number, string> = {
    1: 'bx bx-money',
    2: 'bx bx-bulb',
    3: 'bx bx-trending-up',
    4: 'bx bx-trending-down',
    5: 'bx bx-water',
    6: 'bx bx-money',
    7: 'bx bx-receipt',
    8: 'bx bx-dollar',
    9: 'bx bx-building',
    10: 'bx bx-coin',
    11: 'bx bx-line-chart',
    12: 'bx bx-bookmark',
    13: 'bx-bar-chart-alt-2',
    14: 'bx bx-credit-card',
  };

  ngOnInit(): void {
    let authToken;

    // Solo acceder a localStorage si ya está en el navegador
    if (isPlatformBrowser(this.platformId)) {
      authToken = localStorage.getItem('token');
    }

    if (!authToken) return;

    this.subcategoriaService.getAllSubcategories().subscribe({
      next: (res) => {
        this.subcategorias = res;
        this.filtrarSubcategorias('Todos');
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  selectorFilterSubategories(filtro: FiltrosSubcategorias) {
    this.selectedFilterSubcategories.set(filtro);
  }

  filtrarSubcategorias(tipo: string) {
    switch (tipo) {
      case 'Ingreso':
        this.subcategoriasFiltradas = this.subcategorias.filter(c => c.tipo === 'ingreso');
        break;

      case 'Egreso':
        this.subcategoriasFiltradas = this.subcategorias.filter(c => c.tipo === 'egreso');
        break;

      case 'Activo':
        this.subcategoriasFiltradas = this.subcategorias.filter(c => c.estatus === 'activo');
        break;

      case 'Baja':
        this.subcategoriasFiltradas = this.subcategorias.filter(c => c.estatus === 'baja');
        break;

      default:
        this.subcategoriasFiltradas = [...this.subcategorias];
        break;
    }
  }

  // Función que notifica al componente padre de abrir el modal de crear una subcategoria
  notifyOpenModalSubcategoria() {
    this.modalOpen.emit(true);
  }

  // Función que notifica al componente padre de abrir el modal de editar una subcategoria
  notifyOpenEditModalSubcategoria(subcategoria: any) {
    this.editarSubcategoria.emit(subcategoria);
  }

  // Función para animar los botones de los filtros
  animateButton(event: Event) {
    const btn = event.currentTarget as HTMLElement;
    btn.classList.remove('bounce'); // por si ya la tenía
    void btn.offsetWidth; // truco para reiniciar la animación
    btn.classList.add('bounce');
  }
}
