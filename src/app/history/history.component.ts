import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { FlightService } from '../flight.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  // Set customer id from auth service
  public customerId = this.authenticationService.getCustomer()._id;
  public bookings: any = [];

  constructor(private authenticationService: AuthenticationService,
    private flightService: FlightService) { }

  // On page load
  ngOnInit() {
    // Get customer bookings from customer id
    this.flightService.getCustomerBookings(this.customerId).subscribe(bookings => {
      this.bookings = bookings;
    });
  }

}
