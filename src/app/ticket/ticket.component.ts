import { Component, OnInit, Input } from '@angular/core';
import { FlightService } from '../flight.service';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent implements OnInit {
  @Input() private ticket: any;
  flight: any = {};
  constructor(private flightService: FlightService) { }

  ngOnInit() {
    this.flightService.getFlight(this.ticket.flight).subscribe(flight => {
      this.flight = flight;
    });
  }

}
