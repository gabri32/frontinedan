import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component'; 

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],  
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  isSidebarOpen = true; 
  //permisos
  mostrarTab1 = false;
  mostrarTab2 = false;
  mostrarTab3 = false;
  isAdminDropdownOpen = false;

rol_id=0;
  constructor(private router: Router, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.w3Open();
    this.verificarPermisos();  
  }
  verificarPermisos() {

    const usuarioString = sessionStorage.getItem('usuario');
    const usuario = usuarioString ? JSON.parse(usuarioString) : null;
    this.rol_id = usuario?.rol_id ?? null;

    // Configura la visibilidad de tabs según el rol
    if (this.rol_id === 1) {
      this.mostrarTab1 = true;
    }
    if (this.rol_id === 2) {
      this.mostrarTab2 = true;
    }
    if (this.rol_id === 3) {
      this.mostrarTab3 = true;
    }
    console.log(this.rol_id)
  }
  navigateTo(route: string) {
    this.router.navigate([`layout/${route}`]); 
  }

  w3Open(): void {
    const sidebar = document.getElementById("mySidebar");
    if (sidebar) {
      this.renderer.setStyle(sidebar, 'display', 'block');
      this.isSidebarOpen = true;
    }
  }
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen; // ✅ Alterna el estado
  }
  w3Close(): void {
    const sidebar = document.getElementById("mySidebar");
    if (sidebar) {
      this.renderer.setStyle(sidebar, 'display', 'none');
      this.isSidebarOpen = false;
    }
  }
}
