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
  templateUrl: './estudiantes.component.html',
  styleUrl: './estudiantes.component.css'
})
export class EstudiantesComponent implements OnInit {
  //aqui variables
  estudiante: number | undefined;
  listaAsing: any;
  token: string | undefined;
  modalVisible = false;
  modoEdicion = false;
  tallerForm!: FormGroup;
  idAsignaturaActual: number | null = null;
  now: any
  modalVisible2 = false
  componenteActivo: 'lista' | 'detalle' = 'lista';
asignaturaSeleccionada: any = null;
loadingTalleres = false;
talleresPorPeriodo: any


  talleres: any[] = [];
  displayedColumns: string[] = ['Sede', 'Descripción', 'Nombre', 'Horas', 'Opciones'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
Object: any;
  constructor(private backendService: BackendService, private fb: FormBuilder) { }

  ngOnInit(): void {
    //carga inicial
    const currentYear = new Date().getFullYear();
    this.now = currentYear
    console.log(currentYear)
    const usuarioString = sessionStorage.getItem('usuario');

    if (usuarioString) {
      const usuario = JSON.parse(usuarioString);
      this.estudiante = usuario.num_identificacion;
      console.log(usuario.num_identificacion);
    } else {
      console.log('No usuario found in sessionStorage');
    }
    this.consultarEstudianteCursoAsignaturas();
  }
  ngAfterViewInit() {

  }
  async consultarEstudianteCursoAsignaturas() {
    const usuarioString = sessionStorage.getItem('usuario');
    if (usuarioString) {
      const usuario = JSON.parse(usuarioString);
      this.estudiante = usuario.num_identificacion;
      console.log(this.estudiante);
      try {
        this.listaAsing = await this.backendService.consultarEstudianteCursoAsignaturas(usuario.num_identificacion);
        console.log(this.listaAsing);
        this.dataSource.data = this.listaAsing;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } catch (error) {
        console.error('Error al obtener los estudiantes:', error);
      }
    } else {
      console.error('No se encontró el usuario en sessionStorage');
    }

  }


volverAlListado() {
  this.componenteActivo = 'lista';
  this.asignaturaSeleccionada = null;
}
iconoAsignatura(nombre: string): string {
  const nombreMin = nombre.toLowerCase();
  if (nombreMin.includes('matemática')) return 'bi-calculator';
  if (nombreMin.includes('física')) return 'bi-lightning-fill';
  if (nombreMin.includes('química')) return 'bi-beaker';
  if (nombreMin.includes('sociales')) return 'bi-globe';
  if (nombreMin.includes('ética') || nombreMin.includes('religión')) return 'bi-heart-fill';
  if (nombreMin.includes('educación física')) return 'bi-activity';
  if (nombreMin.includes('filosofía')) return 'bi-book';
  if (nombreMin.includes('castellano')) return 'bi-journal-text';
  if (nombreMin.includes('inglés')) return 'bi-translate';
  if (nombreMin.includes('artística')) return 'bi-brush';
  return 'bi-journal'; // Default
}
async abrirModuloAsignatura(asignatura: any) {
  this.asignaturaSeleccionada = asignatura;
  this.componenteActivo = 'detalle';

  try {
    const id = asignatura.id_asignatura;
   this.talleresPorPeriodo =await this.backendService.getTalleresPorAsignatura(id); // 👈 solo enviar petición
    console.log('Petición enviada para asignatura ID:', id);
  } catch (error) {
    console.error('Error al hacer la petición:', error);
  }
}

talleresVacios(): boolean {
  return (
    !this.talleresPorPeriodo.periodo_1.length &&
    !this.talleresPorPeriodo.periodo_2.length &&
    !this.talleresPorPeriodo.periodo_3.length
  );
}






}
