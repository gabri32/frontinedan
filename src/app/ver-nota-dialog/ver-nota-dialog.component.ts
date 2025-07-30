import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { BackendService } from '../backend.service';
import { MatSelect } from "@angular/material/select";
import { MatOptionModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-ver-nota-dialog',
  templateUrl: './ver-nota-dialog.component.html',
  styleUrl: './ver-nota-dialog.component.css',
  imports: [MatDialogContent, MatDialogActions, MatSelect, MatOptionModule, MatFormFieldModule, MatTableModule, CommonModule]
})
export class VerNotaDialogComponent {

  constructor(private backendService: BackendService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<VerNotaDialogComponent>
  ) { }
  notasFiltradas: any[] = [];
  notas: any;
  periodoSeleccionado: any
  promedio: any
  estudiante:any;
  ngOnInit(): void {
            const usuarioString = sessionStorage.getItem('usuario');
      if (usuarioString) {
      const usuario = JSON.parse(usuarioString);
      this.estudiante = usuario.num_identificacion;
      console.log(usuario.num_identificacion);
    } else {
      console.log('No usuario found in sessionStorage');
    }
    console.log(this.data)
    this.backendService.notasPorEstudiantes(this.data.id_asignatura, this.estudiante).subscribe({
      next: (res) => {
        console.log('Notas del estudiante:', res.notas);
        this.notas = res.notas
      },
      error: (err) => {
        console.error('Error al obtener notas:', err);
      }
    });


  }

  filtrarPorPeriodo(): void {
    this.notasFiltradas = this.notas.filter(
      (nota: any) => nota.periodo === this.periodoSeleccionado
    );
    const total = this.notasFiltradas.reduce((sum: any, nota: { nota: any; }) => sum + (nota.nota || 0), 0);
    this.promedio = this.notasFiltradas.length > 0
      ? total / this.notasFiltradas.length
      : 0;
  }
}
