import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CategoriaService } from '../services/categoria-service';
import { PersonaService } from '../services/persona-service';
import { SubcategoriaService, Subcategoria } from '../services/subcategoria-service';
import { BodyCreateTransaction, BodyUpdateTransaction, BodyUpdateTransaccionCuota, BodyAbonarCuota, TransaccionesCuotas } from '../services/transaction-service';
import { TransactionService } from '../services/transaction-service';
import { forkJoin } from 'rxjs';

type Filtros = 'todas' | 'ingresos' | 'egresos' | 'pagadas' | 'pendientes' | 'canceladas';

interface Transacciones {
  id_transaccion: number,
  categoria: string,
  tipo: string,
  subcategoria: string,
  perfil: string,
  persona: string,
  monto_total: number,
  fecha_transaccion: Date,
  estatus: string,
}

export interface UltimasTransacciones {
  id_transaccion: number,
  tipo: string,
  fecha_transaccion: string,
  nota: string,
  monto_total: number,
  plazos: number,
  estatus: string,
  categoria: string,
  icono_categoria: number,
  id_persona: number | null,
  perfil: number
}

interface Categorias {
  id_categoria: number,
  nombre: string,
  tipo: string,
  flujo: string,
  estatus: string,
}

interface Personas {
  id_persona: number,
  nombre: string,
  tipo: string,
  estatus: string,
}

@Component({
  selector: 'app-transactions',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css'
})
export class Transactions implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private categoriaService = inject(CategoriaService);
  private subcategoriaService = inject(SubcategoriaService);
  private transaccionService = inject(TransactionService);
  private personasService = inject(PersonaService);

  modalOpen = signal(false); // Signal para manejar la apertura del modal 'formNewTransaction'
  modalOpenEdit = signal(false);
  modalEditTransaction = signal(false); // Signal para manejar la apertura del modal 'editarForm'
  modalCuota = signal(false); // Signal para manejar la apertura del modal 'formCuotas'
  animateModal = signal(false); // Signal que se usa para habilitar las animaciones de apertura y cierre de los modales
  animateCuotaModal = signal(false);
  selectFilter = signal<Filtros>('todas'); // Signal que indica que filtro se seleccionó
  flujoTransaccionConsultada = signal('');
  mensajeEdit = signal('');
  transaccionPagada = signal(false);
  cancelacionTransaccion = signal(false);
  modalEditCuota = signal(false)
  updateCuotaDone = signal(false);
  habilitarBotonAbonar = signal(false);
  mensajeUpdateCuota = signal('');
  mensajeAbonoCuota = signal('');
  puedeGuardar = false;
  puedeAbonar = false;
  puedeCancelar = true;
  abonoExitoso = false;
  
  formNewTransaction = this.fb.group({
    categoria: [null, Validators.required],
    subcategoria: [null],
    nota: [''],
    montoTotal: ['', Validators.required],
    plazos: [1, Validators.required],
    fechaTransaccion: [''],
    persona: [''],
  });
  
  categorias: Categorias[] = [];
  subcategorias: Subcategoria[] = [];
  transacciones: Transacciones[] = [];
  transaccionesFiltradas: Transacciones[] = [];
  transaccionesCuotas: TransaccionesCuotas[] = [];
  personas: Personas[] = [];
  ultimasTransacciones: UltimasTransacciones[] = [];
  mensajeConsultarTransaccion: string = '';
  numTransaccionesIngresos = 0;
  numTransaccionesEgresos = 0;
  montoIngresosTransacciones = 0;
  montoEgresosTransacciones = 0;
  
  editarForm!: FormGroup;
  formEditCuota!: FormGroup;

  formCuotas = this.fb.group({
    transaccion: ['', Validators.required],
  });

  // Iconos para las categorías
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
    // Inicializar el formlario de editar a transacción
    this.editarForm = this.fb.group({
      numeroTransaccion: ['', Validators.required],

      categoria: [{ value: '', disabled: true }],
      subcategoria: [{ value: '', disabled: true }],
      nota: [{ value: '', disabled: true }],
      montoTotal: [{ value: '', disabled: true }],
      plazos: [{ value: '', disabled: true }],
    });

    // Formulario para la cuota a editar
    this.formEditCuota = this.fb.group({
      numeroCuota: [{ value: null, disabled: true }],
      montoPagar: [{ value: null, disabled: true }],
      montoPagado: [{ value: null, disabled: true }],
      fechaVencimiento: [null, [Validators.required]],
      restante: [{ value: null, disabled: true }],
      abonar: [null, [Validators.min(0)]],
    });

    this.categoriaService.getAllCategories().subscribe({
      next: (res) => {
        this.categorias = res;
      },
    });

    this.transaccionService.getAllTransactions().subscribe({
      next: (res) => {
        this.transacciones = res;
        this.filtrarTransacciones('todas');

        // Hacer un conteo de las transacciones que son de tipo ingresos
        this.numTransaccionesIngresos = this.transacciones.reduce((acc, transaccion) => {
          return transaccion.tipo === 'ingreso' ? acc + 1 : acc;
        }, 0);

        // Hacer un conteo de las transacciones que son de tipo egresos
        this.numTransaccionesEgresos = this.transacciones.reduce((acc, transaccion) => {
          return transaccion.tipo === 'egreso' ? acc + 1 : acc;
        }, 0);
      },  
      error: (err) => {
        console.log(err);
      }
    });

    this.transaccionService.getAllIncomesAmount().subscribe({
      next: (data) => {
        let montoTotal = data._sum.monto_total; // Obtener el monto de la request
        this.montoIngresosTransacciones = montoTotal;
      },
      error: (err) => {
        console.log(err);
      }
    });

    this.transaccionService.getAllEspensesAmount().subscribe({
      next: (data) => {
        let montoTotal = data._sum.monto_total; // Obtener el monto de la request
        this.montoEgresosTransacciones = montoTotal;
      },
      error: (err) => {
        console.log(err);
      }
    });

    this.transaccionService.getLastTransactiona().subscribe({
      next: (data) => {
        this.ultimasTransacciones = data;
      }
    })
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  // Funión que cambia el filtro seleccionado
  selectorFilterTransacciones(filter: Filtros) {
    this.selectFilter.set(filter);
  }

  filtrarTransacciones(tipo: string) {
    switch (tipo) {
      case 'ingresos':
        this.transaccionesFiltradas = this.transacciones.filter(t => t.tipo === 'ingreso');
        break;

      case 'egresos':
        this.transaccionesFiltradas = this.transacciones.filter(t => t.tipo === 'egreso');
        break;

      case 'pagadas':
        this.transaccionesFiltradas = this.transacciones.filter(t => t.estatus === 'pagada');
        break;
        
      case 'pendientes':
        this.transaccionesFiltradas = this.transacciones.filter(t => t.estatus === 'pendiente');
        break;

      case 'canceladas':
        this.transaccionesFiltradas = this.transacciones.filter(t => t.estatus === 'cancelada');
        break;

      default:
        this.transaccionesFiltradas = [...this.transacciones];
        break;
    }
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
    this.flujoTransaccionConsultada.set('');
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

    this.puedeGuardar = false;

    this.mensajeEdit.set('');
    // Espera a que la animación termine antes de ocultarlo en el DOM
    setTimeout(() => this.modalEditTransaction.set(false), 200);
  }


  // Abre el modal de editar una cuota
  openEditCouta() {
    this.closeEditModal();
    this.modalCuota.set(true);
    setTimeout(() => this.animateModal.set(true), 400);
  }

  // Cierra el modal de editar una cuota
  closeEditCuota() {
    this.animateModal.set(false);
    this.transaccionesCuotas = [];

    this.formCuotas.patchValue({
      transaccion: '',
    });
    // Espera a que la animación termine antes de ocultarlo en el DOM
    setTimeout(() => this.modalCuota.set(false), 200);
  }

  // Cierra el modal de editar una cuota
  closeEditCuotaFromCuotaForm() {
    this.animateModal.set(false);
    // Espera a que la animación termine antes de ocultarlo en el DOM
    setTimeout(() => this.modalCuota.set(false), 200);
  }


  // Función que abre el modal para editar una cuota o abonar
  openCuotaModal(cuota: any) {
    const restante = (Number(cuota.monto) - Number(cuota.pagado));

    // Convertir la fecha del backend, a el formato del input
    const fecha = cuota.fecha_vencimiento
      ? new Date(cuota.fecha_vencimiento).toISOString().split('T')[0]
      : null;
    // Llenar el formulario con los datos de la cuota seleccionada
    this.formEditCuota.patchValue({
      numeroCuota: cuota.id_cuota,
      montoPagar: cuota.monto,
      montoPagado: cuota.pagado || 0, // si no viene del backend
      fechaVencimiento: fecha || null,
      restante: restante,
      abonar: null
    });
    
    this.closeEditCuotaFromCuotaForm();

    // Habilitar o deshabilitar el input de abonar dependiendo el estatus de la cuota
    if (cuota.estatus === 'pagada') {
      this.formEditCuota.get('abonar')?.disable();
      this.habilitarBotonAbonar.set(false);
    } else {
      this.formEditCuota.get('abonar')?.enable();
      this.habilitarBotonAbonar.set(true);
    }

    this.modalEditCuota.set(true);
    setTimeout(() => this.animateModal.set(true), 400);
  }

  closeCuotaModal() {
    this.animateModal.set(false);
    // Espera a que la animación termine antes de ocultarlo en el DOM
    this.mensajeAbonoCuota.set('');
    this.mensajeUpdateCuota.set('');
    setTimeout(() => this.modalEditCuota.set(false), 200);
    this.openEditCouta();
  }

  // Función que detecta los cambios en el select de categorías
  onCategoriaChange(event: Event) {
    const id = +(event.target as HTMLSelectElement).value;

    // Buscar categoría seleccionada
    const categoriaSeleccionada = this.categorias.find(c => c.id_categoria === id);

    if (!categoriaSeleccionada) {
      this.formNewTransaction.patchValue({
        subcategoria: null,
        persona: null,
      });
      return;
    }

    this.formNewTransaction.patchValue({
      subcategoria: null,
      persona: null,
    });

    console.log(categoriaSeleccionada.tipo);

    // Cambiar la lógica del campo "plazos" según el tipo
    if (categoriaSeleccionada.flujo === 'efectivo') {
      this.formNewTransaction.get('plazos')?.setValue(1);
      this.formNewTransaction.get('plazos')?.disable();
    } else {
      this.formNewTransaction.get('plazos')?.enable();
    }

    const idCategoria = categoriaSeleccionada.id_categoria;

    this.subcategoriaService.getAllSubcategoriesFromCategory(idCategoria).subscribe({
      next: (res) => {
        this.subcategorias = res;
      },
    });

    // Consultar los clientes o proveedores dependiendo del tipo de categoría que es
    if (categoriaSeleccionada.tipo === 'ingreso') {
      this.personasService.getAllClients().subscribe({
        next: (data) => {
          console.log(data);
          this.personas = data;
        },
      });
    } else if (categoriaSeleccionada.tipo === 'egreso') {
      this.personasService.getAllProviders().subscribe({
        next: (data) => {
          this.personas = data;
        },
      });
    }
  }

  // Método que crea una nueva transacción
  addNewTransaction() {
    const formValue = this.formNewTransaction.getRawValue();

    const body: BodyCreateTransaction = {
      idCategoria: Number(formValue.categoria),
      idSubcategoria: Number(formValue.subcategoria) || null,
      idPersona: Number(formValue.persona) || null,
      nota: formValue.nota || '',
      montoTotal: Number(formValue.montoTotal),
      plazos: Number(formValue.plazos),
      fechaTransaccion: formValue.fechaTransaccion || null,
    };

    this.transaccionService.createNewTransaction(body).subscribe({
      next: (res) => {
        const newTransaccion = res.transaccion;
        this.transacciones.push(newTransaccion);
        this.transaccionesFiltradas.push(newTransaccion);
        this.closeModal();
        if(newTransaccion.tipo === 'ingreso') {
          this.numTransaccionesIngresos += 1;
          this.montoIngresosTransacciones + newTransaccion.monto_total;

        } else if (newTransaccion.tipo === 'egreso') {
          this.numTransaccionesEgresos += 1;
          this.montoEgresosTransacciones + newTransaccion.monto_total;
        } 

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

    if (!idTransaccion) {
      this.mensajeConsultarTransaccion = "Debes ingresar un número de transacción.";
      return;
    }

    forkJoin({
      transaccion: this.transaccionService.getOneTransaction(idTransaccion),
      abonos: this.transaccionService.getFeesTransaction(idTransaccion), 
    }).subscribe(({ transaccion, abonos }) => {
      this.mensajeConsultarTransaccion = '';
      const transaccionEstatus = transaccion.estatus;
  
      // Guardar el tipo de transacción
      this.flujoTransaccionConsultada.set(transaccion.categoria.flujo);
  
      // Habilita el boton de guardar cambios
      this.puedeGuardar = true;
  
      if (transaccion.flujo === 'cuenta_por_cobrar' || 'cuenta_por_pagar' ){
        this.puedeAbonar = true;
        this.puedeCancelar = true;
      }
  
      if (transaccionEstatus === 'pagada') {
        this.puedeAbonar = false;
        this.puedeCancelar = false;
      }
  
      // Verifica si hay abonos a esa transacción
      const abonado = Number(abonos._sum.pagado);
      if (abonado > 0) {
        this.puedeCancelar = false;
      }
  
      // Mensaje que remplazará el nulo en caso de no haber id_subcategoria referenciada en la transacción
      let mensajeSubcategoria;
  
      const categoriaBuscada = this.categorias.find(c => c.id_categoria === transaccion.id_categoria);
      const subcategoriaBuscada = this.subcategorias.find(s => s.id_subcategoria === transaccion.id_subcategoria);
  
      if (!subcategoriaBuscada) {
        mensajeSubcategoria = 'Sin subcategoría';
      }
  
      // Rellenamos el form con la info de la transacción
      this.editarForm.patchValue({
        categoria: categoriaBuscada?.nombre,
        subcategoria: subcategoriaBuscada?.nombre || mensajeSubcategoria,
        nota: transaccion.nota,
        montoTotal: transaccion.monto_total,
        plazos: transaccion.plazos
      });
  
      // Habilitamos los demás campos que deben permitir editarse
      this.editarForm.get('nota')?.enable();
    });
  }

  actualizarTransaccion() {
    const idTransaccion = this.editarForm.get('numeroTransaccion')?.value;
    const nota = this.editarForm.get('nota')?.value;

    const body: BodyUpdateTransaction = {
      idTransaccion: Number(idTransaccion),
      nota: nota,
    };

    this.transaccionService.updateTransaction(body).subscribe({
      next: () => {
        this.closeEditTransaction();
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  // Método que marca como pagada la transacción consultada (Solo las que son de flujo: efectivo)
  completarTransaccion() {
    const idTransaccion = this.editarForm.get('numeroTransaccion')?.value;

    const body = {
      idTransaccion: idTransaccion,
    };

    this.transaccionService.changeStatusTransaction(body).subscribe({
      next: () => {
        this.transaccionPagada.set(true);
        this.mensajeEdit.set('La tranacción ha sido completada.');
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  // Método que cancela la transacción consultada
  cancelarTransaccion() {
    const idTransaccion = this.editarForm.get('numeroTransaccion')?.value;

    const body = {
      idTransaccion: idTransaccion,
    };

    this.transaccionService.cancelTransaction(body).subscribe({
      next: () => {
        this.mensajeEdit.set('La tranacción ha sido cancelada.');
        this.cancelacionTransaccion.set(true);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  // Función que dirige a el modal de consultar las cuotas de una transacción
  abonarCuota() {
    const idTransaccion = this.editarForm.get('numeroTransaccion')?.value;

    this.formCuotas.patchValue({
      transaccion: idTransaccion,
    });

    this.closeEditTransaction();

    this.openEditCouta();
  }

  // Método para consultar las cuotas de una transacción
  consultarCuotas() {
    const idTransaccion = Number(this.formCuotas.get('transaccion')?.value);

    this.transaccionService.getAllFeesOfTransaction(idTransaccion).subscribe({
      next: (data) => {
        this.transaccionesCuotas = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // Método que actualiza la fecha de vencimiento de la cuota
  actualizarFechaExpiracion() {
    const data = this.formEditCuota.getRawValue();
    const idCuota = Number(data.numeroCuota);

    const fechaStr = this.formEditCuota.get('fechaVencimiento')?.value;
    const fechaISO = fechaStr ? new Date(fechaStr).toISOString() : null;

    const body: BodyUpdateTransaccionCuota = {
      idCuota: idCuota,
      fechaVencimiento: fechaISO,
    };

    console.log(body);

    this.transaccionService.updateExpirationDate(body).subscribe({
      next: (res) => {
        this.updateCuotaDone.set(true);
        this.mensajeUpdateCuota.set(res.mensaje);
      },
      error: (err) => {
        console.log(err);
        this.mensajeUpdateCuota.set(err.error.message);
      },
    });
  }

  agregarAbonoCuota() {
    const data = this.formEditCuota.getRawValue();
    const idCuota = Number(data.numeroCuota);
    const idTransaccion = Number(this.formCuotas.get('transaccion')?.value);

    const body: BodyAbonarCuota = {
      idCuota: idCuota,
      idTransaccion: idTransaccion,
      pago: Number(this.formEditCuota.get('abonar')?.value) || 0,
    };

    console.log(body);

    this.transaccionService.paymentTransactionFee(body).subscribe({
      next: (res) => {
        this.abonoExitoso = true;
        this.mensajeAbonoCuota.set(res.mensaje);
      },
      error: (err) => {
        this.abonoExitoso = false;
        this.mensajeAbonoCuota.set(err.error.message);
      }
    })
  }
}
