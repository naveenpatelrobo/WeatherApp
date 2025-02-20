import { Component } from '@angular/core';
import { WeatherService } from './services/weather.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/folder/home', tab:'home'},
    { title: 'Favourite', url: '/folder/favourite', tab:'favourite'},
    { title: 'Recent Search', url: '/folder/recent-search', tab:'recentSearch'},
  ];
  // public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(private weatherService: WeatherService) {}

  updateCurrenttab(tab:string){
      this.weatherService.updateData(tab);
  }

}
