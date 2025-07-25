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
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalle-taller-component',
  imports: [ReactiveFormsModule,
    CommonModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatDividerModule,
    MatCardModule,
    NgxChartsModule,
    FormsModule,],
  templateUrl: './detalle-taller-component.component.html',
  styleUrl: './detalle-taller-component.component.css'
})
export class DetalleTallerComponentComponent implements OnInit {

  constructor(private backendService: BackendService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute) { }
  formRespuesta!: FormGroup;
  archivoSeleccionado: File | null = null;
  archivoError: string = '';
  tallerSeleccionado: any = {};
  usuario: any = {};
  pendiente: any;
  ngOnInit(): void {
    this.usuario = JSON.parse(sessionStorage.getItem('usuario') || '{}');
    const num_identificacion = this.usuario.num_identificacion

    this.formRespuesta = this.fb.group({
      observaciones: ['']
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? parseInt(idParam, 10) : null;

    if (id) {
      this.detalles(id);
      this.getTallerPendiente(id, num_identificacion)
    } else {
      alertify.error('ID de taller inválido');
      this.router.navigate(['/layout/estudiantes']);
    }
  }

  // Validación y carga de archivo
  onFileSelected(event: Event) {
    this.archivoError = '';
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      if (file.type !== 'application/pdf') {
        this.archivoError = 'Solo se permite archivo PDF.';
        this.archivoSeleccionado = null;
      } else if (file.size > 2 * 1024 * 1024) {
        this.archivoError = 'El archivo supera los 2MB.';
        this.archivoSeleccionado = null;
      } else {
        this.archivoSeleccionado = file;
      }
    }
  }

  // Confirmar y enviar
  async confirmarEnvio() {
    if (!this.archivoSeleccionado) {
      this.archivoError = 'Debe seleccionar un archivo válido.';
      return;
    }

    const confirmacion = await swal.fire({
      title: '¿Está seguro?',
      text: 'Este taller sera enviado.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'Cancelar'
    });

    if (confirmacion.isConfirmed) {
      const usuario = JSON.parse(sessionStorage.getItem('usuario') || '{}');

      const formData = new FormData();
      formData.append('id_taller', this.tallerSeleccionado.id_taller);
      formData.append('archivo_pdf', this.archivoSeleccionado);
      formData.append('observaciones', this.formRespuesta.value.observaciones || '');
      formData.append('num_identificacion', usuario.num_identificacion || '');

      try {
        await this.backendService.TallerPendiente(formData);

        await swal.fire({
          icon: 'success',
          title: '¡Taller enviado!',
          text: 'La respuesta fue registrada correctamente.',
          confirmButtonText: 'Aceptar'
        });

        this.router.navigate(['/layout/estudiantes']);
      } catch (error) {
        swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un problema al enviar el taller. Intente nuevamente.',
          confirmButtonText: 'Cerrar'
        });
      }
    }
  }

  async detalles(id: number) {
    try {
      const detalle = await this.backendService.getdetailTaller(id);
      this.tallerSeleccionado = detalle;
      console.log(detalle)
    } catch (error) {
      alertify.error('No se pudo cargar el taller');
      this.router.navigate(['/layout/estudiantes']);
    }
  }
  async getTallerPendiente(id: number, num_identificacion: number) {
    try {
      const id_taller = id
      const tienePendiente = await this.backendService.getTallerPendiente(id_taller, num_identificacion)
      this.pendiente = tienePendiente.respuesta
      console.log(this.pendiente)
    } catch (error) {
      alertify.error('No se pudo cargar el taller');
    }
  }

}