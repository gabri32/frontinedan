import { Component,OnInit,AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
declare var bootstrap: any;
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
    const spaceCount = (usuario.nombre.match(/ /g) || []).length;

      this.nombre = (usuario.nombre).toUpperCase()  
  }
  ngAfterViewInit() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(tooltip => new bootstrap.Tooltip(tooltip));
  }

}
