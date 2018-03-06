import { Component, OnInit } from '@angular/core';
import { FlightService } from '../flight.service';
import { Router } from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  departures: any = [];
  destinations: any = [];
  allFlights: any = [];
  public travelClasses: Array<string> = ['Economy', 'Business', 'First'];
  public stops: Array<Number> = [0, 1, 2, 3, 4];
  public fareClasses: Array<string> = ['Adult', 'Senior', 'Child'];

  constructor(public flightService: FlightService,
    private router: Router) { }

  ngOnInit() {
    this.flightService.getAllFlights().subscribe(flights => {
      for (const flight of flights) {
        this.allFlights.push(flight);
        if (!this.departures.includes(flight.departure)) {
          this.departures.push(flight.departure);
        }
      }
    });
  }

  updateDestinations() {
    this.destinations = [];
    for (const flight of this.allFlights) {
      if (flight.departure === this.flightService.searchParameters.departure && !this.destinations.includes(flight.arrival)) {
        this.destinations.push(flight.arrival);
      }
    }
  }

  // Navigates to departure flights where flights are filtered using search parameters
  search() {
    this.router.navigateByUrl('/flights/departure');
  }
}
