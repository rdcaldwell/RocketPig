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

  ngOnInit() {
    this.flightService.setFlights();

    if (this.flightService.searchParameters.bookingType === 'RoundTrip' && this.flightService.searchParameters.firstBooked) {
      this.title = 'Return Flights';
    } else {
      this.title = 'Departure Flights';
    }
  }

}
