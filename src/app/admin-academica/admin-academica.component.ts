import { Component, OnInit, ViewChild ,TemplateRef } from '@angular/core';
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
import { MatDialog, MatDialogContent } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
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
    MatDialogContent,
    MatTooltipModule
],
  templateUrl: './admin-academica.component.html',
  styleUrls: ['./admin-academica.component.css']
})

export class AdminAcademicaComponent implements OnInit {

  images: any;
  banner:any;
  docentes: any;
  headerForm: FormGroup;
  eventosForm: FormGroup;
  cursos: any[] = []
  sedes: any[] = []
  displayedColumns: string[] = ['Numero', 'imagen', 'Opciones'];
  displayedColumns2: string[] = ['Detalle del evento', 'url', 'imagen','Estado','Opciones'];
    displayedColumns3: string[] = ['Titulo','Detalle del evento', 'imagen','Estado', 'Opciones'];
 selectedFile!: File | null;
previewImage: string | ArrayBuffer | null = null;
cargandoDatos=true;

  dataSource = new MatTableDataSource<any>();
  dataSourceB=new MatTableDataSource<any>();
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
  @ViewChild('dialogHeader') dialogTemplate!: TemplateRef<any>;
   @ViewChild('dialogEventos') dialogTemplate1!: TemplateRef<any>;
  constructor(
    private backendService: BackendService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.headerForm = this.fb.group({
      descripcion: ['', Validators.required],
      url: ['', Validators.required],
    });
      this.eventosForm = this.fb.group({
      detalle: ['', Validators.required],
      titulo: ['', Validators.required],
    });
  }
  grupoEstudiantes: any[] = [];

  ngOnInit(): void {
  this.cargarDatos()
  }
 private async cargarDatos(): Promise<void> {
    swal.showLoading();
    
    try {
    await  this.verificarPermisos()
   await this.getimages()
  await  this.getBannerimages()
   await this.getHeaders()
   await this.getEventos()
      this.cargandoDatos = false;
      
    } catch (error) {
      this.cargandoDatos = false;
    } finally {
      swal.close();
    }
  }

  async getHeaders() {
    try {
      this.dataSource2.data = await this.backendService.getheaders();
        await this.dataSource2.data.forEach(element => {
          element.activo="Activo"
element.enable==true?element.activo=="Activo":element.activo=="Deshabilitado"
        })
        
      
    } catch (error) {
      console.error("Error al cargar los headers:", error);
      swal.fire({
        title: "Error",
        text: "Hubo un problema al cargar los headers.",
        icon: "error",
        confirmButtonText: "Aceptar"
      });
    }
  }
  async getEventos() {
    try {
      this.dataSource3.data = await this.backendService.getLandingEventos();
       await this.dataSource3.data.forEach(element => {
          element.activo="Activo"
element.enable==true?element.activo="Activo":element.activo="Deshabilitado"
        })
        console.log(this.dataSource3.data)
    } catch (error) {
      console.error("Error al cargar los eventos:", error);
      swal.fire({
        title: "Error",
        text: "Hubo un problema al cargar los eventos.",
        icon: "error",
        confirmButtonText: "Aceptar"
      });
    }
  }
  openDialog() {
    this.dialog.open(this.dialogTemplate);
  }
  openDialogE() {
    this.dialog.open(this.dialogTemplate1);
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
 async getimages(): Promise<void> {
  try {
    this.images = await this.backendService.getsliderImages();

    // Verificar si hay menos de 3 imágenes y rellenar con objetos vacíos
    const cantidadFaltante = 3 - this.images.length;

    for (let i = 0; i < cantidadFaltante; i++) {
      this.images.push({
        id: 'N/A',
        foto: '',
        imagen: ''
      });
    }

    // Asignar al dataSource para mostrar en la tabla o componente correspondiente
    this.dataSource.data = this.images;

  } catch (error) {
    console.log('Error al obtener las imágenes:', error);
  }
}
 async getBannerimages(): Promise<void> {
  try {
    this.banner = await this.backendService.getLandingImages();

    // Verificar si hay menos de 3 imágenes y rellenar con objetos vacíos
    const cantidadFaltante = 3 - this.banner.length;

    for (let i = 0; i < cantidadFaltante; i++) {
      this.banner.push({
        id: 'N/A',
        foto: '',
        imagen: ''
      });
    }

  
    this.dataSourceB.data = this.banner;

  } catch (error) {
    console.log('Error al obtener las imágenes:', error);
  }
}


  onFileSelected(event: Event, student: any) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      student.selectedFile = fileInput.files[0];
      console.log(student)
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



onFileChange(event: any): void {
  const file = event.target.files[0];

  if (file) {
    const maxSizeMB = 1.5;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (file.size > maxSizeBytes) {
      swal.fire({
        title: "Imagen demasiado grande",
        text: `La imagen no debe superar los ${maxSizeMB}MB.`,
        icon: "warning",
        confirmButtonText: "Aceptar"
      });
      this.previewImage = null;
      this.selectedFile = null;
      return;
    }

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.previewImage = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}

async crearCard() {
 

if (this.headerForm.valid && this.previewImage) {
    const formData = new FormData();
    formData.append('descripcion', this.headerForm.value.descripcion);
    formData.append('url', this.headerForm.value.url);
    formData.append('image', this.selectedFile as Blob);

    try {
      swal.fire({
  title: 'Cargando...',
  allowOutsideClick: false,
  didOpen: () => {
    swal.showLoading();
  }
});


      const response = await this.backendService.insertHeaders(formData);
      
      if (response.message) {
        swal.close();
        swal.fire({
          title: "Header creado",
          text: "El header ha sido creado correctamente.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        });
        this.dialog.closeAll();
        this.getHeaders();
        this.previewImage=''
      } else {
        console.error("Error al crear el header:", response);
        swal.fire({
          title: "Error",
          text: "Hubo un problema al crear el header.",
          icon: "error",
          confirmButtonText: "Aceptar"
        });
      }
    } catch (error) {
      console.error("Error al crear el header:", error);
      swal.fire({
        title: "Error",
        text: "Hubo un problema al crear el header.",
        icon: "error",
        confirmButtonText: "Aceptar"
      });
    }
  }
  else {
    swal.fire({
      title: "Campos incompletos",
      text: "Por favor, completa todos los campos y selecciona una imagen.",
      icon: "warning",
      confirmButtonText: "Aceptar"
    });
  }
}
async eliminarHeader(id: number) {
    try {
      swal.showLoading();
      const response = await this.backendService.deleteHeader(id);

      if (response.message) {
      swal.close();

        swal.fire({
          title: "Documento actualizado",
          text: "El header ha sido actualizado correctamente.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        });
        this.getHeaders();
      } else {
        console.error("Error al eliminar el header:", response);
        swal.fire({
          title: "Error",
          text: "Hubo un problema al eliminar el header.",
          icon: "error",
          confirmButtonText: "Aceptar"
        });
      }
    } catch (error) {
      console.error("Error al eliminar el header:", error);
      swal.fire({
        title: "Error",
        text: "Hubo un problema al eliminar el header.",
        icon: "error",
        confirmButtonText: "Aceptar"
      });
    }
  }
  async deteleEventos(id: number) {
    try {
      const response = await this.backendService.deteleEventos(id);
      if (response.message) {
        swal.fire({
          title: "Evento actualizado",
          text: "El evento ha sido actualizado correctamente.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        });
        this.getEventos();
      } else {
        console.error("Error al eliminar el evento:", response);
        swal.fire({
          title: "Error",
          text: "Hubo un problema al eliminar el evento.",
          icon: "error",
          confirmButtonText: "Aceptar"
        });
      }
    } catch (error) {
      console.error("Error al eliminar el header:", error);
      swal.fire({
        title: "Error",
        text: "Hubo un problema al eliminar el header.",
        icon: "error",
        confirmButtonText: "Aceptar"
      });
    }
  }

async crearEvento() {
if (this.eventosForm.valid && this.previewImage) {
    const formData = new FormData();
    formData.append('titulo',this.eventosForm.value.titulo)
    formData.append('detalle', this.eventosForm.value.detalle);
    formData.append('imagen', this.selectedFile as Blob);
swal.fire({
  title: 'Cargando...',
  allowOutsideClick: false,
  didOpen: () => {
    swal.showLoading();
  }
});

    try {
      const response = await this.backendService.registerEventos(formData);
      if (response.message) {
        swal.close
        swal.fire({
          title: "Header creado",
          text: "El header ha sido creado correctamente.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        });
        this.dialog.closeAll();
        this.getEventos()
         this.previewImage=''
      } else {
        console.error("Error al crear el header:", response);
        swal.fire({
          title: "Error",
          text: "Hubo un problema al crear el header.",
          icon: "error",
          confirmButtonText: "Aceptar"
        });
      }
    } catch (error) {
      console.error("Error al crear el header:", error);
      swal.fire({
        title: "Error",
        text: "Hubo un problema al crear el header.",
        icon: "error",
        confirmButtonText: "Aceptar"
      });
    }
  }
  else {
    swal.fire({
      title: "Campos incompletos",
      text: "Por favor, completa todos los campos y selecciona una imagen.",
      icon: "warning",
      confirmButtonText: "Aceptar"
    });
  }
}
async deleteImagen(imagen: any): Promise<void> {
  try {
    console.log(imagen)
    const data ={
      id:imagen.id
    }
    const borrar = await this.backendService.deleteSliderImage(data);

    swal.fire({
      title: 'Imagen eliminada',
      text: 'La imagen ha sido eliminada correctamente.',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });

  } catch (error: any) {
    console.error('Error al eliminar la imagen:', error);

    let mensaje = 'Ha ocurrido un error inesperado. Inténtalo más tarde.';

    // Manejo específico de errores comunes
    if (error.status === 404) {
      mensaje = 'La imagen no existe o ya fue eliminada.';
    } else if (error.status === 500) {
      mensaje = 'Error interno del servidor. Contacta con soporte.';
    } else if (error.status === 403 || error.status === 401) {
      mensaje = 'No tienes permisos para eliminar esta imagen.';
    }

    swal.fire({
      title: 'Error al eliminar',
      text: mensaje,
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
  }
}

}


