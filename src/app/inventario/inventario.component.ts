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
  propertisC: any;
  propertisD: any;
  lenghtC: number | undefined;
  lenghtD: number | undefined;
  displayedColumns: string[] = ['Identificador del bien', 'Detalle del bien', 'Valor', 'Tipo', 'Cantidad', 'Opciones'];
  dataSource = new MatTableDataSource<any>();
  dataSource2 = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private backendService: BackendService) { }

  detalle: any;
  //permisos
  mostrarTab1 = false;
  mostrarTab2 = false;
  mostrarTab3 = false;
rol_id=0;
  ngOnInit(): void {
    this.getbienes(); // Obtener tipos de bienes al iniciar
    this.addToList(); // Agregar un bien vacío al inicio
    this.getPropertisCD();
    this.verificarPermisos();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource2.paginator = this.paginator;
    this.dataSource2.sort = this.sort;
  }
  verificarPermisos() {
    const usuarioString = sessionStorage.getItem('usuario');
    const usuario = usuarioString ? JSON.parse(usuarioString) : null;
    this.rol_id = usuario?.rol_id ?? null;

    // Configura la visibilidad de tabs según el rol
    if (this.rol_id === 1) {
      this.mostrarTab1 = true;
    }
    if (this.rol_id === 2) {
      this.mostrarTab2 = true;
    }
    if (this.rol_id === 3) {
      this.mostrarTab3 = true;
    }
    console.log(this.rol_id)
  }
  /**
   * Obtiene los tipos de bienes desde el backend.
   * Llama a la función del servicio y almacena la respuesta en `types`.
   */
  async getbienes() {
    try {
      const types = await this.backendService.gettypes();
      this.types = types.types;
    } catch (error) {
      console.error("Error al obtener bienes:", error);
    }
  }

  /**
   * Agrega un nuevo bien vacío a la lista `lspropierties`.
   */
  addToList() {
    this.lspropierties.push({ detalle: '', costo: null, tipo: '', amount: 0 });
  }

  /**
   * Elimina un bien de la lista en base a su índice.
   * @param index Índice del bien a eliminar en `lspropierties`.
   */
  removeProperty(index: number) {
    this.lspropierties.splice(index, 1);
  }

  /**
   * Envía los bienes ingresados al backend después de validarlos.
   * Muestra mensajes de error si hay campos vacíos.
   * Usa SweetAlert para confirmar la acción antes de enviar.
   */
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
      await this.getPropertisCD();
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
  applyGlobalFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    this.dataSource2.filter = filterValue;
  }
  /**
   * Obtiene las propiedades C y D desde el backend.
   * Almacena los datos en `propertisC` y `propertisD`.
   */
  async getPropertisCD() {
    try {
      this.propertisC = await this.backendService.getPropertiesC();
      this.lenghtC = this.propertisC.length
      this.dataSource.data = this.propertisC.map((c: any) => ({ ...c }));
      this.propertisD = await this.backendService.getPropertiesD();
      this.lenghtD = this.propertisD.length
      this.dataSource2.data = this.propertisD.map((c: any) => ({ ...c }));

      
    } catch (error) {
      console.log("Error al obtener propiedades C y D:", error);
    }
  }
  async editmount(t: any) {
    console.log(t)
  }


  async deleteProperties(item: {}) {
    try {
      const result = await swal.fire({
        title: "¿Estás seguro?",
        text: "Se eliminaran los datos del bien.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, guardar",
        cancelButtonText: "Cancelar"
      });

      if (!result.isConfirmed) return;
      const daleted = await this.backendService.deletePropierties(item)
      await this.getPropertisCD();
      swal.fire({
        title: "Éxito",
        text: " Éxito.",
        icon: "success",
        timer: 1000,
        showConfirmButton: false
      });
    } catch (error) {
      console.log(error)
      swal.fire({
        title: "Error",
        text: "Hubo un problema al enviar los bienes.",
        icon: "error"
      });
    }

  }
  async updateProperties(item: {}) {
    try {
      const result = await swal.fire({
        title: "¿Estás seguro?",
        text: "Se actualizaran los datos del bien.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, guardar",
        cancelButtonText: "Cancelar"
      });

      if (!result.isConfirmed) return;
      const updated = await this.backendService.updatePropierties(item)
      await this.getPropertisCD();
      swal.fire({
        title: "Éxito",
        text: " Éxito.",
        icon: "success",
        timer: 1000,
        showConfirmButton: false
      });
    } catch (error) {
      console.log(error)
      swal.fire({
        title: "Error",
        text: "Hubo un problema al enviar los bienes.",
        icon: "error"
      });
    }
  }


}
