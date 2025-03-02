import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  nombre='';
  constructor(private router: Router) {}
  logout() {
    sessionStorage.clear(); // ✅ Elimina todos los datos almacenados
    sessionStorage.clear(); // (Opcional) Elimina datos de la sesión actual
    this.router.navigate(['/login']); // ✅ Redirige al login
  }
  ngOnInit(): void {
    const token = sessionStorage.getItem('usuario');
    const usuario = token ? JSON.parse(token) : null; 
  
    this.nombre = usuario ? usuario.nombre.split(' ')[0] : ''; 
  
    
  }
  

}
