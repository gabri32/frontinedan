import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HighchartsChartModule } from 'highcharts-angular';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,HighchartsChartModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'iem-antonio-narino';
}
