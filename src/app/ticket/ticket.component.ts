import { Component, OnInit, Input } from '@angular/core';
import { FlightService } from '../flight.service';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent implements OnInit {

  @Input() public ticket: any;
  public flight: any = {};

  constructor(private flightService: FlightService) { }

  // On page load
  ngOnInit() {
    // Get flight data from ticket from api
    this.flightService.getFlight(this.ticket.flight).subscribe(flight => {
      this.flight = flight;
    });
  }

}
