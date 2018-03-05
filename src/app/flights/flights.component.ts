import { Component, OnInit } from '@angular/core';
import { FlightService } from '../flight.service';

@Component({
  selector: 'app-flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.css']
})
export class FlightsComponent implements OnInit {
  flights: any = [];
  title: string;

  constructor(public flightService: FlightService) { }

  // When page is loaded
  ngOnInit() {
    // Sets flights in service
    this.flightService.setFlights();
    // If booking type is round trip and the departure has been booked
    if (this.flightService.searchParameters.bookingType === 'RoundTrip' && this.flightService.searchParameters.firstBooked) {
      this.title = 'Return Flights';
    } else {
      this.title = 'Departure Flights';
    }
  }

}
