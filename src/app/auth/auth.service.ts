import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
require('dotenv').config();
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = process.env['API_AUTH_URL'] || 'defaultApiUrl'; // Usar la variable del environment con valor por defecto

  constructor(private http: HttpClient) {}

  login(correo: string, contraseña: string): Observable<any> {
    return this.http.post(this.apiUrl, { correo, contraseña });
  }
}

