import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CategoriaService } from '../services/categoria-service';
import { SubcategoriaService, Subcategoria } from '../services/subcategoria-service';
import { BodyCreateTransaction } from '../services/transaction-service';
import { TransactionService } from '../services/transaction-service';

type Filtros = 'todas' | 'ingresos' | 'egresos' | 'pagadas' | 'pendientes' | 'canceladas';

interface Transacciones {
  id_transaccion: number,
  categoria: string,
  subcategoria: string,
  perfil: string,
  persona: string,
  monto_total: number,
  fecha_transaccion: Date,
  estatus: string,
}

interface Categorias {
  id_categoria: number,
  nombre: string,
  tipo: string,
  flujo: string,
  estatus: string,
}

interface Personas {
  id: number,
  nombre: string,
  tipo: string,
  estatus: string,
}

@Component({
  selector: 'app-transactions',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css'
})
export class Transactions implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private categoriaService = inject(CategoriaService);
  private subcategoriaService = inject(SubcategoriaService);
  private transaccionService = inject(TransactionService);

  modalOpen = signal(false);
  modalOpenEdit = signal(false);
  modalEditTransaction = signal(false);
  modalEditCuota = signal(false);
  animateModal = signal(false);
  selectFilter = signal<Filtros>('todas');
  
  formNewTransaction = this.fb.group({
    categoria: [null, Validators.required],
    subcategoria: [null, Validators.required],
    nota: [''],
    montoTotal: ['', Validators.required],
    plazos: [1],
    fechaTransaccion: [''],
    persona: ['', Validators.required],
  })
  
  categorias: Categorias[] = [];
  subcategorias: Subcategoria[] = [];
  transacciones: Transacciones[] = [];
  personas: Personas[] = [];
  mensajeConsultarTransaccion: string = '';
  
  editarForm!: FormGroup;

  ngOnInit(): void {
    // Inicializar el formlario de editar a transacción
    this.editarForm = this.fb.group({
      numeroTransaccion: ['', Validators.required],

      categoria: [{ value: '', disabled: true }],
      subcategoria: [{ value: '', disabled: true }],
      nota: [{ value: '', disabled: true }],
      montoTotal: [{ value: '', disabled: true }],
      plazos: [{ value: '', disabled: true }],
    });

    this.categoriaService.getAllCategories().subscribe({
      next: (res) => {
        this.categorias = res;
      },
    });

    this.transaccionService.getAllTransactions().subscribe({
      next: (res) => {
        this.transacciones = res;
        console.log(this.transacciones);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  // Funión que cambia el filtro seleccionado
  selectorFilter(filter: Filtros) {
    this.selectFilter.set(filter);
  }

  // Abre el modal de crear transacción
  openModal() {
    this.modalOpen.set(true);
    setTimeout(() => this.animateModal.set(true), 100);
  }

  // Cierra el modal de crear transacción
  closeModal() {
    this.animateModal.set(false);
    // Espera a que la animación termine antes de ocultarlo en el DOM
    setTimeout(() => this.modalOpen.set(false), 200);
  }


  // Abre el modal de editar
  openEditModal() {
    this.modalOpenEdit.set(true);
    setTimeout(() => this.animateModal.set(true), 100);
  }

  // Cierra el modal de editar
  closeEditModal() {
    this.animateModal.set(false);
    // Espera a que la animación termine antes de ocultarlo en el DOM
    setTimeout(() => this.modalOpenEdit.set(false), 200);
  }


  // Abre el modal de editar una transacción
  openEditTransaction() {
    this.closeEditModal();
    this.modalEditTransaction.set(true);
    setTimeout(() => this.animateModal.set(true), 400);
  }

  // Cierra el modal de editar una transacción
  closeEditTransaction() {
    this.animateModal.set(false);

    this.editarForm.patchValue({
      numeroTransaccion: '',
      categoria: '',
      subcategoria: '',
      nota: '',
      montoTotal: '',
      plazos: '',
    });
    // Espera a que la animación termine antes de ocultarlo en el DOM
    setTimeout(() => this.modalEditTransaction.set(false), 200);
  }


  // Abre el modal de editar una cuota
  openEditCouta() {
    this.closeEditModal();
    this.modalEditCuota.set(true);
    setTimeout(() => this.animateModal.set(true), 400);
  }

  // Cierra el modal de editar una cuota
  closeEditCuota() {
    this.animateModal.set(false);
    // Espera a que la animación termine antes de ocultarlo en el DOM
    setTimeout(() => this.modalEditCuota.set(false), 200);
  }

  // Función que detecta los cambios en el select de categorías
  onCategoriaChange(event: Event) {
    const id = +(event.target as HTMLSelectElement).value;

    // Buscar categoría seleccionada
    const categoriaSeleccionada = this.categorias.find(c => c.id_categoria === id);

    if (!categoriaSeleccionada) {
      this.formNewTransaction.patchValue({
        subcategoria: null,
      });
      return;
    }

    this.formNewTransaction.patchValue({
      subcategoria: null,
    });

    const idCategoria = categoriaSeleccionada.id_categoria;

    console.log('Id categoría:', idCategoria);

    this.subcategoriaService.getAllSubcategoriesFromCategory(idCategoria).subscribe({
      next: (res) => {
        this.subcategorias = res;
      },
    });

    if (categoriaSeleccionada.tipo === 'ingreso') {
      
    } else if (categoriaSeleccionada.tipo === 'egreso') {

    }
  }

  // Método que crea una nueva transacción
  addNewTransaction() {
    const formValue = this.formNewTransaction.value;

    const body: BodyCreateTransaction = {
      idCategoria: Number(formValue.categoria),
      idSubcategoria: Number(formValue.subcategoria) || null,
      idPersona: Number(formValue.persona) || null,
      nota: formValue.nota || '',
      montoTotal: Number(formValue.montoTotal),
      plazos: Number(formValue.plazos),
      fechaTransaccion: formValue.fechaTransaccion || null,
    };

    console.log(body);

    this.transaccionService.createNewTransaction(body).subscribe({
      next: (res) => {
        const newTransaccion = res;
        this.transacciones.push(newTransaccion);
        this.closeModal();

        this.formNewTransaction.patchValue({
          categoria: null,
          subcategoria: null,
          nota: '',
          montoTotal: '',
          plazos: 1,
          fechaTransaccion: '',
          persona: ''
        })
      },
      error: (err) => {
        console.log('Error:', err);
      }
    });
  }

  // Función para consultar una transacción
  consultarTransaccion() {
    const idTransaccion = this.editarForm.get('numeroTransaccion')?.value;

    this.transaccionService.getOneTransaction(idTransaccion).subscribe({
      next: (data) => {
        this.mensajeConsultarTransaccion = '';

        // Mensaje que remplazará el nulo en caso de no haber id_subcategoria referenciada en la transacción
        let mensajeSubcategoria;

        const categoriaBuscada = this.categorias.find(c => c.id_categoria === data.id_categoria);
        const subcategoriaBuscada = this.subcategorias.find(s => s.id_subcategoria === data.id_subcategoria);

        if (!subcategoriaBuscada) {
          mensajeSubcategoria = 'Sin subcategoría';
        }

        console.log(categoriaBuscada);
        console.log(subcategoriaBuscada);
        // Rellenamos el form con la info de la transacción
        this.editarForm.patchValue({
          categoria: categoriaBuscada?.nombre,
          subcategoria: subcategoriaBuscada?.nombre || mensajeSubcategoria,
          nota: data.nota,
          montoTotal: data.monto_total,
          plazos: data.plazos
        });

        // Habilitamos los demás campos que deben permitir editarse
        this.editarForm.get('nota')?.enable();
      },
      error: () => {
        this.mensajeConsultarTransaccion = 'No existe la transacción';
      }
    });
  }
}
