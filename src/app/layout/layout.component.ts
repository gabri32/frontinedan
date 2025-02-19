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

  constructor(private router: Router, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.w3Open();  
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
