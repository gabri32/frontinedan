import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './auth/enviroments'; 

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  // 🟢 Autenticación
  login(correo: string, contraseña: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { correo, contraseña });
  }

  // 🟢 Crear un estudiante
  createStudent(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/students`, data);
  }

  // 🟢 Buscar estudiantes por identificación
  searchStudent(num_identificacion: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/searchStudent`, { params: { num_identificacion } });
  }

  // 🟢 Obtener todos los estudiantes
  getAllStudents(): Observable<any> {
    return this.http.get(`${this.apiUrl}/searchStudent`);
  }

  // 🟢 Editar estudiante
  updateStudent(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/students/${id}`, data);
  }

  // 🟢 Eliminar estudiante
  deleteStudent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/students/${id}`);
  }

  createcandidate(params: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/createCandidate`, params);
  }
}
