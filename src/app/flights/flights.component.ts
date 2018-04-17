import { Component, OnInit } from '@angular/core';
import { FlightService } from '../flight.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.css']
})
export class FlightsComponent implements OnInit {

  public flights: any = [];
  public title: string;

  constructor(public flightService: FlightService,
    private router: Router) { }

  // When page is loaded
  ngOnInit() {
    // Sets flights in service
    this.flightService.setFlights();
    // If booking type is round trip and the departure has been booked
    if (this.router.url === '/flights/return') {
      this.title = 'Return Flights';
    } else {
      this.title = 'Departure Flights';
    }
  }

}
