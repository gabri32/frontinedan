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
import { Router,ActivatedRoute  } from '@angular/router';

@Component({
  selector: 'app-notas-vista-docente-component',
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
  templateUrl: './notas-vista-docente-component.component.html',
  styleUrl: './notas-vista-docente-component.component.css'
})
export class NotasVistaDocenteComponentComponent implements OnInit{
  id_asignatura: number | undefined;
  id_curso: number | undefined;
  talleres: any[] = [];
tabla: any[] = [];
 constructor(private route: ActivatedRoute,private backendService: BackendService) {}
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id_asignatura = +params['id_asignatura'];
      this.id_curso = +params['id_curso'];

     
      this.cargarDatosNotas(  this.id_curso,this.id_asignatura,);
    });
  }


async  construirTabla(estudiantes:any, talleres:any, notas:any) {
  return estudiantes.map((estudiante: { estudiante_id: any; nombre: any; num_identificacion: any; }) => {
    const fila = {
      estudiante_id: estudiante.estudiante_id,
      nombre: estudiante.nombre,
      num_identificacion: estudiante.num_identificacion,
      notas: {} as { [key: string]: any }
    };

    talleres.forEach((taller: { id_taller: string | number; }) => {
      const nota = notas.find((n: { estudiante_id: any; id_taller: string | number; }) =>
        n.estudiante_id === estudiante.estudiante_id &&
        n.id_taller === taller.id_taller
      );

      fila.notas[taller.id_taller] = nota ? nota.nota : '';
    });

    return fila;
  });
}

async cargarDatosNotas(curso: number, asignatura: number) {
  try {
    const data = {
      id_asignatura: asignatura,
      id_curso: curso
    };

    const datos = await this.backendService.vistaNotasDocente(data);
    this.talleres = datos.talleres;
    this.tabla = await this.construirTabla(datos.estudiantes, datos.talleres, datos.notas);
  } catch (error) {
    console.error(error);
  }
}
}
