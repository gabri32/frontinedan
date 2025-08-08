import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { BackendService } from '../../backend.service';
import { CommonModule } from '@angular/common';
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
  selector: 'app-respuestas-taller',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatDividerModule,
    MatCardModule,
    NgxChartsModule,
    FormsModule,
  ],
  templateUrl: './respuestas-taller.component.html'
})
export class RespuestasTallerComponent implements OnInit {
  tallerId!: number;
  respuestas: any[] = [];
  taller: any = null;
  nota: number | undefined;
  observacion: string | undefined;
  constructor(private route: ActivatedRoute, private backendService: BackendService, private router: Router) { }

  ngOnInit(): void {
    this.tallerId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarRespuestas();
  }

  cargarRespuestas(): void {
    // Mostrar loading
    Swal.fire({
      title: 'Cargando respuestas...',
      text: 'Por favor espere un momento',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.backendService.getRespuestasPorTaller(this.tallerId).subscribe({
      next: (res) => {
        this.respuestas = res.map((r: { doc: any; }) => ({
          ...r,
          pdfUrl: r.doc ? this.getPdfUrl(r.doc) : null
        }));

        console.log(this.respuestas);
        if (res.length > 0) this.taller = res[0].id_taller;

        Swal.close(); // Cerrar loading si todo salió bien
      },
      error: () => {
        Swal.close(); // Cerrar loading también si hay error
        Swal.fire('Error', 'No se pudieron cargar las respuestas', 'error');
      }
    });
  }


  getPdfUrl(blob: any): string {
    const blobData = new Blob([new Uint8Array(blob.data)], { type: 'application/pdf' });
    return URL.createObjectURL(blobData);
  }

guardarCalificacion(respuesta: any): void {
  // Validar que la nota esté entre 0 y 5
  if (respuesta.nota === undefined || respuesta.nota < 0 || respuesta.nota > 5) {
    Swal.fire('Nota inválida', 'La nota debe estar entre 0 y 5', 'warning');
    return;
  }

  if (respuesta.descripcion === null || respuesta.descripcion.trim() === '') {
    Swal.fire('Inválida', 'No puede ir vacía la observación', 'warning');
    return;
  }

  Swal.fire({
    title: '¿Guardar calificación?',
    text: '¿Estás seguro de que deseas registrar esta calificación?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, guardar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      // Mostrar loading mientras se guarda
      Swal.fire({
        title: 'Guardando...',
        text: 'Por favor espera mientras se registra la calificación',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const payload = {
        num_estudiantes: respuesta.num_identificacion,
        id_taller: respuesta.id_pendientes,
        nota: respuesta.nota,
        descripcion: respuesta.descripcion || ''
      };

      this.backendService.calificarTaller(payload).subscribe({
        next: () => {
          Swal.fire('Guardado', 'Calificación registrada con éxito', 'success');
        },
        error: () => {
          Swal.fire('Error', 'No se pudo guardar la calificación', 'error');
        }
      });
    }
  });
}


  volver() {
    this.router.navigate(['/layout/profesores']);
  }
}
