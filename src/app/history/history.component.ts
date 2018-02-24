import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { FlightService } from '../flight.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  customerId = this.authenticationService.getCustomer()._id;
  bookings: any = [];

  constructor(private authenticationService: AuthenticationService,
              private flightService: FlightService) { }

  ngOnInit() {
    this.flightService.getCustomerBookings(this.customerId).subscribe(bookings => {
      this.bookings = bookings;
    });
  }

}
