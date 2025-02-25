import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from './enviroments';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiAuthUrl; // URL del backend

  constructor(private http: HttpClient) {}

  login(correo: string, contraseña: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { correo, contraseña }).pipe(
      tap(response => {
        if (response.success && response.token) {
          localStorage.setItem('token', response.token); // Guardamos el token
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token'); // Eliminamos el token al cerrar sesión
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // Devuelve true si hay token
  }
}
