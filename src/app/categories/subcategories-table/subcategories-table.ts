import { Component, inject, OnInit, output, signal } from '@angular/core';
import { SubcategoriaService } from '../../services/subcategoria-service';
import { Subcategorias } from '../categories';

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

  selectedFilterSubcategories = signal<FiltrosSubcategorias>('Todos');

  ngOnInit(): void {
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

  // Función para animar los botones de los filtros
  animateButton(event: Event) {
    const btn = event.currentTarget as HTMLElement;
    btn.classList.remove('bounce'); // por si ya la tenía
    void btn.offsetWidth; // truco para reiniciar la animación
    btn.classList.add('bounce');
  }
}
