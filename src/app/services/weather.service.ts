import { Injectable, signal, WritableSignal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private dataSubject = new BehaviorSubject<string>('home'); 
  tabData$ = this.dataSubject.asObservable();

  // updateData(newData: string) {
  //   this.dataSubject.next(newData);
  // }
  updateData(value: string) {
    if (this.dataSubject.getValue() !== value) {  
      this.dataSubject.next(value);
    }
  }
  

  private indiaWeatherMasterData = [
    {
      id: 1,
      location: 'Mumbai, Maharashtra',
      temperature: 32,
      condition: 'Sunny',
      icon: 'sunny',
    },
    {
      id: 2,
      location: 'Delhi, Delhi',
      temperature: 28,
      condition: 'Haze',
      icon: 'partly-sunny',
    },
    {
      id: 3,
      location: 'Bangalore, Karnataka',
      temperature: 26,
      condition: 'Cloudy',
      icon: 'cloudy',
    },
    {
      id: 4,
      location: 'Kolkata, West Bengal',
      temperature: 30,
      condition: 'Rainy',
      icon: 'rainy',
    },
    {
      id: 5,
      location: 'Chennai, Tamil Nadu',
      temperature: 34,
      condition: 'Hot',
      icon: 'thermometer',
    },
    {
      id: 6,
      location: 'Hyderabad, Telangana',
      temperature: 29,
      condition: 'Partly Cloudy',
      icon: 'cloudy-night',
    },
    {
      id: 7,
      location: 'Pune, Maharashtra',
      temperature: 27,
      condition: 'Clear',
      icon: 'sunny',
    },
    {
      id: 8,
      location: 'Ahmedabad, Gujarat',
      temperature: 33,
      condition: 'Dry',
      icon: 'sunny-outline',
    },
    {
      id: 9,
      location: 'Jaipur, Rajasthan',
      temperature: 31,
      condition: 'Windy',
      icon: 'cloudy-outline',
    },
    {
      id: 10,
      location: 'Lucknow, Uttar Pradesh',
      temperature: 29,
      condition: 'Foggy',
      icon: 'cloud',
    },
    {
      id: 11,
      location: 'Bhopal, Madhya Pradesh',
      temperature: 28,
      condition: 'Overcast',
      icon: 'cloudy-night-outline',
    },
    {
      id: 12,
      location: 'Patna, Bihar',
      temperature: 30,
      condition: 'Humid',
      icon: 'partly-sunny-outline',
    },
    {
      id: 13,
      location: 'Chandigarh, Punjab',
      temperature: 25,
      condition: 'Breezy',
      icon: 'cloud-outline',
    },
    {
      id: 14,
      location: 'Bhubaneswar, Odisha',
      temperature: 32,
      condition: 'Drizzle',
      icon: 'rainy-outline',
    },
    {
      id: 15,
      location: 'Guwahati, Assam',
      temperature: 27,
      condition: 'Showers',
      icon: 'rainy',
    },
    {
      id: 16,
      location: 'Dehradun, Uttarakhand',
      temperature: 24,
      condition: 'Cold',
      icon: 'snow',
    },
    {
      id: 17,
      location: 'Shimla, Himachal Pradesh',
      temperature: 16,
      condition: 'Snowy',
      icon: 'snow-outline',
    },
    {
      id: 18,
      location: 'Srinagar, Jammu & Kashmir',
      temperature: 10,
      condition: 'Snowfall',
      icon: 'snow',
    },
    {
      id: 19,
      location: 'Goa, Goa',
      temperature: 29,
      condition: 'Humid',
      icon: 'water',
    },
    {
      id: 20,
      location: 'Varanasi, Uttar Pradesh',
      temperature: 31,
      condition: 'Hazy',
      icon: 'partly-sunny-outline',
    },
  ];

  private weatherData = [
    {
      id: 1,
      location: 'Mumbai, Maharastra',
      temperature: 32,
      condition: 'Sunny',
      icon: 'sunny',
    },
    {
      id: 2,
      location: 'Delhi',
      temperature: 28,
      condition: 'Cloudy',
      icon: 'cloudy',
    },
    {
      id: 3,
      location: 'Bangalore',
      temperature: 25,
      condition: 'Rainy',
      icon: 'rainy',
    }
  ];

  private masterData: any = [];

  private currentWeatherDetails = [
    { icon: 'thermometer-outline', title: 'Min-Max', unit: '75°-90°' },
    { icon: 'rainy-outline', title: 'Precipitation', unit: '0%' },
    { icon: 'water-outline', title: 'Humidity:', unit: '47%' },
    { icon: 'contract-outline', title: 'Wind', unit: '4 mps' },
    { icon: 'eye-outline', title: 'visibility', unit: '12 mps' }
  ]

  constructor() {
    this.initializeStorage();
  }

  private initializeStorage() {
    const storedData = localStorage.getItem('weatherData');
    if (!storedData) {
      const tempObj = {
        favouriteWeather: [],
        recentSearchedData: [],
      };
      localStorage.setItem('weatherData', JSON.stringify(tempObj));
    }
  }

  getMasterData() {
    this.masterData = JSON.parse(localStorage.getItem('weatherData') || '[]');
    return this.masterData;
  }
  /**
   * Get all stored weather data.
   * @returns An array of weather objects.
   */
  getWeatherData() {
    return this.indiaWeatherMasterData;
  }

  /**
   * Get current city weather data.
   * @returns object of current city weather.
   */
  getCurrentCityData() {
    return this.indiaWeatherMasterData[0];
  }

  /**
   * Get current city weather data.
   * @returns object of current city weather.
   */
  getcurrentWeatherDetails() {
    return this.currentWeatherDetails;
  }

  /**
   * Get weather data by location name.
   * @param location - City name to filter weather data.
   * @returns A single weather object or undefined if not found.
   */
  getWeatherByLocation(location: string) {
    return this.weatherData.find((data) => data.location.toLowerCase() === location.toLowerCase());
  }

  getFavouriteWeatherData() {
    const storedData = localStorage.getItem('weatherData');
    if (!storedData) return [];
  
    const { favouriteWeather } = JSON.parse(storedData);
    return favouriteWeather
      .map((fav: any) => {
        const weather = this.indiaWeatherMasterData.find(w => w.id === fav.id);
        return weather ? { ...weather, timestamp: fav.timestamp } : null;
      })
      .filter(Boolean); // Removes null values efficiently
  }  

  updateFavouriteweatherData(id: number,remove = false) {
    let tempData = JSON.parse(localStorage.getItem('weatherData') || '[]');
    if(remove){
      tempData.favouriteWeather = [];
    } else {
      const index = tempData.favouriteWeather.findIndex((item: any) => item.id === id);
      if (index !== -1) {
        // ID exists, remove it
        tempData.favouriteWeather.splice(index, 1);
      } else {
        // ID not found, add it
        tempData.favouriteWeather.push({ id:id, timestamp: new Date().toISOString() });
      }
    }
    let tempObj = {
      favouriteWeather: tempData.favouriteWeather,
      recentSearchedData: tempData.recentSearchedData,
    }
    localStorage.setItem('weatherData', JSON.stringify(tempObj));
  }

  getRecentSearchedWeatherData() {
    const storedData = localStorage.getItem('weatherData');
    if (!storedData) return [];
  
    const { recentSearchedData } = JSON.parse(storedData);
    return recentSearchedData
      .map((fav: any) => {
        const weather = this.indiaWeatherMasterData.find(w => w.id === fav.id);
        return weather ? { ...weather, timestamp: fav.timestamp } : null;
      })
      .filter(Boolean); // Removes null values efficiently
  }  

  updateSearchWeather(weather:any,remove = false){
    let tempData = JSON.parse(localStorage.getItem('weatherData') || '[]');
    if(remove){
      tempData.recentSearchedData = [];
    } else {
      const index = tempData.recentSearchedData.findIndex((item: any) => item.id === weather.id);
      if (index !== -1) {
        // ID exists, update it
        // tempData.favouriteWeather.splice(index, 1);
        tempData.recentSearchedData[index].timestamp = new Date().toISOString();
      } else {
        // ID not found, add it
        tempData.recentSearchedData.push({ id:weather.id, timestamp: new Date().toISOString() });
      }
    }
    let tempObj = {
      favouriteWeather: tempData.favouriteWeather,
      recentSearchedData: tempData.recentSearchedData,
    }

    localStorage.setItem('weatherData', JSON.stringify(tempObj));
  }

}
