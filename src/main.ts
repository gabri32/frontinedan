import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatTabsModule } from '@angular/material/tabs';  // ✅ Importar MatTabsModule
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { HighchartsChartModule } from 'highcharts-angular'; 
bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule, ReactiveFormsModule,MatTabsModule, MatTableModule,
      MatPaginatorModule,
      MatSortModule,
      HighchartsChartModule),
    provideRouter(routes), provideAnimationsAsync(), provideAnimationsAsync(), provideAnimationsAsync()
  ]
})
  .catch(err => console.error(err));
