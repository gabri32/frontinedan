import { Component, OnInit, ViewChild, Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableDataSource } from '@angular/material/table';
import { BackendService } from '../backend.service';
import { MatDividerModule } from '@angular/material/divider';
import * as alertify from 'alertifyjs';
import { MatCardModule } from '@angular/material/card';
import swal from 'sweetalert2';
import { FormsModule } from "@angular/forms";
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-docentes',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatDividerModule,
    MatCardModule,
    NgxChartsModule,
    FormsModule,
  ],
  templateUrl: './docentes.component.html',
  styleUrl: './docentes.component.css'
})
export class DocentesComponent implements OnInit {
  //aqui variables
  docente: string | undefined;
  listaAsing: any[] = [];
  token: string | undefined;
  modalVisible = false;
  modoEdicion = false;
  tallerForm!: FormGroup;
  idAsignaturaActual: number | null = null;
  now: any
  modalVisible2 = false
  talleres: any[] = [];
  displayedColumns: string[] = ['Sede', 'Descripción', 'Nombre', 'Horas', 'Opciones'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private backendService: BackendService, private fb: FormBuilder,private router: Router,) { }

  ngOnInit(): void {
    //carga inicial
    const currentYear = new Date().getFullYear();
    this.now = currentYear
    console.log(currentYear)
    this.tallerForm = this.fb.group({
      detalle_taller: [''],
      fecha_ini: [''],
      fecha_fin: [''],
      periodo: [''],
      doc: [''],
      doc2: [''],
      archivo_pdf: [null]
    });



    this.getAsingDocente()
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  applyGlobalFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  async getAsingDocente() {
    const token = sessionStorage.getItem('token');

    this.token = token !== null ? token : undefined;
    // Obtener los datos (recuerdar que `response` era un objeto, así que debes hacer parse)
    const dataString = sessionStorage.getItem('usuario');
    const data = dataString ? JSON.parse(dataString) : null;
    this.docente = data.num_identificacion
    try {
      if (this.docente) {
        this.listaAsing = await this.backendService.getAsingDocente(this.docente);
      } else {
        throw new Error("docente is undefined");
      }
      this.dataSource.data = this.listaAsing
      console.log(this.listaAsing)
    } catch (error) {
      console.error("Error :", error);
      swal.fire({
        title: "Error",
        text: "Hubo un problema.",
        icon: "error"
      });
    }
  }
  async abrirModal(id_asignatura: number, editar: boolean = false) {
    this.modoEdicion = editar;
    this.idAsignaturaActual = id_asignatura;
    this.tallerForm.reset();
    this.modalVisible = true;


  }
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.tallerForm.patchValue({
        archivo_pdf: file
      });
    } else {
      swal.fire("Archivo inválido", "Por favor selecciona un archivo PDF válido.", "warning");
    }
  }

  async verLista(id_asignatura: number) {
    try {
      this.modalVisible2 = true;
      this.talleres = await this.backendService.getTalleres(id_asignatura)
    } catch (error) {
      swal.fire("Error", "No se pudo cargar el taller.", "error");
    }
  }
  cerrarModal() {
    this.modalVisible = false;
    this.modalVisible2 = false;

    this.tallerForm.reset();
    this.idAsignaturaActual = null;

  }


  async guardarTaller(taller: any) {
    console.log(taller.value.detalle_taller)
    if (!this.idAsignaturaActual) return;
    const formData = {
      detalle_taller: taller.value.detalle_taller,
      fecha_ini: taller.value.fecha_ini,
      fecha_fin: taller.value.fecha_fin,
      periodo: taller.value.periodo,
      vigencia: new Date().getFullYear().toString(),
      doc: taller.value.doc,
      doc2: taller.value.doc2,
      id_asignatura: this.idAsignaturaActual
    }

    try {
      console.log("datale", formData)
      await this.backendService.createWorks(formData);
      swal.fire("Guardado", "Taller registrado correctamente.", "success");
      this.cerrarModal();
    } catch (error) {
      swal.fire("Error", "No se pudo guardar el taller.", "error");
    }
  }
  editarTaller(taller: any) {
    taller.editando = true;
    taller.backup = { ...taller }; // Guardamos copia original por si cancela
  }

  cancelarEdicion(taller: any) {
    Object.assign(taller, taller.backup); // Restauramos valores originales
    delete taller.backup;
    taller.editando = false;
  }




  async guardarEdicion(taller: any) {
    try {
      // Opcional: confirmar antes de guardar
      const confirmacion = await swal.fire({
        title: '¿Desea guardar los cambios?',
        text: 'Se actualizarán los datos de este taller.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, guardar',
        cancelButtonText: 'Cancelar'
      });

      if (!confirmacion.isConfirmed) {
        return;
      }

      // Preparamos datos
      delete taller.backup;
      taller.editando = false;

      const datosActualizados = {
        id_taller: taller.id_taller,
        detalle_taller: taller.detalle_taller,
        periodo: taller.periodo,
        fecha_ini: taller.fecha_ini,
        fecha_fin: taller.fecha_fin,
        doc: taller.doc,
        doc2: taller.doc2
      };

      console.log('[Taller actualizado]', datosActualizados);

      // Llamada al backend
      await this.backendService.actualizarTaller(datosActualizados);

      // Éxito
      await swal.fire({
        icon: 'success',
        title: '¡Guardado!',
        text: 'El taller fue actualizado correctamente.',
        confirmButtonText: 'Aceptar'
      });

    } catch (error) {
      console.error('Error al actualizar taller:', error);
      await swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un problema al guardar los cambios. Intenta nuevamente.',
        confirmButtonText: 'Cerrar'
      });
    }
  }
irACalificar(id: number) {
  console.log(id)
  this.router.navigate([`/layout/profesores/taller/${id}/respuestas`]);
}
getInfoNotas(id_asignatura: number, id_curso: number): void {
  console.log(id_curso)
  this.router.navigate(['/layout/profesores/NotasDocentes'], {
    queryParams: {
      id_asignatura: id_asignatura,
      id_curso: id_curso
    }
  });
}
}

