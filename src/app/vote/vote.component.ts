import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';  // ✅ Agregar módulo de checkbox
import { MatTableDataSource } from '@angular/material/table';
import { BackendService } from '../backend.service';
import { MatDividerModule } from '@angular/material/divider';
import * as alertify from 'alertifyjs';
import { MatCardModule } from '@angular/material/card';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
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
    NgxChartsModule
  ],
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})
export class VoteComponent implements OnInit {

  //variables iniciales del componente ------------------------
  displayedColumns: string[] = ['selecciona', 'id', 'nombre', 'edad', 'grado', 'num_identificacion', 'Seleccionado'];
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
  view: [number, number] = [400, 400]; // Tamaño del gráfico
  data :Array<any> = [];
  data2 :Array<any> = [];
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
  constructor(private backendService: BackendService) { }

  ngOnInit(): void {
    this.obtenerEstudiantes();
    this.searchCandidates();
    const token = localStorage.getItem('usuario');
    this.autenticacion = token ? JSON.parse(token) : null;
    this.searchVotes();
  

  }

  async obtenerEstudiantes() {
    try {
      this.loading = true;

      const data = await this.backendService.getAllStudents();

      this.dataSource.data = data.students.map((student: any) => ({ ...student, seleccionado: "No" }));
      this.loading = false;
    } catch (error) {
      console.error('Error al obtener estudiantes:', error);
      this.loading = false;
    }
  }


  applyGlobalFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }
  toggleSelection(student: any) {
    const index = this.selectedStudents.findIndex(s => s.nombre === student.nombre);

    if (index > -1) {
      this.selectedStudents.splice(index, 1);
    } else {
      this.selectedStudents.push({
        nombre: student.nombre,
        descripcion: student.grado === 11 ? "personero/a" : "contralor/a",
        num_identificacion: parseInt(student.num_identificacion)
      });
    }


  }



  async createCandidates() {
    this.loading = true;
    try {
      await this.backendService.createCandidate(this.selectedStudents);
      await this.searchCandidates();
      this.hascandidates = true;

      // ✅ Mostrar alerta de éxito
      alertify.success('Candidatos creados con éxito 🎉');
    } catch (error) {
      console.error('❌ Error al crear candidatos:', error);

      // ❌ Mostrar alerta de error
      alertify.error('Error al crear candidatos. Inténtalo de nuevo.');
    } finally {
      this.loading = false; // Asegurar que el loader se desactiva
    }
  }


  async searchCandidates() {
    try {
      this.loading = true;
      const response = await this.backendService.searchCandidate();

      if (response.candidates.length > 0) {
        this.dataSource.data = this.dataSource.data.map((student: any) => {

          this.arrayContralores = response.candidates.filter((c: any) => c.descripcion === "contralor/a");
          this.arrayPersonberos = response.candidates.filter((c: any) => c.descripcion === "personero/a");
          const candidate = response.candidates.find((c: any) => c.num_identificacion === parseInt(student.num_identificacion));
          if (candidate) {
            return { ...student, seleccionado: "Sí" };
          } else {
            return student;
          }
        });
        this.hascandidates = true;
        this.loading = false;
      } else {
        console.log('⚠️ No se encontraron candidatos.');
        this.hascandidates = false;
      }
    } catch (error) {
      console.error('❌ Error al buscar candidatos:', error);
    }
  }





  async vote(option: any) {
    try {
      const params = {
        estudiante_id: this.autenticacion.id,
        candidato_id: option.id,
        id_tipo_vote: option.descripcion === "personero/a" ? 1 : 2
      };
      await this.backendService.createVote(params);
      await this.searchVotes();
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
console.log('votoss',response);
     const votosPersonero= response.filter((vote:any) => vote.descripcion === "personero/a");
     const votosContralor= response.filter((vote:any) => vote.descripcion === "contralor/a");
     

    
  
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
