import { Routes } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';

//importacion de la landing
import { LandingPageComponent } from './landing-page/landing-page.component';

// Importa los componentes
import { LoginComponent } from './auth/login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { VoteComponent } from './vote/vote.component'
//import { HomeComponent } from './home/home.component';
import { InventarioComponent } from './inventario/inventario.component'
import { AuthGuard } from './auth.guard';
import { AdministracionComponent } from './administracion/administracion.component';
import { DocentesComponent } from './docentes/docentes.component';
import { EstudiantesComponent } from './estudiantes/estudiantes.component';
import { AdminAcademicaComponent } from './admin-academica/admin-academica.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
export const routes: Routes = [
  { path: '', component: LandingPageComponent }, // 👈 ahora esta es la raíz
  { path: 'login', component: LoginComponent },
  {
    path: 'layout', component: LayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: 'vote', component: VoteComponent }, 
      { path: 'inventario', component: InventarioComponent },
      { path: 'administracion', component: AdministracionComponent },
      {path:'adminacademica',component: AdminAcademicaComponent },
      {path:'profesores',component: DocentesComponent },
      {path:'estudiantes',component: EstudiantesComponent },
     {path:'usuarios',component: UsuariosComponent },
    ]
  },
  { path: '**', redirectTo: '' } 
];


export const appRoutingProviders = [provideRouter(routes)];
