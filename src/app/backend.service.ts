import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../app/auth/enviroments';
import { firstValueFrom, Observable } from 'rxjs';

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
async deleteHeader(id: number): Promise<any> {
    return firstValueFrom(this.http.delete(`${this.apiUrl}/landing/deleteHeader/${id}`));
  }
  async deteleEventos(id: number): Promise<any> {
    return firstValueFrom(this.http.delete(`${this.apiUrl}/landing/deleteEventos/${id}`));
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
   async insertHeaders(formData:FormData): Promise<any> {
    return firstValueFrom(this.http.post(`${this.apiUrl}/landing/insertHeader`, formData));
  }
     async insertEventos(formData:FormData): Promise<any> {
    return firstValueFrom(this.http.post(`${this.apiUrl}/landing/insertEventos`, formData));
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
async  getInfo():Promise<any> {
    return firstValueFrom(this.http.get(`${this.apiUrl}/landing`))
}
//fallando aun cooreccion nombre no llegaba 
async registrarInscripcion(formulario: any): Promise<any> {
  const formData = new FormData();
if (!formulario.estudiante || !formulario.acudiente) {
  throw new Error('Datos incompletos en el formulario.');
}

  // Campos básicos del estudiante
  formData.append('grado', formulario.grado);
  formData.append('subGrado', formulario.subGrado || '');
  formData.append('nombre_estudiante', formulario.estudiante.nombre);
  formData.append('cedula_estudiante', formulario.estudiante.cedula);
  formData.append('fecha_nacimiento', formulario.estudiante.fechaNacimiento);
  formData.append('eps', formulario.estudiante.eps|| null);
  formData.append('sisben', formulario.estudiante.sisben || '');

  // Archivos del estudiante
  if (formulario.estudiante.registroCivil)
    formData.append('registro_civil', formulario.estudiante.registroCivil);

  if (formulario.estudiante.carnet_vacunas)
    formData.append('carnet_vacunas', formulario.estudiante.carnet_vacunas);
  if (formulario.estudiante.fotografia)
    formData.append('fotografia', formulario.estudiante.fotografia);

  // Datos del acudiente
  formData.append('nombre_acudiente', formulario.acudiente.nombre);
  formData.append('cedula_acudiente', formulario.acudiente.cedula);
  formData.append('contacto1', formulario.acudiente.contacto1);
  formData.append('contacto2', formulario.acudiente.contacto2);
formData.append('documento_acudiente', formulario.acudiente.documento_acudiente);
  formData.append('estado', formulario.estado || 'I');

  // Agregar boletines si existen
  if (formulario.boletines && Array.isArray(formulario.boletines)) {
    formulario.boletines.forEach((archivo: File, index: number) => {
      if (archivo) {
        formData.append('boletines', archivo);
      }
    });
  }

  
  return firstValueFrom(this.http.post(`${this.apiUrl}/registro`, formData));
}


async getheaders():Promise<any>{
  return firstValueFrom(this.http.get(`${this.apiUrl}/landing/getheaders`))
}
async getNumberStudents():Promise<any>{
  return firstValueFrom(this.http.get(`${this.apiUrl}/estudiantesAgrupados`))
}

async createCurses():Promise<any>{
  return firstValueFrom(this.http.get(`${this.apiUrl}/createCurses`))
}

async getAsingDocente(id:string):Promise<any>{
  return firstValueFrom(this.http.get(`${this.apiUrl}/getAsingDocente?id=${id}`))
}
async createWorks(formData:any):Promise<any>{
  return firstValueFrom(this.http.post(`${this.apiUrl}/createWorks`,formData))
}

async getTalleres(id:number):Promise<any>{
  return firstValueFrom(this.http.get(`${this.apiUrl}/getTalleres?id=${id}`))
}
async getEstudiantesPorGrado(grado: number, sede: number,id:number): Promise<any> {
  const params = new HttpParams()
    .set('grado', grado.toString())
    .set('sede', sede.toString()) 
    .set('id', id.toString());
  return firstValueFrom(this.http.get(`${this.apiUrl}/estudiantesPorgrado`, { params }));
}
async gettotalcursos():Promise<any>{
  return firstValueFrom(this.http.get(`${this.apiUrl}/gettotalcursos`))
}
async actualizarEstudiantesAsignados(cursoId: number, estudiantes: number[]): Promise<any> {
  return firstValueFrom(
    this.http.patch(`${this.apiUrl}/actualizarEstudiantesAsignados/${cursoId}`, { estudiantes })
  );
}
async consultarEstudianteCursoAsignaturas(identificacion:number):Promise<any>{
  return firstValueFrom(this.http.get(`${this.apiUrl}/consultarEstudianteCursoAsignaturas?identificacion=${identificacion}`))
}
async getTalleresPorAsignatura(id: number): Promise<any[]> {
  return firstValueFrom(this.http.get<any[]>(`${this.apiUrl}/talleres/asignatura/${id}`));
}
async getdetailTaller(id: number): Promise<any[]> {
  return firstValueFrom(this.http.get<any[]>(`${this.apiUrl}/getdetailTaller/${id}`));
}
async createuser(data: any): Promise<any> {
  return firstValueFrom(this.http.post(`${this.apiUrl}/user`, data)); 
}
async getroles(): Promise<any> {
  return firstValueFrom(this.http.get(`${this.apiUrl}/roles`));
}
async getEventos(): Promise<any> {
  return firstValueFrom(this.http.get(`${this.apiUrl}/getEventos`));
}
async registerEventos(data:{}): Promise<any> {
  return firstValueFrom(this.http.post(`${this.apiUrl}/landing/insertEventos`,data));
}
async getInscritos(): Promise<any> {
  return firstValueFrom(this.http.get(`${this.apiUrl}/getInscritos`));
}
async getLandingEventos(): Promise<any> {
  return firstValueFrom(this.http.get(`${this.apiUrl}/landing/getLandingEventos`));
}
TallerPendiente(data: FormData): Promise<any> {
  return firstValueFrom(this.http.post(`${this.apiUrl}/TallerPendiente`, data)); // Asegúrate que la ruta coincida
}
getTallerPendiente(id_taller:number,num_identificacion:Number):Promise<any>{
  return firstValueFrom(this.http.get(`${this.apiUrl}/getTallerPendiente/${id_taller}/${num_identificacion}`))
}
actualizarTaller(data: any): Promise<any> {
  return firstValueFrom(
    this.http.put(`${this.apiUrl}/updateTaller/${data.id_taller}`, data)
  );
}
getRespuestasPorTaller(id: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/talleres/${id}/respuestas`);
}

calificarTaller(data: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/calificar-taller`, data);
}

}
