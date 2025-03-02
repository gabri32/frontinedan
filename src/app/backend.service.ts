import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
require('dotenv').config();

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private apiUrl = process.env['API_ALL'];

  constructor(private http: HttpClient) {}

  // 🟢 Autenticación
  async login(num_identificacion: number, contraseña: string): Promise<any> {
    return firstValueFrom(this.http.post(`${this.apiUrl}/login`, { num_identificacion, contraseña }));
  }

  // 🟢 Crear un estudiante
  async createStudent(data: any): Promise<any> {
    return firstValueFrom(this.http.post(`${this.apiUrl}/students`, data));
  }



  // 🟢 Obtener todos los estudiantes
  async getAllStudents(): Promise<any> {
    return firstValueFrom(this.http.get(`${this.apiUrl}/searchStudent`));
  }

  // 🟢 Editar estudiante
  async updateStudent(id: number, data: any): Promise<any> {
    return firstValueFrom(this.http.put(`${this.apiUrl}/students/${id}`, data));
  }

  // 🟢 Eliminar estudiante
  async deleteStudent(id: number): Promise<any> {
    return firstValueFrom(this.http.delete(`${this.apiUrl}/students/${id}`));
  }

  // 🟢 Crear candidatos
  async createCandidate(params: any): Promise<any> {
    return firstValueFrom(this.http.post(`${this.apiUrl}/createCandidate`, params));
  }

  // 🟢 Buscar candidatos
  async searchCandidate(): Promise<any> {
    return firstValueFrom(this.http.get(`${this.apiUrl}/searchCandidate`));
  }
  async createVote(params: any): Promise<any> {
    return firstValueFrom(this.http.post(`${this.apiUrl}/createvotes`, params));
  }
  async searchVotes(): Promise<any> {
    return firstValueFrom(this.http.get(`${this.apiUrl}/getVotes`));
  }
  async grafVotes(): Promise<any> {
    return firstValueFrom(this.http.get(`${this.apiUrl}/grafVotes`));
  }
}
