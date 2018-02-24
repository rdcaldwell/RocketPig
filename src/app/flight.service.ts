import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

@Injectable()
export class FlightService {
  flights: any = [];
  tickets: any = [];
  cart: any = {};
  numberOfItems: number;
  total: number;

  constructor(private http: Http) { }

  getFlights() {
    return this.http.get(`/api/flights`).map(res => res.json());
  }

  getCustomerBookings(id) {
    return this.http.get(`/api/bookings/customer/${id}`).map(res => res.json());
  }

  getFlight(id) {
    return this.http.get(`/api/flight/${id}`).map(res => res.json());
  }

  getBooking(id) {
    return this.http.get(`/api/booking/${id}`).map(res => res.json());
  }

  getTicket(id) {
    return this.http.get(`/api/ticket/${id}`).map(res => res.json());
  }

  postBooking(data) {
    return this.http.post(`/api/booking/new`, data).map(res => res.json());
  }

  postTickets(data) {
    return this.http.post(`/api/tickets/new`, data).map(res => res.json());
  }

  updateCart() {
    this.cart = JSON.parse(localStorage.getItem('cart'));
    if (this.cart == null) {
      this.cart = {};
      this.numberOfItems = 0;
      this.total = 0;
    } else {
      this.numberOfItems = this.cart.ticketData.length;
      this.total = this.cart.bookingData.total;
    }
  }

  checkout(data) {
    return this.http.post(`/api/checkout`, data).map(res => res.json());
  }

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

  removeFlight(index: number, price: number) {
    this.cart.ticketData.splice(index, 1);
    this.cart.bookingData.total -= price;
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.updateCart();
    this.updateFlightsInCart();
  }

  removeAllFlights(price: number) {
    this.cart.ticketData = [];
    this.cart.bookingData.total -= price;
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.updateCart();
    this.updateFlightsInCart();
  }
}
