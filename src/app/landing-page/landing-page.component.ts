import { Component, OnInit, ViewChild, ElementRef ,ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { BackendService } from '../backend.service';
import swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { RegistroDialogComponent } from '../registro-dialog/registro-dialog.component'; // ajusta ruta
@Component({
  standalone: true,
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  imports: [CommonModule, FormsModule],
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
  toggleZoom = false;
bannerImages = [
  { image: '/baner1.jpeg', titulo: 'Bienvenidos', descripcion: 'Conoce nuestra institución' },
  { image: '/banner3.jpeg', titulo: 'Formación de calidad', descripcion: 'Comprometidos con la educación' },
  { image: '/banner2.jpeg', titulo: 'Eventos académicos', descripcion: 'Participa en nuestras actividades' }
];

currentBannerIndex = 0;

nextBanner() {
  const total = this.bannerImages.length;
  this.currentBannerIndex = (this.currentBannerIndex + 1) % total;
  const offset = -this.currentBannerIndex * 100;
  const slider = document.querySelector('.banner-track') as HTMLElement;
  if (slider) slider.style.transform = `translateX(${offset}%)`;
}

prevBanner() {
  const total = this.bannerImages.length;
  this.currentBannerIndex = (this.currentBannerIndex - 1 + total) % total;
  const offset = -this.currentBannerIndex * 100;
  const slider = document.querySelector('.banner-track') as HTMLElement;
  if (slider) slider.style.transform = `translateX(${offset}%)`;
}

  ngOnInit(): void {
    swal.showLoading();
    this.getInfoheaders();
    this.getEventos()
    this.startAutoSlide();
   swal.close(); 
  setInterval(() => {
    this.nextBanner();
  }, 5000); 
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
this.events = this.events.map((event: { fecha: string | number | Date; }) => ({
  ...event,
  fecha: new Date(event.fecha).toLocaleDateString('es-ES') // formato DD/MM/AAAA
}));

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
imagenAmpliada: string | null = null;

ampliarImagen(src: string): void {
  this.imagenAmpliada = src;
}

cerrarImagen(): void {
  this.imagenAmpliada = null;
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
currentBannerIndex1 = 0;

nextBanner1() {
  const total = this.bannerImages.length;
  this.currentBannerIndex = (this.currentBannerIndex + 1) % total;
  const offset = -this.currentBannerIndex * 100;
  const slider = document.querySelector('.banner-track') as HTMLElement;
  if (slider) slider.style.transform = `translateX(${offset}%)`;
}

prevBanner1() {
  const total = this.bannerImages.length;
  this.currentBannerIndex = (this.currentBannerIndex - 1 + total) % total;
  const offset = -this.currentBannerIndex * 100;
  const slider = document.querySelector('.banner-track') as HTMLElement;
  if (slider) slider.style.transform = `translateX(${offset}%)`;
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

  // Propiedad para manejar la sede activa
  sedeActiva: 'centro' | 'capusigra' = 'centro';

  // Método para cambiar entre sedes
  cambiarSede(sede: 'centro' | 'capusigra'): void {
    this.sedeActiva = sede;
  }

  // Propiedades para el formulario de contacto
  enviandoFormulario = false;

  // Método para enviar el formulario de contacto
  async enviarFormularioContacto(form: NgForm): Promise<void> {
    if (form.invalid) {
      swal.fire({
        title: 'Formulario incompleto',
        text: 'Por favor completa todos los campos obligatorios.',
        icon: 'warning',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    this.enviandoFormulario = true;

    try {
      const formData = {
        nombre: form.value.nombre,
        email: form.value.email,
        telefono: form.value.telefono || '',
        asunto: form.value.asunto,
        mensaje: form.value.mensaje,
        fecha: new Date().toISOString()
      };

      // Aquí puedes agregar la llamada a tu servicio backend
      // await this.backendService.enviarContacto(formData);

      // Por ahora, simularemos el envío
      await new Promise(resolve => setTimeout(resolve, 2000));

      swal.fire({
        title: '¡Mensaje enviado!',
        text: 'Gracias por contactarnos. Te responderemos pronto.',
        icon: 'success',
        confirmButtonText: 'Perfecto'
      });

      form.resetForm();
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      swal.fire({
        title: 'Error',
        text: 'Hubo un problema al enviar tu mensaje. Inténtalo de nuevo.',
        icon: 'error',
        confirmButtonText: 'Reintentar'
      });
    } finally {
      this.enviandoFormulario = false;
    }
  }

  // Método para abrir WhatsApp
  abrirWhatsApp(): void {
    const numeroWhatsApp = '573123456789'; // Reemplaza con el número real
    const mensaje = encodeURIComponent('Hola, me gustaría obtener más información sobre la I.E.M. Antonio Nariño.');
    const url = `https://wa.me/${numeroWhatsApp}?text=${mensaje}`;
    window.open(url, '_blank');
  }

}
