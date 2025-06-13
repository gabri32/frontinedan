import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableDataSource } from '@angular/material/table';
import { BackendService } from '../../../../backend.service';
import { MatDividerModule } from '@angular/material/divider';
import * as alertify from 'alertifyjs';
import { MatCardModule } from '@angular/material/card';
import swal from 'sweetalert2';
import { FormsModule } from "@angular/forms";
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-modal-asignar-grado',
  imports: [  CommonModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,  // ✅ Importar checkbox
    MatDividerModule,
    MatCardModule,
    NgxChartsModule,
    FormsModule,
  MatDialogModule],
  templateUrl: './modal-asignar-grado.component.html',
  styleUrl: './modal-asignar-grado.component.css'
})
export class ModalAsignarGradoComponent  implements OnInit  {
  displayedColumns: string[] = ['Grado','Curso', 'Director de grado','Sede','Opciones'];

  dataSource = new MatTableDataSource<any>();

   //paginadores de la tabla ------------------------
   @ViewChild(MatPaginator) paginator!: MatPaginator;
   @ViewChild(MatSort) sort!: MatSort;
  constructor(  @Inject(MAT_DIALOG_DATA) public profesor: any,private backendService: BackendService, private sanitizer: DomSanitizer,private dialog: MatDialog) { }
  ngOnInit(): void {
  
this.getcursos()
  }
    ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  
  }
  applyGlobalFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }
async getcursos(){
  try{

const grados=await this.backendService.getcursos()
this.dataSource.data=grados
  }catch(error){
console.error("Error traer grados:", error);
      swal.fire({
        title: "Error",
        text: "Hubo un problema al traer los grados.",
        icon: "error",
        confirmButtonText: "Aceptar"
      });
  }
}

async asignarSede_Director(event:any){
  try{
     swal.fire({
            title: 'Cargando',
            text: 'Por favor espera...',
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
              swal.showLoading();
            }
          });
    const id_p=this.profesor.id_profesor
    const idc=event.id
    const data={
      profesor_id:this.profesor.id_profesor
    
    }
     const updated=await this.backendService.editCurso(idc,data)
  this.getcursos()
     swal.fire({
         title: "Exito",
         text: "El curso ha sido actualizado correctamente.",
         icon: "success",
         timer: 1000,
         showConfirmButton: false
       });
    }
  catch(error){
    console.log(error)
      swal.fire({
        title: "Error",
        text: "Hubo un problema al editar el curso.",
        icon: "error",
        confirmButtonText: "Aceptar"
      });
  }
}
async deleteSede_Director(event:any){
  try{
     swal.fire({
            title: 'Cargando',
            text: 'Por favor espera...',
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
              swal.showLoading();
            }
          });
    const id_p=this.profesor.id_profesor
    const idc=event.id
    const data={
      profesor_id:null
    
    }
     const updated=await this.backendService.deletePropiertiescurso(idc,data)
  this.getcursos()
     swal.fire({
         title: "Exito",
         text: "El curso ha sido actualizado correctamente.",
         icon: "success",
         timer: 1000,
         showConfirmButton: false
       });
    }
  catch(error){
    console.log(error)
      swal.fire({
        title: "Error",
        text: "Hubo un problema al editar el curso.",
        icon: "error",
        confirmButtonText: "Aceptar"
      });
  }
}
}
