import { Routes } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Importa los componentes
import { LoginComponent } from './auth/login/login.component';
import { LayoutComponent } from './layout/layout.component';
import{VoteComponent} from './vote/vote.component'
//import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'layout', component: LayoutComponent, 
    children:[  {path:'vote',component:VoteComponent}]
  },

];

export const appRoutingProviders = [provideRouter(routes)];
