import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { FlightService } from '../flight.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  customerProfile = this.authenticationService.getCustomer();
  bookingId: string;
  booking: any = {};
  flights: any = [];
  tickets: any = [];
  constructor(private authenticationService: AuthenticationService,
              private activatedRoute: ActivatedRoute,
              private flightService: FlightService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.bookingId = params['id'];
    });

    this.flightService.getBooking(this.bookingId).subscribe(booking => {
      this.booking = booking;
      for (const ticket of this.booking.tickets) {
        this.flightService.getTicket(ticket).subscribe(ticketData => {
          this.tickets.push(ticketData);
          this.flightService.getFlight(ticketData.flight).subscribe(flightData => {
            this.flights.push(flightData);
          });
        });
      }
    });
  }

}
