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

  constructor(private route: ActivatedRoute, private backendService: BackendService) {}

  ngOnInit(): void {
    this.tallerId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarRespuestas();
  }

  cargarRespuestas(): void {
    this.backendService.getRespuestasPorTaller(this.tallerId).subscribe({
      next: (res) => {
        this.respuestas = res;
        console.log(this.respuestas)
        if (res.length > 0) this.taller = res[0].Taller;
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar las respuestas', 'error');
      }
    });
  }

  getPdfUrl(blob: any): string {
    const blobData = new Blob([new Uint8Array(blob.data)], { type: 'application/pdf' });
    return URL.createObjectURL(blobData);
  }

  guardarCalificacion(respuesta: any): void {
    const payload = {
      estudiante_id: respuesta.num_identificacion,
      taller_id: this.tallerId,
      nota: respuesta.nota,
      descripcion: respuesta.observacion || ''
    };

    this.backendService.calificarTaller(payload).subscribe({
      next: () => Swal.fire('Guardado', 'Calificación registrada con éxito', 'success'),
      error: () => Swal.fire('Error', 'No se pudo guardar la calificación', 'error')
    });
  }
}
