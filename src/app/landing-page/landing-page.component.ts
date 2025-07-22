import { Component, OnInit, ViewChild, ElementRef ,ViewEncapsulation } from '@angular/core';
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
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None
})
export class LandingPageComponent implements OnInit {
  @ViewChild('slider', { static: false }) sliderRef!: ElementRef;
  header: any;
  slider: any;
  infoButtons: any;
  eventCards: any;
  hovering: any;
  mostrarTodos = false;
  events: any;
  constructor(
    private router: Router,
    private backendService: BackendService,
    private dialog: MatDialog
  ) { }
  isMobile = false;
  currentIndex = 0;
  slideInterval: any;
  visibleCards = 5;
  ngOnInit(): void {
    this.getInfoheaders();
    this.getEventos()
    this.startAutoSlide();
     this.isMobile = window.innerWidth <= 768;
  }

  async getInfoheaders() {
    try {
      const data = await this.backendService.getheaders();
      this.eventCards = data;
    } catch (error) {
      console.error('Error al obtener la información de landing:', error);
      swal.fire({ title: 'Error', text: 'No se pudo cargar la información.', icon: 'error' });
    }
  }
  async getEventos() {
    try {
      this.events = await this.backendService.getLandingEventos();
    } catch (error) {
      console.error("Error al cargar los eventos:", error);
      swal.fire({
        title: "Error",
        text: "Hubo un problema al cargar los eventos.",
        icon: "error",
        confirmButtonText: "Aceptar"
      });
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
  abrirRegistro() {
    this.dialog.open(RegistroDialogComponent, {
      width: '90%',
      maxWidth: '800px',
      height: '80vh',
      maxHeight: '90vh',
      panelClass: 'formulario-dialogo'
    });

  }
  scrollSlider(container: HTMLElement, distance: number): void {
    container.scrollBy({ left: distance, behavior: 'smooth' });
  }

abrirEnlace(url: string): void {
  if (url) {
    window.open(url, '_blank');
  }
}


  ngAfterViewInit(): void {
    this.startAutoSlide();
  }

  nextSlide(): void {
    const totalItems = this.eventCards.length;
    const maxIndex = totalItems - this.visibleCards;

    this.currentIndex = (this.currentIndex + 1) > maxIndex ? 0 : this.currentIndex + 1;
    this.updateSlider();
  }

  prevSlide(): void {
    const totalItems = this.eventCards.length;
    const maxIndex = totalItems - this.visibleCards;

    this.currentIndex = this.currentIndex === 0 ? maxIndex : this.currentIndex - 1;
    this.updateSlider();
  }

  updateSlider(): void {
    const slideWidth = 160 + 32;
    const offset = this.currentIndex * slideWidth;
    this.sliderRef.nativeElement.style.transform = `translateX(-${offset}px)`;
  }

  startAutoSlide(): void {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 4000);
  }

  ngOnDestroy(): void {
    clearInterval(this.slideInterval);
  }

}
