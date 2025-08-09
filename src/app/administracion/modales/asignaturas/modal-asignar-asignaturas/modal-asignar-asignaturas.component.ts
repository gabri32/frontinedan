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
import { FormsModule,FormBuilder, FormGroup, Validators  } from "@angular/forms";
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-modal-asignar-asignaturas',
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
       MatTooltipModule
  ],
  templateUrl: './modal-asignar-asignaturas.component.html',
  styleUrl: './modal-asignar-asignaturas.component.css'
})
export class ModalAsignarAsignaturasComponent   implements OnInit{


cursos:any[]=[]
 filtro: string = '';
  paginaActual: number = 0;
  itemsPorPagina: number = 5;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
   @ViewChild(MatSort) sort!: MatSort;
  constructor(@Inject(MAT_DIALOG_DATA) public profesor: any,
    private backendService: BackendService, 
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
  
  }

    ngOnInit(): void {
    this.getasignaturas()

    }
buscarCurso(event: Event): void {
  const value = (event.target as HTMLInputElement).value;
  this.filtro = value.trim().toLowerCase();
  this.paginaActual = 0;
}
  get cursosFiltrados(): any[] {
    if (!this.filtro) return this.cursos;
    return this.cursos.filter(curso =>
      curso.nombre.toLowerCase().includes(this.filtro)
    );
  }

  // 👉 Cálculo de páginas
  get paginasTotales(): number {
    return Math.ceil(this.cursosFiltrados.length / this.itemsPorPagina);
  }

  // 👉 Cursos que se muestran en la página actual
  cursosPaginados(): any[] {
    const inicio = this.paginaActual * this.itemsPorPagina;
    return this.cursosFiltrados.slice(inicio, inicio + this.itemsPorPagina);
  }


async getasignaturas(){
  try {
     const data = await this.backendService.getasignaturas()
     console.log(data)
     this.cursos=data
  } catch (error) {
       console.error("Error al cargar asignaturas:", error);
      swal.fire({
        title: "Error",
        text: "Hubo un problema.",
        icon: "error",
        confirmButtonText: "Aceptar"
      });
    }
}
async asignarDocente(asig:any){
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
            console.log(asig)
      const id_p=this.profesor.id_profesor
      const idc=asig.id_asignatura
      const data={
        profesor_id:this.profesor.id_profesor
      
      }
        const updated=await this.backendService.aditasignatura(idc,data)
        this.getasignaturas()
           swal.fire({
                 title: "Exito",
                 text: "El curso ha sido actualizado correctamente.",
                 icon: "success",
                 timer: 1000,
                 showConfirmButton: false
               });
} catch (error) {
     console.log(error)
        swal.fire({
          title: "Error",
          text: "Hubo un problema al editar el curso.",
          icon: "error",
          confirmButtonText: "Aceptar"
        });
}
}
async deleteDocente(asign:any){
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
            console.log(asign)
      const id_p=this.profesor.id_profesor
      const idc=asign.id_asignatura
      const data={
        profesor_id:this.profesor.id_profesor
      
      }
          const updated=await this.backendService.deletePropiertieasig(idc,data)
        this.getasignaturas()
         swal.fire({
                 title: "Exito",
                 text: "El curso ha sido actualizado correctamente.",
                 icon: "success",
                 timer: 1000,
                 showConfirmButton: false
               });
} catch (error) {
     console.log(error)
        swal.fire({
          title: "Error",
          text: "Hubo un problema al editar el curso.",
          icon: "error",
          confirmButtonText: "Aceptar"
        });
}
}
paginacionPorCurso: { [idCurso: number]: { pagina: number } } = {};
busqueda: string = '';

filtrarAsignaturas(event: any) {
  this.busqueda = event.target.value.trim().toLowerCase();
}
  }
