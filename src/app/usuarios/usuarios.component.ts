import { Component, OnInit, ViewChild } from '@angular/core';
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
import { FormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-usuarios',
  imports: [
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
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatExpansionModule,
  ],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {
  nombre: string = '';
  contrasena: string = '';
  correo: string = '';
  rol_id: number = 0;
  roles: any[] = [];
  num_identificacion: string = '';

  constructor(private backendService: BackendService) { }
  ngOnInit(): void {
    this.getroles();
  }


  async getroles() {
    try {
      const response: any = await this.backendService.getroles();
      if (response && response.length > 0) {
        this.roles = response;
      }
      console.log('Roles obtenidos:', this.roles);
    } catch (error) {
      console.error('Error al obtener los roles:', error);
    }
  }
async guardarUsuario() {
  // Validación de campos vacíos
  if (!this.nombre || !this.contrasena || !this.correo || !this.num_identificacion || !this.rol_id) {
    swal.fire({
      title: "Campos incompletos",
      text: "Por favor, completa todos los campos antes de guardar.",
      icon: "warning",
      confirmButtonText: "Aceptar"
    });
    return;
  }
  try {
    const data = {
      nombre: this.nombre,
      contrasena: this.contrasena,
      correo: this.correo,
      rol_id: this.rol_id,
      num_identificacion: this.num_identificacion
    }
    swal.fire({
      title: 'Cargando',
      text: 'Por favor espera...',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        swal.showLoading();
      }
    });
    const response: any = await this.backendService.createuser({ data })
    swal.close();

    swal.fire({
      title: "Éxito",
      text: "Usuario creado correctamente.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false
    });

  } catch (error) {
    swal.close();
    swal.fire({
      title: "Error",
      text: "Hubo un problema al crear el usuario.",
      icon: "error",
      confirmButtonText: "Aceptar"
    });
  }
}

}