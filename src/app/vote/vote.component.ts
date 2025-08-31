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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MatError } from "@angular/material/form-field";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'; // o MatMomentDateModule si usas Moment.js

//import { ReporteService } from '../services/reporte.service';
@Component({
  selector: 'app-vote',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule, // ✅ Importar checkbox
    MatDividerModule,
    MatCardModule,
    NgxChartsModule,
    FormsModule,
    MatError,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatTableModule,
    MatTabsModule
  ],
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})
export class VoteComponent implements OnInit {

  //variables iniciales del componente ------------------------
  displayedColumns: string[] = ['selecciona', 'id', 'nombre', 'edad', 'grado', 'num_identificacion', 'Seleccionado', 'Opciones'];
  displayedColumns2: string[] = ['descripcion', 'fechaInicio', 'fechaFin'];

  dataSource = new MatTableDataSource<any>();
  selectedStudents: Array<any> = []
  loading = false;
  hascandidates = false;
  arrayPersonberos: Array<any> = [];
  arrayContralores: Array<any> = [];
  autenticacion: any;
  votes: Array<any> = [];
  showPersonero = true;
  showContralor = true;
  chartOptions: any;
  lema: string | undefined;
  view: [number, number] = [400, 400]; // Tamaño del gráfico
  data: Array<any> = [];
  data2: Array<any> = [];
  selectedFile: File | null = null;
  uploadedImageUrl: string = '';
  sortStudents: any
  colorScheme: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#e74c3c', '#f7dc6f', '#959aa1', '#7aa3e5']
  };
  estudiante_id: number = 0;
  //permisos
  mostrarTab1 = false;
  mostrarTab2 = false;
  mostrarTab3 = false;
  rol_id = 0;
  repor = false;
  now: number | null = null;
  time: Date | null = null;
  //paginadores de la tabla ------------------------
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  highcharts: any;
  rawData: any;
  ganadorper: any;
  ganadorcon: any;
  eventos: [] = [];
  eventoForm: any;
  eventoform = {
    descripcion: '',
    fechaInicio: null,
    fechaFin: null
  };
  constructor(private backendService: BackendService, private sanitizer: DomSanitizer) { }
  ngOnInit(): void {
    const date = new Date();

    this.time = date
    this.now = date.getFullYear();
    const token = sessionStorage.getItem('usuario');
    this.autenticacion = token ? JSON.parse(token) : null;
    this.estudiante_id = this.autenticacion.num_identificacion
    this.verificarPermisos()
    this.obtenerEstudiantes();
    this.searchCandidates();
    this.searchVotes();
    this.getEventos();
    swal.close();

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
  }
  sanitizeImageUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  async obtenerEstudiantes() {
    try {

      const data = await this.backendService.getAllStudents();
      console.log("datos de los estudiantes reales ",data)
      this.dataSource.data = data.students.map((student: any) => ({ ...student, seleccionado: "No" }));
      this.searchCandidates()
    } catch (error) {
      console.error('Error al obtener estudiantes:', error);

    }
  }


  applyGlobalFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }
  toggleSelection(student: any) {
    const index = this.selectedStudents.findIndex(s => s.nombre === student.nombre);

    if (index > -1) {
      // Si ya está seleccionado, lo eliminamos
      this.selectedStudents.splice(index, 1);
    } else {
      // Si no está seleccionado, lo agregamos al inicio
      this.selectedStudents.unshift({
        nombre: student.nombre,
        descripcion: student.grado === 11 ? "personero/a" : "contralor/a",
        num_identificacion: parseInt(student.num_identificacion)
      });
    }


  }

  async removeCandidate(student: any) {
    try {
      // Confirmar eliminación con SweetAlert2
      const result = await swal.fire({
        title: "¿Estás seguro?",
        text: "Este candidato será eliminado.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
      });

      if (!result.isConfirmed) {
        return;
      }

      // Eliminar visualmente de la lista
      this.selectedStudents = this.selectedStudents.filter(s => s !== student);
      student.seleccionado = 'No';



      const num_identificacion = parseInt(student.num_identificacion);
      // Llamar al servicio para eliminar en el backend
      const response = await this.backendService.removeCandidate({ num_identificacion });
      this.searchCandidates();
      // Mostrar mensaje de éxito con SweetAlert
      swal.fire({
        title: "Eliminado",
        text: "El candidato ha sido eliminado con éxito.",
        icon: "success",
        timer: 1000,
        showConfirmButton: false
      });

    } catch (error) {
      console.error("Error al eliminar candidato:", error);

      // Mostrar mensaje de error con SweetAlert
      swal.fire({
        title: "Error",
        text: "Hubo un problema al eliminar el candidato.",
        icon: "error"
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
      formData.append("image", student.selectedFile);
      formData.append("num_identificacion", student.num_identificacion.toString());
      formData.append("lema", student.lema);
      formData.append("numero", student.numero.toString());


      //CONSOLE.LOG PARA VER SIO LOS DATOS DEL FORMN DATA ESTAN BIEN Y SE ENVIAN AL MULTER DEL BACK
      // for (let pair of formData.entries()) {
      //   console.log(pair[0] + ":", pair[1]);
      // }

      const response = await this.backendService.saveImage(formData);

      if (!response.message) {
        console.error("Error al guardar la imagen:", response);
        alert("No se pudo guardar la imagen");
        return;
      }

      swal.fire({
        title: "Imagen guardada",
        text: "La imagen del candidato ha sido guardada correctamente.",
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





  async createCandidates() {

    try {
      swal.fire({
        title: 'Creando candidatos...',
        text: 'Por favor espera...',
        allowOutsideClick: false,
        didOpen: () => {
          swal.showLoading();
        }
      });
      await this.backendService.createCandidate(this.selectedStudents);
      await this.searchCandidates();
      this.hascandidates = true;

      swal.close();
      alertify.success('Candidatos creados con éxito 🎉');
    } catch (error) {
      console.error('❌ Error al crear candidatos:', error);

      // ❌ Cerrar el loader y mostrar mensaje de error
      swal.close();
      swal.fire({
        title: 'Error',
        text: 'Hubo un problema al crear los candidatos.',
        icon: 'error'
      });

    } finally {
      // Asegurar que el loader se desactiva
    }
  }



  async searchCandidates() {
    try {
      swal.fire({
        title: 'Cargando candidatos...',
        text: 'Por favor espera...',
        allowOutsideClick: false,
        didOpen: () => {
          swal.showLoading();
        }
      });

      const response = await this.backendService.searchCandidate();
      if (response.candidates.length > 0) {
        // Filtrar contralores y personeros solo una vez
        this.arrayContralores = response.candidates.filter((c: any) => c.descripcion === "contralor/a");
        this.arrayPersonberos = response.candidates.filter((c: any) => c.descripcion === "personero/a");

        // Crear un Set para búsqueda rápida de identificaciones
        const candidateIds = new Set(response.candidates.map((c: any) => parseInt(c.num_identificacion)));

        // Actualizar `dataSource` con `seleccionado = "Sí"` si está en los candidatos
        this.dataSource.data = this.dataSource.data.map((student: any) => ({
          ...student,
          seleccionado: candidateIds.has(parseInt(student.num_identificacion)) ? "Sí" : student.seleccionado
        }));

        this.hascandidates = true;
        swal.close();

      } else {
        console.log('⚠️ No se encontraron candidatos.');
        this.hascandidates = false;
        swal.close();
      }
    } catch (error) {
      swal.close();
      console.error(error);
      swal.fire({
        title: 'Error',
        text: 'Hubo un problema al buscar los candidatos.',
        icon: 'error'
      });
    }
  }

  async vote(option: any) {
    try {
      swal.fire({
        title: 'Creando el voto...',
        text: 'Por favor espera...',
        allowOutsideClick: false,
        didOpen: () => {
          swal.showLoading();
        }
      });
      const num = {
        num_identificacion: this.autenticacion.num_identificacion
      }
      const student = await this.backendService.saerchidstudent(num)
      const params = {
        estudiante_id: student.student.id,
        candidato_id: option.id,
        id_tipo_vote: option.descripcion === "personero/a" ? 1 : 2
      };
      await this.backendService.createVote(params);
      await this.searchVotes();
      swal.close();
      alertify.success('Voto registrado');
      swal.fire({
        title: '¡Éxito!',
        text: 'Voto registrado con exito',
        icon: 'success',
        timer: 500,
        timerProgressBar: true,
        showConfirmButton: false
      })
    } catch (error) {
      alertify.error('❌Error. Inténtalo de nuevo.❌');
      console.error('❌ Error al votar:', error);
    }
  }


  async voteBlank(tipo: any) {
    try {

      swal.fire({
        title: 'Registrando voto en blanco...',
        text: 'Por favor espera...',
        allowOutsideClick: false,
        didOpen: () => {
          swal.showLoading();
        }
      });
      const num = {
        num_identificacion: this.autenticacion.num_identificacion
      }
      const student = await this.backendService.saerchidstudent(num)
      const params = {
        estudiante_id: student.student.id,
        candidato_id: null, // No hay candidato
        id_tipo_vote: tipo === "personero/a" ? 1 : 2,
        es_blanco: true // Indicamos que es un voto en blanco
      };

      await this.backendService.createVote(params);
      await this.searchVotes();
      swal.close();
      alertify.success('Voto en blanco registrado con éxito 🎉');
    } catch (error) {
      alertify.error('❌ Error. Inténtalo de nuevo. ❌');
      console.error('❌ Error al votar en blanco:', error);
    }
  }

  async searchVotes() {
    try {
      swal.fire({
        title: 'Cargando...',
        text: 'Por favor espera...',
        allowOutsideClick: false,
        didOpen: () => {
          swal.showLoading();
        }
      });

      await this.verificarVotos();
      await this.obtenerVotos();
      swal.close();
    } catch (error) {
      alertify.warning('❌ error al traer votos ❌');
      console.error('❌ Error al buscar votos:', error);
    }
  }
  async verificarVotos() {
    try {

      const num = {
        num_identificacion: this.autenticacion.num_identificacion
      }
      if (this.rol_id === 3 || this.rol_id === 1) {
        console.info("no es estudiante")
      } else {
        console.log(this.rol_id)
        const student = await this.backendService.saerchidstudent(num)
        const response = await this.backendService.searchVotes(student.student.id);
        this.votes = response;
      }
      const votosRealizados = new Set(this.votes.map((v: any) => v.id_tipo_vote));
      const hasVotedper = votosRealizados.has(1); // 1 = Personero
      const hasVotedcon = votosRealizados.has(2); // 2 = Contralor

      if (hasVotedcon) {
        this.showContralor = false;
        alertify.warning('⚠️ Ya has votado por contralor/a ⚠️');
      }
      if (hasVotedper) {
        this.showPersonero = false;
        alertify.warning('⚠️ Ya has votado por personero/a ⚠️');
      }
    } catch (error) {
      alertify.warning('❌ Error al traer votos ❌');
      console.error('❌ Error al buscar votos:', error);
    }
  }


  async obtenerVotos() {
    try {
      const response = await this.backendService.grafVotes();

      // Filtrar votos según el id_tipo_vote
      const votosPersonero = response.filter((vote: any) => vote.id_tipo_vote === 1);
      const votosContralor = response.filter((vote: any) => vote.id_tipo_vote === 2);

      // Filtrar votos en blanco por tipo
      const votosBlancoPersonero = response.filter((vote: any) => vote.id_tipo_vote === 1 && vote.candidato === null);
      const votosBlancoContralor = response.filter((vote: any) => vote.id_tipo_vote === 2 && vote.candidato === null);

      // Mapear datos de votos para Personero
      this.data = votosPersonero.map((item: any) => ({
        name: item.candidato ? item.candidato : "Voto en Blanco",
        value: Number(item.votos)
      }));
      this.ganadorper = [...this.data].sort((a, b) => b.value - a.value)[0];
      // console.log("Ganador Personero:", this.ganadorper);
      // Mapear datos de votos para Contralor
      this.data2 = votosContralor.map((item: any) => ({
        name: item.candidato ? item.candidato : "Voto en Blanco",
        value: Number(item.votos)
      }));

      this.ganadorcon = [...this.data2].sort((a, b) => b.value - a.value)[0];
      // console.log("Ganador Personero:", this.ganadorcon);

    } catch (error) {
      console.error('❌ Error al obtener votos:', error);
    }
  }




  //reporte renderiza 1 sola vez y oculta
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
    //tiempo de renderizado para que el html pueda tomar la info
  }
  async generatePDF() {
    swal.fire({
      title: 'Creando reporte...',
      text: 'Por favor espera...',
      allowOutsideClick: false,
      didOpen: () => {
        swal.showLoading();
      }
    });
    this.repor = true
    await this.delay(700);
    const element = document.getElementById('pdfContent'); // Selecciona el div por su ID
    if (!element) {
      console.error('No se encontró el elemento con id="pdfContent".');
      return;
    }

    html2canvas(element).then((canvas) => {

      const imgData = canvas.toDataURL('image/png'); // Convierte el canvas a una imagen PNG
      const pdf = new jsPDF('p', 'mm', 'a4'); // Crea un documento PDF en formato A4

      const imgWidth = 190; // Ancho de la imagen en el PDF (ajustado al ancho de la página)
      const pageHeight = 250; // Altura de la página en mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Escala la altura proporcionalmente
      let heightLeft = imgHeight;

      let position = 10; // Margen superior inicial

      // Agrega la imagen al PDF
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Si el contenido es más grande que una página, agrega páginas adicionales
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('Reporte_votaciones_' + this.now + 'Antonio_nariño.pdf');
      this.repor = false// Guarda el PDF con el nombre "reporte.pdf"
      swal.close()
    }).catch((error) => {
      console.error('Error al generar el PDF:', error);
    });
  }


  async getEventos() {
    try {
      const eventos = await this.backendService.getEventos();
      console.log(eventos);
      if (eventos.length > 0) {
        this.eventos = eventos;
        console.log('Eventos obtenidos:', eventos);
      } else {
        console.warn('⚠️ No se encontraron eventos.');
      }
    } catch (error) {
      console.error('Error al obtener eventos:', error);
    }
  }


  async registerEventos() {
    try {
      if (!this.eventoform.descripcion || !this.eventoform.fechaInicio || !this.eventoform.fechaFin) {
        alertify.error('❌ Todos los campos son obligatorios ❌');
        return;
      }
      swal.fire({
        title: 'Creando reporte...',
        text: 'Por favor espera...',
        allowOutsideClick: false,
        didOpen: () => {
          swal.showLoading();
        }
      });
      const data = {
        detalle_del_evento: this.eventoform.descripcion,
        fecha_ini: this.eventoform.fechaInicio,
        fecha_fin: this.eventoform.fechaFin
      };
      console.log('Datos del evento:', data);
      if (this.eventoform.fechaInicio > this.eventoform.fechaFin) {
         swal.fire({
          title: 'Advertencia!',
          text: 'La fecha inicial no puede ser mayor que la fecha final',
          icon: 'warning',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        })
      }
      else {
        await this.backendService.registerEventos(data);
        swal.fire({
          title: '¡Éxito!',
          text: 'Registrado con exito',
          icon: 'success',
          timer: 500,
          timerProgressBar: true,
          showConfirmButton: false
        })
      }

      this.getEventos(); // Actualizar la lista de eventos
      this.eventoform = {
        descripcion: '',
        fechaInicio: null,
        fechaFin: null
      }; // Limpiar el formulario
    } catch (error) {
      console.error('❌ Error al registrar el evento:', error);
      alertify.error('❌ Error al registrar el evento ❌');
    }
  }

async reactivarCandidatos() {
  try {
    swal.fire({
      title: 'Procesando...',
      text: 'Reactivando candidatos',
      allowOutsideClick: false,
      didOpen: () => {
        swal.showLoading();
      }
    });

    await this.backendService.activarTodosCandidatos();
    await this.obtenerEstudiantes();
    await this.searchCandidates();
    await this.searchVotes();
    await this.getEventos();

    swal.fire({
      title: '¡Éxito!',
      text: 'Actualizado con éxito',
      icon: 'success',
      timer: 500,
      timerProgressBar: true,
      showConfirmButton: false
    });
  } catch (error) {
    console.log(error);
    swal.fire('Error', 'Ocurrió un error al reactivar candidatos', 'error');
  }
}

async inactivarcadidatos() {
  try {
    swal.fire({
      title: 'Procesando...',
      text: 'Inactivando candidatos',
      allowOutsideClick: false,
      didOpen: () => {
        swal.showLoading();
      }
    });

    await this.backendService.inactivarTodosCandidatos();
    await this.obtenerEstudiantes();
    await this.searchCandidates();
    await this.searchVotes();
    await this.getEventos();

    swal.fire({
      title: '¡Éxito!',
      text: 'Actualizado con éxito',
      icon: 'success',
      timer: 500,
      timerProgressBar: true,
      showConfirmButton: false
    });
  } catch (error) {
    console.log(error);
    swal.fire('Error', 'Ocurrió un error al inactivar candidatos', 'error');
  }
}

}
