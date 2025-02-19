import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service'; // ✅ Importar el servicio correctamente
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService,private router: Router) { // ✅ Inyectar el servicio
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contraseña: ['', Validators.required]
    });
  }

  async authLogin() {
    if (this.loginForm.valid) {
      const { correo, contraseña } = this.loginForm.value;
      
      // ✅ Pasar clos parámetros al servicio
      this.authService.login(correo, contraseña).subscribe({
        next: (response) => {
          console.log('datos de respesta',response)
          this.router.navigate(['/layout']); 
          if (!response.success) {
            this.errorMessage = response.message;
          } else {
          
    
          }
        },
        error: (error) => {
          this.errorMessage = 'Error en la autenticación';
          console.error(error);
        }
      });
    } else {
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
    }
  }


  
  }

