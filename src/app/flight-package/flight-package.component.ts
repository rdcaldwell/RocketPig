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

  // When page is loaded
  ngOnInit() {
    // Sets customer id if user is logged in
    if (this.authenticationService.isLoggedIn()) {
      this.customerId = this.authenticationService.getCustomer()._id;
    }

    // Orders flights by date
    this.orderByDate();

    // Flight data
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

    // Sets options from search parameters
    this.bookingType = this.flightService.searchParameters.bookingType;
    this.travelClass = this.flightService.searchParameters.travelClass;
    this.fareClass = this.flightService.searchParameters.fareClass;

    // Saves ticket data from all flights
    for (const flight of this.flights) {
      const data = {
        flightId: flight._id,
        travelClass: this.travelClass,
        fareClass: this.fareClass
      };
      this.ticketData.push(data);
    }

    // Data object for cart
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

  // Adds items to cart
  addToCart() {
    // Gets cart data from session
    this.cart = JSON.parse(localStorage.getItem('cart'));

    if (this.cart == null) {
      // Creates new cart object from data if null
      this.cart = this.data;
    } else {
      // Adds all ticket data to cart
      for (const ticket of this.ticketData) {
        this.cart.ticketData.push(ticket);
      }
      // Update cart toal
      this.cart.bookingData.total += this.getTotal();
      // Update cart miles
      this.cart.bookingData.totalMiles += this.getTotalMiles();
    }
    // Save cart to session
    localStorage.setItem('cart', JSON.stringify(this.cart));
    // Update cart contents
    this.flightService.updateCart();
    this.flightService.updateFlightsInCart();
    // If the booking is round trip and the departure has not been booked
    if (this.bookingType === 'RoundTrip' && !this.flightService.searchParameters.firstBooked) {
      // Save departure as booked
      this.flightService.searchParameters.firstBooked = true;
      // Navigate to book return page
      this.router.navigateByUrl('/flights/return');
    } else {
      // Navigate to booking checkout page
      this.router.navigateByUrl('/booking');
    }
  }

  // Gets total price of flight package
  getTotal() {
    let total = 0;
    for (const flight of this.flights) {
      total += flight.price;
    }
    return total;
  }

  // Gets total miles of flight package
  getTotalMiles() {
    let total = 0;
    for (const flight of this.flights) {
      total += flight.distance;
    }
    return total;
  }

  // Orders flights in package by date
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

  // Sets airline codes for pictures
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
