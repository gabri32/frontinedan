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
    MatDividerModule
  ],
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})
export class VoteComponent implements OnInit {
  displayedColumns: string[] = ['selecciona', 'id', 'nombre', 'edad', 'grado', 'num_identificacion'];
  dataSource = new MatTableDataSource<any>();
  selectedStudents: Array<any> = []  // ✅ Guardar los seleccionados

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private backendService: BackendService) { }

  ngOnInit(): void {
    this.obtenerEstudiantes();
  }

  obtenerEstudiantes() {
    this.backendService.getAllStudents().subscribe(
      (data) => {
        this.dataSource.data = data.students;
        console.log('Lista de estudiantes:', this.dataSource.data);

        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
      },
      (error) => {
        console.error('Error al obtener estudiantes:', error);
      }
    );
  }

  toggleSelection(student: any) {
    const index = this.selectedStudents.indexOf(student);

    if (index > -1) {
      this.selectedStudents.splice(index, 1);
    } else {
      this.selectedStudents.push(student);
    }

    const params1 = this.selectedStudents.map(({ nombre, grado }) => ({
      nombre,
      descripcion: grado === 11 ? "personero/a" : "contralor/a"
    }));
    this.selectedStudents = params1;
    console.log('Estudiantes seleccionados:', this.selectedStudents);
  }


  async createCantidates() {
    try {
      await this.backendService.createcandidate(this.selectedStudents).toPromise();
      console.log('Candidatos creados correctamente');
    }
    catch (error) {
      console.error('Error al crear candidatos:', error);
    }
  }

  vote(option: string) {
    console.log(`🗳️ Votaste por: ${option}`);
  }

  
}
