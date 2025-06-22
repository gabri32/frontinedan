import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BackendService } from '../backend.service';
import swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { RegistroDialogComponent } from '../registro-dialog/registro-dialog.component'; // ajusta ruta
@Component({
  standalone: true,
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  imports: [CommonModule]
})
export class LandingPageComponent implements OnInit {
  header: any;
  slider: any;
  infoButtons: any;
  eventCards: any;

  constructor(
    private router: Router,
    private backendService: BackendService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getInfoLanding();
  }

  async getInfoLanding() {
    try {
      const data = await this.backendService.getInfo();
      this.header = data.find((s: any) => s.type === 'header');
      this.slider = data.find((s: any) => s.type === 'slider');
      this.infoButtons = data.find((s: any) => s.type === 'info_buttons');
      this.eventCards = data.find((s: any) => s.type === 'event_cards');
    } catch (error) {
      console.error('Error al obtener la información de landing:', error);
      swal.fire({ title: 'Error', text: 'No se pudo cargar la información.', icon: 'error' });
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
  abrirRegistro() {
this.dialog.open(RegistroDialogComponent, {
  width: '90%',
  maxWidth: '800px',       // 👈 límite de ancho máximo
  height: '90vh',          // 👈 límite de altura
  maxHeight: '90vh',
  panelClass: 'formulario-dialogo'
});

  }
}
