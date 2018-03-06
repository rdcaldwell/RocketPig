import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FlightService } from '../flight.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
declare var stripe: any;
declare var elements: any;
@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit, AfterViewInit, OnDestroy {
  packageData: any = {};
  bookings: BookingProperties = {
    customerId: '',
    rewardCode: '',
    total: 0,
    tickets: [],
    date: new Date(),
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: 0,
    totalMiles: 0,
  };
  card: any;
  cardName: string;
  codeMessage: string;

  constructor(public flightService: FlightService,
    private router: Router,
    private authenticationService: AuthenticationService) { }

  // When page is closed
  ngOnDestroy() {
    // Destroys stripe card object
    this.card.destroy();
  }

  // After page is loaded
  ngAfterViewInit() {
    // Creates Stripe.js element
    this.card = elements.create('card');
    this.card.mount('#card-element');
  }

  // When page is loaded
  ngOnInit() {
    // Sets user id if user is logged in
    if (this.authenticationService.isLoggedIn()) {
      this.bookings.customerId = this.authenticationService.getCustomer()._id;
    } else {
      this.bookings.customerId = null;
    }
    // Booking total and miles from cart information
    this.bookings.total = this.flightService.cart.bookingData.total;
    this.bookings.totalMiles = this.flightService.cart.bookingData.totalMiles;
    this.flightService.updateCart();
  }

  // Checks reward code validity from api
  checkRewardCode() {
    this.flightService.checkRewardCode({
      customerId: this.bookings.customerId,
      rewardCode: this.bookings.rewardCode
    }).subscribe(status => {
      this.codeMessage = status;
      if (status === 'Reward code applied successfully') {
        // Applies discount if successful
        this.flightService.total *= .95;
      }
    });
  }

  // Creates booking
  async createBooking() {
    // Waits for stripe token to be created from Stripe.js
    const { token, error } = await stripe.createToken(this.card, {
      name: this.cardName
    });
    if (error) {
      return;
    } else {
      console.log('Success!', token);
    }
    // Update total and miles from service
    this.bookings.total = this.flightService.total;
    this.bookings.totalMiles = this.flightService.totalMiles;
    // Create ticket objects
    this.flightService.postTickets(this.flightService.tickets).subscribe(ticketIds => {
      // Saves ticket ids in booking object
      this.bookings.tickets = ticketIds;
      // Creates booking object
      this.flightService.postBooking(this.bookings).subscribe(bookingId => {
        // Data for Stripe charge
        const chargeJSON = {
          token: token,
          description: `Charge for Booking ID: ${bookingId}`,
          amount: this.bookings.total
        };
        // Checkout using Stripe API
        this.flightService.checkout(chargeJSON).subscribe(charge => {
          console.log(charge);
        });
        // Send to invoice page
        this.router.navigateByUrl(`/invoice/${bookingId}`);
      });
    });
    // Remove all flights from cart
    this.flightService.removeAllFlights(this.bookings.total);
  }
}

interface BookingProperties {
  customerId: string;
  rewardCode: string;
  total: number;
  tickets: Array<string>;
  date: Date;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: Number;
  totalMiles: Number;
}
