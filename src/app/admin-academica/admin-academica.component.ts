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
  selector: 'app-administracion',
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
  templateUrl: './admin-academica.component.html',
  styleUrls: ['./admin-academica.component.css']
})

export class AdminAcademicaComponent implements OnInit {

  images: any;
  docentes: any;
  cursoForm: FormGroup;
  cursos: any[] = []
  sedes: any[] = []
  displayedColumns: string[] = ['Numero', 'imagen', 'Opciones'];
  displayedColumns2: string[] = ['Detalle del evento', 'url', 'imagen', 'Opciones'];




  dataSource = new MatTableDataSource<any>();
  dataSource2 = new MatTableDataSource<any>();
  dataSource3 = new MatTableDataSource<any>();
  mostrarTab1 = false;
  mostrarTab2 = false;
  mostrarTab3 = false;
  rol_id = 0;
  //paginadores de la tabla ------------------------
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
@ViewChild('paginatorLogin') paginatorLogin!: MatPaginator;

  constructor(
    private backendService: BackendService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private fb: FormBuilder) {
    this.cursoForm = this.fb.group({
      nombre: ['', Validators.required],
      grado: ['', Validators.required],
      cantidad: ['', [Validators.required, Validators.min(1)]],
      sede: ['', Validators.required]
    });
  }
grupoEstudiantes: any[] = [];

  ngOnInit(): void {
    this.verificarPermisos()
    this.getimages()
    this.getSedes()
 this.getHeaders()
  }

async getHeaders() {
  try {
this.dataSource2.data = await this.backendService.getheaders();
console.log( "datoooooooooooosd",this.dataSource2.data)

  }catch (error) {
    console.error("Error al cargar los headers:", error);
    swal.fire({
      title: "Error",
      text: "Hubo un problema al cargar los headers.",
      icon: "error",
      confirmButtonText: "Aceptar"
    });
  }
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
  this.dataSource.paginator = this.paginatorLogin;

  this.dataSource.sort = this.sort;
  this.dataSource2.sort = this.sort;
}

  applyGlobalFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    this.dataSource2.filter = filterValue;
    this.dataSource3.filter = filterValue;
  }
  async getimages() {
    try {
      this.images = await this.backendService.getsliderImages();
      this.dataSource.data = this.images
    } catch (error) { console.log(error) }

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
      formData.append("numero", student.id)
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



  async getasignaturas() {
    try {
      const data = await this.backendService.getasignaturas()
      console.log(data)
      this.cursos = data
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
  async getSedes() {
    try {
      const data = await this.backendService.getsedes()
      console.log(data)
      this.sedes = data
    }
    catch (error) {
      console.error("Error al cargar sedes:", error);
      swal.fire({
        title: "Error",
        text: "Hubo un problema.",
        icon: "error",
        confirmButtonText: "Aceptar"
      });
    }
  }
async crearCursos() {
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

    const curso = await this.backendService.createCurses();

    swal.close(); // Cierra el loading antes de mostrar el éxito

    swal.fire({
      title: "Éxito",
      text: "Curso creado correctamente.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false
    });

    this.cursoForm.reset();
  } catch (error) {
    swal.close(); // Cierra el loading si hay error
    swal.fire({
      title: "Error",
      text: "Hubo un problema al crear el curso.",
      icon: "error",
      confirmButtonText: "Aceptar"
    });
  }
}

  async getcursos() {
    try {

      const grados = await this.backendService.getcursos()
      this.dataSource3.data = grados
    } catch (error) {
      console.error("Error traer grados:", error);
      swal.fire({
        title: "Error",
        text: "Hubo un problema al traer los grados.",
        icon: "error",
        confirmButtonText: "Aceptar"
      });
    }
  }



}


