import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../app/auth/enviroments';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private apiUrl = environment.apiBaseUrl;

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
  async removeCandidate(num_identificacion:any):Promise<any>{
    console.log({num_identificacion})
    return firstValueFrom(this.http.post(`${this.apiUrl}/removeCandidate`,num_identificacion))
  }
  async gettypes():Promise<any>{
    return firstValueFrom(this.http.get(`${this.apiUrl}/gettypes`))
  }
  async createproperty(properties: Array<any>): Promise<any> {
    return firstValueFrom(this.http.post(`${this.apiUrl}/createproperty`,properties))
  }
  async upload (formData: FormData): Promise<any> {
    return firstValueFrom(this.http.post(`${this.apiUrl}/upload`, formData));
  }
  async saveImage(params:any): Promise<any> {
    return firstValueFrom(this.http.post(`${this.apiUrl}/saveImage`, params));
  }
}
