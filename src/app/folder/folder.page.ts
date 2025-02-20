import { Component, computed, HostListener, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WeatherService } from '../services/weather.service';
import { FormControl } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
  standalone: false,
})

export class FolderPage implements OnInit {
  // public folder!: string;
  // private activatedRoute = inject(ActivatedRoute);
  selectedTab: string = 'home';
  currentDate: Date = new Date();
  currentLocation: string = "Udapi, karnataka";
  isFavourite: boolean = false; // Initially not selected
  currentWeatherData: any = {};
  masterData: any = [];
  detailsWeather: any = [];
  favourites: any = [];
  recentSearches: any = [];
  selectedSegment = '';
  // selectedSegment: WritableSignal<string> = signal('home');
  menuTabs = [
    { value: 'home', contentId: 'home', routerLink: '/folder/home', label: 'HOME' },
    { value: 'favourite', contentId: 'favourite', routerLink: '/folder/favourite', label: 'FAVOURITE' },
    { value: 'recentSearch', contentId: 'recentSearch', routerLink: '/folder/recent-search', label: 'RECENT SEARCH' }
  ];

  constructor(private weatherService: WeatherService) {
    // Update time every minute
    setInterval(() => {
      this.currentDate = new Date();
    }, 60000);
  }


  weatherData: any[] = [];
  filteredWeatherData: any[] = [];
  searchControl: FormControl = new FormControl('');
  showList: boolean = false;
  searchTerm: string = '';
  ngOnInit() {
    // this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.loadWeatherData();
    this.loadCurrentData();
    this.loadWeatherDetails();
    this.getFavouriteWeatherData();
    this.getRecentSearchData();

    this.weatherData = this.weatherService.getWeatherData();
    this.filteredWeatherData = [...this.weatherData];

    this.weatherService.tabData$.subscribe(data => {
     this.changeSegment(data) // Update local variable when data changes
    });
  }

  isFavouriteCheck(id:any) {
    return this.favourites.some((item: any) => item.id === id);
  }

  toggleFavourite() {
    this.weatherService.updateFavouriteweatherData(this.currentWeatherData.id)
    this.getFavouriteWeatherData();
  }

  filterWeatherData() {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.filteredWeatherData = [...this.weatherData];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredWeatherData = this.weatherData.filter((weather) =>
        weather.location.toLowerCase().includes(term)
      );
    }
  }

  onSearchFocus() {
    this.showList = true;
  }

  onSelectItem(seletcedWeather: string) {
    // this.searchControl.setValue(location); // Set selected value
    this.currentWeatherData = seletcedWeather;
    console.log(this.searchControl.value);
    this.showList = false; // Hide list after selection
    this.weatherService.updateSearchWeather(seletcedWeather);
    this.getRecentSearchData();
    this.changeSegment('home')
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.search-container')) {
      this.showList = false;
    }
  }
  /**
  * Fetch all weather data from the service.
  */
  loadWeatherData() {
    // this.favourites = this.weatherService.getWeatherData();
    this.masterData = this.weatherService.getMasterData();
  }

  getFavouriteWeatherData() {
    this.favourites = this.weatherService.getFavouriteWeatherData();
    console.log('this.favourites', this.favourites)
  }

  getRecentSearchData(){
    this.recentSearches = this.weatherService.getRecentSearchedWeatherData();
  }

  loadWeatherDetails() {
    this.detailsWeather = this.weatherService.getcurrentWeatherDetails();
  }

  loadCurrentData() {
    this.currentWeatherData = this.weatherService.getCurrentCityData();
  }


  // Manually change the segment
  changeSegment(segment: any) {
    this.selectedSegment = segment;
    // this.selectedSegment.set(segment)
  }

  // Handles user segment change
  onSegmentChange(event: any) {
    console.log('Segment changed:', event.detail.value);
    this.selectedSegment = event.detail.value;
  }

  removeAllFavourite(flag: string) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove all!",
      backdrop: false,
      allowOutsideClick: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.weatherService.updateFavouriteweatherData(0, true)
        this.getFavouriteWeatherData();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your work has been saved",
          showConfirmButton: false,
          timer: 1500,
          backdrop: false
        });
      }
    });
  }

  removeAllrecentSearch(flag: string) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove all!",
      backdrop: false,
      allowOutsideClick: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.weatherService.updateSearchWeather(0, true)
        this.getRecentSearchData();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your work has been saved",
          showConfirmButton: false,
          timer: 1500,
          backdrop: false
        });
      }
    });
  }

  convertTemperature(temperatureUnit:any,temperature:any): number {
    if (temperatureUnit === 'C') {
      return (temperature * 9) / 5 + 32; // C to F 
    } else {
      return ((temperature - 32) * 5) / 9; // F to C
    }
  }

}
