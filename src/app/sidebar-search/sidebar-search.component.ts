import { Component, OnInit } from '@angular/core';
import { FlightService } from '../flight.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-search',
  templateUrl: './sidebar-search.component.html',
  styleUrls: ['./sidebar-search.component.css']
})
export class SidebarSearchComponent implements OnInit {
  departures: any = [];
  destinations: any = [];
  allFlights: any = [];
  public travelClasses: Array<any> = [
    {
      class: 'Economy'
    },
    {
      class: 'Business'
    },
    {
      class: 'First'
    }
  ];

  public fareClasses: Array<any> = [
    {
      class: 'Adult'
    },
    {
      class: 'Senior'
    },
    {
      class: 'Child'
    }
  ];

  constructor(public flightService: FlightService,
    private router: Router) { }

  // On page load
  ngOnInit() {
    // Set default search parameters if not blank
    if (this.flightService.searchParameters.departure !== '') {
      this.departures.push(this.flightService.searchParameters.departure);
      this.destinations.push(this.flightService.searchParameters.destination);
    }
    // Get all flights and departure
    this.flightService.getAllFlights().subscribe(flights => {
      for (const flight of flights) {
        this.allFlights.push(flight);
        if (!this.departures.includes(flight.departure)) {
          this.departures.push(flight.departure);
        }
      }
    });
  }

  // Update destinations dropdown
  updateDestinations() {
    this.destinations = [];
    for (const flight of this.allFlights) {
      if (flight.departure === this.flightService.searchParameters.departure && !this.destinations.includes(flight.arrival)) {
        this.destinations.push(flight.arrival)
      }
    }
  }

  // Navigates to departure flights where flights are filtered using search parameters
  search() {
    // Sets flights in service
    this.flightService.setFlights();
    this.router.navigateByUrl('/flights/departure');
  }
}
