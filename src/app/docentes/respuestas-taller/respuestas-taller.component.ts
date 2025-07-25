import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { BackendService } from '../../backend.service';


@Component({
  selector: 'app-respuestas-taller',
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
