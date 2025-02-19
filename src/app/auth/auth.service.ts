import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../auth/enviroments'; // Importar el environment

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiAuthUrl; // Usar la variable del environment

  constructor(private http: HttpClient) {}

  login(correo: string, contraseña: string): Observable<any> {
    return this.http.post(this.apiUrl, { correo, contraseña });
  }
}

