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
@Component({
  selector: 'app-vote',
  standalone: true,
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
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})
export class VoteComponent implements OnInit {

  //variables iniciales del componente ------------------------
  displayedColumns: string[] = ['selecciona', 'id', 'nombre', 'edad', 'grado', 'num_identificacion', 'Seleccionado','Opciones'];
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
  lema:string | undefined;
  view: [number, number] = [400, 400]; // Tamaño del gráfico
  data: Array<any> = [];
  data2: Array<any> = [];
  selectedFile: File | null = null;
  uploadedImageUrl: string = '';
  sortStudents:any
  colorScheme: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5']
  };
  //paginadores de la tabla ------------------------
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  highcharts: any;
  rawData: any;
  constructor(private backendService: BackendService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.obtenerEstudiantes();
    this.searchCandidates();
    const token = sessionStorage.getItem('usuario');
    this.autenticacion = token ? JSON.parse(token) : null;
    this.searchVotes();


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
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      student.selectedFile = file;
    }
  }

  async uploadImage(student: any) {
    if (!student.selectedFile) {
      alert("Selecciona una imagen primero");
      return;
    }
  
    try {
      const result = await swal.fire({
        title: "¿Estás seguro?",
        text: "Esta imagen será asignada al candidato.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, asignar",
        cancelButtonText: "Cancelar"
      });
  
      if (!result.isConfirmed) {
        return;
      }
  
      const formData = new FormData();
      formData.append("image", student.selectedFile);
  
      const response = await this.backendService.upload(formData);
  
      if (!response?.imageUrl) {
        console.error("Respuesta inesperada del servidor:", response);
        alert("Error: No se recibió la URL de la imagen");
        return;
      }
  
      student.uploadedImageUrl = response.imageUrl;
      const params = {
        num_identificacion: parseInt(student.num_identificacion),
        imageUrl: student.uploadedImageUrl,
        lema:student.lema,
        numero:parseInt(student.numero)
      };
  
      await this.backendService.saveImage(params);
  
      swal.fire({
        title: "Agregado con éxito",
        text: "Imagen del candidato agregada con éxito.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });
  
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      swal.fire({
        title: "Error",
        text: "Hubo un problema al subir la imagen.",
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

  voteBlank(tipo: string) {
    console.log(`Voto en blanco para: ${tipo}`);
   
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
  console.log(response.candidates)
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
      const params = {
        estudiante_id: this.autenticacion.id,
        candidato_id: option.id,
        id_tipo_vote: option.descripcion === "personero/a" ? 1 : 2
      };
      await this.backendService.createVote(params);
      await this.searchVotes();
      swal.close();
      alertify.success('Voto registrado con éxito 🎉');
    } catch (error) {
      alertify.error('❌Error. Inténtalo de nuevo.❌');
      console.error('❌ Error al votar:', error);
    }

  }

  async searchVotes() {
    try {
      const response = await this.backendService.searchVotes();
      console.log('Votos obtenidos:', response);
      this.votes = response;
      await this.verificarVotos();
      await this.obtenerVotos();
    } catch (error) {
      alertify.warning('❌ error al traer votos ❌');
      console.error('❌ Error al buscar votos:', error);
    }
  }
  async verificarVotos() {
    try {
      const response = await this.backendService.searchVotes();
      console.log('Votos obtenidos:', response);
      this.votes = response;

      // Crear un conjunto con los tipos de votos que el usuario ha realizado
      const votosRealizados = new Set(
        response
          .filter((vote: { estudiante: { id: any }; }) => vote?.estudiante?.id === this.autenticacion.id)
          .map((vote: { id_tipo_vote: number; }) => vote?.id_tipo_vote)
      );

      // Verificar si el usuario ya votó por cada categoría
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

      const votosPersonero = response.filter((vote: any) => vote.descripcion === "personero/a");
      const votosContralor = response.filter((vote: any) => vote.descripcion === "contralor/a");
      this.data = votosPersonero.map((item: any) => ({
        name: item.candidato, // El nombre del candidato
        value: Number(item.votos) // Convertir los votos a número
      }));
      this.data2 = votosContralor.map((item: any) => ({
        name: item.candidato, // El nombre del candidato
        value: Number(item.votos) // Convertir los votos a número
      }));
    } catch (error) {
      console.error('Error al obtener votos:', error);
    }
  }



}
