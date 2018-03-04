import { Component, OnInit, Input } from '@angular/core';
import { FlightService } from '../flight.service';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-flight-package',
  templateUrl: './flight-package.component.html',
  styleUrls: ['./flight-package.component.css']
})
export class FlightPackageComponent implements OnInit {
  @Input() private flights: any;
  @Input() private bookingType: any;
  @Input() private travelClass: any;
  @Input() private fareClass: any;
  flight: any = {};
  ticketData: Array<TicketProperties> = [];
  cart: any = {};
  data: any = [];
  customerId = null;
  airlineCode: string;

  constructor(private flightService: FlightService,
    private authenticationService: AuthenticationService,
    private router: Router) { }

  ngOnInit() {
    if (this.authenticationService.isLoggedIn()) {
      this.customerId = this.authenticationService.getCustomer()._id;
    }

    this.orderByDate();

    this.flight = {
      departure: this.flights[0].departure,
      arrival: this.flights[this.flights.length - 1].arrival,
      departureDate: this.flights[0].departureDate,
      arrivalDate: this.flights[this.flights.length - 1].arrivalDate,
      stops: this.flights.length - 1,
      price: this.getTotal(),
      airline: this.flights[0].airline
    };

    this.setAirlineCodes();

    this.bookingType = this.flightService.searchParameters.bookingType;
    this.travelClass = this.flightService.searchParameters.travelClass;
    this.fareClass = this.flightService.searchParameters.fareClass;

    for (const flight of this.flights) {
      const data = {
        flightId: flight._id,
        travelClass: this.travelClass,
        fareClass: this.fareClass
      };
      this.ticketData.push(data);
    }

    this.data = {
      bookingData: {
        customerId: this.customerId,
        total: this.getTotal(),
        totalMiles: this.getTotalMiles(),
        tickets: []
      },
      ticketData: this.ticketData,
    };
  }

  createBooking() {
    this.cart = JSON.parse(localStorage.getItem('cart'));

    if (this.cart == null) {
      this.cart = this.data;
    } else {
      for (const ticket of this.ticketData) {
        this.cart.ticketData.push(ticket);
      }
      this.cart.bookingData.total += this.getTotal();
      this.cart.bookingData.totalMiles += this.getTotalMiles();
    }
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.flightService.updateCart();
    this.flightService.updateFlightsInCart();
    if (this.bookingType === 'RoundTrip' && !this.flightService.searchParameters.firstBooked) {
      this.flightService.searchParameters.firstBooked = true;
      this.router.navigateByUrl('/flights/return');
    } else {
      this.router.navigateByUrl('/booking');
    }
  }

  getTotal() {
    let total = 0;
    for (const flight of this.flights) {
      total += flight.price;
    }
    return total;
  }

  getTotalMiles() {
    let total = 0;
    for (const flight of this.flights) {
      total += flight.distance;
    }
    return total;
  }

  orderByDate() {
    this.flights.sort((t1, t2) => {
      t1.departureDate = new Date(t1.departureDate);
      t2.departureDate = new Date(t2.departureDate);
      if (Number(t1.departureDate.getTime()) > Number(t2.departureDate.getTime())) {
        return 1;
      }
      if (Number(t1.departureDate.getTime()) < Number(t2.departureDate.getTime())) {
        return -11;
      }
      return 0;
    });
  }

  setAirlineCodes() {
    if (this.flight.airline === 'American Airlines') {
      this.airlineCode = 'aa';
    }
  }
}

interface TicketProperties {
  flightId: string;
  travelClass: string;
  fareClass: string;
}
