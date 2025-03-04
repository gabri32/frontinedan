import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import swal from 'sweetalert2';
import { BackendService } from '../backend.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-inventario',
  standalone: true,
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
  ],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {
  lspropierties: any[] = []; // Lista de bienes a enviar
  types: any[] = []; // Tipos de bienes obtenidos del backend

  constructor(private backendService: BackendService) {}
   detalle:any;
  ngOnInit(): void {
    this.getbienes(); // Obtener tipos de bienes al iniciar
    this.addToList(); // Agregar un bien vacío al inicio
  }

  // Obtener los tipos de bienes desde el backend
  async getbienes() {
    try {
      const types = await this.backendService.gettypes();
      this.types=types.types
      console.log("Tipos de bienes:", this.types);
    } catch (error) {
      console.error("Error al obtener bienes:", error);
    }
  }

  // Agregar un nuevo bien a la lista
  addToList() {
    this.lspropierties.push({ detalle: '', costo: null, tipo: '' });
  }

  // Eliminar un bien de la lista
  removeProperty(index: number) {
    this.lspropierties.splice(index, 1);
  }

  // Enviar los bienes al backend
  async createproperty() {
    try {
      // Validar que los campos no estén vacíos
      if (this.lspropierties.some(p => !p.detalle || !p.costo || !p.tipo)) {
        swal.fire({
          title: "Error",
          text: "Todos los campos son obligatorios.",
          icon: "error"
        });
        return;
      }

      // Confirmación con SweetAlert
      const result = await swal.fire({
        title: "¿Estás seguro?",
        text: "Se enviarán los bienes al inventario.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, guardar",
        cancelButtonText: "Cancelar"
      });

      if (!result.isConfirmed) return;

      // Enviar datos al backend
      await this.backendService.createproperty(this.lspropierties);

      // Mostrar mensaje de éxito
      swal.fire({
        title: "Éxito",
        text: "Bienes creados con éxito.",
        icon: "success",
        timer: 1000,
        showConfirmButton: false
      });

      // Limpiar lista después de enviar
      this.lspropierties = [];
      this.addToList(); // Agregar un bien vacío después de enviar

    } catch (error) {
      console.error("Error al crear bienes:", error);
      swal.fire({
        title: "Error",
        text: "Hubo un problema al enviar los bienes.",
        icon: "error"
      });
    }
  }
}
