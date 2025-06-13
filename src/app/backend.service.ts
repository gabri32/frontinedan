import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
async searchVotes(estudiante_id: number): Promise<any> {
  const params = new HttpParams().set('estudiante_id', estudiante_id.toString());
  return firstValueFrom(this.http.get(`${this.apiUrl}/getvotes`, { params }));
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
  async getPropertiesC():Promise<any>{
    return firstValueFrom(this.http.get(`${this.apiUrl}/getPropertiesC`))
  }
  async getPropertiesD():Promise<any>{
    return firstValueFrom(this.http.get(`${this.apiUrl}/getPropertiesD`))
  }
  async updatePropierties(params:any): Promise<any> {
    return firstValueFrom(this.http.post(`${this.apiUrl}/updatePropierties`, params));
  }
  async deletePropierties(params:any): Promise<any> {
    return firstValueFrom(this.http.post(`${this.apiUrl}/deletePropierties`, params));
  }
  async saerchidstudent(num:any):Promise<any>{
    return firstValueFrom(this.http.post(`${this.apiUrl}/saerchidstudent`, num))
  }
  async getsliderImages():Promise<any>{
    return firstValueFrom(this.http.get(`${this.apiUrl}/getsliderImages`))
  }
  async updatesliderImages(formData:FormData): Promise<any> {
    return firstValueFrom(this.http.post(`${this.apiUrl}/updatesliderImages`, formData));
  }
  async getprofesores(): Promise<any> {
    return firstValueFrom(this.http.get(`${this.apiUrl}/getprofesores`));
  }
   async getcursos(): Promise<any> {
    return firstValueFrom(this.http.get(`${this.apiUrl}/getcursos`));
  }
  async editCurso(id: number, data: any): Promise<any> {
  return firstValueFrom(this.http.patch(`${this.apiUrl}/editCurso/${id}`, data));
}
  async aditasignatura(id: number, data: any): Promise<any> {
  return firstValueFrom(this.http.patch(`${this.apiUrl}/aditasignatura/${id}`, data));
}
  async deletePropiertieasig(id: number, data: any): Promise<any> {
  return firstValueFrom(this.http.patch(`${this.apiUrl}/deletePropiertieasig/${id}`, data));
}
  async deletePropiertiescurso(id: number, data: any): Promise<any> {
  return firstValueFrom(this.http.patch(`${this.apiUrl}/deletePropiertiescurso/${id}`, data));
}
async getsedes ():Promise<any>{
  return firstValueFrom(this.http.get(`${this.apiUrl}/getsedes`,))
}
async createCurso(event:any):Promise<any>{
  return firstValueFrom(this.http.post(`${this.apiUrl}/createCurso`,event))
}
async getasignaturas():Promise<any>{
  return firstValueFrom(this.http.get(`${this.apiUrl}/getasignaturas`))
}
}
