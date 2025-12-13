import { Component, OnInit, signal, inject, output, PLATFORM_ID, input, effect } from '@angular/core';
import { CategoriaService } from '../../services/categoria-service';
import { Categorias } from '../categories';
import { isPlatformBrowser } from '@angular/common';

type FiltrosCategorias = 'Todos' | 'Ingreso' | 'Egreso' | 'Activo' | 'Baja';

@Component({
  selector: 'app-categories-table',
  imports: [],
  templateUrl: './categories-table.html',
  styleUrl: './categories-table.css'
})
export class CategoriesTable implements OnInit {
  selectedFilterCategories = signal<FiltrosCategorias>('Todos');
  modalOpen = output<boolean>();
  editarCategoria = output<any>();
  animateModal = signal(false);
  nuevaCategoria = input<Categorias | null>(null);

  private categoriaService = inject(CategoriaService);
  private platformId = inject(PLATFORM_ID);

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

  constructor() {
    effect(() => {
      const nueva = this.nuevaCategoria();

      if (!nueva) return;

      this.categorias = [...this.categorias, nueva];
      this.totalCategorias = this.categorias.length;
      this.filtrarCategorias('Todos');

    });
  }

  ngOnInit() {
    let authToken;

    // Solo acceder a localStorage si ya está en el navegador
    if (isPlatformBrowser(this.platformId)) {
      authToken = localStorage.getItem('token');
    }

    if (!authToken) return;
    
    this.categoriaService.getAllCategories().subscribe({
      next: (res) => {
        this.categorias = res;
        this.totalCategorias = this.categorias.length;
        this.filtrarCategorias('Todos');
      },
    });
  }

  categorias: Categorias[] = [];
  totalCategorias = 0;
  cateogriasIngresos = 0;
  categoríasEgresos = 0;
  categoriasFiltradas: Categorias[] = [];

  selectorFilterCategories(filtro: FiltrosCategorias) {
    this.selectedFilterCategories.set(filtro);
  }

  filtrarCategorias(tipo: string) {
    switch (tipo) {
      case 'Ingreso':
        this.categoriasFiltradas = this.categorias.filter(c => c.tipo === 'ingreso');
        break;

      case 'Egreso':
        this.categoriasFiltradas = this.categorias.filter(c => c.tipo === 'egreso');
        break;

      case 'Activo':
        this.categoriasFiltradas = this.categorias.filter(c => c.estatus === 'activo');
        break;

      case 'Baja':
        this.categoriasFiltradas = this.categorias.filter(c => c.estatus === 'baja');
        break;

      default:
        this.categoriasFiltradas = [...this.categorias];
        break;
    }
  }

  // Función que notifica al componente padre de abrir el modal de crear una categoria
  notifyOpenModalCategoria() {
    this.modalOpen.emit(true);
  }

  // Función que notifica al componente padre de abrir el modal de editar una categoria
  notifyOpenEditModalCategoria(categoria: any) {
    this.editarCategoria.emit(categoria);
  }

  // Función para animar los botones de los filtros
  animateButton(event: Event) {
    const btn = event.currentTarget as HTMLElement;
    btn.classList.remove('bounce'); // por si ya la tenía
    void btn.offsetWidth; // truco para reiniciar la animación
    btn.classList.add('bounce');
  }
}
