import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service.spec';
import { Router } from '@angular/router';
import swal from 'sweetalert2'; // Importación por defecto

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { 
    this.loginForm = this.fb.group({
      num_identificacion: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      contraseña: ['', Validators.required]

    });
    
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/layout']);
    }
  }

  authLogin() {
    if (this.loginForm.valid) {
      const { num_identificacion, contraseña } = this.loginForm.value;
      this.authService.login(num_identificacion, contraseña).subscribe({
        next: (response) => {
       swal
          if (response.user && response.token) {
            sessionStorage.setItem('token', response.token); 
            sessionStorage.setItem('usuario', JSON.stringify(response.user)); 
         

            swal.fire({
              title: 'Iniciando sesión...',
              text: 'Por favor espera...',
              timer: 2000, // 2 segundos
              timerProgressBar: true,
              showConfirmButton: false,
              allowOutsideClick: false,
              didOpen: () => {
                swal.showLoading();
              }
            }).then(()=>{this.router.navigate(['/layout']); });
              
      

          } else {
            this.errorMessage = response.message || 'Error en la autenticación.';
            swal.fire({
              title: "error",
              text: "ocurrio un error",
              icon: "error"
            });
          }
        },
        error: () => {
          this.errorMessage = 'Identificación o contraseña incorrectos.';
      
        }
      });
    } else {
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
    
    }
  }
}