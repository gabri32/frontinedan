import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service.spec';
import { Router } from '@angular/router';

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
    // 🔹 Si el usuario ya está autenticado, lo redirigimos al layout
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/layout']);
    }
  }

  authLogin() {
    if (this.loginForm.valid) {
      const { num_identificacion, contraseña } = this.loginForm.value;
      this.authService.login(num_identificacion, contraseña).subscribe({
        next: (response) => {
          console.log('🚀 Login response:', response);
          if (response.user && response.token) {
            sessionStorage.setItem('token', response.token); 
            sessionStorage.setItem('usuario', JSON.stringify(response.user)); // Convertimos el objeto a string
             // Guardar token y usuario
            console.log('✅ Login exitoso. Redirigiendo a /layout...');
            this.router.navigate(['/layout']); // Redirigir
          } else {
            this.errorMessage = response.message || 'Error en la autenticación.';
          }
        },
        error: () => {
          this.errorMessage = 'Identificacion o contraseña incorrectos.';
        }
      });
    } else {
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
    }
  }
}  