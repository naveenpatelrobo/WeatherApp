import { Component, HostListener, OnInit, ElementRef, ViewChild } from '@angular/core';
import { WeatherService } from '../services/weather.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
  standalone: false,
})

export class FolderPage implements OnInit {
  currentDate: Date = new Date();
  currentWeatherData: any = {};
  detailsWeather: any = [];
  favourites: any = [];
  recentSearches: any = [];
  selectedSegment = '';
  weatherData: any[] = [];
  filteredWeatherData: any[] = [];
  // showList: boolean = false;
  searchTerm: string = '';

  searchQuery: string = '';
  popoverOpen: boolean = false;

  menuTabs = [
    { value: 'home', contentId: 'home', routerLink: '/folder/home', label: 'HOME' },
    { value: 'favourite', contentId: 'favourite', routerLink: '/folder/favourite', label: 'FAVOURITE' },
    { value: 'recentSearch', contentId: 'recentSearch', routerLink: '/folder/recent-search', label: 'RECENT SEARCH' }
  ];
  temperatureUnitSelected: any = 'C';

  constructor(private weatherService: WeatherService) {
    // Update time every minute
    setInterval(() => {
      this.currentDate = new Date();
    }, 60000);
  }


  ngOnInit() {
    // load initial Data 
    this.loadCurrentData();
    this.loadWeatherDetails();
    this.getFavouriteWeatherData();
    this.getRecentSearchData();

    // setting search list
    this.weatherData = this.weatherService.getWeatherData();
    this.filteredWeatherData = [...this.weatherData];

    // handle click from sideNav
    this.weatherService.tabData$.subscribe(data => {
      this.changeSegment(data) // Update local variable when data changes
    });
  }

  // check records is in favourite data or not 
  isFavouriteCheck(id: any) {
    return this.favourites.some((item: any) => item.id === id);
  }

  // add remove records in favourite data
  toggleFavourite() {
    this.weatherService.updateFavouriteweatherData(this.currentWeatherData.id)
    this.getFavouriteWeatherData();
  }

  // based on search keyword filter search list 
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

  // on selection of search list, update records 
  onSelectItem(seletcedWeather: string) {
    // this.searchControl.setValue(location); // Set selected value
    this.currentWeatherData = seletcedWeather;
    // console.log(this.searchControl.value);
    // this.showList = false; // Hide list after selection
    this.weatherService.updateSearchWeather(seletcedWeather);
    this.getRecentSearchData();
    this.changeSegment('home')
    this.searchTerm = '';
    this.popoverOpen = false;
  }

  // load favourite tab data 
  getFavouriteWeatherData() {
    this.favourites = this.weatherService.getFavouriteWeatherData();
  }

  // load recent search tab data 
  getRecentSearchData() {
    this.recentSearches = this.weatherService.getRecentSearchedWeatherData();
  }

  // load detail weather tab data 
  loadWeatherDetails() {
    this.detailsWeather = this.weatherService.getcurrentWeatherDetails();
  }

  // load intial current home tab data 
  loadCurrentData() {
    this.currentWeatherData = this.weatherService.getCurrentCityData();
  }

  // Manually change the segment
  changeSegment(segment: any) {
    this.selectedSegment = segment;
  }

  // Handles user segment change
  onSegmentChange(event: any) {
    this.selectedSegment = event.detail.value;
  }

  // handle remove all favourite records / confirmation popover
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

  // handle remove all recent searched records / confirmation popover
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

  // convert temperature
  convertTemperature(): number {
    if (this.temperatureUnitSelected === 'C') {
      return this.currentWeatherData.temperature; // C to F 
    } else {
      return (this.currentWeatherData.temperature * 9) / 5 + 32; // C to F 
      // return ((this.currentWeatherData.temperature - 32) * 5) / 9; // F to C
    }
  }

  onSegmentChangeTempChange(event: any) {
    this.temperatureUnitSelected = event.detail.value;
    console.log('hello - ', event.detail.value)
  }

  openPopover(event: any) {
    this.popoverOpen = true; // Open the popover
    this.filterWeatherData()
    // this.filterFruits(); // Ensure filtered list appears immediately
  }

  // filterFruits() {
  //   console.log(this.weatherData, this.searchQuery)
  //   this.filteredWeatherData = this.weatherData.filter(fruit =>
  //     fruit.location.toLowerCase().includes(this.searchQuery.toLowerCase())
  //   );
  // }

  // selectFruit(fruit: string) {
  //   this.searchQuery = fruit;
  //   this.popoverOpen = false; // Close popover after selection
  // }

  popOverCloseOutSideClick() {
    setTimeout(() => {
      this.popoverOpen = false;
      this.searchTerm = '';
    }, 500);
  }
}
