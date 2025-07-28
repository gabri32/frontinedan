import { Routes } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { RoleGuard } from './Role.Guard'; 
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
import { DetalleTallerComponentComponent } from './detalle-taller-component/detalle-taller-component.component';
import { RespuestasTallerComponent } from './docentes/respuestas-taller/respuestas-taller.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'layout',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'vote', component: VoteComponent },

      {
        path: 'inventario',
        component: InventarioComponent,
        canActivate: [RoleGuard],
        data: { roles: [3] } // Solo rol 3 puede acceder
      },
      {
        path: 'administracion',
        component: AdministracionComponent,
        canActivate: [RoleGuard],
        data: { roles: [3] }
      },
      {
        path: 'adminacademica',
        component: AdminAcademicaComponent,
        canActivate: [RoleGuard],
        data: { roles: [3] }
      },
      {
        path: 'profesores',
        component: DocentesComponent,
        canActivate: [RoleGuard],
        data: { roles: [1] } // Solo profesores
      },
      {
        path: 'estudiantes',
        component: EstudiantesComponent,
        canActivate: [RoleGuard],
        data: { roles: [2] } // Solo estudiantes
      },
      {
        path: 'estudiantes/taller/:id',
        component: DetalleTallerComponentComponent,
        canActivate: [RoleGuard],
        data: { roles: [2] }
      },
      {
        path: 'profesores/taller/:id/respuestas',
        component: RespuestasTallerComponent,
        canActivate: [RoleGuard],
        data: { roles: [1] }
      },
      {
        path: 'usuarios',
        component: UsuariosComponent,
        canActivate: [RoleGuard],
        data: { roles: [3] }
      },
    ]
  },
  { path: '**', redirectTo: '' }
];



export const appRoutingProviders = [provideRouter(routes)];
