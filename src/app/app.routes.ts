import { Routes } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Importa los componentes
import { LoginComponent } from './auth/login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { VoteComponent } from './vote/vote.component'
//import { HomeComponent } from './home/home.component';
import { InventarioComponent } from './inventario/inventario.component'
import { AuthGuard } from './auth.guard';
import { AdministracionComponent } from './administracion/administracion.component';
import { administracionChildRoutes } from './administracion_academica/administracion.routes';
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'layout', component: LayoutComponent, canActivate: [AuthGuard],
    children: [{ path: 'vote', component: VoteComponent }, 
      { path: 'inventario', component: InventarioComponent },
    { path: 'administracion', component: AdministracionComponent },
   {path:'administracion_academica',children:administracionChildRoutes} ]
  }, // ✅ Protegemos la ruta   
  { path: '**', redirectTo: 'login' } // Redirigir cualquier otra ruta al login
];

export const appRoutingProviders = [provideRouter(routes)];
