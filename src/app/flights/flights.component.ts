import { Component, OnInit } from '@angular/core';
import { FlightService } from '../flight.service';

@Component({
  selector: 'app-flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.css']
})
export class FlightsComponent implements OnInit {

  flights: any = [];

  constructor(private flightService: FlightService) { }

  ngOnInit() {
    this.flightService.getFlights().subscribe(data => {
      this.flights = data;
    });
  }

}
