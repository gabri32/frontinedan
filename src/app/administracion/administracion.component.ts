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
import { FormsModule } from "@angular/forms";
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';




import { ModalAsignarAsignaturasComponent } from './modales/asignaturas/modal-asignar-asignaturas/modal-asignar-asignaturas.component';


import { ModalAsignarGradoComponent } from './modales/dir_grado/modal-asignar-grado/modal-asignar-grado.component';


@Component({
  selector: 'app-administracion',
  imports: [
    CommonModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,  // ✅ Importar checkbox
    MatDividerModule,
    MatCardModule,
    NgxChartsModule,
    FormsModule,
  ],
  templateUrl: './administracion.component.html',
  styleUrl: './administracion.component.css'
})

export class AdministracionComponent implements OnInit {
  
  images:any;
  docentes:any;

  displayedColumns: string[] = ['Numero', 'imagen','Opciones'];
  displayedColumnsdocentes: string[] = ['Identificacion del docente', 'Nombre completo','Sede','Vigencia','Opciones'];


  dataSource = new MatTableDataSource<any>();
  dataSource2 = new MatTableDataSource<any>();

  mostrarTab1 = false;
  mostrarTab2 = false;
  mostrarTab3 = false;
  rol_id = 0;
   //paginadores de la tabla ------------------------
   @ViewChild(MatPaginator) paginator!: MatPaginator;
   @ViewChild(MatSort) sort!: MatSort;
  constructor(private backendService: BackendService, private sanitizer: DomSanitizer,private dialog: MatDialog) { }


  ngOnInit(): void {
    this.verificarPermisos()
    this.getimages()
    this.getprofesores()
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

  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
      this.dataSource2.paginator = this.paginator;
    this.dataSource2.sort = this.sort;
  }
  applyGlobalFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    this.dataSource2.filter = filterValue;
  }
  async getimages() {
    try {
 this.images=await this.backendService.getsliderImages();
 this.dataSource.data = this.images
    } catch (error)
     { console.log(error) }

  }

  async getprofesores(){
    try{
this.docentes=await this.backendService.getprofesores()

this.dataSource2.data=this.docentes
console.log(this.dataSource2.data)
    }catch(error){
console.error("Error traer docentes:", error);
      swal.fire({
        title: "Error",
        text: "Hubo un problema al traer los docentes.",
        icon: "error",
        confirmButtonText: "Aceptar"
      });
    }
  }
  onFileSelected(event: Event, student: any) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      student.selectedFile = fileInput.files[0];
    }
  }
  async uploadImage(student: any) {
    if (!student.selectedFile) {
      alert("Selecciona una imagen primero");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("numero",student.id)
      formData.append("image", student.selectedFile);
  

      const response = await this.backendService.updatesliderImages(formData);

      if (!response.message) {
        console.error("Error al guardar la imagen:", response);
        alert("No se pudo guardar la imagen");
        return;
      }
     await this.getimages()

      swal.fire({
        title: "Imagen guardada",
        text: "La imagen del ha sido actualizada correctamente.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });

    } catch (error) {
      console.error("Error al guardar la imagen:", error);
      swal.fire({
        title: "Error",
        text: "Hubo un problema al guardar la imagen.",
        icon: "error",
        confirmButtonText: "Aceptar"
      });
    }
  }

abrirModalGrado(profesor: any) {
  this.dialog.open(ModalAsignarGradoComponent, {
    width: '3500px',
    data: profesor
  });
}

abrirModalAsignaturas(profesor: any) {
  this.dialog.open(ModalAsignarAsignaturasComponent, {
    width: '1600px',
    data: profesor
  });
}

}
