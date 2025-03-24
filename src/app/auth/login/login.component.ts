import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service.spec';
import { Router } from '@angular/router';
import swal from 'sweetalert2'; // Importación por defecto
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../enviroments';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private apiUrl = environment.apiBaseUrl;
  loginForm: FormGroup;
  errorMessage: string = '';
images:any;
dataSource:any;
image1:string[]=[]
  image2:string[]=[]
  image3:string[]=[]
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) { 
    this.loginForm = this.fb.group({
      num_identificacion: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      contraseña: ['', Validators.required]

    });
    
  }
  ngOnInit(): void {
        swal.fire({
            title: 'Cargando...',
            text: 'Por favor espera...',
            allowOutsideClick: false,
            didOpen: () => {
              swal.showLoading();
            }
          });
    this.getimages()
    swal.close()
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/layout']);
    }

    
  }
  async getimages() {
    try {
      this.images = await this.getsliderImages(); // Espera la respuesta antes de asignarla
      this.image1=this.images[0].foto
  
      this.image2=this.images[1].foto
      this.image3=this.images[2].foto
    } catch (error) {
      console.log(error);
    }
  }
  
  async getsliderImages(): Promise<any> {
    return firstValueFrom(this.http.get(`${this.apiUrl}/getsliderImages`));
  }
  
  authLogin() {
    if (this.loginForm.valid) {
      const { num_identificacion, contraseña } = this.loginForm.value;
      
      // Mostrar SweetAlert de carga antes de la petición
      swal.fire({
        title: 'Iniciando sesión...',
        text: 'Por favor espera...',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          swal.showLoading();
        }
      });
  
      this.authService.login(num_identificacion, contraseña).subscribe({
        next: (response) => {
          if (response.user && response.token) {
            sessionStorage.setItem('token', response.token);
            sessionStorage.setItem('usuario', JSON.stringify(response.user));
            
            // Cerrar la alerta de carga y mostrar éxito
            swal.fire({
              title: '¡Éxito!',
              text: 'Inicio de sesión exitoso',
              icon: 'success',
              timer: 500,
              timerProgressBar: true,
              showConfirmButton: false
            }).then(() => {
              this.router.navigate(['/layout']);
            });
          } else {
            // Cerrar la alerta de carga y mostrar error
            swal.fire({
              title: 'Error',
              text: response.message || 'Error en la autenticación.',
              icon: 'error'
            });
          }
        },
        error: () => {
          // Cerrar la alerta de carga y mostrar error
          swal.fire({
            title: 'Error',
            text: 'Identificación o contraseña incorrectos.',
            icon: 'error'
          });
        }
      });
    } else {
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
    }
  }
}