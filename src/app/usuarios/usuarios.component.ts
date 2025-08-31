import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import swal from 'sweetalert2';
import { FormsModule } from "@angular/forms";
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BackendService } from '../backend.service';
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
  // Datos básicos
  nombre: string = '';
  contrasena: string = '';
  correo: string = '';
  rol_id: number = 0;
  num_identificacion: string = '';

  // Datos extra según rol
  edad: number | null = null;
  grado: string = '';
  especialidad: string = '';
  vigencia: boolean = true;
  sede: number | null = null;

  roles: any[] = [];
  sedes: any[] = []; // si tu backend ya expone sedes

  constructor(private backendService: BackendService) { }

  ngOnInit(): void {
    this.getroles();
    this.getSedes();
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

  async getSedes() {
    try {
      const response: any = await this.backendService.getsedes();
      if (response && response.length > 0) {
        this.sedes = response;
      }
    } catch (error) {
      console.error('Error al obtener sedes:', error);
    }
  }

  async guardarUsuario() {
    // Validación básica
    if (!this.nombre || !this.contrasena || !this.correo || !this.num_identificacion || !this.rol_id) {
      swal.fire({
        title: "Campos incompletos",
        text: "Por favor, completa todos los campos básicos antes de guardar.",
        icon: "warning",
        confirmButtonText: "Aceptar"
      });
      return;
    }

    // Construir payload según rol
    const data: any = {
      nombre: this.nombre,
      contrasena: this.contrasena,
      correo: this.correo,
      rol_id: this.rol_id,
      num_identificacion: this.num_identificacion
    };

    if (this.rol_id === 2) { // Estudiante
      if (!this.edad || !this.grado) {
        swal.fire("Atención", "Edad y grado son obligatorios para estudiantes", "warning");
        return;
      }
      data.edad = this.edad;
      data.grado = this.grado;
    }

    if (this.rol_id === 1) { // Profesor
      if (!this.especialidad || !this.sede) {
        swal.fire("Atención", "Especialidad y sede son obligatorios para profesores", "warning");
        return;
      }
      data.especialidad = this.especialidad;
      data.vigencia = this.vigencia;
      data.sede = this.sede;
    }

    // Admin (rol 3) no necesita extra, solo los datos básicos

    try {
      swal.fire({
        title: 'Cargando',
        text: 'Por favor espera...',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          swal.showLoading();
        }
      });

      const response: any = await this.backendService.createuser({ data });

      swal.close();
      swal.fire({
        title: "Éxito",
        text: "Usuario creado correctamente.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });

      // Reset form
      this.nombre = '';
      this.contrasena = '';
      this.correo = '';
      this.num_identificacion = '';
      this.rol_id = 0;
      this.edad = null;
      this.grado = '';
      this.especialidad = '';
      this.vigencia = true;
      this.sede = null;

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
