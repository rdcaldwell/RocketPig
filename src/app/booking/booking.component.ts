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
  bookings: any = {};
  card: any;
  constructor(public flightService: FlightService,
              private router: Router,
              private authenticationService: AuthenticationService) { }

  ngOnDestroy() {
    this.card.destroy();
  }

  ngAfterViewInit() {
    const style = {
      base: {
        color: '#32325d',
        lineHeight: '18px',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };
    this.card = elements.create('card', {style: style});
    this.card.mount('#card-element');
    this.card.addEventListener('change', function(event) {
      const displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });
  }

  ngOnInit() {
    if (this.authenticationService.isLoggedIn()) {
      this.bookings.customerId = this.authenticationService.getCustomer()._id;
    } else {
      this.bookings.customerId = null;
    }
    this.bookings.total = this.flightService.cart.bookingData.total;
    this.bookings.date = new Date();
    this.flightService.updateCart();
  }

  async createBooking() {
    const { token, error } = await stripe.createToken(this.card);

    this.flightService.postTickets(this.flightService.tickets).subscribe(ticketIds => {
      this.bookings.tickets = ticketIds;
      this.flightService.postBooking(this.bookings).subscribe(bookingId => {
        const chargeJSON = {
          token: token,
          description: `Charge for Booking ID: ${bookingId}`,
          amount: this.bookings.total
        };
        if (error) {
          console.log('Something is wrong:', error);
        } else {
          console.log('Success!', token);
          this.flightService.checkout(chargeJSON).subscribe(charge => {
            console.log(charge);
          });
        }
        this.router.navigateByUrl(`/invoice/${bookingId}`);
      });
    });
    this.flightService.removeAllFlights(this.bookings.total);
  }
}

interface BookingProperties {
  customerId: string;
  total: number;
  tickets: Array<string>;
  date: Date;
}
