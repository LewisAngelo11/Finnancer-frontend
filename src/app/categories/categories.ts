import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { BodyCreateCategory, CategoriaService } from '../services/categoria-service';
import { CategoriesTable } from './categories-table/categories-table';
import { SubcategoriesTable } from './subcategories-table/subcategories-table';
import { BodyCreateSubcategory, SubcategoriaService } from '../services/subcategoria-service';

export interface Categorias {
  id_categoria: number,
  icono: number,
  nombre: string,
  tipo: string,
  flujo: string,
  mostrar_panel: boolean,
  estatus: string,
}

export interface Subcategorias {
  id_subcategoria: number,
  icono: number,
  nombre: string,
  categoria: string,
  tipo: string,
  flujo: string,
  mostrar_panel: boolean,
  estatus: string,
}

@Component({
  selector: 'app-categories',
  imports: [FormsModule, ReactiveFormsModule, CategoriesTable, SubcategoriesTable],
  templateUrl: './categories.html',
  styleUrl: './categories.css'
})
export class Categories implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private categoriaService = inject(CategoriaService);
  private subcategoriaService = inject(SubcategoriaService);

  tipoOperacion: string | null = null;
  modalOpenCategoria = signal(false);
  modalOpenSubcategoria = signal(false);
  animateModal = signal(false);

  categorias: Categorias[] = [];
  totalCategorias = 0;
  cateogriasIngresos = 0;
  categoriasEgresos = 0;

  subcategorias: Subcategorias[] = [];
  totalSubcategorias = 0;
  subcateogriasIngresos = 0;
  subcategoriasEgresos = 0;


  ngOnInit() {
    this.formCreateCategory.get('tipoMovimiento')!.valueChanges.subscribe(value => {
      this.tipoOperacion = value;
    });

    // Obtengo todas las categorías para contar cuantas tiene el usuario
    this.categoriaService.getAllCategories().subscribe({
      next: (res) => {
        this.categorias = res;
        this.totalCategorias = this.categorias.length;
        // Filtrar las categorias que son de tipo ingreso
        this.cateogriasIngresos = this.categorias.filter(c => c.tipo === 'ingreso').length;
        // Filtrar las categorias que son de tipo egreso
        this.categoriasEgresos = this.categorias.filter(c => c.tipo === 'egreso').length;
      },
      error: (err) => {
        console.log(err);
      }
    });

    // Obtengo todas las subcategorías para contar cuantas tiene el usuario
    this.subcategoriaService.getAllSubcategories().subscribe({
      next: (res) => {
        this.subcategorias = res;
        this.totalSubcategorias = this.subcategorias.length;
        // Filtrar las subcategorias que son de tipo ingreso
        this.subcateogriasIngresos = this.subcategorias.filter(s => s.tipo === 'ingreso').length;
        // Filtrar las subcategorias que son de tipo egreso
        this.subcategoriasEgresos = this.subcategorias.filter(s => s.tipo === 'egreso').length;
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  // Form para las categorías
  formCreateCategory = this.fb.group({
    nombre: ['', Validators.required],
    icono: [1, Validators.required],
    tipoMovimiento: ['', Validators.required],
    flujoEfectivo: ['seleccionar', Validators.required],
    mostrarPanel: [false],
  })

  get nombreCategoria() {
    return this.formCreateCategory.get('nombre');
  }

  get iconoCategoria() {
    return this.formCreateCategory.get('icono');
  }

  get tipoCategoria() {
    return this.formCreateCategory.get('tipoMovimiento');
  }

  get flujoCategoria() {
    return this.formCreateCategory.get('flujoEfectivo');
  }

  get mostrarPanelCategoria() {
    return this.formCreateCategory.get('mostrarPanel');
  }


  formCreateSubcategory = this.fb.group({
    categoria: ['seleccionar', Validators.required],
    nombre: ['', Validators.required],
    icono: [1, Validators.required],
    tipoMovimiento: ['', Validators.required],
    flujoEfectivo: ['', Validators.required],
    mostrarPanel: [false],
  });

  get categoriaNombre() {
    return this.formCreateSubcategory.get('categoria');
  }

  get nombreSubcategoria() {
    return this.formCreateSubcategory.get('nombre');
  }

  get iconoSubcategoria() {
    return this.formCreateSubcategory.get('icono');
  }

  get tipoSubcategoria() {
    return this.formCreateSubcategory.get('tipoMovimiento');
  }

  get flujoEfectivo() {
    return this.formCreateSubcategory.get('flujoEfectivo');
  }

  get mostrarSubcategoria() {
    return this.formCreateSubcategory.get('mostrarPanel');
  }


  // Función que envía devuelta al dashboard
  goBackToDash() {
    this.router.navigate(['/dashboard']);
  }

  openModalCategoria(open: boolean) {
    this.modalOpenCategoria.set(open);
    setTimeout(() => this.animateModal.set(true), 100); // Hace una pausa para que se monte el modal
  }

  openModalSubcategoria(open: boolean) {
    this.modalOpenSubcategoria.set(open);
    setTimeout(() => this.animateModal.set(true), 100); // Hace una pausa para que se monte el modal
  }

  closeModalCategoria() {
    this.animateModal.set(false);
    // Resetear el formulario para volver a los valores por defecto
    this.formCreateCategory.reset({
      nombre: '',
      icono: 1,
      tipoMovimiento: '',
      flujoEfectivo: 'seleccionar',
      mostrarPanel: false
    });
    // Espera a que termine la animación antes de ocultarlo
    setTimeout(() => this.modalOpenCategoria.set(false), 100);
  }

  // Función para cerrar el modal de las subcategorías
  closeModalSubcategoria() {
    this.animateModal.set(false);
    // Resetear el formulario para volver a los valores por defecto
    this.formCreateSubcategory.reset({
      categoria: 'seleccionar',
      nombre: '',
      icono: 1,
      tipoMovimiento: '',
      flujoEfectivo: '',
      mostrarPanel: false
    });
    // Espera a que termine la animación antes de ocultarlo
    setTimeout(() => this.modalOpenSubcategoria.set(false), 100);
  }

  // Método para crear una categoría
  createCategory() {
    // Crear el body
    const body: BodyCreateCategory = {
      nombre: this.nombreCategoria?.value || '',
      icono: Number(this.iconoCategoria?.value),
      tipo: this.tipoCategoria?.value || '',
      flujo: this.flujoCategoria?.value || '',
      mostrarPanel: this.mostrarPanelCategoria?.value || false,
    }

    this.categoriaService.createCategory(body).subscribe({
      next: () => {
        // Resetear el formulario para volver a los valores por defecto
        this.formCreateCategory.reset({
          nombre: '',
          icono: 1,
          tipoMovimiento: '',
          flujoEfectivo: 'seleccionar',
          mostrarPanel: false
        });

        this.closeModalCategoria();
      },

      error: (err) => {
        console.error('Error al crear categoría:', err);
      }
    });
  }

  // Esta función escucha los cambios en el select de las categorías
  onCategoriaChange(event: Event) {
    const id = +(event.target as HTMLSelectElement).value;

    // Buscar categoría seleccionada
    const categoriaSeleccionada = this.categorias.find(c => c.id_categoria === id);

    if (!categoriaSeleccionada) {
      this.formCreateSubcategory.patchValue({
        tipoMovimiento: '',
        flujoEfectivo: ''
      });
      return;
    }

    // Asignar valores heredados a la subcategoría
    this.formCreateSubcategory.patchValue({
      tipoMovimiento: categoriaSeleccionada.tipo,
      flujoEfectivo: categoriaSeleccionada.flujo
    });
  }

  // Método para crear una subcategoría
  createSubcategory() {
    // Obtener el ID seleccionado del select
    const idSeleccionado = Number(this.categoriaNombre?.value);
    // Buscar la categoría por ID
    const categoriaBuscada = this.categorias.find(c => c.id_categoria === idSeleccionado);
    
    const body: BodyCreateSubcategory = {
      idCategoria: categoriaBuscada?.id_categoria || 0,
      icono: this.iconoSubcategoria?.value || 1,
      nombre: this.nombreSubcategoria?.value || '',
      mostrarPanel: this.mostrarSubcategoria?.value || false,
    }

    this.subcategoriaService.createSubcategory(body).subscribe({
      next: () => {
        // Resetear el formulario para volver a los valores por defecto
        this.formCreateSubcategory.reset({
          categoria: 'seleccionar',
          nombre: '',
          icono: 1,
          tipoMovimiento: '',
          flujoEfectivo: '',
          mostrarPanel: false
        });

        this.closeModalSubcategoria();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
