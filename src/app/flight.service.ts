import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

@Injectable()
export class FlightService {
  flights: any = [];
  tickets: any = [];
  cart: any = {};
  numberOfItems: number;
  total: number;
  totalMiles: number;
  availableFlights: any = [];

  searchParameters: SearchProperties = {
    departure: '',
    destination: '',
    travelClass: '',
    fareClass: '',
    bookingType: 'OneWay',
    departDate: new Date(),
    returnDate: new Date(),
    firstBooked: false
  };

  constructor(private http: Http) { }

  // Get flight paths from API
  getFlights() {
    return this.http.post(`/api/flights`, this.searchParameters).map(res => res.json());
  }

  // Get all flights from API
  getAllFlights() {
    return this.http.get(`/api/flights/all`).map(res => res.json());
  }

  // Sets flights for display in application
  setFlights() {
    this.getFlights().subscribe(data => {
      this.availableFlights = data;
    });
  }

  // Get customer bookings from API with customerId
  getCustomerBookings(id) {
    return this.http.get(`/api/bookings/customer/${id}`).map(res => res.json());
  }

  // Get flight from API with id
  getFlight(id) {
    return this.http.get(`/api/flight/${id}`).map(res => res.json());
  }

  // Get booking from API with id
  getBooking(id) {
    return this.http.get(`/api/booking/${id}`).map(res => res.json());
  }

  // Get ticket from API with id
  getTicket(id) {
    return this.http.get(`/api/ticket/${id}`).map(res => res.json());
  }

  // Create booking from data
  postBooking(data) {
    return this.http.post(`/api/booking/new`, data).map(res => res.json());
  }

  // Create tickets from data
  postTickets(data) {
    return this.http.post(`/api/tickets/new`, data).map(res => res.json());
  }

  // Update cart stored in session
  updateCart() {
    this.cart = JSON.parse(localStorage.getItem('cart'));
    if (this.cart == null) {
      this.cart = {};
      this.numberOfItems = 0;
      this.total = 0;
      this.totalMiles = 0;
    } else {
      this.numberOfItems = this.cart.ticketData.length;
      this.total = this.cart.bookingData.total;
      this.totalMiles = this.cart.bookingData.totalMiles;
    }
  }

  // Checkout using Stripe API with purchase data
  checkout(data) {
    return this.http.post(`/api/checkout`, data).map(res => res.json());
  }

  // Checks if reward code is valid from API
  checkRewardCode(data) {
    return this.http.post(`/api/reward-validation`, data).map(res => res.json());
  }

  // Update the flights in the cart with current data
  updateFlightsInCart() {
    this.flights = [];
    this.tickets = [];
    if (this.cart.ticketData !== undefined) {
      for (const ticket of this.cart.ticketData) {
        this.getFlight(ticket.flightId).subscribe(flightData => {
          this.tickets.push(ticket);
          this.flights.push(flightData);
        });
      }
    }
  }

  // Remove single flight from cart
  removeFlight(index: number, price: number, distance: number) {
    this.cart.ticketData.splice(index, 1);
    this.cart.bookingData.total -= price;
    this.cart.bookingData.totalMiles -= distance;
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.updateCart();
    this.updateFlightsInCart();
  }

  // Remove all flights from cart
  removeAllFlights(price: number) {
    this.cart.ticketData = [];
    this.cart.bookingData.total = 0;
    this.cart.bookingData.totalMiles = 0;
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.updateCart();
    this.updateFlightsInCart();
  }
}

interface SearchProperties {
  departure: string;
  destination: string;
  travelClass: string;
  fareClass: string;
  bookingType: string;
  departDate: Date;
  returnDate: Date;
  firstBooked: boolean;
}
