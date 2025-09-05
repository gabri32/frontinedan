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
  nombre: string = '';
  contrasena: string = '';
  correo: string = '';
  rol_id: number = 0;
  num_identificacion: string = '';
  edad: number | null = null;
  grado: string = '';
  especialidad: string = '';
  vigencia: boolean = true;
  sede: number | null = null;

  roles: any[] = [];
  sedes: any[] = [];
  usuarios: any[] = [];

  editando: boolean = false;
  usuarioEditandoId: number | null = null;

  constructor(private backendService: BackendService) {}

  ngOnInit(): void {
    this.getroles();
    this.getSedes();
    this.traerUsuarios();
  }

  async getroles() {
    try {
      const response: any = await this.backendService.getroles();
      if (response && response.length > 0) {
        this.roles = response;
      }
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

  async traerUsuarios() {
    try {
      const response = await this.backendService.getusers();
      this.usuarios = response;
    } catch (error) {
      console.error('Error al traer usuarios:', error);
    }
  }

  async guardarUsuario() {
    if (!this.nombre || !this.contrasena || !this.correo || !this.num_identificacion || !this.rol_id) {
      swal.fire("Campos incompletos", "Completa todos los campos requeridos", "warning");
      return;
    }

    const data: any = {
      nombre: this.nombre,
      contrasena: this.contrasena,
      correo: this.correo,
      rol_id: Number(this.rol_id),
      num_identificacion: this.num_identificacion,
      edad: this.edad,
      grado: this.grado,
      especialidad: this.especialidad,
      sede: this.sede
    };

    try {
      await this.backendService.createuser(data);
      await this.traerUsuarios();
      swal.fire("Éxito", "Usuario creado correctamente.", "success");
      this.limpiarFormulario();
    } catch (error) {
      swal.fire("Error", "No se pudo crear el usuario.", "error");
    }
  }

  editarUsuario(user: any) {
    this.nombre = user.nombre;
    this.correo = user.correo;
    this.rol_id = user.rol_id;
    this.num_identificacion = user.num_identificacion;
    this.vigencia = user.vigencia ?? true;
    this.sede = user.sede ?? null;
    this.edad = user.edad ?? null;
    this.grado = user.grado ?? '';
    this.especialidad = user.especialidad ?? '';
    this.editando = true;
    this.usuarioEditandoId = user.id;
  }

  async actualizarUsuario() {
    if (!this.usuarioEditandoId) return;

    const payload = {
      nombre: this.nombre,
      correo: this.correo,
      rol_id: this.rol_id,
      num_identificacion: this.num_identificacion,
      vigencia: this.vigencia,
      sede: this.sede,
      edad: this.edad,
      grado: this.grado,
      especialidad: this.especialidad
    };

    try {
      await this.backendService.actualizarUsuario(this.usuarioEditandoId, payload);
      await this.traerUsuarios();
      this.cancelarEdicion();
      swal.fire("Actualizado", "Usuario actualizado correctamente", "success");
    } catch (error) {
      swal.fire("Error", "Error al actualizar usuario", "error");
    }
  }

  cancelarEdicion() {
    this.editando = false;
    this.usuarioEditandoId = null;
    this.limpiarFormulario();
  }

  limpiarFormulario() {
    this.nombre = '';
    this.contrasena = '';
    this.correo = '';
    this.rol_id = 0;
    this.num_identificacion = '';
    this.edad = null;
    this.grado = '';
    this.especialidad = '';
    this.vigencia = true;
    this.sede = null;
  }

  async eliminarUsuario(id: number) {
    const confirm = await swal.fire({
      title: '¿Eliminar usuario?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (confirm.isConfirmed) {
      try {
        await this.backendService.eliminarUsuario(id);
        this.traerUsuarios();
        swal.fire("Eliminado", "Usuario eliminado correctamente", "success");
      } catch (error) {
        swal.fire("Error", "No se pudo eliminar el usuario", "error");
      }
    }
  }
}
