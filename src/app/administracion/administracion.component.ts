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
import { ModalAsignarAsignaturasComponent } from './modales/asignaturas/modal-asignar-asignaturas/modal-asignar-asignaturas.component';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { ModalAsignarGradoComponent } from './modales/dir_grado/modal-asignar-grado/modal-asignar-grado.component';
import { environment } from '../../app/auth/enviroments';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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
  templateUrl: './administracion.component.html',
  styleUrl: './administracion.component.css'
})

export class AdministracionComponent implements OnInit {



  images: any;
  docentes: any;
  cursoForm: FormGroup;
  cursos: any[] = []
  displayedColumns: string[] = ['Numero', 'imagen', 'Opciones'];
  displayedColumnsdocentes: string[] = ['Identificacion del docente', 'Nombre completo', 'Sede', 'Vigencia', 'Opciones'];
  displayedColumnscursos: string[] = ['Grado', 'Curso', 'Director de grado', 'Sede', 'Opciones'];
  validarCurso: boolean = false;
  grupo: any;
  dataSource = new MatTableDataSource<any>();
  dataSource2 = new MatTableDataSource<any>();
  dataSource3 = new MatTableDataSource<any>();
  mostrarTab1 = false;
  mostrarTab2 = false;
  mostrarTab3 = false;
  rol_id = 0;
  cursosCreados: any[] = [];
  inscripciones: any[] = []; // cargada desde tu servicio
  url: any
  // Selectores
  sedes: any[] = [];              // si quieres usarlas en el futuro
  grados: (string|number)[] = ['6','7','8','9','10','11']; // ejemplo
  aniosDisponibles: number[] = [2023, 2024, 2025];
  periodos: number[] = [1,2,3,4];

  sedeSeleccionada!: number;
  gradoSeleccionado!: string | number;
  anioSeleccionado: number = new Date().getFullYear();
  periodoSeleccionado!: number;

  // Datos del reporte
  isLoading = false;
  reporte: any = null;
  estudiantes: any[] = [];
  //paginadores de la tabla ------------------------
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('paginatorLogin') paginatorLogin!: MatPaginator;
  @ViewChild('paginatorDocentes') paginatorDocentes!: MatPaginator;

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
    
    this.url = environment.apiAuthUrl + '/'
    this.verificarPermisos()
    this.getimages()
    this.getprofesores()
    this.getSedes()
    this.getcursos()
    this.getasignaturas()
    this.getInscritos();
    this.backendService.getNumberStudents().then(data => {
      this.grupoEstudiantes = data;
    });
    this.backendService.gettotalcursos().then(data => {
      console.log(data)
      this.cursosCreados = data;

    });
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
    this.dataSource2.paginator = this.paginatorDocentes;

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

  async getprofesores() {
    try {
      this.docentes = await this.backendService.getprofesores();

      // Sumar cantidad_horas_week de las asignaturas de cada docente
      this.docentes.forEach((docente: any) => {
        if (Array.isArray(docente.asignaturas)) {
          docente.totalHorasSemana = docente.asignaturas.reduce(
            (sum: number, asignatura: any) => sum + (asignatura.cantidad_horas_week || 0),
            0
          );
        } else {
          docente.totalHorasSemana = 0;
        }
      });

      this.dataSource2.data = this.docentes;
    } catch (error) {
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

  abrirModalGrado(profesor: any) {
    this.dialog.open(ModalAsignarGradoComponent, {
      width: '3500px',
      data: profesor
    });
  }

  abrirModalAsignaturas(profesor: any) {
    this.dialog.open(ModalAsignarAsignaturasComponent, {
      width: '3500px',
      data: profesor
    });
  }

  async getasignaturas() {
    try {
      const data = await this.backendService.getasignaturas()
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
      await this.getcursos();
      await this.getasignaturas()
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
      if (grados.length > 0) {
        this.validarCurso = true;
      }
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

  async getEstudiantesPorCurso(id_curso: number, sede: number, id: number) {
    try {
      const estudiantes = await this.backendService.getEstudiantesPorGrado(id_curso, sede, id);
      console.log(estudiantes)
    } catch (error) {
      console.error("Error al obtener estudiantes por curso:", error);
      swal.fire({
        title: "Error",
        text: "Hubo un problema al obtener los estudiantes.",
        icon: "error",
        confirmButtonText: "Aceptar"
      });
    }
  }
  modalEstudiantesVisible = false;
  estudiantesCurso: any[] = [];
  estudiantesSeleccionados: number[] = [];

  async abrirModalEstudiantes(grupo: any) {
    try {
      this.grupo = grupo;
      swal.fire({
        title: 'Cargando',
        text: 'Por favor espera...',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          swal.showLoading();
        }
      });
      console.log(grupo.estudiantes_asignados)
      const estudiantes = await this.backendService.getEstudiantesPorGrado(grupo.tipo_grado, grupo.sede, grupo.id);

      this.estudiantesCurso = estudiantes;
      if (grupo.estudiantes_asignados) {
        this.estudiantesSeleccionados = [...grupo.estudiantes_asignados];
      } else {
        this.estudiantesSeleccionados = []
      }


      console.log(this.estudiantesSeleccionados)
      this.modalEstudiantesVisible = true;
      swal.close(); // Cierra el loading al finalizar la carga
    } catch (error) {
      swal.fire({
        title: "Error",
        text: "No se pudo cargar la lista de estudiantes.",
        icon: "error"
      });
    }
  }

  toggleSeleccionarTodos(event: any) {
    if (event.target.checked) {
      this.estudiantesSeleccionados = this.estudiantesCurso.map(e => e.id);
    } else {
      this.estudiantesSeleccionados = [];
    }
  }

  toggleSeleccionado(id: number, event: any) {
    if (event.target.checked) {
      this.estudiantesSeleccionados.push(id);
    } else {
      this.estudiantesSeleccionados = this.estudiantesSeleccionados.filter(eid => eid !== id);
    }
  }

  async guardarSeleccionados() {
    //this.cursos
    if (this.estudiantesSeleccionados.length === 0) {
      swal.fire({
        title: "Advertencia",
        text: "No has seleccionado ningún estudiante.",
        icon: "warning",
        confirmButtonText: "Aceptar"
      });
      return;
    }
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
      console.log(this.grupo.id, this.estudiantesSeleccionados)
      const response = await this.backendService.actualizarEstudiantesAsignados(this.grupo.id, this.estudiantesSeleccionados);
      console.log(response)
      swal.close(); // Cierra el loading al finalizar la carga
      await this.backendService.gettotalcursos().then(data => {
        console.log(data)
        this.cursosCreados = data;

      });
      swal.fire({
        title: "Éxito",
        text: "Estudiantes asignados correctamente.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });
      this.modalEstudiantesVisible = false;
    } catch (error) {
      console.error("Error al asignar estudiantes:", error);
      swal.fire({
        title: "Error",
        text: "Hubo un problema al asignar los estudiantes.",
        icon: "error",
        confirmButtonText: "Aceptar"
      });
    }
  }
  async promovergrado(){
     if (this.estudiantesSeleccionados.length === 0) {
      swal.fire({
        title: "Advertencia",
        text: "No has seleccionado ningún estudiante.",
        icon: "warning",
        confirmButtonText: "Aceptar"
      });
      return;
        }
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
      console.log(this.grupo.id, this.estudiantesSeleccionados)
      const response = await this.backendService.promoverEstudiantes(this.grupo.id, this.estudiantesSeleccionados);
      console.log(response)
      swal.close(); // Cierra el loading al finalizar la carga
      // await this.backendService.gettotalcursos().then(data => {
      //   console.log(data)
      //   this.cursosCreados = data;

      // });
      swal.fire({
        title: "Éxito",
        text: "Estudiantes asignados correctamente.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });
      this.modalEstudiantesVisible = false;
    } catch (error) {
      console.error("Error al asignar estudiantes:", error);
      swal.fire({
        title: "Error",
        text: "Hubo un problema al asignar los estudiantes.",
        icon: "error",
        confirmButtonText: "Aceptar"
      });
    }

  }
  // Limpia slashes incorrectos en Windows
  limpiarRuta(ruta: string): string {
    return ruta?.replace(/\\/g, '/');
  }

  // Convierte texto tipo '[]' a array real
  boletinesArray(boletines: string): string[] {
    try {
      const parsed = JSON.parse(boletines);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  async getInscritos() {
    try {
      this.inscripciones = await this.backendService.getInscritos()
    } catch (error) {
      console.log(error)
    }
  }


valoracionCualitativa(nota: number): string {
    if (nota < 3) return 'Bajo';
    if (nota < 4) return 'Básico';
    if (nota < 4.5) return 'Alto';
    return 'Excelente';
  }

   async cargarReporte() {
    if (!this.gradoSeleccionado || !this.periodoSeleccionado) {
      alert('Selecciona grado y periodo'); return;
    }
    this.isLoading = true;
    try {
      const data = await this.backendService.reporte(this.gradoSeleccionado, this.periodoSeleccionado);
      this.reporte = data;
      this.estudiantes = Array.isArray(data?.estudiantes) ? data.estudiantes : [];
      if (!this.estudiantes.length) {
        alert('No se encontraron estudiantes/notas para esos filtros.');
      }
    } catch (e) {
      console.error(e);
      alert('Error obteniendo el reporte.');
    } finally {
      this.isLoading = false;
    }
  }

  // ====== PDF ======
  private fmt(n: any): string {
    const num = Number(n);
    return Number.isFinite(num) ? num.toFixed(1) : '-';
  }



  private async loadImageBase64(path: string): Promise<string> {
    const res = await fetch(path);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  }

  async generarPDF(estudiante: any) {
    const e = estudiante;
    const periodo = this.periodoSeleccionado;
    const anio = this.anioSeleccionado;
    const doc = new jsPDF();

 

    // Encabezado
 
    doc.setFontSize(10);
    doc.text('INSTITUCIÓN EDUCATIVA MUNICIPAL ANTONIO NARIÑO', 105, 18, { align: 'center' });
    doc.text('INFORME ESCOLAR DE VALORACIÓN', 105, 23, { align: 'center' });
    doc.text(`Año Escolar: ${anio}`, 160, 27);

    // Datos del estudiante (sin jornada)
    doc.rect(10, 37, 190, 20);
    doc.setFontSize(9);
    doc.text(`ESTUDIANTE: ${e?.nombre ?? ''}`, 12, 43);
    doc.text(`CÓDIGO: ${e?.codigo ?? ''}`, 12, 48);
    doc.text(`P.GRAL: ${this.fmt(e?.promedio)}`, 70, 48);
    doc.text(`PUESTO: ${e?.puesto ?? ''}`, 105, 48);
    doc.text(`CURSO: ${e?.curso ?? ''}`, 140, 48);
    doc.text(`PERIODO: ${periodo}`, 12, 53);

    // Si el backend trae fechas, muéstralas; si no, deja guion
    const fIni = e?.fechaPeriodo ?? '-';
    const fFin = e?.fechaFinal ?? '-';
    doc.text(`F. PERIODO: ${fIni}`, 70, 53);
    doc.text(`F. FINAL: ${fFin}`, 130, 53);

    let y = 60;

    // Componentes
    const componentes = Array.isArray(e?.componentes) ? e.componentes : [];
    for (const comp of componentes) {
      doc.setFontSize(11);
      doc.text(comp?.nombre ?? 'Componente', 14, y);
      y += 2;

      const filas = (comp?.asignaturas ?? []).map((a: any) => {
        const notas = Array.isArray(a?.notas) ? a.notas : [];
        const p1 = this.fmt(notas[0]);
        const p2 = this.fmt(notas[1]);
        const p3 = this.fmt(notas[2]);
        const actual = this.fmt(a?.actual);
        const valor = a?.valoracion ?? this.valoracionCualitativa(a?.actual);
        const obs = a?.observacion ?? '';
        const nombreProf = a?.profesor ? `\nPROFESOR: ${a.profesor}` : '';
        return [
          String(a?.intensidad ?? 1),
          `${a?.nombre ?? ''}${nombreProf}`,
          p1, p2, p3, actual, valor, obs
        ];
      });

      autoTable(doc, {
        startY: y + 3,
        head: [['IHS', 'ASIGNATURA', 'PER 1', 'PER 2', 'PER 3', 'ACTUAL PER', 'VALORACIÓN', 'OBS']],
        body: filas,
        margin: { left: 14, right: 14 },
        styles: {
          fontSize: 9,
          textColor: [0, 0, 0],
          fillColor: [255, 255, 255],
          lineColor: [0, 0, 0],
          lineWidth: 0.2,
          cellPadding: 2
        },
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          fontStyle: 'bold',
          lineColor: [0, 0, 0],
          lineWidth: 0.5
        },
        theme: 'grid'
      });

      y = (doc as any).lastAutoTable.finalY + 10;
    }

    const filename = `${(e?.nombre ?? 'reporte').replace(/\s+/g, '_')}_P${periodo}_${anio}.pdf`;
    doc.save(filename);
  }
}



