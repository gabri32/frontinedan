import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
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
  cargandoDatos = true;
  banner:any;
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
    { image: '', titulo: 'Bienvenidos', descripcion: 'Conoce nuestra institución' },
    { image: '', titulo: 'Formación de calidad', descripcion: 'Comprometidos con la educación' },
    { image: '', titulo: 'Eventos académicos', descripcion: 'Participa en nuestras actividades' }
  ];
imagenAmpliada: string | null = null;

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
    
    // Inicializar funcionalidades básicas
    this.initScrollAnimations();
    this.initHeaderScroll();
    
    // Banner auto-slide
    setInterval(() => {
      this.nextBanner();
    }, 5000);
    
    this.isMobile = window.innerWidth <= 768;
    
    // Cargar datos
    this.cargarDatos();
  }

  private async cargarDatos(): Promise<void> {
    swal.showLoading();
    
    try {
      // Cargar headers
      await this.getInfoheaders();
      
      // Cargar eventos
      await this.getEventos();
      await this.getBannerimages();
      this.cargandoDatos = false;
      
    } catch (error) {
      this.cargandoDatos = false;
    } finally {
      swal.close();
    }
  }
   async getBannerimages(): Promise<void> {
  try {
    this.banner = await this.backendService.getLandingImages();
    console.log(this.banner)
for (let i = 0; i < this.bannerImages.length; i++) {
  this.bannerImages[i].image = this.banner[i].foto;
}

console.log(this.bannerImages)
    // Verificar si hay menos de 3 imágenes y rellenar con objetos vacíos
    const cantidadFaltante = 3 - this.banner.length;

    for (let i = 0; i < cantidadFaltante; i++) {
      this.banner.push({
        id: 'N/A',
        foto: '',
        imagen: ''
      });
      
    }}catch(error){
      console.log(error)
    }}
  async getInfoheaders(): Promise<void> {
    try {
      const data = await this.backendService.getheaders();
      
      if (data && Array.isArray(data)) {
        this.eventCards = data;
      } else {
        this.eventCards = [];
      }

    } catch (error) {
      console.error(' Error al obtener headers:', error);
      this.eventCards = [];
      // No mostrar error al usuario para no interrumpir la experiencia
    }
  }
  async getEventos(): Promise<void> {
    try {
      const data = await this.backendService.getLandingEventos();
      
      if (data && Array.isArray(data)) {
        this.events = data.map((event: { fecha: string | number | Date; }) => ({
          ...event,
          fecha: new Date(event.fecha).toLocaleDateString('es-ES')
        }));
      } else {
        console.log(' No se recibieron datos válidos para eventos');
        this.events = [];
      }

    } catch (error) {
      console.error(' Error al cargar eventos:', error);
      this.events = [];
      // No mostrar error al usuario para no interrumpir la experiencia
    }
  }
  

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
    setTimeout(() => {
      if (this.eventCards && this.eventCards.length > 0) {
        this.startAutoSlide();
      }
    }, 1000);
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
    if (this.eventCards && this.eventCards.length > 0) {
      const totalItems = this.eventCards.length;
      
      // Lógica simplificada: avanzar de uno en uno
      this.currentIndex = (this.currentIndex + 1) % totalItems;
      this.updateSlider();
    } else {
      console.log(' No eventCards available');
    }
  }

  prevSlide(): void {
    if (this.eventCards && this.eventCards.length > 0) {
      const totalItems = this.eventCards.length;
      
      // Lógica simplificada: retroceder de uno en uno
      this.currentIndex = this.currentIndex === 0 ? totalItems - 1 : this.currentIndex - 1;
      this.updateSlider();
    } else {
      console.log('No eventCards available');
    }
  }

  private getVisibleCards(): number {
    // Calcular cuántas cards son visibles según el ancho de pantalla
    const screenWidth = window.innerWidth;
    if (screenWidth < 480) return 1;
    if (screenWidth < 768) return 2;
    if (screenWidth < 1024) return 3;
    return Math.min(5, this.eventCards?.length || 5);
  }

  updateSlider(): void {
    if (this.sliderRef && this.sliderRef.nativeElement) {
      const slideWidth = 160 + 32; // ancho del item + margen
      const offset = this.currentIndex * slideWidth;
      this.sliderRef.nativeElement.style.transform = `translateX(-${offset}px)`;
    } else {
      console.log('SliderRef not available:', this.sliderRef);
    }
  }

  startAutoSlide(): void {
    // Solo iniciar el auto-slide si hay datos
    if (this.eventCards && this.eventCards.length > 0) {
      this.slideInterval = setInterval(() => {
        this.nextSlide();
      }, 4000);
    } else {
      // Reintentar después de un tiempo si no hay datos aún
      setTimeout(() => {
        if (this.eventCards && this.eventCards.length > 0 && !this.slideInterval) {
          this.startAutoSlide();
        }
      }, 1000);
    }
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
    const numeroWhatsApp = '573123456789'; // 
    const mensaje = encodeURIComponent('Hola, me gustaría obtener más información sobre la I.E.M. Antonio Nariño.');
    const url = `https://wa.me/${numeroWhatsApp}?text=${mensaje}`;
    window.open(url, '_blank');
  }






  // Inicializar animaciones de scroll
  private initScrollAnimations(): void {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    // Observar todas las secciones animadas después de que se rendericen
    setTimeout(() => {
      const animatedSections = document.querySelectorAll('.section-animated');
      animatedSections.forEach(section => observer.observe(section));
    }, 100);
  }

  // Inicializar efectos del header al hacer scroll
  private initHeaderScroll(): void {
    window.addEventListener('scroll', () => {
      const header = document.getElementById('main-header');
      if (header) {
        if (window.scrollY > 100) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
    });

    // Listener para redimensionar ventana y actualizar slider
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth <= 768;
      // Resetear el índice si es necesario
      if (this.eventCards && this.eventCards.length > 0) {
        const visibleItems = this.getVisibleCards();
        const maxIndex = Math.max(0, this.eventCards.length - visibleItems);
        if (this.currentIndex > maxIndex) {
          this.currentIndex = maxIndex;
          this.updateSlider();
        }
      }
    });
  }

  // Método de prueba para verificar el slider
  testSlider(): void {
    console.log('🧪 Test Slider');
    console.log('EventCards:', this.eventCards?.length || 'No data');
    console.log('SliderRef:', this.sliderRef ? 'Available' : 'NOT Available');
    console.log('Current Index:', this.currentIndex);
    
    if (this.sliderRef && this.sliderRef.nativeElement) {
      console.log('Current transform:', this.sliderRef.nativeElement.style.transform);
    } else {
      console.log('SliderRef is NOT available');
    }
  }

}
