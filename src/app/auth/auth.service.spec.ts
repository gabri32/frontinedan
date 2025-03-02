import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import 'dotenv/config'
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = process.env['API_AUTH_URL'];; // URL del backend

  constructor(private http: HttpClient) {}

  login(num_identificacion: number, contraseña: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { num_identificacion, contraseña }).pipe(
      tap(response => {
        if (response.success && response.token) {
          sessionStorage.setItem('token', response.token); // Guardamos el token
        }
      })
    );
  }

  logout(): void {
    sessionStorage.removeItem('token'); // Eliminamos el token al cerrar sesión
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('token'); // Devuelve true si hay token
  }
}
