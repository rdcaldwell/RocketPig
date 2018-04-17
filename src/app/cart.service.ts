import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { FlightService } from './flight.service';

@Injectable()
export class CartService {

  public flights: any = [];
  public tickets: any = [];
  public games: any = [];
  public cart: any = {};
  public numberOfItems: number;
  public total: number;
  public totalMiles: number;

  constructor(private http: Http, private flightService: FlightService) { }

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
      this.numberOfItems += this.cart.games.length;
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
        this.flightService.getFlight(ticket.flightId).subscribe(flightData => {
          this.tickets.push(ticket);
          this.flights.push(flightData);
        });
      }
    }
  }

  // Update the flights in the cart with current data
  updateGamesInCart() {
    this.games = [];
    if (this.cart.games !== undefined) {
      for (const game of this.cart.games) {
        this.games.push(game);
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
  removeAll(price: number) {
    this.cart.games = [];
    this.cart.ticketData = [];
    this.cart.bookingData.total = 0;
    this.cart.bookingData.totalMiles = 0;
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.updateCart();
    this.updateFlightsInCart();
  }

  removeGame(index: number, price: number) {
    this.cart.games.splice(index, 1);
    this.cart.bookingData.total -= price;
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.updateCart();
    this.updateGamesInCart();
  }

}
