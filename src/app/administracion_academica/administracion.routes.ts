import { Routes } from '@angular/router';
import { AdminAcademicaComponent } from './admin-academica/admin-academica.component';

export const administracionChildRoutes: Routes = [
  {
    path: '',
    component: AdminAcademicaComponent, // Este puede tener tabs u opciones generales
    children: [
      {
        path: 'docentes',
        loadComponent: () =>
          import('./pages/administracion-docentes/administracion-docentes.component').then(m => m.AdministracionDocentesComponent),
      },
      {
        path: 'estudiantes',
        loadComponent: () =>
          import('./pages/estudiantes/estudiantes.component').then(m => m.EstudiantesComponent),
      },
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
      }
    ]
  }
];
