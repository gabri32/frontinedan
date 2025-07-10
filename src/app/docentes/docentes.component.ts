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
  token:string|undefined;
  modalVisible = false;
modoEdicion = false;
tallerForm!: FormGroup;
idAsignaturaActual: number | null = null;
now:any
modalVisible2= false
talleres:any[] = [];
   displayedColumns: string[] = ['Sede', 'Descripción', 'Nombre', 'Horas', 'Opciones'];
    dataSource = new MatTableDataSource<any>();
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
constructor(private backendService: BackendService, private fb: FormBuilder) { }

  ngOnInit(): void {
    //carga inicial
   const currentYear = new Date().getFullYear();
   this.now=currentYear
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

async verLista(id_asignatura:number){
try {
  this.modalVisible2 = true;
this.talleres=await  this.backendService.getTalleres(id_asignatura)
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


async guardarTaller() {
  if (!this.idAsignaturaActual) return;
  const formData = new FormData();
  formData.append('detalle_taller', this.tallerForm.value.detalle_taller);
  formData.append('fecha_ini', this.tallerForm.value.fecha_ini);
  formData.append('fecha_fin', this.tallerForm.value.fecha_fin);
  formData.append('periodo', this.tallerForm.value.periodo);
  formData.append('vigencia', new Date().getFullYear().toString());
  if (this.tallerForm.value.doc) formData.append('doc', this.tallerForm.value.doc);
  if (this.tallerForm.value.doc2) formData.append('doc2', this.tallerForm.value.doc2);
  if (this.tallerForm.value.archivo_pdf) formData.append('archivo_pdf', this.tallerForm.value.archivo_pdf);
  try {
    await this.backendService.createWorks(formData);  
    swal.fire("Guardado", "Taller registrado correctamente.", "success");
    this.cerrarModal();
  } catch (error) {
    swal.fire("Error", "No se pudo guardar el taller.", "error");
  }
}

}
